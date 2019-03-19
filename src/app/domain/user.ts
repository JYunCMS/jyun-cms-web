import { BaseEntity } from './-base-entity';

export class User extends BaseEntity {
  username: string;
  password: string;
  nickname: string;
  role: string;

  constructor(username: string, password: string, nickname: string, role: string) {
    super();
    this.username = username;
    this.password = password;
    this.nickname = nickname;
    this.role = role;
  }
}
