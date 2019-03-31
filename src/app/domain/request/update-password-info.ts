import { User } from '../user';

export class UpdatePasswordInfo {

  oldPassword: string;
  user: User;

  constructor(oldPassword: string, user: User) {
    this.oldPassword = oldPassword;
    this.user = user;
  }
}
