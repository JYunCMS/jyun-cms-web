import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';
import { BackEndApi } from '../../back-end-api';
import { CategoryService } from '../../service/category.service';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { Category } from '../../domain/category';
import { TagService } from '../../service/tag.service';
import { Tag } from '../../domain/tag';
import { Article } from '../../domain/article';
import { Resource } from '../../domain/resource';
import { ArticleService } from '../../service/article.service';
import { Router } from '@angular/router';
import { ResourceService } from '../../service/resource.service';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css']
})

export class ArticleNewComponent implements OnInit {

  private localStorageKeyForCategoriesResponse = 'jyun-category-list';

  uploadAddress: string = BackEndApi.resources;

  isVisibleForSaveArticle = false;
  isLoadingSaveArticleAsDraft = false;
  isLoadingPushArticle = false;

  // 初始化数据
  categoryNodes: NzTreeNode[] = [];
  tagList: Tag[] = [];

  // 待读取的输入数据
  articleTitle: string = null;
  articleCategoryUrlAlias: string = null;
  articleCategory: Category = null;
  articleTags: string[] = [];
  articleAbstracts = null;
  articleUploadAccessoryList: any[] = [];
  articleContentImageList: Resource[] = [];
  articleImages: Resource[] = [];
  articleAccessories: Resource[] = [];
  articleContent = '请在这里编辑文章正文内容……<br/><br/>注意：除非特殊需要，请不要在这里重复添加标题！';
  articleCheckRelease = false;

