/** cakeInvoiceGLAccounts service
 * Service which provides invoice gl accounts data
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
 * Used to cache loadInvoiceGLAccounts request results
 * @param  {object} reqData - response object
 */
function _processInvoiceGLAccounts(reqData) {

  var __this = _this;

  __this.invoiceGLAccounts = reqData.results;
  __this.invoiceGLAccountsById = _.object(_.pluck(__this.invoiceGLAccounts, 'id'), __this.invoiceGLAccounts);

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('invoice_gl_accounts'));

  _this.invoiceGLAccounts = [];
  _this.invoiceGLAccountsById = {};

}



/** PUBLIC FUNCTIONS **/

/**
 * Creates new invoice gl account entry in db
 * @param  {object} invoiceGLAccountData - data which will be used to create new invoice gl account entry
 * @return {object} promise with response
 */
_this.createInvoiceGLAccount = function(invoiceGLAccountData) {

  var __this = _this;

  var data = _.extend(
    {},
    __this.cakeCommon.getObjectDefaultData('invoice_gl_accounts'),
    invoiceGLAccountData
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
 * Returns single cached invoice gl account entry, or whole array if invoiceGLAccountId not specified or incorrect
 * @param  {number} [invoiceGLAccountId] - id of the invoice gl account entry to get
 * @return {object|Array} single invoice gl account or all invoice gl account entries array
 */
_this.getInvoiceGLAccount = function(invoiceGLAccountId) {

  var __this = _this;

  if (_.isUndefined(invoiceGLAccountId)) {
    return __this.invoiceGLAccounts;
  } else {
    return __this.invoiceGLAccountsById[invoiceGLAccountId];
  }

}

/**
 * Returns cached invoice gl accounts array
 * @return {Array} invoice gl accounts array
 */
_this.getInvoiceGLAccounts = function() {

  var __this = _this;

  return __this.invoiceGLAccounts;

}

/**
 * Returns cached invoice gl accounts collection
 * @return {object} invoice gl accounts collection
 */
_this.getInvoiceGLAccountsCollection = function() {

  var __this = _this;

  return __this.invoiceGLAccountsById;

}

/**
 * Can be used to load invoice gl accounts from db, invoiceually caching results
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
 * @return {object} promise with response
 */
_this.loadInvoiceGLAccounts = function(findParams, otherParams, disableCache) {

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
            _processInvoiceGLAccounts(response);
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
 * Deletes invoice gl account from db
 * @param {number} invoiceGLAccountId - id of the invoice gl account to be deleted
 * @return {object} promise with response
 */
_this.removeInvoiceGLAccount = function(invoiceGLAccountId) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    __this.$resource.remove(invoiceGLAccountId)
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
 * Updates existing invoice gl account in db
 * @param  {object} invoiceGLAccountData - data which will be used to update invoice gl account
 * @return {object} promise with response
 */
_this.updateInvoiceGLAccount = function(invoiceGLAccountData) {

  var __this = _this;

  var data = _.pick(
    invoiceGLAccountData,
    _.keys(
      __this.cakeCommon.getObjectDefaultData('invoice_gl_accounts')
    )
  );
  data['id'] = invoiceGLAccountData.id;

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