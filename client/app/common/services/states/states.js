/** cakeStates service
 * Service which provides state data
 * @author Ryan Marshall
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
 * Used to cache loadStates request results
 * @param  {object} reqData - response object
 */
function _processStates(reqData) {

  var __this = _this;

  __this.states = reqData.results;
  __this.statesById = _.object(_.pluck(__this.states, 'id'), __this.states);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;

  _this.states = [];
  _this.statesById = {};

}



/** PUBLIC FUNCTIONS **/

/**
 * Returns single cached state, or whole array if stateId not specified or incorrect
 * @param  {number} [stateId] - id of the state to get
 * @return {object|Array} single state or all states array
 */
_this.getState = function(stateId) {

  var __this = _this;

  if (_.isUndefined(stateId)) {
    return __this.states;
  } else {
    return __this.statesById[stateId];
  }

}

/**
 * Returns cached states array
 * @return {Array} states array
 */
_this.getStates = function() {

  var __this = _this;

  return __this.states;

}

/**
 * Returns cached states collection
 * @return {object} states collection
 */
_this.getStatesCollection = function() {

  var __this = _this;

  return __this.statesById;

}


/**
 * Can be used to load states from db, eventually caching results - it will also ensure there already are some states on given account
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadStates = function(countryId, findParams, otherParams, disableCache) {

  var __this = _this;

  findParams = findParams || null;
  otherParams = otherParams || null;
  disableCache = disableCache || false;

  return __this.$q(function(resolve, reject) {
      __this.$peach.api('/countries/'+parseInt(countryId)+'/states').find(findParams, otherParams)
      .then(
        function(response) {
          if (!disableCache) {
            _processStates(response);
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

_constructor(cakeCommon, $peach, $q);
return _this;