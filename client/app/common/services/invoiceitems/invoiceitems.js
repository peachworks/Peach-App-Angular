let moduleName = 'invoiceItemsService';

class InvoiceItemsService {
  constructor(cakeCommon, $peach, $q) {
    /** cakeInvoiceItems service
     * Service which provides invoice items data
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
     * Used to cache loadInvoiceItems request results
     * @param  {object} reqData - response object
     */
    function _processInvoiceItems(reqData) {

      var __this = _this;

      __this.invoiceItems = reqData.results;
      __this.invoiceItemsById = _.object(_.pluck(__this.invoiceItems, 'id'), __this.invoiceItems);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('invoice_items'));

      _this.invoiceItems = [];
      _this.invoiceItemsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new invoice item in db
     * @param  {object} invoiceItemData - data which will be used to create new invoice item
     * @return {object} promise with response
     */
    _this.createInvoiceItem = function(invoiceItemData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('invoice_items'),
        invoiceItemData
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
     * Returns single cached invoice item, or whole array if invoiceItemId not specified or incorrect
     * @param  {number} [invoiceItemId] - id of the invoice item to get
     * @return {object|Array} single invoice item or all invoice items array
     */
    _this.getInvoiceItem = function(invoiceItemId) {

      var __this = _this;

      if (_.isUndefined(invoiceItemId)) {
        return __this.invoiceItems;
      } else {
        return __this.invoiceItemsById[invoiceItemId];
      }

    }

    /**
     * Returns cached invoice items array
     * @return {Array} invoice items array
     */
    _this.getInvoiceItems = function() {

      var __this = _this;

      return __this.invoiceItems;

    }

    /**
     * Returns cached invoice items collection
     * @return {object} invoice items collection
     */
    _this.getInvoiceItemsCollection = function() {

      var __this = _this;

      return __this.invoiceItemsById;

    }

    /**
     * Can be used to load invoice items from db, invoiceually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadInvoiceItems = function(findParams, otherParams, disableCache) {

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
                _processInvoiceItems(response);
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
     * Deletes invoice item from db
     * @param {number} invoiceItemId - id of the invoice item to be deleted
     * @return {object} promise with response
     */
    _this.removeInvoiceItem = function(invoiceItemId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(invoiceItemId)
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
     * Updates existing invoice item in db
     * @param  {object} invoiceItemData - data which will be used to update invoice item
     * @return {object} promise with response
     */
    _this.updateInvoiceItem = function(invoiceItemData) {

      var __this = _this;

      var data = _.pick(
        invoiceItemData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('invoice_items')
        )
      );
      data['id'] = invoiceItemData.id;

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


InvoiceItemsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, InvoiceItemsService)

export default {moduleName, service: InvoiceItemsService};
