describe('Service: Vendor Locations', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeVendorLocationsServiceTestsMockedData = {
    vendor_locations_response : {
      count: 2,
      results: [
        {
          "customer_number": "",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-12-04T14:09:41.279Z",
          "updated_by": 44,
          "updated_at": "2015-12-04T14:10:07.145Z",
          "location_id": 1,
          "vendor_id": 1
        }, {
          "customer_number": "",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-10-16T16:06:25.554Z",
          "updated_by": 44,
          "updated_at": "2015-12-04T14:10:07.149Z",
          "location_id": 1,
          "vendor_id": 2
        }
      ]
    },
    settings: {
      vendor_locations      : {
        key           : 'wtm_vendor_locs',
        default_data  : {
          vendor_id         : null,
          location_id       : null,
          customer_number   : null
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
          return cakeVendorLocationsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeVendorLocationsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeVendorLocationsServiceTestsMockedData.vendor_locations_response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeSettings', {
        getSettings: function(settingKey) {
          var deferred = $q.defer();
          deferred.resolve(cakeVendorLocationsServiceTestsMockedData[settingKey]);
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
    service = $injector.get('VendorLocations');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Vendor Locations service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeSettings).to.exist;

      expect(service.vendorLocations).to.deep.equal([]);
      expect(service.vendorLocationsById).to.deep.equal({});

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

    it('bulkCreateVendorLocations should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"vendor_id": 1, "location_id": 1},
        {"vendor_id": 2, "location_id": 1}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateVendorLocations should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateVendorLocations should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {"vendor_id": 1, "location_id": 1},
        {"vendor_id": 2, "location_id": 1}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteVendorLocations should use given data to remove entries from db using api bulk request - api success scenario with array of data given', function() {

      var testData = [1, 2];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteVendorLocations should use given data to remove entries from db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteVendorLocations should use given data to remove entries from db using api bulk request - api error scenario', function() {

      var testData = [1, 2];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkUpdateVendorLocations should use given data to update entries in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"id": 1, "vendor_id": 2},
        {"id": 2, "vendor_id": 1}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateVendorLocations should use given data to update entries in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateVendorLocations should use given data to update entries in db using api bulk request - api error scenario', function() {

      var testData = [
        {"id": 1, "vendor_id": 2},
        {"id": 2, "vendor_id": 1}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateVendorLocations(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getVendorLocation should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.vendorLocations = cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results;
      service.vendorLocationsById = _.object(_.pluck(cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results, 'id'), cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results);

      expect(service.getVendorLocation()).to.deep.equal(service.vendorLocations);
      expect(service.getVendorLocation(2)).to.deep.equal(service.vendorLocations[1]);

    });

    it('getVendorLocations should return all cached entries array', function() {

      service.vendorLocations = cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results;

      expect(service.getVendorLocations()).to.deep.equal(service.vendorLocations);

    });

    it('getVendorLocationsCollection should return all cached entries collection', function() {

       service.vendorLocationsById = _.object(_.pluck(cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results, 'id'), cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results);

      expect(service.getVendorLocationsCollection()).to.deep.equal(service.vendorLocationsById);

    });

    it('loadVendorLocations should use api to load data according to params - scenario with api success, cache enabled and empty find params (should load only vendor locations from active locations)', function() {

      var testFindParams = null;
      var testOtherParams = {test2: 'test2'};
      var parsedFindParams = {location_id: _.pluck(cakeVendorLocationsServiceTestsMockedData.active_locations, 'id')};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadVendorLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, parsedFindParams, testOtherParams)).to.equal(true);
      expect(service.vendorLocations).to.deep.equal(cakeVendorLocationsServiceTestsMockedData.vendor_locations_response.results);
      expect(_.keys(service.vendorLocationsById).length).to.equal(service.vendorLocations.length);
      expect(result).to.deep.equal(cakeVendorLocationsServiceTestsMockedData.vendor_locations_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadVendorLocations should use api to load data according to params - scenario with api success, cache disabled and find params set', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadVendorLocations(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.vendorLocations).to.deep.equal([]);
      expect(service.vendorLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeVendorLocationsServiceTestsMockedData.vendor_locations_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadVendorLocations should use api to load data according to params - scenario with api error', function() {

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
      service.loadVendorLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.vendorLocations).to.deep.equal([]);
      expect(service.vendorLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateVendorLocation should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, vendor_id: 3, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('vendor_locations')
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

      service.updateVendorLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendor_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateVendorLocation should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, vendor_id: 3, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('vendor_locations')
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

      service.updateVendorLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendor_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});