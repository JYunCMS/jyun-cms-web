import { BaseEntity } from './-base-entity';

export class User extends BaseEntity {
  username: string;
  password: string;
  nickname: string;
  role: string;
}
