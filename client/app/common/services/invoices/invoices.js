let moduleName = 'invoicesService';

class InvoicesService {
  constructor(cakeCommon, $peach, $q) {
    /** cakeInvoices service
     * Service which provides invoices data
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
     * Used to cache loadInvoices request results
     * @param  {object} reqData - response object
     */
    function _processInvoices(reqData) {

      var __this = _this;

      __this.invoices = reqData.results;
      __this.invoicesById = _.object(_.pluck(__this.invoices, 'id'), __this.invoices);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('invoices'));

      _this.invoices = [];
      _this.invoicesById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new invoice in db
     * @param  {object} invoiceData - data which will be used to create new invoice
     * @return {object} promise with response
     */
    _this.createInvoice = function(invoiceData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('invoices'),
        invoiceData
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
     * Returns single cached invoice, or whole array if invoiceId not specified or incorrect
     * @param  {number} [invoiceId] - id of the invoice to get
     * @return {object|Array} single invoice or all invoices array
     */
    _this.getInvoice = function(invoiceId) {

      var __this = _this;

      if (_.isUndefined(invoiceId)) {
        return __this.invoices;
      } else {
        return __this.invoicesById[invoiceId];
      }

    }

    /**
     * Returns cached invoices array
     * @return {Array} invoices array
     */
    _this.getInvoices = function() {

      var __this = _this;

      return __this.invoices;

    }

    /**
     * Returns cached invoices collection
     * @return {object} invoices collection
     */
    _this.getInvoicesCollection = function() {

      var __this = _this;

      return __this.invoicesById;

    }

    /**
     * Can be used to load invoices from db, invoiceually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadInvoices = function(findParams, otherParams, disableCache) {

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
                _processInvoices(response);
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
     * Deletes invoice from db
     * @param {number} invoiceId - id of the invoice to be deleted
     * @return {object} promise with response
     */
    _this.removeInvoice = function(invoiceId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(invoiceId)
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
     * Updates existing invoice in db
     * @param  {object} invoiceData - data which will be used to update invoice
     * @return {object} promise with response
     */
    _this.updateInvoice = function(invoiceData) {

      var __this = _this;

      var data = _.pick(
        invoiceData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('invoices')
        )
      );
      data['id'] = invoiceData.id;

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


InvoicesService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, InvoicesService)

export default {moduleName, service: InvoicesService};
