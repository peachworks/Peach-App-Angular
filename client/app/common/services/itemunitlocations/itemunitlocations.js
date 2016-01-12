/** cakeItemUnitLocations service
 * Service which provides data about connections between items units and locations - wtm_inv_item_unit_locs
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
 * Used to cache loadItemUnitLocations request results
 * @param  {object} reqData - response object
 */
function _processItemUnitLocations(reqData) {

  var __this = _this;

  __this.itemUnitLocations = reqData.results;
  __this.itemUnitLocationsById = _.object(_.pluck(__this.itemUnitLocations, 'id'), __this.itemUnitLocations);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, cakeSettings, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.cakeSettings = cakeSettings;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('item_unit_locations'));

  _this.itemUnitLocations = [];
  _this.itemUnitLocationsById = {};

  _this.activate();

}

_this.activate = function() {

  var __this = _this;

  activeLocations = __this.cakeSettings.getSettings('active_locations');

}



/** PUBLIC FUNCTIONS **/

/**
 * Bulk creates new item unit locations in db
 * Performed update is atomic - either creates all new objects, or none
 * @param  {Array} newItemUnitLocationsDataCollection - array of object with data which will be used to create new item unit locations
 * @return {object} promise with response
 */
_this.bulkCreateItemUnitLocations = function(newItemUnitLocationsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (newItemUnitLocationsDataCollection.length > 0) {

      __this.$resource.create(newItemUnitLocationsDataCollection)
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
 * Bulk deletes item unit locations from db using resource object
 * Performed update is atomic - either removes all objects, or none
 * @param  {Array|object} collection - can be either an array of ids to be removed, or object containing array of locations ids and find object
 * @return {object} promise with response
 */
_this.bulkDeleteItemUnitLocations = function(collection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {
      
    if (_.isArray(collection)) {
    
      if (collection.length > 0) {

        __this.$resource.remove(collection)
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
      
    } else {
        
        if (collection.find && collection.location_ids) {

          if (!_.isEmpty(collection.find) && !_.isEmpty(collection.location_ids)) {
          
            __this.$resource.findAndRemove(
              collection.find,
              {
                location_ids: collection.location_ids
              }
            )
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
            
            resolve({success: 0});
            
          }    
            
        } else {
          
          var error = {message: "Bulk DELETE with find wuery requires find object and location_ids array in input collection object"};
          
          __this.cakeCommon.apiErrorHandler(error);
          reject(error);    
            
        }
        
    }

  });

}

/**
 * Bulk updates existing item unit locations in db
 * Performed update is atomic - either updates all given objects, or none
 * @param  {Array} itemUnitLocationsDataCollection array of object with data which will be used to update subsequent item unit locations
 * @return {object} promise with response
 */
_this.bulkUpdateItemUnitLocations = function(itemUnitLocationsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (itemUnitLocationsDataCollection.length > 0) {

      __this.$resource.update(itemUnitLocationsDataCollection)
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
 * Returns single cached item unit location, or whole array if itemUnitLocationId not specified or incorrect
 * @param  {number} [itemUnitLocationId] - id of the item unit location to get
 * @return {object|Array} single item unit location or all item unit locations array
 */
_this.getItemUnitLocation = function(itemUnitLocationId) {

  var __this = _this;

  if (_.isUndefined(itemUnitLocationId)) {
    return __this.itemUnitLocations;
  } else {
    return __this.itemUnitLocationsById[itemUnitLocationId];
  }

}

/**
 * Returns cached item unit locations array
 * @return {Array} item unit locations array
 */
_this.getItemUnitLocations = function() {

  var __this = _this;

  return __this.itemUnitLocations;

}

/**
 * Returns cached item unit locations collection
 * @return {object} item unit locations collection
 */
_this.getItemUnitLocationsCollection = function() {

  var __this = _this;

  return __this.itemUnitLocationsById;

}

/**
 * Can be used to load item unit locations from db, eventually caching results. By default it will only load item unit locations for active locations
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadItemUnitLocations = function(findParams, otherParams, disableCache) {

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
                    _processItemUnitLocations(response);
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
              _processItemUnitLocations(response);
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
 * Updates existing item unit location in db
 * @param  {object} itemUnitLocationData - data which will be used to update item unit location
 * @return {object} promise with response
 */
_this.updateItemUnitLocation = function(itemUnitLocationData) {

  var __this = _this;

  var data = _.pick(
    itemUnitLocationData,
    _.keys(
      __this.cakeCommon.getObjectDefaultData('item_unit_locations')
    )
  );
  data['id'] = itemUnitLocationData.id;

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