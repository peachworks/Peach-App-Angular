var expect = chai.expect;
var sandbox = sinon.sandbox.create();

var mockedData = {

  is_user_account_admin       : true,
  is_dev_preview_mode_running : false,
  vendors_response:
  {
    "type":"wtm_vendors",
    "count":8,
    "results":[
      {
        "name":"ABC Beers",
        "contact_last_name":null,
        "country":null,
        "address":"Fight",
        "phone":null,
        "address2":null,
        "city":null,
        "contact_email":null,
        "contact_name":null,
        "notes":null,
        "contact_first_name":null,
        "zip":null,
        "country_id":null,
        "state":"",
        "is_active":true,
        "fax":null,
        "state_id":null,
        "id":17,
        "created_by":44,
        "created_at":"2015-10-13T20:29:38.593Z",
        "updated_by":44,
        "updated_at":"2015-10-14T17:07:48.900Z"
      },
      {
        "name":"ABC Foods",
        "contact_last_name":null,
        "country":null,
        "address":null,
        "phone":null,
        "address2":null,
        "city":null,
        "contact_email":null,
        "contact_name":null,
        "notes":null,
        "contact_first_name":null,
        "zip":null,
        "country_id":null,
        "state":"",
        "is_active":true,
        "fax":null,
        "state_id":null,
        "id":18,
        "created_by":44,
        "created_at":"2015-10-14T00:06:17.806Z",
        "updated_by":null,
        "updated_at":"2015-10-14T00:06:17.806Z"
      },
      {
        "name":"CostLow",
        "contact_last_name":null,
        "country":null,
        "address":"CostLow",
        "phone":null,
        "address2":null,
        "city":"Miami",
        "contact_email":null,
        "contact_name":null,
        "notes":null,
        "contact_first_name":null,
        "zip":"39405",
        "country_id":227,
        "state":"Florida",
        "is_active":true,
        "fax":null,
        "state_id":3464,
        "id":21,
        "created_by":44,
        "created_at":"2015-11-18T19:13:17.319Z",
        "updated_by":44,
        "updated_at":"2015-11-18T19:13:43.593Z"
      },
      {
        "name":"Ice Cream Man",
        "contact_last_name":null,
        "country":null,
        "address":null,
        "phone":null,
        "address2":null,
        "city":null,
        "contact_email":null,
        "contact_name":null,
        "notes":null,
        "contact_first_name":null,
        "zip":null,
        "country_id":null,
        "state":"",
        "is_active":true,
        "fax":null,
        "state_id":null,
        "id":14,
        "created_by":44,
        "created_at":"2015-09-24T17:11:39.095Z",
        "updated_by":44,
        "updated_at":"2015-10-02T14:16:22.179Z"
      },
      {
        "name":"Some test vendor",
        "contact_last_name":"Piper",
        "country":"United States",
        "address":"2600 NW 29th St",
        "phone":"4056408232",
        "address2":"apt 77",
        "city":"Oklahoma City",
        "contact_email":"pp@gmail.com",
        "contact_name":null,
        "notes":"Pie flavor",
        "contact_first_name":"Peter",
        "zip":"73107",
        "country_id":223,
        "state":"Bugiri District",
        "is_active":true,
        "fax":"Who has a fax?",
        "state_id":3394,
        "id":1,
        "created_by":44,
        "created_at":"2015-09-08T12:54:53.735Z",
        "updated_by":44,
        "updated_at":"2015-10-14T20:41:34.635Z"
      },
      {
        "name":"The Muffin Man",
        "contact_last_name":null,
        "country":null,
        "address":"1 Drury Ln",
        "phone":null,
        "address2":null,
        "city":"Orlando",
        "contact_email":null,
        "contact_name":null,
        "notes":null,
        "contact_first_name":null,
        "zip":"76799",
        "country_id":227,
        "state":"Florida",
        "is_active":true,
        "fax":null,
        "state_id":3464,
        "id":12,
        "created_by":44,
        "created_at":"2015-09-24T13:54:06.405Z",
        "updated_by":null,
        "updated_at":"2015-09-24T13:54:06.405Z"
      },
      {
        "name":"The Pie Guy",
        "contact_last_name":null,
        "country":null,
        "address":"999 Sunny Lanne",
        "phone":null,
        "address2":null,
        "city":null,
        "contact_email":null,
        "contact_name":null,
        "notes":null,
        "contact_first_name":null,
        "zip":null,
        "country_id":null,
        "state":"",
        "is_active":true,
        "fax":null,
        "state_id":null,
        "id":6,
        "created_by":44,
        "created_at":"2015-09-21T22:41:28.424Z",
        "updated_by":44,
        "updated_at":"2015-09-24T13:45:52.572Z"
      },
      {
        "name":"US Foods",
        "contact_last_name":"Smith",
        "country":null,
        "address":"123 Main Street",
        "phone":"212-555-1212",
        "address2":"Suite 200",
        "city":"Ann Arbor",
        "contact_email":"ssmith@peachworks.com",
        "contact_name":null,
        "notes":"We buy food from this vendor.",
        "contact_first_name":"Sam",
        "zip":"222222",
        "country_id":227,
        "state":"Michigan",
        "is_active":true,
        "fax":"222-555-1212",
        "state_id":3477,
        "id":11,
        "created_by":44,
        "created_at":"2015-09-23T01:51:06.437Z",
        "updated_by":44,
        "updated_at":"2015-10-15T12:57:10.424Z"
      }
    ]
  },
  vendor_locs_response: {
    "type":"wtm_vendor_locs",
    "count":4,
    "results":[
      {"customer_number":"","id":213,"created_by":44,"created_at":"2015-10-13T20:29:38.710Z","updated_by":44,"updated_at":"2015-11-18T14:13:29.380Z","location_id":7,"vendor_id":17},
      {"customer_number":"","id":221,"created_by":44,"created_at":"2015-10-14T00:06:17.952Z","updated_by":null,"updated_at":"2015-10-14T00:06:17.952Z","location_id":7,"vendor_id":18},
      {"customer_number":"","id":245,"created_by":44,"created_at":"2015-11-18T19:13:17.484Z","updated_by":44,"updated_at":"2015-11-18T19:13:43.677Z","location_id":7,"vendor_id":21},
      {"customer_number":"","id":192,"created_by":44,"created_at":"2015-09-28T11:11:17.883Z","updated_by":44,"updated_at":"2015-10-14T20:41:34.790Z","location_id":7,"vendor_id":1}
    ]
  },
  default_readable_frequency  : {
    short     : 'FreqShort',
    full      : 'FreqFull'
  },
  predefined_frequencies      : {
    'Daily'   : {
      schedule_type     : 'day',
      schedule_interval : 1,
      schedule_days     : null,
      start_date        : moment().startOf('day').format('YYYY-MM-DD'),
      next_date         : null
    },
    'Weekly'  : {
      schedule_type     : 'week',
      schedule_interval : 1,
      schedule_days     : null,
      start_date        : moment().startOf('week').format('YYYY-MM-DD'),
      next_date         : null
    }
  },
  permissions                 : {
    'edit_count_groups' : true
  },
  active_locations            : [
    {
      address1: null,
      address2: null,
      city: null,
      country_id: 227,
      created_at: "2013-11-11T15:33:33.187Z",
      created_by: 44,
      id: 7,
      is_deleted: false,
      name: "Andrei204 NYC",
      number: null,
      org_group_id: null,
      phone: null,
      state_id: 3487,
      tags: null,
      timezone: "America/New_York",
      updated_at: "2015-05-15T19:04:11.105Z",
      updated_by: 138,
      wtm_inv_loc: {
        copied_from: null,
        created_at: "2015-10-08T14:43:58.042Z",
        created_by: 44,
        id: 10,
        is_copied: true,
        location_id: 7,
        updated_at: "2015-10-08T14:43:58.042Z",
        updated_by: null
      }
    }
  ]
};

