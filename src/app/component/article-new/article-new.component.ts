import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../common/util.service';
import { AppComponent } from '../app.component';
import { EventObj } from '@tinymce/tinymce-angular/editor/Events';
import { BackEndApi } from '../../back-end-api';
import { CategoryService } from '../../service/category.service';
import { NzTreeNode } from 'ng-zorro-antd';
import { Category } from '../../domain/category';
import { TagService } from '../../service/tag.service';
import { Tag } from '../../domain/tag';
import { Article } from '../../domain/article';
import { Resource } from '../../domain/resource';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css']
})

export class ArticleNewComponent implements OnInit {

  uploadAddress: string = BackEndApi.resources;
  isVisibleForSaveArticle = false;

  // 初始化数据
  categoryNodes: NzTreeNode[] = [];
  tagList: Tag[] = [];

  // 待读取的输入数据
  articleTitle: string = null;
  articleCategoryUrlAlias: string = null;
  articleCategory: Category = null;
  articleTags: string[] = null;
  articleAbstracts: string = null;
  articleUploadList: any[] = null;
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
    min_height: 700,
    placeholder: '在这里编辑文章正文内容……（注意：除非特殊需要，请不要在这里手动添加标题）',
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table directionality emoticons template paste'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify' +
      ' | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | print preview fullscreen'
  };

  constructor(
    private utilService: UtilService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) {
  }

  ngOnInit() {
    this.utilService.initLeftSiderStatus('article', 'new', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.categoryService.getNodes()
      .subscribe(result => this.initCategoryNodes(this.categoryNodes, result));
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
    if (this.checkAndHandleInputFiled()) {
      const article: Article = new Article(null, this.articleTitle, 'admin', this.articleAbstracts, this.articleContent,
        this.articleCategory, this.articleTags, this.articleResources, '草稿', false);
      console.log(article);

      // 文章保存成功后，更新：分类、标签、资源 相关表
      ////////////////////////////////////////////


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
      return false;
    }

    if (this.articleCategoryUrlAlias == null || this.articleCategoryUrlAlias === '') {
      AppComponent.self.warningMessage = '请选择文章所属分类！';
      return false;
    }

    // 检查选择的分类是否是叶子分类
    // this.categoryService.getCategory(this.articleCategoryUrlAlias)
    //   .subscribe(result => {
    //     if (!result.beLeaf) {
    //       AppComponent.self.warningMessage = '请选择叶子节点分类目录！';
    //       return false;
    //     } else {
    //       // 装填所选分类数据
    //       this.articleCategory = result;
    //
    //       // 装填上传资源列表字段
    //       if (this.articleUploadList != null) {
    //         this.articleUploadList.forEach((oneUploadResponse) => {
    //           this.articleResources.push(oneUploadResponse.response);
    //         });
    //       }
    //
    //       return true;
    //     }
    //   });

    return true;
  }

  onCancelPushArticle() {
    this.isVisibleForSaveArticle = false;
    this.articleCheckRelease = false;
  }

  onArticleContentChange($event: EventObj<any>) {
    console.log(this.articleContent);
  }
}
