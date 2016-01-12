let moduleName = 'glAccountsService';

class GLAccountsService {
  constructor(cakeCommon, $peach, $q) {
/** cakeGLAccounts service
 * Service which provides gl accounts data
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

var defaultGLAccount = null;
var glAccountsInitializePromise = null;



/** PRIVATE FUNCTIONS **/

/**
 * Used to cache loadGLAccounts request results
 * @param  {object} reqData - response object
 */
function _processGLAccounts(reqData) {

  var __this = _this;

  __this.glAccounts = reqData.results;
  __this.glAccountsById = _.object(_.pluck(__this.glAccounts, 'id'), __this.glAccounts);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('gl_accounts'));

  _this.glAccounts = [];
  _this.glAccountsById = {};
  _this.glAccountsInitialized = false;

  _this.activate();

}

_this.activate = function() {

  var __this = _this;

  glAccountsInitializePromise = __this.$q(function(resolve, reject) {

    //__this.$resource.find(null, {limit: 1000, sort: 'id'})
    __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, null, {sort: 'id'})
      .then(
        function(response) {
          // set default gl account - would be either a count group with name "General COGS" and type "COGS", or any other with name "General COGS", then "Default", or the very first in array (lowest id - oldest gl account)
          var glAccount = _.find(
            response.results,
            {
              name  : 'General COGS',
              type  : 'COGS'
            }
          );

          if (!glAccount) {
            glAccount = _.find(
              response.results,
              {
                name  : 'General COGS',
              }
            );
          }

          // fallback for old accounts
          if (!glAccount) {
            glAccount = _.find(
              response.results,
              {
                name  : 'Default',
              }
            );
          }

          if (!glAccount) {
            glAccount = response.results[0];
          }

          defaultGLAccount = glAccount;

          __this.glAccountsInitialized = true;

          resolve(true);

        },
        function(error) {

          __this.cakeCommon.apiErrorHandler(error);
          reject(error);

        }
      );

  });

}



/** PUBLIC FUNCTIONS **/

/**
 * Creates new gl account in db
 * @param  {object} glAccountData - data which will be used to create new gl account
 * @return {object} promise with response
 */
_this.createGLAccount = function(glAccountData) {

  var __this = _this;

  var data = _.extend(
    {},
    __this.cakeCommon.getObjectDefaultData('gl_accounts'),
    glAccountData
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
 * Can be used to get default gl account data
 * @return {object} promise with default gl account
 */
_this.getDefaultGLAccount = function() {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    if (__this.glAccountsInitialized) {

      resolve(defaultGLAccount);

    } else {

      glAccountsInitializePromise
        .then(
          function() {
            resolve(defaultGLAccount);
          },
          function(error) {
            reject(error);
          }
        );

    }

  });

}

/**
 * Returns single cached gl account, or whole array if glAccountId not specified or incorrect
 * @param  {number} [glAccountId] - id of the gl account to get
 * @return {object|Array} single gl account or all gl accounts array
 */
_this.getGLAccount = function(glAccountId) {

  var __this = _this;

  if (_.isUndefined(glAccountId)) {
    return __this.glAccounts;
  } else {
    return __this.glAccountsById[glAccountId];
  }

}

/**
 * Returns cached gl accounts array
 * @return {Array} gl accounts array
 */
_this.getGLAccounts = function() {

  var __this = _this;

  return __this.glAccounts;

}

/**
 * Returns cached gl accounts collection
 * @return {object} gl accounts collection
 */
_this.getGLAccountsCollection = function() {

  var __this = _this;

  return __this.glAccountsById;

}

/**
 * Can be used to load gl accounts from db, eventually caching results
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadGLAccounts = function(findParams, otherParams, disableCache) {

  var __this = _this;

  findParams = findParams || null;
  otherParams = otherParams || null;
  disableCache = disableCache || false;

  return __this.$q(function(resolve, reject) {

    if (__this.glAccountsInitialized) {

      //__this.$resource.find(findParams, otherParams)
      __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
        .then(
          function(response) {
            if (!disableCache) {
              _processGLAccounts(response);
            }
            resolve(response);
          },
          function(error) {
            __this.cakeCommon.apiErrorHandler(error);
            reject(error);
          }
        );

    } else {

      glAccountsInitializePromise
        .then(
          function() {
            
            //__this.$resource.find(findParams, otherParams)
            __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
              .then(
                function(response) {
                  if (!disableCache) {
                    _processGLAccounts(response);
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

GLAccountsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, GLAccountsService)

export default {moduleName, service: GLAccountsService};
