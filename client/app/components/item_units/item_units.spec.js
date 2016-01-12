describe("Controller: Item units", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var itemUnitsControllerTestsMockedData = {
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    gl_accounts_response        : {
      'count': 2,
      'results': [
        {
          created_at: "2014-09-24T10:33:10.579Z",
          created_by: 44,
          description: null,
          id: 12,
          name: "Alcohol",
          number: null,
          parent_id: null,
          subtype: null,
          type: "COGS",
          updated_at: "2014-09-24T10:33:10.579Z",
          updated_by: null
        },
        {
          created_at: "2014-10-08T20:58:59.896Z",
          created_by: 44,
          description: null,
          id: 16,
          name: "Beer",
          number: null,
          parent_id: 12,
          subtype: null,
          type: "COGS",
          updated_at: "2014-10-08T20:58:59.896Z",
          updated_by: null
        }
      ]
    },
    item_locations_response     : {
      'count': 3,
      'results': [
        {
          created_at: "2015-05-11T13:08:25.720Z",
          created_by: 44,
          id: 36,
          inv_item_id: 1180,
          is_hot_count: false,
          last_cost: null,
          location_id: 7,
          opening_count_date: null,
          starting_cost: null,
          updated_at: "2015-05-11T13:08:25.720Z",
          updated_by: null
        },
        {
          created_at: "2015-05-11T13:08:25.720Z",
          created_by: 44,
          id: 37,
          inv_item_id: 1181,
          is_hot_count: false,
          last_cost: null,
          location_id: 7,
          opening_count_date: null,
          starting_cost: null,
          updated_at: "2015-05-11T13:08:25.720Z",
          updated_by: null
        }
      ]
    },
    item_units_response         : {
      'count': 3,
      'results': [
        {
          common_unit_id: 5,
          created_at: "2014-10-17T15:36:38.353Z",
          created_by: 138,
          description: "Case 36 bt",
          id: 1978,
          inv_item_id: 1180,
          is_active: null,
          is_report_unit: false,
          is_wv_conversion: false,
          pack_size: "",
          unit_id: 9,
          unit_quantity: "36.00000",
          updated_at: "2014-12-04T19:25:45.192Z",
          updated_by: 44
        },
        {
          common_unit_id: 5,
          created_at: "2014-10-17T15:36:38.353Z",
          created_by: 138,
          description: "Case 12 bt",
          id: 1979,
          inv_item_id: 1180,
          is_active: null,
          is_report_unit: false,
          is_wv_conversion: false,
          pack_size: "",
          unit_id: 9,
          unit_quantity: "12.00000",
          updated_at: "2014-12-04T19:25:45.192Z",
          updated_by: 44
        },
        {
          common_unit_id: 5,
          created_at: "2014-10-17T15:36:38.353Z",
          created_by: 138,
          description: "Case 24 bt",
          id: 1980,
          inv_item_id: 1181,
          is_active: null,
          is_report_unit: false,
          is_wv_conversion: false,
          pack_size: "",
          unit_id: 9,
          unit_quantity: "24.00000",
          updated_at: "2014-12-04T19:25:45.192Z",
          updated_by: 44
        }
      ]
    },
    item_unit_locations_response: {
      'count': 3,
      'results': [
        {
          created_at: "2015-05-12T14:07:08.039Z",
          created_by: 44,
          id: 5,
          inv_item_id: 1180,
          inv_item_unit_id: 1978,
          is_count_unit: true,
          is_order_unit: false,
          is_report_unit: false,
          is_transfer_unit: false,
          is_waste_unit: false,
          location_id: 7,
          updated_at: "2015-10-07T17:33:09.700Z",
          updated_by: 44
        },
        {
          created_at: "2015-05-12T14:07:08.039Z",
          created_by: 44,
          id: 6,
          inv_item_id: 1180,
          inv_item_unit_id: 1979,
          is_count_unit: true,
          is_order_unit: false,
          is_report_unit: false,
          is_transfer_unit: false,
          is_waste_unit: false,
          location_id: 5,
          updated_at: "2015-10-07T17:33:09.700Z",
          updated_by: 44
        },
        {
          created_at: "2015-05-12T14:07:08.039Z",
          created_by: 44,
          id: 7,
          inv_item_id: 1181,
          inv_item_unit_id: 1980,
          is_count_unit: false,
          is_order_unit: false,
          is_report_unit: false,
          is_transfer_unit: false,
          is_waste_unit: false,
          location_id: 7,
          updated_at: "2015-10-07T17:33:09.700Z",
          updated_by: 44
        }
      ]
    },
    units_response              : {
      'count': 3,
      'results': [
        {
          abbr: "bt",
          created_at: "2014-06-17T15:02:12.934Z",
          created_by: 44,
          english_base: null,
          id: 5,
          is_metric: false,
          metric_base: null,
          name: "Bottle",
          type: "each",
          updated_at: "2014-07-15T06:44:11.711Z",
          updated_by: 44
        },
        {
          abbr: "cs",
          created_at: "2014-06-17T15:03:51.775Z",
          created_by: 44,
          english_base: null,
          id: 9,
          is_metric: false,
          metric_base: null,
          name: "Case",
          type: "each",
          updated_at: "2014-07-15T06:44:52.527Z",
          updated_by: 44
        },
        {
          abbr: "cnt",
          created_at: "2014-06-17T15:04:24.853Z",
          created_by: 44,
          english_base: null,
          id: 10,
          is_metric: false,
          metric_base: null,
          name: "Container",
          type: "each",
          updated_at: "2014-07-15T06:45:06.460Z",
          updated_by: 44
        }
      ]
    },
    items_response              : {
      'count': 2,
      'results': [
        {
          "common_unit_cost": null,
          "description": "",
          "name": "Jim Beam, Jacob's Ghost",
          "report_unit_cost": null,
          "total_recipes": null,
          "is_active": true,
          "refuse_pct": null,
          "item_db_id": 788,
          "id": 1180,
          "created_by": 44,
          "created_at": "2015-06-02T12:48:57.505Z",
          "updated_by": 44,
          "updated_at": "2015-08-12T12:22:41.537Z",
          "sales_item_id": null,
          "count_group_id": 65,
          "gl_account_id": 12,
          "common_unit_id": 15
        }, 
        {
          "common_unit_cost": "5.00000",
          "description": "",
          "name": "kk2",
          "report_unit_cost": "160.00000",
          "total_recipes": null,
          "is_active": true,
          "refuse_pct": "0.00000",
          "item_db_id": null,
          "id": 1181,
          "created_by": 44,
          "created_at": "2015-06-02T16:23:44.587Z",
          "updated_by": 44,
          "updated_at": "2015-10-22T21:24:39.381Z",
          "sales_item_id": null,
          "count_group_id": 67,
          "gl_account_id": 12,
          "common_unit_id": 15
        }
      ]
    },
    permissions                 : {
      'edit_item_units' : true
    },
    account_locations           : [
      {
        address1: null,
        address2: null,
        city: null,
        country_id: 227,
        created_at: "2013-09-27T18:37:45.348Z",
        created_by: 138,
        id: 5,
        is_deleted: false,
        name: "LLS location",
        number: "4444",
        org_group_id: null,
        phone: null,
        state_id: 3498,
        tags: null,
        timezone: "Africa/Abidjan",
        updated_at: "2014-07-15T00:23:05.650Z",
        updated_by: 138,
        zip: "48114"
      },
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
        zip: null
      }
    ],
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
        zip: null,
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
  var $document, $peach, $q, cakeCommon, cakeGLAccounts, cakeItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeUnits


  // initialize app module
  beforeEach(module('cakeApp'));

    
  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

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
        deferred.resolve(itemUnitsControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return itemUnitsControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      }
    };

    cakeGLAccounts = {
      loadGLAccounts: function() {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.gl_accounts_response);
        return deferred.promise;
      },
      getGLAccounts: function() {
        return itemUnitsControllerTestsMockedData.gl_accounts_response.results;
      },
      getGLAccountsCollection: function() {
        return _.object(_.pluck(itemUnitsControllerTestsMockedData.gl_accounts_response.results, 'id'), itemUnitsControllerTestsMockedData.gl_accounts_response.results);
      }
    };

    cakeItems = {
      loadItems: function(param1, param2) {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.items_response);
        return deferred.promise;
      },
      getItems: function() {
        return itemUnitsControllerTestsMockedData.items_response.results;
      }
    };

    cakeItemLocations = {
      loadItemLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.item_locations_response);
        return deferred.promise;
      }
    };

    cakeItemUnits = {
      loadItemUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.item_units_response);
        return deferred.promise;
      },
      getItemUnits: function() {
        return itemUnitsControllerTestsMockedData.item_units_response.results;
      },
      getItemUnitsCollection: function() {
        return _.object(_.pluck(itemUnitsControllerTestsMockedData.item_units_response.results, 'id'), itemUnitsControllerTestsMockedData.item_units_response.results);
      }
    };

    cakeItemUnitLocations = {
      loadItemUnitLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.item_unit_locations_response);
        return deferred.promise;
      },
      getItemUnitLocations: function() {
        return itemUnitsControllerTestsMockedData.item_unit_locations_response.results;
      },
      getItemUnitLocationsCollection: function() {
        return _.object(_.pluck(itemUnitsControllerTestsMockedData.item_unit_locations_response.results, 'id'), itemUnitsControllerTestsMockedData.item_unit_locations_response.results);
      },
      updateItemUnitLocation: function(updateData) {
        var deferred = $q.defer();
        deferred.resolve(updateData);
        return deferred.promise;
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData[settingKey]);
        return deferred.promise;
      }
    };

    cakeUnits = {
      loadUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(itemUnitsControllerTestsMockedData.units_response);
        return deferred.promise;
      },
      getUnits: function() {
        return itemUnitsControllerTestsMockedData.units_response.results;
      },
      getUnitsCollection: function() {
        return _.object(_.pluck(itemUnitsControllerTestsMockedData.units_response.results, 'id'), itemUnitsControllerTestsMockedData.units_response.results);
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'item_units.js as vm',
      {
        '$scope': controllerScope,
        '$document': $document,
        '$peach': $peach,
        '$q': $q,
        'cakeCommon': cakeCommon,
        'cakeGLAccounts': cakeGLAccounts,
        'cakeItems': cakeItems,
        'cakeItemLocations': cakeItemLocations,
        'cakeItemUnits': cakeItemUnits,
        'cakeItemUnitLocations': cakeItemUnitLocations,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings,
        'cakeUnits': cakeUnits
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});

  }));

  afterEach(function() {

    sandbox.restore();

  });

  describe('Constructor', function() {

    it('should construct Item Units Controller', function() {

      expect(controllerScope.vm.$document).to.not.equal(null);
      expect(controllerScope.vm.$peach).to.not.equal(null);
      expect(controllerScope.vm.$q).to.not.equal(null);
      expect(controllerScope.vm.cakeCommon).to.not.equal(null);
      expect(controllerScope.vm.cakeGLAccounts).to.not.equal(null);
      expect(controllerScope.vm.cakeItems).to.not.equal(null);
      expect(controllerScope.vm.cakeItemLocations).to.not.equal(null);
      expect(controllerScope.vm.cakeItemUnits).to.not.equal(null);
      expect(controllerScope.vm.cakeItemUnitLocations).to.not.equal(null);
      expect(controllerScope.vm.cakePermissions).to.not.equal(null);
      expect(controllerScope.vm.cakeSettings).to.not.equal(null);
      expect(controllerScope.vm.cakeUnits).to.not.equal(null);

      expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'no_location']);

      expect(controllerScope.vm.pagination).to.deep.equal({'limit': 25, 'page_no': 1, 'total_items': 0});
      expect(controllerScope.vm.paginationLimits).to.deep.equal([10, 25, 50]);
      expect(controllerScope.vm.itemsRequestParams).to.deep.equal({});
      expect(controllerScope.vm.filters).to.deep.equal({'gl_account_id': null, 'location_id': null});
      expect(controllerScope.vm.customFiltersApplied).to.equal(false);
      expect(controllerScope.vm.searchParams).to.deep.equal({'searchQuery': ''});

      expect(controllerScope.vm.accountLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.canEditItemUnits).to.equal(false);
      expect(controllerScope.vm.units).to.deep.equal([]);
      expect(controllerScope.vm.unitsById).to.deep.equal({});
      expect(controllerScope.vm.forms).to.deep.equal({});
      expect(controllerScope.vm.glAccounts).to.deep.equal([]);
      expect(controllerScope.vm.glAccountsById).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.isSingleLocationAccount).to.equal(true);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.itemsById).to.deep.equal({});
      expect(controllerScope.vm.itemUnits).to.deep.equal([]);
      expect(controllerScope.vm.itemUnitsById).to.deep.equal({});
      expect(controllerScope.vm.itemUnitLocations).to.deep.equal([]);
      expect(controllerScope.vm.itemUnitLocationsById).to.deep.equal({});

      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

    });

  });

  describe('Activate function', function() {

    it('activate should set up correct controller properties - no location selected scenario', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
      var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyPeachSession = sandbox.spy(controllerScope.vm.$peach.session, 'getActiveLocation');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(spyCakePermissions.calledOnce).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('account_locations')).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.isAccountAdmin).to.equal(itemUnitsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(itemUnitsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditItemUnits).to.equal(itemUnitsControllerTestsMockedData.permissions.edit_item_units);
      expect(controllerScope.vm.activeLocations).to.equal(itemUnitsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(itemUnitsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.accountLocations).to.equal(itemUnitsControllerTestsMockedData.account_locations);
      expect(controllerScope.vm.isSingleLocationAccount).to.equal(itemUnitsControllerTestsMockedData.account_locations.length <= 1 ? true : false);

      expect(controllerScope.vm.glAccounts.length).to.equal(itemUnitsControllerTestsMockedData.gl_accounts_response.count);
      expect(controllerScope.vm.units.length).to.equal(itemUnitsControllerTestsMockedData.units_response.count);

      expect(spyPeachEvent.called).to.equal(true);
      expect(spyPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.itemsById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);
    
    });

    it('activate should set up correct controller properties - not cake active location selected scenario', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
      var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return 5; });

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(spyCakePermissions.calledOnce).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('account_locations')).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.isAccountAdmin).to.equal(itemUnitsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(itemUnitsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditItemUnits).to.equal(itemUnitsControllerTestsMockedData.permissions.edit_item_units);
      expect(controllerScope.vm.activeLocations).to.equal(itemUnitsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(itemUnitsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.accountLocations).to.equal(itemUnitsControllerTestsMockedData.account_locations);
      expect(controllerScope.vm.isSingleLocationAccount).to.equal(itemUnitsControllerTestsMockedData.account_locations.length <= 1 ? true : false);

      expect(controllerScope.vm.glAccounts.length).to.equal(itemUnitsControllerTestsMockedData.gl_accounts_response.count);
      expect(controllerScope.vm.units.length).to.equal(itemUnitsControllerTestsMockedData.units_response.count);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.itemsById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);
      expect(spyShowMessage.calledWithExactly('Selected location is not an active Cake location.')).to.equal(true);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);
    
    });

    it('activate should set up correct controller properties - cake active location selected scenario', function() {

      var locationId = 7;
      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
      var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(spyCakePermissions.calledOnce).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('account_locations')).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.isAccountAdmin).to.equal(itemUnitsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(itemUnitsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditItemUnits).to.equal(itemUnitsControllerTestsMockedData.permissions.edit_item_units);
      expect(controllerScope.vm.activeLocations).to.equal(itemUnitsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(itemUnitsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.accountLocations).to.equal(itemUnitsControllerTestsMockedData.account_locations);
      expect(controllerScope.vm.isSingleLocationAccount).to.equal(itemUnitsControllerTestsMockedData.account_locations.length <= 1 ? true : false);

      expect(controllerScope.vm.glAccounts.length).to.equal(itemUnitsControllerTestsMockedData.gl_accounts_response.count);
      expect(controllerScope.vm.units.length).to.equal(itemUnitsControllerTestsMockedData.units_response.count);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(locationId);
      expect(controllerScope.vm.items).to.deep.equal(itemUnitsControllerTestsMockedData.items_response.results);
      expect(controllerScope.vm.pagination.total_items).to.equal(itemUnitsControllerTestsMockedData.items_response.count);

      expect(spyPaginationChange.called).to.equal(true);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
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

      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();
      
      expect(spyErrorHandler.calledWithExactly('api error')).to.equal(true);
      expect(spyShowMessage.calledWithExactly('There was an error: api error', 'alert')).to.equal(true);

    });

  });
  
  describe('Functions', function() {

    it('clearFilters should reset filters and reload data, eventually opening 1st page of results with onPaginationChangeCallback', function() {

      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.customFiltersApplied = false;
      controllerScope.vm.filters.gl_account_id = 10;
      controllerScope.vm.pagination.page_no = 10;

      controllerScope.vm.clearFilters();

      expect(controllerScope.vm.filters.gl_account_id).to.equal(null);
      expect(controllerScope.vm.pagination.page_no).to.equal(10);

      expect(spyPaginationChange.called).to.equal(false);

      controllerScope.vm.customFiltersApplied = true;
      controllerScope.vm.filters.gl_account_id = 10;

      controllerScope.vm.clearFilters();

      expect(controllerScope.vm.filters.gl_account_id).to.equal(null);
      expect(controllerScope.vm.pagination.page_no).to.equal(1);

      expect(spyPaginationChange.called).to.equal(true);

    });

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

    it('onPaginationChangeCallback should display message when no location selected', function() {

      var locationId = null;
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');

      controllerScope.vm.filters.location_id = locationId;

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyShowMessage.calledWithExactly('Please select a location first.', 'warning')).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected', function() {

      var locationId = 7;
      var glAccountId = 12;
      var spyItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');
      var spyItemUnitLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'loadItemUnitLocations');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.filters.gl_account_id = glAccountId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 25;
      controllerScope.vm.searchParams.searchQuery = 'test';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.customFiltersApplied).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      expect(spyItemLocationsLoad.calledWithExactly({'location_id': locationId})).to.equal(true);
      
      controllerScope.$digest();
      
      expect(spyItemsLoad.calledWithExactly(
        {'$and': [{'name': {'$like': controllerScope.vm.searchParams.searchQuery}}, {'gl_account_id': glAccountId}, {'id': [1180, 1181]}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': 'name'}
      )).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.customFiltersApplied).to.equal(true);

      expect(spyItemUnitsLoad.calledWithExactly(
        {'inv_item_id': [1180, 1181]}
      )).to.equal(true);

      expect(spyItemUnitLocationsLoad.calledWithExactly(
        {'$and': [{'inv_item_id': [1180, 1181]}, {'location_id': locationId}]}
      )).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.items.length).to.equal(itemUnitsControllerTestsMockedData.items_response.count);
      expect(controllerScope.vm.itemUnits.length).to.equal(itemUnitsControllerTestsMockedData.item_units_response.count);
      expect(controllerScope.vm.itemUnitLocations.length).to.equal(itemUnitsControllerTestsMockedData.item_unit_locations_response.count);

      expect(controllerScope.vm.items[0]).to.contain.all.keys(['units', 'is_expanded', 'common_unit']);
      expect(controllerScope.vm.itemUnits[0]).to.contain.all.keys(['unit', 'item', 'unit_locations', 'is_common_unit', 'display_name', 'conversion_value', 'conversion_label', 'single_location_mode_data']);
      expect(controllerScope.vm.itemUnitLocations[0]).to.contain.all.keys(['item_unit', 'item']);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('filterTable should set page number to 1 and call onPaginationChangeCallback', function() {

      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.pagination.page_no = 10;

      controllerScope.vm.filterTable();

      expect(controllerScope.vm.pagination.page_no).to.equal(1);
      expect(spyPaginationChange.called).to.equal(true);

    });

    it('onSearchPhraseUpdateCallback should call filterTable', function() {

      var spyFilterTable = sandbox.spy(controllerScope.vm, 'filterTable');

      controllerScope.vm.onSearchPhraseUpdateCallback();

      expect(spyFilterTable.called).to.equal(true);

    });

    it('saveItemUnitLocation should use service to update item unit location data', function() {

      var testData = {'somedata': true};
      var spyCakeItemUnitLocations = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'updateItemUnitLocation');

      controllerScope.vm.saveItemUnitLocation(testData);

      expect(spyCakeItemUnitLocations.calledWithExactly(testData)).to.equal(true);

    });

  });

});