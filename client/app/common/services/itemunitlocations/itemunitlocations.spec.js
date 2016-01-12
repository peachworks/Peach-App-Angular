describe('Service: Item Unit Locations', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeItemUnitLocationsServiceTestsMockedData = {
    response : {
      count: 2,
      results: [
        {
          created_at: "2015-10-16T15:27:11.685Z",
          created_by: 44,
          id: 1,
          inv_item_id: 1056,
          inv_item_unit_id: 4110,
          is_count_unit: true,
          is_order_unit: true,
          is_report_unit: false,
          is_transfer_unit: false,
          is_waste_unit: false,
          location_id: 1,
          updated_at: "2015-10-16T15:27:11.685Z",
          updated_by: null
        },
        {
          created_at: "2015-10-16T15:27:11.685Z",
          created_by: 44,
          id: 2,
          inv_item_id: 1056,
          inv_item_unit_id: 4111,
          is_count_unit: true,
          is_order_unit: true,
          is_report_unit: false,
          is_transfer_unit: false,
          is_waste_unit: false,
          location_id: 1,
          updated_at: "2015-10-16T15:27:11.685Z",
          updated_by: null
        }
      ]
    },
    settings: {
      item_unit_locations   : {
        key           : 'wtm_inv_item_unit_locs',
        default_data  : {
          inv_item_id       : null,
          inv_item_unit_id  : null,
          is_order_unit     : false,
          is_count_unit     : false,
          is_transfer_unit  : false,
          is_waste_unit     : false,
          is_report_unit    : false,
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
          id: 1,
          is_copied: true,
          location_id: 1,
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
          return cakeItemUnitLocationsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeItemUnitLocationsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeItemUnitLocationsServiceTestsMockedData.response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeSettings', {
        getSettings: function(settingKey) {
          var deferred = $q.defer();
          deferred.resolve(cakeItemUnitLocationsServiceTestsMockedData[settingKey]);
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
    service = $injector.get('ItemUnitLocations');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Item Unit Locations service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeSettings).to.exist;

      expect(service.itemUnitLocations).to.deep.equal([]);
      expect(service.itemUnitLocationsById).to.deep.equal({});

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

    it('bulkCreateItemUnitLocations should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {inv_item_id: 1, inv_item_unit_id: 1, is_order_unit: false, is_count_unit: true, is_transfer_unit: false, is_waste_unit: false, is_report_unit: false, location_id: 1},
        {inv_item_id: 1, inv_item_unit_id: 2, is_order_unit: false, is_count_unit: true, is_transfer_unit: false, is_waste_unit: false, is_report_unit: false, location_id: 1}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateItemUnitLocations should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateItemUnitLocations should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {inv_item_id: 1, inv_item_unit_id: 1, is_order_unit: false, is_count_unit: true, is_transfer_unit: false, is_waste_unit: false, is_report_unit: false, location_id: 1},
        {inv_item_id: 1, inv_item_unit_id: 2, is_order_unit: false, is_count_unit: true, is_transfer_unit: false, is_waste_unit: false, is_report_unit: false, location_id: 1}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - api success scenario with array of data given', function() {

      var testData = [1, 2];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - api error scenario with array of data given', function() {

      var testData = [1, 2];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - api success scenario with collection of data given (find params)', function() {

      var testData = {
        find: {is_count_unit: true},
        location_ids: [1]
      };
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({success: 1});
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('findAndRemove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.withExactArgs(testData.find, {location_ids: testData.location_ids}).verify()).to.equal(true);
      expect(result).to.deep.equal({success: 1});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - api success scenario with collection of data given (empty find params)', function() {

      var testData = {
        find: {},
        location_ids: [1]
      };
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({success: 0});
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('findAndRemove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({success: 0});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - error scenario with incorrect collection of data given (find params)', function() {

      var testData = {};
      var testError = {message: "Bulk DELETE with find wuery requires find object and location_ids array in input collection object"};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({success: 0});
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('findAndRemove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteItemUnitLocations should use given data to remove entries from db using api bulk request - api error scenario with collection of data given (find params)', function() {

      var testData = {
        find: {is_count_unit: true},
        location_ids: [1]
      };
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceDeleteExpectation = mockResource.expects('findAndRemove').returns(deferred.promise);

      service.bulkDeleteItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceDeleteExpectation.withExactArgs(testData.find, {location_ids: testData.location_ids}).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkUpdateItemUnitLocations should use given data to update entries in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"id": 1, "is_count_unit": false},
        {"id": 2, "is_count_unit": false}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceUpdateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItemUnitLocations should use given data to update entries in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceUpdateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItemUnitLocations should use given data to update entries in db using api bulk request - api error scenario', function() {

      var testData = testData = [
        {"id": 1, "is_count_unit": false},
        {"id": 2, "is_count_unit": false}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemUnitLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceUpdateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getItemUnitLocation should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.itemUnitLocations = cakeItemUnitLocationsServiceTestsMockedData.response.results;
      service.itemUnitLocationsById = _.object(_.pluck(cakeItemUnitLocationsServiceTestsMockedData.response.results, 'id'), cakeItemUnitLocationsServiceTestsMockedData.response.results);

      expect(service.getItemUnitLocation()).to.deep.equal(service.itemUnitLocations);
      expect(service.getItemUnitLocation(2)).to.deep.equal(service.itemUnitLocations[1]);

    });

    it('getItemUnitLocations should return all cached entries array', function() {

      service.itemUnitLocations = cakeItemUnitLocationsServiceTestsMockedData.response.results;

      expect(service.getItemUnitLocations()).to.deep.equal(service.itemUnitLocations);

    });

    it('getItemUnitLocationsCollection should return all cached entries collection', function() {

       service.itemUnitLocationsById = _.object(_.pluck(cakeItemUnitLocationsServiceTestsMockedData.response.results, 'id'), cakeItemUnitLocationsServiceTestsMockedData.response.results);

      expect(service.getItemUnitLocationsCollection()).to.deep.equal(service.itemUnitLocationsById);

    });

    it('loadItemUnitLocations should use api to load data according to params - scenario with api success, cache enabled and empty find params (should load only item unit locations from active locations)', function() {

      var testFindParams = null;
      var testOtherParams = {test2: 'test2'};
      var parsedFindParams = {location_id: _.pluck(cakeItemUnitLocationsServiceTestsMockedData.active_locations, 'id')};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadItemUnitLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, parsedFindParams, testOtherParams)).to.equal(true);
      expect(service.itemUnitLocations).to.deep.equal(cakeItemUnitLocationsServiceTestsMockedData.response.results);
      expect(_.keys(service.itemUnitLocationsById).length).to.equal(service.itemUnitLocations.length);
      expect(result).to.deep.equal(cakeItemUnitLocationsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItemUnitLocations should use api to load data according to params - scenario with api success, cache disabled and find params set', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadItemUnitLocations(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.itemUnitLocations).to.deep.equal([]);
      expect(service.itemUnitLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeItemUnitLocationsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItemUnitLocations should use api to load data according to params - scenario with api error', function() {

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
      service.loadItemUnitLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.itemUnitLocations).to.deep.equal([]);
      expect(service.itemUnitLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateItemUnitLocation should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, is_count_unit: false, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('item_unit_locations')
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

      service.updateItemUnitLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_unit_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateItemUnitLocation should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, is_count_unit: false, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('item_unit_locations')
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

      service.updateItemUnitLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_unit_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});