describe("Controller: Vendors", function() {

  // helper local variables
  var $controller, $log, $rootScope, vm;
  // controller injectables
  var $filter, $location, $peachToast, $q, $timeout, cakeCommon, cakeVendors, cakePermissions, cakeSettings, cakeVendorLocations;


  // initialize app module
  beforeEach(module('cakeApp'));

    
  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

    //$document = $injector.get('$document');
    $filter = $injector.get('$filter');
    $location = $injector.get('$location');
    $peachToast = $injector.get('$peachToast');
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');

    cakeCommon = {
      isUserAccountAdmin: function() {
        var deferred = $q.defer();
        deferred.resolve(mockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return mockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      }
    };

    cakeVendors = {
      loadVendors: function() {
        var deferred = $q.defer();
        deferred.resolve(mockedData.vendors_response);
        return deferred.promise;
      },
      getVendors: function() {
        return mockedData.vendors_response.results;
      },
      getVendorsCollection: function() {
        return _.object(_.pluck(mockedData.vendors_response.results, 'id'), mockedData.vendors_response.results);
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(mockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(mockedData.active_locations);
        return deferred.promise;
      }
    };

    cakeVendorLocations = {
      bulkCreateVendorLocations: function(data) {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      },
      bulkDeleteVendorLocations: function(data) {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      },
      loadVendorLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(mockedData.vendor_locs_response);
        return deferred.promise;
      },
      getVendorLocations: function() {
        return mockedData.vendor_locs_response.results;
      },
    };

    vm = $controller(
      'vendors.js',
      {
        '$filter': $filter,
        '$location': $location,
        '$peachToast': $peachToast,
        '$q': $q,
        '$timeout': $timeout,
        'cakeCommon': cakeCommon,
        'cakeVendors': cakeVendors,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings,
        'cakeVendorLocations': cakeVendorLocations
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});

  }));

  afterEach(function() {

    sandbox.restore();

  });

  describe('Constructor', function() {

    it('should construct a Vendors Controller', function() {

      expect(vm.$filter).to.not.equal(null);
      expect(vm.$location).to.not.equal(null);
      expect(vm.$peachToast).to.not.equal(null);
      expect(vm.$q).to.not.equal(null);
      expect(vm.$timeout).to.not.equal(null);
      expect(vm.cakeCommon).to.not.equal(null);
      expect(vm.cakeVendors).to.not.equal(null);
      expect(vm.cakePermissions).to.not.equal(null);
      expect(vm.cakeSettings).to.not.equal(null);
      expect(vm.cakeVendorLocations).to.not.equal(null);

      expect(vm.blockers).to.have.property('api_processing');
      
      expect(vm.pagination).to.deep.equal({'limit': 100, 'page_no': 1, 'total_items': 0});
      expect(vm.paginationLimits).to.deep.equal([100]);
      expect(vm.requestParams).to.deep.equal({});
      expect(vm.filters).to.deep.equal({ 'show_inactive_items' : false, 'location_id' : null });
      expect(vm.searchParams).to.deep.equal({'searchQuery': ''});

      expect(vm.accountLocations).to.deep.equal([]);
      expect(vm.activeLocations).to.deep.equal([]);
      expect(vm.activeLocationsById).to.deep.equal({});
      expect(vm.canEditVendors).to.be.equal(false);
      expect(vm.isAccountAdmin).to.be.equal(false);
      expect(vm.isDeveloperMode).to.be.equal(false);
      expect(vm.isSingleLocationAccount).to.be.equal(true);
      expect(vm.vendors).to.deep.equal([]);
      expect(vm.vendorsById).to.deep.equal({});
      expect(vm.userInfo).to.deep.equal( {message: '',type: ''});

    });

  });


 describe('Functions', function() {

    it('vm.activate should set up correct controller properties', function() {

      var spyCakeCommonDevMode = sandbox.spy(vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(vm.cakePermissions, 'userHasPermission');

      vm.activate();

      expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(spyCakePermissions.calledOnce).to.equal(true);
      expect(vm.blockers.api_processing).to.equal(true);
      expect(vm.blockers.table_updating).to.equal(true);

      $rootScope.$digest();
      
      expect(vm.activeLocations).to.equal(mockedData.active_locations);
      expect(_.keys(vm.activeLocationsById).length).to.equal(mockedData.active_locations.length);
      expect(vm.isAccountAdmin).to.equal(mockedData.is_user_account_admin);
      expect(vm.isDeveloperMode).to.equal(mockedData.is_dev_preview_mode_running);
      expect(vm.canEditVendors).to.equal(mockedData.permissions.edit_vendors);


      expect(vm.vendors.length).to.equal(mockedData.vendors_response.count);
      expect(vm.blockers.api_processing).to.equal(false);
    
    });
    it('vm.activate should display error if data not loaded properly from services', function() {

      var spyCakeCommonUserAdmin = sandbox.stub(vm.cakeCommon, 'isUserAccountAdmin', function() {
        var deferred = $q.defer();
        deferred.reject('api error');
        return deferred.promise;
      });
      var spyErrorHandler = sandbox.spy(vm, 'errorHandler');
      var spyShowMessage = sandbox.spy(vm, 'showMessage');

      vm.activate();

      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();
      
      expect(spyErrorHandler.calledWithExactly('api error')).to.equal(true);
      expect(spyShowMessage.calledWithExactly('There was an error: api error', 'alert')).to.equal(true);

    });

    it('vm.errorHandler should display message, eventually log message and call callback', function() {
      var spyCallback = sandbox.stub();
      var spyCakeCommonAPIError = sandbox.spy(vm.cakeCommon, 'apiErrorHandler');
      var spyShowMessage = sandbox.spy(vm, 'showMessage');
      var messageString = 'some error message';
      var messageObject = {someval: 1}; 

      vm.errorHandler(messageString);

      expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(0);
      expect(spyCallback.callCount).to.equal(0);
      expect(errorLogStub.callCount).to.equal(0);

      vm.errorHandler(messageObject);

      expect(spyShowMessage.calledWithExactly('There was an error, please check console log for more details.', 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(0);
      expect(spyCallback.callCount).to.equal(0);
      expect(errorLogStub.callCount).to.equal(0);

      vm.errorHandler(messageString, true);

      expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(1);
      expect(spyCallback.callCount).to.equal(0);
      expect(errorLogStub.callCount).to.equal(1);

      vm.errorHandler(messageString, true, spyCallback);

      expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(2);
      expect(spyCallback.callCount).to.equal(1);
      expect(errorLogStub.callCount).to.equal(2);

    });

    it('vm.hideMessage should clear user message data', function() {

      vm.userInfo = {message: 'message',type: 'error'};

      vm.hideMessage();

      expect(vm.userInfo.message).to.equal('');
      expect(vm.userInfo.type).to.equal('');

    });

    it('vm.showMessage should set user message data accoring to params', function() {
      var messageString = 'some message';
      var typeString = 'alert';
      var defaultType = 'info'

      vm.hideMessage();
      vm.showMessage(messageString);

      expect(vm.userInfo.message).to.equal(messageString);
      expect(vm.userInfo.type).to.equal(defaultType);

      vm.hideMessage();
      vm.showMessage(messageString, typeString);

      expect(vm.userInfo.message).to.equal(messageString);
      expect(vm.userInfo.type).to.equal(typeString);

    });

    it('vm.onPaginationChangeCallback should build params for api requests and load new page of data', function() {
      var spyCakeVendorsLoad = sandbox.spy(vm.cakeVendors, 'loadVendors');
      var spyCakeVendorLocationsLoad = sandbox.spy(vm.cakeVendorLocations, 'loadVendorLocations');

      vm.pagination.page_no = 1;
      vm.pagination.limit = 20;
      vm.searchParams.searchQuery = 'test';

      vm.onPaginationChangeCallback();

      expect(vm.blockers.api_processing).to.be.true;

      $rootScope.$digest();
      var findParams = vm.requestParams.find || null;
      var otherParams = _.omit(vm.requestParams, 'find');
      expect(spyCakeVendorsLoad.calledWith(findParams, otherParams)).to.be.true;
      expect(spyCakeVendorLocationsLoad.calledWith({'$and': [{'location_id': _.pluck(vm.activeLocations, 'id') }, {'vendor_id': _.keys(vm.cakeVendors.getVendorsCollection())}]})).to.be.true;

      expect(vm.pagination.total_items).to.equal(mockedData.vendors_response.count);
      expect(vm.vendors.length).to.equal(mockedData.vendors_response.count);

      expect(vm.blockers.api_processing).to.be.false;

    });

    it('vm.onSearchPhraseUpdateCallback should set page number to 1 and call vm.filterTable', function() {

      var spyShowMessage = sandbox.spy(vm, 'filterTable');

      vm.pagination.page_no = 10;

      vm.onSearchPhraseUpdateCallback();

      expect(vm.pagination.page_no).to.equal(1);
      expect(spyShowMessage.called).to.be.true;
    });

    it('vm.openEditVendorModall should redirect to edit vendor page', function() {

      var vendorId = 10;

      vm.openEditVendorModal(vendorId);

      expect(vm.$location.path()).to.be.equal('/settings/edit_vendor');
      expect(vm.$location.search()['id']).to.be.equal(vendorId);

    });

    it('vm.openBulkEdit should set bulkEdit.is_enabled to true and set bulkEdit.show_form to true', function() {

      vm.openBulkEdit();

      expect(vm.bulkEdit.is_enabled).to.be.true;
      expect(vm.bulkEdit.show_form).to.be.true;

    });

    it('vm.toggleInactiveVendors  should set filters.show_inactive_items to its negated value and call loadTablePageData', function() {

      var show_inactive_items = vm.filters.show_inactive_items;
      var spyLoadTablePageData = sandbox.spy(vm, 'loadTablePageData');

      vm.toggleInactiveVendors();
      expect(vm.filters.show_inactive_items).to.be.equal(!show_inactive_items);
      expect(spyLoadTablePageData.called).to.be.true;

    });

  });

});