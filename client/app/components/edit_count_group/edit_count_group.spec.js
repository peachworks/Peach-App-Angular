describe("Controller: Edit count group", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var editCountGroupControllerTestsMockedData = {
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
          'is_default': true,
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
        }
      ]
    },
    counts_response             : {
      "count": 1,
      "results": [
        {
          count_group_id: 65,
          created_at: "2015-09-08T11:59:37.795Z",
          created_by: 44,
          date: "2015-09-10",
          id: 81,
          is_complete: false,
          is_opening: true,
          location_id: 7,
          notes: "",
          percent_complete: "89.00",
          task_id: null,
          time: null,
          updated_at: "2015-12-01T16:11:25.834Z",
          updated_by: 44
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
    }
  };

  // helper local variables
  var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub;
  // controller injectables
  var $location, $mdDialog, $q, cakeCommon, cakeCountGroups, cakeCounts, cakeItems, cakePermissions, cakeSharedData

  // initialize app module
  beforeEach(module('cakeApp'));

    
  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

    $location = $injector.get('$location');
    $mdDialog = $injector.get('$mdDialog');
    $q = $injector.get('$q');

    cakeCommon = {
      isUserAccountAdmin: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountGroupControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return editCountGroupControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      }
    };

    cakeCountGroups = {
      loadCountGroups: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountGroupControllerTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getCountGroups: function() {
        return editCountGroupControllerTestsMockedData.count_groups_response.results;
      },
      getCountGroupsCollection: function() {
        return _.object(_.pluck(editCountGroupControllerTestsMockedData.count_groups_response.results, 'id'), editCountGroupControllerTestsMockedData.count_groups_response.results);
      },
      getReadableFrequency: function(countGroup) {
        return editCountGroupControllerTestsMockedData.default_readable_frequency;
      },
      getPredefinedFrequencies: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountGroupControllerTestsMockedData.predefined_frequencies);
        return deferred.promise;
      },
      createCountGroup: function(newCountGroupData) {
        var deferred = $q.defer();
        deferred.resolve(newCountGroupData);
        return deferred.promise;
      },
      updateCountGroup: function(countGroupData) {
        var deferred = $q.defer();
        deferred.resolve(countGroupData);
        return deferred.promise;
      },
      removeCountGroup: function(countGroupId) {
        var deferred = $q.defer();
        deferred.resolve(true);
        return deferred.promise;
      }
    };

    cakeCounts = {
      loadCounts: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountGroupControllerTestsMockedData.counts_response);
        return deferred.promise;
      },
      getCounts: function() {
        return editCountGroupControllerTestsMockedData.counts_response.results;
      },
    };

    cakeItems = {
      loadItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountGroupControllerTestsMockedData.items_response);
        return deferred.promise;
      },
      getItems: function() {
        return editCountGroupControllerTestsMockedData.items_response.results;
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(editCountGroupControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSharedData = {
      setValue: function(key, val) {
        return;
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'edit_count_group.js as vm',
      {
        '$scope': controllerScope,
        '$location': $location,
        '$mdDialog': $mdDialog,
        '$q': $q,
        'cakeCommon': cakeCommon,
        'cakeCountGroups': cakeCountGroups,
        'cakeCounts': cakeCounts,
        'cakeItems': cakeItems,
        'cakePermissions': cakePermissions,
        'cakeSharedData': cakeSharedData
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});

  }));

  afterEach(function() {

    sandbox.restore();

  });

  describe('Constructor', function() {

    it('should construct Edit Count Group Controller', function() {

      expect(controllerScope.vm.$location).to.not.equal(null);
      expect(controllerScope.vm.$mdDialog).to.not.equal(null);
      expect(controllerScope.vm.$q).to.not.equal(null);
      expect(controllerScope.vm.cakeCommon).to.not.equal(null);
      expect(controllerScope.vm.cakeCountGroups).to.not.equal(null);
      expect(controllerScope.vm.cakeCounts).to.not.equal(null);
      expect(controllerScope.vm.cakeItems).to.not.equal(null);
      expect(controllerScope.vm.cakePermissions).to.not.equal(null);
      expect(controllerScope.vm.cakeSharedData).to.not.equal(null);

      expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'initializing']);

      expect(controllerScope.vm.editedCountGroup).to.deep.equal({'data': null, 'form_data': {}});

      expect(controllerScope.vm.canDeleteCountGroup).to.equal(false);
      expect(controllerScope.vm.canEditCountGroup).to.equal(false);
      expect(controllerScope.vm.countGroups).to.deep.equal([]);
      expect(controllerScope.vm.countGroupNames).to.deep.equal([]);
      expect(controllerScope.vm.disableIsDefaultSwitch).to.equal(false);
      expect(controllerScope.vm.forms).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.predefinedFrequencies).to.deep.equal({});
      expect(controllerScope.vm.predefinedFrequenciesKeys).to.deep.equal([]);

      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

    });

  });

  describe('Activate function', function() {

    it('activate should set up initial correct values loaded from database/services', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeCountGroupsFrequencies = sandbox.spy(controllerScope.vm.cakeCountGroups, 'getPredefinedFrequencies');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');

      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
      expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
      expect(spyCakePermissions.calledOnce).to.equal(true);
      expect(spyCakeCountGroupsFrequencies.calledOnce).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledOnce).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.isAccountAdmin).to.equal(editCountGroupControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(editCountGroupControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.canEditCountGroup).to.equal(editCountGroupControllerTestsMockedData.permissions.edit_count_groups);
      expect(controllerScope.vm.predefinedFrequencies).to.deep.equal(editCountGroupControllerTestsMockedData.predefined_frequencies);
      expect(controllerScope.vm.predefinedFrequenciesKeys).to.deep.equal(_.keys(editCountGroupControllerTestsMockedData.predefined_frequencies));
      expect(controllerScope.vm.countGroupNames).to.deep.equal(_.map(
        _.pluck(
          editCountGroupControllerTestsMockedData.count_groups_response.results,
          'name'
        ), function(countGroupName) {
          return countGroupName.toLowerCase();
        }
      ));

      expect(controllerScope.vm.blockers.initializing).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('activate should set up correct controller properties when existing count group id given in url', function() {

      var testCountGroupId = 65;
      var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');

      controllerScope.vm.$location.search({id: testCountGroupId});

      controllerScope.vm.activate();

      controllerScope.$digest();

      expect(spyCakeItemsLoad.calledWith({'count_group_id': testCountGroupId}, {'sort': 'name'})).to.equal(true);
      expect(spyCakeCountsLoad.calledWith({'count_group_id': testCountGroupId})).to.equal(true);

      expect(controllerScope.vm.editedCountGroup.data).to.have.property('id', testCountGroupId);
      expect(controllerScope.vm.disableIsDefaultSwitch).to.equal(controllerScope.vm.editedCountGroup.data.is_default);
      expect(controllerScope.vm.countGroupNames.indexOf(controllerScope.vm.editedCountGroup.data.name.toLowerCase())).to.equal(-1);

      expect(controllerScope.vm.editedCountGroup.data).to.have.property('frequency')
        .that.is.an('object')
        .that.deep.equals(editCountGroupControllerTestsMockedData.default_readable_frequency);

      expect(controllerScope.vm.editedCountGroup.data).to.have.property('frequencyKey')
        .that.is.an('string')
        .that.equals(editCountGroupControllerTestsMockedData.default_readable_frequency.short);

      expect(controllerScope.vm.editedCountGroup.data).to.have.property('items')
        .that.is.an('array')
        .that.deep.equals([editCountGroupControllerTestsMockedData.items_response.results[0]]);

      expect(controllerScope.vm.editedCountGroup.data).to.have.property('itemNames')
        .that.is.an('string')
        .that.deep.equals(editCountGroupControllerTestsMockedData.items_response.results[0].name);

      expect(controllerScope.vm.canDeleteCountGroup).to.equal((controllerScope.vm.editedCountGroup.data.is_default ? false : (controllerScope.vm.cakeCounts.getCounts().length > 0 ? false : true)) ? controllerScope.vm.canEditCountGroup : false);

      expect(controllerScope.vm.editedCountGroup.form_data).to.deep.equal(controllerScope.vm.editedCountGroup.data);

    });

    it('activate should set up correct controller properties when non-existing count group id given in url', function() {

      var testCountGroupId = 666;
      var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');

      controllerScope.vm.$location.search({id: testCountGroupId});

      controllerScope.vm.activate();

      controllerScope.$digest();

      expect(spyCakeItemsLoad.calledWith({'count_group_id': testCountGroupId}, {'sort': 'name'})).to.equal(false);
      expect(spyCakeCountsLoad.calledWith({'count_group_id': testCountGroupId})).to.equal(false);

      expect(controllerScope.vm.disableIsDefaultSwitch).to.equal(false);

      expect(controllerScope.vm.editedCountGroup.data).to.deep.equal({'is_active' : true, 'is_default' : false});
      expect(controllerScope.vm.editedCountGroup.form_data).to.deep.equal(controllerScope.vm.editedCountGroup.data);
      expect(controllerScope.vm.canDeleteCountGroup).to.equal(false);

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
      expect(controllerScope.vm.blockers.initializing).to.equal(true);

      $rootScope.$digest();

      expect(controllerScope.vm.canEditCountGroup).to.equal(false);
      expect(controllerScope.vm.canDeleteCountGroup).to.equal(false);
      expect(controllerScope.vm.blockers.initializing).to.equal(false);
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

      controllerScope.$digest();

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

      controllerScope.$digest();

      controllerScope.vm.userInfo = {message: 'message',type: 'error'};

      controllerScope.vm.hideMessage();

      expect(controllerScope.vm.userInfo.message).to.equal('');
      expect(controllerScope.vm.userInfo.type).to.equal('');

    });

    it('showMessage should set user message data accoring to params', function() {

      var messageString = 'some message';
      var typeString = 'alert';
      var defaultType = 'info'

      controllerScope.$digest();

      controllerScope.vm.hideMessage();
      controllerScope.vm.showMessage(messageString);

      expect(controllerScope.vm.userInfo.message).to.equal(messageString);
      expect(controllerScope.vm.userInfo.type).to.equal(defaultType);

      controllerScope.vm.hideMessage();
      controllerScope.vm.showMessage(messageString, typeString);

      expect(controllerScope.vm.userInfo.message).to.equal(messageString);
      expect(controllerScope.vm.userInfo.type).to.equal(typeString);

    });

    it('isDefaultChangeCallback should automatically set correct value for is_active field', function() {

      controllerScope.$digest();

      controllerScope.vm.editedCountGroup.form_data.is_default = true;
      controllerScope.vm.editedCountGroup.form_data.is_active = false;

      controllerScope.vm.isDefaultChangeCallback();

      expect(controllerScope.vm.editedCountGroup.form_data.is_active).to.equal(true);

    });

    it('nameChangeCallback should validate duplicate count group name', function() {

      var spyValidationFunc = sandbox.spy(controllerScope.vm, 'nameChangeCallback');

      inject(function($compile) {

        controllerScope.$digest();

        var element = angular.element(
        '<form name="vm.forms.countGroupHeaderForm">' +
          '<input type="text" name="groupName" ng-model="vm.editedCountGroup.form_data.name" ng-change="vm.nameChangeCallback(\'countGroupHeaderForm\');" aria-label="Group Name" ng-maxlength="200" required>' +
        '</form>'
        );
        $compile(element)(controllerScope);

        controllerScope.vm.forms.countGroupHeaderForm.groupName.$setViewValue('test');
        expect(spyValidationFunc.calledWithExactly('countGroupHeaderForm')).to.equal(true);
        expect(controllerScope.vm.forms.countGroupHeaderForm.groupName.$valid).to.equal(true);

        controllerScope.vm.forms.countGroupHeaderForm.groupName.$setViewValue(editCountGroupControllerTestsMockedData.count_groups_response.results[0].name);
        expect(spyValidationFunc.calledWithExactly('countGroupHeaderForm')).to.equal(true);
        expect(controllerScope.vm.forms.countGroupHeaderForm.groupName.$valid).to.equal(false);
        expect(controllerScope.vm.forms.countGroupHeaderForm.groupName.$error).to.deep.equal({'duplicate': true});

      });

    });

    it('nameBlurCallback should reset count group name if there was some original value but user left empty input', function() {

      controllerScope.$digest();

      controllerScope.vm.editedCountGroup.data.name = "test";
      controllerScope.vm.editedCountGroup.form_data.name = "";

      controllerScope.vm.nameBlurCallback();

      expect(controllerScope.vm.editedCountGroup.form_data.name).to.equal(controllerScope.vm.editedCountGroup.data.name);

    });

    it('openItemsPage should redirect to items page and set count group id in shared data', function() {

      var testCountGroupId = 65;
      var spyRedirectFunc = sandbox.spy(controllerScope.vm.cakeSharedData, 'setValue');

      controllerScope.vm.$location.search({id: testCountGroupId});

      controllerScope.vm.activate();

      controllerScope.$digest();

      controllerScope.vm.openItemsPage();

      expect(spyRedirectFunc.calledWithExactly('items_search', {count_group_id: testCountGroupId})).to.equal(true);
      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/items');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');

    });

    it('saveCountGroup should create new count group if page was opened without id param', function() {

      var spyCreateFunc = sandbox.spy(controllerScope.vm.cakeCountGroups, 'createCountGroup');
      var spyRedirectFunc = sandbox.spy(controllerScope.vm, 'goBack');

      controllerScope.$digest();

      controllerScope.vm.editedCountGroup.form_data.name = 'C';
      controllerScope.vm.editedCountGroup.form_data.frequencyKey = 'Weekly';

      controllerScope.vm.saveCountGroup();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyCreateFunc.calledWithExactly(_.extend(
        controllerScope.vm.editedCountGroup.form_data,
        controllerScope.vm.predefinedFrequencies[controllerScope.vm.editedCountGroup.form_data.frequencyKey]
      ))).to.equal(true);
      expect(spyRedirectFunc.called).to.equal(true);

    });

    it('saveCountGroup should update count group if page was opened with existing id param', function() {

      var testCountGroupId = 65;
      var spyUpdateFunc = sandbox.spy(controllerScope.vm.cakeCountGroups, 'updateCountGroup');
      var spyRedirectFunc = sandbox.spy(controllerScope.vm, 'goBack');

      controllerScope.vm.$location.search({id: testCountGroupId});

      controllerScope.vm.activate();

      controllerScope.$digest();

      controllerScope.vm.saveCountGroup();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyUpdateFunc.calledWithExactly(_.extend(
        controllerScope.vm.editedCountGroup.form_data,
        controllerScope.vm.predefinedFrequencies[controllerScope.vm.editedCountGroup.form_data.frequencyKey]
      ))).to.equal(true);
      expect(spyRedirectFunc.called).to.equal(true);

    });

    it('deleteCountGroup should remove count group if page was opened with existing id param and count group can be deleted', function() {

      var testCountGroupId = 67;
      var spyDeleteFunc = sandbox.spy(controllerScope.vm.cakeCountGroups, 'removeCountGroup');
      var spyRedirectFunc = sandbox.spy(controllerScope.vm, 'goBack');

      editCountGroupControllerTestsMockedData.counts_response.count = 0;
      editCountGroupControllerTestsMockedData.counts_response.results = []; // do this so the count group wont see it has any counts

      controllerScope.vm.$location.search({id: testCountGroupId});

      controllerScope.vm.activate();

      controllerScope.$digest();

      controllerScope.vm.deleteCountGroup();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyDeleteFunc.calledWithExactly(testCountGroupId)).to.equal(true);
      expect(spyRedirectFunc.called).to.equal(true);

    });

    it('goBack should redirect to count groups list page', function() {

      controllerScope.$digest();

      controllerScope.vm.goBack();

      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/count_groups');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');

    });

  });

});