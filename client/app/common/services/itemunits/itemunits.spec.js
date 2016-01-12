describe('Service: Item Units', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeItemUnitsServiceTestsMockedData = {
    response : {
      count: 2,
      results: [
        {
          common_unit_id: 15,
          created_at: "2015-12-04T16:49:51.786Z",
          created_by: 44,
          description: "Batch 2 floz",
          id: 1,
          inv_item_id: 1056,
          is_active: true,
          is_report_unit: false,
          is_wv_conversion: false,
          pack_size: null,
          unit_id: 3,
          unit_quantity: "2.00000",
          updated_at: "2015-12-04T17:12:19.107Z",
          updated_by: 44
        },
        {
          common_unit_id: 15,
          created_at: "2015-12-04T16:49:51.786Z",
          created_by: 44,
          description: "Bottle 15 floz",
          id: 2,
          inv_item_id: 1056,
          is_active: true,
          is_report_unit: false,
          is_wv_conversion: false,
          pack_size: null,
          unit_id: 2,
          unit_quantity: "15.00000",
          updated_at: "2015-12-04T17:12:19.107Z",
          updated_by: 44
        }
      ]
    },
    settings: {
      item_units            : {
        key           : 'wtm_inv_item_units',
        default_data  : {
          inv_item_id       : null,
          unit_id           : null,
          common_unit_id    : null,
          description       : null,
          pack_size         : null,
          is_report_unit    : false,
          is_wv_conversion  : false,
          unit_quantity     : null
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
          return cakeItemUnitsServiceTestsMockedData.settings[key]['key'];
        },
        getObjectDefaultData: function(key) {
          return cakeItemUnitsServiceTestsMockedData.settings[key]['default_data'];
        },
        makeAutoPaginatedGETRequest: function(resource) {
          var deferred = $q.defer();
          deferred.resolve(cakeItemUnitsServiceTestsMockedData.response);
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
    service = $injector.get('ItemUnits');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Item Units service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.itemUnits).to.deep.equal([]);
      expect(service.itemUnitsById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('bulkCreateItemUnits should use given data to create entry in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {inv_item_id: 1, unit_id: 1, common_unit_id: 15, unit_quantity: 20},
        {inv_item_id: 1, unit_id: 2, common_unit_id: 15, unit_quantity: 10}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateItemUnits should use given data to create entry in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkCreateItemUnits should use given data to create entry in db using api bulk request - api error scenario', function() {

      var testData = [
        {inv_item_id: 1, unit_id: 1, common_unit_id: 15, unit_quantity: 20},
        {inv_item_id: 1, unit_id: 2, common_unit_id: 15, unit_quantity: 10}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.bulkCreateItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkDeleteItemUnits should use given data to remove entries from db using api bulk request - api success scenario with array of data given', function() {

      var testData = [1, 2];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemUnits should use given data to remove entries from db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkDeleteItemUnits should use given data to remove entries from db using api bulk request - api error scenario', function() {

      var testData = [1, 2];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.bulkDeleteItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('bulkUpdateItemUnits should use given data to update entries in db using api bulk request - api success scenario with array of data given', function() {

      var testData = [
        {id: 1, unit_quantity: 5},
        {id: 2, unit_quantity: 55}
      ];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve({collection: testData});
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItemUnits should use given data to update entries in db using api bulk request - api success scenario with empty array of data given', function() {

      var testData = [];
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testData);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.never().verify()).to.equal(true);
      expect(result).to.deep.equal({collection: testData});
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('bulkUpdateItemUnits should use given data to update entries in db using api bulk request - api error scenario', function() {

      var testData = [
        {id: 1, unit_quantity: 5},
        {id: 2, unit_quantity: 55}
      ];
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.bulkUpdateItemUnits(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceCreateExpectation.withExactArgs(testData).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('createItemUnit should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        inv_item_id       : 1,
        unit_id           : 1,
        common_unit_id    : 15,
        unit_quantity     : 20
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('item_units'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createItemUnit(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_units')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed, null).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createItemUnit should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        inv_item_id       : 1,
        unit_id           : 1,
        common_unit_id    : 15,
        unit_quantity     : 20
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('item_units'),
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

      service.createItemUnit(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_units')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed, null).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('deleteItemUnit should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.deleteItemUnit(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('deleteItemUnit should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {message: 'api error'};
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.deleteItemUnit(testId).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getItemUnit should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.itemUnits = cakeItemUnitsServiceTestsMockedData.response.results;
      service.itemUnitsById = _.object(_.pluck(cakeItemUnitsServiceTestsMockedData.response.results, 'id'), cakeItemUnitsServiceTestsMockedData.response.results);

      expect(service.getItemUnit()).to.deep.equal(service.itemUnits);
      expect(service.getItemUnit(2)).to.deep.equal(service.itemUnits[1]);

    });

    it('getItemUnits should return all cached entries array', function() {

      service.itemUnits = cakeItemUnitsServiceTestsMockedData.response.results;

      expect(service.getItemUnits()).to.deep.equal(service.itemUnits);

    });

    it('getItemUnitsCollection should return all cached entries collection', function() {

      service.itemUnitsById = _.object(_.pluck(cakeItemUnitsServiceTestsMockedData.response.results, 'id'), cakeItemUnitsServiceTestsMockedData.response.results);

      expect(service.getItemUnitsCollection()).to.deep.equal(service.itemUnitsById);

    });

    it('loadItemUnits should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadItemUnits(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.itemUnits).to.deep.equal(cakeItemUnitsServiceTestsMockedData.response.results);
      expect(_.keys(service.itemUnitsById).length).to.equal(service.itemUnits.length);
      expect(result).to.deep.equal(cakeItemUnitsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItemUnits should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadItemUnits(testFindParams, testOtherParams, true).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.itemUnits).to.deep.equal([]);
      expect(service.itemUnitsById).to.deep.equal({});
      expect(result).to.deep.equal(cakeItemUnitsServiceTestsMockedData.response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadItemUnits should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadItemUnits(testFindParams, testOtherParams).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.itemUnits).to.deep.equal([]);
      expect(service.itemUnitsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateItemUnit should use given data to update entry in db using api - api success scenario', function() {

      var testData = {id: 1, unit_quantity: 20, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('item_units')
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

      service.updateItemUnit(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_units')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateItemUnit should use given data to update entry in db using api - api error scenario', function() {

      var testData = {id: 1, unit_quantity: 20, some_junk_field: true};
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('item_units')
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

      service.updateItemUnit(testData).then(function(response) { result = response; }, function(error) { result = error; });
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('item_units')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});