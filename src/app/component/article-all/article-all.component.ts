import { Component, OnInit } from '@angular/core';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { Article } from '../../domain/article';
import { ArticleService } from '../../service/article.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BackEndApi } from '../../config/back-end-api';
import { NzMessageService, NzModalService, NzTreeNode } from 'ng-zorro-antd';
import { CategoryService } from '../../service/category.service';
import { TagService } from '../../service/tag.service';
import { Category } from '../../domain/category';
import { Resource } from '../../domain/resource';
import { ArticleFilterConditions } from '../../domain/response/article-filter-conditions';
import { LocalStorageKey } from '../../config/local-storage-key';

@Component({
  selector: 'app-article-all',
  templateUrl: './article-all.component.html',
  styleUrls: ['./article-all.component.css']
})

export class ArticleAllComponent implements OnInit {

  backEndHostAddress: string = BackEndApi.hostAddress;

  isLoadingUpdateArticle = false;
  isVisibleForUpdateStatus = false;

  status: string = null; // 文章状态（全部、已发布、待审核、草稿、回收站）
  selectedDate: string = null; // 文章时间筛选条件
  selectedCategory: string = null; // 文章分类筛选条件
  selectedTag: string = null; // 文章标签筛选条件
  currentBeInRecycleBin = false; // 当前是否在回收站下
  tempOldArticleStatus: string = null; // 暂存文章旧的发布状态，用于恢复

  // 初始化数据
  categoryNodes: NzTreeNode[] = [];
  articleList: Article[] = [];
  articleFilterConditions: ArticleFilterConditions = null;

  // 待用数据
  operatingArticle: Article = new Article(null, null, null, null, null, null, [], [], [], null, null);
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
      xhr.open('POST', BackEndApi.upload);
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
    private siderMenuService: SiderMenuService,
    private articleService: ArticleService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private tagService: TagService,
    private modalService: NzModalService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('article', 'all', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.initArticleListAndSoOn();
  }

  private initArticleListAndSoOn() {
    this.articleService.getArticles()
      .subscribe(result => this.articleList = result);
    this.articleService.getFilterConditions()
      .subscribe(result => {
        this.articleFilterConditions = result;
        this.initCategoryNodes(this.categoryNodes, result.categoryList);
        localStorage.setItem(LocalStorageKey.categoryList, JSON.stringify(result.categoryList));
      });

    this.status = null;
    this.selectedDate = null;
    this.selectedCategory = null;
    this.selectedTag = null;
    this.currentBeInRecycleBin = false;
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
            this.initArticleListAndSoOn();
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
      this.nzMsgService.warning('请输入文章标题');
      this.isLoadingUpdateArticle = false;
      return false;
    }

    // 2、检查分类选项是否为空
    if (this.updateArticleCategoryUrlAlias == null || this.updateArticleCategoryUrlAlias === '') {
      this.nzMsgService.warning('请选择文章所属分类');
      this.isLoadingUpdateArticle = false;
      return false;
    }

    // 3、检查选择的分类是否是叶子分类
    const categories: Category[] = JSON.parse(localStorage.getItem(LocalStorageKey.categoryList));
    for (const category of categories) {
      if (category.urlAlias === this.updateArticleCategoryUrlAlias) {
        if (!category.beLeaf) {
          this.nzMsgService.warning('请选择叶子节点分类目录');
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

  getArticlesByStatus() {
    // 如果点选回收站，则变更标志，以此更新列表操作按钮
    this.currentBeInRecycleBin = this.status === '回收站';

    // 清空日期分类等高级筛选条件选项
    this.selectedDate = null;
    this.selectedCategory = null;
    this.selectedTag = null;

    // 发送请求更新文章列表
    this.articleService.getArticlesByStatus(this.status)
      .subscribe(result => this.articleList = result);
  }

  getArticlesByConditions() {
    this.articleService.getArticlesByConditions(this.status, this.selectedDate, this.selectedCategory, this.selectedTag)
      .subscribe(result => this.articleList = result);
  }

  moveToRecycleBin(article: Article) {
    this.articleService.moveToRecycleBin(true, article)
      .subscribe(() => {
        this.initArticleListAndSoOn();
      });
  }

  restoreFromRecycleBin(article: Article) {
    this.articleService.moveToRecycleBin(false, article)
      .subscribe(() => {
        this.initArticleListAndSoOn();
      });
  }

  deleteArticle(article: Article) {
    this.modalService.confirm({
      nzTitle: '<i><b>严重警告：</b></i>',
      nzContent: '文章【' + article.title + '】将被彻底删除<br/>这个操作不可恢复<br/><br/><b>确认继续吗？</b>',
      nzOnOk: () => {
        this.articleService.deleteArticle(article.id)
          .subscribe(() => {
            this.initArticleListAndSoOn();
          });
      }
    });
  }

  updateStatus() {
    if (this.operatingArticle.status === '已发布' && JSON.parse(localStorage.getItem(LocalStorageKey.currentLoginUser)).role === '撰稿人') {
      // 用户角色为撰稿人，无权发布文章
      this.nzMsgService.error('撰稿人没有发布文章的权限，请选择【待审核】并联系管理员处理！');
      return;
    }

    if (this.operatingArticle.status === this.tempOldArticleStatus) {
      // 并没有选择新的文章状态
      this.isVisibleForUpdateStatus = false;
      return;
    }

    this.articleService.updateArticle(this.operatingArticle)
      .subscribe(() => {
        this.isVisibleForUpdateStatus = false;
        this.articleService.getFilterConditions()
          .subscribe(result => this.articleFilterConditions = result);
      });
  }

  updateStatusShow(article: Article) {
    this.isVisibleForUpdateStatus = true;
    this.operatingArticle = article;
    this.tempOldArticleStatus = article.status;
  }

  updateStatusClose() {
    this.isVisibleForUpdateStatus = false;
    this.operatingArticle.status = this.tempOldArticleStatus;
  }
}
