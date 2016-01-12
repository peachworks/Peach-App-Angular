let moduleName = 'countItemsService';

class CountItemsService {
  constructor(cakeCommon, cakeSettings, $peach, $q) {
    /** cakeCountItems service
     * Service which provides count items data
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

    var activeLocations;



    /** PRIVATE FUNCTIONS **/

    /**
     * Used to cache loadCountItems request results
     * @param  {object} reqData - response object
     */
    function _processCountItems(reqData) {

      var __this = _this;

      __this.countItems = reqData.results;
      __this.countItemsById = _.object(_.pluck(__this.countItems, 'id'), __this.countItems);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, cakeSettings, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.cakeSettings = cakeSettings;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('count_items'));

      _this.countItems = [];
      _this.countItemsById = {};

    }

    _this.activate = function() {

      var __this = _this;

      activeLocations = __this.cakeSettings.getSettings('active_locations');

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Bulk creates new count items in db
     * Performed update is atomic - either creates all new objects, or none
     * @param  {Array} newCountItemsDataCollection - array of object with data which will be used to create new count items
     * @return {object} promise with response
     */
    _this.bulkCreateCountItems = function(newCountItemsDataCollection) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        if (newCountItemsDataCollection.length > 0) {

          __this.$resource.create(newCountItemsDataCollection)
            .then(
              function(response) {
                resolve(response);
              },
              function(error) {
                __this.cakeCommon.apiErrorHandler(error);
                reject(error);
              }
            );

        } else {

          resolve({collection: []});

        }

      });

    }

    /**
     * Creates new count item in db
     * @param  {object} countItemData - data which will be used to create new count item
     * @return {object} promise with response
     */
    _this.createCountItem = function(countItemData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('count_items'),
        countItemData
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
     * Returns single cached count item, or whole array if countItemId not specified or incorrect
     * @param  {number} [countItemId] - id of the count item to get
     * @return {object|Array} single count item or all count items array
     */
    _this.getCountItem = function(countItemId) {

      var __this = _this;

      if (_.isUndefined(countItemId)) {
        return __this.countItems;
      } else {
        return __this.countItemsById[countItemId];
      }

    }

    /**
     * Returns cached count items array
     * @return {Array} count items array
     */
    _this.getCountItems = function() {

      var __this = _this;

      return __this.countItems;

    }

    /**
     * Returns cached count items collection
     * @return {object} count items collection
     */
    _this.getCountItemsCollection = function() {

      var __this = _this;

      return __this.countItemsById;

    }

    /**
     * Can be used to load count items from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadCountItems = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {

        if (findParams === null) {

          activeLocations
            .then(
              function(locations) {

                var defaultFindParams = {
                  location_id: _.pluck(locations, 'id')
                };

                //__this.$resource.find(defaultFindParams, otherParams)
                __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, defaultFindParams, otherParams)
                  .then(
                    function(response) {
                      if (!disableCache) {
                        _processCountItems(response);
                      }
                      resolve(response);
                    },
                    function(error) {
                      __this.cakeCommon.apiErrorHandler(error);
                      reject(error);
                    }
                  );

              }
            );

        } else {

          //__this.$resource.find(findParams, otherParams)
          __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
            .then(
              function(response) {
                if (!disableCache) {
                  _processCountItems(response);
                }
                resolve(response);
              },
              function(error) {
                __this.cakeCommon.apiErrorHandler(error);
                reject(error);
              }
            );

        }

      });

    }

    /**
     * Deletes count item from db
     * @param {number} countItemId - id of the count item to be deleted
     * @return {object} promise with response
     */
    _this.removeCountItem = function(countItemId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(countItemId)
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
     * Updates existing count item in db
     * @param  {object} countItemData - data which will be used to update count item
     * @return {object} promise with response
     */
    _this.updateCountItem = function(countItemData) {

      var __this = _this;

      var data = _.pick(
        countItemData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('count_items')
        )
      );
      data['id'] = countItemData.id;

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

CountItemsService.$inject = ['commonService', 'settingsService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, CountItemsService)

export default {moduleName, service: CountItemsService};