import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';
import { Article } from '../../domain/article';
import { ArticleService } from '../../service/article.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BackEndApi } from '../../back-end-api';
import { NzMessageService, NzModalService, NzTreeNode } from 'ng-zorro-antd';
import { Tag } from '../../domain/tag';
import { CategoryService } from '../../service/category.service';
import { TagService } from '../../service/tag.service';
import { Category } from '../../domain/category';
import { Resource } from '../../domain/resource';

@Component({
  selector: 'app-article-all',
  templateUrl: './article-all.component.html',
  styleUrls: ['./article-all.component.css']
})

export class ArticleAllComponent implements OnInit {

  private localStorageKeyForCategoriesResponse = 'jyun-category-list';

  backEndHostAddress: string = BackEndApi.hostAddress;

  isLoadingUpdateArticle = false;

  scope: string; // 文章显示范围（全部、已发布……）
  date: number; // 文章时间筛选条件
  category: string; // 文章分类筛选条件
  tag: string; // 文章标签筛选条件

  // 初始化数据
  categoryNodes: NzTreeNode[] = [];
  tagList: Tag[] = [];
  articleList: Article[] = [];

  // 待用数据
  operatingArticle: Article = new Article(null, null, null, null, null, null, null, null, null, null, null);
  updateArticleCategoryUrlAlias: string = null;
  articleContentNewImageList: Resource[] = [];
  htmlArticleContent: any;
  previewVisible = false;
  editArticleOptionVisible = false;
  editArticleContentVisible = false;

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
        this.articleContentNewImageList.push(json);
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
    private articleService: ArticleService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private tagService: TagService,
    private modalService: NzModalService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('article', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.articleService.getArticles()
      .subscribe(result => this.articleList = result);
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

  previewArticle(article: Article) {
    this.previewVisible = true;
    this.operatingArticle = article;
    this.htmlArticleContent = this.sanitizer.bypassSecurityTrustHtml(this.operatingArticle.content);
  }

  previewArticleClose(): void {
    this.previewVisible = false;
  }

  editArticleOptions(article: Article) {
    this.editArticleOptionVisible = true;
    this.operatingArticle = new Article(article.id, article.title, article.authorId, article.abstracts,
      article.content, article.category, article.tags, article.images, article.accessories, article.status, article.beDelete);
    this.operatingArticle.createdAt = article.createdAt;
    this.operatingArticle.updatedAt = article.updatedAt;

    this.updateArticleCategoryUrlAlias = this.operatingArticle.category.urlAlias;
    this.articleContentNewImageList = [];
    this.operatingArticle.images = [];
  }

  editArticleOptionClose() {
    this.modalService.confirm({
      nzTitle: '<i><b>离开编辑页面？</b></i>',
      nzContent: '修改的内容将不被保存<br/><br/><b>确认继续吗？</b>',
      nzOnOk: () => {
        this.editArticleOptionVisible = false;
      }
    });
  }

  editArticleContent() {
    this.editArticleContentVisible = true;
  }

  editArticleContentClose() {
    this.editArticleContentVisible = false;
  }

  updateArticle() {
    this.isLoadingUpdateArticle = true;
    if (this.checkAndHandleInputFiled()) {
      this.articleService.updateArticle(this.operatingArticle)
        .subscribe(result => {
          setTimeout(() => {
            this.isLoadingUpdateArticle = false;
            this.editArticleOptionVisible = false;
            this.nzMsgService.success('文章【' + result.title + '】更新成功！');
            this.ngOnInit();
          }, 500);
        });
    } else {
      this.isLoadingUpdateArticle = false;
    }
  }

  private checkAndHandleInputFiled(): boolean {
    // 向后端提交文章前
    // 1、检查标题是否为空
    if (this.operatingArticle.title == null || this.operatingArticle.title === '') {
      AppComponent.self.warningMessage = '请输入文章标题！';
      this.isLoadingUpdateArticle = false;
      return false;
    }

    // 2、检查分类选项是否为空
    if (this.updateArticleCategoryUrlAlias == null || this.updateArticleCategoryUrlAlias === '') {
      AppComponent.self.warningMessage = '请选择文章所属分类！';
      this.isLoadingUpdateArticle = false;
      return false;
    }

    // 3、检查选择的分类是否是叶子分类
    const categories: Category[] = JSON.parse(localStorage.getItem(this.localStorageKeyForCategoriesResponse));
    for (const category of categories) {
      if (category.urlAlias === this.updateArticleCategoryUrlAlias) {
        if (!category.beLeaf) {
          AppComponent.self.warningMessage = '请选择叶子节点分类目录！';
          this.isLoadingUpdateArticle = false;
          return false;
        } else {
          this.operatingArticle.category = category;
        }
      }
    }

    // 4、装填上传图片列表字段
    for (const oneContentImage of this.articleContentNewImageList) {
      if (this.operatingArticle.content.indexOf(oneContentImage.location) >= 0) {
        this.operatingArticle.images.push(oneContentImage);
      }
    }

    return true;
  }

  deleteArticle(article: Article) {

  }
}
