export class BackEndApi {

  // Back End Host Address
  private static hostAddress = 'http://localhost:8080';

  // RESTful API (categories/*)
  static categories = BackEndApi.hostAddress + '/categories';
  static categoriesCategoryById = BackEndApi.categories + '/categoryById?';
  static categoriesCountByLevelAndParentUrlAlias = BackEndApi.categories + '/countByLevelAndParentUrlAlias?';
  static categoriesMoveUpNode = BackEndApi.categories + '/moveUpNode?';
  static categoriesMoveDownNode = BackEndApi.categories + '/moveDownNode?';

  // RESTful API (tags/*)
  static tags = BackEndApi.hostAddress + '/tags';

  // RESTful API (resources/*)
  static resources = BackEndApi.hostAddress + '/resources';
}
