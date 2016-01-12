describe('Service: Counts', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeCountsServiceTestsMockedData = {
    counts_response : {
      count: 2,
      results: [
        {
          "date": "2015-10-13",
          "task_id": null,
          "time": null,
          "notes": "",
          "is_complete": true,
          "is_opening": true,
          "percent_complete": "98.00",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-10-13T20:47:08.979Z",
          "updated_by": 44,
          "updated_at": "2015-12-04T16:51:36.018Z",
          "location_id": 1,
          "count_group_id": 65
        }, {
          "date": "2015-10-11",
          "task_id": null,
          "time": null,
          "notes": "",
          "is_complete": true,
          "is_opening": true,
          "percent_complete": "93.00",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-10-13T20:46:26.590Z",
          "updated_by": 44,
          "updated_at": "2015-11-30T12:32:21.728Z",
          "location_id": 1,
          "count_group_id": 65
        }
      ]
    },
    opening_counts_response : {
      count: 2,
      results: [
        {
          "count_date": "2015-08-30",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-08-28T15:18:15.457Z",
          "updated_by": null,
          "updated_at": "2015-08-28T15:18:15.457Z",
          "location_id": 1,
          "count_group_id": 67
        }, {
          "count_date": "2015-09-10",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-09-08T11:56:07.874Z",
          "updated_by": 44,
          "updated_at": "2015-09-17T11:33:15.733Z",
          "location_id": 1,
          "count_group_id": 65
        }
      ]
    },
    settings: {
      counts                : {
        key           : 'wtm_inv_counts',
        default_data  : {
          count_group_id    : null,
          notes             : '',
          time              : null,
          date              : null,
          is_complete       : false,
          percent_complete  : 0,
          location_id       : null,
          task_id           : null
        }
      },
      opening_counts        : {
        key           : 'wtm_inv_opening_counts',
        default_data  : {
          count_group_id    : null,
          count_date        : null,
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
          return cakeCountsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeCountsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();

          if (resource === 'counts') {
            deferred.resolve(cakeCountsServiceTestsMockedData.counts_response);
          } else {
            deferred.resolve(cakeCountsServiceTestsMockedData.opening_counts_response);
          }

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
    service = $injector.get('Counts');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Counts service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.$openingCountsResource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.counts).to.deep.equal([]);
      expect(service.countsById).to.deep.equal({});
      expect(service.openingCounts).to.deep.equal([]);
      expect(service.openingCountsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createCount should use given data to create entry in db using api - api success scenario', function() {

      var testData = {count_group_id: 1, date: '2015-12-12', is_complete: false, percent_complete: 0, location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('counts'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createCount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('counts')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createCount should use given data to create entry in db using api - api error scenario', function() {

      var testData = {count_group_id: 1, date: '2015-12-12', is_complete: false, percent_complete: 0, location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('counts'),
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

      service.createCount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('counts')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getCount should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.counts = cakeCountsServiceTestsMockedData.counts_response.results;
      service.countsById = _.object(_.pluck(cakeCountsServiceTestsMockedData.counts_response.results, 'id'), cakeCountsServiceTestsMockedData.counts_response.results);

      expect(service.getCount()).to.deep.equal(service.counts);
      expect(service.getCount(2)).to.deep.equal(service.counts[1]);

    });

    it('getCounts should return all cached entries array', function() {

      service.counts = cakeCountsServiceTestsMockedData.counts_response.results;

      expect(service.getCounts()).to.deep.equal(service.counts);

    });

    it('getCountsCollection should return all cached entries collection', function() {

       service.countsById = _.object(_.pluck(cakeCountsServiceTestsMockedData.counts_response.results, 'id'), cakeCountsServiceTestsMockedData.counts_response.results);

      expect(service.getCountsCollection()).to.deep.equal(service.countsById);

    });

    it('getOpeningCounts should return all cached entries array', function() {

      service.openingCounts = cakeCountsServiceTestsMockedData.opening_counts_response.results;

      expect(service.getOpeningCounts()).to.deep.equal(service.openingCounts);

    });

    it('getOpeningCountsCollection should return all cached entries collection', function() {

       service.openingCountsById = _.object(_.pluck(cakeCountsServiceTestsMockedData.opening_counts_response.results, 'id'), cakeCountsServiceTestsMockedData.opening_counts_response.results);

      expect(service.getOpeningCountsCollection()).to.deep.equal(service.openingCountsById);

    });

    it('loadCounts should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      service.$resource = 'counts';

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadCounts(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.counts).to.deep.equal(cakeCountsServiceTestsMockedData.counts_response.results);
      expect(_.keys(service.countsById).length).to.equal(service.counts.length);
      expect(result).to.deep.equal(cakeCountsServiceTestsMockedData.counts_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCounts should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      service.$resource = 'counts';

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadCounts(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.counts).to.deep.equal([]);
      expect(service.countsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeCountsServiceTestsMockedData.counts_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCounts should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      service.$resource = 'counts';

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadCounts(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.counts).to.deep.equal([]);
      expect(service.countsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('loadOpeningCounts should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      service.$openingCountsResource = 'opening_counts';

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadOpeningCounts(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$openingCountsResource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.openingCounts).to.deep.equal(cakeCountsServiceTestsMockedData.opening_counts_response.results);
      expect(_.keys(service.openingCountsById).length).to.equal(service.openingCounts.length);
      expect(result).to.deep.equal(cakeCountsServiceTestsMockedData.opening_counts_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadOpeningCounts should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      service.$openingCountsResource = 'opening_counts';

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadOpeningCounts(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$openingCountsResource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.openingCounts).to.deep.equal([]);
      expect(service.openingCountsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeCountsServiceTestsMockedData.opening_counts_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadOpeningCounts should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      service.$openingCountsResource = 'opening_counts';

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadOpeningCounts(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$openingCountsResource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.openingCounts).to.deep.equal([]);
      expect(service.openingCountsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeCount should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeCount(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeCount should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeCount(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateCount should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 2, is_complete: true, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('counts')
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

      service.updateCount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('counts')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateCount should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 2, is_complete: true, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('counts')
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

      service.updateCount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('counts')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});