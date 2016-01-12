
class EditCountController {
  constructor($filter, $location, $mdDialog, $peach, $q, $scope, $timeout, cakeCommon, cakeCountGroups, cakeCounts, cakeCountItems, cakeGLAccounts, cakeInvoices, cakeItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeUnits, cakeVendorItems, cakeVendorLocations) {
    /** Edit count settings modal page
     * Allows one to edit count and create new ones
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

    var dataValidationWatcher = null;
    var taskProcessingTimeoutInterval = 5000;
    var taskProcessingTimeout = null;
    var lastUpdateCheckerTimeoutInterval = 60000;
    var lastUpdateCheckerTimeout = null
    var taskProcessingPopup = null;



    /** PRIVATE FUNCTIONS (non-scope functions) **/

    function _checkCountingTaskStatus() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        return _checkCountingTaskStatusHelper(resolve, reject);

      });

    }

    function _checkCountingTaskStatusHelper(resolve, reject) {

      var __this = _this;

      if (__this.editedCount.data.task_id) {

        __this.taskQueueResource.find(__this.editedCount.data.task_id)
          .then(
            function(result) {

              switch(result.status) {

              case 'job queued':
              case 'job processing':
                _showPageBlockingPopup(resolve, reject);
                break;

              case 'job completed':
                _hidePageBlockingPopup(resolve, reject);
                break;

              case 'job failed':
                reject(result);
                break

              default:
                break;

              }

            },
            function(error){

              // task was done some time ago and the queue key is no longer available
              if (error.error.status == 404) {

                _hidePageBlockingPopup(resolve, reject);

              } else {

                reject(error);

              }

            }
          );

      } else {

        resolve(true);

      }

    }

    function _convertCountValueFromCommonToItemUnit(value, itemUnit) {

      return Big(value).div(Big(itemUnit.unit_quantity));

    }

    function _convertCountValueFromItemUnitToCommon(value, itemUnit) {
      if (!_.isUndefined(value) && !_.isNull(value)) {
        return Big(value).times(Big(itemUnit.unit_quantity));
      } else {
        return Big(0);
      }
    }

    function _hidePageBlockingPopup(resolve, reject) {

      var __this = _this;

      if (taskProcessingPopup) {

        __this.$mdDialog.hide();
        taskProcessingPopup = null;

      }

      if (taskProcessingTimeout) {

        __this.$timeout.cancel(taskProcessingTimeout);
        taskProcessingTimeout = null;

      }

      // hiding popup means task did it's work, we no longer need to check the status - we can remove the id
      __this.cakeCounts.updateCount(
        {
          id        : __this.editedCount.data.id,
          task_id   : null
        }
      )
        .then(
          function() {

            resolve(true);

          },
          function(error) {

            reject(error);

          }
        );

    }

    function _loadAndParseAvailableCountGroupsCounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$q.all(
          [
            __this.cakeCounts.loadCounts(
              {
                '$and' : [
                  {
                    location_id : __this.editedCount.form_data.location_id
                  },
                  {
                    count_group_id : _.pluck(__this.countGroups, 'id')
                  }
                ]
              }
            ),
            __this.cakeCounts.loadOpeningCounts(
              {
                '$and' : [
                  {
                    location_id : __this.editedCount.form_data.location_id
                  },
                  {
                    count_group_id : _.pluck(__this.countGroups, 'id')
                  }
                ]
              }
            )
          ]
        )
          .then(
            function(results) {

              __this.counts = __this.cakeCounts.getCounts();
              __this.countsById = __this.cakeCounts.getCountsCollection();
              __this.openingCounts = __this.cakeCounts.getOpeningCounts();
              __this.openingCountsById = __this.cakeCounts.getOpeningCountsCollection();
              __this.openingCountsByCountGroupId = _.groupBy(__this.openingCounts, function(openingCount) { return openingCount.count_group_id });

              _.each(
                __this.counts,
                function(count) {

                  __this.countGroupsById[count.count_group_id]['counts'].push(count);
                  __this.countGroupsById[count.count_group_id]['disabled_dates'].push(moment(count.date, 'YYYY-MM-DD').format('YYYY-MM-DD'));

                  return;

                }
              );

              resolve(true);

            },
            function(error) {

              reject(error);

            }
          );

      });

    }

    function _getAffectedCounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var orderedCountGroupCounts = __this.$filter('orderBy')(__this.countGroupsById[__this.editedCount.data.count_group_id]['counts'], 'date');
        var index = _.findIndex(orderedCountGroupCounts, {id: __this.editedCount.data.id});

        resolve({number: orderedCountGroupCounts.length - (index + 1)});

      });

    }

    function _loadEditedCountItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$q.all(
          [
            __this.cakeItemLocations.loadItemLocations(
              {
                'location_id': __this.editedCount.data.location_id
              }
            ),
            __this.cakeVendorLocations.loadVendorLocations(
              {
                'location_id': __this.editedCount.data.location_id
              }
            ),
            __this.cakeCountItems.loadCountItems(
              {
                '$and': [
                  {
                    'inv_count_id' : __this.editedCount.data.id
                  },
                  {
                    'location_id' : __this.editedCount.data.location_id
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
            function(results) {

              var filteredItemLocationsItemIds = _.uniq(_.pluck(__this.cakeItemLocations.getItemLocations(), 'inv_item_id'));
              var filteredCountItemsItemIds = _.uniq(_.pluck(__this.cakeCountItems.getCountItems(), 'inv_item_id'));

              // we load all items which are in selected count location and count group OR which already have some count items filled in (even if they are no longer in this location/count group - they were added to count before, so we keep them)
              __this.cakeItems.loadItems(
                {
                  '$or' : [
                    {   
                      '$and' : [
                        {
                          'id' : filteredItemLocationsItemIds.length > 0 ? filteredItemLocationsItemIds : 0
                        },
                        {
                          'count_group_id' : __this.editedCount.data.count_group_id
                        },
                        {
                          'is_active' : true
                        }
                      ]
                    },
                    {
                      'id' : filteredCountItemsItemIds.length > 0 ? filteredCountItemsItemIds : 0
                    }
                  ]
                },
                {
                  'includes': 'wtm_invoice_items' // get invoice items for each of items on this count, to check if it was used in invoice, and if so, if the date of last invoice is older than date of the count
                }
              )
                .then(
                  function(response) {

                    var filteredItemsIds = _.uniq(_.pluck(response.results, 'id'));
                    var filteredItemsInvoiceItemsIds = _.uniq(_.pluck(_.flatten(_.compact(_.pluck(_.pluck(response.results, 'wtm_invoice_items'), 'results'))), 'invoice_id'));
                    var filteredVendorIds = _.uniq(_.pluck(__this.cakeVendorLocations.getVendorLocations(), 'vendor_id'));

                    __this.$q.all(
                      [
                        __this.cakeItemUnits.loadItemUnits(
                          {
                            'inv_item_id' : filteredItemsIds.length > 0 ? filteredItemsIds : 0
                          }
                        ),
                        __this.cakeVendorItems.loadVendorItems(
                          {
                            '$and' : [
                              {
                                'inv_item_id' : filteredItemsIds.length > 0 ? filteredItemsIds : 0
                              },
                              {
                                'vendor_id' : filteredVendorIds.length > 0 ? filteredVendorIds : 0
                              }
                            ]
                          },
                          {
                            'sort' : '-created_at'
                          }
                        ),
                        __this.cakeInvoices.loadInvoices(
                          {
                            '$and' : [
                              {
                                'id' : filteredItemsInvoiceItemsIds.length > 0 ? filteredItemsInvoiceItemsIds : 0
                              },
                              {
                                'location_id' : __this.editedCount.data.location_id
                              }
                            ]
                          }
                        )
                      ]
                    )
                      .then(
                        function(response) {

                          var filteredItemUnitsIds = _.uniq(_.pluck(response[0]['results'], 'id'));

                          __this.cakeItemUnitLocations.loadItemUnitLocations(
                            {
                              '$and': [
                                {
                                  'inv_item_unit_id' : filteredItemUnitsIds.length > 0 ? filteredItemUnitsIds : 0
                                },
                                {
                                  'location_id' : __this.editedCount.data.location_id
                                },
                                {
                                  'is_count_unit' : true
                                }
                              ]
                            }
                          )
                            .then(
                              function(response) {

                                _prepareCountItems()
                                  .then(
                                    function() {

                                      var recentItem = __this.cakeCountItems.getCountItems()[0];

                                      if (!recentItem || moment(recentItem.updated_at, moment.ISO_8601).diff(moment(__this.editedCount.data.updated_at, moment.ISO_8601), 'seconds') < 0) {

                                        recentItem = __this.editedCount.data;

                                      }

                                      _updateTimestamp(recentItem);

                                      resolve(true);

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

    function _performScopeAdditionalOps() {

      var __this = _this;

      dataValidationWatcher = __this.$scope.$watch('vm.editedCount.form_data.date', function(oldval, newval) {

        __this.validateDate('countForm');
        __this.validateDate('editCountForm');

      });

      __this.$scope.$on("$destroy", function() {

        dataValidationWatcher();

        if (taskProcessingTimeout) {

          __this.$timeout.cancel(taskProcessingTimeout);
          taskProcessingTimeout = null;

        }

        if (lastUpdateCheckerTimeout) {

          __this.$timeout.cancel(lastUpdateCheckerTimeout);
          lastUpdateCheckerTimeout = null;

        }

        return;

      });

    }

    function _prepareCountGroups() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _.each(
          __this.cakeCountGroups.getCountGroups(),
          function(countGroup) {

            countGroup.counts = [];
            countGroup.disabled_dates = [];

            __this.countGroups.push(countGroup);
            __this.countGroupsById[countGroup.id] = countGroup;

            return;

          }
        )

          resolve(true);

      });

    }

    function _prepareCountItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var parsedData = [];
        var parsedGroupedData = {};
        var vendorItemsByItemId = {};
        var invoicesAfterEditedCount = {}; //we will keep invoices which are there in db related with all the edited count items and have date following (after) edited count date

        __this.items = __this.cakeItems.getItems();
        __this.itemsById = __this.cakeItems.getItemsCollection();

        if (__this.items.length > 0) {

          __this.itemUnitsById = __this.cakeItemUnits.getItemUnitsCollection();
          var cachedCountItems = __this.cakeCountItems.getCountItems();

          _.each(
            __this.cakeItemLocations.getItemLocations(),
            function(itemLocation) {

              if (__this.itemsById[itemLocation.inv_item_id]) {

                __this.itemsById[itemLocation.inv_item_id]['item_location'] = itemLocation;

              }

              return;

            }
          );

          _.each(
            __this.cakeInvoices.getInvoices(),
            function(invoice) {

              if (
                invoice.receipt_date === __this.editedCount.data.date &&
                  moment(invoice.created_at, moment.ISO_8601).diff(moment(__this.editedCount.data.created_at, moment.ISO_8601), 'seconds') > 0 ) {

                invoicesAfterEditedCount[invoice.id] = invoice;

              } else if (moment(invoice.receipt_date, 'YYYY-MM-DD').diff(moment(__this.editedCount.data.date, 'YYYY-MM-DD')) > 0 ) {

                invoicesAfterEditedCount[invoice.id] = invoice;

              }

              return;

            }
          );

          _.each(
            __this.cakeVendorItems.getVendorItems(),
            function(vendorItem) {

              vendorItem.last_price = __this.cakeCommon.parseCakeFloatValue(vendorItem.last_price);

              // we're only interested in vendor items with last price set
              if (vendorItem.last_price > 0) {

                if (vendorItemsByItemId[vendorItem.inv_item_id]) {

                  vendorItemsByItemId[vendorItem.inv_item_id].push(vendorItem);

                } else {

                  vendorItemsByItemId[vendorItem.inv_item_id] = [];
                  vendorItemsByItemId[vendorItem.inv_item_id].push(vendorItem);

                } 

              }

              return;

            }
          );

          _.each(
            __this.items,
            function(item) {

              if (item.item_location) {

                item.starting_cost = __this.cakeCommon.parseCakeFloatValue(item.item_location.starting_cost);

              } else {

                item.starting_cost = 0;

              }

              item.category = __this.glAccountsById[item.gl_account_id];
              item.category_id = item.category.id;
              item.category_name = item.category.name;
              item.counted = false; // this says if item was counted already before in current count = if it has related count item entry in database
              item.display = false; // this says if item should even be there in the form - if it has any units we can display

              item.last_cost_updateable = true; //by default true, but last cost cannot be updated if item was added to invoice which has date following (after) edited count date

              // loop through invoice items 
              if (item.wtm_invoice_items && item.wtm_invoice_items.results) {

                _.each(
                  item.wtm_invoice_items.results,
                  function(invoiceItem) {

                    if (invoicesAfterEditedCount[invoiceItem.invoice_id]) {

                      item.last_cost_updateable = false;
                      return false; // break immediately
                      
                    }

                    return;

                  }
                );

              }

              // cost is eventually updateable for all items if they are still in count location, if item was removed from location after it was added to count, keep quantyity editable, but not cost
              // depending on if item is still available in location, cost is editable always on starting count and on regular counts if item was not counted before (has empty opening_count_date)
              item.starting_cost_updateable = item.item_location ? ((__this.editedCount.is_opening_count) ? true : (item.item_location.opening_count_date ? false : true)) : false;
              item.save_starting_cost_along_with_quantity = false; // usually starting cost will save only when it's input loses focus, but in some specific situations we may need to save it immediately after quantity is given

              item.units_data = [];

              // go through all item units
              _.each(
                __this.cakeItemUnits.getItemUnits(),
                function(itemUnit) {

                  // parse item unit if it belongs to item we're currently focusing on
                  if (itemUnit.inv_item_id == item.id) {

                    var countItem = _.findWhere(cachedCountItems, {inv_item_id: item.id, inv_item_unit_id: itemUnit.id}); // find related count item
                    var itemUnitLocation = _.findWhere(__this.cakeItemUnitLocations.getItemUnitLocations(), {inv_item_id: item.id, inv_item_unit_id: itemUnit.id}); // find related item unit location

                    // parse item unit for item we're currently focusing on only if it was assigned to current count location as count unit OR there's already some count item created for it (it was created before and later on item was removed from location or item unit was uchecked as count unit)
                    if (countItem || itemUnitLocation) {

                      var unit = __this.unitsById[itemUnit.unit_id];
                      var commonUnit = __this.unitsById[itemUnit.common_unit_id];

                      itemUnit.count_label = (unit ? unit.name : '[deleted unit]') + (itemUnit.description ? ' (' + itemUnit.description + ')' : '');
                      itemUnit.cost_label = 'per ' + (unit ? unit.name : '[deleted unit]');
                      //itemUnit.cost_value = item.starting_cost == 0 ? null : __this.cakeCommon.parseCakeFloatValue(Big(item.starting_cost).times(itemUnit.unit_quantity));
                      //itemUnit.new_cost_value = itemUnit.cost_value;

                      itemUnit.item = item;

                      if (countItem) {

                        itemUnit.cost_value = item.starting_cost == 0 ? null : __this.cakeCommon.parseCakeFloatValue(Big(item.starting_cost).times(itemUnit.unit_quantity));
                        itemUnit.new_cost_value = itemUnit.cost_value;

                        itemUnit.quantity_value = __this.cakeCommon.parseCakeFloatValue(countItem.quantity);
                        itemUnit.new_quantity_value = angular.copy(itemUnit.quantity_value);
                        itemUnit.count_object = countItem;
                        item.counted = true;

                      } else {

                        // if this is starting count and we don't have yet filled in this item unit qty/cost AND there are already some vendor items which we can use to get starting cost different than 0
                        //if (__this.editedCount.is_opening_count && item.starting_cost == 0 && vendorItemsByItemId[item.id]) {
                        if (item.starting_cost == 0 && vendorItemsByItemId[item.id]) {

                          var mostRecentVendorItem = vendorItemsByItemId[item.id][0];
                          var vendorItemUnit = __this.itemUnitsById[mostRecentVendorItem.inv_item_unit_id];

                          itemUnit.cost_value = null;
                          itemUnit.new_cost_value = vendorItemUnit ? __this.cakeCommon.parseCakeFloatValue(Big(mostRecentVendorItem.last_price).div(vendorItemUnit.unit_quantity).times(itemUnit.unit_quantity)) : itemUnit.cost_value;

                          // additionally, in this very specific case we want the starting cost taken from vendor item to save immediately after quantity is given - unlike in other cases when starting cost updates when user really puts some or changes the starting cost value
                          itemUnit.item.save_starting_cost_along_with_quantity = true;

                        } else {

                          itemUnit.cost_value = item.starting_cost == 0 ? null : __this.cakeCommon.parseCakeFloatValue(Big(item.starting_cost).times(itemUnit.unit_quantity));
                          itemUnit.new_cost_value = itemUnit.cost_value;

                        }

                        itemUnit.quantity_value = null;
                        itemUnit.new_quantity_value = null;
                        itemUnit.count_object = null;

                      }

                      item.units_data.push(itemUnit);
                      item.display = true;

                    }

                  }

                  return;

                }
              );

              if (item.display) {

                parsedData.push(item);

              }

              return;

            }
          );

          //sort!
          parsedData = __this.$filter('orderBy')(parsedData, ['category_name', 'name']);

          _.each(
            parsedData,
            function(parsedItem) {

              if (parsedGroupedData[parsedItem.category_name]) {

                parsedGroupedData[parsedItem.category_name]['items'].push(parsedItem);

                if (parsedItem.counted) {

                  parsedGroupedData[parsedItem.category_name]['counted_items'].push(parsedItem);

                }

              } else {

                parsedGroupedData[parsedItem.category_name] = {items: [], counted_items: []};
                parsedGroupedData[parsedItem.category_name]['items'].push(parsedItem);

                if (parsedItem.counted) {

                  parsedGroupedData[parsedItem.category_name]['counted_items'].push(parsedItem);

                }

              }

              return;

            }
          );

          __this.editedCount.items_data = parsedGroupedData;

          _updatePercentage()
            .then(
              resolve,
              reject
            );

        } else {

          __this.editedCount.items_data = {};

          resolve(true);

        }

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

    function _prepareUnits() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.units = __this.cakeUnits.getUnits();
        __this.unitsById = __this.cakeUnits.getUnitsCollection();
        __this.unitsByAbbr = _.object(_.pluck(__this.units, 'abbr'), __this.units);

        resolve(true);

      });

    }

    function _runCountTask() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.taskResource.create(
          {
            id        : __this.cakeCommon.getCountingTaskId(),
            task_data : JSON.stringify({count_id: __this.editedCount.data.id})
          }
        )
          .then(
            function(response) {

              __this.cakeCounts.updateCount(
                {
                  id        : __this.editedCount.data.id,
                  task_id   : response.taskId
                }
              )
                .then(
                  function() {

                    __this.editedCount.data.task_id = response.taskId;
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

    function _setEmptyCounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        // after count is set to be complete, we have to create count items for all units which were left without count, set value to 0
        var collection = [];

        _.each(
          __this.itemUnitsById,
          function(itemUnit) {

            if (!itemUnit.count_object && itemUnit.item) {

              collection.push(
                {
                  inv_count_id          : __this.editedCount.data.id,
                  inv_item_id           : itemUnit.item.id,
                  inv_item_unit_id      : itemUnit.id,
                  common_unit_id        : itemUnit.common_unit_id,
                  quantity              : 0,
                  common_unit_quantity  : 0,
                  location_id           : __this.editedCount.data.location_id
                }
              );

            }

            return;

          }
        );

        __this.$q.all(
          [
            __this.cakeCountItems.bulkCreateCountItems(
              collection
            )
          ]
        )
          .then(
            resolve,
            reject
          );

      });

    }

    function _setLocationChangeWatcher() {

      var __this = _this;

      // watch for location changes - if location changes here, immediately go back to counts page
      __this.$peach.event.subscribe(__this.$peach.event.events.LOCATION_CHANGE, function(id) {

        __this.goBack();

      });
      
    }

    function _showPageBlockingPopup(resolve, reject) {

      var __this = _this;

      if (!taskProcessingPopup) {

        taskProcessingPopup = __this.$mdDialog.show({
          escapeToClose : false,
          clickOutsideToClose : false,
          parent: angular.element(document.getElementsByClassName("peach-modal")),
          template: '<md-dialog flex-sm="90" flex-md="55" flex-gt-md="35" flex-gt-lg="25">' +
            '  <md-dialog-content>' +
            '     <p>'+
            '         <div layout="row" flex>Good job completing your count!<br /><br />Please wait while we process all the count values...<br /><br /><br /></div>' +
            '         <div layout="row" flex>' + 
            '             <cake-progress-linear style="width: 100%;"></cake-progress-linear>' +         
            '         </div>' +
            '     </p>' +
            '  </md-dialog-content>' +
            '</md-dialog>'
        });

      }

      if (taskProcessingTimeout) {

        __this.$timeout.cancel(taskProcessingTimeout);
        taskProcessingTimeout = null;

      }

      taskProcessingTimeout = __this.$timeout(
        function() {

          _checkCountingTaskStatusHelper(resolve, reject);
          return;

        },
        taskProcessingTimeoutInterval
      );

      taskProcessingTimeout.then(function() {
        taskProcessingTimeout = null;
        return;
      });

    }

    function _updatePercentage() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var totalItems = Big(0);
        var countedItems = Big(0);

        _.each(
          __this.items,
          function(item) {

            if (item.display) {

              totalItems = totalItems.plus(1);

              if (item.counted) {

                countedItems = countedItems.plus(1);

              }

            }

            return;

          }
        );

        var updatedPercentage = totalItems.eq(0) ? 0 : parseInt(countedItems.div(totalItems).times(100).round());

        if (updatedPercentage !== __this.editedCount.percentage) {

          __this.editedCount.percentage = updatedPercentage;

          __this.cakeCounts.updateCount(
            {
              id                : __this.editedCount.data.id,
              percent_complete  : __this.editedCount.percentage
            }
          )
            .then(
              function() {

                resolve(true);

              },
              function(error) {

                __this.errorHandler(error);
                resolve(true); // resolve anyways...

              }
            );

        } else {

          resolve(true);

        }

      });

    }

    function _updateTimestamp(response, user) {

      var __this = _this;

      if (response && (response.updated_by || response.created_by)) {

        if (_.isObject(user)) {

          _updateTimestapHelper(response, user);

        } else {

          __this.$peach.account.getUsers(response.updated_by ? response.updated_by : response.created_by)
            .then(
              function(user) {

                _updateTimestapHelper(response, user);

              },
              function(error) {

                __this.editedCount.update_timestamp = '';

              }
            );

        }

      }

    }

    function _updateTimestapHelper(response, user) {

      var __this = _this;

      if (__this.editingPreviouslyCreatedCount) {

        __this.editedCount.update_timestamp = "Last Updated by " + user.first_name + " " + user.last_name + " on " + moment(response.updated_at, moment.ISO_8601).tz(__this.locationTime.timezone).format('llll') + ' ' + moment(response.updated_at, moment.ISO_8601).tz(__this.locationTime.timezone).zoneAbbr();

      } else {

        __this.editedCount.update_timestamp = "Auto-Saved " + moment(response.updated_at, moment.ISO_8601).tz(__this.locationTime.timezone).fromNow() + " by " + user.first_name + " " + user.last_name;

        if (lastUpdateCheckerTimeout) {

          __this.$timeout.cancel(lastUpdateCheckerTimeout);
          lastUpdateCheckerTimeout = null;

        }

        lastUpdateCheckerTimeout = __this.$timeout(
          function() {

            _updateTimestamp(response, user);
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

    function _constructor($filter, $location, $mdDialog, $peach, $q, $scope, $timeout, cakeCommon, cakeCountGroups, cakeCounts, cakeCountItems, cakeGLAccounts, cakeInvoices, cakeItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeUnits, cakeVendorItems, cakeVendorLocations) {

      _this.$filter = $filter;
      _this.$location = $location;
      _this.$mdDialog = $mdDialog;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$scope = $scope;
      _this.$timeout = $timeout;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeCounts = cakeCounts;
      _this.cakeCountItems = cakeCountItems;
      _this.cakeGLAccounts = cakeGLAccounts;
      _this.cakeInvoices = cakeInvoices;
      _this.cakeItems = cakeItems;
      _this.cakeItemLocations = cakeItemLocations;
      _this.cakeItemUnits = cakeItemUnits;
      _this.cakeItemUnitLocations = cakeItemUnitLocations;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeUnits = cakeUnits;
      _this.cakeVendorItems = cakeVendorItems;
      _this.cakeVendorLocations = cakeVendorLocations;
      _this.taskResource = _this.$peach.api('tasks/run');
      _this.taskQueueResource = _this.$peach.api('queue_status');

      _this.blockers = {
        api_processing  : false,
        initializing    : true
      };

      _this.editedCount = {
        data              : {},
        form_data         : {},
        items_data        : {},
        is_opening_count  : false,
        parent_group      : {},
        percentage        : 0,
        was_complete      : false,
        update_timestamp  : ''
      };

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.cakeFloatPattern = cakeCommon.getCakeFloatRegex();
      _this.canEditCount = false; // if user has permission to edit count groups
      _this.countGroups = []; // all available count groups array
      _this.countGroupsById = {}; // all available count groups collection - ids are keys
      _this.counts = []; // all available counts array
      _this.countsById = {}; // all available counts collection - ids are keys
      _this.editingPreviouslyCreatedCount = false; // will be used to update header/timestamp copy according to if the form opened previously created count or the new one
      _this.forms = {}; // will keep links to all dynamic page forms
      _this.glAccounts = []; // all available gl accounts array
      _this.glAccountsById = {}; // all available gl accounts collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.items = [];
      _this.itemsById = {};
      _this.itemUnitsById = {};
      _this.locationTime = {utc_time_diff: 0, timezone: 'America/New_York'};
      _this.openingCounts = []; // opening counts array - from wtm_inv_opening_counts table
      _this.openingCountsById = {}; // opening counts collection - ids are keys - from wtm_inv_opening_counts table
      _this.openingCountsByCountGroupId = {};
      _this.units = []; // all available units array
      _this.unitsByAbbr = {}; // all availalble units collection - abbreviations are keys
      _this.unitsById = {}; // all available units collection - ids are keys
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      // add additional scope watchers
      _performScopeAdditionalOps();

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations and count groups
      __this.$q.all({
        is_account_admin      : __this.cakeCommon.isUserAccountAdmin(),
        active_locations      : __this.cakeSettings.getSettings('active_locations'),
        can_edit_counts       : __this.cakePermissions.userHasPermission('edit_counts'),
        current_utc_timestamp : __this.cakeSettings.refreshSettings('current_utc_timestamp')
      })
        .then(
          function(results) {

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditCount = results['can_edit_counts'];

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
                /*__this.showMessage("Counts can be different for each location. Please select a location from the drop down on the left.");*/

              } else {

                __this.showMessage("Selected location is not an active Cake location.");

              }

              __this.canEditCount = false;
              __this.blockers.initializing = false;

            } else {

              __this.locationTime.timezone = __this.activeLocationsById[activeLocation]['timezone'] ? __this.activeLocationsById[activeLocation]['timezone'] : __this.locationTime.timezone;

              __this.$q.all({
                count_groups          : __this.cakeCountGroups.loadCountGroups(null, {sort: 'name'}),
                gl_accounts           : __this.cakeGLAccounts.loadGLAccounts(null, {sort: 'name'}),
                units                 : __this.cakeUnits.loadUnits(null, {sort: 'name'})
              })
                .then(
                  function() {

                    __this.$q.all([
                      _prepareCountGroups(),
                      _prepareGLAccounts(),
                      _prepareUnits()
                    ])
                      .then(
                        function() {

                          __this.editedCount.form_data.location_id = activeLocation;

                          if (__this.countGroups.length > 0) {

                            _loadAndParseAvailableCountGroupsCounts()
                              .then(
                                function() {

                                  // if id specified in url, try to find count to be edited
                                  if (__this.$location.search()['id']) {

                                    var foundCount = _.findWhere(
                                      __this.counts,
                                      {
                                        id: parseInt(__this.$location.search()['id'])
                                      }
                                    );

                                    if (foundCount) {

                                      __this.editedCount.data = foundCount;
                                      __this.editedCount.data.formatted_date = moment(__this.editedCount.data.date, 'YYYY-MM-DD').format('l');
                                      __this.editedCount.form_data = angular.copy(__this.editedCount.data);
                                      __this.editedCount.form_data.date = moment(__this.editedCount.form_data.date, 'YYYY-MM-DD').toDate();
                                      __this.editedCount.percentage = parseInt(Big(__this.editedCount.data.percent_complete ? __this.editedCount.data.percent_complete : 0).round());
                                      __this.editedCount.parent_group = __this.countGroupsById[__this.editedCount.data.count_group_id];
                                      __this.editedCount.was_complete = __this.editedCount.data.is_complete ? true : false;
                                      __this.editingPreviouslyCreatedCount = true;

                                      // if there is opening count for the same count group and the date is exactly like the one of the loaded count, its the opening count
                                      // eventually if there still wasnt anything saved as opening count for the same count group - treat the current one as the opening one (just a fallback)
                                      if (__this.openingCountsByCountGroupId[__this.editedCount.data.count_group_id]) {

                                        // there should be always one opening count per count group and location, so we may assume the first one is the only one and is correct
                                        __this.editedCount.is_opening_count = (moment(__this.openingCountsByCountGroupId[__this.editedCount.data.count_group_id][0]['count_date'], 'YYYY-MM-DD').diff(moment(__this.editedCount.data.date, 'YYYY-MM-DD'), 'days') == 0) ? true : false;

                                      } else {

                                        __this.editedCount.is_opening_count = true;

                                      }

                                      _loadEditedCountItems()
                                        .then(
                                          function() {

                                            _setLocationChangeWatcher();

                                            _checkCountingTaskStatus()
                                              .then(
                                                function() {

                                                  __this.blockers.initializing = false;
                                                  
                                                },
                                                function(error) {

                                                  __this.blockers.initializing = false;

                                                  __this.errorHandler({counting_task_error: error}, true);

                                                }
                                              );

                                          },
                                          function(error) {

                                            __this.canEditCount = false;
                                            __this.blockers.initializing = false;

                                            __this.errorHandler(error);

                                          }
                                        );

                                    } else {

                                      __this.canEditCount = false;
                                      __this.blockers.initializing = false;

                                      __this.errorHandler("Couldn't find a count with id: " + __this.$location.search()['id']);

                                    }

                                  } else {

                                    _setLocationChangeWatcher();

                                    __this.blockers.initializing = false;

                                    __this.hideMessage();

                                  }

                                },
                                function(error) {

                                  __this.canEditCount = false;
                                  __this.blockers.initializing = false;

                                  __this.errorHandler(error);

                                }
                              );

                          } else {

                            __this.canEditCount = false;
                            __this.blockers.initializing = false;

                            __this.showMessage("There are no active count groups you could create/edit count for.");

                          }

                        }
                      );

                  },
                  function(error) {

                    __this.canEditCount = false;
                    __this.blockers.initializing = false;

                    __this.errorHandler(error);

                  }
                );

            }

          },
          function(error) {

            __this.canEditCount = false;
            __this.blockers.initializing = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    _this.closeModal = function() {

      var __this = _this;

      if (__this.editedCount.data.id && !__this.editedCount.data.is_complete) {

        __this.confirmSaveCount();

      } else {

        __this.goBack();

      }

    }

    _this.confirmDeleteCount = function(ev) {

      var __this = _this;

      var copy1line = "Are you sure you want to delete" + (__this.editedCount.data.is_complete ? " the Complete" : "") + " Count for Group '" + __this.editedCount.parent_group.name + "' on " + moment(__this.editedCount.data.date, 'YYYY-MM-DD').format('l') + "?";

      _getAffectedCounts()
        .then(
          function(result) {

            var copy2line = "Deleting this count will affect the data associated with " + result.number + " other more recent counts."

            __this.$mdDialog.show({
              disableParentScroll : true,
              hasBackdrop : true,
              template: '<md-dialog flex-sm="90" flex-md="55" flex-gt-md="35" flex-gt-lg="25">' +
                '  <md-dialog-content>' +
                '     <p>'+
                '         <div layout="row" flex>' + copy1line + '<br /><br /></div>' + ((result.number > 0) ? '<div layout="row" flex>' + copy2line + '<br /><br /></div>' : '') +
                '         <div layout="row" layout-align="center" flex>' +
                '             <md-button class="md-primary" ng-click="cancel();" title="Cancel" aria-label="Cancel">' +
                '                 <span>CANCEL</span>' +
                '             </md-button>' +
                '             <md-button class="md-primary" ng-click="confirm();" title="Delete count" aria-label="Delete count">' +
                '                 <span>DELETE COUNT</span>' +
                '             </md-button>' +
                '         </div>' +
                '     </p>' +
                '  </md-dialog-content>' +
                '</md-dialog>',
              controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {
                $scope.confirm = function() {
                  __this.deleteCount();
                  $mdDialog.hide();
                };
                $scope.cancel = function() {
                  $mdDialog.hide();
                };
              }]
            });

          }
        );

    }

    _this.confirmSaveCount = function(ev) {

      var __this = _this;

      var xPercentCopy = "This count only has " + __this.editedCount.percentage + "% of the items counted. On completion all item costs will be calculated and saved for reporting. Any blank quantities will be saved as a zero.<br /><br />Do you want to mark the count as Complete?";
      var allDoneCopy = "This count has 100% of the items counted. On completion all item costs will be calculated and saved for reporting.<br /><br />Do you want to mark the count as Complete?";
      var copy = __this.editedCount.percentage == 100 ? allDoneCopy : xPercentCopy;

      setTimeout(function() {
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
            '             <md-button class="md-primary" ng-click="completeSave();" title="YES, MARK COUNT AS COMPLETE" aria-label="YES, MARK COUNT AS COMPLETE">' +
            '                 <span>YES, MARK COUNT AS COMPLETE</span>' +
            '             </md-button>' +
            '         </div>'+
            '     </p>' +
            '  </md-dialog-content>' +
            '</md-dialog>',
          controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {
            $scope.simpleSave = function() {
              __this.updateCount(false);
              $mdDialog.hide();
            };
            $scope.completeSave = function() {
              __this.updateCount(true);
              $mdDialog.hide();
            };
          }]
        });
      }, 500);

    }

    _this.createCount = function() {

      var __this = _this;

      if (__this.canEditCount) {

        var count_group_id = parseInt(__this.editedCount.form_data.count_group_id, 10);

        var newCountData = {
          count_group_id    : count_group_id,
          date              : moment(__this.editedCount.form_data.date).format('YYYY-MM-DD'),
          is_complete       : false,
          percent_complete  : 0,
          location_id       : __this.editedCount.form_data.location_id
        };

        __this.blockers.api_processing = true;

        __this.cakeCounts.createCount(
          newCountData
        )
          .then(
            function(response) {       

              __this.editedCount.is_opening_count = false;
              __this.editedCount.data = response;
              __this.editedCount.data.formatted_date = moment(__this.editedCount.data.date, 'YYYY-MM-DD').format('l');
              __this.editedCount.form_data = angular.copy(__this.editedCount.data);
              __this.editedCount.form_data.date = moment(__this.editedCount.form_data.date, 'YYYY-MM-DD').toDate();
              __this.editedCount.parent_group = __this.countGroupsById[count_group_id];

              // after we create new count we should check if it's the opening one - if it has older date than the cached opening count - it becomes opening one
              // if there wasn't any cached opening count yet for the count group, it also means this new one is the opening count
              if (__this.openingCountsByCountGroupId[__this.editedCount.data.count_group_id]) {

                // there should be always one opening count per count group and location, so we may assume the first one is the only one and is correct
                __this.editedCount.is_opening_count = (moment(__this.openingCountsByCountGroupId[__this.editedCount.data.count_group_id][0]['count_date'], 'YYYY-MM-DD').diff(moment(__this.editedCount.data.date, 'YYYY-MM-DD'), 'days') > 0) ? true : false;

              } else {

                __this.editedCount.is_opening_count = true;

              }

              __this.countGroupsById[count_group_id]['counts'].push(__this.editedCount.data);

              _loadEditedCountItems()
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

    _this.deleteCount = function() {

      var __this = _this;

      if (__this.canEditCount && __this.editedCount.data.id) {

        __this.blockers.api_processing = true;

        __this.cakeCounts.removeCount(__this.editedCount.data.id)
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

      __this.$location.path('/counts').search('id', null);

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.saveCost = function(itemUnitId) {

      var __this = _this;

      if (__this.canEditCount && __this.editedCount.data.id) {

        var itemUnit = __this.itemUnitsById[itemUnitId];

        if (itemUnit && itemUnit.item.starting_cost_updateable && itemUnit.item.item_location && itemUnit.new_cost_value !== itemUnit.cost_value) {

          __this.blockers.api_processing = true;

          var allCosts = Big(0);
          var totalCost = Big(0);
          var updateData = {
            id :  itemUnit.item.item_location.id
          };

          _.each(
            itemUnit.item.units_data,
            function(ownItemUnit) {

              // calculate average only for units with filled count field
              if (_.isNumber(ownItemUnit.new_quantity_value) && ownItemUnit.new_quantity_value !== 0) {        

                if (ownItemUnit.new_cost_value) {
                  allCosts = allCosts.plus(1);
                  totalCost = totalCost.plus(Big(ownItemUnit.new_cost_value).div(ownItemUnit.unit_quantity));
                }

              }

              return;

            }
          );

          updateData.starting_cost = allCosts.cmp(Big(0)) == 0 ? 0 : __this.cakeCommon.parseCakeFloatValue(totalCost.div(allCosts));

          if (itemUnit.item.last_cost_updateable) {

            updateData.last_cost = updateData.starting_cost;

          }

          __this.cakeItemLocations.updateItemLocation(
            updateData
          )
            .then(
              function(result) {

                itemUnit.cost_value = itemUnit.new_cost_value;
                itemUnit.item.starting_cost = __this.cakeCommon.parseCakeFloatValue(result.starting_cost);

                __this.blockers.api_processing = false;

              },
              function(error) {

                itemUnit.new_cost_value = itemUnit.cost_value; //revert on error

                __this.blockers.api_processing = false;

                __this.errorHandler(error);

              }
            );

        }

      }

    }

    function _afterSaveQuantityCallback(itemUnit, response) {

      var __this = _this

      itemUnit.count_object = response;
      itemUnit.quantity_value = angular.copy(itemUnit.new_quantity_value);
      itemUnit.item.counted = true;

      _updateTimestamp(response);

      _updatePercentage()
        .then(
          function(response) {

            __this.blockers.api_processing = false;

            if (itemUnit.item.save_starting_cost_along_with_quantity) {

              itemUnit.item.save_starting_cost_along_with_quantity = false;
              _this.saveCost(itemUnit.id);

            }

          },
          function(error) {

            __this.blockers.api_processing = false;

            __this.errorHandler(error);

          }
        );

    }

    _this.saveQuantity = function(itemUnitId) {

      var __this = _this;

      if (__this.canEditCount && __this.editedCount.data.id) {

        var itemUnit = __this.itemUnitsById[itemUnitId];

        if (itemUnit && itemUnit.new_quantity_value !== itemUnit.quantity_value) {

          if (_.isNumber(itemUnit.new_quantity_value)) {

            var quantity = __this.cakeCommon.parseCakeFloatValue(itemUnit.new_quantity_value);
            var common_unit_quantity = __this.cakeCommon.parseCakeFloatValue(_convertCountValueFromItemUnitToCommon(itemUnit.new_quantity_value, itemUnit));

            if (itemUnit.count_object) {

              __this.blockers.api_processing = true;

              __this.cakeCountItems.updateCountItem(
                {
                  id                    : itemUnit.count_object.id,
                  quantity              : quantity,
                  common_unit_quantity  : common_unit_quantity
                }
              )
                .then(
                  function(response) {

                    _afterSaveQuantityCallback(itemUnit, response);

                  },
                  function(error) {

                    // revert on error
                    itemUnit.new_quantity_value = itemUnit.quantity_value;

                    __this.blockers.api_processing = false;

                    __this.errorHandler(error);

                  }
                );

            } else {

              __this.blockers.api_processing = true;

              __this.cakeCountItems.createCountItem(
                {
                  inv_count_id          : __this.editedCount.data.id,
                  inv_item_id           : itemUnit.item.id,
                  inv_item_unit_id      : itemUnit.id,
                  common_unit_id        : itemUnit.common_unit_id,
                  quantity              : quantity,
                  common_unit_quantity  : common_unit_quantity,
                  location_id           : __this.editedCount.data.location_id
                }
              )
                .then(
                  function(response) {

                    _afterSaveQuantityCallback(itemUnit, response);

                  },
                  function(error) {

                    // revert on error
                    itemUnit.new_quantity_value = itemUnit.quantity_value;

                    __this.blockers.api_processing = false;

                    __this.errorHandler(error);

                  }
                );

            }

          } else if (itemUnit.count_object) {

            __this.blockers.api_processing = true;

            __this.cakeCountItems.removeCountItem(
              {
                id   : itemUnit.count_object.id
              }
            )
              .then(
                function(response) {

                  itemUnit.count_object = null;
                  itemUnit.quantity_value = null;
                  itemUnit.new_quantity_value = null;

                  itemUnit.item.counted = false;
                  _.each(
                    itemUnit.item.units_data,
                    function(ownItemUnit) {

                      if(ownItemUnit.count_object) {

                        itemUnit.item.counted = true;
                        return false; // break loop immediately

                      }

                      return;

                    }
                  );

                  _updateTimestamp(response);

                  _updatePercentage()
                    .then(
                      function(response) {

                        __this.blockers.api_processing = false;

                      },
                      function(error) {

                        __this.blockers.api_processing = false;

                        __this.errorHandler(error);

                      }
                    );

                },
                function(error) {

                  // revert on error
                  itemUnit.new_quantity_value = itemUnit.quantity_value;

                  __this.blockers.api_processing = false;

                  __this.errorHandler(error);

                }
              );

          }

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

    _this.toggleCountIsComplete = function() {

      var __this = _this;

      if (__this.canEditCount && __this.editedCount.was_complete) {

        if (__this.editedCount.form_data.is_complete) {

          __this.updateCount(true);

          // if unchecked - uncheck in database and update view - make everything editable
        } else {

          __this.blockers.api_processing = true;

          __this.cakeCounts.updateCount(
            {
              id          : __this.editedCount.data.id,
              is_complete : false
            }
          )
            .then(
              function(response) {

                _updateTimestamp(response);
                
                __this.editedCount.data.is_complete = false;
                __this.editedCount.form_data.is_complete = false;

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

    _this.updateCount = function(markComplete) {

      var __this = _this;

      markComplete = markComplete || false;

      if (__this.canEditCount && __this.editedCount.data.id) {

        var updateCountData = {
          id                : __this.editedCount.data.id,
          percent_complete  : __this.editedCount.percentage,
          notes             : __this.editedCount.form_data.notes
        };

        var errorHandler = function(error) {

          __this.blockers.api_processing = false;

          __this.errorHandler(error);

        };
        var successHandler = function(response) {
          
          if (markComplete) {

            _checkCountingTaskStatus()
              .then(
                function() {

                  __this.blockers.api_processing = false;

                  __this.goBack();

                },
                function(error) {

                  __this.blockers.api_processing = false;

                  __this.errorHandler({counting_task_error: error}, true);

                }
              );

          } else {

            __this.blockers.api_processing = false;

            __this.goBack();

          }

        };

        if (!__this.editedCount.data.is_complete) {

          updateCountData.date = moment(__this.editedCount.form_data.date).format('YYYY-MM-DD');

        }

        if (markComplete) {

          updateCountData.is_complete = true;

        }

        __this.blockers.api_processing = true;

        __this.cakeCounts.updateCount(
          updateCountData
        )
          .then(
            function(response) {

              _updateTimestamp(response);

              if (markComplete) {

                _setEmptyCounts()
                  .then(
                    function(response) {

                      _runCountTask()
                        .then(
                          successHandler,
                          errorHandler
                        );

                    },
                    errorHandler
                  );

              } else {

                successHandler(response);

              }

            },
            errorHandler
          );

      }

    }

    _this.validateDate = function(formName) {

      var __this = _this;
      var newDate = moment(__this.editedCount.form_data.date);
      var count_group_id = parseInt(__this.editedCount.form_data.count_group_id, 10);

      if (__this.forms[formName]) {

        __this.forms[formName].countDate.$setValidity('unique', true);
        __this.forms[formName].countDate.$setValidity('is_date', true);

        if (_.isUndefined(__this.editedCount.form_data.date)) {

          __this.forms[formName].countDate.$setValidity('is_date', false);

        } else if (!newDate.isValid()) {

          __this.forms[formName].countDate.$setValidity('is_date', false);

        } else if (
          __this.countGroupsById[count_group_id] && 
            __this.countGroupsById[count_group_id]['disabled_dates'].indexOf(newDate.format('YYYY-MM-DD')) >= 0
        ) {

          if (
            (
              __this.editedCount.data.id &&
                moment(__this.editedCount.data.date, 'YYYY-MM-DD').format('YYYY-MM-DD') !== newDate.format('YYYY-MM-DD')
            ) ||
              !__this.editedCount.data.id
          ) {

            __this.forms[formName].countDate.$setValidity('unique', false);

          }

        }

      }

    }
  }
}

EditCountController.$inject = ['$filter', '$location', '$mdDialog', '$peach', '$q',
                           '$scope', '$timeout', 'commonService', 'countGroupsService',
                           'countsService', 'countItemsService', 'glAccountsService',
                           'invoicesService', 'temsService', 'itemLocationsService',
                           'itemUnitsService', 'itemUnitLocationsService', 'permissionsService',
                           'settingsService', 'unitsService', 'vendorItemsService',
                           'vendorLocationsService'];

export default EditCountController;
