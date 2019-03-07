import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';
import { EventObj } from '@tinymce/tinymce-angular/editor/Events';
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
import { ArticleTag } from '../../domain/article-tag';

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
  articleTags: string[] = null;
  articleAbstracts: string = null;
  articleUploadAccessoryList: any[] = null;
  articleResources: Resource[] = null;
  articleContent: string = null;
  articleCheckRelease = false;

  // 配置字段
  tinyMceSettings = {
    skin_url: '/assets/tinymce/skins/ui/oxide',
    content_css: '/assets/tinymce/skins/content/default/content.min.css',
    language: 'zh_CN',
    image_upload_url: BackEndApi.resources,
    emoticons_database_url: '/assets/tinymce/plugins/emoticons/js/emojis.min.js',
    min_height: 730,
    placeholder: '在这里编辑文章正文内容……（注意：除非特殊需要，请不要在这里手动添加标题）',
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table directionality emoticons template paste'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify' +
      ' | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | print preview fullscreen'
  };

  constructor(
    private utilService: UtilService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private articleService: ArticleService,
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
        this.articleCategory, this.articleTags, this.articleResources, '草稿', false);
      this.articleService.newArticle(article)
        .subscribe(result => {
          this.updateAfterSaveArticleOfOtherData(result);
          setTimeout(() => {
            this.isLoadingSaveArticleAsDraft = false;
            this.nzMsgService.success('文章【' + this.articleTitle + '】上传成功！');
            this.router.navigate(['article', 'all']);
          }, 1000);
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
  }

  private checkAndHandleInputFiled(): boolean {
    // 检查标题是否为空
    if (this.articleTitle == null || this.articleTitle === '') {
      AppComponent.self.warningMessage = '请输入文章标题！';
      this.isLoadingSaveArticleAsDraft = false;
      this.isLoadingPushArticle = false;
      return false;
    }

    // 检查分类选项是否为空
    if (this.articleCategoryUrlAlias == null || this.articleCategoryUrlAlias === '') {
      AppComponent.self.warningMessage = '请选择文章所属分类！';
      this.isLoadingSaveArticleAsDraft = false;
      this.isLoadingPushArticle = false;
      return false;
    }

    // 检查选择的分类是否是叶子分类
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

    // 装填上传附件列表字段
    if (this.articleUploadAccessoryList != null) {
      this.articleResources = [];
      for (const oneUploadResponse of this.articleUploadAccessoryList) {
        this.articleResources.push(oneUploadResponse.response);
      }
    }

    return true;
  }

  private updateAfterSaveArticleOfOtherData(article: Article) {
    // 文章保存成功后……
    // 1、更新 Category 表 articleCount 字段
    this.articleCategory.articleCount = this.articleCategory.articleCount + 1;
    this.categoryService.updateNode(this.articleCategory)
      .subscribe(result => console.log('Category 更新完成'));

    // 2、更新 Tag 表 articleCount 字段，并添加 文章-标签 绑定到 ArticleTag 表
    if (this.articleTags !== null && this.articleTags.length !== 0) {
      for (const tag of this.tagList) {
        const index = this.articleTags.indexOf(tag.name);
        if (index >= 0) {
          // 已存在的标签，更新 articleCount
          tag.articleCount = tag.articleCount + 1;
          this.tagService.updateTag(tag)
            .subscribe(result => console.log('更新了已存在的标签：' + result));
          // 添加 文章-标签 绑定到 ArticleTag 表
          this.tagService.addArticleBind(new ArticleTag(article.id, tag.name))
            .subscribe(result => console.log('已添加文章-标签绑定' + result));
          // 清掉变量 this.articleTags 中处理过的值
          this.articleTags.splice(index, 1);
        }
      }
      // 选择的标签，处理剩下的中，如果有不存在的新标签加入
      if (this.articleTags.length !== 0) {
        for (const tagName of this.articleTags) {
          // 向 Tag 表添加新标签
          this.tagService.addNewTag(new Tag(tagName, 1))
            .subscribe(result => console.log('添加了新标签' + result));
          // 添加 文章-标签 绑定到 ArticleTag 表
          this.tagService.addArticleBind(new ArticleTag(article.id, tagName))
            .subscribe(result => console.log('已添加文章-标签绑定' + result));
        }
      }
    }

    // 3、更新 Resource 表 referenceCount 字段


  }

  onCancelPushArticle() {
    this.isVisibleForSaveArticle = false;
    this.articleCheckRelease = false;
  }
}
