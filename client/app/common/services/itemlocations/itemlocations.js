/** cakeItemLocations service
 * Service which provides data about connections between items and locations - wtm_inv_item_locs
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
 * Used to cache loadItemLocations request results
 * @param  {object} reqData - response object
 */
function _processItemLocations(reqData) {

  var __this = _this;

  __this.itemLocations = reqData.results;
  __this.itemLocationsById = _.object(_.pluck(__this.itemLocations, 'id'), __this.itemLocations);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, cakeSettings, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.cakeSettings = cakeSettings;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('item_locations'));

  _this.itemLocations = [];
  _this.itemLocationsById = {};

  _this.activate();

}

_this.activate = function() {

  var __this = _this;

  activeLocations = __this.cakeSettings.getSettings('active_locations');

}



/** PUBLIC FUNCTIONS **/

/**
 * Bulk creates new item locations in db
 * Performed update is atomic - either creates all new objects, or none
 * @param  {Array} newItemLocationsDataCollection - array of object with data which will be used to create new item locations
 * @return {object} promise with response
 */
_this.bulkCreateItemLocations = function(newItemLocationsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (newItemLocationsDataCollection.length > 0) {

      __this.$resource.create(newItemLocationsDataCollection)
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
 * Bulk deletes item locations from db using resource object
 * Performed update is atomic - either removes all objects, or none
 * @param  {Array} itemLocationsIds array of item locations ids we want to remove
 * @return {object} promise with response
 */
_this.bulkDeleteItemLocations = function(itemLocationsIds) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (itemLocationsIds.length > 0) {

      __this.$resource.remove(itemLocationsIds)
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
 * Bulk updates existing item locations in db
 * Performed update is atomic - either updates all given objects, or none
 * @param  {Array} itemLocationsDataCollection array of object with data which will be used to update subsequent item locations
 * @return {object} promise with response
 */
_this.bulkUpdateItemLocations = function(itemLocationsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (itemLocationsDataCollection.length > 0) {

      __this.$resource.update(itemLocationsDataCollection)
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
 * Returns single cached item location, or whole array if itemLocationId not specified or incorrect
 * @param  {number} [itemLocationId] - id of the item location to get
 * @return {object|Array} single item location or all item locations array
 */
_this.getItemLocation = function(itemLocationId) {

  var __this = _this;

  if (_.isUndefined(itemLocationId)) {
    return __this.itemLocations;
  } else {
    return __this.itemLocationsById[itemLocationId];
  }

}

/**
 * Returns cached item locations array
 * @return {Array} item locations array
 */
_this.getItemLocations = function() {

  var __this = _this;

  return __this.itemLocations;

}

/**
 * Returns cached item locations collection
 * @return {object} item locations collection
 */
_this.getItemLocationsCollection = function() {

  var __this = _this;

  return __this.itemLocationsById;

}

/**
 * Can be used to load item locations from db, eventually caching results. By default it will only load item locations for active locations
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadItemLocations = function(findParams, otherParams, disableCache) {

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
                    _processItemLocations(response);
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
              _processItemLocations(response);
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
 * Updates existing item location in db
 * @param  {object} itemLocationData - data which will be used to update item location
 * @return {object} promise with response
 */
_this.updateItemLocation = function(itemLocationData) {

  var __this = _this;

  var data = _.pick(
    itemLocationData,
    _.keys(
      __this.cakeCommon.getObjectDefaultData('item_locations')
    )
  );
  data['id'] = itemLocationData.id;

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



_constructor(cakeCommon, cakeSettings, $peach, $q);
return _this;