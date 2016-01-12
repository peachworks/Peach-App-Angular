let moduleName = 'activeLocationsService';

class ActiveLocationsService {
  constructor(cakeCommon, $peach, $q) {

    /** cakeActiveLocations service
     * Service which allows to manipulate cake activated locations
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE FUNCTIONS **/

    /**
     * Used to cache loadActiveLocations request results
     * @param  {object} reqData - response object
     */
    function _processActiveLocations(reqData) {

      var __this = _this;

      __this.activeLocations = reqData.results;
      __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('active_locations'));

      _this.activeLocations = [];
      _this.activeLocationsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new active location in db
     * @param  {object} activeLocationData - data which will be used to create new active location
     * @return {object} promise with response
     */
    _this.createActiveLocation = function(activeLocationData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('active_locations'),
        activeLocationData
      );

      return __this.$q(function(resolve, reject) {

        __this.$resource.create(data)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Returns single cached active location, or whole array if activeLocationId not specified or incorrect
     * @param  {number} [activeLocationId] - id of the active location to get
     * @return {object|Array} single active location or all active locations array
     */
    _this.getActiveLocation = function(activeLocationId) {

      var __this = _this;

      if (_.isUndefined(activeLocationId)) {
        return __this.activeLocations;
      } else {
        return __this.activeLocationsById[activeLocationId];
      }

    }

    /**
     * Returns cached active locations array
     * @return {Array} active locations array
     */
    _this.getActiveLocations = function() {

      var __this = _this;

      return __this.activeLocations;

    }

    /**
     * Returns cached active locations collection
     * @return {object} active locations collection
     */
    _this.getActiveLocationsCollection = function() {

      var __this = _this;

      return __this.activeLocationsById;

    }

    /**
     * Can be used to load active locations from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadActiveLocations = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {

        //__this.$resource.find(findParams, otherParams)
        __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
          .then(
            function(response) {
              if (!disableCache) {
                _processActiveLocations(response);
              }
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Deletes active location from db
     * @param {number} activeLocationId - id of the active location to be deleted
     * @return {object} promise with response
     */
    _this.removeActiveLocation = function(activeLocationId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(activeLocationId)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Updates existing active location in db
     * @param  {object} activeLocationData - data which will be used to update active location
     * @return {object} promise with response
     */
    _this.updateActiveLocation = function(activeLocationData) {

      var __this = _this;

      var data = _.pick(
        activeLocationData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('active_locations')
        )
      );
      data['id'] = activeLocationData.id;

      return __this.$q(function(resolve, reject) {

        __this.$resource.update(data)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }
  }
}

ActiveLocationsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, ActiveLocationsService)

export default {moduleName, service: ActiveLocationsService};
