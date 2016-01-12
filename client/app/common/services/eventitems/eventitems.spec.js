describe('Service: Event Items', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeEventItemsServiceTestsMockedData = {
    event_items_response : {
      count: 2,
      results: [
         { 
          "common_unit_quantity": "22.00000",
          "cost": "220.00000",
          "quantity": "22.00000",
          "id": 1,
          "created_by": 138,
          "created_at": "2015-10-03T20:40:21.867Z",
          "updated_by": null,
          "updated_at": "2015-10-03T20:40:21.867Z",
          "location_id": 1,
          "inv_event_id": 47,
          "inv_item_unit_id": 3912,
          "inv_item_id": 1056,
          "common_unit_id": 15
        }, {
          "common_unit_quantity": "78.00000",
          "cost": "780.00000",
          "quantity": "78.00000",
          "id": 2,
          "created_by": 138,
          "created_at": "2015-10-03T20:41:42.050Z",
          "updated_by": null,
          "updated_at": "2015-10-03T20:41:42.050Z",
          "location_id": 1,
          "inv_event_id": 48,
          "inv_item_unit_id": 3912,
          "inv_item_id": 1056,
          "common_unit_id": 15
        }
      ]
    },
    settings: {
      event_items           : {
        key           : 'wtm_inv_event_items',
        default_data  : {
          cost              : null,
          quantity          : null,
          common_unit_quantity : null,
          inv_event_id      : null,
          inv_item_id       : null,
          inv_item_unit_id  : null,
          common_unit_id    : null,
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
          return cakeEventItemsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeEventItemsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();
          deferred.resolve(cakeEventItemsServiceTestsMockedData.event_items_response);
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
    service = $injector.get('EventItems');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Event Items service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.eventItems).to.deep.equal([]);
      expect(service.eventItemsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createEventItem should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        'common_unit_quantity': "22.00000",
        'cost': "220.00000",
        'quantity': "22.00000",
        'location_id': 1,
        'inv_event_id': 47,
        'inv_item_unit_id': 3912,
        'inv_item_id': 1056,
        'common_unit_id': 15
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('event_items'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createEventItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('event_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createEventItem should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        'common_unit_quantity': "22.00000",
        'cost': "220.00000",
        'quantity': "22.00000",
        'location_id': 1,
        'inv_event_id': 47,
        'inv_item_unit_id': 3912,
        'inv_item_id': 1056,
        'common_unit_id': 15
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('event_items'),
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

      service.createEventItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('event_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getEventItem should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.eventItems = cakeEventItemsServiceTestsMockedData.event_items_response.results;
      service.eventItemsById = _.object(_.pluck(cakeEventItemsServiceTestsMockedData.event_items_response.results, 'id'), cakeEventItemsServiceTestsMockedData.event_items_response.results);

      expect(service.getEventItem()).to.deep.equal(service.eventItems);
      expect(service.getEventItem(2)).to.deep.equal(service.eventItems[1]);

    });

    it('getEventItems should return all cached entries array', function() {

      service.eventItems = cakeEventItemsServiceTestsMockedData.event_items_response.results;

      expect(service.getEventItems()).to.deep.equal(service.eventItems);

    });

    it('getEventItemsCollection should return all cached entries collection', function() {

      service.eventItemsById = _.object(_.pluck(cakeEventItemsServiceTestsMockedData.event_items_response.results, 'id'), cakeEventItemsServiceTestsMockedData.event_items_response.results);

      expect(service.getEventItemsCollection()).to.deep.equal(service.eventItemsById);

    });

    it('loadEventItems should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadEventItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.eventItems).to.deep.equal(cakeEventItemsServiceTestsMockedData.event_items_response.results);
      expect(_.keys(service.eventItemsById).length).to.equal(service.eventItems.length);
      expect(result).to.deep.equal(cakeEventItemsServiceTestsMockedData.event_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadEventItems should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadEventItems(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.eventItems).to.deep.equal([]);
      expect(service.eventItemsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeEventItemsServiceTestsMockedData.event_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadEventItems should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadEventItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.eventItems).to.deep.equal([]);
      expect(service.eventItemsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeEventItem should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeEventItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeEventItem should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeEventItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateEventItem should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, cost: 100, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('event_items')
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

      service.updateEventItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('event_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateEventItem should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, cost: 100, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('event_items')
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

      service.updateEventItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('event_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});