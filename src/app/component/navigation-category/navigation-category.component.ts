import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, NzTreeNode } from 'ng-zorro-antd';
import { SiderMenuService } from '../../util/sider-menu.service';
import { AppComponent } from '../app.component';
import { Category } from '../../domain/category';
import { CategoryService } from '../../service/category.service';
import { BackEndApi } from '../../config/back-end-api';
import { Resource } from '../../domain/resource';

@Component({
  selector: 'app-navigation-category',
  templateUrl: './navigation-category.component.html',
  styleUrls: ['./navigation-category.component.css']
})

export class NavigationCategoryComponent implements OnInit {

  nodes: NzTreeNode[] = [];

  title = '';
  urlAlias = '';
  parentNodeUrlAlias = '';

  updateCategoryVisible = false;
  isLoadingCleanCustomPage = false;
  isLoadingUpdateCategory = false;

  operatingUrlAlias: string = null;
  operatingTitle: string = null;
  operatingCustomPage: string = null;
  articleContentNewImageList: Resource[] = [];

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
    private categoryService: CategoryService,
    private modalService: NzModalService,
    private nzMsgService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.siderMenuService.initLeftSiderStatus('navigation', 'category', AppComponent.self.openMap, AppComponent.self.selectMap);
    this.categoryService.getNodes()
      .subscribe(result => this.initNodes(this.nodes, result));
  }

  private initNodes(nodes: NzTreeNode[], categories: Category[]) {
    // 清除当前节点列表
    nodes.splice(0, nodes.length);

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
          nodes.push(rootNode);
        });
      }
    }
  }

  addNewNode(): void {
    if (this.title == null || this.title === '') {
      this.nzMsgService.warning('【分类名称】不能为空！');
      return;
    }
    if (this.urlAlias == null || this.urlAlias === '') {
      this.nzMsgService.warning('【分类 URL 别名】不能为空！');
      return;
    }

    const category: Category = new Category(this.urlAlias, this.title, true, 0, this.parentNodeUrlAlias, null, 0, 0, null, []);

    // 添加的节点是否为根节点
    if (this.parentNodeUrlAlias !== undefined && this.parentNodeUrlAlias !== null) {
      // 如果添加的是非根节点
      // 先更新父节点为非叶子节点 beLeaf = false
      const parentCategory: Category = new Category(this.parentNodeUrlAlias, null, false, null, null, null, null, null, null, []);
      this.categoryService.updateNode(parentCategory)
        .subscribe(result => {
          if (result !== null) {
            this.initNodes(this.nodes, result);
          }
        });

      // 确定当前添加节点层级 nodeLevel
      this.categoryService.getCategory(this.parentNodeUrlAlias)
        .subscribe(parentNode => {
          category.nodeLevel = parentNode.nodeLevel + 1;

          // 确定当前添加节点排序 sequence
          this.categoryService.getCount(parentNode.nodeLevel + 1, parentNode.urlAlias)
            .subscribe(currentLevelCount => {
              category.sequence = currentLevelCount + 1;

              // 添加节点
              this.categoryService.addNode(category)
                .subscribe(() => {
                  // 更新父节点的子节点计数 childrenCount++
                  const parentCategory2: Category = new Category(parentNode.urlAlias, null, null, null, null, null,
                    parentNode.childrenCount + 1, null, null, []);
                  this.categoryService.updateNode(parentCategory2)
                    .subscribe(result => this.handleAddNode(result));
                });

              // 欲添加的节点，是否是该层级第一个节点
              if (currentLevelCount === 0) {
                // 是该层级第一个节点，判断其父节点分类是否有文章
                if (parentNode.articleCount !== 0) {
                  // 其父节点分类下有文章
                  // 提示用户将其父级节点分类的文章转移到该子节点分类下
                  AppComponent.self.warningMessage = '父节点【' + parentNode.title +
                    '】分类下存在文章，它已经不是叶子节点！请到文章管理页将其分类设置为新的叶子节点分类，否则在某些模板下这些文章可能不会显示在列表中';
                }
              }
            });
        });
    } else {
      // 否则添加的是根节点
      category.parentNodeUrlAlias = '';

      // 确定当前添加节点排序 sequence
      this.categoryService.getCount(0, '')
        .subscribe(result => {
          category.sequence = result + 1;

          // 添加节点
          this.categoryService.addNode(category)
            .subscribe(categories => this.handleAddNode(categories));
        });
    }
  }

  private handleAddNode(categories: Category[]) {
    if (categories != null) {
      this.initNodes(this.nodes, categories);
      this.urlAlias = null;
      this.title = null;
      this.parentNodeUrlAlias = null;
    }
  }

  updateNode(): void {
    const category: Category = new Category(this.operatingUrlAlias, this.operatingTitle, null, null, null, null,
      null, null, this.operatingCustomPage, this.articleContentNewImageList);
    this.categoryService.updateNode(category)
      .subscribe(result => {
        if (result !== null) {
          this.initNodes(this.nodes, result);
          this.updateCategoryVisible = false;
        }
      });
  }

  cleanCustomPage() {
    this.operatingCustomPage = '';
    this.operatingTitle = null;
    this.updateNode();
  }

  showUpdateNode(node: NzTreeNode) {
    this.operatingUrlAlias = node.key;
    this.operatingTitle = node.title;
    this.operatingCustomPage = node.origin.customPage;

    this.updateCategoryVisible = true;
  }

  closeUpdateNode() {
    this.modalService.confirm({
      nzTitle: '<i><b>离开编辑页面？</b></i>',
      nzContent: '修改的内容将不被保存<br/><br/><b>确认继续吗？</b>',
      nzOnOk: () => {
        this.updateCategoryVisible = false;

        this.operatingUrlAlias = null;
        this.operatingTitle = null;
        this.operatingCustomPage = null;
        this.articleContentNewImageList = [];
      }
    });
  }

  deleteNode(node: NzTreeNode): void {
    this.categoryService.deleteNode(node.key)
      .subscribe(categories => this.initNodes(this.nodes, categories));
  }

  showDeleteConfirm(node: NzTreeNode): void {
    if (node.isLeaf) {
      // 警告：该分类下创建的自定义页面将被删除，文章将被移动到回收站，确认继续吗？
      this.modalService.confirm({
        nzTitle: '<i><b>警告：</b></i>',
        nzContent: '该分类下创建的自定义页面将被删除，文章将被移动到回收站<br/><br/><b>确认继续吗？</b>',
        nzOnOk: () => this.deleteNode(node)
      });
    } else {
      // 严重警告：该分类及其所有子分类下创建的自定义页面将被删除，文章将被移动到回收站，确认继续吗？
      this.modalService.confirm({
        nzTitle: '<i><b>严重警告：</b></i>',
        nzContent: '该分类及其所有子分类下创建的自定义页面都将被删除，文章将被移动到回收站<br/><br/><b>确认继续吗？</b>',
        nzOnOk: () => this.deleteNode(node)
      });
    }
  }

  moveUpNode(node: NzTreeNode): void {
    if (node.getParentNode() !== null) {
      // 非根节点
      const currentLevelNodes: NzTreeNode[] = node.getParentNode().getChildren();
      const nodePoint: number = currentLevelNodes.indexOf(node);
      if (nodePoint !== 0) {
        // 向上移动
        this.categoryService.moveUpNode(node.key)
          .subscribe(result => this.initNodes(this.nodes, result));
      }
    } else {
      // 根节点
      const nodePoint: number = this.nodes.indexOf(node);
      if (nodePoint !== 0) {
        // 向上移动
        this.categoryService.moveUpNode(node.key)
          .subscribe(result => this.initNodes(this.nodes, result));
      }
    }
  }

  moveDownNode(node: NzTreeNode): void {
    if (node.getParentNode() !== null) {
      // 非根节点
      const currentLevelNodes: NzTreeNode[] = node.getParentNode().getChildren();
      const nodePoint: number = currentLevelNodes.indexOf(node);
      if (nodePoint !== currentLevelNodes.length - 1) {
        // 向下移动
        this.categoryService.moveDownNode(node.key)
          .subscribe(result => this.initNodes(this.nodes, result));
      }
    } else {
      // 根节点
      const nodePoint: number = this.nodes.indexOf(node);
      if (nodePoint !== this.nodes.length - 1) {
        // 向下移动
        this.categoryService.moveDownNode(node.key)
          .subscribe(result => this.initNodes(this.nodes, result));
      }
    }
  }
}