  // 配置字段
  tinyMceSettings = {
    skin_url: '/assets/tinymce/skins/ui/oxide',
    content_css: '/assets/tinymce/skins/content/default/content.min.css',
    language: 'zh_CN',
    min_height: 730,
    plugins: [
      'autolink link image paste lists charmap print preview hr anchor pagebreak searchreplace',
      'wordcount visualblocks visualchars code codesample fullscreen insertdatetime media',
      'nonbreaking table directionality emoticons help'
    ],
    toolbar: ['undo redo | styleselect | bold italic underline strikethrough',
      '| alignleft aligncenter alignright alignjustify',
      '| bullist numlist outdent indent | link image media',
      '| forecolor backcolor emoticons | print preview fullscreen'
    ],
    images_upload_handler: (blobInfo, success, failure) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', BackEndApi.resources);
      xhr.onload = () => {
        let json;
        if (xhr.status !== 200) {
          failure('HTTP Error: ' + xhr.status);
          return;
        }
        json = JSON.parse(xhr.responseText);
        if (!json || typeof json.location !== 'string') {
          failure('Invalid JSON: ' + xhr.responseText);
          return;
        }
        success(BackEndApi.hostAddress + '/' + json.location);
        this.articleContentImageList.push(json);
      };
      const formData = new FormData();
      formData.append('file', blobInfo.blob());
      xhr.send(formData);
    },
    paste_data_images: true,
    paste_enable_default_filters: false,
    default_link_target: '_blank',
    emoticons_database_url: '/assets/tinymce/plugins/emoticons/js/emojis.min.js'
  };

  constructor(
    private utilService: UtilService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private articleService: ArticleService,
    private resourceService: ResourceService,
    private nzMsgService: NzMessageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('article', 'new', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.categoryService.getNodes()
      .subscribe(result => {
        this.initCategoryNodes(this.categoryNodes, result);
        localStorage.setItem(this.localStorageKeyForCategoriesResponse, JSON.stringify(result));
      });
    this.tagService.getTags()
      .subscribe(result => this.tagList = result);
  }

  private initCategoryNodes(categoryNodes: NzTreeNode[], categories: Category[]) {
    // 清除当前节点列表
    categoryNodes.splice(0, categoryNodes.length);

    // 先按照节点等级排列成到二维数组待用
    const nodeLevelList: NzTreeNode[][] = [];
    for (let n = 0, currentLevel = 0; n < categories.length; currentLevel++) {
      const tempNodeList: NzTreeNode[] = [];
      categories.forEach((category) => {
        if (category.nodeLevel === currentLevel) {
          tempNodeList.push(new NzTreeNode({
            key: category.urlAlias,
            title: category.title,
            isLeaf: category.beLeaf,
            // 下面属性保存在 origin 中
            nodeLevel: category.nodeLevel,
            parentNodeUrlAlias: category.parentNodeUrlAlias,
            sequence: category.sequence,
            childrenCount: category.childrenCount,
            articleCount: category.articleCount,
            customPage: category.customPage
          }));

          // 处理完一个节点
          n++;
        }
      });

      // 处理完一级节点
      nodeLevelList.push(tempNodeList);
    }

    // 从最低一级节点开始向视图 nodes 对象中灌装
    for (let i = nodeLevelList.length - 1; i >= 0; i--) {
      if (i !== 0) {
        // 向父级节点 addChildren
        nodeLevelList[i].forEach((subNode) => {
          nodeLevelList[i - 1].forEach((parentNode) => {
            if (subNode.origin.parentNodeUrlAlias === parentNode.key) {
              parentNode.addChildren([subNode]);
            }
          });
        });
      } else {
        // 向视图 nodes 对象灌装
        nodeLevelList[i].forEach((rootNode) => {
          categoryNodes.push(rootNode);
        });
      }
    }
  }

  saveArticleAsDraft() {
    this.isLoadingSaveArticleAsDraft = true;
    if (this.checkAndHandleInputFiled()) {
      const article: Article = new Article(null, this.articleTitle, 'testAdmin', this.articleAbstracts, this.articleContent,
        this.articleCategory, this.articleTags, this.articleImages, this.articleAccessories, '草稿', false);
      this.articleService.newArticle(article)
        .subscribe(result => {
          setTimeout(() => {
            this.isLoadingSaveArticleAsDraft = false;
            this.nzMsgService.success('文章【' + result.title + '】上传成功！');
            this.router.navigate(['article', 'all']);
          }, 500);
        });
    }

    this.isVisibleForSaveArticle = false;
  }

  pushArticle() {
    let articleStatus: string = null;
    if (this.articleCheckRelease) {
      // 还要先检查用户角色，是否有直接发布的权限，没有则提示不行
      //////////////////////////////////////////////////////


      articleStatus = '已发布';
    } else {
      articleStatus = '待审核';
    }

    this.isLoadingPushArticle = true;
    if (this.checkAndHandleInputFiled()) {
      const article: Article = new Article(null, this.articleTitle, 'testAdmin', this.articleAbstracts, this.articleContent,
        this.articleCategory, this.articleTags, this.articleImages, this.articleAccessories, articleStatus, false);
      this.articleService.newArticle(article)
        .subscribe(result => {
          setTimeout(() => {
            this.isLoadingPushArticle = false;
            this.nzMsgService.success('文章【' + result.title + '】上传成功！');
            this.router.navigate(['article', 'all']);
          }, 1000);
        });
    }

    this.isVisibleForSaveArticle = false;
  }

  private checkAndHandleInputFiled(): boolean {
    // 向后端提交文章前
    // 1、检查标题是否为空
    if (this.articleTitle == null || this.articleTitle === '') {
      AppComponent.self.warningMessage = '请输入文章标题！';
      this.isLoadingSaveArticleAsDraft = false;
      this.isLoadingPushArticle = false;
      return false;
    }

    // 2、检查分类选项是否为空
    if (this.articleCategoryUrlAlias == null || this.articleCategoryUrlAlias === '') {
      AppComponent.self.warningMessage = '请选择文章所属分类！';
      this.isLoadingSaveArticleAsDraft = false;
      this.isLoadingPushArticle = false;
      return false;
    }

    // 3、检查选择的分类是否是叶子分类
    const categories: Category[] = JSON.parse(localStorage.getItem(this.localStorageKeyForCategoriesResponse));
    for (const category of categories) {
      if (category.urlAlias === this.articleCategoryUrlAlias) {
        if (!category.beLeaf) {
          AppComponent.self.warningMessage = '请选择叶子节点分类目录！';
          this.isLoadingSaveArticleAsDraft = false;
          this.isLoadingPushArticle = false;
          return false;
        } else {
          this.articleCategory = category;
        }
      }
    }

    // 4、装填上传图片列表字段到 this.articleImages
    for (const oneContentImage of this.articleContentImageList) {
      if (this.articleContent.indexOf(oneContentImage.location) >= 0) {
        this.articleImages.push(oneContentImage);
      }
    }

    // 5、装填上传附件列表字段到 this.articleAccessories
    for (const oneUploadResponse of this.articleUploadAccessoryList) {
      this.articleAccessories.push(oneUploadResponse.response);
    }

    return true;
  }

  onCancelPushArticle() {
    this.isVisibleForSaveArticle = false;
    this.articleCheckRelease = false;
  }
}
