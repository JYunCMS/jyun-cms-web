export class UserRoleFields {

  static SUPER_ADMIN = '超级管理员';
  static ORDINARY_ADMIN = '普通管理员';
  static COPYWRITER = '撰稿人';

  static roleList: string[] = [
    UserRoleFields.SUPER_ADMIN,
    UserRoleFields.ORDINARY_ADMIN,
    UserRoleFields.COPYWRITER
  ];
}
