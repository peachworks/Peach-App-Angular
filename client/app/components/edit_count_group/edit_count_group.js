
class EditCountGroupController {
  constructor($location, $mdDialog, $q, cakeCommon, cakeCountGroups, cakeCounts,
              cakeItems, cakePermissions, cakeSharedData) {
    /** Edit count group settings modal page
     * Allows to edit count groups and create new ones
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE VARIABLES (non-scope variables) **/

    /** PRIVATE FUNCTIONS (non-scope functions) **/

    /** CONSTRUCTOR **/

    function _constructor($location, $mdDialog, $q, cakeCommon, cakeCountGroups, cakeCounts, cakeItems, cakePermissions, cakeSharedData) {

      _this.$location = $location;
      _this.$mdDialog = $mdDialog;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeCounts = cakeCounts;
      _this.cakeItems = cakeItems;
      _this.cakePermissions = cakePermissions;
      _this.cakeSharedData = cakeSharedData;

      _this.blockers = {
        api_processing  : false,
        initializing    : true
      };

      // count group to be edited - eventually null if creating new one
      _this.editedCountGroup = {
        data          : null,
        form_data     : {}
      };

      _this.canDeleteCountGroup = false; // if there are already some counts for this group, this will be turned off
      _this.canEditCountGroup = false; // if user has permission to edit count groups
      _this.countGroups = []; // all available count groups array
      _this.countGroupNames = []; // all available count groups names - used to find duplicates in form validation
      _this.disableIsDefaultSwitch = false; // if is_default of edited item was true, switch is disabled
      _this.forms = {};
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.items = []; // all items of currently edited count group
      _this.predefinedFrequencies = {}; // predefined frequencies for count groups
      _this.predefinedFrequenciesKeys = []; // predefined frequencies keys for count groups
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - all count groups (we need them to check for duplicate names later on), check permissions
      __this.$q.all({
        is_account_admin      : __this.cakeCommon.isUserAccountAdmin(),
        can_edit_count_groups : __this.cakePermissions.userHasPermission('edit_count_groups'),
        count_groups          : __this.cakeCountGroups.loadCountGroups(),
        predefined_frequencies: __this.cakeCountGroups.getPredefinedFrequencies()
      })
        .then(
          function(results) {

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditCountGroup = results['can_edit_count_groups'];
            
            __this.predefinedFrequencies = results['predefined_frequencies'];
            __this.predefinedFrequenciesKeys = _.keys(__this.predefinedFrequencies);

            // collect count groups names - to lowercase, later when looking for duplicates we'll compare lowercase values
            __this.countGroupNames = _.map(
              _.pluck(
                __this.cakeCountGroups.getCountGroups(),
                'name'
              ), function(countGroupName) {
                return countGroupName.toLowerCase();
              }
            );

            // if id specified in url, try to find count group to be edited
            if (__this.$location.search()['id'] && __this.$location.search()['id'] !== 'new') {

              __this.editedCountGroup.data = _.find(
                __this.cakeCountGroups.getCountGroups(),
                {
                  id: parseInt(__this.$location.search()['id'])
                }
              );

            }

            // if count group found - load its items and remove name from names array - this shouldn't be there in disallowed duplicates
            if (__this.editedCountGroup.data && __this.editedCountGroup.data.id) {

              __this.disableIsDefaultSwitch = __this.editedCountGroup.data.is_default;

              __this.countGroupNames = _.without(__this.countGroupNames, __this.editedCountGroup.data.name.toLowerCase());

              __this.editedCountGroup.data.frequency = __this.cakeCountGroups.getReadableFrequency(__this.editedCountGroup.data);
              __this.editedCountGroup.data.frequencyKey = __this.editedCountGroup.data.frequency.short;

              __this.$q.all([
                __this.cakeItems.loadItems(
                  {
                    count_group_id: __this.editedCountGroup.data.id
                  },
                  {
                    sort: 'name'
                  }
                ),
                __this.cakeCounts.loadCounts(
                  {
                    count_group_id: __this.editedCountGroup.data.id
                  }
                )
              ])
                .then(
                  function() {

                    __this.editedCountGroup.data.items = __this.cakeItems.getItems();
                    __this.editedCountGroup.data.itemNames = (__this.editedCountGroup.data.items.length > 5) ? _.slice(_.pluck(__this.cakeItems.getItems(), 'name'), 0, 5).join(', ') + '...' : _.pluck(__this.cakeItems.getItems(), 'name').join(', ');

                    // count group can be deleted if user has permission to edit count groups and this is not default count group and there are no counts for this count group yet
                    __this.canDeleteCountGroup = __this.editedCountGroup.data.is_default ? false : (__this.cakeCounts.getCounts().length > 0 ? false : true);
                    __this.canDeleteCountGroup = __this.canDeleteCountGroup ? __this.canEditCountGroup : false;

                    __this.editedCountGroup.form_data = angular.copy(__this.editedCountGroup.data);

                    __this.blockers.initializing = false;


                  },
                  function(error) {

                    __this.canEditCountGroup = false;
                    __this.blockers.initializing = false;

                    __this.errorHandler(error);

                  }
                );

            } else {
              
              __this.editedCountGroup.data = {
                is_active   : true,
                is_default  : false
              };

              __this.editedCountGroup.form_data = angular.copy(__this.editedCountGroup.data);

              __this.blockers.initializing = false;

            }

          },
          function(error) {

            __this.canEditCountGroup = false;
            __this.blockers.initializing = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    _this.confirmDeleteCountGroup = function(ev) {

      var __this = _this;

      __this.$mdDialog.show({
        disableParentScroll : true,
        hasBackdrop : true,
        template: '<md-dialog flex-sm="90" flex-md="55" flex-gt-md="35" flex-gt-lg="25">' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>Are you sure you want to delete your count group?<br /><br /></div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="confirm();" title="YES, DELETE MY COUNT GROUP" aria-label="YES, DELETE MY COUNT GROUP">' +
          '                 <span>YES, DELETE MY COUNT GROUP</span>' +
          '             </md-button>' +
          '         </div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="cancel();" title="NO, TAKE ME BACK" aria-label="NO, TAKE ME BACK">' +
          '                 <span>NO, TAKE ME BACK</span>' +
          '             </md-button>' +
          '         </div>' +
          '     </p>' +
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {
          $scope.confirm = function() {
            __this.deleteCountGroup();
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.hide();
          };
        }]
      });

    }

    _this.deleteCountGroup = function() {

      var __this = _this;

      if (__this.editedCountGroup.data.id && __this.canDeleteCountGroup) {

        __this.blockers.api_processing = true;

        __this.cakeCountGroups.removeCountGroup(__this.editedCountGroup.data.id)
          .then(
            function() {

              __this.blockers.api_processing = false;

              __this.goBack();

            },
            function(error) {
              
              __this.blockers.api_processing = false;

              __this.errorHandler(error);
              
            }
          );

      }

    }

    // handle errors
    _this.errorHandler = function(error, logError, callback) {

      var __this = _this;

      var message = '';

      logError = logError || false;

      if (_.isString(error)) {

        message = 'There was an error: ' + error;

      } else {

        message = 'There was an error, please check console log for more details.';

      }

      __this.showMessage(message, 'alert');

      if (logError) {

        __this.cakeCommon.apiErrorHandler(error);

      }

      if (_.isFunction(callback)) {

        return callback();

      }

      return;

    }

    _this.goBack = function() {

      var __this = _this;

      __this.$location.path('/settings/count_groups').search('id', null);

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.isDefaultChangeCallback = function() {

      var __this = _this;

      if (__this.editedCountGroup.form_data.is_default) {

        __this.editedCountGroup.form_data.is_active = true;

      }

    }

    _this.nameChangeCallback = function(formName) {

      var __this = _this;

      __this.forms[formName].groupName.$setValidity('duplicate', true);

      if (__this.editedCountGroup.form_data.name && __this.countGroupNames.indexOf(__this.editedCountGroup.form_data.name.toLowerCase()) >= 0) {

        __this.forms[formName].groupName.$setValidity('duplicate', false);

      }

    }

    _this.nameBlurCallback = function() {

      var __this = _this;

      if (!__this.editedCountGroup.form_data.name) {

        __this.editedCountGroup.form_data.name = __this.editedCountGroup.data.name;

      }

    }

    _this.openItemsPage = function() {

      var __this = _this;

      if (__this.editedCountGroup.data.id) {

        __this.cakeSharedData.setValue('items_search', {count_group_id: __this.editedCountGroup.data.id});
        __this.$location.path('/settings/items').search('id', null);

      }

    }

    _this.saveCountGroup = function() {

      var __this = _this;

      if (__this.canEditCountGroup) {

        __this.blockers.api_processing = true;

        var data = _.extend(
          __this.editedCountGroup.form_data,
          __this.predefinedFrequencies[__this.editedCountGroup.form_data.frequencyKey]
        );

        if (__this.editedCountGroup.data.id) {

          __this.cakeCountGroups.updateCountGroup(data)
            .then(
              function() {

                __this.blockers.api_processing = false;

                __this.goBack();

              },
              function(error) {

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        } else {

          __this.cakeCountGroups.createCountGroup(data)
            .then(
              function() {

                __this.blockers.api_processing = false;

                __this.goBack();

              },
              function() {

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

      }

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }
  }
}

EditCountGroupController.$inject = ['$location', '$mdDialog', '$q', 'commonService', 'countGroupsService',
                                    'countsService', 'itemsService', 'permissionsService',
                                    'sharedDataService'];

export default EditCountGroupController;