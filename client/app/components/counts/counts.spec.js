describe("Controller: Counts", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var countsControllerTestsMockedData = {
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
          'is_default': true,
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
          'is_default': true,
          'schedule_interval': 1,
          'schedule_type': 'day',
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
    counts_response              : {
      "count": 3,
      "results": [
        {
          count_group_id: 65,
          created_at: "2015-10-13T20:47:08.979Z",
          created_by: 44,
          date: "2015-10-13",
          id: 91,
          is_complete: true,
          is_opening: true,
          location_id: 7,
          notes: "",
          percent_complete: "98.00",
          task_id: null,
          time: null,
          updated_at: "2015-12-04T16:51:36.018Z",
          updated_by: 44
        }, 
        {
          count_group_id: 67,
          created_at: "2015-10-02T17:14:46.505Z",
          created_by: 44,
          date: "2015-10-09",
          id: 85,
          is_complete: true,
          is_opening: true,
          location_id: 7,
          notes: "",
          percent_complete: "38.00",
          task_id: null,
          time: null,
          updated_at: "2015-11-19T17:34:24.966Z",
          updated_by: 44
        },
        {
          count_group_id: 65,
          created_at: "2015-10-08T21:23:29.482Z",
          created_by: 44,
          date: "2015-10-08",
          id: 87,
          is_complete: false,
          is_opening: true,
          location_id: 7,
          notes: "",
          percent_complete: "93.00",
          task_id: null,
          time: null,
          updated_at: "2015-12-01T16:08:48.426Z",
          updated_by: 44
        }
      ]
    },
    opening_counts_response     : {
      "count": 2,
      "results": [
        {
          "count_date":"2015-10-09",
          "id":6,
          "created_by":44,
          "created_at":"2015-08-28T15:18:15.457Z",
          "updated_by":null,
          "updated_at":"2015-08-28T15:18:15.457Z",
          "location_id":7,
          "count_group_id":67
        },
        {
          "count_date":"2015-10-08",
          "id":10,
          "created_by":44,
          "created_at":"2015-09-08T11:56:07.874Z",
          "updated_by":44,
          "updated_at":"2015-09-17T11:33:15.733Z",
          "location_id":7,
          "count_group_id":65
        }
      ]
    },  
    permissions                 : {
      'edit_counts' : true
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
  var $document, $filter, $location, $peach, $q, cakeCommon, cakeCountGroups, cakeCounts, cakePermissions, cakeSettings;


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
        deferred.resolve(countsControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return countsControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      }
    };

    cakeCountGroups = {
      loadCountGroups: function() {
        var deferred = $q.defer();
        deferred.resolve(countsControllerTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getCountGroups: function() {
        return countsControllerTestsMockedData.count_groups_response.results;
      },
      getCountGroupsCollection: function() {
        return _.object(_.pluck(countsControllerTestsMockedData.count_groups_response.results, 'id'), countsControllerTestsMockedData.count_groups_response.results);
      }
    };

    cakeCounts = {
      loadCounts: function() {
        var deferred = $q.defer();
        deferred.resolve(countsControllerTestsMockedData.counts_response);
        return deferred.promise;
      },
      loadOpeningCounts: function() {
        var deferred = $q.defer();
        deferred.resolve(countsControllerTestsMockedData.opening_counts_response);
        return deferred.promise;
      },
      getCounts: function() {
        return countsControllerTestsMockedData.counts_response.results;
      },
      getOpeningCounts: function() {
        return countsControllerTestsMockedData.opening_counts_response.results;
      },
      getOpeningCountsCollection: function() {
        return _.object(_.pluck(countsControllerTestsMockedData.opening_counts_response.results, 'id'), countsControllerTestsMockedData.opening_counts_response.results);
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(countsControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(countsControllerTestsMockedData.active_locations);
        return deferred.promise;
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'counts.js as vm',
      {
        '$scope': controllerScope,
        '$document': $document,
        '$filter': $filter,
        '$location': $location,
        '$peach': $peach,
        '$q': $q,
        'cakeCommon': cakeCommon,
        'cakeCountGroups': cakeCountGroups,
        'cakeCounts': cakeCounts,
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

    it('should construct Counts Controller', function() {

      expect(controllerScope.vm.$document).to.exist;
      expect(controllerScope.vm.$filter).to.exist;
      expect(controllerScope.vm.$location).to.exist;
      expect(controllerScope.vm.$peach).to.exist;
      expect(controllerScope.vm.$q).to.exist;
      expect(controllerScope.vm.cakeCommon).to.exist;
      expect(controllerScope.vm.cakeCountGroups).to.exist;
      expect(controllerScope.vm.cakeCounts).to.exist;
      expect(controllerScope.vm.cakePermissions).to.exist;
      expect(controllerScope.vm.cakeSettings).to.exist;

      expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'no_location']);

      expect(controllerScope.vm.headerOptions).to.deep.equal([{'callback': controllerScope.vm.openNewCountModal, 'label': 'Add Count'}]);

      expect(controllerScope.vm.pagination).to.deep.equal({'limit': 50, 'page_no': 1, 'total_items': 0});
      expect(controllerScope.vm.paginationLimits).to.deep.equal([50]);
      expect(controllerScope.vm.requestParams).to.deep.equal({});
      expect(controllerScope.vm.filters).to.deep.equal({'location_id': null});
      expect(controllerScope.vm.searchParams).to.deep.equal({'searchQuery': ''});

      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.canEditCounts).to.equal(false);
      expect(controllerScope.vm.countGroups).to.deep.equal([]);
      expect(controllerScope.vm.countGroupsById).to.deep.equal({});
      expect(controllerScope.vm.counts).to.deep.equal([]);
      expect(controllerScope.vm.countsById).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.openingCounts).to.deep.equal([]);
      expect(controllerScope.vm.openingCountsById).to.deep.equal({});

      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

      expect(controllerScope.vm.locationCountsCheck).to.deep.equal({});

    });

  });

  describe('Activate function', function() {

    it('activate should set up correct controller properties - no location selected scenario', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyPeachSession = sandbox.spy(controllerScope.vm.$peach.session, 'getActiveLocation');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_counts')).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();
      
      expect(controllerScope.vm.activeLocations).to.equal(countsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(countsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(countsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(countsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditCounts).to.equal(countsControllerTestsMockedData.permissions.edit_counts);

      expect(controllerScope.vm.countGroups).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(spyPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.counts).to.deep.equal([]);
      expect(controllerScope.vm.countsById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);
    
    });

    it('activate should set up correct controller properties - not cake active location selected scenario', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return 5; });

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_counts')).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.activeLocations).to.equal(countsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(countsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(countsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(countsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditCounts).to.equal(countsControllerTestsMockedData.permissions.edit_counts);

      expect(controllerScope.vm.countGroups).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(controllerScope.vm.filters.location_id).to.equal(null);
      expect(controllerScope.vm.counts).to.deep.equal([]);
      expect(controllerScope.vm.countsById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);
      expect(spyShowMessage.calledWithExactly('Selected location is not an active Cake location.')).to.equal(true);
      expect(spyHideMessage.called).to.equal(false);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);
    
    });

    it('activate should set up correct controller properties - cake active location selected scenario and there are already some counts', function() {

      var locationId = 7;
      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
      var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
      var spyCakeOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_counts')).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.activeLocations).to.equal(countsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(countsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(countsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(countsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditCounts).to.equal(countsControllerTestsMockedData.permissions.edit_counts);

      expect(controllerScope.vm.countGroups).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(spyCakeCountsLoad.calledWith({'location_id': locationId},{'fields': 'id','limit': 1}, true)).to.equal(true);
      expect(spyPaginationChange.called).to.equal(true);
      expect(spyShowMessage.called).to.equal(false);
      expect(spyCakeCountsLoad.calledWith(
        {'$and': [
            {'location_id': locationId}
          ]
        },
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-date,-created_at'}
      )).to.equal(true);
      expect(spyCakeOpeningCountsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
      expect(controllerScope.vm.locationCountsCheck).to.deep.equal({ '7': countsControllerTestsMockedData.counts_response.count});

      expect(controllerScope.vm.filters.location_id).to.equal(locationId);
      expect(controllerScope.vm.counts.length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(controllerScope.vm.openingCounts.length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);
      expect(controllerScope.vm.pagination.total_items).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(spyHideMessage.called).to.equal(true);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(false);
    
    });

    it('activate should set up correct controller properties - cake active location selected scenario and there are no counts yet', function() {

      var locationId = 7;
      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
      var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
      var spyCakeOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var spyPaginationChange = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');
      var spyNewCountRedirect = sandbox.spy(controllerScope.vm, 'openNewCountModal');
      var countsResponseCopy = angular.copy(countsControllerTestsMockedData.counts_response);

      countsControllerTestsMockedData.counts_response = {
        count: 0,
        results: []
      };

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_counts')).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.activeLocations).to.equal(countsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(countsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(countsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(countsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditCounts).to.equal(countsControllerTestsMockedData.permissions.edit_counts);

      expect(controllerScope.vm.countGroups).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results);

      expect(spyPeachEvent.called).to.equal(true);
      expect(stubPeachSession.called).to.equal(true);

      expect(spyCakeCountsLoad.calledWith({'location_id': locationId},{'fields': 'id','limit': 1}, true)).to.equal(true);
      expect(spyPaginationChange.called).to.equal(false);
      expect(spyShowMessage.called).to.equal(false);
      expect(spyCakeOpeningCountsLoad.called).to.equal(false);
      expect(controllerScope.vm.locationCountsCheck).to.deep.equal({ '7': countsControllerTestsMockedData.counts_response.count});

      expect(controllerScope.vm.filters.location_id).to.equal(locationId);

      expect(spyNewCountRedirect.called).to.equal(true);
      expect(spyHideMessage.called).to.equal(false);

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      expect(controllerScope.vm.blockers.no_location).to.equal(false);

      countsControllerTestsMockedData.counts_response = countsResponseCopy;
    
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
      expect(controllerScope.vm.canEditCounts).to.equal(false);

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
      expect(controllerScope.vm.counts).to.deep.equal([]);
      expect(controllerScope.vm.countsById).to.deep.equal({});
      expect(controllerScope.vm.pagination.total_items).to.equal(0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.no_location).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected - no search phrase scenario', function() {

      var locationId = 7;
      var spyCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
      var spyOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      
      controllerScope.$digest();
      
      expect(spyCountsLoad.calledWithExactly(
        {'$and': [{location_id: locationId}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-date,-created_at'}
      )).to.equal(true);
      
      expect(spyOpeningCountsLoad.calledWithExactly({location_id: locationId})).to.equal(true);

      expect(controllerScope.vm.counts.length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(_.keys(controllerScope.vm.countsById).length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(controllerScope.vm.openingCounts.length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);
      expect(_.keys(controllerScope.vm.openingCountsById).length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);

      expect(controllerScope.vm.counts[0]).to.contain.all.keys(['is_opening_count', 'date_formatted', 'count_group', 'status']);

      expect(controllerScope.vm.counts[2]['is_opening_count']).to.equal(true);
      expect(controllerScope.vm.counts[2]['date_formatted']).to.equal(moment(controllerScope.vm.counts[2]['date'], 'YYYY-MM-DD').format('l'));
      expect(controllerScope.vm.counts[2]['count_group']).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results[0]);
      expect(controllerScope.vm.counts[2]['status']).to.equal(controllerScope.vm.counts[2]['percent_complete'] ? parseFloat(Big(controllerScope.vm.counts[2]['percent_complete']).toFixed(2)) : 0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected - scenario with search phrase (count group name)', function() {

      var locationId = 7;
      var spyCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
      var spyOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;
      controllerScope.vm.searchParams.searchQuery = 'A';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      
      controllerScope.$digest();

      expect(spyCountsLoad.calledWithExactly(
        {'$and': [{count_group_id: [65]}, {location_id: locationId}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-date,-created_at'}
      )).to.equal(true);

      expect(spyOpeningCountsLoad.calledWithExactly({location_id: locationId})).to.equal(true);

      expect(controllerScope.vm.counts.length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(_.keys(controllerScope.vm.countsById).length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(controllerScope.vm.openingCounts.length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);
      expect(_.keys(controllerScope.vm.openingCountsById).length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);

      expect(controllerScope.vm.counts[0]).to.contain.all.keys(['is_opening_count', 'date_formatted', 'count_group', 'status']);

      expect(controllerScope.vm.counts[2]['is_opening_count']).to.equal(true);
      expect(controllerScope.vm.counts[2]['date_formatted']).to.equal(moment(controllerScope.vm.counts[2]['date'], 'YYYY-MM-DD').format('l'));
      expect(controllerScope.vm.counts[2]['count_group']).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results[0]);
      expect(controllerScope.vm.counts[2]['status']).to.equal(controllerScope.vm.counts[2]['percent_complete'] ? parseFloat(Big(controllerScope.vm.counts[2]['percent_complete']).toFixed(2)) : 0);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyHideMessage.called).to.equal(true);

    });

    it('onPaginationChangeCallback should build params for api requests and load new page of data when location selected - scenario with search phrase (date)', function() {

      var locationId = 7;
      var spyCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
      var spyOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');
      var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');

      controllerScope.$digest();

      controllerScope.vm.filters.location_id = locationId;
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 50;
      controllerScope.vm.searchParams.searchQuery = '10/11/';

      controllerScope.vm.onPaginationChangeCallback();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      
      controllerScope.$digest();

      expect(spyCountsLoad.calledWithExactly(
        {'$and': [{date: moment().format('YYYY[-10-11]')}, {location_id: locationId}]},
        {'page': controllerScope.vm.pagination.page_no, 'limit': controllerScope.vm.pagination.limit, 'sort': '-date,-created_at'}
      )).to.equal(true);

      expect(spyOpeningCountsLoad.calledWithExactly({location_id: locationId})).to.equal(true);

      expect(controllerScope.vm.counts.length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(_.keys(controllerScope.vm.countsById).length).to.equal(countsControllerTestsMockedData.counts_response.count);
      expect(controllerScope.vm.openingCounts.length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);
      expect(_.keys(controllerScope.vm.openingCountsById).length).to.equal(countsControllerTestsMockedData.opening_counts_response.count);

      expect(controllerScope.vm.counts[0]).to.contain.all.keys(['is_opening_count', 'date_formatted', 'count_group', 'status']);

      expect(controllerScope.vm.counts[2]['is_opening_count']).to.equal(true);
      expect(controllerScope.vm.counts[2]['date_formatted']).to.equal(moment(controllerScope.vm.counts[2]['date'], 'YYYY-MM-DD').format('l'));
      expect(controllerScope.vm.counts[2]['count_group']).to.deep.equal(countsControllerTestsMockedData.count_groups_response.results[0]);
      expect(controllerScope.vm.counts[2]['status']).to.equal(controllerScope.vm.counts[2]['percent_complete'] ? parseFloat(Big(controllerScope.vm.counts[2]['percent_complete']).toFixed(2)) : 0);

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

    it('openEditCountModal should redirect to edit count page', function() {

      var countId = 10;

      controllerScope.vm.openEditCountModal(countId);

      expect(controllerScope.vm.$location.path()).to.be.equal('/edit_count');
      expect(controllerScope.vm.$location.search()['id']).to.be.equal(countId);

    });

    it('openNewCountModal should redirect to new count page', function() {

      controllerScope.vm.blockers.no_location = true;

      controllerScope.vm.openNewCountModal();

      expect(controllerScope.vm.$location.path()).to.not.be.equal('/edit_count');

      controllerScope.vm.blockers.no_location = false;

      controllerScope.vm.openNewCountModal();

      expect(controllerScope.vm.$location.path()).to.be.equal('/edit_count');
      expect(controllerScope.vm.$location.search()['id']).to.be.equal(undefined);

    });

  });

});