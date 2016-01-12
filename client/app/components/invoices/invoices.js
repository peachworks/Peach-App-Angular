
class InvoicesController {
  constructor($document, $filter, $location, $peach, $q, cakeCommon, cakeInvoices, cakePermissions, cakeSettings, cakeVendors) {
    /** Invoices page
     * Displays invoices, with option to add new ones
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE VARIABLES (non-scope variables) **/

    /** PRIVATE FUNCTIONS (non-scope functions) **/

    function _buildTableRequestParams() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var findQueryElements = [];

        __this.requestParams = {};

        if (__this.searchParams.searchQuery !== '') {

          var findQuerySubelements = [];

          var vendorsSearchIds = _buildVendorsSearchIdsParam(__this.searchParams.searchQuery);

          if (vendorsSearchIds.length > 0) {

            findQuerySubelements.push(
              {
                'vendor_id': vendorsSearchIds
              }
            );

          }

          findQuerySubelements.push(
            {
              'invoice_number': {
                '$like': __this.searchParams.searchQuery
              }
            }
          );

          if (moment(__this.searchParams.searchQuery, 'l').isValid()) {

            findQuerySubelements.push(
              {
                'receipt_date': moment(__this.searchParams.searchQuery, 'l').format('YYYY-MM-DD')
              }
            );

          }

          if (!_.isNaN(parseFloat(__this.searchParams.searchQuery))) {

            findQuerySubelements.push(
              {
                'total': parseFloat(__this.searchParams.searchQuery)
              }
            );

          }

          if (findQuerySubelements.length > 0) {

            if (findQuerySubelements.length > 1) {

              findQueryElements.push(
                {
                  '$or': findQuerySubelements
                }
              );

            } else {

              findQueryElements.push(findQuerySubelements[0]);

            }

          }
          
        }

        if (__this.filters.location_id) {
          findQueryElements.push(
            {
              'location_id': __this.filters.location_id
            }
          );
        }

        __this.requestParams.page = __this.pagination.page_no;
        __this.requestParams.limit = __this.pagination.limit;
        //__this.requestParams.sort = ((__this.tableSort.order === 'desc') ? '-' : '') + __this.tableSort.field;
        __this.requestParams.sort = '-receipt_date,-created_at';

        if (findQueryElements.length > 0) {
          __this.requestParams.find = {
            '$and': findQueryElements
          };
        }

        resolve(true);

      });

    }

    function _buildVendorsSearchIdsParam(searchQuery) {

      var __this = _this;

      var selectedVendors = __this.$filter("filter")(__this.vendors, {"name": searchQuery});

      return _.pluck(selectedVendors, ['id']);

    }

    function _getLocationAndLoadTableData(locationId) {

      var __this = _this;

      if (locationId) {

        __this.blockers.no_location = false;

        if (__this.activeLocationsById[locationId]) {

          __this.filters.location_id = locationId;

          __this.onPaginationChangeCallback();

        } else {
          
          __this.invoices = [];
          __this.invoicesById = {};
          __this.pagination.total_items = 0;

          __this.showMessage("Selected location is not an active Cake location.");
          __this.blockers.api_processing = false;
          __this.blockers.no_location = true;

        }

      } else {

        __this.invoices = [];
        __this.invoicesById = {};
        __this.pagination.total_items = 0;

        __this.blockers.api_processing = false;
        __this.blockers.no_location = true;

      }

    }

    function _loadInvoices() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _buildTableRequestParams()
          .then(
            function() {

              var findParams = __this.requestParams.find || null;
              var otherParams = _.omit(__this.requestParams, 'find');

              __this.cakeInvoices.loadInvoices(
                findParams,
                otherParams
              )
                .then(
                  function(response) {

                    __this.pagination.total_items = response.count || 0;

                    resolve(response);

                  },
                  function(error) {

                    reject(error);

                  }
                );

            }
          );

      });

    }

    function _loadTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        if (__this.filters.location_id) {

          __this.blockers.api_processing = true;

          _loadInvoices()
            .then(
              function(results) {

                _parseTablePageData()
                  .then(
                    function() {

                      __this.hideMessage();
                      __this.blockers.api_processing = false;
                      __this.blockers.initializing = false;

                      __this.$document[0].getElementById('page_frame').scrollTop = 0;

                      resolve(true);

                    }
                  );

              },
              function(error) {

                __this.errorHandler(error);
                __this.blockers.api_processing = false;

                reject(error);

              }
            );

        } else {

          __this.invoices = [];
          __this.invoicesById = {};
          __this.pagination.total_items = 0;

          __this.blockers.api_processing = false;
          __this.blockers.no_location = true;

        }    

      });

    }

    function _parseTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.invoices = [];
        __this.invoicesById = {};

        _.each(
          __this.cakeInvoices.getInvoices(),
          function(invoice) {

            var vendor = __this.vendorsById[invoice.vendor_id];

            if (vendor) {

              invoice.date_formatted = invoice.receipt_date ? moment(invoice.receipt_date, 'YYYY-MM-DD').format('l') : '--/--/--';
              invoice.vendor = vendor;
              invoice.vendor_name = vendor.name;
              invoice.total_formatted = __this.cakeCommon.parseCakeCostFloatValue(invoice.total, '0.00', 2);

              __this.invoices.push(invoice);
              __this.invoicesById[invoice.id] = invoice;

            }

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareVendors() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.vendors = __this.cakeVendors.getVendors();
        __this.vendorsById = __this.cakeVendors.getVendorsCollection();

        resolve(true);

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($document, $filter, $location, $peach, $q, cakeCommon, cakeInvoices, cakePermissions, cakeSettings, cakeVendors) {

      _this.$document = $document;
      _this.$filter = $filter;
      _this.$location = $location;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeInvoices = cakeInvoices;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeVendors = cakeVendors;

      _this.blockers = {
        api_processing : false,
        initializing   : true,
        no_location    : true
      };

      _this.headerOptions = [
        {
          callback: _this.openNewInvoiceModal,
          label: 'Add Invoice'
        }
      ];

      //*** Table data related variables ***//
      _this.pagination = {
        limit       : 50,
        page_no     : 1,
        total_items : 0
      };
      _this.paginationLimits = [
        50
      ];
      /*_this.tableSort = {
        field : 'name',
        order : 'asc'
        };*/
      _this.requestParams = {}; // all invoices requests params - find filter and pagination stuff
      _this.filters = {
        location_id         : null
      };
      _this.searchParams = {searchQuery: ''}; // used to filter count groups table

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditInvoices = false; // if user has permission to edit invoices
      _this.invoices = []; // all available invoices array
      _this.invoicesById = {}; // all available invoices collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc
      _this.vendors = []; // all available vendors array
      _this.vendorsById = {}; // all available vendors collection - ids are keys

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.blockers.api_processing = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations and permissions
      __this.$q.all({
        is_account_admin      : __this.cakeCommon.isUserAccountAdmin(),
        active_locations      : __this.cakeSettings.getSettings('active_locations'),
        vendors               : __this.cakeVendors.loadVendors(null, {sort: 'name'}),
        can_edit_invoices     : __this.cakePermissions.userHasPermission('edit_invoices')
      })
        .then(
          function(results) {

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditInvoices = results['can_edit_invoices'];

            _prepareVendors()
              .then(
                function() {

                  // get active location from locations dropdown and continue
                  _getLocationAndLoadTableData(__this.$peach.session.getActiveLocation());

                  // watch for location changes
                  __this.$peach.event.subscribe(__this.$peach.event.events.LOCATION_CHANGE, function(id) {

                    if (_.isUndefined(id) || _.isNumber(id) || _.isNull(id)) {

                      _getLocationAndLoadTableData(id);

                    }

                  });

                }
              );

          },
          function(error) {

            __this.blockers.api_processing = false;
            __this.canEditInvoices = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    // handle errors
    _this.errorHandler = function(error, logError, callback) {

      var __this = _this;

      var message = '';

      logError = logError || false;

      if (_.isString(error)) {

        message = 'There was an error: ' + error;

      } else {

        message = 'There was an error, please check console log for more details.';

      }

      __this.showMessage(message, 'alert');

      if (logError) {

        __this.cakeCommon.apiErrorHandler(error);

      }

      if (_.isFunction(callback)) {

        return callback();

      }

      return;

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.onPaginationChangeCallback = function() {

      var __this = _this;

      _loadTablePageData();

    }

    _this.onSearchPhraseUpdateCallback = function() {

      var __this = _this;

      __this.pagination.page_no = 1;

      __this.onPaginationChangeCallback();

    }

    _this.openNewInvoiceModal = function() {

      var __this = _this;

      if (!__this.blockers.no_location) {

        __this.$location.path('/edit_invoice');

      }

    }

    _this.openEditInvoiceModal = function(invoiceId) {

      var __this = _this;

      __this.$location.path('/edit_invoice').search({id: invoiceId});

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }
  }
}

InvoicesController.$inject = ['$document', '$filter', '$location', '$peach', '$q',
                              'commonService', 'invoicesService',  'permissionsService',
                              'settingsService', 'vendors'];

export default InvoicesController;