describe('Service: Invoices', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeInvoicesServiceTestsMockedData = {
    invoices_response : {
      count: 2,
      results: [
        {
          "invoice_number": null,
          "is_complete": false,
          "receipt_date": "2015-10-08",
          "invoice_date": "2015-09-24",
          "total": "0.00",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-09-24T15:21:46.079Z",
          "updated_by": 44,
          "updated_at": "2015-11-02T13:48:48.664Z",
          "location_id": 15,
          "vendor_id": 1,
          "inv_event_id": 37
        }, {
          "invoice_number": null,
          "is_complete": false,
          "receipt_date": "2015-10-08",
          "invoice_date": "2015-09-28",
          "total": "0.00",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-09-28T11:11:00.396Z",
          "updated_by": 44,
          "updated_at": "2015-11-02T13:48:45.307Z",
          "location_id": 4,
          "vendor_id": 1,
          "inv_event_id": 38
        }
      ]
    },
    settings: {
      invoices              : {
        key           : 'wtm_invoices',
        default_data  : {
          invoice_date      : null,
          receipt_date      : null,
          vendor_id         : null,
          inv_event_id      : null,   
          total             : null,
          is_complete       : false,
          invoice_number    : null,
          notes             : null,
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
          return cakeInvoicesServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeInvoicesServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();
          deferred.resolve(cakeInvoicesServiceTestsMockedData.invoices_response);
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
    service = $injector.get('Invoices');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Invoices service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.invoices).to.deep.equal([]);
      expect(service.invoicesById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createInvoice should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        "invoice_number": null,
        "is_complete": false,
        "receipt_date": "2015-10-08",
        "invoice_date": "2015-09-24",
        "total": "0.00",
        "location_id": 15,
        "vendor_id": 1
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('invoices'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createInvoice(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoices')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createInvoice should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        "invoice_number": null,
        "is_complete": false,
        "receipt_date": "2015-10-08",
        "invoice_date": "2015-09-24",
        "total": "0.00",
        "location_id": 15,
        "vendor_id": 1
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('invoices'),
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

      service.createInvoice(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoices')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getInvoice should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.invoices = cakeInvoicesServiceTestsMockedData.invoices_response.results;
      service.invoicesById = _.object(_.pluck(cakeInvoicesServiceTestsMockedData.invoices_response.results, 'id'), cakeInvoicesServiceTestsMockedData.invoices_response.results);

      expect(service.getInvoice()).to.deep.equal(service.invoices);
      expect(service.getInvoice(2)).to.deep.equal(service.invoices[1]);

    });

    it('getInvoices should return all cached entries array', function() {

      service.invoices = cakeInvoicesServiceTestsMockedData.invoices_response.results;

      expect(service.getInvoices()).to.deep.equal(service.invoices);

    });

    it('getInvoicesCollection should return all cached entries collection', function() {

      service.invoicesById = _.object(_.pluck(cakeInvoicesServiceTestsMockedData.invoices_response.results, 'id'), cakeInvoicesServiceTestsMockedData.invoices_response.results);

      expect(service.getInvoicesCollection()).to.deep.equal(service.invoicesById);

    });

    it('loadInvoices should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoices(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.invoices).to.deep.equal(cakeInvoicesServiceTestsMockedData.invoices_response.results);
      expect(_.keys(service.invoicesById).length).to.equal(service.invoices.length);
      expect(result).to.deep.equal(cakeInvoicesServiceTestsMockedData.invoices_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadInvoices should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoices(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.invoices).to.deep.equal([]);
      expect(service.invoicesById).to.deep.equal({});
      expect(result).to.deep.equal(cakeInvoicesServiceTestsMockedData.invoices_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadInvoices should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoices(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.invoices).to.deep.equal([]);
      expect(service.invoicesById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeInvoice should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeInvoice(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeInvoice should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeInvoice(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateInvoice should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, is_complete: true, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('invoices')
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

      service.updateInvoice(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoices')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateInvoice should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, is_complete: true, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('invoices')
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

      service.updateInvoice(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoices')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});