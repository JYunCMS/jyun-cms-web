import { BaseEntity } from "./-base-entity";

export class Category extends BaseEntity {
  urlAlias: string;
  title: string;
  level: number;
  isLeaf: boolean;
  parentNodeUrlAlias: string;
  count: number;
  customPage: string;

  constructor(urlAlias: string, title: string, level: number, isLeaf: boolean, parentNodeUrlAlias: string, count: number, customPage: string) {
    super();
    this.urlAlias = urlAlias;
    this.title = title;
    this.level = level;
    this.isLeaf = isLeaf;
    this.parentNodeUrlAlias = parentNodeUrlAlias;
    this.count = count;
    this.customPage = customPage;
  }
}
