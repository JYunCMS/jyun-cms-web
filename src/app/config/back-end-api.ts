export class BackEndApi {

  // Back End Host Address
  static hostAddress = 'http://localhost:8080';

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
}
