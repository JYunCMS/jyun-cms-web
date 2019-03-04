import { BaseEntity } from "./-base-entity";

export class Resource extends BaseEntity {
  filePath: string;
  originalFilename: string;
  storageFilename: string;
  fileType: string;
  fileSize: string;
  referenceCount: number;
}
