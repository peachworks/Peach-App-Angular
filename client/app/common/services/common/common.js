let moduleName = 'commonService';

class CommonService {
  constructor($log, $peach, $q) {
    /** cakeCommon service
     * Service which provides common functions, like error logging etc
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

    var devPreviewModeRunning;
    var userAccountAdmin;

    var CAKE_APP_API_KEY = 'cake';
    var CORE_APP_API_KEY = 'wtm';
    var COUNTING_TASK_ID = 50;
    var DATABASE_DATE_FORMAT = 'YYYY-MM-DD';
    var DATABASE_TIME_FORMAT = 'HH:mm:ss';
    var DEFAULT_GET_QUERY_LIMIT = 1000;
    var CAKE_FLOAT_REGEX = /^\s*[-+]?(\d{0,9}\.?\d{0,5}|\d{1,9}\.)\s*$/i;
    var ITEMS_DB_OBJECTS_KEYS = {
      items       : 'wtm_item_db_items',
      categories  : 'wtm_item_db_cats',
      tags        : 'wtm_item_db_tags',
      item_tags   : 'wtm_item_db_item_tags',
      item_units  : 'wtm_item_db_item_units',
      units       : 'wtm_units'
    };
    var APP_OBJECTS = {
      active_locations      : {
        key           : 'wtm_inv_locs',
        default_data  : {
          is_copied         : false,
          copied_from       : null,
          location_id       : null
        }
      },
      items_db              : {
        key           : 'wtm_inv_item_db',
        default_data  : {}
      },
      count_groups          : {
        key           : 'wtm_inv_count_groups',
        default_data  : {
          name              : '',
          description       : '',
          schedule_type     : 'none',
          schedule_interval : null,
          schedule_days     : null,
          start_date        : null,
          next_date         : null,
          is_active         : true,
          is_default        : false
        }
      },
      count_items           : {
        key           : 'wtm_inv_count_items',
        default_data  : {
          inv_count_id      : null,
          inv_item_id       : null,
          inv_item_unit_id  : null,
          common_unit_id    : null,
          quantity          : null,
          common_unit_quantity : null,
          details_json      : null,
          location_id       : null
        }
      },
      counts                : {
        key           : 'wtm_inv_counts',
        default_data  : {
          count_group_id    : null,
          notes             : '',
          time              : null,
          date              : null,
          is_complete       : false,
          percent_complete  : 0,
          location_id       : null,
          task_id           : null
        }
      },
      opening_counts        : {
        key           : 'wtm_inv_opening_counts',
        default_data  : {
          count_group_id    : null,
          count_date        : null,
          location_id       : null
        }
      },
      events                : {
        key           : 'wtm_inv_events',
        default_data  : {
          date              : null,
          description       : '',
          type              : null,
          notes             : '',
          is_complete       : false,
          location_id       : null
        }  
      },
      event_items           : {
        key           : 'wtm_inv_event_items',
        default_data  : {
          cost              : null,
          quantity          : null,
          common_unit_quantity : null,
          inv_event_id      : null,
          inv_item_id       : null,
          inv_item_unit_id  : null,
          common_unit_id    : null,
          location_id       : null
        }  
      },
      gl_accounts           : {
        key           : 'gl_accounts',
        default_data  : {
          parent_id         : null,
          name              : '',
          number            : null,
          description       : '',
          type              : null,
          subtype           : null
        }
      },
      invoices              : {
        key           : 'wtm_invoices',
        default_data  : {
          invoice_date      : null,
          receipt_date      : null,
          vendor_id         : null,
          inv_event_id      : null,   
          total             : null,
          is_complete       : false,
          invoice_number    : null,
          notes             : null,
          location_id       : null
        }  
      },
      invoice_items         : {
        key           : 'wtm_invoice_items',
        default_data  : {
          invoice_id        : null,
          vendor_id         : null,
          vendor_inventory_item_id  : null,
          inv_item_id       : null,
          inv_event_item_id : null,
          quantity          : null,
          unit_price        : null,
          extended_price    : null,
          location_id       : null
        }  
      },
      invoice_gl_accounts   : {
        key           : 'wtm_invoice_gl_accounts',
        default_data  : {
          invoice_id        : null,
          vendor_id         : null,
          description       : null,
          amount            : null,
          gl_account_id     : null,
          location_id       : null
        }  
      },
      items                 : {
        key           : 'wtm_inv_items',
        default_data  : {
          name              : '',
          description       : '',
          common_unit_id    : null,
          item_db_id        : null,
          count_group_id    : null,
          gl_account_id     : null,
          is_active         : false,
          sales_item_id     : null,
          common_unit_cost  : 0
        }
      },
      item_locations        : {
        key           : 'wtm_inv_item_locs',
        default_data  : {
          inv_item_id       : null,
          last_cost         : null,
          opening_count_date: null,
          is_hot_count      : false,
          starting_cost     : null,
          location_id       : null
        }
      },
      item_units            : {
        key           : 'wtm_inv_item_units',
        default_data  : {
          inv_item_id       : null,
          unit_id           : null,
          common_unit_id    : null,
          description       : null,
          pack_size         : null,
          is_report_unit    : false,
          is_wv_conversion  : false,
          unit_quantity     : null
        }
      },
      item_unit_locations   : {
        key           : 'wtm_inv_item_unit_locs',
        default_data  : {
          inv_item_id       : null,
          inv_item_unit_id  : null,
          is_order_unit     : false,
          is_count_unit     : false,
          is_transfer_unit  : false,
          is_waste_unit     : false,
          is_report_unit    : false,
          location_id       : null
        }
      },
      locations             : {
        key           : 'wtm_inv_locs',
        default_data  : {
          is_copied         : null,
          location_id       : null
        }
      },
      recipe_items          : {
        key           : 'wtm_recipe_items',
        default_data  : {}
      },
      units                 : {
        key           : 'wtm_units',
        default_data  : {}
      },
      vendors               : {
        key           : 'wtm_vendors',
        default_data  : {
          name              : null,
          address           : null,
          address2          : null,
          city              : null,
          state             : null,
          state_id          : null,
          country           : null,
          country_id        : null,
          zip               : null,
          phone             : null,
          fax               : null,
          contact_email     : null,
          contact_name      : null,
          contact_first_name : null,
          contact_last_name : null,
          contact_mobile    : null,
          notes             : null,
          is_active         : false
        }
      },
      vendor_items          : {
        key           : 'wtm_vendor_inv_items',
        default_data  : {
          vendor_id         : null,
          inv_item_id       : null,
          inv_item_unit_id  : null,
          description       : null,
          number            : null,
          pack_size         : null,
          is_active         : true,
          last_price        : null,
          last_price_on     : null
        }
      },
      vendor_locations      : {
        key           : 'wtm_vendor_locs',
        default_data  : {
          vendor_id         : null,
          location_id       : null,
          customer_number   : null
        }
      }
    };



    /** CONSTRUCTOR **/

    function _constructor($log, $peach, $q) {

      _this.$log = $log;
      _this.$peach = $peach;
      _this.$q = $q;

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      devPreviewModeRunning = __this.$peach.session.isPreview();

      userAccountAdmin = __this.$q(function(resolve, reject) {

        if (devPreviewModeRunning) {

          resolve(true);

        } else {

          __this.$peach.account.getInfo()
            .then(
              function(data) {
                resolve(data.is_admin);
              },
              function(error)  {
                resolve(false);
                _this.apiErrorHandler(error);
              }
            );

        }

      });

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Function which handles errors returned from API
     * @param {(string|object)} error - this can be error string or $http response object
     * @param {boolean} [show_alert=false] - boolean, by default false, if set to true it will show alert
     */
    _this.apiErrorHandler = function(error, show_alert) {

      var __this = _this;

      show_alert = show_alert || false;

      __this.$log.error(error);

      if (show_alert) {
        if (_.isString(error)) {
          alert('There was an error: ' + error);
        } else {
          alert('There was an error, please check console log for more details.');
        }
      }

      return;

    }

    /**
     * Returns cake app api key
     * @return {string} cake api key
     */
    _this.getCakeApiKey = function() {

      return CAKE_APP_API_KEY;

    }

    _this.getCakeFloatRegex = function() {
      
      return CAKE_FLOAT_REGEX;        
      
    }

    /**
     * Returns core app api key
     * @return {string} core app api key
     */
    _this.getCoreApiKey = function() {

      return CORE_APP_API_KEY;

    }

    /**
     * Returns counting task id
     * @return {number} counting task id
     */
    _this.getCountingTaskId = function() {
      
      return COUNTING_TASK_ID;    
      
    }

    /**
     * Returns database date format
     * @return {string} database date format
     */
    _this.getDatabaseDateFormat = function() {

      return DATABASE_DATE_FORMAT;

    }

    /**
     * Returns database time format
     * @return {string} database time format
     */
    _this.getDatabaseTimeFormat = function() {

      return DATABASE_TIME_FORMAT;

    }

    /**
     * Used to get object keys specific for ItemsDB. If no param provided, will return whole keys map
     * @param  {string} simplifiedObjectKey - simplified object key name
     * @return {string|object} real ItemsDB object key, eventually whole keys map
     */
    _this.getItemDBObjectKey = function(simplifiedObjectKey) {

      return simplifiedObjectKey ? ITEMS_DB_OBJECTS_KEYS[simplifiedObjectKey] : ITEMS_DB_OBJECTS_KEYS;

    }

    /**
     * Used to get specific object default data.
     * @param  {string} simplifiedObjectKey - simplified object key name
     * @return {object|null} default object data, eventually null
     */
    _this.getObjectDefaultData = function(simplifiedObjectKey) {

      if (simplifiedObjectKey && APP_OBJECTS[simplifiedObjectKey]) {
        return APP_OBJECTS[simplifiedObjectKey]['default_data'];
      }

      return null;

    }

    /**
     * Used to get specific object keys.
     * @param  {string} simplifiedObjectKey - simplified object key name
     * @return {string} real object key, eventually null
     */
    _this.getObjectKey = function(simplifiedObjectKey) {

      if (simplifiedObjectKey && APP_OBJECTS[simplifiedObjectKey]) {
        return APP_OBJECTS[simplifiedObjectKey]['key'];
      }

      return null;

    }

    /**
     * Tells if app runs in preview mode
     * @return {boolean} dev preview true:false
     */
    _this.isDevPreviewModeRunning = function() {

      return devPreviewModeRunning;

    }

    /**
     * Tells if user is current account admin
     * @return {object} promise with account admin value true:false
     */
    _this.isUserAccountAdmin = function() {

      return userAccountAdmin;

    }

    /**
     * This function can be used in other data services to make GET calls with auto-pagination. Basically it's a wrapper for regular $peach.api.find function which adds some pagination and returns results from all pages at once
     * @param  {object} resource - $peach.api instance
     * @param  {object} [findParams] - find query params
     * @param  {object} [otherParams] - other query params - paginations, sorting etc
     * @return {object} promise with response which includes all possible results (all results pages concatenated together)
     */
    _this.makeAutoPaginatedGETRequest = function(resource, findParams, otherParams) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || {};

      return __this.$q(function(resolve, reject) {

        // if limit was set - user knows what he's doing, don't auto-paginate
        if (!_.isUndefined(otherParams.limit)) {

          resource.find(findParams, otherParams)
            .then(
              resolve,
              reject
            );

          // if limit was not set, set default one and get first page of results
        } else {

          otherParams.limit = DEFAULT_GET_QUERY_LIMIT;

          resource.find(findParams, otherParams)
            .then(
              function(initialResponse) {

                // if there are more results than just one page, load other pages
                if (initialResponse.count > DEFAULT_GET_QUERY_LIMIT) {

                  var promises = [];
                  var pagesToLoad = Math.ceil(initialResponse.count/DEFAULT_GET_QUERY_LIMIT);

                  __this.$q.all(
                    _.map(
                      _.range(2,pagesToLoad + 1, 1), // skip first page, we already got this results in initialResponse.results
                      function(pageNo) {

                        var subrequestOtherParams = angular.copy(otherParams);
                        subrequestOtherParams.page = pageNo;

                        return resource.find(findParams, subrequestOtherParams);

                      }
                    )
                  )
                    .then(
                      function(subpagesResponses) {

                        var totalResults = initialResponse.results;

                        _.each(
                          subpagesResponses,
                          function(response) {

                            totalResults = totalResults.concat(response.results);

                          }
                        );

                        initialResponse.results = totalResults;

                        resolve(initialResponse);

                      },
                      reject
                    )

                  // if there was only one page of results, return them
                } else {

                  resolve(initialResponse);

                }

              },
              reject
            );

        }

      });

    }

    /**
     * This function can be used to parse floating point numeric values (which are saved in db as strings) into real numeric type value. If value is empty, it returns defaultValue
     * @param  {string|number} value value to be parsed
     * @param  {*} [defaultValue=0] default value to return if value was empty
     * @return {number|*}       numeric value of given input value, eventually given defaultValue
     */
    _this.parseCakeFloatValue = function(value, defaultValue) {
      
      defaultValue = _.isUndefined(defaultValue) ? 0 : defaultValue;

      if (!_.isUndefined(value) && !_.isNull(value)) {

        return parseFloat(Big(value).toFixed(5));

      } else {

        return defaultValue;

      }

    }

    /**
     * This function can be used to parse floating point numeric values (which are saved in db as strings) into real numeric type value. If value is empty, it returns 0.
     * All values will be formatted as some currency value, so with at least 2 decimal places, up to 5 decimal places 
     * If fractionSize param provided, then it will display value with only as many decimals as fractionSize is - if there were more, value will be rounded
     * @param  {string|number} value value to be parsed
     * @param  {*} [defaultValue='0.00'] default value to return if value was empty
     * @param  {number} [fractionSize=null] can be used to force function to return value rounded to fractionSize decimals
     * @return {string|*}       string with formatted numeric value of given input value, eventually given defaultValue
     */
    _this.parseCakeCostFloatValue = function(value, defaultValue, fractionSize) {
      
      defaultValue = _.isUndefined(defaultValue) ? '0.00' : defaultValue;
      fractionSize = _.isUndefined(fractionSize) ? null : fractionSize;

      if (!_.isUndefined(value) && !_.isNull(value)) {

        return fractionSize !== null ? Big(value).round(fractionSize).toFixed(fractionSize) : Big(value).toFixed(5).replace(/0{0,3}$/, "");

      } else {

        return defaultValue;

      }

    }

    /**
     * Used to make given string uppercase (oh really?)
     * @param  {string} word - word string to be uppercased
     * @return {string} uppercased string
     */
    _this.uppercaseWord = function(word) {

      return word.charAt(0).toUpperCase() + word.slice(1);

    }

  }
}

CommonService.$inject = ['$log', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, CommonService)

export default {moduleName, service: CommonService};
