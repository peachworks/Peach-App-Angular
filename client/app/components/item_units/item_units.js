
class ItemUnitsController {
  constructor($document, $peach, $q, cakeCommon, cakeGLAccounts, cakeItems, cakeItemLocations,
              cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeUnits) {
    /** Items units settings page
     * Inventory items units of measure management page
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

    function _buildItemsTableRequestParams(additionalFindQueryElements) {

      var __this = _this;

      additionalFindQueryElements = additionalFindQueryElements || [];

      var findQueryElements = [];

      return __this.$q(function(resolve, reject) {

        __this.itemsRequestParams = {};

        if (__this.searchParams.searchQuery !== '') {
          findQueryElements.push(
            {
              'name': {
                '$like': __this.searchParams.searchQuery
              }
            }
          );
        }

        if (__this.filters.gl_account_id) {
          __this.customFiltersApplied = true;
          findQueryElements.push(
            {
              'gl_account_id': __this.filters.gl_account_id
            }
          );
        }

        findQueryElements = findQueryElements.concat(additionalFindQueryElements);

        __this.itemsRequestParams.page = __this.pagination.page_no;
        __this.itemsRequestParams.limit = __this.pagination.limit;
        //__this.itemsRequestParams.sort = ((__this.tableSort.order === 'desc') ? '-' : '') + __this.tableSort.field;
        __this.itemsRequestParams.sort = 'name';

        if (findQueryElements.length > 0) {
          __this.itemsRequestParams.find = {
            '$and': findQueryElements
          };
        }

        resolve(true);

      });

    }

    function _getLocationAndLoadTableData(locationId) {

      var __this = _this;

      if (locationId) {

        __this.blockers.no_location = false;

        if (__this.activeLocationsById[locationId]) {

          __this.filters.location_id = locationId;

          __this.onPaginationChangeCallback();

        } else {

          __this.items = [];
          __this.itemsById = {};
          __this.pagination.total_items = 0;

          __this.showMessage("Selected location is not an active Cake location.");
          __this.blockers.api_processing = false;
          __this.blockers.no_location = true;

        }

      } else {

        __this.items = [];
        __this.itemsById = {};
        __this.pagination.total_items = 0;

        __this.blockers.api_processing = false;
        __this.blockers.no_location = true;

      }

    }

    function _loadItemLocations(findQueryParams) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeItemLocations.loadItemLocations(findQueryParams)
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

    function _loadItems(additionalFindQueryElements) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _buildItemsTableRequestParams(additionalFindQueryElements)
          .then(
            function() {

              var findParams = __this.itemsRequestParams.find || null;
              var otherParams = _.omit(__this.itemsRequestParams, 'find');

              __this.cakeItems.loadItems(
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

    function _loadItemUnits(findQueryParams) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeItemUnits.loadItemUnits(findQueryParams)
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

    function _loadItemUnitLocations(findQueryParams) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeItemUnitLocations.loadItemUnitLocations(findQueryParams)
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

    function _loadTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.customFiltersApplied = false;

        if (__this.filters.location_id) {

          /*__this.showMessage('Loading items and units...');*/
          __this.blockers.api_processing = true;

          _loadItemLocations(
            {
              'location_id': __this.filters.location_id
            }
          )
            .then(
              function(itemLocationsResponse) {

                var filteredItemLocationsItemIds = _.uniq(_.pluck(itemLocationsResponse.results, 'inv_item_id'));

                _loadItems(
                  [
                    {
                      'id': filteredItemLocationsItemIds.length > 0 ? filteredItemLocationsItemIds : 0
                    }
                  ]
                )
                  .then(
                    function(itemsResponse) {

                      var filteredItemsIds = _.pluck(itemsResponse.results, 'id');

                      __this.$q.all([
                        _loadItemUnits(
                          {
                            'inv_item_id': filteredItemsIds.length > 0 ? filteredItemsIds : 0
                          }
                        ),
                        _loadItemUnitLocations(
                          {
                            '$and': [
                              {
                                'inv_item_id': filteredItemsIds.length > 0 ? filteredItemsIds : 0
                              },
                              {
                                'location_id': __this.filters.location_id
                              }
                            ]
                          }
                        )
                      ])
                        .then(
                          function(results) {

                            _parseTablePageData()
                              .then(
                                function() {

                                  __this.hideMessage();
                                  __this.blockers.api_processing = false;

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

                    },
                    function(error) {

                      __this.errorHandler(error);
                      __this.blockers.api_processing = false;

                      reject(error);

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

          __this.showMessage("Please select a location first.", 'warning');
          __this.blockers.api_processing = false;

        }

      });

    }

    function _parseTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.itemUnits = __this.cakeItemUnits.getItemUnits();
        __this.itemUnitsById = __this.cakeItemUnits.getItemUnitsCollection();

        __this.itemUnitLocations = __this.cakeItemUnitLocations.getItemUnitLocations();
        __this.itemUnitLocationsById = __this.cakeItemUnitLocations.getItemUnitLocationsCollection();

        __this.items = __this.cakeItems.getItems();

        // initially parse each unit - set as not expanded and init units table
        _.each(
          __this.items,
          function(item) {

            item.common_unit = null;
            item.units = [];
            item.is_expanded = false;
            __this.itemsById[item.id] = item;
            return;

          }
        );

        // parse all item units - find related item and unit, init unit_locations table, parse some data like display name and display conversion
        _.each(
          __this.itemUnits,
          function(itemUnit) {

            itemUnit.unit = __this.unitsById[itemUnit.unit_id];
            itemUnit.item = __this.itemsById[itemUnit.inv_item_id];
            itemUnit.unit_locations = [];

            if (itemUnit.unit && itemUnit.item) {

              itemUnit.is_common_unit = itemUnit.unit_id === itemUnit.common_unit_id;
              itemUnit.display_name = itemUnit.unit.name + ((!itemUnit.is_common_unit && itemUnit.description) ? ' (' + itemUnit.description + ')' : '');
              itemUnit.conversion_value = parseFloat(Big(itemUnit.unit_quantity).toFixed(5));
              itemUnit.conversion_label = itemUnit.conversion_value.toString();

            }

            return;

          }
        );

        // parse all item unit locations - find related item unit and item, and if found - push to parent unit
        _.each(
          __this.itemUnitLocations,
          function(itemUnitLocation) {

            itemUnitLocation.item_unit = __this.itemUnitsById[itemUnitLocation.inv_item_unit_id];
            itemUnitLocation.item = __this.itemsById[itemUnitLocation.inv_item_id];

            if (itemUnitLocation.item && itemUnitLocation.item_unit) {

              itemUnitLocation.item_unit.unit_locations.push(itemUnitLocation);

            }

            return;

          }
        );

        // second round of unit parsing - we add them to parent item, but only if all the data was set correctly and there are some unit locations
        _.each(
          __this.itemUnits,
          function(itemUnit) {

            if (itemUnit.unit && itemUnit.item && itemUnit.unit_locations.length > 0) {

              itemUnit.single_location_mode_data = itemUnit.unit_locations[0];

              if (itemUnit.is_common_unit) {
                itemUnit.item.common_unit = itemUnit;
              } else {
                itemUnit.item.units.push(itemUnit);
              }

            }

            return;

          }
        );

        // finally, after all data was set, second round of items parsing - we need to sort their units properly, and put common unit at the top
        _.each(
          __this.items,
          function(item) {

            item.units = _.sortBy(item.units, 'display_name');

            if (item.common_unit) {

              item.units.unshift(item.common_unit);

            }

            _.each(
              item.units,
              function(itemUnit) {

                if (!itemUnit.is_common_unit) {

                  itemUnit.conversion_label = itemUnit.conversion_label + (item.common_unit ? ' ' + item.common_unit.unit.abbr : '');

                }

                return;

              }
            );

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareUnits() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.units = __this.cakeUnits.getUnits();
        __this.unitsById = __this.cakeUnits.getUnitsCollection();

        resolve(true);

      });

    }

    function _prepareGLAccounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.glAccounts = __this.cakeGLAccounts.getGLAccounts();
        __this.glAccountsById = __this.cakeGLAccounts.getGLAccountsCollection();

        resolve(true);

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($document, $peach, $q, cakeCommon, cakeGLAccounts, cakeItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeUnits) {

      _this.$document = $document;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeGLAccounts = cakeGLAccounts;
      _this.cakeItems = cakeItems;
      _this.cakeItemLocations = cakeItemLocations;
      _this.cakeItemUnits = cakeItemUnits;
      _this.cakeItemUnitLocations = cakeItemUnitLocations;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeUnits = cakeUnits;

      _this.blockers = {
        api_processing : false,
        no_location    : false
      };

      //*** Table data related variables ***//
      _this.pagination = {
        limit       : 25,
        page_no     : 1,
        total_items : 0
      };
      _this.paginationLimits = [
        10,
        25,
        50
      ];
      /*_this.tableSort = {
        field : 'name',
        order : 'asc'
        };*/
      _this.itemsRequestParams = {}; // all inv item requests params - find filter and pagination stuff
      _this.filters = {
        gl_account_id       : null,
        location_id         : null
      };
      _this.customFiltersApplied = false; // will be used if most recent results were filtered by user or not
      _this.searchParams = {searchQuery: ''}; // used to filter count groups table

      //*** Other scope variables ***//
      _this.accountLocations = []; // all account locations
      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditItemUnits = false; // if user has permission to edit items
      _this.units = []; // all available units array
      _this.unitsById = {}; // all available units collection - ids are keys
      _this.forms = {};
      _this.glAccounts = []; // all available gl accounts array
      _this.glAccountsById = {}; // all available gl accounts collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.isSingleLocationAccount = true; // says if there's more than 1 location available on account - we eventually have to hide some areas
      _this.items = []; // all available inventory items array
      _this.itemsById = {}; // all available inventory items collection - ids are keys
      _this.itemUnits = []; // all available inventory item units array
      _this.itemUnitsById = {}; // all available inventory item units collection - ids are keys
      _this.itemUnitLocations = []; // all available inventory item unit locations array
      _this.itemUnitLocationsById = {}; // all available inventory item unit locations collection - ids are keys
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      /*// show loading message
        __this.showMessage("Loading common data...");*/
      __this.blockers.api_processing = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      __this.$q.all({
        is_account_admin  : __this.cakeCommon.isUserAccountAdmin(),
        can_edit_units    : __this.cakePermissions.userHasPermission('edit_item_units'),
        account_locations : __this.cakeSettings.getSettings('account_locations'),
        active_locations  : __this.cakeSettings.getSettings('active_locations'),
        gl_accounts       : __this.cakeGLAccounts.loadGLAccounts(null, {sort: 'name'}),
        units             : __this.cakeUnits.loadUnits(null, {sort: 'name'})
      })
        .then(
          function(results) {

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditItemUnits = results['can_edit_units'];

            __this.accountLocations = results['account_locations'];
            __this.isSingleLocationAccount = __this.accountLocations.length <= 1 ? true : false;

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            // parse loaded gl accounts, count groups and units
            __this.$q.all([
              _prepareGLAccounts(),
              _prepareUnits()
            ])
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
            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    _this.clearFilters = function() {

      var __this = _this;

      __this.filters.gl_account_id = null;

      // if filters were set by the user last time results were built, reload table with no filters
      // else - no need to reload
      if (__this.customFiltersApplied) {

        __this.pagination.page_no = 1;
        
        __this.onPaginationChangeCallback();

      }

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

      __this.onPaginationChangeCallback();

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

      __this.filterTable();

    }

    _this.saveItemUnitLocation = function(itemUnitLocation) {

      var __this = _this;

      // TODO: use $peach.queue for this when it's ready!
      /*__this.$peach.queue(
        __this.cakeItemUnitLocations.updateItemUnitLocation(itemUnitLocation)
        );*/

      __this.cakeItemUnitLocations.updateItemUnitLocation(itemUnitLocation);

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

ItemUnitsController.$inject = ['$document', '$peach', '$q', 'commonService', 'glAccountsService',
                               'itemsService', 'itemLocationsService', 'itemUnitsService', 
                               'itemUnitLocationsService', 'permissionsService', 'settingsService',
                               'cakeUnitsService'];

export default ItemUnitsController;