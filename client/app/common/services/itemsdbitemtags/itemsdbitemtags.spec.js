describe('Service: ItemsDBItemTags', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeItemsDBItemTagsServiceTestsMockedData = {
    response : {
      trigger_response: {
        results: {
          count: 1,
          results: [
            {
              id: 1,
              name: 'some fake test object'
            }
          ]
        }
      }
    },
    settings: {
      items_db       : {
        key           : 'wtm_inv_item_db',
        default_data  : {}
      }
    },
    itemdb_settings  : {
      item_tags: 'wtm_item_db_item_tags'
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('cakeCommon', {
        getObjectKey: function(key) {
          return cakeItemsDBItemTagsServiceTestsMockedData.settings[key]['key'];
        },
        getItemDBObjectKey: function(key) {
          return cakeItemsDBItemTagsServiceTestsMockedData.itemdb_settings[key];
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
    service = $injector.get('ItemsDBItemTags');

  }));


  afterEach(function() {

    sandbox.restore();

    delete cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.error;
    delete cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.results.error;

  });


  describe('Constructor', function() {

    it('should construct ItemsDBItemTags service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

    });

  });

  describe('Functions', function() {

    it('getData should use api to load data according to params using itemsDB special object - scenario with api success and some params given', function() {

      var testObjKey = 'item_tags';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemTagsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemTagsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.results);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api success and no params given', function() {

      var testObjKey = 'item_tags';
      var testOtherParamsParsed = {'object': cakeItemsDBItemTagsServiceTestsMockedData.itemdb_settings[testObjKey]};
      var result;

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemTagsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData().then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(null, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.results);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api error coming from the itemsdb object request', function() {

      var testObjKey = 'item_tags';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemTagsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.error = {message: 'itemsdb object error'};

      var deferred = $q.defer();
          deferred.reject(cakeItemsDBItemTagsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemTagsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.calledWithExactly(cakeItemsDBItemTagsServiceTestsMockedData.response)).to.equal(true);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api error coming from the itemsdb object trigger', function() {

      var testObjKey = 'item_tags';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemTagsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.error = {message: 'itemsdb object trigger error'};

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemTagsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.error);
      expect(spyCakeCommonErrorHandler.calledWithExactly(cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.error)).to.equal(true);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api error coming from the itemsdb object trigger inner api request', function() {

      var testObjKey = 'item_tags';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemTagsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.results.error = {message: 'itemsdb object trigger inner api request error'};

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemTagsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.results.error);
      expect(spyCakeCommonErrorHandler.calledWithExactly(cakeItemsDBItemTagsServiceTestsMockedData.response.trigger_response.results.error)).to.equal(true);

    });

  });

});