
class EditInvoiceController {
  constructor($filter, $location, $mdDialog, $peach, $q, $scope, $timeout, cakeCommon, cakeEvents, cakeGLAccounts, cakeInvoices, cakeInvoiceGLAccounts, cakeInvoiceItems, cakeItems, cakeItemLocations, cakeItemUnits, cakePermissions, cakeSettings, cakeUnits, cakeVendors, cakeVendorItems, cakeVendorLocations) {
    /** Edit invoice page - modal
     * This one is used to create and edit invoices
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

    var lastUpdateCheckerTimeoutInterval = 60000;
    var lastUpdateCheckerTimeout = null



    /** PRIVATE FUNCTIONS (non-scope functions) **/

    function _loadEditedInvoiceItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$q.all(
          [
            __this.cakeVendorItems.loadVendorItems(
              {
                'vendor_id': __this.editedInvoice.data.vendor_id
              }
            ),
            __this.cakeInvoiceItems.loadInvoiceItems(
              {
                '$and' : [
                  {
                    'vendor_id': __this.editedInvoice.data.vendor_id
                  },
                  {
                    'location_id': __this.editedInvoice.data.location_id
                  },
                  {
                    'invoice_id': __this.editedInvoice.data.id
                  }
                ]
              },
              {
                'sort'  : '-updated_at'
              }
            ),
            __this.cakeInvoiceGLAccounts.loadInvoiceGLAccounts(
              {
                '$and' : [
                  {
                    'vendor_id': __this.editedInvoice.data.vendor_id
                  },
                  {
                    'location_id': __this.editedInvoice.data.location_id
                  },
                  {
                    'invoice_id': __this.editedInvoice.data.id
                  }
                ]
              },
              {
                'sort'  : '-updated_at'
              }
            )
          ]
        )
          .then(
            function(response) {

              __this.vendorItems = __this.cakeVendorItems.getVendorItems();
              __this.vendorItemsById = __this.cakeVendorItems.getVendorItemsCollection();
              __this.invoiceItems = __this.cakeInvoiceItems.getInvoiceItems();
              __this.invoiceItemsById = __this.cakeInvoiceItems.getInvoiceItemsCollection();
              __this.invoiceGLAccounts = __this.cakeInvoiceGLAccounts.getInvoiceGLAccounts();
              __this.invoiceGLAccountsById = __this.cakeInvoiceGLAccounts.getInvoiceGLAccountsCollection();

              var filteredVendorItemIds = _.uniq(_.pluck(__this.vendorItems, 'inv_item_id'));

              __this.cakeItemLocations.loadItemLocations(
                {
                  '$and' : [
                    {
                      'location_id': __this.editedInvoice.data.location_id
                    },
                    {
                      'inv_item_id' : filteredVendorItemIds.length > 0 ? filteredVendorItemIds : 0
                    }
                  ]
                }
              )
                .then(
                  function(response) {

                    var filteredVendorLocationItemIds = _.uniq(_.pluck(response.results, 'inv_item_id'));
                    // if some items were added to invoice before, but later they were removed from location invoice was created for, display them despite this
                    var filteredExistingIvoiceItemsIds = _.uniq(_.pluck(__this.invoiceItems, 'inv_item_id'));
                    /*var filteredItemsIdsToLoad = _.union(filteredVendorLocationItemIds, filteredExistingIvoiceItemsIds);*/


                    __this.cakeItems.loadItems(
                      {
                        '$or' : [
                          {   
                            '$and' : [
                              {
                                'id' : filteredVendorLocationItemIds.length > 0 ? filteredVendorLocationItemIds : 0
                              },
                              {
                                'is_active' : true
                              }
                            ]
                          },
                          {
                            'id' : filteredExistingIvoiceItemsIds.length > 0 ? filteredExistingIvoiceItemsIds : 0
                          }
                        ]
                        /*'id' : filteredItemsIdsToLoad.length > 0 ? filteredItemsIdsToLoad : 0*/
                      }
                    )
                      .then(
                        function(response) {

                          __this.items = __this.cakeItems.getItems();
                          __this.itemsById = __this.cakeItems.getItemsCollection();

                          var filteredItemsIds = _.uniq(_.pluck(__this.items, 'id'));

                          __this.cakeItemUnits.loadItemUnits(
                            {
                              'inv_item_id' : filteredItemsIds.length > 0 ? filteredItemsIds : 0
                            }
                          )
                            .then(
                              function(response) {

                                __this.itemUnitsbyId = __this.cakeItemUnits.getItemUnitsCollection();

                                _prepareInvoiceItems()
                                  .then(
                                    function() {

                                      _prepareInvoiceGLAccounts()
                                        .then(
                                          function() {

                                            _updateCategoryCost();

                                            var recentItem = null;

                                            if (__this.invoiceItems.length > 0 && __this.invoiceGLAccounts.length > 0) {

                                              if (moment(__this.invoiceItems[0]['updated_at'], moment.ISO_8601).diff(moment(__this.invoiceGLAccounts[0]['updated_at'], moment.ISO_8601), 'seconds') > 0) {

                                                recentItem = __this.invoiceItems[0];

                                              } else {

                                                recentItem = __this.invoiceGLAccounts[0];

                                              }

                                            } else if (__this.invoiceItems.length == 0) {

                                              recentItem = __this.invoiceGLAccounts[0];

                                            } else {

                                              recentItem = __this.invoiceItems[0];

                                            }

                                            if (!recentItem || moment(recentItem.updated_at, moment.ISO_8601).diff(moment(__this.editedInvoice.data.updated_at, moment.ISO_8601), 'seconds') < 0) {

                                              recentItem = __this.editedInvoice.data;

                                            }

                                            _updateTimestamp(recentItem);

                                            resolve(true);

                                          }
                                        );
                                    }
                                  ); 

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

    function _prepareGLAccounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var glAccounts = [];
        var glAccountsById = __this.cakeGLAccounts.getGLAccountsCollection();

        _.each(
          __this.cakeGLAccounts.getGLAccounts(),
          function(glAccount) {

            glAccount.total_price_value = 0;
            glAccount.total_price_value_formatted = '0.00';
            glAccount.invoice_item_ids = [];
            glAccount.parent = glAccount.parent_id ? glAccountsById[glAccount.parent_id] : null;

            glAccounts.push(glAccount);

            return;

          }
        );

        __this.glAccounts = _sortGLAccounts(glAccounts);
        __this.glAccountsById = _.object(_.pluck(__this.glAccounts, 'id'), __this.glAccounts);

        resolve(true);

      });

    }

    function _sortGLAccounts(glAccounts) {

      var __this = _this;

      var glAccountsArray = __this.$filter('orderBy')(glAccounts, ['number', 'name']);
      var initialProcessing = _sortGLAccountsByParentIdHelper(glAccountsArray);
      var finalProcessing = [];

      traverseTree(initialProcessing['root'], 0);

      function traverseTree(array, level) {
        for (var j=0; j < array.length; j++) {
          array[j].depth = level;
          finalProcessing.push(array[j]);
          if (!_.isUndefined(initialProcessing[array[j].id])) {
            traverseTree(initialProcessing[array[j].id], level+1);
          }
        }
      }

      return finalProcessing;

    }

    function _sortGLAccountsByParentIdHelper(glAccountsArray) {

      var __this = _this;

      var sortedAccounts = {
        root: []
      };

      for (var i=0; i < glAccountsArray.length; i++) {
        if (!_.isNull(glAccountsArray[i].parent_id)) {
          sortedAccounts[glAccountsArray[i].parent_id] = sortedAccounts[glAccountsArray[i].parent_id] || [];
          sortedAccounts[glAccountsArray[i].parent_id].push(glAccountsArray[i]);
        } else {
          sortedAccounts['root'].push(glAccountsArray[i]);
        }
      }

      return sortedAccounts;

    }

    function _prepareInvoiceGLAccounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var parsedData = [];

        _.each(
          __this.invoiceGLAccounts,
          function(invoiceGLAccount) {

            parsedData.push(_prepareInvoiceGLAccount(invoiceGLAccount));

            return;

          }
        );

        parsedData = __this.$filter('orderBy')(parsedData, ['gl_account_name', 'new_description_value']);
        parsedData.push({id: 0}); // add this as a placeholder for new entries;
        __this.editedInvoice.misc_data.items_data = parsedData;
        __this.editedInvoice.misc_data.items_data_by_id = _.object(_.pluck(parsedData, 'id'), parsedData);

        resolve(true);

      });

    }

    function _prepareInvoiceGLAccount(invoiceGLAccount) {

      var __this = _this;

      var parsedInvoiceGLAccount = angular.copy(invoiceGLAccount);
      var glAccount = __this.glAccountsById[invoiceGLAccount.gl_account_id];

      parsedInvoiceGLAccount.new_gl_account_id = invoiceGLAccount.gl_account_id;
      parsedInvoiceGLAccount.gl_account_name = glAccount ? glAccount.name : 'Unknown';
      parsedInvoiceGLAccount.amount_value = __this.cakeCommon.parseCakeFloatValue(invoiceGLAccount.amount, null);
      parsedInvoiceGLAccount.new_amount_value = parsedInvoiceGLAccount.amount_value;
      parsedInvoiceGLAccount.new_description_value = invoiceGLAccount.description;
      parsedInvoiceGLAccount.item_object = invoiceGLAccount;

      return parsedInvoiceGLAccount;

    }

    function _prepareInvoiceItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var parsedData = [];
        var parsedGroupedData = {};

        if (__this.items.length > 0) {

          _.each(
            __this.items,
            function(item) {

              item.category = __this.glAccountsById[item.gl_account_id];

              if (item.category) {

                item.category_id = item.category.id;
                item.category_name = item.category.name;
                item.displayed = false; // if item should be displayd - when it has vendor items in given location
                item.counted = false; // if item should be displayed in completed invoice - if it has any items with invoice data filled in

                item.vendor_items_data = [];
                item.counted_vendor_items_data = [];

                _.each(
                  __this.vendorItems,
                  function(vendorItem) {

                    if (vendorItem.inv_item_id == item.id) {

                      var itemUnit = __this.itemUnitsbyId[vendorItem.inv_item_unit_id];
                      var unit = itemUnit ? __this.unitsById[itemUnit.unit_id] : null;
                      var commonUnit = itemUnit ? __this.unitsById[itemUnit.common_unit_id] : null;
                      var invoiceItem = itemUnit ? _.findWhere(__this.invoiceItems, {inv_item_id: item.id, vendor_inventory_item_id: vendorItem.id}) : null;
                      var lastPrice = __this.cakeCommon.parseCakeFloatValue(vendorItem.last_price, null);

                      vendorItem.item = item;
                      vendorItem.name = item.name;
                      vendorItem.quantity_label = vendorItem.pack_size ? vendorItem.pack_size : (unit ? (unit.name + (itemUnit.description ? ' (' + itemUnit.description + ')' : '')) : '');

                      if (invoiceItem) {

                        vendorItem.quantity_value = __this.cakeCommon.parseCakeFloatValue(invoiceItem.quantity, null);
                        vendorItem.new_quantity_value = angular.copy(vendorItem.quantity_value);
                        vendorItem.unit_price_value = __this.cakeCommon.parseCakeFloatValue(invoiceItem.unit_price, null);
                        vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
                        vendorItem.extended_price_value = __this.cakeCommon.parseCakeFloatValue(invoiceItem.extended_price, null);
                        vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);
                        vendorItem.invoice_object = invoiceItem;
                        item.category.invoice_item_ids.push(invoiceItem.id);
                        vendorItem.counted = true;//vendorItem.new_extended_price_value > 0 ? true : false;
                        item.counted = true;//vendorItem.counted ? true : item.counted;

                      } else {

                        vendorItem.quantity_value = null;
                        vendorItem.new_quantity_value = null;
                        vendorItem.unit_price_value = null;
                        vendorItem.new_unit_price_value = lastPrice;
                        vendorItem.extended_price_value = null;
                        vendorItem.new_extended_price_value = null;
                        vendorItem.invoice_object = null;
                        vendorItem.counted = false;

                      }

                      item.vendor_items_data.push(vendorItem);
                      item.displayed = true;

                      __this.editedInvoice.misc_data.opened_by_default = false;

                    }

                    return;

                  }
                );
                
              }

              if (item.displayed) {

                parsedData.push(item);

              }

              return;

            }
          );

          //sort items!
          parsedData = __this.$filter('orderBy')(parsedData, ['category_name', 'name']);

          _.each(
            parsedData,
            function(parsedItem) {

              parsedItem.vendor_items_data = __this.$filter('orderBy')(parsedItem.vendor_items_data, ['number', 'name']);
              parsedItem.counted_vendor_items_data = __this.$filter('filter')(parsedItem.vendor_items_data, {counted: true});


              if (parsedGroupedData[parsedItem.category_name]) {

                parsedGroupedData[parsedItem.category_name]['items'].push(parsedItem);

                if (parsedItem.counted) {

                  parsedGroupedData[parsedItem.category_name]['counted_items'].push(parsedItem);

                }

              } else {

                parsedGroupedData[parsedItem.category_name] = {
                  items: [],
                  counted_items: [],
                  category: parsedItem.category
                };

                parsedGroupedData[parsedItem.category_name]['items'].push(parsedItem);

                if (parsedItem.counted) {

                  parsedGroupedData[parsedItem.category_name]['counted_items'].push(parsedItem);

                }

              }

              return;

            }
          );

          __this.editedInvoice.items_data = parsedGroupedData;

          resolve(true);

        } else {

          __this.editedInvoice.items_data = {};

          resolve(true);

        }

      });

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

