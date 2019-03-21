export class LocalStorageKey {

  // 前缀
  private static prefix = 'jyun-cms-';

  // Keys
  static alreadyInitSystem = LocalStorageKey.prefix + 'already-init-system';

  static currentLoginUserToken = LocalStorageKey.prefix + 'current-login-user-token';
  static currentLoginUser = LocalStorageKey.prefix + 'current-login-user';
  static currentLoginUsername = LocalStorageKey.prefix + 'current-login-username';

  static categoryList = LocalStorageKey.prefix + 'category-list';
}
