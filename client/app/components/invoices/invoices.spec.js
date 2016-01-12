describe("Controller: Invoices", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var invoicesControllerTestsMockedData = {
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    invoices_response           : {
      count: 3,
      results: [
        {
          "invoice_number": null,
          "is_complete": true,
          "receipt_date": "2015-11-16",
          "invoice_date": "2015-11-16",
          "total": "803.00",
          "id": 1,
          "created_by": 44,
          "created_at": "2015-11-16T13:57:53.728Z",
          "updated_by": 44,
          "updated_at": "2015-11-30T14:28:37.687Z",
          "location_id": 7,
          "vendor_id": 1,
          "inv_event_id": 79
        }, {
          "invoice_number": "00002ed",
          "is_complete": false,
          "receipt_date": "2015-10-13",
          "invoice_date": "2015-10-20",
          "total": "1990.00",
          "id": 2,
          "created_by": 44,
          "created_at": "2015-10-19T13:00:27.277Z",
          "updated_by": 44,
          "updated_at": "2015-12-01T12:10:31.785Z",
          "location_id": 7,
          "vendor_id": 18,
          "inv_event_id": 58
        }, {
          "invoice_number": "00002ed3",
          "is_complete": false,
          "receipt_date": "2015-10-13",
          "invoice_date": "2015-10-20",
          "total": "0.00",
          "id": 3,
          "created_by": 44,
          "created_at": "2015-10-19T13:00:27.277Z",
          "updated_by": 44,
          "updated_at": "2015-12-01T12:10:31.785Z",
          "location_id": 7,
          "vendor_id": 999,
          "inv_event_id": 70
        }
      ]
    },
    vendors_response            : {
      count: 2,
      results: [
        {
          "name": "Some test vendor1",
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
          "name": "ABC Foods",
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
          "is_active": true,
          "fax": null,
          "state_id": null,
          "id": 18,
          "created_by": 44,
          "created_at": "2015-10-14T00:06:17.806Z",
          "updated_by": null,
          "updated_at": "2015-10-14T00:06:17.806Z"
        }
      ]
    },
    permissions                 : {
      'edit_invoices' : true
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

  // helper local variables
  var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub;
  // controller injectables
  var $document, $filter, $location, $peach, $q, cakeCommon, cakeInvoices, cakePermissions, cakeSettings, cakeVendors;


  // initialize app module
  beforeEach(module('cakeApp'));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

    $filter = $injector.get('$filter');
    $location = $injector.get('$location');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');

    $document = [
      {
        getElementById: function() {
          return {
            scrollTop: 0
          }
        }
      }
    ];

    cakeCommon = {
      isUserAccountAdmin: function() {
        var deferred = $q.defer();
        deferred.resolve(invoicesControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return invoicesControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      },
      parseCakeCostFloatValue: function(value, defaultValue, fractionSize) {
        defaultValue = _.isUndefined(defaultValue) ? '0.00' : defaultValue;
        fractionSize = _.isUndefined(fractionSize) ? null : fractionSize;
        if (!_.isUndefined(value) && !_.isNull(value)) {
          return fractionSize !== null ? Big(value).round(fractionSize).toFixed(fractionSize) : Big(value).toFixed(5).replace(/0{0,3}$/, "");
        } else {
          return defaultValue;
        }
      }
    };

    cakeInvoices = {
      loadInvoices: function() {
        var deferred = $q.defer();
        deferred.resolve(invoicesControllerTestsMockedData.invoices_response);
        return deferred.promise;
      },
      getInvoices: function() {
        return invoicesControllerTestsMockedData.invoices_response.results;
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(invoicesControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(invoicesControllerTestsMockedData.active_locations);
        return deferred.promise;
      }
    };

    cakeVendors = {
      loadVendors: function() {
        var deferred = $q.defer();
        deferred.resolve(invoicesControllerTestsMockedData.vendors_response);
        return deferred.promise;
      },
      getVendors: function() {
        return invoicesControllerTestsMockedData.vendors_response.results;
      },
      getVendorsCollection: function() {
        return _.object(_.pluck(invoicesControllerTestsMockedData.vendors_response.results, 'id'), invoicesControllerTestsMockedData.vendors_response.results);
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'invoices.js as vm',
      {
        '$scope': controllerScope,
        '$document': $document,
        '$filter': $filter,
        '$location': $location,
        '$peach': $peach,
        '$q': $q,
        'cakeCommon': cakeCommon,
        'cakeInvoices': cakeInvoices,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings,
        'cakeVendors': cakeVendors
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});

  }));

  afterEach(function() {

    sandbox.restore();

  });

  describe('Constructor', function() {

    it('should construct Invoices Controller', function() {

      expect(controllerScope.vm.$document).to.exist;
      expect(controllerScope.vm.$filter).to.exist;
      expect(controllerScope.vm.$location).to.exist;
      expect(controllerScope.vm.$peach).to.exist;
      expect(controllerScope.vm.$q).to.exist;
      expect(controllerScope.vm.cakeCommon).to.exist;
      expect(controllerScope.vm.cakeInvoices).to.exist;
      expect(controllerScope.vm.cakePermissions).to.exist;
      expect(controllerScope.vm.cakeSettings).to.exist;
      expect(controllerScope.vm.cakeVendors).to.exist;

      expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'initializing', 'no_location']);

      expect(controllerScope.vm.headerOptions).to.deep.equal([{'callback': controllerScope.vm.openNewInvoiceModal, 'label': 'Add Invoice'}]);

      expect(controllerScope.vm.pagination).to.deep.equal({'limit': 50, 'page_no': 1, 'total_items': 0});
      expect(controllerScope.vm.paginationLimits).to.deep.equal([50]);
      expect(controllerScope.vm.requestParams).to.deep.equal({});
      expect(controllerScope.vm.filters).to.deep.equal({'location_id': null});
      expect(controllerScope.vm.searchParams).to.deep.equal({'searchQuery': ''});

      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.canEditInvoices).to.equal(false);
      expect(controllerScope.vm.invoices).to.deep.equal([]);
      expect(controllerScope.vm.invoicesById).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.vendors).to.deep.equal([]);
      expect(controllerScope.vm.vendorsById).to.deep.equal({});

      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

    });

  });

  describe('Activate function', function() {

    it('activate should set up correct controller properties - no location selected scenario', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyPeachSession = sandbox.spy(controllerScope.vm.$peach.session, 'getActiveLocation');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_invoices')).to.equal(true);
      expect(spyCakeVendorsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.activeLocations).to.equal(invoicesControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(invoicesControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(invoicesControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(invoicesControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditInvoices).to.equal(invoicesControllerTestsMockedData.permissions.edit_invoices);

      expect(controllerScope.vm.vendors).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(spyPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.invoices).to.deep.equal([]);
      expect(controllerScope.vm.invoicesById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.initializing).to.equal(true);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);

    });

    it('activate should set up correct controller properties - not cake active location selected scenario', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return 5; });

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_invoices')).to.equal(true);
      expect(spyCakeVendorsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.activeLocations).to.equal(invoicesControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(invoicesControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(invoicesControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(invoicesControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditInvoices).to.equal(invoicesControllerTestsMockedData.permissions.edit_invoices);

      expect(controllerScope.vm.vendors).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.invoices).to.deep.equal([]);
      expect(controllerScope.vm.invoicesById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);
      expect(spyShowMessage.calledWithExactly('Selected location is not an active Cake location.')).to.equal(true);
      expect(spyHideMessage.called).to.equal(false);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.initializing).to.equal(true);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);

    });

    it('activate should set up correct controller properties - cake active location selected scenario', function() {

      var locationId = 7;
      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
      var spyCakeInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_invoices')).to.equal(true);
      expect(spyCakeVendorsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.activeLocations).to.equal(invoicesControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(invoicesControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(invoicesControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(invoicesControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditInvoices).to.equal(invoicesControllerTestsMockedData.permissions.edit_invoices);

      expect(controllerScope.vm.vendors).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(spyPaginationChange.called).to.equal(true);
      expect(spyShowMessage.called).to.equal(false);
      expect(spyCakeInvoicesLoad.calledWith(
        {'$and': [
            {'location_id': locationId}
          ]
        },
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-receipt_date,-created_at'}
      )).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(locationId);
      expect(controllerScope.vm.invoices.length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1); // one invoice will get removed because it doesnt have active vendor
      expect(controllerScope.vm.pagination.total_items).to.equal(invoicesControllerTestsMockedData.invoices_response.count);
      expect(spyHideMessage.called).to.equal(true);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.initializing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(false);

    });

    it('activate should display error if data not loaded properly from services', function() {

      var spyCakeCommonUserAdmin = sandbox.stub(controllerScope.vm.cakeCommon, 'isUserAccountAdmin', function() {
        var deferred = $q.defer();
        deferred.reject('api error');
        return deferred.promise;
      });
      var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');

      controllerScope.vm.activate();

      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(spyErrorHandler.calledWithExactly('api error')).to.equal(true);
      expect(spyShowMessage.calledWithExactly('There was an error: api error', 'alert')).to.equal(true);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.canEditInvoices).to.equal(false);

    });

  });

 describe('Functions', function() {

     it('errorHandler should display message, eventually log message and call callback', function() {

      var spyCallback = sandbox.stub();
      var spyCakeCommonAPIError = sandbox.spy(controllerScope.vm.cakeCommon, 'apiErrorHandler');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var messageString = 'some error message';
      var messageObject = {someval: 1};

      controllerScope.vm.errorHandler(messageString);

      expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(0);
      expect(spyCallback.callCount).to.equal(0);
      expect(errorLogStub.callCount).to.equal(0);

      controllerScope.vm.errorHandler(messageObject);

      expect(spyShowMessage.calledWithExactly('There was an error, please check console log for more details.', 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(0);
      expect(spyCallback.callCount).to.equal(0);
      expect(errorLogStub.callCount).to.equal(0);

      controllerScope.vm.errorHandler(messageString, true);

      expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(1);
      expect(spyCallback.callCount).to.equal(0);
      expect(errorLogStub.callCount).to.equal(1);

      controllerScope.vm.errorHandler(messageString, true, spyCallback);

      expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
      expect(spyCakeCommonAPIError.callCount).to.equal(2);
      expect(spyCallback.callCount).to.equal(1);
      expect(errorLogStub.callCount).to.equal(2);

    });

    it('hideMessage should clear user message data', function() {

      controllerScope.vm.userInfo = {message: 'message',type: 'error'};

      controllerScope.vm.hideMessage();

      expect(controllerScope.vm.userInfo.message).to.equal('');
      expect(controllerScope.vm.userInfo.type).to.equal('');

    });

    it('showMessage should set user message data accoring to params', function() {

      var messageString = 'some message';
      var typeString = 'alert';
      var defaultType = 'info'

      controllerScope.vm.hideMessage();
      controllerScope.vm.showMessage(messageString);

      expect(controllerScope.vm.userInfo.message).to.equal(messageString);
      expect(controllerScope.vm.userInfo.type).to.equal(defaultType);

      controllerScope.vm.hideMessage();
      controllerScope.vm.showMessage(messageString, typeString);

      expect(controllerScope.vm.userInfo.message).to.equal(messageString);
      expect(controllerScope.vm.userInfo.type).to.equal(typeString);

    });

    it('onPaginationChangeCallback should do nothing when no location selected', function() {

      controllerScope.vm.filters.location_id = null;

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.invoices).to.deep.equal([]);
      expect(controllerScope.vm.invoicesById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data - no search phrase scenario', function() {

      var locationId = 7;
      var spyInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(spyInvoicesLoad.calledWithExactly(
        {'$and': [{location_id: locationId}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-receipt_date,-created_at'}
      )).to.equal(true);

      expect(controllerScope.vm.invoices.length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1); // one invoice doesnt have vendor - we dont parse it
      expect(_.keys(controllerScope.vm.invoicesById).length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1);

      expect(controllerScope.vm.invoices[0]).to.contain.all.keys(['vendor', 'vendor_name', 'date_formatted', 'total_formatted']);

      expect(controllerScope.vm.invoices[1]['date_formatted']).to.equal(controllerScope.vm.invoices[1]['receipt_date'] ? moment(controllerScope.vm.invoices[1]['receipt_date'], 'YYYY-MM-DD').format('l') : '--/--/--');
      expect(controllerScope.vm.invoices[1]['total_formatted']).to.equal(controllerScope.vm.cakeCommon.parseCakeCostFloatValue(controllerScope.vm.invoices[1]['total'], '0.00', 2));
      expect(controllerScope.vm.invoices[1]['vendor']).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results[1]);
      expect(controllerScope.vm.invoices[1]['vendor_name']).to.equal(invoicesControllerTestsMockedData.vendors_response.results[1]['name']);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected - scenario with search phrase (string - vendor name or number)', function() {

      var locationId = 7;
      var spyInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;
      controllerScope.vm.searchParams.searchQuery = 'some';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(spyInvoicesLoad.calledWithExactly(
        {'$and':[{'$or':[{'vendor_id':[invoicesControllerTestsMockedData.vendors_response.results[0]['id']]},{'invoice_number':{'$like':'some'}}]},{'location_id': locationId}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-receipt_date,-created_at'}
      )).to.equal(true);

      expect(controllerScope.vm.invoices.length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1); // one invoice doesnt have vendor - we dont parse it
      expect(_.keys(controllerScope.vm.invoicesById).length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1);

      expect(controllerScope.vm.invoices[0]).to.contain.all.keys(['vendor', 'vendor_name', 'date_formatted', 'total_formatted']);

      expect(controllerScope.vm.invoices[1]['date_formatted']).to.equal(controllerScope.vm.invoices[1]['receipt_date'] ? moment(controllerScope.vm.invoices[1]['receipt_date'], 'YYYY-MM-DD').format('l') : '--/--/--');
      expect(controllerScope.vm.invoices[1]['total_formatted']).to.equal(controllerScope.vm.cakeCommon.parseCakeCostFloatValue(controllerScope.vm.invoices[1]['total'], '0.00', 2));
      expect(controllerScope.vm.invoices[1]['vendor']).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results[1]);
      expect(controllerScope.vm.invoices[1]['vendor_name']).to.equal(invoicesControllerTestsMockedData.vendors_response.results[1]['name']);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected - scenario with search phrase (number - vendor number or name or invoice total or date)', function() {

      var locationId = 7;
      var spyInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;
      controllerScope.vm.searchParams.searchQuery = '1';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(spyInvoicesLoad.calledWithExactly(
        {'$and':[{'$or':[{'vendor_id':[invoicesControllerTestsMockedData.vendors_response.results[0]['id']]},{'invoice_number':{'$like':'1'}},{'receipt_date':moment().format('YYYY[-01-01]')},{'total':1}]},{'location_id':7}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-receipt_date,-created_at'}
      )).to.equal(true);

      expect(controllerScope.vm.invoices.length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1); // one invoice doesnt have vendor - we dont parse it
      expect(_.keys(controllerScope.vm.invoicesById).length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1);

      expect(controllerScope.vm.invoices[0]).to.contain.all.keys(['vendor', 'vendor_name', 'date_formatted', 'total_formatted']);

      expect(controllerScope.vm.invoices[1]['date_formatted']).to.equal(controllerScope.vm.invoices[1]['receipt_date'] ? moment(controllerScope.vm.invoices[1]['receipt_date'], 'YYYY-MM-DD').format('l') : '--/--/--');
      expect(controllerScope.vm.invoices[1]['total_formatted']).to.equal(controllerScope.vm.cakeCommon.parseCakeCostFloatValue(controllerScope.vm.invoices[1]['total'], '0.00', 2));
      expect(controllerScope.vm.invoices[1]['vendor']).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results[1]);
      expect(controllerScope.vm.invoices[1]['vendor_name']).to.equal(invoicesControllerTestsMockedData.vendors_response.results[1]['name']);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected - scenario with search phrase (date)', function() {

      var locationId = 7;
      var spyInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;
      controllerScope.vm.searchParams.searchQuery = '10/13/';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(spyInvoicesLoad.calledWithExactly(
        {'$and':[{'$or':[{'invoice_number':{'$like':'10/13/'}},{'receipt_date':moment().format('YYYY[-10-13]')},{'total':10}]},{'location_id':7}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-receipt_date,-created_at'}
      )).to.equal(true);

      expect(controllerScope.vm.invoices.length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1); // one invoice doesnt have vendor - we dont parse it
      expect(_.keys(controllerScope.vm.invoicesById).length).to.equal(invoicesControllerTestsMockedData.invoices_response.count - 1);

      expect(controllerScope.vm.invoices[0]).to.contain.all.keys(['vendor', 'vendor_name', 'date_formatted', 'total_formatted']);

      expect(controllerScope.vm.invoices[1]['date_formatted']).to.equal(controllerScope.vm.invoices[1]['receipt_date'] ? moment(controllerScope.vm.invoices[1]['receipt_date'], 'YYYY-MM-DD').format('l') : '--/--/--');
      expect(controllerScope.vm.invoices[1]['total_formatted']).to.equal(controllerScope.vm.cakeCommon.parseCakeCostFloatValue(controllerScope.vm.invoices[1]['total'], '0.00', 2));
      expect(controllerScope.vm.invoices[1]['vendor']).to.deep.equal(invoicesControllerTestsMockedData.vendors_response.results[1]);
      expect(controllerScope.vm.invoices[1]['vendor_name']).to.equal(invoicesControllerTestsMockedData.vendors_response.results[1]['name']);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('onSearchPhraseUpdateCallback should set page number to 1 and call onPaginationChangeCallback', function() {

      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.pagination.page_no = 10;

      controllerScope.vm.onSearchPhraseUpdateCallback();

      expect(controllerScope.vm.pagination.page_no).to.equal(1);
      expect(spyPaginationChange.called).to.be.true;

    });

    it('openEditInvoiceModal should redirect to edit invoice page', function() {

      var invoiceId = 10;

      controllerScope.vm.openEditInvoiceModal(invoiceId);

      expect(controllerScope.vm.$location.path()).to.be.equal('/edit_invoice');
      expect(controllerScope.vm.$location.search()['id']).to.be.equal(invoiceId);

    });

    it('openNewInvoiceModal should redirect to new invoice page', function() {

      controllerScope.vm.blockers.no_location = true;

      controllerScope.vm.openNewInvoiceModal();

      expect(controllerScope.vm.$location.path()).to.not.be.equal('/edit_invoice');

      controllerScope.vm.blockers.no_location = false;

      controllerScope.vm.openNewInvoiceModal();

      expect(controllerScope.vm.$location.path()).to.be.equal('/edit_invoice');
      expect(controllerScope.vm.$location.search()['id']).to.be.equal(undefined);

    });

  });

});