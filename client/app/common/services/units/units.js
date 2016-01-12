/** cakeUnits service
 * Service which provides units data
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

var unitsInitializePromise = null;

var UNITS = [
    {
        name: 'Bag',
        abbr: 'bg',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Batch',
        abbr: 'bat',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Block',
        abbr: 'bk',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Bottle',
        abbr: 'bt',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Box',
        abbr: 'bx',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Bunch',
        abbr: 'bun',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Can',
        abbr: 'can',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Case',
        abbr: 'cs',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Container',
        abbr: 'cnt',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Cup',
        abbr: 'cup',
        type: 'volume',
        is_metric: false,
        english_base: 48.000000,
        metric_base: 236.588000
    },
    {
        name: 'Dozen',
        abbr: 'doz',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Each',
        abbr: 'ea',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Flat',
        abbr: 'fl',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Fluid Ounce',
        abbr: 'floz',
        type: 'volume',
        is_metric: false,
        english_base: 6.000000,
        metric_base: 29.573500
    },
    {
        name: 'Gallon',
        abbr: 'gal',
        type: 'volume',
        is_metric: false,
        english_base: 768.000000,
        metric_base: 3785.410000
    },
    {
        name: 'Gram',
        abbr: 'g',
        type: 'weight',
        is_metric: true,
        english_base: 0.035274,
        metric_base: 1.000000
    },
    {
        name: 'Head',
        abbr: 'head',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Jar',
        abbr: 'jar',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Keg',
        abbr: 'keg',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Kilogram',
        abbr: 'kg',
        type: 'weight',
        is_metric: true,
        english_base: 35.274000,
        metric_base: 1000.000000
    },
    {
        name: 'Liter',
        abbr: 'l',
        type: 'volume',
        is_metric: true,
        english_base: 202.884000,
        metric_base: 1000.000000
    },
    {
        name: 'Loaf',
        abbr: 'loaf',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Mililiter',
        abbr: 'ml',
        type: 'volume',
        is_metric: true,
        english_base: 0.202884,
        metric_base: 1.000000
    },
    {
        name: 'Ounce',
        abbr: 'oz',
        type: 'weight',
        is_metric: false,
        english_base: 1.000000,
        metric_base: 28.349500
    },
    {
        name: 'Pack',
        abbr: 'pk',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Pint',
        abbr: 'pt',
        type: 'volume',
        is_metric: false,
        english_base: 96.000000,
        metric_base: 473.176000
    },
    {
        name: 'Portion',
        abbr: 'por',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Pound',
        abbr: 'lb',
        type: 'weight',
        is_metric: false,
        english_base: 16.000000,
        metric_base: 453.592000
    },
    {
        name: 'Quart',
        abbr: 'qt',
        type: 'volume',
        is_metric: false,
        english_base: 192.000000,
        metric_base: 946.353000
    },
    {
        name: 'Serving',
        abbr: 'srv',
        type: 'each',
        is_metric: false
    },
    {
        name: 'Tablespoon',
        abbr: 'tbsp',
        type: 'volume',
        is_metric: false,
        english_base: 3.000000,
        metric_base: 14.786800
    },
    {
        name: 'Teaspoon',
        abbr: 'tsp',
        type: 'volume',
        is_metric: false,
        english_base: 1.000000,
        metric_base: 4.928920
    }
];



/** PRIVATE FUNCTIONS **/

/**
 * Wil be used to initialize units for new accounts - if there is no units on given account, create some
 * @return {object} promise with true when new units will be deployed for account
 */
function _initializeUnits() {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    __this.bulkCreateUnits(
      UNITS
    )
      .then(
        function() {
          resolve(true);
        },
        function(error) {
          reject(error);
        }
      );

  });

}

/**
 * Used to cache loadUnits request results
 * @param  {object} reqData - response object
 */
function _processUnits(reqData) {

  var __this = _this;

  __this.units = reqData.results;
  __this.unitsById = _.object(_.pluck(__this.units, 'id'), __this.units);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('units'));

  _this.units = [];
  _this.unitsById = {};
  _this.unitsInitialized = false;

  _this.activate();

}

_this.activate = function() {

  var __this = _this;

  // check if units were loaded to database on given account
  unitsInitializePromise = __this.$q(function(resolve, reject) {

    __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, null, {limit: 1})
      .then(
        function(response) {

          // if no units yet found in database, create them
          if (response.results.length == 0) {

            _initializeUnits()
              .then(
                function() {
                  __this.unitsInitialized = true;
                  resolve(true);
                },
                function(error) {
                  reject(error);
                }
              )

          // if there are already some units, set service as initialized
          } else {

            __this.unitsInitialized = true;
            resolve(true);

          }

        },
        function(error) {
          __this.cakeCommon.apiErrorHandler(error);
          reject(error);
        }
      )

  });

}



/** PUBLIC FUNCTIONS **/

/**
 * Bulk creates new units in db
 * Performed update is atomic - either creates all new objects, or none
 * @param  {Array} newUnitsDataCollection - array of object with data which will be used to create new units
 * @return {object} promise with response
 */
_this.bulkCreateUnits = function(newUnitsDataCollection) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (newUnitsDataCollection.length > 0) {

      __this.$resource.create(newUnitsDataCollection)
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
 * Creates new unit in db
 * @param  {object} unitData - data which will be used to create new unit
 * @return {object} promise with response
 */
_this.createUnit = function(unitData) {

  var __this = _this;

  var data = _.extend(
    {},
    __this.cakeCommon.getObjectDefaultData('units'),
    unitData
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
 * Returns single cached unit, or whole array if unitId not specified or incorrect
 * @param  {number} [unitId] - id of the unit to get
 * @return {object|Array} single unit or all units array
 */
_this.getUnit = function(unitId) {

  var __this = _this;

  if (_.isUndefined(unitId)) {
    return __this.units;
  } else {
    return __this.unitsById[unitId];
  }

}

/**
 * Returns cached units array
 * @return {Array} units array
 */
_this.getUnits = function() {

  var __this = _this;

  return __this.units;

}

/**
 * Returns cached units collection
 * @return {object} units collection
 */
_this.getUnitsCollection = function() {

  var __this = _this;

  return __this.unitsById;

}

/**
 * Can be used to load units from db, eventually caching results - it will also ensure there already are some units on given account
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadUnits = function(findParams, otherParams, disableCache) {

  var __this = _this;

  findParams = findParams || null;
  otherParams = otherParams || null;
  disableCache = disableCache || false;

  return __this.$q(function(resolve, reject) {

    // if service already initialized correctly (ensured there are some units in db) - just run request
    if (__this.unitsInitialized) {

      //__this.$resource.find(findParams, otherParams)
      __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
      .then(
        function(response) {
          if (!disableCache) {
            _processUnits(response);
          }
          resolve(response);
        },
        function(error) {
          __this.cakeCommon.apiErrorHandler(error);
          reject(error);
        }
      );

    } else {

      // if service haven't finished initializing (it still checks if there are units id db, or initualizes units in db), wait until it does, then run request
      unitsInitializePromise
        .then(
          function() {

            //__this.$resource.find(findParams, otherParams)
            __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
              .then(
                function(response) {
                  if (!disableCache) {
                    _processUnits(response);
                  }
                  resolve(response);
                },
                function(error) {
                  __this.cakeCommon.apiErrorHandler(error);
                  reject(error);
                }
              );
            
          },
          function(error) {

            reject(error);

          }
        );

    }

  });

}



_constructor(cakeCommon, $peach, $q);
return _this;