    function _prepareVendors(locationId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var locationVendorIds = _.uniq(_.pluck(_.where(__this.cakeVendorLocations.getVendorLocations(), {location_id: locationId}), 'vendor_id'));

        __this.availableVendors = [];
        __this.vendors = __this.cakeVendors.getVendors();
        __this.vendorsById = __this.cakeVendors.getVendorsCollection();

        _.each(
          __this.vendors,
          function(vendor) {

            if (locationVendorIds.indexOf(vendor.id) >= 0) {

              __this.availableVendors.push(vendor);

            }

            return;

          }
        );

        resolve(true);

      });

    }

    function _setLocationChangeWatcher() {

      var __this = _this;

      // watch for location changes - if location changes here, immediately go back to counts page
      __this.$peach.event.subscribe(__this.$peach.event.events.LOCATION_CHANGE, function(id) {

        __this.goBack();

      });
      
    }

    function _updateCategoryCost(glAccount, updateInvoiceCost) {

      var __this = _this;

      var forceUpdateInvoiceCost = _.isUndefined(updateInvoiceCost) ? true : updateInvoiceCost;
      var total_price_value = Big(0);

      if (glAccount) {

        _.each(
          glAccount.invoice_item_ids,
          function(invoiceItemId) {

            if (__this.invoiceItemsById[invoiceItemId]) {

              total_price_value = total_price_value.plus(Big(__this.invoiceItemsById[invoiceItemId]['extended_price']));

            }

            return;

          }
        );

        glAccount.total_price_value = __this.cakeCommon.parseCakeFloatValue(total_price_value);
        glAccount.total_price_value_formatted = __this.cakeCommon.parseCakeCostFloatValue(total_price_value, '0.00', 2);

        if (forceUpdateInvoiceCost) {

          _updateInvoiceCost();

        }

        return;

      } else {

        _.each(
          __this.glAccounts,
          function(glAccount) {

            _updateCategoryCost(glAccount, false);
            return;

          }
        );

        _updateMiscCost(false);

        _updateInvoiceCost();

        return;

      }

    }

    function _updateInvoiceCost() {

      var __this = _this;

      // calculate invoice total immediately out of the sections totals, but also load it from database - we will have total updated immediately and evetually corrected with database value in a second or two
      var total_price_value = Big(0);

      _.each(
        __this.glAccounts,
        function(glAccount) {

          total_price_value = total_price_value.plus(Big(glAccount.total_price_value));

          return;

        }
      );

      total_price_value = total_price_value.plus(Big(__this.editedInvoice.misc_data.total_price_value));

      // display calculated value
      __this.editedInvoice.total_price_value = __this.cakeCommon.parseCakeFloatValue(total_price_value);
      __this.editedInvoice.total_price_value_formatted = __this.cakeCommon.parseCakeCostFloatValue(total_price_value, '0.00', 2);

      
      /* turned off updating total from database, because this get is often faster that calculations in triggers, and this often causes incorrect old value being displayed in total
      // triggers update this value automatically, so refresh value from database and update after loading
      __this.cakeInvoices.loadInvoices(__this.editedInvoice.data.id, null, true)
      .then(
      function(result) {

      __this.editedInvoice.data.total = parseFloat(Big(result.total).toFixed(5));
      __this.editedInvoice.form_data.total = angular.copy(__this.editedInvoice.data.total);
      __this.editedInvoice.total_price_value = angular.copy(__this.editedInvoice.data.total);

      },
      function(error) {

      __this.errorHandler(error);

      }
      );*/

      /*if (__this.editedInvoice.total_price_value !== parseFloat(__this.editedInvoice.data.total)) {

        __this.editedInvoice.data.total = angular.copy(__this.editedInvoice.total_price_value);
        __this.editedInvoice.form_data.total = angular.copy(__this.editedInvoice.data.total);

        __this.cakeInvoices.updateInvoice(
        {
        id                : __this.editedInvoice.data.id,
        total             : __this.editedInvoice.form_data.total
        }
        )
        .then(
        function() {

        // do nothing

        },
        function(error) {

        __this.errorHandler(error);

        }
        );

        }*/

    }

    function _updateMiscCost(updateInvoiceCost) {

      var __this = _this;

      var forceUpdateInvoiceCost = _.isUndefined(updateInvoiceCost) ? true : updateInvoiceCost;
      var total_price_value = Big(0);

      _.each(
        __this.editedInvoice.misc_data.items_data,
        function(invoiceGLAccount) {

          total_price_value = invoiceGLAccount.amount_value ? total_price_value.plus(Big(invoiceGLAccount.amount_value)) : total_price_value;

          return;

        }
      );

      __this.editedInvoice.misc_data.total_price_value = __this.cakeCommon.parseCakeFloatValue(total_price_value);
      __this.editedInvoice.misc_data.total_price_value_formatted = __this.cakeCommon.parseCakeCostFloatValue(total_price_value, '0.00', 2);

      if (forceUpdateInvoiceCost) {

        _updateInvoiceCost();

      }

    }

    function _updateTimestamp(objectData, user) {

      var __this = _this;

      if (objectData && (objectData.updated_by || objectData.created_by)) {

        if (_.isObject(user)) {

          _updateTimestapHelper(objectData, user);

        } else {

          __this.$peach.account.getUsers(objectData.updated_by ? objectData.updated_by : objectData.created_by)
            .then(
              function(user) {

                _updateTimestapHelper(objectData, user);

              },
              function(error) {

                __this.editedInvoice.update_timestamp = '';

              }
            );

        }

      }

    }

    function _updateTimestapHelper(objectData, user) {

      var __this = _this;

      if (__this.editingPreviouslyCreatedInvoice) {

        __this.editedInvoice.update_timestamp = "Last Updated by " + user.first_name + " " + user.last_name + " on " + moment(objectData.updated_at, moment.ISO_8601).tz(__this.locationTime.timezone).format('llll') + ' ' + moment(objectData.updated_at, moment.ISO_8601).tz(__this.locationTime.timezone).zoneAbbr();;

      } else {

        __this.editedInvoice.update_timestamp = "Auto-Saved " + moment(objectData.updated_at, moment.ISO_8601).tz(__this.locationTime.timezone).fromNow() + " by " + user.first_name + " " + user.last_name;

        if (lastUpdateCheckerTimeout) {

          __this.$timeout.cancel(lastUpdateCheckerTimeout);
          lastUpdateCheckerTimeout = null;

        }

        lastUpdateCheckerTimeout = __this.$timeout(
          function() {

            _updateTimestamp(objectData, user);
            return;

          },
          lastUpdateCheckerTimeoutInterval
        );

        lastUpdateCheckerTimeout.then(function() {
          lastUpdateCheckerTimeout = null;
          return;
        });
        
      }

    } 



    /** CONSTRUCTOR **/

    function _constructor($filter, $location, $mdDialog, $peach, $q, $scope, $timeout, cakeCommon, cakeEvents, cakeGLAccounts, cakeInvoices, cakeInvoiceGLAccounts, cakeInvoiceItems, cakeItems, cakeItemLocations, cakeItemUnits, cakePermissions, cakeSettings, cakeUnits, cakeVendors, cakeVendorItems, cakeVendorLocations) {

      _this.$filter = $filter;
      _this.$location = $location;
      _this.$mdDialog = $mdDialog;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$scope = $scope;
      _this.$timeout = $timeout;
      _this.cakeCommon = cakeCommon;
      _this.cakeEvents = cakeEvents;
      _this.cakeGLAccounts = cakeGLAccounts;
      _this.cakeInvoices = cakeInvoices;
      _this.cakeInvoiceGLAccounts = cakeInvoiceGLAccounts;
      _this.cakeInvoiceItems = cakeInvoiceItems;
      _this.cakeItems = cakeItems;
      _this.cakeItemLocations = cakeItemLocations;
      _this.cakeItemUnits = cakeItemUnits;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeUnits = cakeUnits;
      _this.cakeVendors = cakeVendors;
      _this.cakeVendorItems = cakeVendorItems;
      _this.cakeVendorLocations = cakeVendorLocations;

      _this.blockers = {
        api_processing  : false,
        initializing    : true
      };

      _this.editedInvoice = {
        data                        : {},
        form_data                   : {},
        items_data                  : {},
        misc_data                   : {
          opened_by_default           : true,
          total_price_value           : 0,
          total_price_value_formatted : '0.00',
          items_data                  : [],
          items_data_by_id            : {}
        },
        was_complete                : false,
        update_timestamp            : '',
        total_price_value           : 0,
        total_price_value_formatted : '0.00'
      };

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.availableVendors = []; // all vendors availalbe in selected location array
      _this.cakeFloatPattern = cakeCommon.getCakeFloatRegex();
      _this.canEditInvoice = false; // if user has permission to edit invoices
      _this.editingPreviouslyCreatedInvoice = false; // will be used to update header/timestamp copy according to if the form opened previously created invoice or the new one
      _this.forms = {}; // will keep links to all dynamic page forms
      _this.glAccounts = []; // all available gl accounts array
      _this.glAccountsById = {}; // all available gl accounts collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.items = [];
      _this.itemsById = {};
      _this.itemUnitsbyId = {};
      _this.invoiceGLAccounts = [];
      _this.invoiceGLAccountsById = {};
      _this.invoiceItems = [];
      _this.invoiceItemsById = {};
      _this.locationTime = {utc_time_diff: 0, timezone: 'America/New_York'};
      _this.units = []; // all available units array
      _this.unitsByAbbr = {}; // all availalble units collection - abbreviations are keys
      _this.unitsById = {}; // all available units collection - ids are keys
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc
      _this.vendors = [];
      _this.vendorsById = {};
      _this.vendorItems = []; // all available vendors array
      _this.vendorItemsById = {}; // all available vendors collection - ids are keys

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      __this.$scope.$on("$destroy", function() {

        if (lastUpdateCheckerTimeout) {

          __this.$timeout.cancel(lastUpdateCheckerTimeout);
          lastUpdateCheckerTimeout = null;

        }

        return;

      });

      // load initial data - active locations and gl accounts/units
      __this.$q.all({
        is_account_admin      : __this.cakeCommon.isUserAccountAdmin(),
        active_locations      : __this.cakeSettings.getSettings('active_locations'),
        can_edit_invoices     : __this.cakePermissions.userHasPermission('edit_invoices'),
        current_utc_timestamp : __this.cakeSettings.refreshSettings('current_utc_timestamp')
      })
        .then(
          function(results) {

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditInvoice = results['can_edit_invoices'];

            // check if local time is set up correctly
            var realUTCTime = moment(results['current_utc_timestamp'], moment.ISO_8601).unix(); // real UTC unix timestamp, checked with server
            var localUTCTime = moment().utc().unix(); // UTC unix timestamp calculated with local settings
            var utcTimeDiff = realUTCTime - localUTCTime;
            // set utc offset value, allow to use local device setting if it's max 60 seconds different than real utc time from server
            __this.locationTime.utc_time_diff = Math.abs(utcTimeDiff) < 60 ? 0 : utcTimeDiff;

            var activeLocation = __this.$peach.session.getActiveLocation();

            if (!__this.activeLocationsById[activeLocation]) {

              _setLocationChangeWatcher();

              if (!activeLocation) {

                // <peach-location-alert></peach-location-alert> will show up
                /*__this.showMessage("Invoices can be different for each location. Please select a location from the drop down on the left.");*/

              } else {

                __this.showMessage("Selected location is not an active Cake location.");

              }
              
              __this.canEditInvoice = false;
              __this.blockers.initializing = false;

            } else {

              __this.locationTime.timezone = __this.activeLocationsById[activeLocation]['timezone'] ? __this.activeLocationsById[activeLocation]['timezone'] : __this.locationTime.timezone;

              __this.$q.all({
                gl_accounts           : __this.cakeGLAccounts.loadGLAccounts(null, {sort: 'name'}),
                vendors               : __this.cakeVendors.loadVendors({is_active: true}, {sort: 'name'}),
                vendor_locations      : __this.cakeVendorLocations.loadVendorLocations({location_id: activeLocation}),
                units                 : __this.cakeUnits.loadUnits(null, {sort: 'name'})
              })
                .then(
                  function() {

                    __this.$q.all([
                      _prepareGLAccounts(),
                      _prepareVendors(activeLocation),
                      _prepareUnits()
                    ])
                      .then(
                        function() {
                          
                          __this.editedInvoice.form_data.location_id = activeLocation;
                          __this.editedInvoice.form_data.invoice_date = __this.editedInvoice.form_data.receipt_date = moment().toDate();

                          // if id specified in url, try to find invoice to be edited
                          if (__this.$location.search()['id']) {

                            __this.cakeInvoices.loadInvoices(parseInt(__this.$location.search()['id'], 10))
                              .then(
                                function(response) {

                                  if (response.id) {

                                    var vendor = __this.vendorsById[response.vendor_id];

                                    if (vendor) {

                                      __this.editedInvoice.data = response;
                                      __this.editedInvoice.data.formatted_receipt_date = moment(__this.editedInvoice.data.receipt_date, 'YYYY-MM-DD').format('l');
                                      __this.editedInvoice.data.formatted_invoice_date = moment(__this.editedInvoice.data.invoice_date, 'YYYY-MM-DD').format('l');
                                      __this.editedInvoice.data.vendor = vendor;
                                      __this.editedInvoice.data.notes = null;
                                      __this.editedInvoice.form_data = angular.copy(__this.editedInvoice.data);
                                      __this.editedInvoice.form_data.receipt_date = moment(__this.editedInvoice.form_data.receipt_date, 'YYYY-MM-DD').toDate();
                                      __this.editedInvoice.form_data.invoice_date = moment(__this.editedInvoice.form_data.invoice_date, 'YYYY-MM-DD').toDate();
                                      __this.editedInvoice.was_complete = __this.editedInvoice.data.is_complete ? true : false;
                                      __this.editingPreviouslyCreatedInvoice = true;

                                      __this.$q.all(
                                        {
                                          'event'         : __this.cakeEvents.loadEvents(response.inv_event_id ? response.inv_event_id : 0),
                                          'invoice_items' : _loadEditedInvoiceItems()  
                                        }
                                      )
                                        .then(
                                          function(results) {
                                            
                                            _setLocationChangeWatcher();

                                            // if event for this invoice was loaded get notes from it, these will be editable on this page along with the invoice
                                            if (results['event']['id']) {

                                              __this.editedInvoice.data.notes = __this.editedInvoice.form_data.notes = results['event']['notes'];

                                            }

                                            __this.blockers.initializing = false;

                                          },
                                          function(error) {

                                            __this.canEditInvoice = false;
                                            __this.blockers.initializing = false;

                                            __this.errorHandler(error);

                                          }
                                        );

                                    } else {

                                      __this.canEditInvoice = false;
                                      __this.blockers.initializing = false;

                                      __this.errorHandler("Vendor for this invoice no longer exists");

                                    }

                                  } else {

                                    __this.canEditInvoice = false;
                                    __this.blockers.initializing = false;

                                    __this.errorHandler("Couldn't find an invoice with id: " + __this.$location.search()['id']);

                                  }

                                },
                                function(error) {

                                  __this.canEditInvoice = false;
                                  __this.blockers.initializing = false;
                                  
                                  __this.errorHandler(error);

                                }
                              );

                          } else {

                            _setLocationChangeWatcher();

                            __this.blockers.initializing = false;

                          }

                        }
                      );

                  },
                  function(error) {

                    __this.canEditInvoice = false;
                    __this.blockers.initializing = false;

                    __this.errorHandler(error);

                  }
                );

            }

          },
          function(error) {

            __this.canEditInvoice = false;
            __this.blockers.initializing = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    _this.closeModal = function() {

      var __this = _this;

      if (__this.editedInvoice.data.id && !__this.editedInvoice.data.is_complete) {

        __this.confirmSaveInvoice();

      } else {

        __this.goBack();

      }

    }

    _this.confirmDeleteInvoice = function(ev) {

      var __this = _this;

      var copy = "Are you sure you want to delete" + (__this.editedInvoice.data.is_complete ? " the Complete" : " the") + " Invoice for " + __this.editedInvoice.data.vendor.name + " on " + moment(__this.editedInvoice.form_data.receipt_date).format('l') + "?";

      __this.$mdDialog.show({
        disableParentScroll : true,
        hasBackdrop : true,
        template: '<md-dialog flex-sm="90" flex-md="55" flex-gt-md="35" flex-gt-lg="25">' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>' + copy + '<br /><br /></div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="cancel();" title="Cancel" aria-label="Cancel">' +
          '                 <span>CANCEL</span>' +
          '             </md-button>' +
          '             <md-button class="md-primary" ng-click="confirm();" title="Delete invoice" aria-label="Delete invoice">' +
          '                 <span>DELETE INVOICE</span>' +
          '             </md-button>' +
          '         </div>' +
          '     </p>' +
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {
          $scope.confirm = function() {
            __this.deleteInvoice();
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.hide();
          };
        }]
      });

    }

    _this.confirmSaveInvoice = function(ev) {

      var __this = _this;

      var copy = "You've chosen to save the Invoice for " + moment(__this.editedInvoice.form_data.receipt_date).format('l') + ". Do you want to mark this Invoice as Complete?<br /><br />Completed Invoice values will be calculated and will affect your item values."

      __this.$mdDialog.show({
        disableParentScroll : true,
        hasBackdrop : true,
        template: '<md-dialog flex-sm="90" flex-md="55" flex-gt-md="35" flex-gt-lg="25">' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>' + copy + '<br /><br /></div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="simpleSave();" title="NO, SAVE WITHOUT COMPLETING" aria-label="NO, SAVE WITHOUT COMPLETING">' +
          '                 <span>NO, SAVE WITHOUT COMPLETING</span>' +
          '             </md-button>' +
          '         </div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="completeSave();" title="YES, MARK INVOICE AS COMPLETE" aria-label="YES, MARK INVOICE AS COMPLETE">' +
          '                 <span>YES, MARK INVOICE AS COMPLETE</span>' +
          '             </md-button>' +
          '         </div>'+
          '     </p>' +
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {
          $scope.simpleSave = function() {
            __this.updateInvoice(false);
            $mdDialog.hide();
          };
          $scope.completeSave = function() {
            __this.updateInvoice(true);
            $mdDialog.hide();
          };
        }]
      });

    }

    _this.createInvoice = function() {

      var __this = _this;

      if (__this.canEditInvoice) {

        var newInvoiceData = {
          vendor_id         : parseInt(__this.editedInvoice.form_data.vendor_id, 10),
          receipt_date      : moment(__this.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD'),
          invoice_date      : moment(__this.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD'), // copy the same value to invoice date for new invoice
          is_complete       : false,
          total             : 0,
          invoice_number    : __this.editedInvoice.form_data.invoice_number,
          location_id       : __this.editedInvoice.form_data.location_id
        };

        __this.blockers.api_processing = true;

        __this.cakeInvoices.createInvoice(
          newInvoiceData
        )
          .then(
            function(response) {      

              __this.editedInvoice.data = response;
              __this.editedInvoice.data.formatted_receipt_date = moment(__this.editedInvoice.data.receipt_date, 'YYYY-MM-DD').format('l');
              __this.editedInvoice.data.formatted_invoice_date = moment(__this.editedInvoice.data.invoice_date, 'YYYY-MM-DD').format('l');
              __this.editedInvoice.data.vendor = __this.vendorsById[response.vendor_id];
              __this.editedInvoice.form_data = angular.copy(__this.editedInvoice.data);
              __this.editedInvoice.form_data.receipt_date = moment(__this.editedInvoice.form_data.receipt_date, 'YYYY-MM-DD').toDate();
              __this.editedInvoice.form_data.invoice_date = moment(__this.editedInvoice.form_data.invoice_date, 'YYYY-MM-DD').toDate();

              _loadEditedInvoiceItems()
                .then(
                  function() {

                    __this.blockers.api_processing = false;

                  },
                  function(error) {

                    __this.blockers.api_processing = false;

                    __this.errorHandler(error);

                  }
                );

            },
            function(error) {

              __this.blockers.api_processing = false;

              __this.errorHandler(error);

            }
          );

      }

    }

    _this.deleteInvoice = function() {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        __this.blockers.api_processing = true;

        __this.cakeInvoices.removeInvoice(__this.editedInvoice.data.id)
          .then(
            function() {

              __this.blockers.api_processing = false;

              __this.goBack();

            },
            function(error) {

              __this.blockers.api_processing = false;

              __this.errorHandler(error);

            }
          );

      }

    }

    _this.deleteInvoiceMiscItem = function(miscItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var miscItem = __this.editedInvoice.misc_data.items_data_by_id[miscItemId];

        if (miscItem && miscItem.id !== 0) {

          __this.blockers.api_processing = true;

          __this.cakeInvoiceGLAccounts.removeInvoiceGLAccount(miscItem.id)
            .then(
              function() {

                delete __this.invoiceGLAccountsById[miscItem.id];
                _.remove(__this.invoiceGLAccounts, function(item) {
                  return item.id === miscItem.id;
                });

                delete __this.editedInvoice.misc_data.items_data_by_id[miscItem.id];
                _.remove(__this.editedInvoice.misc_data.items_data, function(item) {
                  return item.id === miscItem.id;
                });

                _updateMiscCost();
                
                __this.blockers.api_processing = false;

              },
              function(error) {

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

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

    _this.goBack = function() {

      var __this = _this;

      __this.$location.path('/invoices').search('id', null);

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.saveInvoiceItemExtendedPrice = function(vendorItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var vendorItem = __this.vendorItemsById[vendorItemId];

        if (vendorItem && vendorItem.new_extended_price_value !== vendorItem.extended_price_value && vendorItem.new_quantity_value && vendorItem.invoice_object) {

          if (_.isNumber(vendorItem.new_extended_price_value)) {

            vendorItem.new_unit_price_value = vendorItem.new_quantity_value && vendorItem.new_extended_price_value ? __this.cakeCommon.parseCakeFloatValue(Big(vendorItem.new_extended_price_value).div(vendorItem.new_quantity_value)) : 0;

            /*if (vendorItem.invoice_object) {*/

            __this.blockers.api_processing = true;

            __this.cakeInvoiceItems.updateInvoiceItem(
              {
                id                : vendorItem.invoice_object.id,
                unit_price        : vendorItem.new_unit_price_value,
                extended_price    : vendorItem.new_extended_price_value
              }
            )
              .then(
                function(response) {

                  __this.invoiceItemsById[response.id] = response;

                  vendorItem.invoice_object = response;
                  vendorItem.unit_price_value = angular.copy(vendorItem.new_unit_price_value);
                  vendorItem.extended_price_value = angular.copy(vendorItem.new_extended_price_value);

                  _updateTimestamp(response);
                  _updateCategoryCost(vendorItem.item.category);

                  __this.blockers.api_processing = false;

                },
                function(error) {

                  // revert on error
                  vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
                  vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

                  __this.blockers.api_processing = false;

                  __this.errorHandler(error);

                }
              );

            /*} else {

              __this.cakeInvoiceItems.createInvoiceItem(
              {
              invoice_id                : __this.editedInvoice.data.id,
              vendor_id                 : __this.editedInvoice.data.vendor_id,
              vendor_inventory_item_id  : vendorItem.id,
              inv_item_id               : vendorItem.item.id,
              quantity                  : vendorItem.new_quantity_value ? vendorItem.new_quantity_value : 0,
              unit_price                : vendorItem.new_unit_price_value,
              extended_price            : vendorItem.new_extended_price_value,
              location_id               : __this.editedInvoice.data.location_id
              }
              )
              .then(
              function(response) {

              __this.invoiceItemsById[response.id] = response;
              __this.invoiceItems.push(response);

              vendorItem.invoice_object = response;
              vendorItem.unit_price_value = angular.copy(vendorItem.new_unit_price_value);
              vendorItem.extended_price_value = angular.copy(vendorItem.new_extended_price_value);
              vendorItem.item.category.invoice_item_ids.push(response.id);

              _updateTimestamp(response);
              _updateCategoryCost(vendorItem.item.category);

              __this.blockers.api_processing = false;

              },
              function(error) {

              // revert on error
              vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
              vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

              __this.errorHandler(error);
              __this.blockers.api_processing = false;

              }
              );

              }*/

            // else if total price was removed - also remove unit price
          } else if (vendorItem.invoice_object) {

            vendorItem.new_unit_price_value = 0;

            __this.blockers.api_processing = true;

            __this.cakeInvoiceItems.updateInvoiceItem(
              {
                id                : vendorItem.invoice_object.id,
                unit_price        : 0,
                extended_price    : 0
              }
            )
              .then(
                function(response) {

                  __this.invoiceItemsById[response.id] = response;

                  vendorItem.invoice_object = response;
                  vendorItem.new_extended_price_value = null;
                  vendorItem.extended_price_value = null;
                  vendorItem.unit_price_value = 0;

                  _updateTimestamp(response);
                  _updateCategoryCost(vendorItem.item.category);

                  __this.blockers.api_processing = false;

                },
                function(error) {

                  // revert on error
                  vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
                  vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

                  __this.blockers.api_processing = false;

                  __this.errorHandler(error);

                }
              );

          }

        }

      }

    } 

    _this.saveInvoiceItemPrice = function(vendorItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var vendorItem = __this.vendorItemsById[vendorItemId];

        if (vendorItem && vendorItem.new_unit_price_value !== vendorItem.unit_price_value && vendorItem.new_quantity_value && vendorItem.invoice_object) {

          if (_.isNumber(vendorItem.new_unit_price_value)) {

            vendorItem.new_extended_price_value = vendorItem.new_quantity_value && vendorItem.new_unit_price_value ? __this.cakeCommon.parseCakeFloatValue(Big(vendorItem.new_quantity_value).times(vendorItem.new_unit_price_value)) : 0;

            /*if (vendorItem.invoice_object) {*/

            __this.blockers.api_processing = true;

            __this.cakeInvoiceItems.updateInvoiceItem(
              {
                id                : vendorItem.invoice_object.id,
                unit_price        : vendorItem.new_unit_price_value,
                extended_price    : vendorItem.new_extended_price_value
              }
            )
              .then(
                function(response) {

                  __this.invoiceItemsById[response.id] = response;

                  vendorItem.invoice_object = response;
                  vendorItem.unit_price_value = angular.copy(vendorItem.new_unit_price_value);
                  vendorItem.extended_price_value = angular.copy(vendorItem.new_extended_price_value);

                  _updateTimestamp(response);
                  _updateCategoryCost(vendorItem.item.category);

                  __this.blockers.api_processing = false;

                },
                function(error) {

                  // revert on error
                  vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
                  vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

                  __this.blockers.api_processing = false;

                  __this.errorHandler(error);

                }
              );

            /*} else {

              __this.cakeInvoiceItems.createInvoiceItem(
              {
              invoice_id                : __this.editedInvoice.data.id,
              vendor_id                 : __this.editedInvoice.data.vendor_id,
              vendor_inventory_item_id  : vendorItem.id,
              inv_item_id               : vendorItem.item.id,
              quantity                  : vendorItem.new_quantity_value ? vendorItem.new_quantity_value : 0,
              unit_price                : vendorItem.new_unit_price_value,
              extended_price            : vendorItem.new_extended_price_value,
              location_id               : __this.editedInvoice.data.location_id
              }
              )
              .then(
              function(response) {

              __this.invoiceItemsById[response.id] = response;
              __this.invoiceItems.push(response);

              vendorItem.invoice_object = response;
              vendorItem.unit_price_value = angular.copy(vendorItem.new_unit_price_value);
              vendorItem.extended_price_value = angular.copy(vendorItem.new_extended_price_value);
              vendorItem.item.category.invoice_item_ids.push(response.id);

              _updateTimestamp(response);
              _updateCategoryCost(vendorItem.item.category);

              __this.blockers.api_processing = false;

              },
              function(error) {

              // revert on error
              vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
              vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

              __this.errorHandler(error);
              __this.blockers.api_processing = false;

              }
              );

              }*/

            // else if price was removed - also remove total
          } else if (vendorItem.invoice_object) {

            vendorItem.new_extended_price_value = 0;

            __this.blockers.api_processing = true;

            __this.cakeInvoiceItems.updateInvoiceItem(
              {
                id                : vendorItem.invoice_object.id,
                unit_price        : 0,
                extended_price    : 0
              }
            )
              .then(
                function(response) {

                  __this.invoiceItemsById[response.id] = response;

                  vendorItem.invoice_object = response;
                  vendorItem.new_unit_price_value = null;
                  vendorItem.unit_price_value = null;
                  vendorItem.extended_price_value = 0;

                  _updateTimestamp(response);
                  _updateCategoryCost(vendorItem.item.category);

                  __this.blockers.api_processing = false;

                },
                function(error) {

                  // revert on error
                  vendorItem.new_unit_price_value = angular.copy(vendorItem.unit_price_value);
                  vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

                  __this.blockers.api_processing = false;

                  __this.errorHandler(error);

                }
              );

          }

        }

      }

    } 

    _this.saveInvoiceItemQuantity = function(vendorItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var vendorItem = __this.vendorItemsById[vendorItemId];

        if (vendorItem && vendorItem.new_quantity_value !== vendorItem.quantity_value) {

          if (_.isNumber(vendorItem.new_quantity_value)) {

            vendorItem.new_extended_price_value = vendorItem.new_quantity_value && vendorItem.new_unit_price_value ? __this.cakeCommon.parseCakeFloatValue(Big(vendorItem.new_quantity_value).times(vendorItem.new_unit_price_value)) : 0;

            if (vendorItem.invoice_object) {

              __this.blockers.api_processing = true;

              __this.cakeInvoiceItems.updateInvoiceItem(
                {
                  id                : vendorItem.invoice_object.id,
                  quantity          : vendorItem.new_quantity_value,
                  extended_price    : vendorItem.new_extended_price_value
                }
              )
                .then(
                  function(response) {

                    __this.invoiceItemsById[response.id] = response;

                    vendorItem.invoice_object = response;
                    vendorItem.quantity_value = angular.copy(vendorItem.new_quantity_value);
                    vendorItem.extended_price_value = angular.copy(vendorItem.new_extended_price_value);

                    _updateTimestamp(response);
                    _updateCategoryCost(vendorItem.item.category);

                    __this.blockers.api_processing = false;

                  },
                  function(error) {

                    // revert on error
                    vendorItem.new_quantity_value = angular.copy(vendorItem.quantity_value);
                    vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

                    __this.blockers.api_processing = false;

                    __this.errorHandler(error);

                  }
                );

            } else {

              __this.blockers.api_processing = true;

              __this.cakeInvoiceItems.createInvoiceItem(
                {
                  invoice_id                : __this.editedInvoice.data.id,
                  vendor_id                 : __this.editedInvoice.data.vendor_id,
                  vendor_inventory_item_id  : vendorItem.id,
                  inv_item_id               : vendorItem.item.id,
                  quantity                  : vendorItem.new_quantity_value,
                  unit_price                : vendorItem.new_unit_price_value ? vendorItem.new_unit_price_value : 0,
                  extended_price            : vendorItem.new_extended_price_value,
                  location_id               : __this.editedInvoice.data.location_id
                }
              )
                .then(
                  function(response) {

                    __this.invoiceItemsById[response.id] = response;
                    __this.invoiceItems.push(response);

                    vendorItem.invoice_object = response;
                    vendorItem.quantity_value = angular.copy(vendorItem.new_quantity_value);
                    vendorItem.extended_price_value = angular.copy(vendorItem.new_extended_price_value);
                    vendorItem.item.category.invoice_item_ids.push(response.id);

                    _updateTimestamp(response);
                    _updateCategoryCost(vendorItem.item.category);

                    __this.blockers.api_processing = false;

                  },
                  function(error) {

                    // revert on error
                    vendorItem.new_quantity_value = angular.copy(vendorItem.quantity_value);
                    vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

                    __this.blockers.api_processing = false;

                    __this.errorHandler(error);

                  }
                );

            }

          } else if (vendorItem.invoice_object) {

            /*vendorItem.new_extended_price_value = 0;

              __this.cakeInvoiceItems.updateInvoiceItem(
              {
              id                : vendorItem.invoice_object.id,
              quantity          : 0,
              extended_price    : 0
              }
              )
              .then(
              function(response) {

              __this.invoiceItemsById[response.id] = response;

              vendorItem.invoice_object = response;
              vendorItem.new_quantity_value = null;
              vendorItem.quantity_value = null;
              vendorItem.extended_price_value = 0;

              _updateTimestamp(response);
              _updateCategoryCost(vendorItem.item.category);

              __this.blockers.api_processing = false;

              },
              function(error) {

              // revert on error
              vendorItem.new_quantity_value = angular.copy(vendorItem.quantity_value);
              vendorItem.new_extended_price_value = angular.copy(vendorItem.extended_price_value);

              __this.errorHandler(error);
              __this.blockers.api_processing = false;

              }
              );*/

            __this.blockers.api_processing = true;

            __this.cakeInvoiceItems.removeInvoiceItem(
              {
                id : vendorItem.invoice_object.id
              }
            )
              .then(
                function(response) {

                  // also remove from __this.invoiceItems array
                  delete __this.invoiceItemsById[vendorItem.invoice_object.id];
                  _.remove(__this.invoiceItems, function(item) {
                    return item.id === vendorItem.invoice_object.id;
                  });
                  vendorItem.item.category.invoice_item_ids = _.without(vendorItem.item.category.invoice_item_ids, vendorItem.invoice_object.id);

                  vendorItem.quantity_value = null;
                  vendorItem.new_quantity_value = null;
                  vendorItem.unit_price_value = null;
                  vendorItem.new_unit_price_value = null;
                  vendorItem.extended_price_value = null;
                  vendorItem.new_extended_price_value = null;
                  vendorItem.invoice_object = null;

                  _updateTimestamp(response);
                  _updateCategoryCost(vendorItem.item.category);

                  __this.blockers.api_processing = false;

                },
                function(error) {

                  // revert on error
                  vendorItem.new_quantity_value = angular.copy(vendorItem.quantity_value);

                  __this.blockers.api_processing = false;

                  __this.errorHandler(error);

                }
              );

          }

        }

      }

    }

    _this.saveInvoiceMiscItemAmount = function(miscItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var miscItem = __this.editedInvoice.misc_data.items_data_by_id[miscItemId];

        if (miscItem && miscItem.id !== 0 && miscItem.new_amount_value !== miscItem.amount_value) {

          __this.blockers.api_processing = true;

          __this.cakeInvoiceGLAccounts.updateInvoiceGLAccount(
            {
              id                : miscItem.id,
              amount            : __this.cakeCommon.parseCakeFloatValue(miscItem.new_amount_value)
            }
          )
            .then(
              function(response) {

                __this.invoiceGLAccountsById[response.id] = response;

                miscItem.amount_value = miscItem.new_amount_value;

                _updateTimestamp(response);
                _updateMiscCost();

                __this.blockers.api_processing = false;

              },
              function(error) {

                miscItem.new_amount_value = miscItem.amount_value;

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

      }

    }

    _this.saveInvoiceMiscItemDescription = function(miscItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var miscItem = __this.editedInvoice.misc_data.items_data_by_id[miscItemId];

        if (miscItem && miscItem.id !== 0 && miscItem.new_description_value !== miscItem.description) {

          __this.blockers.api_processing = true;

          __this.cakeInvoiceGLAccounts.updateInvoiceGLAccount(
            {
              id                : miscItem.id,
              description       : miscItem.new_description_value
            }
          )
            .then(
              function(response) {

                __this.invoiceGLAccountsById[response.id] = response;

                miscItem.description = miscItem.new_description_value;

                _updateTimestamp(response);

                __this.blockers.api_processing = false;

              },
              function(error) {

                miscItem.new_description_value = miscItem.description;

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

      }

    }

    _this.saveInvoiceMiscItemGLAccount = function(miscItemId) {

      var __this = _this;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var miscItem = __this.editedInvoice.misc_data.items_data_by_id[miscItemId];

        if (miscItem && miscItem.id !== 0 && miscItem.new_gl_account_id && parseInt(miscItem.new_gl_account_id, 10) !== miscItem.gl_account_id) {

          miscItem.new_gl_account_id = parseInt(miscItem.new_gl_account_id, 10);

          __this.blockers.api_processing = true;

          __this.cakeInvoiceGLAccounts.updateInvoiceGLAccount(
            {
              id                : miscItem.id,
              gl_account_id     : miscItem.new_gl_account_id
            }
          )
            .then(
              function(response) {

                __this.invoiceGLAccountsById[response.id] = response;

                miscItem.gl_account_id = miscItem.new_gl_account_id;

                _updateTimestamp(response);

                __this.blockers.api_processing = false;

              },
              function(error) {

                miscItem.new_gl_account_id = miscItem.gl_account_id;

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        } else if (miscItem && miscItem.id == 0 && miscItem.new_gl_account_id) {

          miscItem.new_gl_account_id = parseInt(miscItem.new_gl_account_id, 10);

          __this.blockers.api_processing = true;

          __this.cakeInvoiceGLAccounts.createInvoiceGLAccount(
            {
              invoice_id        : __this.editedInvoice.data.id,
              vendor_id         : __this.editedInvoice.data.vendor_id,
              gl_account_id     : miscItem.new_gl_account_id,
              description       : miscItem.new_description_value,
              amount            : miscItem.new_amount_value ? miscItem.new_amount_value : 0,
              location_id       : __this.editedInvoice.data.location_id
            }
          )
            .then(
              function(response) {

                __this.invoiceGLAccounts.push(response);
                __this.invoiceGLAccountsById[response.id] = response;

                delete __this.editedInvoice.misc_data.items_data_by_id[0];
                _.remove(__this.editedInvoice.misc_data.items_data, function(item) {
                  return item.id === 0;
                });

                miscItem = _prepareInvoiceGLAccount(response);

                __this.editedInvoice.misc_data.items_data.push(miscItem);
                __this.editedInvoice.misc_data.items_data_by_id[miscItem.id] = miscItem;

                var newPlaceholder = {id: 0};
                __this.editedInvoice.misc_data.items_data.push(newPlaceholder);
                __this.editedInvoice.misc_data.items_data_by_id[newPlaceholder.id] = newPlaceholder;

                _updateTimestamp(miscItem);

                __this.blockers.api_processing = false;

              },
              function(error) {

                miscItem.new_gl_account_id = miscItem.gl_account_id;

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

      }

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }

    _this.toggleInvoiceIsComplete = function() {

      var __this = _this;

      if (__this.canEditInvoice) {

        if (__this.editedInvoice.form_data.is_complete) {

          __this.updateInvoice(true);

          // if unchecked - uncheck in database and update view - make everything editable
        } else {

          __this.blockers.api_processing = true;

          __this.cakeInvoices.updateInvoice(
            {
              id          : __this.editedInvoice.data.id,
              is_complete : false
            }
          )
            .then(
              function(response) {

                _updateTimestamp(response);

                __this.editedInvoice.data.is_complete = false;
                __this.editedInvoice.form_data.is_complete = false;

                __this.blockers.api_processing = false;

              },
              function(error) {

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

      }

    }

    _this.updateInvoice = function(markComplete) {

      var __this = _this;

      markComplete = markComplete || false;

      if (__this.canEditInvoice && __this.editedInvoice.data.id) {

        var updateInvoiceData = {
          id                : __this.editedInvoice.data.id,
          receipt_date      : moment(__this.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD'),
          invoice_date      : moment(__this.editedInvoice.form_data.invoice_date).format('YYYY-MM-DD'),
          invoice_number    : __this.editedInvoice.form_data.invoice_number,
          notes             : __this.editedInvoice.form_data.notes
        };

        var errorHandler = function(error) {

          __this.blockers.api_processing = false;

          __this.errorHandler(error);

        };
        var successHandler = function(response) {

          __this.blockers.api_processing = false;

          __this.goBack();

        };

        if (markComplete) {

          updateInvoiceData.is_complete = true;

        }

        __this.blockers.api_processing = true;

        __this.cakeInvoices.updateInvoice(
          updateInvoiceData
        )
          .then(
            function(response) {

              _updateTimestamp(response);

              if (markComplete) {

                /*_runInvoiceTask()
                  .then(
                  successHandler,
                  errorHandler
                  );*/

                successHandler(response);

              } else {

                successHandler(response);

              }

            },
            errorHandler
          );

      }

    }
  }
}

EditInvoiceController.$inject = ['$filter', '$location', '$mdDialog', '$peach', '$q',
                                 '$scope', '$timeout', 'commonService', 'eventsService',
                                 'glAccountsService', 'invoicesService', 'invoiceGLAccountsService',
                                 'invoiceItemsService', 'itemsService', 'itemLocationsService',
                                 'itemUnitsService', 'permissionsService', 'settingsService',
                                 'unitsService', 'vendorsService', 'vendorItemsService',
                                 'vendorLocationsService'];

export default EditInvoiceController;
