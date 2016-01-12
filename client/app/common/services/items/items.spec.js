describe('Service: Items', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeItemsServiceTestsMockedData = {
    response : {
      count: 2,
      results: [
        {
          common_unit_cost: "0.00000",
          common_unit_id: 15,
          count_group_id: 57,
          created_at: "2015-06-04T02:49:17.933Z",
          created_by: 44,
          description: "",
          gl_account_id: 16,
          id: 1,
          is_active: true,
          item_db_id: 1049,
          name: "Anderson's Conn Valley Chard",
          refuse_pct: "0.00000",
          report_unit_cost: "0.00000",
          sales_item_id: null,
          total_recipes: null,
          updated_at: "2015-11-18T17:11:00.764Z",
          updated_by: 44
        },
        {
          common_unit_cost: "0.00000",
          common_unit_id: 15,
          count_group_id: 57,
          created_at: "2015-06-04T02:49:17.933Z",
          created_by: 44,
          description: "",
          gl_account_id: 16,
          id: 2,
          is_active: true,
          item_db_id: 1049,
          name: "Anderson's Conn Valley Chard 2",
          refuse_pct: "0.00000",
          report_unit_cost: "0.00000",
          sales_item_id: null,
          total_recipes: null,
          updated_at: "2015-11-18T17:11:00.764Z",
          updated_by: 44
        }
      ]
    },
    settings: {
      items                 : {
        key           : 'wtm_inv_items',
        default_data  : {
          name              : '',
          description       : '',
          common_unit_id    : null,
          item_db_id        : null,
          count_group_id    : null,
          gl_account_id     : null,
          is_active         : false,
          sales_item_id     : null,
          common_unit_cost  : 0
        }
      },
      recipe_items          : {
        key           : 'wtm_recipe_items',
        default_data  : {}
      }
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon, cakeCountItems, cakeEventItems;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('cakeCommon', {
        getObjectKey: function(key) {
          return cakeItemsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeItemsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();
          deferred.resolve(cakeItemsServiceTestsMockedData.response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeCountItems', {
        loadCountItems: function() {}
      });

      $provide.value('cakeEventItems', {
        loadEventItems: function() {}
      });

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    cakeCountItems = $injector.get('cakeCountItems');
    cakeEventItems = $injector.get('cakeEventItems');
    service = $injector.get('Items');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Items service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeCountItems).to.exist;
      expect(service.cakeEventItems).to.exist;

      expect(service.items).to.deep.equal([]);
      expect(service.itemsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('bulkUpdateItems should use given data to update entries in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"id": 1, "name": "test1"},
        {"id": 2, "name": "test2"}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceUpdateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItems should use given data to update entries in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceUpdateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItems should use given data to update entries in db using api bulk request - api error scenario', function() {

      var testData = [
        {"id": 1, "name": "test1"},
        {"id": 2, "name": "test2"}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceUpdateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('canItemBeDeleted should use helper services to check if there arent any related entries - there are some count items entries scenario', function() {

      var testId = 1;
      var testCountItemsResponse = {results: [{id: 1}]};
      var testEventItemsResponse = {results: []};
      var testRecipeItemsResponse = {results: []};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testCountItemsResponse);
      var mockCountItems = sandbox.mock(service.cakeCountItems);
      var countItemsGetExpectation = mockCountItems.expects('loadCountItems').returns(deferred.promise);

      var deferred2 = $q.defer();
          deferred2.resolve(testEventItemsResponse);
      var mockEventItems = sandbox.mock(service.cakeEventItems);
      var eventItemsGetExpectation = mockEventItems.expects('loadEventItems').returns(deferred2.promise);

      var deferred3 = $q.defer();
          deferred3.resolve(testRecipeItemsResponse);
      var mockRecipeItems = sandbox.mock({find: function(){ return; }});
      var recipeItemsGetExpectation = mockRecipeItems.expects('find').returns(deferred3.promise);

      var mockRecipeResource = sandbox.mock(service.$peach);
      var recipeResourceConstructorExpectation = mockRecipeResource.expects('api').returns(mockRecipeItems);

      service.canItemBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(countItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(eventItemsGetExpectation.never().verify()).to.equal(true);
      expect(recipeItemsGetExpectation.never().verify()).to.equal(true);
      expect(result).to.equal(testCountItemsResponse.results.length > 0 ? false : true);

    });

    it('canItemBeDeleted should use helper services to check if there arent any related entries - there are some recipe items entries scenario', function() {

      var testId = 1;
      var testCountItemsResponse = {results: []};
      var testEventItemsResponse = {results: []};
      var testRecipeItemsResponse = {results: [{id: 1}]};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testCountItemsResponse);
      var mockCountItems = sandbox.mock(service.cakeCountItems);
      var countItemsGetExpectation = mockCountItems.expects('loadCountItems').returns(deferred.promise);

      var deferred2 = $q.defer();
          deferred2.resolve(testEventItemsResponse);
      var mockEventItems = sandbox.mock(service.cakeEventItems);
      var eventItemsGetExpectation = mockEventItems.expects('loadEventItems').returns(deferred2.promise);

      var deferred3 = $q.defer();
          deferred3.resolve(testRecipeItemsResponse);
      var mockRecipeItems = sandbox.mock({find: function(){ return; }});
      var recipeItemsGetExpectation = mockRecipeItems.expects('find').returns(deferred3.promise);

      var mockRecipeResource = sandbox.mock(service.$peach);
      var recipeResourceConstructorExpectation = mockRecipeResource.expects('api').returns(mockRecipeItems.object);

      service.canItemBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(countItemsGetExpectation.never().verify()).to.equal(true);
      expect(eventItemsGetExpectation.never().verify()).to.equal(true);
      expect(recipeItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(result).to.equal(testRecipeItemsResponse.results.length > 0 ? false : true);

    });

    it('canItemBeDeleted should use helper services to check if there arent any related entries - there are some event items entries scenario', function() {

      var testId = 1;
      var testCountItemsResponse = {results: []};
      var testEventItemsResponse = {results: [{id: 1}]};
      var testRecipeItemsResponse = {results: []};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testCountItemsResponse);
      var mockCountItems = sandbox.mock(service.cakeCountItems);
      var countItemsGetExpectation = mockCountItems.expects('loadCountItems').returns(deferred.promise);

      var deferred2 = $q.defer();
          deferred2.resolve(testEventItemsResponse);
      var mockEventItems = sandbox.mock(service.cakeEventItems);
      var eventItemsGetExpectation = mockEventItems.expects('loadEventItems').returns(deferred2.promise);

      var deferred3 = $q.defer();
          deferred3.resolve(testRecipeItemsResponse);
      var mockRecipeItems = sandbox.mock({find: function(){ return; }});
      var recipeItemsGetExpectation = mockRecipeItems.expects('find').returns(deferred3.promise);

      var mockRecipeResource = sandbox.mock(service.$peach);
      var recipeResourceConstructorExpectation = mockRecipeResource.expects('api').returns(mockRecipeItems.object);

      service.canItemBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(countItemsGetExpectation.never().verify()).to.equal(true);
      expect(eventItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(recipeItemsGetExpectation.never().verify()).to.equal(true);
      expect(result).to.equal(testEventItemsResponse.results.length > 0 ? false : true);

    });

    it('canItemBeDeleted should use helper services to check if there arent any related entries - there are no related entries scenario', function() {

      var testId = 1;
      var testCountItemsResponse = {results: []};
      var testEventItemsResponse = {results: []};
      var testRecipeItemsResponse = {results: []};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testCountItemsResponse);
      var mockCountItems = sandbox.mock(service.cakeCountItems);
      var countItemsGetExpectation = mockCountItems.expects('loadCountItems').returns(deferred.promise);

      var deferred2 = $q.defer();
          deferred2.resolve(testEventItemsResponse);
      var mockEventItems = sandbox.mock(service.cakeEventItems);
      var eventItemsGetExpectation = mockEventItems.expects('loadEventItems').returns(deferred2.promise);

      var deferred3 = $q.defer();
          deferred3.resolve(testRecipeItemsResponse);
      var mockRecipeItems = sandbox.mock({find: function(){ return; }});
      var recipeItemsGetExpectation = mockRecipeItems.expects('find').returns(deferred3.promise);

      var mockRecipeResource = sandbox.mock(service.$peach);
      var recipeResourceConstructorExpectation = mockRecipeResource.expects('api').returns(mockRecipeItems.object);

      service.canItemBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(countItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(eventItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(recipeItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(result).to.equal((testCountItemsResponse.results.length > 0 || testRecipeItemsResponse.results.length > 0 || testEventItemsResponse.results.length > 0) ? false : true);

    });

    it('canItemBeDeleted should use helper services to check if there arent any related entries - api error scenario', function() {

      var testId = 1;
      var testCountItemsResponse = {results: []};
      var testEventItemsResponse = {results: []};
      var testRecipeItemsResponse = {results: []};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testCountItemsResponse);
      var mockCountItems = sandbox.mock(service.cakeCountItems);
      var countItemsGetExpectation = mockCountItems.expects('loadCountItems').returns(deferred.promise);

      var deferred2 = $q.defer();
          deferred2.reject(testError);
      var mockEventItems = sandbox.mock(service.cakeEventItems);
      var eventItemsGetExpectation = mockEventItems.expects('loadEventItems').returns(deferred2.promise);

      var deferred3 = $q.defer();
          deferred3.resolve(testRecipeItemsResponse);
      var mockRecipeItems = sandbox.mock({find: function(){ return; }});
      var recipeItemsGetExpectation = mockRecipeItems.expects('find').returns(deferred3.promise);

      var mockRecipeResource = sandbox.mock(service.$peach);
      var recipeResourceConstructorExpectation = mockRecipeResource.expects('api').returns(mockRecipeItems.object);

      service.canItemBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(countItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(eventItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(recipeItemsGetExpectation.withExactArgs({inv_item_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);

    });

    it('canItemCommonUnitBeChanged should return result of canItemBeDeleted function - because its exacty the same conditions here', function() {

      var testId = 1;

      var testCountItemsResponse = {results: []};
      var testEventItemsResponse = {results: []};
      var testRecipeItemsResponse = {results: []};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testCountItemsResponse);
      var mockCountItems = sandbox.mock(service.cakeCountItems);
      var countItemsGetExpectation = mockCountItems.expects('loadCountItems').returns(deferred.promise);

      var deferred2 = $q.defer();
          deferred2.reject(testError);
      var mockEventItems = sandbox.mock(service.cakeEventItems);
      var eventItemsGetExpectation = mockEventItems.expects('loadEventItems').returns(deferred2.promise);

      var deferred3 = $q.defer();
          deferred3.resolve(testRecipeItemsResponse);
      var mockRecipeItems = sandbox.mock({find: function(){ return; }});
      var recipeItemsGetExpectation = mockRecipeItems.expects('find').returns(deferred3.promise);

      var mockRecipeResource = sandbox.mock(service.$peach);
      var recipeResourceConstructorExpectation = mockRecipeResource.expects('api').returns(mockRecipeItems.object);

      var spyCakeCanItemBeDeleted = sandbox.spy(service, 'canItemBeDeleted');

      service.canItemCommonUnitBeChanged(testId);

      expect(spyCakeCanItemBeDeleted.calledWithExactly(testId)).to.equal(true);

    });

    it('createItem should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        name              : 'Test',
        description       : null,
        common_unit_id    : 1,
        item_db_id        : null,
        count_group_id    : 1,
        gl_account_id     : 1,
        is_active         : true
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('items'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed, {extended: true}).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createItem should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        name              : 'Test',
        description       : null,
        common_unit_id    : 1,
        item_db_id        : null,
        count_group_id    : 1,
        gl_account_id     : 1,
        is_active         : true
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('items'),
        testData
      );
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed, {extended: true}).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getItem should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.items = cakeItemsServiceTestsMockedData.response.results;
      service.itemsById = _.object(_.pluck(cakeItemsServiceTestsMockedData.response.results, 'id'), cakeItemsServiceTestsMockedData.response.results);

      expect(service.getItem()).to.deep.equal(service.items);
      expect(service.getItem(2)).to.deep.equal(service.items[1]);

    });

    it('getItems should return all cached entries array', function() {

      service.items = cakeItemsServiceTestsMockedData.response.results;

      expect(service.getItems()).to.deep.equal(service.items);

    });

    it('getItemsCollection should return all cached entries collection', function() {

      service.itemsById = _.object(_.pluck(cakeItemsServiceTestsMockedData.response.results, 'id'), cakeItemsServiceTestsMockedData.response.results);

      expect(service.getItemsCollection()).to.deep.equal(service.itemsById);

    });

    it('loadItems should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.items).to.deep.equal(cakeItemsServiceTestsMockedData.response.results);
      expect(_.keys(service.itemsById).length).to.equal(service.items.length);
      expect(result).to.deep.equal(cakeItemsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItems should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadItems(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.items).to.deep.equal([]);
      expect(service.itemsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeItemsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItems should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.items).to.deep.equal([]);
      expect(service.itemsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeItem should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeItem should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateItem should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, name: 'test2', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('items')
          )
        ),
        {id: testData.id}
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.updateItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed, {extended: true}).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateItem should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, name: 'test2', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('items')
          )
        ),
        {id: testData.id}
      );
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.updateItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed, {extended: true}).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});