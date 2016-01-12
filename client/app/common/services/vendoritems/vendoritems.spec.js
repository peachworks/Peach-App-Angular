describe('Service: Vendor Items', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeVendorItemsServiceTestsMockedData = {
    vendor_items_response : {
      count: 2,
      results: [
        {
          "last_price": "10.00000",
          "number": "AE 1223",
          "pack_size": "16 Blocks",
          "description": "16 Block pack",
          "is_active": false,
          "last_price_on": "2015-11-16",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-09-10T10:48:02.706Z",
          "updated_by": 44,
          "updated_at": "2015-11-17T10:10:16.043Z",
          "vendor_id": 1,
          "inv_item_id": 1056,
          "inv_item_unit_id": 3912
        }, {
          "last_price": "30.00000",
          "number": "RA 4454",
          "pack_size": null,
          "description": "some desc ed",
          "is_active": false,
          "last_price_on": "2015-08-30",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-09-22T13:29:23.460Z",
          "updated_by": 44,
          "updated_at": "2015-11-13T15:19:13.128Z",
          "vendor_id": 1,
          "inv_item_id": 1056,
          "inv_item_unit_id": 3847
        }
      ]
    },
    settings: {
      vendor_items          : {
        key           : 'wtm_vendor_inv_items',
        default_data  : {
          vendor_id         : null,
          inv_item_id       : null,
          inv_item_unit_id  : null,
          description       : null,
          number            : null,
          pack_size         : null,
          is_active         : true,
          last_price        : null,
          last_price_on     : null
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
          return cakeVendorItemsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeVendorItemsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeVendorItemsServiceTestsMockedData.vendor_items_response);
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
    service = $injector.get('VendorItems');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Vendor Items service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.vendorItems).to.deep.equal([]);
      expect(service.vendorItemsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('bulkCreateVendorItems should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"vendor_id": 1, "inv_item_id": 1, "inv_item_unit_id": 1},
        {"vendor_id": 2, "inv_item_id": 2, "inv_item_unit_id": 2}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateVendorItems should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateVendorItems should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {"vendor_id": 1, "inv_item_id": 1, "inv_item_unit_id": 1},
        {"vendor_id": 2, "inv_item_id": 2, "inv_item_unit_id": 2}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteVendorItems should use given data to remove entries from db using api bulk request - api success scenario with array of data given', function() {

      var testData = [1, 2];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteVendorItems should use given data to remove entries from db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteVendorItems should use given data to remove entries from db using api bulk request - api error scenario', function() {

      var testData = [1, 2];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkUpdateVendorItems should use given data to update entries in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {"id": 1, "vendor_id": 2},
        {"id": 2, "vendor_id": 1}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateVendorItems should use given data to update entries in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateVendorItems should use given data to update entries in db using api bulk request - api error scenario', function() {

      var testData = [
        {"id": 1, "vendor_id": 2},
        {"id": 2, "vendor_id": 1}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateVendorItems(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('createVendorItem should use given data to create entry in db using api - api success scenario', function() {

      var testData = {"vendor_id": 1, "inv_item_id": 1, "inv_item_unit_id": 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('vendor_items'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createVendorItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendor_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createVendorItem should use given data to create entry in db using api - api error scenario', function() {

      var testData = {"vendor_id": 1, "inv_item_id": 1, "inv_item_unit_id": 1};
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('vendor_items'),
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

      service.createVendorItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendor_items')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('deleteVendorItem should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.deleteVendorItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('deleteVendorItem should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.deleteVendorItem(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getVendorItem should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.vendorItems = cakeVendorItemsServiceTestsMockedData.vendor_items_response.results;
      service.vendorItemsById = _.object(_.pluck(cakeVendorItemsServiceTestsMockedData.vendor_items_response.results, 'id'), cakeVendorItemsServiceTestsMockedData.vendor_items_response.results);

      expect(service.getVendorItem()).to.deep.equal(service.vendorItems);
      expect(service.getVendorItem(2)).to.deep.equal(service.vendorItems[1]);

    });

    it('getVendorItems should return all cached entries array', function() {

      service.vendorItems = cakeVendorItemsServiceTestsMockedData.vendor_items_response.results;

      expect(service.getVendorItems()).to.deep.equal(service.vendorItems);

    });

    it('getVendorItemsCollection should return all cached entries collection', function() {

       service.vendorItemsById = _.object(_.pluck(cakeVendorItemsServiceTestsMockedData.vendor_items_response.results, 'id'), cakeVendorItemsServiceTestsMockedData.vendor_items_response.results);

      expect(service.getVendorItemsCollection()).to.deep.equal(service.vendorItemsById);

    });

    it('loadVendorItems should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadVendorItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.vendorItems).to.deep.equal(cakeVendorItemsServiceTestsMockedData.vendor_items_response.results);
      expect(_.keys(service.vendorItemsById).length).to.equal(service.vendorItems.length);
      expect(result).to.deep.equal(cakeVendorItemsServiceTestsMockedData.vendor_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadVendorItems should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadVendorItems(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.vendorItems).to.deep.equal([]);
      expect(service.vendorItemsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeVendorItemsServiceTestsMockedData.vendor_items_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadVendorItems should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadVendorItems(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.vendorItems).to.deep.equal([]);
      expect(service.vendorItemsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateVendorItem should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, vendor_id: 3, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('vendor_items')
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

      service.updateVendorItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendor_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateVendorItem should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, vendor_id: 3, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('vendor_items')
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

      service.updateVendorItem(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('vendor_items')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});