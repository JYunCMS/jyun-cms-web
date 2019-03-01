import { BaseEntity } from "./-base-entity";

export class Tag extends BaseEntity {
  name: string;
  articleCount: number;

  constructor(name: string, articleCount: number) {
    super();
    this.name = name;
    this.articleCount = articleCount;
  }
}
