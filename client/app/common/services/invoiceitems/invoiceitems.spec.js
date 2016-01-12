describe('Service: Invoice Items', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeInvoiceItemsServiceTestsMockedData = {
    invoice_items_response : {
      count: 2,
      results: [
        {
          "extended_price": "220.00000",
          "unit_price": "10.00000",
          "quantity": "22.000",
          "id": 1,
          "created_by": 138,
          "created_at": "2015-10-03T20:40:21.729Z",
          "updated_by": 138,
          "updated_at": "2015-10-03T20:40:22.339Z",
          "location_id": 1,
          "vendor_id": 1,
          "vendor_inventory_item_id": 14,
          "inv_item_id": 1056,
          "inv_event_item_id": 87,
          "invoice_id": 41
        }, {
          "extended_price": "780.00000",
          "unit_price": "10.00000",
          "quantity": "78.000",
          "id": 2,
          "created_by": 138,
          "created_at": "2015-10-03T20:41:41.917Z",
          "updated_by": 138,
          "updated_at": "2015-10-03T20:41:42.476Z",
          "location_id": 1,
          "vendor_id": 1,
          "vendor_inventory_item_id": 14,
          "inv_item_id": 1056,
          "inv_event_item_id": 88,
          "invoice_id": 42
        }
      ]
    },
    settings: {
      invoice_items         : {
        key           : 'wtm_invoice_items',
        default_data  : {
          invoice_id        : null,
          vendor_id         : null,
          vendor_inventory_item_id  : null,
          inv_item_id       : null,
          inv_event_item_id : null,
          quantity          : null,
          unit_price        : null,
          extended_price    : null,
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
          return cakeInvoiceItemsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeInvoiceItemsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();
          deferred.resolve(cakeInvoiceItemsServiceTestsMockedData.invoice_items_response);
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
    service = $injector.get('InvoiceItems');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Invoice Items service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.invoiceItems).to.deep.equal([]);
      expect(service.invoiceItemsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createInvoiceItem should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        "extended_price": "220.00000",
        "unit_price": "10.00000",
        "quantity": "22.000",
        "location_id": 1,
        "vendor_id": 1,
        "vendor_inventory_item_id": 14,
        "inv_item_id": 1056,
        "inv_event_item_id": 87,
        "invoice_id": 41
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('invoice_items'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createInvoiceItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createInvoiceItem should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        "extended_price": "220.00000",
        "unit_price": "10.00000",
        "quantity": "22.000",
        "location_id": 1,
        "vendor_id": 1,
        "vendor_inventory_item_id": 14,
        "inv_item_id": 1056,
        "inv_event_item_id": 87,
        "invoice_id": 41
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('invoice_items'),
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

      service.createInvoiceItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getInvoiceItem should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.invoiceItems = cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results;
      service.invoiceItemsById = _.object(_.pluck(cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results, 'id'), cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results);

      expect(service.getInvoiceItem()).to.deep.equal(service.invoiceItems);
      expect(service.getInvoiceItem(2)).to.deep.equal(service.invoiceItems[1]);

    });

    it('getInvoiceItems should return all cached entries array', function() {

      service.invoiceItems = cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results;

      expect(service.getInvoiceItems()).to.deep.equal(service.invoiceItems);

    });

    it('getInvoiceItemsCollection should return all cached entries collection', function() {

      service.invoiceItemsById = _.object(_.pluck(cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results, 'id'), cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results);

      expect(service.getInvoiceItemsCollection()).to.deep.equal(service.invoiceItemsById);

    });

    it('loadInvoiceItems should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoiceItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.invoiceItems).to.deep.equal(cakeInvoiceItemsServiceTestsMockedData.invoice_items_response.results);
      expect(_.keys(service.invoiceItemsById).length).to.equal(service.invoiceItems.length);
      expect(result).to.deep.equal(cakeInvoiceItemsServiceTestsMockedData.invoice_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadInvoiceItems should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoiceItems(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.invoiceItems).to.deep.equal([]);
      expect(service.invoiceItemsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeInvoiceItemsServiceTestsMockedData.invoice_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadInvoiceItems should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadInvoiceItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.invoiceItems).to.deep.equal([]);
      expect(service.invoiceItemsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeInvoiceItem should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeInvoiceItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeInvoiceItem should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeInvoiceItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateInvoiceItem should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, extended_price: 15, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('invoice_items')
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

      service.updateInvoiceItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateInvoiceItem should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, extended_price: 15, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('invoice_items')
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

      service.updateInvoiceItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('invoice_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});