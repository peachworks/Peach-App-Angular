describe('Service: Item Locations', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeItemLocationsServiceTestsMockedData = {
    item_locations_response : {
      count: 2,
      results: [
        {
          "starting_cost": null,
          "last_cost": null,
          "opening_count_date": null,
          "is_hot_count": true,
          "id": 1,
          "created_by": 44,
          "created_at": "2015-01-21T13:34:44.138Z",
          "updated_by": 44,
          "updated_at": "2015-03-16T13:51:54.367Z",
          "location_id": 9,
          "inv_item_id": 722
        }, {
          "starting_cost": null,
          "last_cost": null,
          "opening_count_date": null,
          "is_hot_count": true,
          "id": 2,
          "created_by": 44,
          "created_at": "2015-01-23T16:52:21.417Z",
          "updated_by": 44,
          "updated_at": "2015-05-11T13:08:25.430Z",
          "location_id": 9,
          "inv_item_id": 754
        }
      ]
    },
    settings: {
      item_locations        : {
        key           : 'wtm_inv_item_locs',
        default_data  : {
          inv_item_id       : null,
          last_cost         : null,
          opening_count_date: null,
          is_hot_count      : false,
          starting_cost     : null,
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
          return cakeItemLocationsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeItemLocationsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeItemLocationsServiceTestsMockedData.item_locations_response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeSettings', {
        getSettings: function(settingKey) {
          var deferred = $q.defer();
          deferred.resolve(cakeItemLocationsServiceTestsMockedData[settingKey]);
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
    service = $injector.get('ItemLocations');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Item Locations service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeSettings).to.exist;

      expect(service.itemLocations).to.deep.equal([]);
      expect(service.itemLocationsById).to.deep.equal({});

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

    it('bulkCreateItemLocations should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"starting_cost": null, "last_cost": null, "opening_count_date": null, "location_id": 1, "inv_item_id": 1},
        {"starting_cost": null, "last_cost": null, "opening_count_date": null, "location_id": 1, "inv_item_id": 2}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateItemLocations should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateItemLocations should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {"starting_cost": null, "last_cost": null, "opening_count_date": null, "location_id": 1, "inv_item_id": 1},
        {"starting_cost": null, "last_cost": null, "opening_count_date": null, "location_id": 1, "inv_item_id": 2}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteItemLocations should use given data to remove entries from db using api bulk request - api success scenario with array of data given', function() {

      var testData = [1, 2];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemLocations should use given data to remove entries from db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemLocations should use given data to remove entries from db using api bulk request - api error scenario', function() {

      var testData = [1, 2];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkUpdateItemLocations should use given data to update entries in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"id": 1, "starting_cost": 5},
        {"id": 2, "starting_cost": 10}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItemLocations should use given data to update entries in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItemLocations should use given data to update entries in db using api bulk request - api error scenario', function() {

      var testData = [
        {"id": 1, "starting_cost": 5},
        {"id": 2, "starting_cost": 10}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getItemLocation should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.itemLocations = cakeItemLocationsServiceTestsMockedData.item_locations_response.results;
      service.itemLocationsById = _.object(_.pluck(cakeItemLocationsServiceTestsMockedData.item_locations_response.results, 'id'), cakeItemLocationsServiceTestsMockedData.item_locations_response.results);

      expect(service.getItemLocation()).to.deep.equal(service.itemLocations);
      expect(service.getItemLocation(2)).to.deep.equal(service.itemLocations[1]);

    });

    it('getItemLocations should return all cached entries array', function() {

      service.itemLocations = cakeItemLocationsServiceTestsMockedData.item_locations_response.results;

      expect(service.getItemLocations()).to.deep.equal(service.itemLocations);

    });

    it('getItemLocationsCollection should return all cached entries collection', function() {

       service.itemLocationsById = _.object(_.pluck(cakeItemLocationsServiceTestsMockedData.item_locations_response.results, 'id'), cakeItemLocationsServiceTestsMockedData.item_locations_response.results);

      expect(service.getItemLocationsCollection()).to.deep.equal(service.itemLocationsById);

    });

    it('loadItemLocations should use api to load data according to params - scenario with api success, cache enabled and empty find params (should load only item locations from active locations)', function() {

      var testFindParams = null;
      var testOtherParams = {test2: 'test2'};
      var parsedFindParams = {location_id: _.pluck(cakeItemLocationsServiceTestsMockedData.active_locations, 'id')};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadItemLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, parsedFindParams, testOtherParams)).to.equal(true);
      expect(service.itemLocations).to.deep.equal(cakeItemLocationsServiceTestsMockedData.item_locations_response.results);
      expect(_.keys(service.itemLocationsById).length).to.equal(service.itemLocations.length);
      expect(result).to.deep.equal(cakeItemLocationsServiceTestsMockedData.item_locations_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItemLocations should use api to load data according to params - scenario with api success, cache disabled and find params set', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadItemLocations(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.itemLocations).to.deep.equal([]);
      expect(service.itemLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeItemLocationsServiceTestsMockedData.item_locations_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItemLocations should use api to load data according to params - scenario with api error', function() {

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
      service.loadItemLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.itemLocations).to.deep.equal([]);
      expect(service.itemLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateItemLocation should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, starting_cost: 10, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('item_locations')
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

      service.updateItemLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateItemLocation should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, starting_cost: 10, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('item_locations')
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

      service.updateItemLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});