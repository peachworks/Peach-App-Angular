describe('Service: Count Items', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeCountItemsServiceTestsMockedData = {
    count_items_response : {
      count: 3,
      results: [{
      "common_unit_quantity": "14.00000",
      "quantity": "14.00000",
      "details_json": null,
      "id": 1,
      "created_by": 44,
      "created_at": "2015-11-20T14:17:38.791Z",
      "updated_by": null,
      "updated_at": "2015-11-20T14:17:38.791Z",
      "location_id": 1,
      "inv_item_id": 1070,
      "inv_item_unit_id": 3130,
      "common_unit_id": 15,
      "inv_count_id": 87
    }, {
      "common_unit_quantity": "0.03448",
      "quantity": "1.00000",
      "details_json": null,
      "id": 2,
      "created_by": 44,
      "created_at": "2015-10-08T21:24:38.155Z",
      "updated_by": 44,
      "updated_at": "2015-11-16T12:59:09.785Z",
      "location_id": 1,
      "inv_item_id": 1428,
      "inv_item_unit_id": 4075,
      "common_unit_id": 15,
      "inv_count_id": 87
    }, {
      "common_unit_quantity": "0.00000",
      "quantity": "0.00000",
      "details_json": null,
      "id": 3,
      "created_by": 44,
      "created_at": "2015-10-29T15:52:15.100Z",
      "updated_by": null,
      "updated_at": "2015-10-29T15:52:15.100Z",
      "location_id": 1,
      "inv_item_id": 1523,
      "inv_item_unit_id": 4315,
      "common_unit_id": 1,
      "inv_count_id": 87
    }]
    },
    settings: {
      count_items           : {
        key           : 'wtm_inv_count_items',
        default_data  : {
          inv_count_id      : null,
          inv_item_id       : null,
          inv_item_unit_id  : null,
          common_unit_id    : null,
          quantity          : null,
          common_unit_quantity : null,
          details_json      : null,
          location_id       : null
        }
      }
    },
    active_locations: [
      {
        address1: null,
        address2: null,
        city: null,
        country_id: 227,
        created_at: "2013-11-11T15:33:33.187Z",
        created_by: 44,
        id: 1,
        is_deleted: false,
        name: "Andrei204 NYC",
        number: null,
        org_group_id: null,
        phone: null,
        state_id: 3487,
        tags: null,
        timezone: "America/New_York",
        updated_at: "2015-05-15T19:04:11.105Z",
        updated_by: 138,
        zip: null,
        wtm_inv_loc: {
          copied_from: null,
          created_at: "2015-10-08T14:43:58.042Z",
          created_by: 44,
          id: 10,
          is_copied: true,
          location_id: 7,
          updated_at: "2015-10-08T14:43:58.042Z",
          updated_by: null
        }
      }
    ]
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon, cakeSettings;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('cakeCommon', {
        getObjectKey: function(key) {
          return cakeCountItemsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeCountItemsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeCountItemsServiceTestsMockedData.count_items_response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeSettings', {
        getSettings: function(settingKey) {
          var deferred = $q.defer();
          deferred.resolve(cakeCountItemsServiceTestsMockedData[settingKey]);
          return deferred.promise;
        }
      })

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    cakeSettings = $injector.get('cakeSettings');
    service = $injector.get('CountItems');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Count Items service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeSettings).to.exist;

      expect(service.countItems).to.deep.equal([]);
      expect(service.countItemsById).to.deep.equal({});

    });

  });

  describe('Activate function', function() {

    it('activate should preload active locations', function() {

      var spyCakeSettings = sandbox.spy(service.cakeSettings, 'getSettings');

      service.activate();

      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);

    });

  });

  describe('Functions', function() {

    it('bulkCreateCountItems should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {inv_count_id: 1, inv_item_id: 1, inv_item_unit_id: 1, common_unit_id: 1, quantity: 5, common_unit_quantity: 5, location_id: 1},
        {inv_count_id: 1, inv_item_id: 1, inv_item_unit_id: 2, common_unit_id: 1, quantity: 10, common_unit_quantity: 10, location_id: 1},
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateCountItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateCountItems should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateCountItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateCountItems should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {inv_count_id: 1, inv_item_id: 1, inv_item_unit_id: 1, common_unit_id: 1, quantity: 5, common_unit_quantity: 5, location_id: 1},
        {inv_count_id: 1, inv_item_id: 1, inv_item_unit_id: 2, common_unit_id: 1, quantity: 10, common_unit_quantity: 10, location_id: 1},
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateCountItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('createCountItem should use given data to create entry in db using api - api success scenario', function() {

      var testData = {inv_count_id: 1, inv_item_id: 1, inv_item_unit_id: 1, common_unit_id: 1, quantity: 5, common_unit_quantity: 5, location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('count_items'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createCountItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createCountItem should use given data to create entry in db using api - api error scenario', function() {

      var testData = {inv_count_id: 1, inv_item_id: 1, inv_item_unit_id: 1, common_unit_id: 1, quantity: 5, common_unit_quantity: 5, location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('count_items'),
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

      service.createCountItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getCountItem should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.countItems = cakeCountItemsServiceTestsMockedData.count_items_response.results;
      service.countItemsById = _.object(_.pluck(cakeCountItemsServiceTestsMockedData.count_items_response.results, 'id'), cakeCountItemsServiceTestsMockedData.count_items_response.results);

      expect(service.getCountItem()).to.deep.equal(service.countItems);
      expect(service.getCountItem(2)).to.deep.equal(service.countItems[1]);

    });

    it('getCountItems should return all cached entries array', function() {

      service.countItems = cakeCountItemsServiceTestsMockedData.count_items_response.results;

      expect(service.getCountItems()).to.deep.equal(service.countItems);

    });

    it('getCountItemsCollection should return all cached entries collection', function() {

       service.countItemsById = _.object(_.pluck(cakeCountItemsServiceTestsMockedData.count_items_response.results, 'id'), cakeCountItemsServiceTestsMockedData.count_items_response.results);

      expect(service.getCountItemsCollection()).to.deep.equal(service.countItemsById);

    });

    it('loadCountItems should use api to load data according to params - scenario with api success, cache enabled and empty find params (should load only count items from active locations)', function() {

      var testFindParams = null;
      var testOtherParams = {test2: 'test2'};
      var parsedFindParams = {location_id: _.pluck(cakeCountItemsServiceTestsMockedData.active_locations, 'id')};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadCountItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, parsedFindParams, testOtherParams)).to.equal(true);
      expect(service.countItems).to.deep.equal(cakeCountItemsServiceTestsMockedData.count_items_response.results);
      expect(_.keys(service.countItemsById).length).to.equal(service.countItems.length);
      expect(result).to.deep.equal(cakeCountItemsServiceTestsMockedData.count_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCountItems should use api to load data according to params - scenario with api success, cache disabled and find params set', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadCountItems(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.countItems).to.deep.equal([]);
      expect(service.countItemsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeCountItemsServiceTestsMockedData.count_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCountItems should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadCountItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.countItems).to.deep.equal([]);
      expect(service.countItemsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeCountItem should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeCountItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeCountItem should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeCountItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateCountItem should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, quantity: 15, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('count_items')
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

      service.updateCountItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateCountItem should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, quantity: 15, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('count_items')
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

      service.updateCountItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});