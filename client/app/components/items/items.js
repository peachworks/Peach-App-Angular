
class ItemsController {
  constructor($document, $filter, $location, $peachToast, $q, $timeout, cakeCommon,
              cakeCountGroups, cakeGLAccounts, cakeItems, cakeItemsDBItems, cakeItemLocations,
              cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings,
              cakeSharedData, cakeTypeaheadHelper, cakeUnits, cakeVendors, cakeVendorItems) {
    /** Items settings page
     * Inventory items management page
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

    function _buildItemsTableRequestParamsStep1() {

      var __this = _this;

      var promises = [];
      var queryParams = [];

      return __this.$q(function(resolve, reject) {

        // Depending on if location filter was selected or not the process of items loading changes a bit.
        // If no location was selected, then we load a page of items and load all item locations for those items
        // If location was selected, then we first load all item locations with given location id, from results we parse item ids, then we load a page of items from given ids range with all their item locations (because item can have more than just this selected one location)
        // The process for vednors filter is very similar - if its chosen, we have to load vendor items, pluck items ids from there and use in the query
        if (__this.filters.location_id) {

          __this.customFiltersApplied = true;

          promises.push(
            _loadItemLocations(
              {
                'location_id': __this.filters.location_id
              }
            )
          );

        }

        if (__this.filters.vendor_id) {

          __this.customFiltersApplied = true;

          promises.push(
            _loadVendorItems(
              {
                'vendor_id': __this.filters.vendor_id
              }
            )
          );

        }

        if (promises.length > 0) {

          __this.$q.all(promises)
            .then(
              function(results) {

                var filteredItemIds = [];

                // if both - location and vendor were set in the filters, combine loaded items ids
                if (results.length == 2) {

                  filteredItemIds = _.intersection(_.uniq(_.pluck(results[0]['results'], 'inv_item_id')), _.uniq(_.pluck(results[1]['results'], 'inv_item_id')));

                  // if not - then only use item ids from either locations or vendor
                } else {

                  filteredItemIds = _.uniq(_.pluck(results[0]['results'], 'inv_item_id'));

                }

                queryParams.push(
                  {
                    'id': filteredItemIds.length > 0 ? filteredItemIds : 0
                  }
                );

                resolve(queryParams);

              },
              function(error) {

                reject(error);

              }
            );

        } else {

          resolve(queryParams);

        }

      });

    }

    function _buildItemsTableRequestParamsStep2(additionalFindQueryElements) {

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

        if (__this.filters.count_group_id) {
          __this.customFiltersApplied = true;
          findQueryElements.push(
            {
              'count_group_id': __this.filters.count_group_id
            }
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

        __this.itemsRequestParams.page = __this.pagination.page_no;
        __this.itemsRequestParams.limit = __this.pagination.limit;
        __this.itemsRequestParams.sort = ((__this.tableSort.order === 'desc') ? '-' : '') + __this.tableSort.field;

        if (findQueryElements.length > 0) {
          __this.itemsRequestParams.find = {
            '$and': findQueryElements
          };
        }

        resolve(true);

      });

    }

    function _checkInitialAction() {

      var __this = _this;

      if (__this.cakeSharedData.getValue('items_page_init_action')) {

        var action = __this.cakeSharedData.getValue('items_page_init_action');

        switch (action) {

        case 'open_item_form':

          if (__this.canEditItems) {

            __this.openNewItemForm();

          }

          break;

        default:

          break;

        }

        __this.cakeSharedData.unsetValue('items_page_init_action');

      }

    }

    function _createNewItem(itemData, loadCreatedItemToCache) {

      var __this = _this;

      loadCreatedItemToCache = loadCreatedItemToCache || false;

      // here are fields from itemData we don't want to include in POST request
      // pay attention items_db_id should be sent as item_db_id (no 's' at the end)
      var fieldsToStripBeforeSave = ['items_db_id', 'items_db_units', 'new_vendor_conversion_label', 'new_vendor_disable_conversion', 'new_vendor_id', 'new_vendor_last_price', 'new_vendor_unit_conversion', 'new_vendor_unit_id'];

      return __this.$q(function(resolve, reject) {

        var extendedOptions = {extended: true};

        if (itemData.items_db_id) { // add items_db_id to query params so the BEFORE POST trigger would load data for new item from itemsDB
          extendedOptions.item_db_id = itemData.items_db_id;
        }

        __this.cakeItems.createItem(
          _.extend(_.omit(itemData, fieldsToStripBeforeSave), {item_db_id: itemData.items_db_id}),
          extendedOptions
        )
          .then(
            function(newItemData) {

              // if we want to add just created item to cache (table), then we need to load all its data
              // we already have item data, but we need to load item locations (created in trigger) and eventually gl account (if new one was created in trigger)
              if (loadCreatedItemToCache) {

                __this.$q.all([
                  __this.cakeItemLocations.loadItemLocations(
                    {
                      '$and': [
                        {
                          'location_id': itemData.locations
                        },
                        {
                          'inv_item_id': newItemData.id
                        }
                      ]
                    },
                    null,
                    true
                  ),
                  __this.cakeGLAccounts.loadGLAccounts(
                    {
                      'id': newItemData.gl_account_id
                    },
                    null,
                    true
                  )
                ])
                  .then(
                    function(results) {

                      // if new item gl account was just created (in POST trigger) also add it to cache
                      _.each(
                        results[1]['results'],
                        function(glAccount) {

                          if (!__this.glAccountsById[glAccount.id]) {

                            __this.glAccounts.push(glAccount);
                            __this.glAccountsById[glAccount.id] = glAccount;

                          }

                          return;

                        }
                      );

                      // parse new item and add to cache
                      newItemData = _prepareItemHelper(newItemData);
                      __this.items.unshift(newItemData);
                      __this.itemsById[newItemData.id] = newItemData;

                      // parse new item locations and add to cache
                      _.each(
                        results[0]['results'],
                        function(newItemLocationData) {

                          newItemLocationData = _prepareItemLocationHelper(newItemLocationData);
                          __this.itemLocations.push(newItemLocationData);
                          __this.itemLocationsById[newItemLocationData.id] = newItemLocationData;

                          return;

                        }
                      );

                      resolve(newItemData);

                    },
                    function(error) {

                      reject(error);

                    }
                  );


              } else {

                resolve(newItemData);

              }

            },
            function(error) {

              reject(error);

            }
          );

      });

    }

    function _createNewItemVendorHelper(newItem, chosenLocationIds, successCallback, errorCallback) {

      var __this = _this;

      var newVendorItemData = {
        vendor_id         : parseInt(__this.newItem.form_data.new_vendor_id, 10),
        inv_item_id       : newItem.id,
        inv_item_unit_id  : null, // will be set later on
        is_active         : true
      };

      if (__this.newItem.form_data.new_vendor_last_price) {

        newVendorItemData.last_price = __this.cakeCommon.parseCakeFloatValue(__this.newItem.form_data.new_vendor_last_price, null);
        newVendorItemData.last_price_on = moment().format('YYYY-MM-DD');

      }

      // first load new item units for unit selected in new vendor - are there any?
      __this.cakeItemUnits.loadItemUnits(
        {
          'inv_item_id' : newItem.id,
          'unit_id'     : parseInt(__this.newItem.form_data.new_vendor_unit_id, 10)
        },
        null,
        true
      )
        .then(
          function(response) {

            // if there are item units created for the same unit user chose for vendor item, check if any of these has the same conversion
            var newVendorUnitConversionValue = __this.cakeCommon.parseCakeFloatValue(__this.newItem.form_data.new_vendor_unit_conversion, null);
            var newVendorUnit = false;

            _.each(
              response.results,
              function(itemUnit) {

                var conversionValue = __this.cakeCommon.parseCakeFloatValue(itemUnit.unit_quantity, null);

                if (conversionValue === newVendorUnitConversionValue) {

                  newVendorUnit = itemUnit;
                  return false; // break immediately

                }

                return

              }
            );

            // there is no item unit with the same conversion, create new item unit, add it in all item locations, then create vendor item
            if (!newVendorUnit) {

              var newItemUnitData = {
                unit_id         : parseInt(__this.newItem.form_data.new_vendor_unit_id, 10),
                unit_quantity   : newVendorUnitConversionValue,
                is_report_unit  : false,
                inv_item_id     : newItem.id,
                common_unit_id  : newItem.common_unit_id,
                description     : __this.unitsById[parseInt(__this.newItem.form_data.new_vendor_unit_id, 10)]['name'] + ' ' + newVendorUnitConversionValue + ' ' + __this.unitsById[newItem.common_unit_id]['abbr']
              };

              __this.cakeItemUnits.createItemUnit(
                newItemUnitData
              )
                .then(
                  function(response) {

                    newVendorUnit = response;

                    var newItemUnitLocationsCollection = [];

                    _.each(
                      chosenLocationIds,
                      function(locationId) {

                        newItemUnitLocationsCollection.push(
                          {
                            inv_item_id       : newItem.id,
                            location_id       : locationId,
                            inv_item_unit_id  : newVendorUnit.id,
                            is_count_unit     : true
                          }
                        );

                        return;

                      }
                    );

                    if (newItemUnitLocationsCollection.length > 0) {

                      __this.cakeItemUnitLocations.bulkCreateItemUnitLocations(
                        newItemUnitLocationsCollection
                      )
                        .then(
                          function(response) {

                            newVendorItemData.inv_item_unit_id = newVendorUnit.id;

                            _createNewItemVendorInnerHelper(newVendorItemData, successCallback, errorCallback);

                          },
                          function(error) {

                            errorCallback('New item created fine, but failed to create vendor item.');

                          }
                        );

                    } else {

                      newVendorItemData.inv_item_unit_id = newVendorUnit.id;

                      _createNewItemVendorInnerHelper(newVendorItemData, successCallback, errorCallback);

                    }

                  },
                  function(error) {

                    errorCallback('New item created fine, but failed to create vendor item.');

                  }
                );

              // there's already some item unit with the same convrsion - use it to create new vendor item
            } else {

              newVendorItemData.inv_item_unit_id = newVendorUnit.id;

              _createNewItemVendorInnerHelper(newVendorItemData, successCallback, errorCallback);

            }

          },
          function(error) {

            errorCallback('New item created fine, but failed to create vendor item.');

          }
        );

    }

    function _createNewItemVendorInnerHelper(newItemVendorData, successCallback, errorCallback) {

      var __this = _this;

      __this.cakeVendorItems.createVendorItem(
        newItemVendorData
      )
        .then(
          function(response) {

            // parse new item vendor and add to cache
            var newItemVendorData = _prepareItemVendorHelper(response);
            __this.itemVendors.push(newItemVendorData);
            __this.itemVendorsById[newItemVendorData.id] = newItemVendorData;

            successCallback();

          },
          function(error) {

            errorCallback('New item created fine, but failed to create vendor item.');

          }
        );

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

    function _loadItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var findParams = __this.itemsRequestParams.find || null;
        var otherParams = _.omit(__this.itemsRequestParams, 'find');

        __this.cakeItems.loadItems(
          findParams,
          otherParams
        )
          .then(
            function(response) {

              __this.pagination.total_items = response.count || 0;

              if (response.results.length > 0) {

                __this.$q.all(
                  [
                    _loadItemLocations(
                      {
                        '$and': [
                          {
                            'location_id': _.pluck(__this.activeLocations, 'id')
                          },
                          {
                            'inv_item_id': _.keys(__this.cakeItems.getItemsCollection())
                          }
                        ]
                      }
                    ),
                    _loadVendorItems(
                      {
                        'inv_item_id': _.keys(__this.cakeItems.getItemsCollection())
                      }
                    ),
                  ]
                )
                  .then(
                    function(response) {

                      _parseItemsTablePageData()
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

                _parseItemsTablePageData()
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

      });

    }

    function _loadItemsTablePageData(afterLoadToastMessage) {

      var __this = _this;

      afterLoadToastMessage = afterLoadToastMessage || null;

      return __this.$q(function(resolve, reject) {

        __this.closeNewItemForm();

        __this.blockers.api_processing = true;
        __this.blockers.table_updating = true;

        __this.customFiltersApplied = false;

        _buildItemsTableRequestParamsStep1()
          .then(
            function(queryParams) {

              _buildItemsTableRequestParamsStep2(queryParams)
                .then(
                  function() {

                    _loadItems()
                      .then(
                        function() {

                          // if table content was reloaded in bulk mode - check if there were some items checked before, and check them if they are still there in current result set
                          if (__this.bulkEdit.show_form) {

                            var checkedItemsIdsInResults = _.intersection(_.pluck(__this.items, 'id'), _.pluck(__this.bulkEdit.checked_items, 'id'));
                            var checkedItemsInResults = [];

                            _.each(
                              checkedItemsIdsInResults,
                              function(itemId) {

                                checkedItemsInResults.push(__this.itemsById[itemId]);
                                return;

                              }
                            );

                            // use timeout to update selected rows, because md-data-table tends to clear them after refreshing
                            __this.$timeout(function() { __this.bulkEdit.checked_items = checkedItemsInResults; }, 1000);

                          } else {

                            __this.bulkEdit.checked_items = [];

                          }

                          __this.blockers.api_processing = false;
                          __this.blockers.table_updating = false;

                          if (afterLoadToastMessage) {

                            _showToast(afterLoadToastMessage);

                          }

                          __this.$document[0].getElementById('page_frame').scrollTop = 0;

                          resolve(true);

                        },
                        function(error) {

                          __this.blockers.api_processing = false;
                          __this.blockers.table_updating = false;

                          reject(error);

                        }
                      );

                  },
                  function(error) {

                    __this.blockers.api_processing = false;
                    __this.blockers.table_updating = false;

                    reject(error);

                  }
                );

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.blockers.table_updating = false;

              reject(error);

            }
          );

      });

    }

    function _loadNewItemTypeaheadOptions() {

      var __this = _this;

      return __this.cakeTypeaheadHelper.typeaheadDataLoad(
        __this.newItem.typeahead.search_text,
        'name',
        'new_item_typeahead_loader',
        [
          _loadNewItemTypeaheadInvItemsOptionsHelperPromise,
          _loadNewItemTypeaheadItemsDBOptionsHelperPromise
        ],
        __this.newItem.typeahead,
        3,
        'name'
      )
        .then(
          function(results) {

            var itemsNames = [];
            var suggestions = [];

            if (results[0]) {
              itemsNames = _.map(_.pluck(results[0], 'name'), function(itemName) { return itemName.toLowerCase(); });
            }

            if (results[1]) {
              _.each(
                results[1],
                function (result) {
                  if (itemsNames.indexOf(result.name.toLowerCase()) < 0) {
                    suggestions.push(result);
                  }
                  return;
                }
              );
            }

            return suggestions;

          }
        );

    }

    function _loadNewItemTypeaheadItemsDBOptionsHelperPromise(search, limit) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeItemsDBItems.getData(
          {
            'name'    : {
              '$like'   : search
            }
          },
          {
            sort: 'name',
            limit: limit
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

    function _loadNewItemTypeaheadInvItemsOptionsHelperPromise(search, limit) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeItems.loadItems(
          {
            'name'    : {
              '$like'   : search
            }
          },
          {
            sort: 'name',
            fields: 'id,name',
            limit: limit
          },
          true
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

    function _loadNewItemTypeaheadOptionsValidationPromise(search) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeItems.loadItems(
          {
            'name' : search
          },
          {
            fields: 'id',
            limit: 1
          },
          true
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

    function _loadVendorItems(findQueryParams) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeVendorItems.loadVendorItems(findQueryParams)
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

    function _parseItemsTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _prepareItems()
          .then(
            function() {

              __this.$q.all(
                [
                  _prepareItemLocations(),
                  _prepareItemVendors()
                ]
              )
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

    function _prepareCountGroups() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.countGroups = __this.cakeCountGroups.getCountGroups();
        __this.countGroupsById = __this.cakeCountGroups.getCountGroupsCollection();

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

    function _prepareItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.items = __this.cakeItems.getItems();
        __this.itemsById = {};

        _.each(
          __this.items,
          function(item) {

            item = _prepareItemHelper(item);
            __this.itemsById[item.id] = item;

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareItemHelper(item) {

      var __this = _this;

      item.glAccount = __this.glAccountsById[item.gl_account_id];
      item.glAccountName = item.glAccount ? item.glAccount.name : '--';
      item.countGroup = __this.countGroupsById[item.count_group_id];
      item.countGroupName = item.countGroup ? item.countGroup.name : '--';
      item.commonUnit = __this.unitsById[item.common_unit_id];
      item.commonUnitName = item.commonUnit ? item.commonUnit.name : '--';
      item.locations = [];
      item.itemLocations = [];
      item.locationsNames = [];
      item.vendors = [];
      item.vendorsById = {};
      item.itemVendors = [];
      item.vendorsNames = [];

      return item;

    }

    function _prepareItemLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.itemLocations = __this.cakeItemLocations.getItemLocations();
        __this.itemLocationsById = {};

        _.each(
          __this.itemLocations,
          function(itemLocation) {

            itemLocation = _prepareItemLocationHelper(itemLocation);
            __this.itemLocationsById[itemLocation.id] = itemLocation;

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareItemLocationHelper(itemLocation) {

      var __this = _this;

      var location = __this.activeLocationsById[itemLocation.location_id];
      itemLocation.location = location;

      var item = __this.itemsById[itemLocation.inv_item_id];

      if (item) {
        item.itemLocations.push(itemLocation);
        item.locations.push(location);
        item.locationsNames.push(location.name);
      }

      return itemLocation;

    }

    function _prepareItemVendors() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.itemVendors = __this.cakeVendorItems.getVendorItems();
        __this.itemVendorsById = {};

        _.each(
          __this.itemVendors,
          function(itemVendor) {

            itemVendor = _prepareItemVendorHelper(itemVendor);
            __this.itemVendorsById[itemVendor.id] = itemVendor;

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareItemVendorHelper(itemVendor) {

      var __this = _this;

      var vendor = __this.vendorsById[itemVendor.vendor_id];
      itemVendor.vendor = vendor;

      var item = __this.itemsById[itemVendor.inv_item_id];

      if (item) {

        item.itemVendors.push(itemVendor);

        if (!item.vendorsById[vendor.id]) {

          item.vendorsById[vendor.id] = vendor;
          item.vendors.push(vendor);
          item.vendorsNames.push(vendor.name);

        }

      }

      return itemVendor;

    }

    function _prepareUnits() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.units = __this.cakeUnits.getUnits();
        __this.unitsById = __this.cakeUnits.getUnitsCollection();
        __this.unitsByAbbr = _.object(_.pluck(__this.units, 'abbr'), __this.units);

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

    function _removeTempGLAccount() {

      var __this = _this;

      if (__this.glAccountsById[0]) {

        __this.glAccounts = _.filter(__this.glAccounts, function(glAccount) {
          return glAccount.id !== 0;
        });
        delete __this.glAccountsById[0];

      }

    }

    function _resetNewItemLocations() {

      var __this = _this;

      __this.newItem.locations = _.pluck(__this.activeLocations, 'id');

    }

    function _showToast(message) {

      var __this = _this;

      __this.$peachToast.show(message);

    }



    /** CONSTRUCTOR **/

    function _constructor($document, $filter, $location, $peachToast, $q, $timeout, cakeCommon, cakeCountGroups, cakeGLAccounts, cakeItems, cakeItemsDBItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeSharedData, cakeTypeaheadHelper, cakeUnits, cakeVendors, cakeVendorItems) {

      _this.$document = $document;
      _this.$filter = $filter;
      _this.$location = $location;
      _this.$peachToast = $peachToast;
      _this.$q = $q;
      _this.$timeout = $timeout;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeGLAccounts = cakeGLAccounts;
      _this.cakeItems = cakeItems;
      _this.cakeItemsDBItems = cakeItemsDBItems;
      _this.cakeItemLocations = cakeItemLocations;
      _this.cakeItemUnits = cakeItemUnits;
      _this.cakeItemUnitLocations = cakeItemUnitLocations;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeSharedData = cakeSharedData;
      _this.cakeTypeaheadHelper = cakeTypeaheadHelper;
      _this.cakeUnits = cakeUnits;
      _this.cakeVendors = cakeVendors;
      _this.cakeVendorItems = cakeVendorItems;

      _this.blockers = {
        api_processing  : false,
        saving          : false,
        table_updating  : false
      };

      _this.headerOptions = [
        {
          callback  : _this.openNewItemForm,
          label     : 'Add Item'
        }
      ];

      _this.bulkEdit = {
        is_enabled    : false,
        show_form     : false,
        form_data     : {},
        checked_items : []
      };

      _this.newItem = {
        show_form               : false,
        form_data               : {},
        locations               : [],
        typeahead               : {}
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
      _this.itemsRequestParams = {}; // all inv item requests params - find filter and pagination stuff
      _this.filters = {
        show_inactive_items : false,
        gl_account_id       : null,
        count_group_id      : null,
        location_id         : null,
        vendor_id           : null
      };
      _this.customFiltersApplied = false; // will be used if most recent results were filtered by user or not
      _this.searchParams = {searchQuery: ''}; // used to filter count groups table

      //*** Other scope variables ***//
      _this.accountLocations = []; // all account locations
      _this.activeLocations = []; // all locations activated for cake app
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditItems = false; // if user has permission to edit items
      _this.countGroups = []; // all available count groups array
      _this.countGroupsById = {}; // all available count groups collection - ids are keys
      _this.defaultCountGroup = null;
      _this.defaultGLAccount = null;
      _this.forms = {}; // will be used to keep handlers to dynamic page forms
      _this.glAccounts = []; // all available gl accounts array
      _this.glAccountsById = {}; // all available gl accounts collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.isSingleLocationAccount = true; // says if there's more than 1 location available on account - we eventually have to hide some areas
      _this.items = []; // all available inventory items array
      _this.itemsById = {}; // all available inventory items collection - ids are keys
      _this.itemLocations = []; // all available inventory items locations array
      _this.itemLocationsById = {}; // all available inventory items locations collection - ids are keys
      _this.itemVendors = []; // all available inventory items vendors array
      _this.itemVendorsById = {}; // all available inventory items vendors collection - ids are keys
      _this.units = []; // all available units array
      _this.unitsByAbbr = {}; // all availalble units collection - abbreviations are keys
      _this.unitsById = {}; // all available units collection - ids are keys
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc
      _this.vendors = []; // all available vendors array
      _this.vendorsById = {}; // all available vendors collection - ids are keys

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.blockers.api_processing = true;
      __this.blockers.table_updating = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations, gl accounts, count groups and common units
      __this.$q.all({
        is_account_admin    : __this.cakeCommon.isUserAccountAdmin(),
        account_locations   : __this.cakeSettings.getSettings('account_locations'),
        active_locations    : __this.cakeSettings.getSettings('active_locations'),
        can_edit_items      : __this.cakePermissions.userHasPermission('edit_items'),
        gl_accounts         : __this.cakeGLAccounts.loadGLAccounts(null, {sort: 'name'}),
        count_groups        : __this.cakeCountGroups.loadCountGroups(null, {sort: 'name'}),
        units               : __this.cakeUnits.loadUnits(null, {sort: 'name'}),
        vendors             : __this.cakeVendors.loadVendors(null, {sort: 'name'}),
        default_gl_account  : __this.cakeGLAccounts.getDefaultGLAccount(),
        default_count_group : __this.cakeCountGroups.getDefaultCountGroup()
      })
        .then(
          function(results) {

            __this.isAccountAdmin = results['is_account_admin'];

            __this.accountLocations = results['account_locations'];
            __this.isSingleLocationAccount = __this.accountLocations.length <= 1 ? true : false;

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.canEditItems = results['can_edit_items'];

            __this.defaultGLAccount = results['default_gl_account'];
            __this.defaultCountGroup = results['default_count_group'];

            // parse loaded gl accounts, count groups and common units
            __this.$q.all([
              _prepareGLAccounts(),
              _prepareCountGroups(),
              _prepareUnits(),
              _prepareVendors()
            ])
              .then(
                function() {

                  if (__this.cakeSharedData.getValue('items_search')) {

                    var pageSearch = __this.cakeSharedData.getValue('items_search');

                    if (pageSearch.count_group_id) {
                      __this.filters.count_group_id = pageSearch.count_group_id;
                    }

                    if (pageSearch.vendor_id) {
                      __this.filters.vendor_id = pageSearch.vendor_id;
                    }

                    __this.cakeSharedData.unsetValue('items_search');

                  }

                  _loadItemsTablePageData()
                    .then(
                      function() {

                        _checkInitialAction();

                      }
                    );

                }
              );

          },
          function(error) {

            __this.blockers.api_processing = false;
            __this.blockers.table_updating = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    _this.addNewItem = function() {

      var __this = _this;

      __this.blockers.api_processing = true;
      __this.blockers.saving = true;

      var successCallback = function() {

        __this.blockers.api_processing = false;
        __this.blockers.saving = false;
        __this.closeNewItemForm();

        _showToast('New item added!');

      };

      var errorCallback = function(error) {

        successCallback();
        __this.errorHandler(error);

      };

      _createNewItem(
        _.extend(
          {},
          __this.newItem.form_data,
          {
            name      : __this.newItem.typeahead.items_db_item ? __this.newItem.typeahead.items_db_item.name : __this.newItem.typeahead.search_text,
            locations : _.map(__this.newItem.locations, function(locationId) {return parseInt(locationId, 10);})
          }
        ),
        true
      )
        .then(
          function(newItem) {

            // if also vendor data was set, add new vendor item
            if (__this.newItem.form_data.new_vendor_id) {

              _createNewItemVendorHelper(newItem, _.map(__this.newItem.locations, function(locationId) {return parseInt(locationId, 10);}), successCallback, errorCallback);

            } else {

              successCallback();

            }

          },
          function(error) {

            __this.blockers.api_processing = false;
            __this.blockers.saving = false;

          }
        );

    }

    _this.autoCalculateConversionForNewVendorUnit = function() {

      var __this = _this;

      var selectedUnit = __this.unitsById[parseInt(__this.newItem.form_data.new_vendor_unit_id, 10)];
      var commonUnit = __this.unitsById[parseInt(__this.newItem.form_data.common_unit_id, 10)];
      var conversionValue = 1;
      var disableConversion = false;
      var label = '';

      // if selected unit and common unit are both weight or volume type, the conversion probably can be calculated automatically
      if (selectedUnit && commonUnit) {

        label = commonUnit.name + '(s) per ' + selectedUnit.name;

        if (selectedUnit.type !== 'each' && commonUnit.type !== 'each') {

          // if they are of the same type, use english/metric base comparison
          if (selectedUnit.type == commonUnit.type) {

            var base = "english_base";

            if (selectedUnit.is_metric) {

              base = "metric_base";

            }

            var a = Big(selectedUnit[base]);
            var b = Big(commonUnit[base]);
            conversionValue = __this.cakeCommon.parseCakeFloatValue(a.div(b));
            disableConversion = true;

            // if not, check if there is some vw conversion unit already in itemsDB
          } else {

            var existingWVConversionUnit = __this.newItem.form_data.items_db_units ? _.findWhere(__this.newItem.form_data.items_db_units.all_units, {type: selectedUnit.type, is_common_unit: false}) : null;

            // if conversion unit found, use it to calculate unit_quantity
            if (existingWVConversionUnit) {

              var base = "english_base";

              if (selectedUnit.is_metric) {

                base = "metric_base";

              }

              var a = Big(existingWVConversionUnit.items_db_item_unit.unit_id[base]);
              var b = Big(selectedUnit[base]);
              var c = Big(existingWVConversionUnit.items_db_item_unit.unit_quantity);
              conversionValue = __this.cakeCommon.parseCakeFloatValue(b.div(a).times(c));
              disableConversion = true;

            }

          }

        }

      }

      __this.newItem.form_data.new_vendor_unit_conversion = conversionValue;
      __this.newItem.form_data.new_vendor_disable_conversion = disableConversion;
      __this.newItem.form_data.new_vendor_conversion_label = label;

    }

    _this.bulkEditItemsCategoryCallback = function() {

      var __this = _this;

      var collection = [];
      var gl_account_id = parseInt(__this.bulkEdit.form_data.gl_account_id, 10);

      __this.blockers.api_processing = true;
      __this.blockers.table_updating = true;

      _.each(
        __this.bulkEdit.checked_items,
        function(checkedItem) {

          collection.push(
            {
              id            : checkedItem.id,
              gl_account_id : gl_account_id
            }
          );

          return;

        }
      );

      __this.cakeItems.bulkUpdateItems(collection)
        .then(
          function(response) {

            __this.bulkEdit.form_data.gl_account_id = null;

            _loadItemsTablePageData('Data updated!');

          },
          function(error) {

            __this.blockers.api_processing = false;
            __this.blockers.table_updating = false;
            __this.errorHandler(error);

          }
        );

    }

    _this.bulkEditItemsCountGroupCallback = function() {


      var __this = _this;

      var collection = [];
      var count_group_id = parseInt(__this.bulkEdit.form_data.count_group_id, 10);

      __this.blockers.api_processing = true;
      __this.blockers.table_updating = true;

      _.each(
        __this.bulkEdit.checked_items,
        function(checkedItem) {

          collection.push(
            {
              id              : checkedItem.id,
              count_group_id  : count_group_id
            }
          );

          return;

        }
      );

      __this.cakeItems.bulkUpdateItems(collection)
        .then(
          function(response) {

            __this.bulkEdit.form_data.count_group_id = null;

            _loadItemsTablePageData('Data updated!');

          },
          function(error) {

            __this.blockers.api_processing = false;
            __this.blockers.table_updating = false;
            __this.errorHandler(error);

          }
        );

    }

    _this.bulkEditItemsLocationsCallback = function(itemLocationsCollection) {

      var __this = _this;

      var itemsIds = _.uniq(_.pluck(itemLocationsCollection, 'inv_item_id'));
      var itemLocationsToRemove = [];
      var itemLocationsToCreate = [];
      var itemUnitLocationsToCreateByItemId = {};
      var itemUnitLocationsToRemoveItemIds = [];
      var itemUnitLocationsToRemoveLocationIds = [];

      __this.blockers.api_processing = true;
      __this.blockers.table_updating = true;

      _.each(
        itemLocationsCollection,
        function(itemLocation) {

          if (!itemLocation.id) {

            itemLocationsToCreate.push(_.omit(itemLocation, ['id', 'to_be_removed']));

            if (!itemUnitLocationsToCreateByItemId[itemLocation.inv_item_id]) {
              itemUnitLocationsToCreateByItemId[itemLocation.inv_item_id] = [];
            }

            itemUnitLocationsToCreateByItemId[itemLocation.inv_item_id].push(itemLocation.location_id);

          } else if (itemLocation.to_be_removed) {

            itemLocationsToRemove.push(itemLocation.id);

            itemUnitLocationsToRemoveItemIds.push(itemLocation.inv_item_id);
            itemUnitLocationsToRemoveLocationIds.push(itemLocation.location_id);

          }

          return;

        }
      );

      // load units of items we will be changing locations for - we will need this to update item unit locations later on
      // delete/create item locations
      __this.$q.all(
        [
          __this.cakeItemUnits.loadItemUnits(
            {
              'inv_item_id': itemsIds
            },
            null,
            true
          ),
          __this.cakeItemLocations.bulkCreateItemLocations(itemLocationsToCreate),
          __this.cakeItemLocations.bulkDeleteItemLocations(itemLocationsToRemove)
        ]
      )
        .then(
          function(results) {

            var newItemUnitLocationsCollection = [];
            var itemUnitsByItemId = _.groupBy(results[0]['results'], function(itemUnit) {
              return itemUnit.inv_item_id;
            });

            // for each item which had new location assigned, create item unit locations for all its units in all new assigned locations
            _.each(
              _.keys(itemUnitLocationsToCreateByItemId),
              function(itemId) {

                var itemUnits = itemUnitsByItemId[itemId];

                _.each(
                  itemUnits,
                  function(itemUnit) {

                    _.each(
                      itemUnitLocationsToCreateByItemId[itemId],
                      function(locationId) {

                        newItemUnitLocationsCollection.push(
                          {
                            inv_item_id       : itemId,
                            location_id       : locationId,
                            inv_item_unit_id  : itemUnit.id,
                            is_count_unit     : true
                          }
                        );

                        return;

                      }
                    );

                    return;

                  }
                );

                return;

              }
            );

            __this.$q.all(
              [
                __this.cakeItemUnitLocations.bulkCreateItemUnitLocations(newItemUnitLocationsCollection),
                __this.cakeItemUnitLocations.bulkDeleteItemUnitLocations(
                  {
                    location_ids  : _.uniq(itemUnitLocationsToRemoveLocationIds),
                    find          : {
                      'inv_item_id' : _.uniq(itemUnitLocationsToRemoveItemIds)
                    }
                  }
                )
              ]
            )
              .then(
                function(response) {

                  _loadItemsTablePageData('Data updated!');

                },
                function(error) {

                  __this.blockers.api_processing = false;
                  __this.blockers.table_updating = false;
                  __this.errorHandler(error);

                }
              );

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
        gl_account_id       : null,
        count_group_id      : null,
        location_id         : null,
        vendor_id           : null
      };

      // if filters were set by the user last time results were built, reload table with no filters
      // else - no need to reload
      if (__this.customFiltersApplied) {

        __this.filterTable();

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

    _this.closeNewItemForm = function() {

      var __this = _this;

      //get rid of temp gl account, which may be there left after previous typeahead
      _removeTempGLAccount();

      __this.newItem = {
        show_form               : false,
        form_data               : {},
        locations               : [],
        typeahead               : {}
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

      __this.onPaginationChangeCallback();

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.loadNewItemTypeaheadOptions = function() {

      var __this = _this;

      return _loadNewItemTypeaheadOptions();

    }

    _this.newItemFormTypeaheadSearchTextCallback = function() {

      var __this = _this;

      __this.forms.newItemForm.newItemName.$setValidity('unique', true);

      if (__this.newItem.typeahead.search_text) {

        _resetNewItemLocations();
        __this.newItem.form_data.gl_account_id = __this.glAccounts.length > 1 ? null : __this.defaultGLAccount.id;
        __this.newItem.form_data.count_group_id = __this.defaultCountGroup.id;

        _loadNewItemTypeaheadOptionsValidationPromise(
          __this.newItem.typeahead.search_text
        )
          .then(
            function(response) {

              if (response.results.length > 0) {

                __this.forms.newItemForm.newItemName.$setValidity('unique', false);

              }

            }
          );

      } else {

        __this.newItem.locations = [];
        __this.newItem.form_data.gl_account_id = null;
        __this.newItem.form_data.count_group_id = null;

      }

    }

    _this.newItemFormTypeaheadSelectedItemCallback = function() {

      var __this = _this;

      __this.resetNewItemVendorData();

      if (__this.newItem.typeahead.items_db_item) {

        __this.blockers.api_processing = true;

        __this.cakeItemsDBItems.getItemsDBItemGLAccountFromCategoryId(__this.newItem.typeahead.items_db_item.category_id)
          .then(
            function(foundGLAccount) {

              // if new gl account needs to be created (user has permissions), then add temp gl account to cache - will be replaced with real one after creating item
              if (foundGLAccount.id == 0) {
                __this.glAccounts.push(foundGLAccount);
                __this.glAccountsById[0] = foundGLAccount;
              }

              _resetNewItemLocations(); // by default every new item will have all locations selected
              __this.newItem.form_data.gl_account_id = foundGLAccount.id;
              __this.newItem.form_data.count_group_id = __this.defaultCountGroup.id;
              __this.newItem.form_data.items_db_id = __this.newItem.typeahead.items_db_item.id;
              __this.newItem.form_data.items_db_units = {
                common_unit: null,
                all_units: []
              };

              __this.cakeItemsDBItems.getItemsDBItemUnits(__this.newItem.typeahead.items_db_item.id)
                .then(
                  function(itemsDBItemUnits) {

                    _.each(
                      itemsDBItemUnits.results,
                      function(itemsDBItemUnit) {

                        var foundCakeUnit = angular.copy(__this.unitsByAbbr[itemsDBItemUnit.unit_id.abbr]);

                        if (foundCakeUnit) {

                          foundCakeUnit.items_db_item_unit = itemsDBItemUnit;
                          foundCakeUnit.is_common_unit = false;

                          if (itemsDBItemUnit.common_unit_id.id === itemsDBItemUnit.unit_id.id) {

                            foundCakeUnit.is_common_unit = true;
                            __this.newItem.form_data.items_db_units.common_unit = foundCakeUnit;

                          }

                          __this.newItem.form_data.items_db_units.all_units.push(foundCakeUnit);

                        }

                        return;

                      }
                    );

                    __this.newItem.form_data.common_unit_id =  __this.newItem.form_data.items_db_units.common_unit ? __this.newItem.form_data.items_db_units.common_unit.id : null;

                    __this.blockers.api_processing = false;

                  },
                  function(error) {

                    __this.blockers.api_processing = false;

                  }
                );

            },
            function(error) {

              __this.blockers.api_processing = false;

            }
          );

      } else {

        _removeTempGLAccount();

        if (__this.newItem.typeahead.search_text) {

          _resetNewItemLocations();
          __this.newItem.form_data.gl_account_id = __this.glAccounts.length > 1 ? null : __this.defaultGLAccount.id;
          __this.newItem.form_data.count_group_id = __this.defaultCountGroup.id;

        } else {

          __this.newItem.locations = [];
          __this.newItem.form_data.gl_account_id = null;
          __this.newItem.form_data.count_group_id = null;

        }

        __this.newItem.form_data.items_db_id = null;
        __this.newItem.form_data.common_unit_id = null;
        __this.newItem.form_data.items_db_units = {
          common_unit: null,
          all_units: []
        };

      }

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

      _loadItemsTablePageData();

    }

    _this.onSearchPhraseUpdateCallback = function() {

      var __this = _this;

      __this.filterTable();

    }

    _this.openAddActiveLocationModal = function() {

      var __this = _this;

      __this.$location.path('/settings/add_active_location');

    }

    _this.openBulkEdit = function() {

      var __this = _this;

      __this.closeNewItemForm();

      __this.bulkEdit.is_enabled = true;
      __this.bulkEdit.show_form = true;

    }

    _this.openEditItemModal = function(itemId) {

      var __this = _this;

      __this.$location.path('/settings/edit_item').search({id: itemId});

    }

    _this.openItemsDBSearchModal = function(itemId) {

      var __this = _this;

      __this.$location.path('/settings/bulk_add_items');

    }

    _this.openNewItemForm = function() {

      var __this = _this;

      __this.closeBulkEdit();

      __this.newItem.form_data.is_active = true; // by default every new item will be active
      __this.newItem.show_form = true;

    }

    _this.resetNewItemVendorData = function() {

      var __this = _this;

      __this.newItem.form_data.new_vendor_id = null;
      __this.newItem.form_data.new_vendor_unit_id = null;
      __this.newItem.form_data.new_vendor_unit_conversion = null;
      __this.newItem.form_data.new_vendor_last_price = null;
      __this.newItem.form_data.new_vendor_disable_conversion = false;
      __this.newItem.form_data.new_vendor_conversion_label = '';

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }

    _this.toggleInactiveItems = function() {

      var __this = _this;

      __this.filters.show_inactive_items = !__this.filters.show_inactive_items;

      __this.filterTable();

    };
  }
}

ItemsController.$inject = ['$document', '$filter', '$location', '$peachToast', '$q',
                           '$timeout', 'commonService', 'countGroupsService', 'glAccountsService',
                           'itemsService', 'itemsDBItemsService', 'itemLocationsService',
                           'itemUnitsService', 'itemUnitLocationsService', 'permissionsService',
                           'settingsService', 'sharedDataService', 'typeaheadHelperService',
                           'unitsService', 'vendorsService', 'vendorItemsService'];

export default ItemsController;
