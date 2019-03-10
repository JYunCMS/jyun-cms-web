import { Category } from '../category';
import { Tag } from '../tag';

export class ArticleFilterConditions {
  dateList: string[];
  categoryList: Category[];
  tagList: Tag[];
  allExcludeRecycleBinCount: number;
  releaseCount: number;
  pendingReviewCount: number;
  draftCount: number;
  recycleBinCount: number;
}
