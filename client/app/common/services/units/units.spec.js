describe('Service: Units', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeUnitsServiceTestsMockedData = {
    units_response: {
      'count': 2,
      'results': [
        {
          "type": "each",
          "metric_base": null,
          "english_base": null,
          "abbr": "bg",
          "is_metric": false,
          "name": "Bag",
          "id": 1,
          "created_by": 44,
          "created_at": "2014-06-17T15:01:02.984Z",
          "updated_by": null,
          "updated_at": "2014-06-30T14:24:50.873Z"
        }, {
          "type": "each",
          "metric_base": null,
          "english_base": null,
          "abbr": "bat",
          "is_metric": false,
          "name": "Batch",
          "id": 2,
          "created_by": 44,
          "created_at": "2014-06-17T15:01:34.911Z",
          "updated_by": null,
          "updated_at": "2014-06-30T14:24:45.030Z"
        }
      ]
    },
    settings: {
      units                 : {
        key           : 'wtm_units',
        default_data  : {}
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
        return cakeUnitsServiceTestsMockedData.settings[key]['key'];
      },
      getObjectDefaultData: function(key) {
        return cakeUnitsServiceTestsMockedData.settings[key]['default_data'];
      },
      makeAutoPaginatedGETRequest: function() {
        var deferred = $q.defer();
        deferred.resolve(cakeUnitsServiceTestsMockedData.units_response);
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
    service = $injector.get('Units');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Units service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.units).to.deep.equal([]);
      expect(service.unitsById).to.deep.equal({});
      expect(service.unitsInitialized).to.equal(false);

    });

  });

  describe('Activate function', function() {

    it('activate should check if there are already any units in db, and eventually create them if not - scenario when there already are some units', function() {

      var testData = {count: 2, results: [{id: 1}, {id: 2}]};

      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var deferred = $q.defer();
          deferred.resolve([]);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);
      var spyBulkCreateUnits = sandbox.spy(service, 'bulkCreateUnits');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resouce, null, {limit: 1}).verify()).to.equal(true);
      expect(service.unitsInitialized).to.equal(true);
      expect(spyBulkCreateUnits.called).to.equal(false);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('activate should check if there are already any units in db, and eventually create them if not - scenario when there are no units yet', function() {

      var testData = {count: 0, results: []};

      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var deferred = $q.defer();
          deferred.resolve([]);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);
      var spyBulkCreateUnits = sandbox.spy(service, 'bulkCreateUnits');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resouce, null, {limit: 1}).verify()).to.equal(true);
      expect(service.unitsInitialized).to.equal(true);
      expect(spyBulkCreateUnits.called).to.equal(true);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });


    it('activate should do nothing - api error scenario', function() {

      var testError = {
        message: 'api error'
      };

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.unitsInitialized = false;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var deferred = $q.defer();
          deferred.resolve([]);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);
      var spyBulkCreateUnits = sandbox.spy(service, 'bulkCreateUnits');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resouce, null, {limit: 1}).verify()).to.equal(true);
      expect(service.unitsInitialized).to.equal(false);
      expect(spyBulkCreateUnits.called).to.equal(false);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

  describe('Functions', function() {

    it('bulkCreateUnits should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"type": "each", "abbr": "bg", "is_metric": false, "name": "Bag"},
        {"type": "each", "abbr": "cs", "is_metric": false, "name": "Case"}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateUnits should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateUnits should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {"vendor_id": 1, "inv_item_id": 1, "inv_item_unit_id": 1},
        {"vendor_id": 2, "inv_item_id": 2, "inv_item_unit_id": 2}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('createUnit should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        name: 'Can',
        abbr: 'can',
        type: 'each',
        is_metric: false
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('units'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createUnit(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('units')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createUnit should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        name: 'Can',
        abbr: 'can',
        type: 'each',
        is_metric: false
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('units'),
        testData
      );
      var testError = {
        message: 'api error'
      };
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createUnit(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('units')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getUnit should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.units = cakeUnitsServiceTestsMockedData.units_response.results;
      service.unitsById = _.object(_.pluck(cakeUnitsServiceTestsMockedData.units_response.results, 'id'), cakeUnitsServiceTestsMockedData.units_response.results);

      expect(service.getUnit()).to.deep.equal(service.units);
      expect(service.getUnit(2)).to.deep.equal(service.units[1]);

    });

    it('getUnits should return all cached entries array', function() {

      service.units = cakeUnitsServiceTestsMockedData.units_response.results;

      expect(service.getUnits()).to.deep.equal(service.units);

    });

    it('getUnitsCollection should return all cached entries collection', function() {

      service.unitsById = _.object(_.pluck(cakeUnitsServiceTestsMockedData.units_response.results, 'id'), cakeUnitsServiceTestsMockedData.units_response.results);

      expect(service.getUnitsCollection()).to.deep.equal(service.unitsById);

    });

    it('loadUnits should use api to load data according to params - scenario with api success, cache enabled and service already initialized', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadUnits(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.units).to.deep.equal(cakeUnitsServiceTestsMockedData.units_response.results);
      expect(_.keys(service.unitsById).length).to.equal(service.units.length);
      expect(result).to.deep.equal(cakeUnitsServiceTestsMockedData.units_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadUnits should use api to load data according to params - scenario with api success, cache enabled and service havent yet initialized', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.unitsInitialized = false;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadUnits(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.firstCall.calledWithExactly(service.$resource, null, {limit: 1})).to.equal(true);
      expect(spyCakeCommonGet.secondCall.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.units).to.deep.equal(cakeUnitsServiceTestsMockedData.units_response.results);
      expect(_.keys(service.unitsById).length).to.equal(service.units.length);
      expect(result).to.deep.equal(cakeUnitsServiceTestsMockedData.units_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadUnits should use api to load data according to params - scenario with api error', function() {

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
      service.loadUnits(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.units).to.deep.equal([]);
      expect(service.unitsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});