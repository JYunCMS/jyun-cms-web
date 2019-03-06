import { BaseEntity } from './-base-entity';
import { Category } from './category';
import { Resource } from './resource';

export class Article extends BaseEntity {
  id: number;
  title: string;
  authorId: string;
  abstracts: string;
  content: string;
  category: Category;
  tags: string[];
  resources: Resource[];
  status: string;
  beDelete: boolean;

  constructor(id: number, title: string, authorId: string, abstracts: string,
              content: string, category: Category, tags: string[],
              resources: Resource[], status: string, beDelete: boolean) {
    super();
    this.id = id;
    this.title = title;
    this.authorId = authorId;
    this.abstracts = abstracts;
    this.content = content;
    this.category = category;
    this.tags = tags;
    this.resources = resources;
    this.status = status;
    this.beDelete = beDelete;
  }
}
