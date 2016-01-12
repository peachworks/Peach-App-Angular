
class AddActiveLocationController {
  constructor($filter, $location, $peachToast, $q, cakeCommon, cakeActiveLocations, cakePermissions, cakeSettings) {
    /** Add active location settings modal page
     * Can be used to activate new locations in Cake
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

    function _parseActiveLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _.each(
          __this.activeLocations,
          function(activeLocation) {

            activeLocation.display_name = (activeLocation.number ? activeLocation.number + ' - ' : '') + activeLocation.name;

            return;

          }
        );

        __this.activeLocations = __this.$filter('orderBy')(__this.activeLocations, 'display_name');

        resolve(true);

      });

    }

    function _parseInactiveLocations() {

      var __this = _this;

      __this.inactiveLocations = [];

      return __this.$q(function(resolve, reject) {

        var activeLocationsIds = _.pluck(__this.activeLocations, 'id');

        _.each(
          __this.accountLocations,
          function(accountLocation) {

            accountLocation.display_name = (accountLocation.number ? accountLocation.number + ' - ' : '') + accountLocation.name;

            if (activeLocationsIds.indexOf(accountLocation.id) < 0) {

              __this.inactiveLocations.push(accountLocation);

            }

            return;

          }
        );

        __this.inactiveLocations = __this.$filter('orderBy')(__this.inactiveLocations, 'name');

        resolve(true);

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($filter, $location, $peachToast, $q, cakeCommon, cakeActiveLocations, cakePermissions, cakeSettings) {

      _this.$filter = $filter;
      _this.$location = $location;
      _this.$peachToast = $peachToast;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeActiveLocations = cakeActiveLocations;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;

      _this.blockers = {
        api_processing  : false,
        initializing    : true
      };

      _this.formData = {
        location_id         : null,
        active_location_id  : null,
        copy_location       : true
      }

      _this.accountLocations = []; // all account locations
      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditActiveLocations = false; // if user has permission to edit active locations
      _this.forms = {};
      _this.inactiveLocations = []; //all account locations which were not yet activated for cake
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations and count groups
      __this.$q.all({
        is_account_admin          : __this.cakeCommon.isUserAccountAdmin(),
        account_locations         : __this.cakeSettings.getSettings('account_locations'),
        active_locations          : __this.cakeSettings.getSettings('active_locations'),
        can_edit_active_locations : __this.cakePermissions.userHasPermission('edit_active_locations')
      })
        .then(
          function(results) {

            __this.accountLocations = results['account_locations'];

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditActiveLocations = results['can_edit_active_locations'];

            __this.$q.all(
              [
                _parseActiveLocations(),
                _parseInactiveLocations()
              ]
            )
              .then(
                function() {

                  __this.blockers.initializing = false;

                },
                function(error) {

                  __this.canEditActiveLocations = false;
                  __this.blockers.initializing = false;

                  __this.errorHandler(error);

                }
              );

          },
          function(error) {

            __this.canEditActiveLocations = false;
            __this.blockers.initializing = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

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

      __this.$location.path('/settings/items');

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }

    _this.activateLocation = function() {

      var __this = _this;

      if (!__this.blockers.api_processing && !__this.blockers.saving && __this.canEditActiveLocations) {

        __this.blockers.api_processing = true;

        __this.cakeSettings.activateLocation({
          location_id                 : parseInt(__this.formData.location_id, 10),
          copy_data_from_location_id  : __this.formData.copy_location ? parseInt(__this.formData.active_location_id) : null
        }).
          then( 
            function(response) {

              var activatedLocation = _.remove(__this.inactiveLocations, function(inactiveLocation) {
                return inactiveLocation.id == response.location_id;
              })[0];

              activatedLocation.wtm_inv_loc = response;

              __this.activeLocations.push(activatedLocation);
              __this.activeLocationsById[activatedLocation.id] = activatedLocation;

              __this.activeLocations = __this.$filter('orderBy')(__this.activeLocations, 'display_name');

              __this.formData.active_location_id = null;
              __this.formData.location_id = null;
              __this.forms.activateLocationForm.location.$setPristine();
              
              __this.$peachToast.show('Activated ' + activatedLocation.name);

              __this.blockers.api_processing = false;

            },
            function(error) {

              __this.blockers.api_processing = false;

              __this.errorHandler(error);

            }
          );

      }

    }
  }
}

AddActiveLocationController.$inject = ['$filter', '$location', '$peachToast', '$q', 'commonService',
                                       'activeLocationsService', 'permissionsService', 'settingsService'];

export default AddActiveLocationController;