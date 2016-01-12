describe('Service: GL Accounts', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeGLAccountsServiceTestsMockedData = {
    gl_accounts_response: {
      'count': 2,
      'results': [
        {
          "subtype": null,
          "type": "COGS",
          "description": null,
          "number": null,
          "name": "Alcohol",
          "parent_id": null,
          "id": 1,
          "created_by": 44,
          "created_at": "2014-09-24T10:33:10.579Z",
          "updated_by": null,
          "updated_at": "2014-09-24T10:33:10.579Z"
        }, {
          "subtype": null,
          "type": "COGS",
          "description": null,
          "number": null,
          "name": "Beer",
          "parent_id": 12,
          "id": 2,
          "created_by": 44,
          "created_at": "2014-10-08T20:58:59.896Z",
          "updated_by": null,
          "updated_at": "2014-10-08T20:58:59.896Z"
        }
      ]
    },
    settings: {
      gl_accounts           : {
        key           : 'gl_accounts',
        default_data  : {
          parent_id         : null,
          name              : '',
          number            : null,
          description       : '',
          type              : null,
          subtype           : null
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
        return cakeGLAccountsServiceTestsMockedData.settings[key]['key'];
      },
      getObjectDefaultData: function(key) {
        return cakeGLAccountsServiceTestsMockedData.settings[key]['default_data'];
      },
      makeAutoPaginatedGETRequest: function() {
        var deferred = $q.defer();
        deferred.resolve(cakeGLAccountsServiceTestsMockedData.gl_accounts_response);
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
    service = $injector.get('GLAccounts');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct GL Accounts service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.glAccounts).to.deep.equal([]);
      expect(service.glAccountsById).to.deep.equal({});
      expect(service.glAccountsInitialized).to.equal(false);

    });

  });

  describe('Activate function', function() {

    it('activate should pre-load default gl account - api success scenario', function() {

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(service.glAccountsInitialized).to.equal(true);
      expect(spyCakeCommonGet.calledWithExactly(service.$resource, null, {sort: 'id'})).to.equal(true);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('activate should do nothing - api error scenario', function() {

      var testError = {
        message: 'api error'
      };

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.glAccountsInitialized = false;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(service.glAccountsInitialized).to.equal(false);
      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, null, {sort: 'id'}).verify()).to.equal(true);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

  describe('Functions', function() {

    it('createGLAccount should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        "subtype": null,
        "type": "COGS",
        "name": "Alcohol"
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('gl_accounts'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createGLAccount(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('gl_accounts')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createGLAccount should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        "subtype": null,
        "type": "COGS",
        "name": "Alcohol"
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('gl_accounts'),
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

      service.createGLAccount(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('gl_accounts')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getDefaultGLAccount should use return default gl account preloaded in activate function - scenario when service already initialized', function() {

      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');

      service.getDefaultGLAccount()
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.called).to.equal(false);
      expect(result).to.deep.equal(cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results[0]);

    });

    it('getDefaultGLAccount should use return default gl account preloaded in activate function - scenario when service haven\'t yet fully initialized', function() {

      var result;

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.glAccountsInitialized = false;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');

      service.getDefaultGLAccount()
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, null, {sort: 'id'})).to.equal(false);
      expect(result).to.deep.equal(cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results[0]);

    });

    it('getGLAccount should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.glAccounts = cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results;
      service.glAccountsById = _.object(_.pluck(cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results, 'id'), cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results);

      expect(service.getGLAccount()).to.deep.equal(service.glAccounts);
      expect(service.getGLAccount(2)).to.deep.equal(service.glAccounts[1]);

    });

    it('getGLAccounts should return all cached entries array', function() {

      service.glAccounts = cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results;

      expect(service.getGLAccounts()).to.deep.equal(service.glAccounts);

    });

    it('getGLAccountsCollection should return all cached entries collection', function() {

      service.glAccountsById = _.object(_.pluck(cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results, 'id'), cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results);

      expect(service.getGLAccountsCollection()).to.deep.equal(service.glAccountsById);

    });

    it('loadGLAccounts should use api to load data according to params - scenario with api success, cache enabled and service already preloaded default gl account', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadGLAccounts(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.glAccounts).to.deep.equal(cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results);
      expect(_.keys(service.glAccountsById).length).to.equal(service.glAccounts.length);
      expect(result).to.deep.equal(cakeGLAccountsServiceTestsMockedData.gl_accounts_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadGLAccounts should use api to load data according to params - scenario with api success, cache enabled and service havent yet preloaded default gl account', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.glAccountsInitialized = false;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadGLAccounts(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.firstCall.calledWithExactly(service.$resource, null, {sort: 'id'})).to.equal(true);
      expect(spyCakeCommonGet.secondCall.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.glAccounts).to.deep.equal(cakeGLAccountsServiceTestsMockedData.gl_accounts_response.results);
      expect(_.keys(service.glAccountsById).length).to.equal(service.glAccounts.length);
      expect(result).to.deep.equal(cakeGLAccountsServiceTestsMockedData.gl_accounts_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadGLAccounts should use api to load data according to params - scenario with api error', function() {

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
      service.loadGLAccounts(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.glAccounts).to.deep.equal([]);
      expect(service.glAccountsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});