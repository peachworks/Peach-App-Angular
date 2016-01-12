let moduleName = 'settingsService';

class SettingsService {
  constructor($http, $peach, $q, cakeActiveLocations, cakeCommon) {
    /** cakeSettings service
     * Manages Cake app settings
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE VARIABLES **/

    var cakeSettings;



    /** PRIVATE FUNCTIONS **/

    /**
     * PRIVATE FUNCTION
     * Returns bool value of given account preference setting.
     * If setting is not defined, empty, false, empty string or "false", it'll return false
     * @param  {string} prefName - name of account preference
     * @return {object} promise with bool value of the preference
     */
    function _getAccountPreferenceBoolValue(prefName) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _getAccountPreferenceValue(prefName)
          .then(
            function(prefVal) {

              if (prefVal == null || _.isUndefined(prefVal) || prefVal === 'false' || prefVal === '' ) {
                resolve(false);
              } else {
                resolve(true);
              }

            },
            function(error)  {
              reject(error);
              __this.cakeCommon.apiErrorHandler(error);
            }
          );

      });

    }

    /**
     * PRIVATE FUNCTION
     * Returns given preference setting real value
     * @param  {string} prefName - name of account preference
     * @return {object} promise with chosen setting value
     */
    function _getAccountPreferenceValue(prefName) {

      var __this = _this;

      return __this.$peach.account.getPrefs(prefName);

    }

    /**
     * PRIVATE FUNCTION
     * Returns a list of account locations which were activated for use in Cake
     * @return {array} array of locations objects with entries from wtm_inv_locs included
     */
    function _getActiveLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var parsedLocations = {};

        __this.$q.all(
          {
            'account_locations' : _getAccountLocations(),
            'active_locations'  : __this.cakeActiveLocations.loadActiveLocations()
          }
        )
          .then(
            function(results) {

              var locationIds = _.pluck(results['account_locations'], 'id');
              var locationsById = _.object(locationIds, results['account_locations']);

              _.each(
                results['active_locations']['results'],
                function(cakeLocation) {

                  if (locationIds.indexOf(cakeLocation.location_id) >=0 && !parsedLocations[cakeLocation.location_id]) {

                    parsedLocations[cakeLocation.location_id] = _.extend(locationsById[cakeLocation.location_id], {wtm_inv_loc: cakeLocation});

                  }

                  return;

                }
              );

              resolve(_.sortBy(_.values(parsedLocations), 'name'));

            },
            function(error)  {
              resolve([]);
            }
          );

      });

    }

    /**
     * PRIVATE FUNCTION
     * Returns a list of account locations
     * @return {array} array of account locations
     */
    function _getAccountLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$peach.account.getLocations()
          .then(
            function(results) {

              resolve(results);

            },
            function(error)  {
              resolve([]);
              __this.cakeCommon.apiErrorHandler(error);
            }
          );

      });

    }

    function  _getCurrentUTCTimestamp() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$http.get(
          __this.$peach.session.getApiUrl().replace(__this.$peach.session.getApiVersion(), '') + 'time'
        )
          .success(
            function(response) {
              
              resolve(response['time']);

            }
          )
          .error(
            function(error) {
              
              reject(error);
              __this.cakeCommon.apiErrorHandler(error);

            }
          );

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($http, $peach, $q, cakeActiveLocations, cakeCommon) {

      _this.$http = $http;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.cakeActiveLocations = cakeActiveLocations;
      _this.cakeCommon = cakeCommon;

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.refreshSettings();

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Activates location and reloads active_locations setting
     * @param  {object} data data to create new wtm_inv_locs entry - it should contain data like {location_id: ?, copy_data_from_location_id: ?}
     * @return {object} promise with response from api
     */
    _this.activateLocation = function(data) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var reqData = {};

        if (data.location_id) {

          reqData.location_id = data.location_id;

          if (data.copy_data_from_location_id) {

            reqData.is_copied = true;
            reqData.copied_from = data.copy_data_from_location_id;

          }

          __this.cakeActiveLocations.createActiveLocation(reqData)
            .then(
              function(response) {
                
                __this.refreshSettings('active_locations')
                  .then(
                    function() {
                      
                      resolve(response);                  

                    },
                    reject
                  );

              },
              reject
            );

        } else {

          reject("No location id provided");

        }

      });

    }

    /**
     * Returns either whole settings object or single setting value
     * @param  {string} [specificSettingKey] - key name of the setting to get
     * @return {object} can be either object of all settings promises if no key waqs given, or a promise with specific settings value
     */
    _this.getSettings = function(specificSettingKey) {

      if (_.isUndefined(specificSettingKey)) {
        return cakeSettings;
      } else {
        return cakeSettings[specificSettingKey];
      }

    }

    /**
     * Builds settings object with values loaded from $peach service
     * If a key was given, then only specific setting will be loaded - should be only used after at least once whole object was built
     * @param  {string} [specificSettingKey] - specific key name to be loaded
     * @return {object} promise with requested setting value of whole settings object
     */
    _this.refreshSettings = function(specificSettingKey) {

      var __this = _this;

      if (_.isUndefined(specificSettingKey)) {

        cakeSettings = {
          account_locations       : _getAccountLocations(),
          active_locations        : _getActiveLocations(),
          units_of_measure_loaded : _getAccountPreferenceBoolValue('units_of_measure_loaded'),
          current_utc_timestamp   : _getCurrentUTCTimestamp()
        };

        return cakeSettings;

      } else {

        switch (specificSettingKey) {
        case 'account_locations':
          cakeSettings['account_locations'] = _getAccountLocations();
          break;
        case 'active_locations':
          cakeSettings['active_locations'] = _getActiveLocations();
          break;
        case 'units_of_measure_loaded':
          cakeSettings['units_of_measure_loaded'] = _getAccountPreferenceBoolValue('units_of_measure_loaded');
          break;
        case 'current_utc_timestamp':
          cakeSettings['current_utc_timestamp'] = _getCurrentUTCTimestamp();
        default:
          break;
        }

        return cakeSettings[specificSettingKey];

      }

    }
  }
}

SettingsService.$inject = ['$http', '$peach', '$q', 'activeLocationsService', 'commonService'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, SettingsService)

export default {moduleName, service: SettingsService};