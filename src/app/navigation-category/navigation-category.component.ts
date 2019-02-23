import { Component, OnInit } from '@angular/core';
import { NzTreeNode } from "ng-zorro-antd";

@Component({
  selector: 'app-navigation-category',
  templateUrl: './navigation-category.component.html',
  styleUrls: ['./navigation-category.component.css']
})

export class NavigationCategoryComponent implements OnInit {

  nodes: NzTreeNode[] = [];

  inputNodeTitle: string;
  inputParentNodeKey: string;

  constructor() {
  }

  ngOnInit() {
    this.nodes[0] = new NzTreeNode({
      title: '0-0',
      key: '00'
    });
    const node0 = new NzTreeNode({
      title: '0-0-0',
      key: '000'
    });
    const node1 = new NzTreeNode({
      title: '0-0-1',
      key: '001'
    });
    const node2 = new NzTreeNode({
      title: '0-0-2',
      key: '002'
    });
    this.nodes[0].addChildren([node0, node1, node2]);

    this.nodes[1] = new NzTreeNode({
      title: '0-1',
      key: '01'
    });
    const node3 = new NzTreeNode({
      title: '0-0-3',
      key: '003'
    });
    const node4 = new NzTreeNode({
      title: '0-0-4',
      key: '004'
    });
    const node5 = new NzTreeNode({
      title: '0-0-5',
      key: '005'
    });
    this.nodes[1].addChildren([node3, node4, node5]);
  }

  addNewNode(): void {
    console.log(this.inputNodeTitle);
    console.log(this.inputParentNodeKey);
    if (this.inputParentNodeKey != null) {
      // 非根节点
      const node: NzTreeNode = this.findNodeByKey(this.nodes, this.inputParentNodeKey);
      node.addChildren([new NzTreeNode({title: this.inputNodeTitle, key: 'abc'})]);
    } else {
      // 根节点
      this.nodes[this.nodes.length] = new NzTreeNode({title: this.inputNodeTitle, key: 'abc'});
    }
  }

  moveUpNode(node: NzTreeNode): void {
    if (node.getParentNode() !== null) {
      // 非根节点
      const currentLevelNodes: NzTreeNode[] = node.getParentNode().getChildren();
      const nodePoint: number = currentLevelNodes.indexOf(node);
      if (nodePoint !== 0) {
        // 向上移动
        currentLevelNodes[nodePoint] = currentLevelNodes[nodePoint - 1];
        currentLevelNodes[nodePoint - 1] = node;
      }
    } else {
      // 根节点
      const nodePoint: number = this.nodes.indexOf(node);
      if (nodePoint !== 0) {
        // 向上移动
        this.nodes[nodePoint] = this.nodes[nodePoint - 1];
        this.nodes[nodePoint - 1] = node;
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
        currentLevelNodes[nodePoint] = currentLevelNodes[nodePoint + 1];
        currentLevelNodes[nodePoint + 1] = node;
      }
    } else {
      // 根节点
      const nodePoint: number = this.nodes.indexOf(node);
      if (nodePoint !== this.nodes.length - 1) {
        // 向下移动
        this.nodes[nodePoint] = this.nodes[nodePoint + 1];
        this.nodes[nodePoint + 1] = node;
      }
    }
  }

  editNode(node: NzTreeNode): void {
    node.title = 'dddd';
  }

  deleteNode(node: NzTreeNode): void {
    if (node.getParentNode() !== null) {
      // 非根节点
      const currentLevelNodes: NzTreeNode[] = node.getParentNode().getChildren();
      const nodePoint: number = currentLevelNodes.indexOf(node);
      currentLevelNodes.splice(nodePoint, 1);
    } else {
      // 根节点
      const nodePoint: number = this.nodes.indexOf(node);
      this.nodes.splice(nodePoint, 1);
    }
  }

  /**
   * 根据 key 查找对应 NzTreeNode 节点（暂时支持 10 级查找）
   * @param nodes
   * @param key
   */
  private findNodeByKey(nodes: NzTreeNode[], key: string): NzTreeNode {
    let result = null;
    // 遍历第 1 层
    nodes.forEach(function (tempNode) {
      if (tempNode.key === key) {
        result = tempNode;
      }
    });
    // 遍历第 2 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        if (tempNode.key === key) {
          result = tempNode;
        }
      });
    });
    // 遍历第 3 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          if (tempNode.key === key) {
            result = tempNode;
          }
        });
      });
    });
    // 遍历第 4 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            if (tempNode.key === key) {
              result = tempNode;
            }
          });
        });
      });
    });
    // 遍历第 5 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            tempNode.children.forEach(function (tempNode) {
              if (tempNode.key === key) {
                result = tempNode;
              }
            });
          });
        });
      });
    });
    // 遍历第 6 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            tempNode.children.forEach(function (tempNode) {
              tempNode.children.forEach(function (tempNode) {
                if (tempNode.key === key) {
                  result = tempNode;
                }
              });
            });
          });
        });
      });
    });
    // 遍历第 7 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            tempNode.children.forEach(function (tempNode) {
              tempNode.children.forEach(function (tempNode) {
                tempNode.children.forEach(function (tempNode) {
                  if (tempNode.key === key) {
                    result = tempNode;
                  }
                });
              });
            });
          });
        });
      });
    });
    // 遍历第 8 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            tempNode.children.forEach(function (tempNode) {
              tempNode.children.forEach(function (tempNode) {
                tempNode.children.forEach(function (tempNode) {
                  tempNode.children.forEach(function (tempNode) {
                    if (tempNode.key === key) {
                      result = tempNode;
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
    // 遍历第 9 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            tempNode.children.forEach(function (tempNode) {
              tempNode.children.forEach(function (tempNode) {
                tempNode.children.forEach(function (tempNode) {
                  tempNode.children.forEach(function (tempNode) {
                    tempNode.children.forEach(function (tempNode) {
                      if (tempNode.key === key) {
                        result = tempNode;
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    // 遍历第 10 层
    nodes.forEach(function (tempNode) {
      tempNode.children.forEach(function (tempNode) {
        tempNode.children.forEach(function (tempNode) {
          tempNode.children.forEach(function (tempNode) {
            tempNode.children.forEach(function (tempNode) {
              tempNode.children.forEach(function (tempNode) {
                tempNode.children.forEach(function (tempNode) {
                  tempNode.children.forEach(function (tempNode) {
                    tempNode.children.forEach(function (tempNode) {
                      tempNode.children.forEach(function (tempNode) {
                        if (tempNode.key === key) {
                          result = tempNode;
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    return result;
  }
}
