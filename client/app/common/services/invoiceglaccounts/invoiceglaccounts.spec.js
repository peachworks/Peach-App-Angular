describe('Service: Invoice GL Accounts', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeInvoiceGLAccountsServiceTestsMockedData = {
    api_response : {
      count: 2,
      results: [
        {
          "amount": "213.00",
          "description": null,
          "id": 1,
          "created_by": 44,
          "created_at": "2015-11-19T16:44:37.409Z",
          "updated_by": 44,
          "updated_at": "2015-11-19T16:44:44.765Z",
          "location_id": 7,
          "invoice_id": 73,
          "gl_account_id": 28,
          "vendor_id": 1
        },
        {
          "amount": "15.00",
          "description": null,
          "id": 2,
          "created_by": 44,
          "created_at": "2015-11-19T16:39:47.660Z",
          "updated_by": 44,
          "updated_at": "2015-11-19T16:44:40.877Z",
          "location_id": 7,
          "invoice_id": 73,
          "gl_account_id": 28,
          "vendor_id": 1
        }
      ]
    },
    settings: {
      invoice_gl_accounts   : {
        key           : 'wtm_invoice_gl_accounts',
        default_data  : {
          invoice_id        : null,
          vendor_id         : null,
          description       : null,
          amount            : null,
          gl_account_id     : null,
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
          return cakeInvoiceGLAccountsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeInvoiceGLAccountsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeInvoiceGLAccountsServiceTestsMockedData.api_response);
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
    service = $injector.get('InvoiceGLAccounts');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Cake Invoice GL Accounts service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.invoiceGLAccounts).to.deep.equal([]);
      expect(service.invoiceGLAccountsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createInvoiceGLAccount should use given data to create entry in db using api - api success scenario', function() {

      var testData = {invoice_id: 1, vendor_id: 1, amount: 30, gl_account_id: 1, location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('invoice_gl_accounts'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createInvoiceGLAccount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_gl_accounts')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createInvoiceGLAccount should use given data to create entry in db using api - api error scenario', function() {

      var testData = {invoice_id: 1, vendor_id: 1, amount: 30, gl_account_id: 1, location_id: 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('invoice_gl_accounts'),
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

      service.createInvoiceGLAccount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_gl_accounts')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getInvoiceGLAccount should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.invoiceGLAccounts = cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results;
      service.invoiceGLAccountsById = _.object(_.pluck(cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results, 'id'), cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results);

      expect(service.getInvoiceGLAccount()).to.deep.equal(service.invoiceGLAccounts);
      expect(service.getInvoiceGLAccount(1)).to.deep.equal(service.invoiceGLAccounts[0]);

    });

    it('getInvoiceGLAccounts should return all cached entries array', function() {

      service.invoiceGLAccounts = cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results;

      expect(service.getInvoiceGLAccounts()).to.deep.equal(service.invoiceGLAccounts);

    });

    it('getInvoiceGLAccountsCollection should return all cached entries collection', function() {

       service.invoiceGLAccountsById = _.object(_.pluck(cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results, 'id'), cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results);

      expect(service.getInvoiceGLAccountsCollection()).to.deep.equal(service.invoiceGLAccountsById);

    });

    it('loadInvoiceGLAccounts should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoiceGLAccounts(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.invoiceGLAccounts).to.deep.equal(cakeInvoiceGLAccountsServiceTestsMockedData.api_response.results);
      expect(_.keys(service.invoiceGLAccountsById).length).to.equal(service.invoiceGLAccounts.length);
      expect(result).to.deep.equal(cakeInvoiceGLAccountsServiceTestsMockedData.api_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadInvoiceGLAccounts should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoiceGLAccounts(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.invoiceGLAccounts).to.deep.equal([]);
      expect(service.invoiceGLAccountsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeInvoiceGLAccountsServiceTestsMockedData.api_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadInvoiceGLAccounts should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoiceGLAccounts(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.invoiceGLAccounts).to.deep.equal([]);
      expect(service.invoiceGLAccountsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeInvoiceGLAccount should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeInvoiceGLAccount(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeInvoiceGLAccount should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeInvoiceGLAccount(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateInvoiceGLAccount should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, amount: '10', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('invoice_gl_accounts')
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

      service.updateInvoiceGLAccount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_gl_accounts')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateInvoiceGLAccount should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, amount: '10', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('invoice_gl_accounts')
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

      service.updateInvoiceGLAccount(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_gl_accounts')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});