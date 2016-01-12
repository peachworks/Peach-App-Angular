describe('Service: Events', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeEventsServiceTestsMockedData = {
    events_response : {
      count: 3,
      results: [
        {
          "notes": null,
          "type": "invoice",
          "is_complete": false,
          "description": "Event for invoice winth vendor_id: 1",
          "date": "2015-10-08",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-09-24T15:21:46.210Z",
          "updated_by": 44,
          "updated_at": "2015-11-02T13:48:48.801Z",
          "location_id": 15
        },
        {
          "notes": null,
          "type": "invoice",
          "is_complete": false,
          "description": "Event for invoice winth vendor_id: 1",
          "date": "2015-10-08",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-09-28T11:11:00.527Z",
          "updated_by": 44,
          "updated_at": "2015-11-02T13:48:45.430Z",
          "location_id": 4
        },
        {
          "notes": null,
          "type": "invoice",
          "is_complete": false,
          "description": "Event for invoice winth vendor_id: 1",
          "date": "1932-10-03",
          "id": 3,
          "created_by": 138,
          "created_at": "2015-10-03T20:40:14.314Z",
          "updated_by": 44,
          "updated_at": "2015-10-19T14:20:31.686Z",
          "location_id": 1
        }
      ]
    },
    settings: {
      events                : {
        key           : 'wtm_inv_events',
        default_data  : {
          date              : null,
          description       : '',
          type              : null,
          notes             : '',
          is_complete       : false,
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
          return cakeEventsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeEventsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeEventsServiceTestsMockedData.events_response);
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
    service = $injector.get('Events');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Cake Events service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.events).to.deep.equal([]);
      expect(service.eventsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createEvent should use given data to create entry in db using api - api success scenario', function() {

      var testData = {date: '2015.12.12', type: 'invoice', location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('events'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createEvent(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('events')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createEvent should use given data to create entry in db using api - api error scenario', function() {

      var testData = {date: '2015.12.12', type: 'invoice', location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('events'),
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

      service.createEvent(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('events')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getEvent should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.events = cakeEventsServiceTestsMockedData.events_response.results;
      service.eventsById = _.object(_.pluck(cakeEventsServiceTestsMockedData.events_response.results, 'id'), cakeEventsServiceTestsMockedData.events_response.results);

      expect(service.getEvent()).to.deep.equal(service.events);
      expect(service.getEvent(3)).to.deep.equal(service.events[2]);

    });

    it('getEvents should return all cached entries array', function() {

      service.events = cakeEventsServiceTestsMockedData.events_response.results;

      expect(service.getEvents()).to.deep.equal(service.events);

    });

    it('getEventsCollection should return all cached entries collection', function() {

       service.eventsById = _.object(_.pluck(cakeEventsServiceTestsMockedData.events_response.results, 'id'), cakeEventsServiceTestsMockedData.events_response.results);

      expect(service.getEventsCollection()).to.deep.equal(service.eventsById);

    });

    it('loadEvents should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadEvents(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.events).to.deep.equal(cakeEventsServiceTestsMockedData.events_response.results);
      expect(_.keys(service.eventsById).length).to.equal(service.events.length);
      expect(result).to.deep.equal(cakeEventsServiceTestsMockedData.events_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadEvents should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadEvents(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.events).to.deep.equal([]);
      expect(service.eventsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeEventsServiceTestsMockedData.events_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadEvents should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadEvents(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.events).to.deep.equal([]);
      expect(service.eventsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeEvent should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeEvent(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeEvent should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeEvent(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateEvent should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, date: '2015-12-13', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('events')
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

      service.updateEvent(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('events')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateEvent should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, date: '2015-12-13', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('events')
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

      service.updateEvent(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('events')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});