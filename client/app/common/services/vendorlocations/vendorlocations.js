/** cakeVendorLocations service
 * Service which provides data about connections between vendors and locations - wtm_vendor_locs
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
 * Used to cache loadVendorLocations request results
 * @param  {object} reqData - response object
 */
function _processVendorLocations(reqData) {

  var __this = _this;

  __this.vendorLocations = reqData.results;
  __this.vendorLocationsById = _.object(_.pluck(__this.vendorLocations, 'id'), __this.vendorLocations);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, cakeSettings, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.cakeSettings = cakeSettings;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('vendor_locations'));

  _this.vendorLocations = [];
  _this.vendorLocationsById = {};

  _this.activate();

}

_this.activate = function() {

  var __this = _this;

  activeLocations = __this.cakeSettings.getSettings('active_locations');

}



/** PUBLIC FUNCTIONS **/

/**
 * Bulk creates new vendor locations in db
 * Performed update is atomic - either creates all new objects, or none
 * @param  {Array} newVendorLocationsDataCollection - array of object with data which will be used to create new vendor locations
 * @return {object} promise with response
 */
_this.bulkCreateVendorLocations = function(newVendorLocationsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (newVendorLocationsDataCollection.length > 0) {

      __this.$resource.create(newVendorLocationsDataCollection)
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
 * Bulk deletes vendor locations from db using resource object
 * Performed update is atomic - either removes all objects, or none
 * @param  {Array} vendorLocationsIds array of vendor locations ids we want to remove
 * @return {object} promise with response
 */
_this.bulkDeleteVendorLocations = function(vendorLocationsIds) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (vendorLocationsIds.length > 0) {

      __this.$resource.remove(vendorLocationsIds)
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
 * Bulk updates existing vendor locations in db
 * Performed update is atomic - either updates all given objects, or none
 * @param  {Array} vendorLocationsDataCollection array of object with data which will be used to update subsequent vendor locations
 * @return {object} promise with response
 */
_this.bulkUpdateVendorLocations = function(vendorLocationsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (vendorLocationsDataCollection.length > 0) {

      __this.$resource.update(vendorLocationsDataCollection)
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
 * Returns single cached vendor location, or whole array if vendorLocationId not specified or incorrect
 * @param  {number} [vendorLocationId] - id of the vendor location to get
 * @return {object|Array} single vendor location or all vendor locations array
 */
_this.getVendorLocation = function(vendorLocationId) {

  var __this = _this;

  if (_.isUndefined(vendorLocationId)) {
    return __this.vendorLocations;
  } else {
    return __this.vendorLocationsById[vendorLocationId];
  }

}

/**
 * Returns cached vendor locations array
 * @return {Array} vendor locations array
 */
_this.getVendorLocations = function() {

  var __this = _this;

  return __this.vendorLocations;

}

/**
 * Returns cached vendor locations collection
 * @return {object} vendor locations collection
 */
_this.getVendorLocationsCollection = function() {

  var __this = _this;

  return __this.vendorLocationsById;

}

/**
 * Can be used to load vendor locations from db, eventually caching results. By default it will only load vendor locations for active locations
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadVendorLocations = function(findParams, otherParams, disableCache) {

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
                    _processVendorLocations(response);
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
              _processVendorLocations(response);
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
 * Updates existing vendor location in db
 * @param  {object} vendorLocationData - data which will be used to update vendor location
 * @return {object} promise with response
 */
_this.updateVendorLocation = function(vendorLocationData) {

  var __this = _this;

  var data = _.pick(
    vendorLocationData,
    _.keys(
      __this.cakeCommon.getObjectDefaultData('vendor_locations')
    )
  );
  data['id'] = vendorLocationData.id;

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