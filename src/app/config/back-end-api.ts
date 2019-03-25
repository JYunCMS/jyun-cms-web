export class BackEndApi {

  // Back End Host Address
  static hostAddress = 'http://localhost:8080'; // 不要写末尾的 “/”

  // RESTful API (/hello)
  static hello = BackEndApi.hostAddress + '/hello';

  // RESTful API (/upload)
  static upload = BackEndApi.hostAddress + '/upload';

  // RESTful API (/categories/*)
  static categories = BackEndApi.hostAddress + '/categories';
  static categoriesCategory = BackEndApi.categories + '/category?';
  static categoriesCount = BackEndApi.categories + '/count?';
  static categoriesMoveUpNode = BackEndApi.categories + '/move-up-node?';
  static categoriesMoveDownNode = BackEndApi.categories + '/move-down-node?';

  // RESTful API (/tags/*)
  static tags = BackEndApi.hostAddress + '/tags';

  // RESTful API (/resources/*)
  static resources = BackEndApi.hostAddress + '/resources';
  static resourcesFilterConditions = BackEndApi.resources + '/filter-conditions';
  static resourcesByConditions = BackEndApi.resources + '/by-conditions';

  // RESTful API (/articles/*)
  static articles = BackEndApi.hostAddress + '/articles';
  static articlesFilterConditions = BackEndApi.articles + '/filter-conditions';
  static articlesByStatus = BackEndApi.articles + '/by-status';
  static articlesByConditions = BackEndApi.articles + '/by-conditions';
  static articlesMoveToRecycleBin = BackEndApi.articles + '/move-to-recycle-bin';

  // RESTful API (/users/*)
  static users = BackEndApi.hostAddress + '/users';
  static usersLogin = BackEndApi.users + '/login';
  static usersSelfInfo = BackEndApi.users + '/self-info';
  static usersSelfPassword = BackEndApi.users + '/self-password';
  static usersResetPassword = BackEndApi.users + '/reset-password';

  // RESTful API (/options/*)
  static options = BackEndApi.hostAddress + '/options';
  static optionsSiteTitle = BackEndApi.options + '/site-title';
  static optionsCopyrightInfo = BackEndApi.options + '/copyright-info';
  static optionsWebsiteFilingInfo = BackEndApi.options + '/website-filing-info';
  static optionsHomeCarouselImages = BackEndApi.options + '/home-carousel-images';
  static optionsFriendlyLinks = BackEndApi.options + '/friendly-links';
}
