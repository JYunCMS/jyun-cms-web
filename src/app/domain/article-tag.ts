export class ArticleTag {
  id: number;
  articleId: number;
  tagName: string;

  constructor(articleId: number, tagName: string) {
    this.articleId = articleId;
    this.tagName = tagName;
  }
}
