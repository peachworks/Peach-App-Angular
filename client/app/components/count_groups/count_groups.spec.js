describe("Controller: Count groups", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var countGroupsControllerTestsMockedData = {
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    count_groups_response       : {
      'count': 2,
      'results': [
        {
          'schedule_days': null,
          'next_date': '2015-08-30',
          'start_date': '2015-08-23',
          'is_active': true,
          'is_default': false,
          'schedule_interval': 1,
          'schedule_type': 'week',
          'description': 'Default count group',
          'name': 'A',
          'id': 65,
          'created_by': 44,
          'created_at': '2015-07-20T13:54:14.714Z',
          'updated_by': 44,
          'updated_at': '2015-08-28T13:10:34.290Z'
        },
        {
          'schedule_days': null,
          'next_date': '2016-02-01',
          'start_date': '2015-10-01',
          'is_active': true,
          'is_default': false,
          'schedule_interval': 1,
          'schedule_type': 'day',
          'description': null,
          'name': 'B',
          'id': 67,
          'created_by': 44,
          'created_at': '2015-07-20T14:00:29.343Z',
          'updated_by': 44,
          'updated_at': '2015-11-18T19:31:29.414Z'
        }
      ],
      'trigger_response': {
        'default_count_group': {
          'schedule_days': null,
          'next_date': '2016-02-01',
          'start_date': '2015-10-01',
          'is_active': true,
          'is_default': false,
          'schedule_interval': 4,
          'schedule_type': 'month',
          'description': null,
          'name': 'B',
          'id': 67,
          'created_by': 44,
          'created_at': '2015-07-20T14:00:29.343Z',
          'updated_by': 44,
          'updated_at': '2015-11-18T19:31:29.414Z'
        },
        'default_count_group_included': true
      }
    },
    items_response              : {
      "count": 2,
      "results": [
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

  // helper local variables
  var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub;
  // controller injectables
  var $document, $location, $q, cakeCommon, cakeCountGroups, cakeItems, cakePermissions, cakeSettings;


  // initialize app module
  beforeEach(module('cakeApp'));

    
  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

    $location = $injector.get('$location');
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
        deferred.resolve(countGroupsControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return countGroupsControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      }
    };

    cakeCountGroups = {
      loadCountGroups: function() {
        var deferred = $q.defer();
        deferred.resolve(countGroupsControllerTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getCountGroups: function() {
        return countGroupsControllerTestsMockedData.count_groups_response.results;
      },
      getCountGroupsCollection: function() {
        return _.object(_.pluck(countGroupsControllerTestsMockedData.count_groups_response.results, 'id'), countGroupsControllerTestsMockedData.count_groups_response.results);
      },
      getReadableFrequency: function(countGroup) {
        return countGroupsControllerTestsMockedData.default_readable_frequency;
      },
      getPredefinedFrequencies: function() {
        var deferred = $q.defer();
        deferred.resolve(countGroupsControllerTestsMockedData.predefined_frequencies);
        return deferred.promise;
      }
    };

    cakeItems = {
      loadItems: function() {
        var deferred = $q.defer();
        deferred.resolve(countGroupsControllerTestsMockedData.items_response);
        return deferred.promise;
      },
      getItems: function() {
        return countGroupsControllerTestsMockedData.items_response.results;
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(countGroupsControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(countGroupsControllerTestsMockedData.active_locations);
        return deferred.promise;
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'count_groups.js as vm',
      {
        '$scope': controllerScope,
        '$document': $document,
        '$location': $location,
        '$q': $q,
        'cakeCommon': cakeCommon,
        'cakeCountGroups': cakeCountGroups,
        'cakeItems': cakeItems,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});

  }));

  afterEach(function() {

    sandbox.restore();

  });

  describe('Constructor', function() {

    it('should construct Count Groups Controller', function() {

      expect(controllerScope.vm.$document).to.not.equal(null);
      expect(controllerScope.vm.$location).to.not.equal(null);
      expect(controllerScope.vm.$q).to.not.equal(null);
      expect(controllerScope.vm.cakeCommon).to.not.equal(null);
      expect(controllerScope.vm.cakeCountGroups).to.not.equal(null);
      expect(controllerScope.vm.cakeItems).to.not.equal(null);
      expect(controllerScope.vm.cakePermissions).to.not.equal(null);
      expect(controllerScope.vm.cakeSettings).to.not.equal(null);

      expect(controllerScope.vm.blockers).to.have.property('api_processing');

      expect(controllerScope.vm.pagination).to.deep.equal({'limit': 50, 'page_no': 1, 'total_items': 0});
      expect(controllerScope.vm.paginationLimits).to.deep.equal([50]);
      expect(controllerScope.vm.requestParams).to.deep.equal({});
      expect(controllerScope.vm.filters).to.deep.equal({});
      expect(controllerScope.vm.searchParams).to.deep.equal({'searchQuery': ''});

      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.canEditCountGroups).to.equal(false);
      expect(controllerScope.vm.countGroups).to.deep.equal([]);
      expect(controllerScope.vm.countGroupsById).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.itemsById).to.deep.equal({});
      expect(controllerScope.vm.itemsByCountGroup).to.deep.equal({});
      expect(controllerScope.vm.predefinedFrequencies).to.deep.equal({});
      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

    });

  });

  describe('Activate function', function() {

    it('activate should set up correct controller properties', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeCountGroupsFrequencies = sandbox.spy(controllerScope.vm.cakeCountGroups, 'getPredefinedFrequencies');
      var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(spyCakePermissions.calledOnce).to.equal(true);
      expect(spyCakeCountGroupsFrequencies.calledOnce).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();
      
      expect(controllerScope.vm.activeLocations).to.equal(countGroupsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(countGroupsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(countGroupsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(countGroupsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditCountGroups).to.equal(countGroupsControllerTestsMockedData.permissions.edit_count_groups);

      expect(spyCakeCountGroupsLoad.called).to.equal(true);
      expect(spyCakeItemsLoad.called).to.equal(true);

      expect(controllerScope.vm.countGroups.length).to.equal(countGroupsControllerTestsMockedData.count_groups_response.count);
      expect(controllerScope.vm.items.length).to.equal(countGroupsControllerTestsMockedData.items_response.count);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
    
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

    it('onPaginationChangeCallback should build params for api requests and load new page of data', function() {

      var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');

      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 20;
      controllerScope.vm.searchParams.searchQuery = 'test';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.be.true;

      $rootScope.$digest();

      expect(spyCakeCountGroupsLoad.calledWith({'$and': [{'name': {'$like': controllerScope.vm.searchParams.searchQuery}}]}, {'page':controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': 'name'})).to.be.true;
      expect(spyCakeItemsLoad.calledWith({'count_group_id': _.keys(controllerScope.vm.cakeCountGroups.getCountGroupsCollection())})).to.be.true;

      expect(controllerScope.vm.pagination.total_items).to.equal(countGroupsControllerTestsMockedData.count_groups_response.count);
      expect(controllerScope.vm.countGroups.length).to.equal(countGroupsControllerTestsMockedData.count_groups_response.count);
      expect(controllerScope.vm.items.length).to.equal(countGroupsControllerTestsMockedData.items_response.count);

      expect(_.keys(controllerScope.vm.itemsByCountGroup)).to.deep.equal(_.keys(controllerScope.vm.countGroupsById));
      expect(controllerScope.vm.countGroups[0]).to.contain.all.keys(['items', 'schedule_days_arr', 'frequency', 'frequency_short', 'number_of_items']);

      expect(controllerScope.vm.blockers.api_processing).to.be.false;

    });

    it('onSearchPhraseUpdateCallback should set page number to 1 and call onPaginationChangeCallback', function() {

      var spyShowMessage = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.pagination.page_no = 10;

      controllerScope.vm.onSearchPhraseUpdateCallback();

      expect(controllerScope.vm.pagination.page_no).to.equal(1);
      expect(spyShowMessage.called).to.be.true;

    });

    it('openEditCountGroupModal should redirect to edit count group page', function() {

      var countGroupId = 10;

      controllerScope.vm.openEditCountGroupModal(countGroupId);

      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/edit_count_group');
      expect(controllerScope.vm.$location.search()['id']).to.be.equal(countGroupId);

    });

  });

});