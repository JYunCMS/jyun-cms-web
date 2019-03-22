import { BaseEntity } from './-base-entity';
import { Resource } from './resource';

export class Category extends BaseEntity {
  urlAlias: string;
  title: string;
  beLeaf: boolean;
  nodeLevel: number;
  parentNodeUrlAlias: string;
  sequence: number;
  childrenCount: number;
  articleCount: number;
  customPage: string;
  customPageImages: Resource[];

  constructor(urlAlias: string, title: string, beLeaf: boolean, nodeLevel: number, parentNodeUrlAlias: string, sequence: number,
              childrenCount: number, articleCount: number, customPage: string, customPageImages: Resource[]) {
    super();
    this.urlAlias = urlAlias;
    this.title = title;
    this.beLeaf = beLeaf;
    this.nodeLevel = nodeLevel;
    this.parentNodeUrlAlias = parentNodeUrlAlias;
    this.sequence = sequence;
    this.childrenCount = childrenCount;
    this.articleCount = articleCount;
    this.customPage = customPage;
    this.customPageImages = customPageImages;
  }
}
