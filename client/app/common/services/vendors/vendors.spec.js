describe('Service: Vendors', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeVendorsServiceTestsMockedData = {
    vendors_response : {
      count: 2,
      results: [
        {
          "name": "Some test vendor",
          "contact_last_name": "Piper",
          "country": "United States",
          "address": "2600 NW 29th St",
          "phone": "4056408232",
          "address2": "apt 77",
          "city": "Oklahoma City",
          "contact_email": "pp@gmail.com",
          "contact_name": null,
          "notes": "Pie flavor",
          "contact_first_name": "Peter",
          "zip": "73107",
          "country_id": 223,
          "state": "Bugiri District",
          "is_active": true,
          "fax": "Who has a fax?",
          "state_id": 3394,
          "id": 1,
          "created_by": 44,
          "created_at": "2015-09-08T12:54:53.735Z",
          "updated_by": 44,
          "updated_at": "2015-10-14T20:41:34.635Z"
        }, {
          "name": "US Foods",
          "contact_last_name": null,
          "country": null,
          "address": null,
          "phone": null,
          "address2": null,
          "city": null,
          "contact_email": null,
          "contact_name": null,
          "notes": null,
          "contact_first_name": null,
          "zip": null,
          "country_id": null,
          "state": "",
          "is_active": false,
          "fax": null,
          "state_id": null,
          "id": 2,
          "created_by": 44,
          "created_at": "2015-09-14T18:19:06.333Z",
          "updated_by": 44,
          "updated_at": "2015-09-25T13:32:46.859Z"
        }
      ]
    },
    settings: {
      vendors               : {
        key           : 'wtm_vendors',
        default_data  : {
          name              : null,
          address           : null,
          address2          : null,
          city              : null,
          state             : null,
          state_id          : null,
          country           : null,
          country_id        : null,
          zip               : null,
          phone             : null,
          fax               : null,
          contact_email     : null,
          contact_name      : null,
          contact_first_name : null,
          contact_last_name : null,
          contact_mobile    : null,
          notes             : null,
          is_active         : false
        }
      }
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon, cakeInvoiceItems;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('cakeCommon', {
        getObjectKey: function(key) {
          return cakeVendorsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeVendorsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();
          deferred.resolve(cakeVendorsServiceTestsMockedData.vendors_response);
          return deferred.promise;
        },
        apiErrorHandler: function() {}
      });

      $provide.value('cakeInvoiceItems', {
        loadInvoiceItems: function() {}
      });

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    cakeInvoiceItems = $injector.get('cakeInvoiceItems');
    service = $injector.get('Vendors');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Vendors service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;
      expect(service.cakeInvoiceItems).to.exist;

      expect(service.vendors).to.deep.equal([]);
      expect(service.vendorsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('createVendor should use given data to create entry in db using api - api success scenario', function() {

      var testData = {'name': 'test'};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('vendors'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createVendor(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendors')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createVendor should use given data to create entry in db using api - api error scenario', function() {

      var testData = {'name': 'test'};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('vendors'),
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

      service.createVendor(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendors')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getVendor should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.vendors = cakeVendorsServiceTestsMockedData.vendors_response.results;
      service.vendorsById = _.object(_.pluck(cakeVendorsServiceTestsMockedData.vendors_response.results, 'id'), cakeVendorsServiceTestsMockedData.vendors_response.results);

      expect(service.getVendor()).to.deep.equal(service.vendors);
      expect(service.getVendor(2)).to.deep.equal(service.vendors[1]);

    });

    it('getVendors should return all cached entries array', function() {

      service.vendors = cakeVendorsServiceTestsMockedData.vendors_response.results;

      expect(service.getVendors()).to.deep.equal(service.vendors);

    });

    it('getVendorsCollection should return all cached entries collection', function() {

      service.vendorsById = _.object(_.pluck(cakeVendorsServiceTestsMockedData.vendors_response.results, 'id'), cakeVendorsServiceTestsMockedData.vendors_response.results);

      expect(service.getVendorsCollection()).to.deep.equal(service.vendorsById);

    });

    it('loadVendors should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadVendors(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.vendors).to.deep.equal(cakeVendorsServiceTestsMockedData.vendors_response.results);
      expect(_.keys(service.vendorsById).length).to.equal(service.vendors.length);
      expect(result).to.deep.equal(cakeVendorsServiceTestsMockedData.vendors_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadVendors should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadVendors(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.vendors).to.deep.equal([]);
      expect(service.vendorsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeVendorsServiceTestsMockedData.vendors_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadVendors should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadVendors(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.vendors).to.deep.equal([]);
      expect(service.vendorsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeVendor should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeVendor(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeVendor should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeVendor(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateVendor should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, address: 'test', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('vendors')
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

      service.updateVendor(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendors')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed, {extended: true}).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateVendor should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, address: 'test', some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('vendors')
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

      service.updateVendor(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendors')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed, {extended: true}).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('canVendorBeDeleted should use cakeInvoiceItems to check if there arent any related entries - there are some entries scenario', function() {

      var testId = 1;
      var testInvoiceItemsResponse = {results: [{id: 1}]};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testInvoiceItemsResponse);
      var mockInvoiceItems = sandbox.mock(service.cakeInvoiceItems);
      var invoiceItemsGetExpectation = mockInvoiceItems.expects('loadInvoiceItems').returns(deferred.promise);

      service.canVendorBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(invoiceItemsGetExpectation.withExactArgs({vendor_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(result).to.equal(testInvoiceItemsResponse.results.length > 0 ? false : true);

    });

    it('canVendorBeDeleted should use cakeInvoiceItems to check if there arent any related entries - there are no entries scenario', function() {

      var testId = 1;
      var testInvoiceItemsResponse = {results: []};
      var result;

      var deferred = $q.defer();
          deferred.resolve(testInvoiceItemsResponse);
      var mockInvoiceItems = sandbox.mock(service.cakeInvoiceItems);
      var invoiceItemsGetExpectation = mockInvoiceItems.expects('loadInvoiceItems').returns(deferred.promise);

      service.canVendorBeDeleted(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(invoiceItemsGetExpectation.withExactArgs({vendor_id: testId}, {limit: 1}).verify()).to.equal(true);
      expect(result).to.equal(testInvoiceItemsResponse.results.length > 0 ? false : true);

    });

  });

});