let moduleName = 'vendorsService';

class VendorsService {
  constructor(cakeCommon, $peach, $q, cakeInvoiceItems) {

    /** cakeVendors service
     * Service which provides vendors data
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
     * Used to cache loadVendors request results
     * @param  {object} reqData - response object
     */
    function _processVendors(reqData) {

      var __this = _this;

      __this.vendors = reqData.results;
      __this.vendorsById = _.object(_.pluck(__this.vendors, 'id'), __this.vendors);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q, cakeInvoiceItems) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.cakeInvoiceItems = cakeInvoiceItems;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('vendors'));

      _this.vendors = [];
      _this.vendorsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new vendor in db
     * @param  {object} vendorData - data which will be used to create new vendor
     * @return {object} promise with response
     */
    _this.createVendor = function(vendorData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('vendors'),
        vendorData
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
     * Returns single cached vendor, or whole array if vendorId not specified or incorrect
     * @param  {number} [vendorId] - id of the vendor to get
     * @return {object|Array} single vendor or all vendors array
     */
    _this.getVendor = function(vendorId) {

      var __this = _this;

      if (_.isUndefined(vendorId)) {
        return __this.vendors;
      } else {
        return __this.vendorsById[vendorId];
      }

    }

    /**
     * Returns cached vendors array
     * @return {Array} vendors array
     */
    _this.getVendors = function() {

      var __this = _this;

      return __this.vendors;

    }

    /**
     * Returns cached vendors collection
     * @return {object} vendors collection
     */
    _this.getVendorsCollection = function() {

      var __this = _this;

      return __this.vendorsById;

    }

    /**
     * Can be used to load vendors from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadVendors = function(findParams, otherParams, disableCache) {

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
                _processVendors(response);
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
     * Deletes item from db
     * @param {number} itemId - id of the item to be deleted
     * @return {object} promise with response
     */
    _this.removeVendor = function(itemId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(itemId)
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
     * Updates existing vendor in db
     * @param  {object} vendorData - data which will be used to update vendor
     * @param  {object} [additionalQueryParams={extended: true}] - some additional query params
     * @return {object} promise with response
     */
    _this.updateVendor = function(vendorData, additionalQueryParams) {

      var __this = _this;
      
      var data = _.pick(
        vendorData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('vendors')
        )
      );
      data['id'] = vendorData.id;
      
      var queryParams = additionalQueryParams || {};
      queryParams = _.extend({extended: true}, queryParams);


      return __this.$q(function(resolve, reject) {

        __this.$resource.update(data, queryParams)
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
     * Can be used to determine if given vendor can be deleted
     * It doesn't check permissions, but performs additional checks, according to spec below.
     * Vendor can't be deleted if:
     * - has an invoice
     * @param  {number} vendorId - id of the vendor :]
     * @return {object} promise with result true/false
     */
    _this.canVendorBeDeleted = function(vendorId) {

      var __this = _this;


      return __this.$q(function(resolve, reject) {

        __this.cakeInvoiceItems.loadInvoiceItems(
          {   
            'vendor_id' : vendorId
          },  
          {   
            'limit' : 1 
          },  
          true
        )   
          .then(
            function(response) {

              if (response.results.length > 0) {
                resolve(false);
              } else {
                resolve(true);
              }   
            },  
            function(error) {
              reject(error);
            }   
          );  
      }); 
    }
  }
}

VendorsService.$inject = ['commonService', '$peach', '$q', 'invoiceItemsService'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, VendorsService)

export default {moduleName, service: VendorsService};
