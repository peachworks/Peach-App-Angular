/** cakeItemUnits service
 * Service which provides data about connections between items and units - wtm_inv_item_units
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
 * Used to cache loadItemUnits request results
 * @param  {object} reqData - response object
 */
function _processItemUnits(reqData) {

  var __this = _this;

  __this.itemUnits = reqData.results;
  __this.itemUnitsById = _.object(_.pluck(__this.itemUnits, 'id'), __this.itemUnits);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('item_units'));

  _this.itemUnits = [];
  _this.itemUnitsById = {};

}



/** PUBLIC FUNCTIONS **/

/**
 * Bulk creates new item units in db
 * Performed update is atomic - either creates all new objects, or none
 * @param  {Array} newItemUnitsDataCollection - array of object with data which will be used to create new item units
 * @return {object} promise with response
 */
_this.bulkCreateItemUnits = function(newItemUnitsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (newItemUnitsDataCollection.length > 0) {

      __this.$resource.create(newItemUnitsDataCollection)
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
 * !!! IMPORTANT - BULK DELETE IS FORBIDDEN IN THE BEFORE DELETE TRIGGER, DO NOT USE THIS FUNCTION, BECAUSE IT WILL ALWAYS FAIL !!!
 * Bulk deletes item units from db using resource object
 * Performed update is atomic - either removes all objects, or none
 * @param  {Array} itemUnitsIds array of item units ids we want to remove
 * @return {object} promise with response
 */
_this.bulkDeleteItemUnits = function(itemUnitsIds) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (itemUnitsIds.length > 0) {

      __this.$resource.remove(itemUnitsIds)
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
 * Bulk updates existing item units in db
 * Performed update is atomic - either updates all given objects, or none
 * @param  {Array} itemUnitsDataCollection array of object with data which will be used to update subsequent item units
 * @return {object} promise with response
 */
_this.bulkUpdateItemUnits = function(itemUnitsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (itemUnitsDataCollection.length > 0) {

      __this.$resource.update(itemUnitsDataCollection)
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
 * Creates new item unit in db
 * @param  {object} itemUnitData - data which will be used to create new item unit
 * @param  {object} [additionalQueryParams] - some additional query params
 * @return {object} promise with response
 */
_this.createItemUnit = function(itemUnitData, additionalQueryParams) {

  var __this = _this;

  var data = _.extend(
    {},
    __this.cakeCommon.getObjectDefaultData('item_units'),
    itemUnitData
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
 * Deletes item unit from db
 * @param  {number} itemUnitId - id of the item unit we want to remove
 * @return {object} promise with response
 */
_this.deleteItemUnit = function(itemUnitId) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    __this.$resource.remove(itemUnitId)
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
 * Returns single cached item unit, or whole array if itemUnitId not specified or incorrect
 * @param  {number} [itemUnitId] - id of the item unit to get
 * @return {object|Array} single item unit or all item units array
 */
_this.getItemUnit = function(itemUnitId) {

  var __this = _this;

  if (_.isUndefined(itemUnitId)) {
    return __this.itemUnits;
  } else {
    return __this.itemUnitsById[itemUnitId];
  }

}

/**
 * Returns cached item units array
 * @return {Array} item units array
 */
_this.getItemUnits = function() {

  var __this = _this;

  return __this.itemUnits;

}

/**
 * Returns cached item units collection
 * @return {object} item units collection
 */
_this.getItemUnitsCollection = function() {

  var __this = _this;

  return __this.itemUnitsById;

}

/**
 * Can be used to load item units from db, eventually caching results
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadItemUnits = function(findParams, otherParams, disableCache) {

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
            _processItemUnits(response);
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
 * Updates existing item unit in db
 * @param  {object} itemUnitData - data which will be used to update item unit
 * @return {object} promise with response
 */
_this.updateItemUnit = function(itemUnitData) {

  var __this = _this;

  var data = _.pick(
    itemUnitData,
    _.keys(
      __this.cakeCommon.getObjectDefaultData('item_units')
    )
  );
  data['id'] = itemUnitData.id;

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