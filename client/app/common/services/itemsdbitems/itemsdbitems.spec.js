describe('Service: ItemsDBItems', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeItemsDBItemsServiceTestsMockedData = {
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
      items  : 'wtm_item_db_items'
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon, cakeGLAccounts, cakeItemsDBCategories, cakePermissions;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('cakeCommon', {
        getObjectKey: function(key) {
          return cakeItemsDBItemsServiceTestsMockedData.settings[key]['key'];
        },
        getItemDBObjectKey: function(key) {
          return cakeItemsDBItemsServiceTestsMockedData.itemdb_settings[key];
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeGLAccounts', {});

      $provide.value('cakeItemsDBCategories', {});

      $provide.value('cakePermissions', {});

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    cakeGLAccounts = $injector.get('cakeGLAccounts');
    cakeItemsDBCategories = $injector.get('cakeItemsDBCategories');
    cakePermissions = $injector.get('cakePermissions');
    service = $injector.get('ItemsDBItems');

  }));


  afterEach(function() {

    sandbox.restore();

    delete cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.error;
    delete cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.results.error;

  });


  describe('Constructor', function() {

    it('should construct ItemsDBItems service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeItemsDBCategories).to.exist;
      expect(service.cakePermissions).to.exist;
      expect(service.cakeGLAccounts).to.exist;

    });

  });

  describe('Functions', function() {

    it('getData should use api to load data according to params using itemsDB special object - scenario with api success and some params given', function() {

      var testObjKey = 'items';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.results);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api success and no params given', function() {

      var testObjKey = 'items';
      var testOtherParamsParsed = {'object': cakeItemsDBItemsServiceTestsMockedData.itemdb_settings[testObjKey]};
      var result;

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData().then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(null, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.results);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api error coming from the itemsdb object request', function() {

      var testObjKey = 'items';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.error = {message: 'itemsdb object error'};

      var deferred = $q.defer();
          deferred.reject(cakeItemsDBItemsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.calledWithExactly(cakeItemsDBItemsServiceTestsMockedData.response)).to.equal(true);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api error coming from the itemsdb object trigger', function() {

      var testObjKey = 'items';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.error = {message: 'itemsdb object trigger error'};

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.error);
      expect(spyCakeCommonErrorHandler.calledWithExactly(cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.error)).to.equal(true);

    });

    it('getData should use api to load data according to params using itemsDB special object - scenario with api error coming from the itemsdb object trigger inner api request', function() {

      var testObjKey = 'items';
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testOtherParamsParsed = _.extend({}, testOtherParams, {'object': cakeItemsDBItemsServiceTestsMockedData.itemdb_settings[testObjKey]});
      var result;

      cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.results.error = {message: 'itemsdb object trigger inner api request error'};

      var deferred = $q.defer();
          deferred.resolve(cakeItemsDBItemsServiceTestsMockedData.response);
      var mockResource = sandbox.mock(service.$resource);
      var resourceFindExpectation = mockResource.expects('find').returns(deferred.promise);
      var spyCakeCommonItemDBObjectGetKey = sandbox.spy(service.cakeCommon, 'getItemDBObjectKey');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.getData(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonItemDBObjectGetKey.calledWithExactly(testObjKey)).to.equal(true);
      expect(resourceFindExpectation.withExactArgs(testFindParams, testOtherParamsParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.results.error);
      expect(spyCakeCommonErrorHandler.calledWithExactly(cakeItemsDBItemsServiceTestsMockedData.response.trigger_response.results.error)).to.equal(true);

    });

  });

});