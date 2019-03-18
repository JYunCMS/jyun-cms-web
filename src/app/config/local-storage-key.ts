export class LocalStorageKey {

  // 前缀
  private static prefix = 'jyun-cms-';

  // Keys
  static categoryList = LocalStorageKey.prefix + 'category-list';
  static currentLoginUserToken = LocalStorageKey.prefix + 'current-login-user-token';
  static currentLoginUsername = LocalStorageKey.prefix + 'current-login-username';
}
