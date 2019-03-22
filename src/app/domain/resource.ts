import { BaseEntity } from './-base-entity';

export class Resource extends BaseEntity {
  location: string;
  originalFilename: string;
  storageFilename: string;
  fileType: string;
  fileSize: string;
  beReference: boolean;
}
