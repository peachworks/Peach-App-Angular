describe('Service: Active Locations', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeActiveLocationsServiceTestsMockedData = {
    active_locations_response : {
      count: 3,
      results: [
        {
          copied_from: null,
          created_at: "2015-10-08T14:43:58.042Z",
          created_by: 44,
          id: 1,
          is_copied: false,
          location_id: 1,
          updated_at: "2015-10-08T14:43:58.042Z",
          updated_by: null
        },
        {
          copied_from: 1,
          created_at: "2015-10-08T14:43:58.042Z",
          created_by: 44,
          id: 2,
          is_copied: true,
          location_id: 2,
          updated_at: "2015-10-08T14:43:58.042Z",
          updated_by: null
        },
        {
          copied_from: null,
          created_at: "2015-10-08T14:43:58.042Z",
          created_by: 44,
          id: 3,
          is_copied: false,
          location_id: 3,
          updated_at: "2015-10-08T14:43:58.042Z",
          updated_by: null
        }
      ]
    },
    settings: {
      active_locations: {
        key           : 'wtm_inv_locs',
        default_data  : {
          is_copied         : false,
          copied_from       : null,
          location_id       : null
        }
      }
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('cakeCommon', {
        getObjectKey: function(key) {
          return cakeActiveLocationsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeActiveLocationsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeActiveLocationsServiceTestsMockedData.active_locations_response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    service = $injector.get('ActiveLocations');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Cake Active Locations service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.activeLocations).to.deep.equal([]);
      expect(service.activeLocationsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createActiveLocation should use given data to create entry in db using api - api success scenario', function() {

      var testData = {location_id: 4};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('active_locations'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createActiveLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('active_locations')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createActiveLocation should use given data to create entry in db using api - api error scenario', function() {

      var testData = {location_id: 4};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('active_locations'),
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

      service.createActiveLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('active_locations')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getActiveLocation should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.activeLocations = cakeActiveLocationsServiceTestsMockedData.active_locations_response.results;
      service.activeLocationsById = _.object(_.pluck(cakeActiveLocationsServiceTestsMockedData.active_locations_response.results, 'id'), cakeActiveLocationsServiceTestsMockedData.active_locations_response.results);

      expect(service.getActiveLocation()).to.deep.equal(service.activeLocations);
      expect(service.getActiveLocation(2)).to.deep.equal(service.activeLocations[1]);

    });

    it('getActiveLocations should return all cached entries array', function() {

      service.activeLocations = cakeActiveLocationsServiceTestsMockedData.active_locations_response.results;

      expect(service.getActiveLocations()).to.deep.equal(service.activeLocations);

    });

    it('getActiveLocationsCollection should return all cached entries collection', function() {

       service.activeLocationsById = _.object(_.pluck(cakeActiveLocationsServiceTestsMockedData.active_locations_response.results, 'id'), cakeActiveLocationsServiceTestsMockedData.active_locations_response.results);

      expect(service.getActiveLocationsCollection()).to.deep.equal(service.activeLocationsById);

    });

    it('loadActiveLocations should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadActiveLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.activeLocations).to.deep.equal(cakeActiveLocationsServiceTestsMockedData.active_locations_response.results);
      expect(_.keys(service.activeLocationsById).length).to.equal(service.activeLocations.length);
      expect(result).to.deep.equal(cakeActiveLocationsServiceTestsMockedData.active_locations_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadActiveLocations should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadActiveLocations(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.activeLocations).to.deep.equal([]);
      expect(service.activeLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeActiveLocationsServiceTestsMockedData.active_locations_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadActiveLocations should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadActiveLocations(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.activeLocations).to.deep.equal([]);
      expect(service.activeLocationsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeActiveLocation should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeActiveLocation(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeActiveLocation should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeActiveLocation(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateActiveLocation should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, location_id: 4, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('active_locations')
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

      service.updateActiveLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('active_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateActiveLocation should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, location_id: 4, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('active_locations')
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

      service.updateActiveLocation(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('active_locations')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});