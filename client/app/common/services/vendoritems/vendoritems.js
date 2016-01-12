/** cakeVendorItems service
 * Service which provides data about connections between vendors and items - wtm_vendor_inv_items
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

/** PRIVATE FUNCTIONS **/

/**
 * Used to cache loadVendorItems request results
 * @param  {object} reqData - response object
 */
function _processVendorItems(reqData) {

  var __this = _this;

  __this.vendorItems = reqData.results;
  __this.vendorItemsById = _.object(_.pluck(__this.vendorItems, 'id'), __this.vendorItems);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('vendor_items'));

  _this.vendorItems = [];
  _this.vendorItemsById = {};

}



/** PUBLIC FUNCTIONS **/

/**
 * Bulk creates new vendor items in db
 * Performed update is atomic - either creates all new objects, or none
 * @param  {Array} newVendorItemsDataCollection - array of object with data which will be used to create new vendor items
 * @return {object} promise with response
 */
_this.bulkCreateVendorItems = function(newVendorItemsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (newVendorItemsDataCollection.length > 0) {

      __this.$resource.create(newVendorItemsDataCollection)
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
 * Bulk deletes vendor items from db using resource object
 * Performed update is atomic - either removes all objects, or none
 * @param  {Array} vendorItemsIds array of vendor items ids we want to remove
 * @return {object} promise with response
 */
_this.bulkDeleteVendorItems = function(vendorItemsIds) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (vendorItemsIds.length > 0) {

      __this.$resource.remove(vendorItemsIds)
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
 * Bulk updates existing vendor items in db
 * Performed update is atomic - either updates all given objects, or none
 * @param  {Array} vendorItemsDataCollection array of object with data which will be used to update subsequent vendor items
 * @return {object} promise with response
 */
_this.bulkUpdateVendorItems = function(vendorItemsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (vendorItemsDataCollection.length > 0) {

      __this.$resource.update(vendorItemsDataCollection)
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
 * Creates new vendor item in db
 * @param  {object} vendorItemData - data which will be used to create new vendor item
 * @param  {object} [additionalQueryParams] - some additional query params
 * @return {object} promise with response
 */
_this.createVendorItem = function(vendorItemData, additionalQueryParams) {

  var __this = _this;

  var data = _.extend(
    {},
    __this.cakeCommon.getObjectDefaultData('vendor_items'),
    vendorItemData
  );
  
  var queryParams = additionalQueryParams || null;

  return __this.$q(function(resolve, reject) {

    __this.$resource.create(data, queryParams)
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
 * Deletes vendor item from db
 * @param  {number} vendorItemId - id of the vendor item we want to remove
 * @return {object} promise with response
 */
_this.deleteVendorItem = function(vendorItemId) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    __this.$resource.remove(vendorItemId)
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
 * Returns single cached vendor item, or whole array if vendorItemId not specified or incorrect
 * @param  {number} [vendorItemId] - id of the vendor item to get
 * @return {object|Array} single vendor item or all vendor items array
 */
_this.getVendorItem = function(vendorItemId) {

  var __this = _this;

  if (_.isUndefined(vendorItemId)) {
    return __this.vendorItems;
  } else {
    return __this.vendorItemsById[vendorItemId];
  }

}

/**
 * Returns cached vendor items array
 * @return {Array} vendor items array
 */
_this.getVendorItems = function() {

  var __this = _this;

  return __this.vendorItems;

}

/**
 * Returns cached vendor items collection
 * @return {object} vendor items collection
 */
_this.getVendorItemsCollection = function() {

  var __this = _this;

  return __this.vendorItemsById;

}

/**
 * Can be used to load vendor items from db, eventually caching results
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadVendorItems = function(findParams, otherParams, disableCache) {

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
            _processVendorItems(response);
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
 * Updates existing vendor item in db
 * @param  {object} vendorItemData - data which will be used to update vendor item
 * @return {object} promise with response
 */
_this.updateVendorItem = function(vendorItemData) {

  var __this = _this;

  var data = _.pick(
    vendorItemData,
    _.keys(
      __this.cakeCommon.getObjectDefaultData('vendor_items')
    )
  );
  data['id'] = vendorItemData.id;

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



_constructor(cakeCommon, $peach, $q);
return _this;