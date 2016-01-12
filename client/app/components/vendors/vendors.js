
class VendorsController {
  constructor($filter, $location, $peachToast, $q, $timeout, cakeCommon, cakeVendors,
              cakePermissions, cakeSettings, cakeVendorLocations) {
    /** Vendor Settings page
     * Vendor management page
     * @author Ryan Marshall
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

    function _buildVendorsTableRequestParams(additionalFindQueryElements) {

      var __this = _this;

      additionalFindQueryElements = additionalFindQueryElements || [];

      var findQueryElements = [];

      return __this.$q(function(resolve, reject) {

        __this.requestParams = {};

        if (__this.searchParams.searchQuery !== '') {
          findQueryElements.push(
            { "$or" : [ 
              { 'name': { '$like': __this.searchParams.searchQuery } }, 
              { 'city': { '$like': __this.searchParams.searchQuery } },
              { 'state': { '$like': __this.searchParams.searchQuery } } 
            ] } 
          );
        }

        if (!__this.filters.show_inactive_items) {
          findQueryElements.push(
            {
              'is_active': true
            }
          );
        } else {
          __this.customFiltersApplied = true;
        }

        findQueryElements = findQueryElements.concat(additionalFindQueryElements);

        __this.requestParams.page = __this.pagination.page_no;
        __this.requestParams.limit = __this.pagination.limit;
        __this.requestParams.sort = ((__this.tableSort.order === 'desc') ? '-' : '') + __this.tableSort.field;

        if (findQueryElements.length > 0) {
          __this.requestParams.find = {
            '$and': findQueryElements
          };
        }

        resolve(true);

      });

    }

    function _loadVendorLocations(findQueryParams) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeVendorLocations.loadVendorLocations(
          findQueryParams,
          {
            'limit' : 1000 //TODO: remove this hardcoded restriction when platform transparent pagination will be done!!!
          }
        )
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              reject(error);
            }
          );

      });

    }

    function _loadVendors(additionalFindQueryElements) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _buildVendorsTableRequestParams(additionalFindQueryElements)
          .then(
            function() {

              var findParams = __this.requestParams.find || null;
              var otherParams = _.omit(__this.requestParams, 'find');

              __this.cakeVendors.loadVendors(
                findParams,
                otherParams
              )
                .then(
                  function(response) {
                    
                    __this.pagination.total_items = response.count || 0;

                    if (response.results.length > 0) {

                      _loadVendorLocations(
                        {
                          '$and': [
                            {
                              'location_id': _.pluck(__this.activeLocations, 'id')
                            },
                            {
                              'vendor_id': _.keys(__this.cakeVendors.getVendorsCollection())
                            }
                          ]
                        }
                      )
                        .then(
                          function(response) {

                            _parseVendorsTablePageData()
                              .then(
                                function() {
                                  resolve(true);
                                },
                                function(error) {
                                  reject(error);
                                }
                              );

                          },
                          function(error) {
                            reject(error);
                          }
                        );

                    } else {

                      _parseVendorsTablePageData()
                        .then(
                          function() {
                            resolve(true);
                          },
                          function(error) {
                            reject(error);
                          }
                        );

                    }

                  },
                  function(error) {
                    reject(error);
                  }
                );

            },
            function(error) {
              reject(error);
            }
          );

      });

    }

    function _loadTablePageData(afterLoadToastMessage) {

      var __this = _this;

      afterLoadToastMessage = afterLoadToastMessage || null;

      return __this.$q(function(resolve, reject) {

        __this.blockers.api_processing = true;
        __this.blockers.table_updating = true;

        __this.customFiltersApplied = false;


        // Depending on if location filter was selected or not the process changes a bit.
        // If no location was selected, then we load a page of items and load all item locations for those items
        // If location was selected, then we first load all item locations with given location id, from results we parse item ids, then we load a page of items from given ids range with all their item locations (because item can have more than just this selected one location)
        if (__this.filters.location_id) {

          __this.customFiltersApplied = true;

          _loadVendorLocations(
            {
              'location_id': __this.filters.location_id
            }
          )
            .then(
              function(response) {

                var filteredVendorLocationsVendorIds = _.uniq(_.pluck(response.results, 'vendor_id'));

                _loadVendors(
                  [
                    {
                      'id': filteredVendorLocationsVendorIds.length > 0 ? filteredVendorLocationsVendorIds : 0
                    }
                  ]
                )
                  .then(
                    function() {

                      // if table content was reloaded in bulk mode - check if there were some items checked before, and check them if they are still there in current result set
                      if (__this.bulkEdit.show_form) {
                        var checkedVendorsIdsInResults = _.intersection(_.pluck(__this.vendors, 'id'), _.pluck(__this.bulkEdit.checked_items, 'id'));
                        var checkedVendorsInResults = [];

                        _.each(
                          checkedVendorsIdsInResults,
                          function(vendorId) {

                            checkedVendorsInResults.push(__this.vendorsById[vendorId]);
                            return;

                          }
                        );

                        // use timeout to update selected rows, because md-data-table tends to clear them after refreshing
                        __this.$timeout(function() { __this.bulkEdit.checked_items = checkedVendorsInResults; }, 1000);

                      } else {

                        __this.bulkEdit.checked_items = [];

                      }

                      __this.hideMessage();
                      __this.blockers.api_processing = false;
                      __this.blockers.table_updating = false;

                      if (afterLoadToastMessage) {

                        _showToast(afterLoadToastMessage);

                      }

                      resolve(true);

                    },
                    function(error) {
                      reject(error);
                    }
                  );


              },
              function(error) {
                reject(error);
              }
            );

        } else {

          _loadVendors()
            .then(
              function() {

                // if table content was reloaded in bulk mode - check if there were some items checked before, and check them if they are still there in current result set
                if (__this.bulkEdit.show_form) {
                  var checkedVendorsIdsInResults = _.intersection(_.pluck(__this.vendors, 'id'), _.pluck(__this.bulkEdit.checked_items, 'id'));
                  var checkedVendorsInResults = [];

                  _.each(
                    checkedVendorsIdsInResults,
                    function(vendorId) {

                      checkedVendorsInResults.push(__this.vendorsById[vendorId]);
                      return;

                    }
                  );

                  // use timeout to update selected rows, because md-data-table tends to clear them after refreshing
                  __this.$timeout(function() { __this.bulkEdit.checked_items = checkedVendorsInResults; }, 1000);
                } else {

                  __this.bulkEdit.checked_items = [];

                }

                __this.hideMessage();
                __this.blockers.api_processing = false;
                __this.blockers.table_updating = false;

                if (afterLoadToastMessage) {

                  _showToast(afterLoadToastMessage);
                  
                }

                resolve(true);

              },
              function(error) {
                reject(error);
              }
            );

        }

      });

    }

    function _parseVendorsTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _prepareVendors()
          .then(
            function() {

              _prepareVendorLocations()
                .then(
                  function() {
                    resolve(true);
                  },
                  function(error) {
                    reject(error);
                  }
                );

            },
            function(error) {
              reject(error);
            }
          );

      });

    }

    function _prepareVendors() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.vendors = __this.cakeVendors.getVendors();
        __this.vendorsById = {};

        _.each(
          __this.vendors,
          function(vendor) {

            vendor = _prepareVendorHelper(vendor);
            __this.vendorsById[vendor.id] = vendor;

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareVendorHelper(vendor) {

      var __this = _this;

      vendor.locations = [];
      vendor.vendorLocations = [];
      vendor.locationsNames = [];

      return vendor;

    }

    function _prepareVendorLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.vendorLocations = __this.cakeVendorLocations.getVendorLocations();
        __this.vendorLocationsById = {};

        _.each(
          __this.vendorLocations,
          function(vendorLocation) {

            vendorLocation = _prepareVendorLocationHelper(vendorLocation);
            __this.vendorLocationsById[vendorLocation.id] = vendorLocation;

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareVendorLocationHelper(vendorLocation) {

      var __this = _this;

      var location = __this.activeLocationsById[vendorLocation.location_id];
      vendorLocation.location = location;

      var vendor = __this.vendorsById[vendorLocation.vendor_id];
      //itemLocation.item = item;
      if (vendor) {
        vendor.vendorLocations.push(vendorLocation);
        vendor.locations.push(location);
        vendor.locationsNames.push(location.name);
      }

      return vendorLocation;

    }


    function _showToast(message) {

      var __this = _this;

      __this.$peachToast.show(message);

    }



    /** CONSTRUCTOR **/

    function _constructor($filter, $location, $peachToast, $q, $timeout, cakeCommon, cakeVendors, cakePermissions, cakeSettings, cakeVendorLocations) {

      _this.$filter = $filter;
      _this.$location = $location;
      _this.$peachToast = $peachToast;
      _this.$q = $q;
      _this.$timeout = $timeout;
      _this.cakeCommon = cakeCommon;
      _this.cakeVendors = cakeVendors;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeVendorLocations = cakeVendorLocations;

      _this.blockers = {
        api_processing  : false,
        saving          : false,
        table_updating  : false
      };
      _this.bulkEdit = {
        is_enabled    : false,
        show_form     : false,
        form_data     : {},
        checked_items : []
      };

      //*** Table data related variables ***//
      _this.pagination = {
        limit       : 100,
        page_no     : 1,
        total_items : 0
      };
      _this.paginationLimits = [100];
      _this.tableSort = {
        field : 'name',
        order : 'asc'
      };
      _this.requestParams = {}; // all inv item requests params - find filter and pagination stuff
      _this.filters = {
        show_inactive_items : false,
        location_id         : null
      };
      _this.customFiltersApplied = false; // will be used if most recent results were filtered by user or not
      _this.searchParams = {searchQuery: ''}; // used to filter count groups table

      //*** Other scope variables ***//
      _this.accountLocations = []; // all account locations
      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditVendors = false; // if user has permission to edit items
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.isSingleLocationAccount = true; // says if there's more than 1 location available on account - we eventually have to hide some areas
      _this.vendors = []; // all available inventory items array
      _this.vendorsById = {}; // all available inventory items collection - ids are keys
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc
      _this.loadTablePageData = _loadTablePageData;

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      // show loading message
      __this.blockers.api_processing = true;
      __this.blockers.table_updating = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations
      __this.$q.all({
        is_account_admin    : __this.cakeCommon.isUserAccountAdmin(),
        active_locations    : __this.cakeSettings.getSettings('active_locations'),
        account_locations   : __this.cakeSettings.getSettings('account_locations'),
        can_edit_vendors    : __this.cakePermissions.userHasPermission('edit_vendors')
      })
        .then(
          function(results) {
            

            __this.isAccountAdmin = results['is_account_admin'];

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.accountLocations = results['account_locations'];
            __this.isSingleLocationAccount = __this.accountLocations.length <= 1 ? true : false;
            //__this.isSingleLocationAccount = true;

            __this.canEditVendors = results['can_edit_vendors'];
            _loadTablePageData();
          },
          function(error) {
            __this.errorHandler(error);
          }
        );
    }



    /** PUBLIC FUNCTIONS **/

    _this.bulkEditVendorLocationsCallback = function(vendorLocationsCollection) {   

      var __this = _this;

      var vendorIds = _.uniq(_.pluck(vendorLocationsCollection, 'vendor_id'));
      var vendorLocationsToRemove = [];
      var vendorLocationsToCreate = [];

      __this.blockers.api_processing = true;
      __this.blockers.table_updating = true;

      _.each(
        vendorLocationsCollection,
        function(vendorLocation) {

          if (!vendorLocation.id) {

            vendorLocationsToCreate.push(_.omit(vendorLocation, ['id', 'to_be_removed']));

          } else if (vendorLocation.to_be_removed) {

            vendorLocationsToRemove.push(vendorLocation.id);

          }

          return;

        }
      );  
      
      // delete/create vendor locations
      __this.$q.all(
        [
          __this.cakeVendorLocations.bulkCreateVendorLocations(vendorLocationsToCreate),
          __this.cakeVendorLocations.bulkDeleteVendorLocations(vendorLocationsToRemove)
        ]
      )
        .then(
          function(results) {
            _loadTablePageData('Data updated!');
          },
          function(error) {
            __this.blockers.api_processing = false;
            __this.blockers.table_updating = false;
            __this.errorHandler(error);
          }
        );
    }

    _this.clearFilters = function() {

      var __this = _this;

      __this.filters = {
        show_inactive_items : false,
        location_id         : null
      };

      // if filters were set by the user last time results were built, reload table with no filters
      // else - no need to reload
      if (__this.customFiltersApplied) {
        __this.pagination.page_no = 1;
        _loadTablePageData();
      }

    }

    _this.closeBulkEdit = function() {

      var __this = _this;

      __this.bulkEdit = {
        is_enabled    : false,
        show_form     : false,
        form_data     : {},
        checked_items : []
      };

    }


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

    _this.filterTable = function() {

      var __this = _this;

      __this.pagination.page_no = 1;

      _loadTablePageData();

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }


    _this.onBulkEditModeChangeCallback = function() {

      var __this = _this;

      if (__this.bulkEdit.is_enabled) {

        __this.openBulkEdit();

      } else {

        __this.closeBulkEdit();

      }

    }

    _this.onPaginationChangeCallback = function() {

      var __this = _this;

      _loadTablePageData();

    }

    _this.onSearchPhraseUpdateCallback = function() {

      var __this = _this;

      __this.filterTable();

    }

    _this.openBulkEdit = function() {

      var __this = _this;

      __this.bulkEdit.is_enabled = true;
      __this.bulkEdit.show_form = true;

    }

    _this.openEditVendorModal = function(vendorId) {

      var __this = _this;

      __this.$location.path('/settings/edit_vendor').search({id: vendorId});

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }

    _this.toggleInactiveVendors = function() {

      var __this = _this;
      
      __this.filters.show_inactive_items = !__this.filters.show_inactive_items;
      __this.loadTablePageData();

    };
  }
}

VendorsController.$inject = ['$filter', '$location', '$peachToast', '$q', '$timeout',
                             'commonService', 'vendorsService', 'permissionsService',
                             'settingsService', 'vendorLocationsService'];

export default VendorsController;