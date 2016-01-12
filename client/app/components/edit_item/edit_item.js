
class EditItemController {
  constructor($location, $mdDialog, $timeout, $peach, $q, cakeCommon, cakeCountGroups, cakeCountItems, cakeEventItems, cakeGLAccounts, cakeInvoiceItems, cakeItems, cakeItemsDBItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeSharedData, cakeUnits, cakeVendors, cakeVendorItems) {
    /** Edit item settings modal page
     * Allows to edit items and create new ones
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

    _createItemUnit = function (itemUnitData) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var commonUnit = __this.unitsById[itemUnitData.common_unit_id];
        var unit = __this.unitsById[itemUnitData.unit_id]; 
        var existingWVConversionUnits = _.where(__this.editedItem.units.data_array, {is_wv_conversion: true});

        // If there were no wv conviersion units yet, set this one as conversion unit
        if (
          existingWVConversionUnits.length == 0 &&
            (
              (commonUnit.type == 'weight' && unit.type == 'volume') || 
                (commonUnit.type == 'volume' && unit.type == 'weight')
            )
        ) {
          
          itemUnitData.is_wv_conversion = true;
          
        }

        // Add some default description, if none was provided
        if (!itemUnitData.description) {

          itemUnitData.description = __this.unitsById[itemUnitData.unit_id]['name'] + ' ' + itemUnitData.unit_quantity + ' ' + __this.unitsById[itemUnitData.common_unit_id]['abbr'];

        }

        __this.cakeItemUnits.createItemUnit(
          itemUnitData
        )
          .then(
            function(response) {

              // unit locations
              _createItemUnitLocationsForItemUnit(
                response.id
              )
                .then(
                  function() {

                    resolve(response);

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


    };

    function _createItemUnitLocationsForItemUnit(newItemUnitId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var newItemUnitLocationsCollection = [];

        _.each(
          __this.editedItem.locations.data_array,
          function(location) {

            if (location.was_checked) {

              newItemUnitLocationsCollection.push(
                {
                  inv_item_id       : __this.editedItem.data.id,
                  location_id       : location.id,
                  inv_item_unit_id  : newItemUnitId,
                  is_count_unit     : true/*,
                                            is_order_unit     : true*/
                }
              );

            }

            return;

          }
        );

        if (newItemUnitLocationsCollection.length > 0) {

          __this.cakeItemUnitLocations.bulkCreateItemUnitLocations(
            newItemUnitLocationsCollection
          )
            .then(
              function(results) {

                __this.cakeItemUnitLocations.loadItemUnitLocations(
                  {
                    'id' : results.collection
                  },
                  null,
                  true
                )
                  .then(
                    function(response) {

                      _parseItemUnitLocations(response);

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

          resolve(true);

        }

      });

    }

    function _deselectOldReportingUnitAndReloadData() {

      var __this = _this;

      if (__this.editedItem.units.reporting_unit) {

        __this.cakeItemUnits.updateItemUnit(
          {
            id              : __this.editedItem.units.reporting_unit.id,
            is_report_unit  : false
          }
        )
          .then(
            function() {

              _loadAdditionalItemData()
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
              __this.cancelReportingUnitIdUpdate();

            }
          );

      } else {

        _loadAdditionalItemData()
          .then(
            function() {

              __this.blockers.api_processing = false;

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          );

      }

    }

    function _findCommonUnitCoversionUnit(fromUnit, toUnit) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var commonConversionUnit = null;

        // for type 'each' find direct conversion
        if (toUnit.type == 'each') {

          commonConversionUnit =  _.findWhere(__this.editedItem.units.data_array, {unit_id: toUnit.id});

          //for volume/weight
        } else {

          // find the with the same unit_id
          var conversionUnit = _.findWhere(__this.editedItem.units.data_array, {unit_id: toUnit.id});

          // if found - use it
          if (conversionUnit) {

            commonConversionUnit = conversionUnit;

            // if not, then try to find one of the same type
          } else {
            
            _.each(
              __this.editedItem.units.data_array,
              function(itemUnit) {
                if (itemUnit.unit.type == toUnit.type) {
                  conversionUnit = itemUnit;
                  return false;
                }
              }
            );

            if (conversionUnit) {

              var base = "english_base";

              if (conversionUnit.unit.is_metric) {

                base = "metric_base";

              }

              var a = Big(conversionUnit.unit[base]);
              var b = Big(__this.unitsById[toUnit.id][base]);
              var c = Big(conversionUnit.unit_quantity);
              var unit_quantity = __this.cakeCommon.parseCakeFloatValue(b.div(a).times(c));

              commonConversionUnit = {
                unit_id         : toUnit.id,
                unit_quantity   : unit_quantity,
                is_report_unit  : false,
                inv_item_id     : __this.editedItem.form_data.id,
                common_unit_id  : __this.editedItem.form_data.common_unit_id,
                description     : __this.unitsById[__this.editedItem.form_data.common_unit_id]['name'] + ' ' + unit_quantity + ' ' + __this.unitsById[__this.editedItem.data.common_unit_id]['abbr']
              };

            }

          }

        }

        resolve(commonConversionUnit);

      });

    }

    function _findReportingUnitCoversionUnit(commonUnit, toUnit) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var reportingConversionUnit = null;

        // we only look for weight and volume converions units here - if type is each, we will ask for conversion
        if (toUnit.type != 'each') {
          
          var conversionUnit = null;

          _.each(
            __this.editedItem.units.data_array,
            function(itemUnit) {
              if (itemUnit.unit.type == toUnit.type) {
                conversionUnit = itemUnit;
                return false;
              }
            }
          );

          if (conversionUnit) {

            var base = "english_base";

            if (conversionUnit.unit.is_metric) {

              base = "metric_base";

            }

            var a = Big(conversionUnit.unit[base]);
            var b = Big(__this.unitsById[toUnit.id][base]);
            var c = Big(conversionUnit.unit_quantity);
            var unit_quantity = __this.cakeCommon.parseCakeFloatValue(b.div(a).times(c));

            reportingConversionUnit = {
              unit_id         : toUnit.id,
              unit_quantity   : unit_quantity,
              is_report_unit  : true,
              inv_item_id     : __this.editedItem.data.id,
              common_unit_id  : __this.editedItem.data.common_unit_id,
              description     : __this.unitsById[__this.editedItem.form_data.common_unit_id]['name'] + ' ' + unit_quantity + ' ' + __this.unitsById[__this.editedItem.data.common_unit_id]['abbr']
            };

          }

        }

        resolve(reportingConversionUnit);

      });

    }

    function _loadAdditionalItemData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        // load additional item data - locations, units
        var additionalPromises = {
          item_locations      : __this.cakeItemLocations.loadItemLocations(
            {
              '$and': [
                {
                  'location_id': _.pluck(__this.activeLocations, 'id')
                },
                {
                  'inv_item_id': __this.editedItem.data.id
                }
              ]
            }
          ),
          item_units          : __this.cakeItemUnits.loadItemUnits(
            {
              'inv_item_id': __this.editedItem.data.id
            }
          ),
          item_unit_locations : __this.cakeItemUnitLocations.loadItemUnitLocations(
            {
              'inv_item_id': __this.editedItem.data.id
            }
          ),
          count_items         : __this.cakeCountItems.loadCountItems(
            {
              'inv_item_id': __this.editedItem.data.id
            }  
          ),
          event_items         : __this.cakeEventItems.loadEventItems(
            {
              'inv_item_id': __this.editedItem.data.id
            } 
          ),
          recipe_items         : __this.$peach.api(cakeCommon.getObjectKey('recipe_items')).find(
            {
              'item_id': __this.editedItem.data.id
            } 
          ),
          item_vendors        : __this.cakeVendorItems.loadVendorItems(
            {
              'inv_item_id': __this.editedItem.data.id
            }
          )
        };

        // if item has item_db_id field set, try to load parent items DB item
        if (__this.editedItem.data.item_db_id) {

          additionalPromises['items_db_item'] = __this.cakeItemsDBItems.getData(
            {
              'id': __this.editedItem.data.item_db_id
            },
            {
              'fields'  : 'id,name'
            }
          );

        }

        // execute all promises
        __this.$q.all(additionalPromises)
          .then(
            function(results) {

              if (results['items_db_item'] && results['items_db_item']['results'] && results['items_db_item']['results'].length > 0) {
                __this.editedItem.items_db_item = results['items_db_item']['results'][0];
              }

              __this.countItems = results['count_items']['results'];
              __this.eventItems = results['event_items']['results'];
              __this.recipeItems = results['recipe_items']['results'];
              __this.vendorItems = results['item_vendors']['results'];

              __this.itemUnitLocations = [];
              _parseItemUnitLocations(results['item_unit_locations']);

              __this.$q.all([
                _loadItemVendorsInvoiceItems(),
                _prepareItemLocations(results['item_locations']),
                _prepareItemUnits(results['item_units'])
              ])
                .then(
                  function() {

                    __this.$q.all([
                      _prepareItemReportingUnits(),
                      _prepareItemVendors()
                    ])
                      .then(
                        function() {

                          resolve(true);

                        }
                      );

                  },
                  function(error){

                    reject(error);

                  }
                );

            },
            function(error){

              reject(error);

            }
          );

      });

    }

    function _loadItemVendorsInvoiceItems() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var vendorItemsIds = _.pluck(__this.vendorItems, 'id');

        if (vendorItemsIds.length > 0) {

          __this.cakeInvoiceItems.loadInvoiceItems(
            {
              'vendor_inventory_item_id': vendorItemsIds
            },
            null,
            true
          )
            .then(
              function(response){

                __this.relatedInvoiceItems = response.results;

                resolve(true);

              },
              function(error){

                reject(error);

              }
            );

        } else {

          resolve(true);

        }

      });

    }

    function _loadPermissions() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$q.all(
          {
            is_account_admin  : __this.cakeCommon.isUserAccountAdmin(),
            can_edit_items    : __this.cakePermissions.userHasPermission('edit_items'),
            can_delete_item   : __this.cakeItems.canItemBeDeleted(__this.editedItem.data.id),
            can_change_unit   : __this.cakeItems.canItemCommonUnitBeChanged(__this.editedItem.data.id)
          }
        )
          .then(
            function(results){

              __this.isAccountAdmin = results['is_account_admin'];
              __this.canEditItem = results['can_edit_items'];
              __this.canChangeCommonUnit = results['can_change_unit'] ? __this.canEditItem : false;
              __this.canDeleteItem = results['can_delete_item'] ? __this.canEditItem : false;

              resolve(true);

            },
            function(error){

              reject(error);

            }
          );

      });

    }

    function _openConversionDialog(oldCommonUnit, newCommonUnit, okCallback, cancelCallback) {

      var __this = _this;

      __this.$mdDialog.show({
        locals: {
          cakeFloatPattern: __this.cakeFloatPattern
        },
        template: '<md-dialog flex-gt-md="50">' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>' +
          '             The unit you have selected for your item (' + newCommonUnit.name + ') must be converted to the common unit (' + oldCommonUnit.name + ') in order for it to be used throughout the app. Add a conversion below to allow each units to be used for this item. You can also choose to change your common unit keeping in mind that this should be a universal unit for this ingredient.' +
          '             <br /><br />' +
          '         </div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <form name="conversionForm" novalidate>' +
          '                 <div layout="row" layout-align="center center" flex>' +
          '                     <md-input-container flex>' +
          '                         <label>' + newCommonUnit.name + '(s)</label>' +
          '                         <input type="number" step="0.00001" min="0" max="999999999.99999" ng-pattern="cakeFloatPattern" name="conv1" ng-model="conversion.new_unit_conversion" aria-label="' + newCommonUnit.name + '" required />' +
          '                     </md-input-container>' +
          '                     <div layout layout-padding>=</div>' +
          '                     <md-input-container flex>' +
          '                         <label>' + oldCommonUnit.name + '(s)</label>' +
          '                         <input type="number" step="0.00001" min="0" max="999999999.99999" ng-pattern="cakeFloatPattern" name="conv2" ng-model="conversion.old_unit_conversion" aria-label="' + oldCommonUnit.name + '" required />' +
          '                    </md-input-container>' +
          '                 </div>' +
          '             </form>' +
          '         </div>' +
          '     </p>'+
          '  </md-dialog-content>' +
          '  <div class="md-actions" layout="row">' +
          '     <span flex=""></span>' +
          '     <md-button ng-click="cancel();" title="Cancel" aria-label="Cancel">' +
          '         <span>CANCEL</span>' +
          '     </md-button>' +
          '     <md-button class="md-primary" ng-click="addConversion();" ng-disabled="conversionForm.$invalid" title="Add conversion" aria-label="Add conversion">' +
          '         <span>ADD CONVERSION</span>' +
          '     </md-button>' +
          '  </div>' +
          '</md-dialog>',
        controller: ['$scope', '$mdDialog', 'cakeFloatPattern', function DialogController($scope, $mdDialog, cakeFloatPattern) {

          $scope.cakeFloatPattern = cakeFloatPattern;

          $scope.conversion = {
            old_unit_conversion: null,
            new_unit_conversion: null
          };

          $scope.addConversion = function() {

            okCallback($scope.conversion);
            $mdDialog.hide();

          };

          $scope.cancel = function() {

            cancelCallback();
            $mdDialog.hide();

          };

        }]
      });

    }

    function _openNewItemUnitPopup(okCallback, cancelCallback) {

      var __this = _this;

      okCallback = okCallback || function() { return; };
      cancelCallback = cancelCallback || function() { return; };

      var commonUnitName = __this.unitsById[__this.editedItem.data.common_unit_id]['name'];

      _this.openNewItemUnitForm(); // new item unit form normally opens in units tab, but we can use its data here in popup even if the form is not really opened/visible

      __this.$mdDialog.show({
        //scope: __this,
        //preserveScope: true,
        locals: {
          vm: __this
        },
        template: '<md-dialog flex-gt-md="50">' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>' +
          '             To add new item unit for your vendor product select the unit description from the dropdown below. Then enter the conversion to the common unit (' + commonUnitName + ') so this unit may be used throughout the app.' +
          '             <br /><br />' +
          '         </div>' +
          '         <div layout="row" layout-align="center" flex ng-form="vm.forms.newItemUnitForm">' +
          '                 <div layout="row" layout-align="center center" flex>' +
          '                     <md-input-container flex ng-class="{\'md-input-has-value\': vm.editedItem.units.new_unit_form.unit_id}">' +
          '                          <md-select' +
          '                              name="itemUnitUnit"' +
          '                              ng-model="vm.editedItem.units.new_unit_form.unit_id"' +
          '                              ng-change="vm.autoCalculateConversionForNewUnit();"' +
          '                              ng-disabled="!vm.canEditItem || vm.blockers.api_processing"' +
          '                              aria-label="Unit Description"' +
          '                              required' +
          '                          >' +
          '                              <md-option ng-repeat="unit in vm.editedItem.units.new_unit_form.available_units" value="{{ ::unit.id }}">{{ ::unit.name }}</md-option>' +
          '                          </md-select>' +
          '                     </md-input-container>' +
          '                     <div layout layout-padding>=</div>' +
          '                     <md-input-container flex>' +
          '                         <label>' + commonUnitName + '(s)</label>' +
          '                         <input type="number" cake-unique-item-unit="editedItem.units.new_unit_form" cake-unique-item-unit-controller="vm" step="0.00001" min="0" max="999999999.99999" ng-pattern="vm.cakeFloatPattern" name="itemUnitQuantity" ng-model="vm.editedItem.units.new_unit_form.unit_quantity" aria-label="' + commonUnitName + '(s)" ng-readonly="vm.blockers.api_processing" ng-disabled="vm.editedItem.units.new_unit_form.disable_conversion || !vm.editedItem.units.new_unit_form.unit_id || !vm.canEditItem" required />' +
          '                         <div ng-messages="vm.forms.newItemUnitForm.itemUnitQuantity.$error" ng-if="vm.forms.newItemUnitForm.itemUnitQuantity.$invalid && vm.forms.newItemUnitForm.itemUnitQuantity.$dirty">' +
          '                              <div ng-message="required">Please provide a conversion</div>' +
          '                              <div ng-message="number">This is not a valid number</div>' +
          '                              <div ng-message="unique">There is already item unit like this</div>' +
          '                          </div>' +
          '                     </md-input-container>' +
          '                 </div>' +
          '         </div>' +
          '     </p>'+
          '  </md-dialog-content>' +
          '  <div class="md-actions" layout="row">' +
          '     <span flex=""></span>' +
          '     <md-button ng-click="cancel();" title="Cancel" aria-label="Cancel">' +
          '         <span>CANCEL</span>' +
          '     </md-button>' +
          '     <md-button class="md-primary" ng-click="addUnit();" ng-disabled="vm.forms.newItemUnitForm.$invalid" title="Add unit" aria-label="Add unit">' +
          '         <span>ADD UNIT</span>' +
          '     </md-button>' +
          '  </div>' +
          '</md-dialog>',
        
        controller: ['$scope', '$mdDialog', 'vm', function DialogController($scope, $mdDialog, vm) {

          $scope.vm = vm;

          $scope.addUnit = function() {

            okCallback();

            $mdDialog.hide();

          };

          $scope.cancel = function() {

            cancelCallback();

            __this.closeNewItemUnitForm();

            $mdDialog.hide();

          };

        }]
      });

    }

    function _parseItemUnitLocations(itemUnitLocationsResponse) {

      var __this = _this;

      _.each(
        itemUnitLocationsResponse.results,
        function(itemUnitLocation) {

          if (!__this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id]) {
            __this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id] = {};
          }

          __this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id][itemUnitLocation.inv_item_unit_id] = itemUnitLocation.id;
          __this.itemUnitLocations.push(itemUnitLocation);

          return;

        }
      );

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

    function _prepareItemLocations(itemLocationsResponse) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var itemLocations = [];
        var checkedLocations = [];
        var cost_additional_label = __this.unitsById[__this.editedItem.data.common_unit_id] ? 'per ' + __this.unitsById[__this.editedItem.data.common_unit_id]['name'] : '';

        _.each(
          __this.activeLocations,
          function(activeLocation) {

            var location = angular.copy(activeLocation);
            var itemLocation = _.find(itemLocationsResponse.results, {'location_id': location.id});

            if (itemLocation) {

              location.was_checked = true;
              checkedLocations.push(location);

              location.item_location = itemLocation;
              location.starting_cost = __this.cakeCommon.parseCakeCostFloatValue(itemLocation.starting_cost, '--', 2);
              location.last_cost = __this.cakeCommon.parseCakeCostFloatValue(itemLocation.last_cost, '--', 2);

            } else {

              location.was_checked = false;
              location.starting_cost =  '--';
              location.last_cost = '--';

            }

            location.cost_additional_label = cost_additional_label;

            location.display_name = location.number ? location.number + ' - ' : '';
            location.display_name = location.display_name + location.name;

            itemLocations.push(location);

            return;

          }
        );

        __this.editedItem.locations = {
          checked_locations : [],
          data_array        : _.sortBy(itemLocations, 'display_name'),
          data_collection   : _.object(_.pluck(itemLocations, 'id'), itemLocations)
        };

        // use timeout to update selected rows, because md-data-table tends to clear them after refreshing
        __this.$timeout(function() { __this.editedItem.locations.checked_locations = checkedLocations; }, 1000);

        // show locations tab if there's more than one location available
        if (__this.editedItem.locations.data_array.length > 1) {

          __this.tabs.availableTabs[3]['visible'] = true; 

        } else {

          __this.tabs.availableTabs[3]['visible'] = false; 

        }

        resolve(true);

      });

    }

    function _prepareItemUnits(itemUnitsResponse) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var itemUnits = [];
        var itemCommonUnit = null;
        var itemReportUnit = null;

        _.each(
          itemUnitsResponse.results,
          function(itemUnit) {

            var itemUnitParsed = _prepareItemUnitHelper(itemUnit);

            if (itemUnitParsed.common_unit && itemUnitParsed.unit) {

              if (!itemCommonUnit && itemUnit.common_unit_id == itemUnit.unit_id) {

                itemUnitParsed.is_common_unit = true;
                itemUnitParsed.can_be_deleted = false;
                itemCommonUnit = itemUnitParsed;

              } else {

                itemUnits.push(itemUnitParsed);

              }

            } 

            return;

          }
        );

        itemUnits = _.sortBy(itemUnits, 'name');

        if (itemCommonUnit) {
          itemUnits.unshift(itemCommonUnit);
          __this.editedItem.units.common_unit = itemCommonUnit;
        }

        __this.editedItem.units.data_array = itemUnits;

        resolve(true);

      });

    }

    function _prepareItemReportingUnits() {

      var __this = _this;

      __this.editedItem.units.available_reporting_units = [];

      return __this.$q(function(resolve, reject) {

        var key = 1;
        var reportingUnits = [];

        _.each(
          __this.units,
          function(unit) {

            var itemUnits = _.where(__this.editedItem.units.data_array, {unit_id: unit.id});

            if (itemUnits.length > 0) {

              _.each(
                itemUnits,
                function(itemUnit) {

                  var reportingUnit = _.extend(itemUnit, {reporting_unit_key: key});
                  // in case if reporting unit is common unit - display just name, else - display description, if it was set
                  if (reportingUnit.id !== __this.editedItem.units.common_unit.id) {
                    reportingUnit.reporting_name = reportingUnit.description ? reportingUnit.description : reportingUnit.name;
                  } else {
                    reportingUnit.reporting_name = reportingUnit.name;    
                  }
                  reportingUnits.push(reportingUnit);
                  key++;

                  if (reportingUnit.is_report_unit) {

                    __this.editedItem.units.reporting_unit = reportingUnit;

                  }

                  return;

                }
              );

              if (unit.type == 'each') {

                var reportingUnit = _.extend(unit, {reporting_unit_key: key, reporting_name: unit.name});
                reportingUnits.push(reportingUnit);
                key++;

              }

            } else {

              var reportingUnit = _.extend(unit, {reporting_unit_key: key, reporting_name: unit.name});
              reportingUnits.push(reportingUnit);
              key++;

            }

            return;

          }
        );

        __this.editedItem.units.available_reporting_units = _.sortBy(reportingUnits, 'name');
        __this.editedItem.form_data.reporting_unit_key = __this.editedItem.units.reporting_unit ? __this.editedItem.units.reporting_unit.reporting_unit_key : null;

        resolve(true);

      });

    }

    function _prepareItemUnitHelper(itemUnit) {

      var __this = _this;

      var itemUnitParsed = _.omit(itemUnit, ['created_at', 'created_by', 'updated_at', 'updated_by', 'uri']);
      var commonUnit = __this.unitsById[itemUnit.common_unit_id];
      var unit = __this.unitsById[itemUnit.unit_id];
      var unitLocations = _.where(__this.itemUnitLocations, {inv_item_unit_id: itemUnit.id});
      var unitCounts = _.where(__this.countItems, {inv_item_unit_id: itemUnit.id});
      var unitEvents = _.where(__this.eventItems, {inv_item_unit_id: itemUnit.id});
      var unitRecipes = _.where(__this.recipeItems, {unit_id: itemUnit.unit_id, common_unit_id: itemUnit.common_unit_id, common_quantity: itemUnit.unit_quantity});
      var unitVendors = _.where(__this.vendorItems, {inv_item_unit_id: itemUnit.id});

      if (commonUnit && unit) {

        itemUnitParsed.common_unit = commonUnit;
        itemUnitParsed.unit = unit;
        itemUnitParsed.is_type_conversion = false;
        itemUnitParsed.conversion_type_label = null;
        itemUnitParsed.name = unit.name;
        itemUnitParsed.conversion_value = __this.cakeCommon.parseCakeFloatValue(itemUnit.unit_quantity);
        itemUnitParsed.conversion_label = itemUnitParsed.conversion_value + " " + commonUnit.abbr;
        itemUnitParsed.description = itemUnit.description;
        itemUnitParsed.editable_description = itemUnit.description;
        itemUnitParsed.edit_description = false;
        itemUnitParsed.locations = unitLocations;
        itemUnitParsed.can_be_deleted = (itemUnitParsed.is_common_unit || itemUnitParsed.is_report_unit || itemUnitParsed.is_wv_conversion) ? false : ((unitEvents.length > 0 || unitCounts.length > 0 || unitRecipes.length > 0 || unitVendors.length > 0) ? false : true);
        //itemUnitParsed.is_hidden = unitLocations.length > 0 ? false : true;
        itemUnitParsed.related_data = {unit_events: unitEvents, unit_counts: unitCounts, unit_recipes: unitRecipes, unit_vendors: unitVendors};

        if (commonUnit.type != unit.type) {
          itemUnitParsed.is_type_conversion = true;
          itemUnitParsed.conversion_type_label = cakeCommon.uppercaseWord(commonUnit.type) + " / " + cakeCommon.uppercaseWord(unit.type) + " conversion unit";
        }

      }

      return itemUnitParsed;

    }

    function _prepareItemVendors() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var itemVendors = [];

        _.each(
          __this.vendorItems,
          function(itemVendor) {

            var itemVendorParsed = _prepareItemVendorHelper(itemVendor);

            if (itemVendorParsed.vendor && itemVendorParsed.unit) {
              
              itemVendors.push(itemVendorParsed); 

            }

            return;

          }
        );

        itemVendors = _.sortBy(itemVendors, 'name');

        __this.editedItem.vendors.data_array = itemVendors;

        resolve(true);

      });

    }

    function _prepareItemVendorHelper(itemVendor) {

      var __this = _this;

      var itemVendorParsed = _.omit(itemVendor, ['created_at', 'created_by', 'updated_at', 'updated_by', 'uri']);
      var vendor = __this.vendorsById[itemVendor.vendor_id];
      var itemUnit = _.findWhere(__this.editedItem.units.data_array, {id: itemVendor.inv_item_unit_id});
      var invoiceItems = _.where(__this.relatedInvoiceItems, {vendor_inventory_item_id: itemVendor.id});

      if (vendor && itemUnit) {

        itemVendorParsed.vendor = vendor;
        itemVendorParsed.name = vendor.name;
        itemVendorParsed.unit = itemUnit;
        itemVendorParsed.unit_description = itemUnit.description ? itemUnit.description : itemUnit.name;
        itemVendorParsed.last_price = __this.cakeCommon.parseCakeFloatValue(itemVendorParsed.last_price, null);
        itemVendorParsed.last_price_formatted = __this.cakeCommon.parseCakeCostFloatValue(itemVendor.last_price, '--', 2);
        itemVendorParsed.is_edited = false;
        itemVendorParsed.can_be_deleted = invoiceItems.length > 0 ? false : true; // vendor item cannot be deleted if it was already used in an invoice
        itemVendorParsed.already_used = invoiceItems.length > 0 ? true : false; // some item vendor data cannot be changed if it was already used in an invoice

      }

      return itemVendorParsed;

    }

    function _prepareUnits() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.units = __this.cakeUnits.getUnits();
        __this.unitsById = __this.cakeUnits.getUnitsCollection();

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

    function _parseItemLocationsForUpdate() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var itemLocationsToCreate = [];
        var itemLocationsToRemove = [];
        var itemLocationsToUpdate = [];

        var newItemLocationsCollection = [];
        var removeItemLocationsCollection = [];
        var newItemUnitLocationsCollection = [];
        var removeItemUnitLocationsCollection = [];

        // find locations which were checked before, but are not checked any longer
        _.each(
          __this.editedItem.locations.data_array,
          function(location) {

            var checkedLocation = _.findWhere( __this.editedItem.locations.checked_locations, {id: location.id});

            if (!checkedLocation && location.was_checked) {

              itemLocationsToRemove.push(location);

            }

            return;

          }
        );

        // find locations which were not checked before, but are checked now, additionally get those with unchanged status - which are still checked
        _.each(
          __this.editedItem.locations.checked_locations,
          function(checkedLocation) {

            if (!checkedLocation.was_checked) {

              itemLocationsToCreate.push(checkedLocation);

            } else {

              itemLocationsToUpdate.push(checkedLocation);

            }

            return;

          }
        );

        // now for each new checked location, add the new itemLocation data to bulk collection
        _.each(
          itemLocationsToCreate,
          function(location) {

            newItemLocationsCollection.push(
              {
                inv_item_id   : __this.editedItem.data.id,
                location_id   : location.id,
                last_cost     : 0,
                starting_cost : 0
              }
            );

            _.each(
              __this.editedItem.units.data_array,
              function(itemUnit) {

                //if (!itemUnit.is_hidden) {

                newItemUnitLocationsCollection.push(
                  {
                    inv_item_id       : __this.editedItem.data.id,
                    location_id       : location.id,
                    inv_item_unit_id  : itemUnit.id,
                    is_count_unit     : true/*,
                                              is_order_unit     : true*/
                  }
                );

                //}

                return;

              }
            );

            return;

          }
        );

        // for each location which has to be removed - add the item location it to remove collection, also add corresponding item units locations to collection to be removed with bulk request
        _.each(
          itemLocationsToRemove,
          function(location) {

            removeItemLocationsCollection.push(
              location.item_location.id
            );

            _.each(
              __this.editedItem.units.data_array,
              function(itemUnit) {

                if (
                  __this.itemUnitLocationsByLocationIdAndItemUnitId[location.id] &&
                    __this.itemUnitLocationsByLocationIdAndItemUnitId[location.id][itemUnit.id]
                ) {

                  removeItemUnitLocationsCollection.push(
                    __this.itemUnitLocationsByLocationIdAndItemUnitId[location.id][itemUnit.id]
                  );

                }

                return;

              }
            )

              return;
            
          }
        );

        // finally, for each location which still remains checked - ensure it has all units added, if not, add those to new item location units collection
        _.each(
          itemLocationsToUpdate,
          function(location) {

            _.each(
              __this.editedItem.units.data_array,
              function(itemUnit) {

                //if (!itemUnit.is_hidden) {

                if (
                  !__this.itemUnitLocationsByLocationIdAndItemUnitId[location.id] ||
                    !__this.itemUnitLocationsByLocationIdAndItemUnitId[location.id][itemUnit.id]
                ) {

                  newItemUnitLocationsCollection.push(
                    {
                      inv_item_id       : __this.editedItem.data.id,
                      location_id       : location.id,
                      inv_item_unit_id  : itemUnit.id,
                      is_count_unit     : true/*,
                                                is_order_unit     : true*/
                    }
                  );

                }

                //}

                return;

              }
            );

            return;

          }
        );

        resolve(
          {
            newItemLocationsCollection        : newItemLocationsCollection,
            removeItemLocationsCollection     : removeItemLocationsCollection,
            newItemUnitLocationsCollection    : newItemUnitLocationsCollection,
            removeItemUnitLocationsCollection : removeItemUnitLocationsCollection
          }
        );

      });

    }

    function _setNewCommonUnitAndUpdateItem(commonConversionUnit) {

      var __this = _this;
      
      // if new common unit doesnt exist yet, create it
      if (!commonConversionUnit.id) {

        _createItemUnit(
          commonConversionUnit
        )
          .then(
            function(response) {

              // update item in database, with extended option and conv_unit_quantity set - AFTER PUT trigger will update all other item units unit_quantity
              _updateItemCommonUnitAndReloadData(commonConversionUnit);

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);
              __this.cancelCommonUnitIdUpdate();

            }
          );

        // if new common unit already exists in item units, update item, with extended option and conv_unit_quantity set - AFTER PUT trigger will update all other item units unit_quantity
      } else {

        _updateItemCommonUnitAndReloadData(commonConversionUnit);

      }

    }

    function _setNewReportingUnitAndUpdateItem(reportingUnit) {

      var __this = _this;

      reportingUnit.is_report_unit = true; // ensure this is set

      // if new reporting unit doesnt exist yet, create it and deselect old one
      if (!reportingUnit.id) {

        _createItemUnit(
          reportingUnit
        )
          .then(
            function(response) {

              _deselectOldReportingUnitAndReloadData();

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);
              __this.cancelReportingUnitIdUpdate();

            }
          );

        // if new reporting unit already exists in item units, update it and deselect old one
      } else {

        __this.cakeItemUnits.updateItemUnit(
          {
            id              : reportingUnit.id,
            is_report_unit  : true
          }
        )
          .then(
            function(response) {

              _deselectOldReportingUnitAndReloadData();

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);
              __this.cancelReportingUnitIdUpdate();

            }
          );

      }

    }

    function _updateItemCommonUnitAndReloadData(commonConversionUnit) {

      var __this = _this;

      __this.cakeItems.updateItem(
        {
          id              : __this.editedItem.form_data.id,
          common_unit_id  : __this.editedItem.form_data.common_unit_id
        },
        {
          extended            : true,
          conv_unit_quantity  : commonConversionUnit.unit_quantity
        }
      )
        .then(
          function(response) {

            // reload data for units and locations tab
            _loadAdditionalItemData()
              .then(
                function() {

                  // update cached values of common unit id
                  __this.editedItem.data.common_unit_id = response.common_unit_id;
                  __this.editedItem.form_data.common_unit_id = response.common_unit_id;
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
            __this.cancelCommonUnitIdUpdate();

          }
        );

    }

    function _updateItemLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _parseItemLocationsForUpdate()
          .then(
            function(results) {

              __this.$q.all(
                [
                  // create new item locations
                  __this.cakeItemLocations.bulkCreateItemLocations(
                    results.newItemLocationsCollection
                  ),
                  // delete unchecked item locations
                  __this.cakeItemLocations.bulkDeleteItemLocations(
                    results.removeItemLocationsCollection
                  ),
                  // create new item unit locations
                  __this.cakeItemUnitLocations.bulkCreateItemUnitLocations(
                    results.newItemUnitLocationsCollection
                  ),
                  // delete item unit locations of unchecked item locations
                  __this.cakeItemUnitLocations.bulkDeleteItemUnitLocations(
                    results.removeItemUnitLocationsCollection
                  )
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

            }
          );

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($location, $mdDialog, $timeout, $peach, $q, cakeCommon, cakeCountGroups, cakeCountItems, cakeEventItems, cakeGLAccounts, cakeInvoiceItems, cakeItems, cakeItemsDBItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeSharedData, cakeUnits, cakeVendors, cakeVendorItems) {

      _this.$location = $location;
      _this.$mdDialog = $mdDialog;
      _this.$timeout = $timeout;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeCountItems = cakeCountItems;
      _this.cakeEventItems = cakeEventItems;
      _this.cakeGLAccounts = cakeGLAccounts;
      _this.cakeInvoiceItems = cakeInvoiceItems;
      _this.cakeItems = cakeItems;
      _this.cakeItemsDBItems = cakeItemsDBItems;
      _this.cakeItemLocations = cakeItemLocations;
      _this.cakeItemUnits = cakeItemUnits;
      _this.cakeItemUnitLocations = cakeItemUnitLocations;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeSharedData = cakeSharedData;
      _this.cakeUnits = cakeUnits;
      _this.cakeVendors = cakeVendors;
      _this.cakeVendorItems = cakeVendorItems;

      _this.blockers = {
        api_processing  : false,
        initializing    : true
      };

      _this.editedItem = {
        data          : null,
        form_data     : {},
        items_db_item : null,
        locations     : {
          checked_locations : [],
          data_array        : [],
          data_collection   : {}
        },
        units         : {
          data_array                : [],
          common_unit               : null,
          reporting_unit            : null,
          available_reporting_units : [],
          new_unit_form             : {
            show_form                 : false,
            disable_conversion        : false
          }
        },
        vendors       : {
          data_array                : [],
          new_vendor_form           : {
            show_form                 : false
          },
          edited_vendor_form_data   : {}
        }
      };

      _this.tabs = {
        activeTab     : null,
        availableTabs : [
          {
            title             : "ITEM INFO",
            template          : "itemInfoTabTemplate",
            deselectCallback  : function(){},
            visible           : true
          },
          {
            title             : "UNITS OF MEASURE",
            template          : "itemUnitsTabTemplate",
            deselectCallback  : _this.closeNewItemUnitForm,
            visible           : true
          },
          {
            title             : "VENDORS",
            template          : "itemVendorsTabTemplate",
            deselectCallback  : _this.closeNewItemVendorForm,
            visible           : true
          },
          {
            title             : "LOCATIONS",
            template          : "itemLocationsTabTemplate",
            deselectCallback  : function(){},
            visible           : false
          }
        ]
      };

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.cakeFloatPattern = cakeCommon.getCakeFloatRegex();
      _this.canChangeCommonUnit = false; // if user has permission to change common unit of
      _this.canDeleteItem = false; // if user has permission to delete item
      _this.canEditItem = false; // if user has permission to edit items
      _this.countGroups = []; // all available count groups array
      _this.countGroupsById = {}; // all available count groups collection - ids are keys
      _this.countItems = []; // all edited item count items
      _this.eventItems = []; // all editem item events
      _this.forms = {}; // will keep links to forms which should be accessible in controller main scope
      _this.glAccounts = []; // all available gl accounts array
      _this.glAccountsById = {}; // all available gl accounts collection - ids are keys
      _this.itemUnitLocations = []; // all edited item unit locations array
      _this.itemUnitLocationsByLocationIdAndItemUnitId = {}; // this will be used to keep all item unit location ids mapped by location id and item unit id
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.recipeItems = []; // all edited item recipe items
      _this.relatedInvoiceItems = []; //array of all invoice items which are linked with current item (through vendor items)
      _this.units = []; // all available units array
      _this.unitsById = {}; // all available units collection - ids are keys
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc
      _this.vendorItems = []; // all editem item vendor items
      _this.vendors = []; // all available vendors array
      _this.vendorsById = {}; // all available vendors collection - ids are keys

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      var innerErrorHandler = function(error) {

        __this.canChangeCommonUnit = false;
        __this.canDeleteItem = false;
        __this.canEditItem = false;

        __this.blockers.initializing = false;

        __this.errorHandler(error);

      };

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      __this.$q.all({
        active_locations  : __this.cakeSettings.getSettings('active_locations'),
        gl_accounts       : __this.cakeGLAccounts.loadGLAccounts(null, {sort: 'name'}),
        count_groups      : __this.cakeCountGroups.loadCountGroups(null, {sort: 'name'}),
        units             : __this.cakeUnits.loadUnits(null, {sort: 'name'}),
        vendors           : __this.cakeVendors.loadVendors(null, {sort: 'name'})
      })
        .then(
          function(results) {

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            // parse loaded gl accounts, count groups and units
            __this.$q.all([
              _prepareGLAccounts(),
              _prepareCountGroups(),
              _prepareUnits(),
              _prepareVendors()
            ])
              .then(
                function() {

                  // if id specified in url, try to find item to be edited
                  if (__this.$location.search()['id']) {

                    __this.cakeItems.loadItems(
                      {
                        id: parseInt(__this.$location.search()['id'])
                      },
                      null,
                      true
                    )
                      .then(
                        function(response) {

                          if (response.results && response.results.length > 0) {

                            // ensure this item gl account, count group and unit still exists
                            response.results[0]['gl_account_id'] = __this.glAccountsById[response.results[0]['gl_account_id']] ? response.results[0]['gl_account_id'] : null;
                            response.results[0]['count_group_id'] = __this.countGroupsById[response.results[0]['count_group_id']] ? response.results[0]['count_group_id'] : null;
                            response.results[0]['common_unit_id'] = __this.unitsById[response.results[0]['common_unit_id']] ? response.results[0]['common_unit_id'] : null;

                            __this.editedItem.data = response.results[0];
                            __this.editedItem.form_data = angular.copy(__this.editedItem.data);

                            _loadPermissions()
                              .then(
                                function() {

                                  _loadAdditionalItemData()
                                    .then(
                                      function() {

                                        // FINALLY ALL DATA LOADED
                                        __this.blockers.initializing = false;

                                      },
                                      innerErrorHandler
                                    );

                                },
                                innerErrorHandler
                              );

                          } else {

                            innerErrorHandler('Couldn\'t load item with given ID: ' + __this.$location.search()['id'] + '.');

                          }

                        },
                        innerErrorHandler
                      );

                  } else {

                    innerErrorHandler('ID of the item to edit was not specified.');

                  }

                }
              );

          },
          innerErrorHandler
        );

    }



    /** PUBLIC FUNCTIONS **/

    _this.addNewItemUnit = function() {

      var __this = _this;

      if (__this.canEditItem && __this.editedItem.data.id) {

        return __this.$q(function(resolve, reject) {

          __this.blockers.api_processing = true;

          if (!__this.editedItem.units.new_unit_form.description) {
            
            __this.editedItem.units.new_unit_form.description = __this.unitsById[__this.editedItem.units.new_unit_form.unit_id]['name'] + ' ' + __this.editedItem.units.new_unit_form.unit_quantity + ' ' + __this.unitsById[__this.editedItem.units.common_unit.unit_id]['abbr'];

          }

          var newItemUnitData = {
            unit_id         : __this.editedItem.units.new_unit_form.unit_id,
            unit_quantity   : __this.editedItem.units.new_unit_form.unit_quantity,
            is_report_unit  : false,
            inv_item_id     : __this.editedItem.form_data.id,
            common_unit_id  : __this.editedItem.form_data.common_unit_id,
            description     : __this.editedItem.units.new_unit_form.description
          };

          _createItemUnit(
            newItemUnitData
          )
            .then(
              function(response) {

                var parsedItemUnit = _prepareItemUnitHelper(response);

                __this.editedItem.units.data_array.unshift(parsedItemUnit);

                __this.blockers.api_processing = false;
                __this.closeNewItemUnitForm();

                resolve(parsedItemUnit);

              },
              function(error) {

                __this.blockers.api_processing = false;
                __this.errorHandler(error);

                reject(error);

              }
            );

        });

      }

    }

    _this.addNewItemVendor = function() {

      var __this = _this;

      if (__this.canEditItem && __this.editedItem.form_data.id) {

        __this.blockers.api_processing = true;

        var newItemVendorData = {
          vendor_id         : parseInt(__this.editedItem.vendors.new_vendor_form.vendor_id, 10),
          inv_item_id       : __this.editedItem.form_data.id,
          inv_item_unit_id  : parseInt(__this.editedItem.vendors.new_vendor_form.inv_item_unit_id, 10),
          description       : __this.editedItem.vendors.new_vendor_form.description,
          number            : __this.editedItem.vendors.new_vendor_form.number,
          is_active         : true
        };
        
        
        if (__this.editedItem.vendors.new_vendor_form.last_price) {
          
          newItemVendorData.last_price =__this.cakeCommon.parseCakeFloatValue(__this.editedItem.vendors.new_vendor_form.last_price, null);
          //newItemVendorData.last_price_on = moment().format('YYYY-MM-DD');
          
        }

        __this.cakeVendorItems.createVendorItem(
          newItemVendorData
        )
          .then(
            function(response) {

              var parsedItemVendor = _prepareItemVendorHelper(response);

              parsedItemVendor.unit.related_data.unit_vendors.push(response.id);
              parsedItemVendor.unit.can_be_deleted = (parsedItemVendor.unit.is_common_unit || parsedItemVendor.unit.is_report_unit || parsedItemVendor.unit.is_wv_conversion) ? false : ((parsedItemVendor.unit.related_data.unit_events.length > 0 || parsedItemVendor.unit.related_data.unit_counts.length > 0 || parsedItemVendor.unit.related_data.unit_recipes.length > 0 || parsedItemVendor.unit.related_data.unit_vendors.length > 0) ? false : true);

              __this.editedItem.vendors.data_array.unshift(parsedItemVendor);

              __this.blockers.api_processing = false;
              __this.closeNewItemVendorForm();

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          );

      }

    }

    _this.autoCalculateConversionForNewUnit = function() {

      var __this = _this;

      var selectedUnit = __this.unitsById[__this.editedItem.units.new_unit_form.unit_id];

      // if selected unit and common unit are both weight or volume type, the conversion probably can be calculated automatically
      if (
        selectedUnit &&
          (selectedUnit.type !== 'each') &&
          (__this.editedItem.units.common_unit['unit']['type'] !== 'each')
      ) {

        // if they are of the same type, use english/metric base comparison
        if (selectedUnit.type == __this.editedItem.units.common_unit['unit']['type']) {

          var base = "english_base";

          if (selectedUnit.is_metric) {

            base = "metric_base";

          }

          var a = Big(selectedUnit[base]);
          var b = Big(__this.editedItem.units.common_unit['unit'][base]);
          var unit_quantity = __this.cakeCommon.parseCakeFloatValue(a.div(b));

          __this.editedItem.units.new_unit_form.unit_quantity = unit_quantity;
          __this.editedItem.units.new_unit_form.disable_conversion = true;

          return;


          // if not, check if there is some vw conversion unit already
        } else {

          var existingWVConversionUnit = _.findWhere(__this.editedItem.units.data_array, {is_wv_conversion: true});

          // if conversion unit found, use it to calculate unit_quantity
          if (existingWVConversionUnit) {

            var base = "english_base";

            if (selectedUnit.is_metric) {

              base = "metric_base";

            }

            var a = Big(existingWVConversionUnit.unit[base]);
            var b = Big(selectedUnit[base]);
            var c = Big(existingWVConversionUnit.unit_quantity);
            var unit_quantity = __this.cakeCommon.parseCakeFloatValue(b.div(a).times(c));

            __this.editedItem.units.new_unit_form.unit_quantity = unit_quantity;
            __this.editedItem.units.new_unit_form.disable_conversion = true;

            return;

          }

        }

      }

      // if no return was called so far - this is a regular each unit and don't have any specific conversion. Put default 1, allow editing conversion
      __this.editedItem.units.new_unit_form.unit_quantity = 1;
      __this.editedItem.units.new_unit_form.disable_conversion = false;
      //__this.validateNewItemUnitDuplicate();

    }

    _this.calculateConversionAndChangeCommonUnit = function(conversion) {

      var __this = _this;

      //calculate conversion unit which then will be used in conversion to new common unit for other units
      var old_unit_conversion = conversion.old_unit_conversion ? Big(conversion.old_unit_conversion) : Big(1);
      var new_unit_conversion = conversion.new_unit_conversion ? Big(conversion.new_unit_conversion) : Big(1);

      var unit_quantity = __this.cakeCommon.parseCakeFloatValue(old_unit_conversion.div(new_unit_conversion));
      var commonConversionUnit = {
        unit_id         : __this.editedItem.form_data.common_unit_id,
        is_report_unit  : false,
        unit_quantity   : unit_quantity,
        inv_item_id     : __this.editedItem.data.id,
        common_unit_id  : __this.editedItem.form_data.common_unit_id,
        description     : __this.unitsById[__this.editedItem.form_data.common_unit_id]['name'] + ' ' + __this.cakeCommon.parseCakeFloatValue(unit_quantity) + ' ' + __this.unitsById[__this.editedItem.data.common_unit_id]['abbr']
      };

      _setNewCommonUnitAndUpdateItem(commonConversionUnit);

    }

    _this.calculateConversionAndChangeReportingUnit = function(conversion) {

      var __this = _this;

      //calculate conversion unit which then will be used in new reporting unit
      var old_unit_conversion = conversion.old_unit_conversion ? Big(conversion.old_unit_conversion) : Big(1);
      var new_unit_conversion = conversion.new_unit_conversion ? Big(conversion.new_unit_conversion) : Big(1);

      var unit_quantity = __this.cakeCommon.parseCakeFloatValue(old_unit_conversion.div(new_unit_conversion));

      var selectedReportingUnit = _.findWhere(__this.editedItem.units.available_reporting_units, {reporting_unit_key: __this.editedItem.form_data.reporting_unit_key});

      var conversionUnit = {
        unit_id         : selectedReportingUnit.id,
        is_report_unit  : true,
        unit_quantity   : unit_quantity,
        inv_item_id     : __this.editedItem.data.id,
        common_unit_id  : __this.editedItem.data.common_unit_id,
        description     : __this.unitsById[selectedReportingUnit.id]['name'] + ' ' + __this.cakeCommon.parseCakeFloatValue(unit_quantity) + ' ' + __this.unitsById[__this.editedItem.data.common_unit_id]['abbr']
      };

      _setNewReportingUnitAndUpdateItem(conversionUnit);

    }

    _this.cancelCommonUnitIdUpdate = function() {

      var __this = _this;

      __this.editedItem.form_data.common_unit_id = __this.editedItem.data.common_unit_id;
      __this.blockers.api_processing = false;

    }

    _this.cancelReportingUnitIdUpdate = function() {

      var __this = _this;

      __this.editedItem.form_data.reporting_unit_key = __this.editedItem.units.reporting_unit.reporting_unit_key;
      __this.blockers.api_processing = false;

    }

    _this.changeCommonUnit = function() {

      var __this = _this;

      __this.editedItem.form_data.common_unit_id = parseInt(__this.editedItem.form_data.common_unit_id, 10); // md-select converts int values to strings :/

      if (__this.canEditItem && __this.editedItem.data.common_unit_id != __this.editedItem.form_data.common_unit_id) {

        __this.blockers.api_processing = true;

        var oldCommonUnit = __this.unitsById[__this.editedItem.data.common_unit_id];
        var newCommonUnit = __this.unitsById[__this.editedItem.form_data.common_unit_id];

        _findCommonUnitCoversionUnit(
          oldCommonUnit,
          newCommonUnit
        )
          .then(
            function(conversionUnit) {

              if (!conversionUnit) {

                _openConversionDialog(oldCommonUnit, newCommonUnit, __this.calculateConversionAndChangeCommonUnit, __this.cancelCommonUnitIdUpdate);

              } else {

                _setNewCommonUnitAndUpdateItem(conversionUnit);

              }

            }
          );

      }

    }

    _this.changeReportingUnit = function() {

      var __this = _this;

      __this.editedItem.form_data.reporting_unit_key = parseInt(__this.editedItem.form_data.reporting_unit_key, 10); // md-select converts int values to strings :/

      if (
        __this.canEditItem && 
          (
            !__this.editedItem.units.reporting_unit ||
              __this.editedItem.units.reporting_unit.reporting_unit_key != __this.editedItem.form_data.reporting_unit_key
          )
      ) {

        var selectedReportingUnit = _.findWhere(__this.editedItem.units.available_reporting_units, {reporting_unit_key: __this.editedItem.form_data.reporting_unit_key});

        if (selectedReportingUnit) {

          __this.blockers.api_processing = true;

          // if selected unit is existing item unit, just update this one setting is_report_unit to true and remove old report unit
          if (selectedReportingUnit.unit_id) {

            _setNewReportingUnitAndUpdateItem(selectedReportingUnit);

          } else {

            var commonUnit = __this.unitsById[__this.editedItem.data.common_unit_id];
            var newReportingUnit = __this.unitsById[selectedReportingUnit.id];

            _findReportingUnitCoversionUnit(
              commonUnit,
              newReportingUnit
            )
              .then(
                function(conversionUnit) {

                  if (!conversionUnit) {

                    _openConversionDialog(commonUnit, newReportingUnit, __this.calculateConversionAndChangeReportingUnit, __this.cancelReportingUnitIdUpdate);

                  } else {

                    _setNewReportingUnitAndUpdateItem(conversionUnit);

                  }

                }
              );

          }

        }

      }

    }

    _this.checkForDuplicateVendorItem = function(vendorData, validatedForm) {

      var __this = _this;

      var vendor_id = vendorData.vendor_id ? parseInt(vendorData.vendor_id, 10) : null;
      var inv_item_unit_id = vendorData.inv_item_unit_id ? parseInt(vendorData.inv_item_unit_id, 10) : null;
      var number = vendorData.number ? vendorData.number : null;

      validatedForm.itemVendorVendor.$setValidity('unique', true);

      var foundDuplicates = _.where(__this.editedItem.vendors.data_array, {vendor_id: vendor_id, inv_item_unit_id: inv_item_unit_id, number: number});

      if (vendorData.id) {

        foundDuplicates = _.filter(foundDuplicates, function(duplicate) { return duplicate.id !== parseInt(vendorData.id, 10); });

      }

      if (foundDuplicates.length > 0) {

        validatedForm.itemVendorVendor.$setValidity('unique', false);

      }

    }

    _this.closeEditItemVendorForm = function() {

      var __this = _this;

      _.each(
        __this.editedItem.vendors.data_array,
        function(vendor) {

          vendor.is_edited = false;

          return;

        }
      );

      __this.editedItem.vendors.edited_vendor_form_data = {};

    }

    _this.closeNewItemUnitForm = function() {

      var __this = _this;

      if (__this.editedItem.units.new_unit_form.show_form) {

        __this.editedItem.units.new_unit_form.unit_id = null;
        __this.editedItem.units.new_unit_form.unit_quantity = null;
        __this.editedItem.units.new_unit_form.description = null;
        __this.editedItem.units.new_unit_form.available_units = [];
        __this.editedItem.units.new_unit_form.disable_conversion = false;
        __this.editedItem.units.new_unit_form.show_form = false;

      }

    }

    _this.closeNewItemVendorForm = function() {

      var __this = _this;

      if (__this.editedItem.vendors.new_vendor_form.show_form) {

        __this.editedItem.vendors.new_vendor_form.vendor_id = null;
        __this.editedItem.vendors.new_vendor_form.description = null;
        __this.editedItem.vendors.new_vendor_form.number = null;
        /*__this.editedItem.vendors.new_vendor_form.pack_size = null;*/
        __this.editedItem.vendors.new_vendor_form.inv_item_unit_id = null;
        __this.editedItem.vendors.new_vendor_form.last_price = null;
        __this.editedItem.vendors.new_vendor_form.show_form = false;

      }

    }

    _this.confirmDeleteItem = function() {

      var __this = _this;

      __this.$mdDialog.show({
        template: '<md-dialog>' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>Are you sure you want to delete your item?<br /><br /></div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="confirm();" title="YES, DELETE MY ITEM" aria-label="YES, DELETE MY ITEM" flex>' +
          '                 <span>YES, DELETE MY ITEM</span>' +
          '             </md-button>' +
          '         </div>' +
          '         <div layout="row" layout-align="center" flex>' +
          '             <md-button class="md-primary" ng-click="cancel();" title="NO, TAKE ME BACK" aria-label="NO, TAKE ME BACK" flex>' +
          '                 <span>NO, TAKE ME BACK</span>' +
          '             </md-button>' +
          '         </div>' +
          '     </p>'+
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {

          $scope.confirm = function() {

            __this.deleteItem();

            $mdDialog.hide();

          };
          $scope.cancel = function() {

            $mdDialog.hide();

          };

        }]
      });

    }

    _this.countGroupsFilter = function(countGroup) {

      var __this = _this;

      if (countGroup.is_active || countGroup.id == __this.editedItem.form_data.count_group_id) {

        return true;

      } else {

        return false;

      }

    }

    _this.deleteItem = function() {

      var __this = _this;

      if (__this.editedItem.data.id && __this.canDeleteItem) {

        __this.blockers.api_processing = true;

        __this.cakeItems.removeItem(
          __this.editedItem.data.id
        )
          .then(
            function(response) {

              // TODO: Maybe also delete item locations, item units and item unit locations?
              __this.blockers.api_processing = false;

              __this.goBack();

            },
            function(error) {

              __this.blockers.api_processing = false;

              __this.errorHandler(error);

            }
          )

      }

    }

    _this.deleteItemUnit = function(itemUnitId) {

      var __this = _this;

      if (__this.canEditItem) {

        __this.closeNewItemUnitForm();
        __this.blockers.api_processing = true;

        __this.cakeItemUnits.deleteItemUnit(itemUnitId)
          .then(
            function(response) {

              // additionally delete item unit locations
              var itemUnitLocations = _.where(__this.itemUnitLocations, {inv_item_unit_id: itemUnitId});
              var itemUnitLocationsIds = _.map(_.pluck(itemUnitLocations, 'id'), function(id) { return parseInt(id); } );
              var updatedItemUnitLocations = [];

              if (itemUnitLocationsIds.length > 0) {

                __this.cakeItemUnitLocations.bulkDeleteItemUnitLocations(
                  itemUnitLocationsIds
                )
                  .then(
                    function(response) {

                      // clear cached data item unit locations
                      
                      _.each(
                        __this.itemUnitLocations,
                        function(itemUnitLocation) {

                          if (itemUnitLocationsIds.indexOf(itemUnitLocation.id) < 0) {

                            updatedItemUnitLocations.push(itemUnitLocation);

                          }

                          return;

                        }
                      );

                      __this.itemUnitLocations = updatedItemUnitLocations;

                      _.each(
                        itemUnitLocations,
                        function(itemUnitLocation) {

                          if (
                            __this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id] &&
                              __this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id][itemUnitId]
                          ) {

                            delete __this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id][itemUnitId];
                          }

                          return;


                        }
                      );

                      // remove item unit from cache
                      _.each(
                        __this.editedItem.units.data_array,
                        function(itemUnit, index) {

                          if (itemUnit.id == itemUnitId) {
                            __this.editedItem.units.data_array.splice(index, 1);
                            return false;
                          }

                          return;

                        }
                      );

                      __this.blockers.api_processing = false;

                    },
                    function(error) {

                      __this.blockers.api_processing = false;
                      __this.errorHandler(error);

                    }
                  );    

              } else {

                // remove item unit from cache
                _.each(
                  __this.editedItem.units.data_array,
                  function(itemUnit, index) {

                    if (itemUnit.id == itemUnitId) {
                      __this.editedItem.units.data_array.splice(index, 1);
                      return false;
                    }

                    return;

                  }
                );

                __this.blockers.api_processing = false;
                
              }

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          );

      }

    }

    _this.deleteItemVendor = function(itemVendorId) {

      var __this = _this;

      if (__this.canEditItem) {

        __this.closeNewItemVendorForm();
        __this.blockers.api_processing = true;

        __this.cakeVendorItems.deleteVendorItem(itemVendorId)
          .then(
            function(response) {

              // remove item vendor from cache
              _.each(
                __this.editedItem.vendors.data_array,
                function(itemVendor, index) {

                  if (itemVendor.id == itemVendorId) {

                    itemVendor.unit.related_data.unit_vendors = _.without(itemVendor.unit.related_data.unit_vendors, itemVendorId);
                    itemVendor.unit.can_be_deleted = (itemVendor.unit.is_common_unit || itemVendor.unit.is_report_unit || itemVendor.unit.is_wv_conversion) ? false : ((itemVendor.unit.related_data.unit_events.length > 0 || itemVendor.unit.related_data.unit_counts.length > 0 || itemVendor.unit.related_data.unit_recipes.length > 0 || itemVendor.unit.related_data.unit_vendors.length > 0) ? false : true);

                    __this.editedItem.vendors.data_array.splice(index, 1);
                    return false;
                  }

                  return;

                }
              );

              __this.blockers.api_processing = false;

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          );

      }

    }

    _this.editedItemVendorUnitDropdownCallback = function() {

      var __this = _this;

      // if add new unit selected, open new unit with conversion popup - no need to validate edited vendor item for duplicates, because in this situation with new item unit it just cant be a duplicate of existing vendor item
      if (__this.canEditItem && parseInt(__this.editedItem.vendors.edited_vendor_form_data.inv_item_unit_id, 10) === 0) {

        _openNewItemUnitPopup(
          function() {

            __this.addNewItemUnit()
              .then(
                function(newItemUnit) {

                  __this.editedItem.vendors.edited_vendor_form_data.inv_item_unit_id = newItemUnit.id;

                },
                function(error) {

                  __this.editedItem.vendors.edited_vendor_form_data.inv_item_unit_id = null;

                }
              )

          },
          function() {

            __this.editedItem.vendors.edited_vendor_form_data.inv_item_unit_id = null;

          }
        );

      } else {

        // if unit has changed, validate edited vendor item for duplicates
        __this.checkForDuplicateVendorItem(__this.editedItem.vendors.edited_vendor_form_data, __this.forms.editItemVendorForm);

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

      __this.$location.path('/settings/items').search('id', null);

    }

    /*_this.hideItemUnit = function(itemUnitId) {

      var __this = _this;

      var selectedItemUnit = _.findWhere(__this.editedItem.units.data_array, {id: itemUnitId});

      if (selectedItemUnit && __this.canEditItem) {

      __this.closeNewItemUnitForm();
      __this.blockers.api_processing = true;

      __this.cakeItemUnitLocations.bulkDeleteItemUnitLocations(
      _.pluck(selectedItemUnit.locations, 'id')
      )
      .then(
      function(response) {

      _.each(
      selectedItemUnit.locations,
      function(itemUnitLocation) {

      if (__this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id]) {

      delete __this.itemUnitLocationsByLocationIdAndItemUnitId[itemUnitLocation.location_id][itemUnitLocation.inv_item_unit_id];

      }

      return;

      }
      ); 

      selectedItemUnit.locations = [];
      selectedItemUnit.is_hidden = true;

      __this.blockers.api_processing = false;

      },
      function(error) {

      __this.blockers.api_processing = false;
      __this.errorHandler(error);

      }
      );

      }

      }*/

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.nameBlurCallback = function() {

      var __this = _this;

      if (!__this.editedItem.form_data.name) {

        __this.editedItem.form_data.name = __this.editedItem.data.name;
        
      }

    }

    _this.nameChangeCallback = function() {

      var __this = _this;

      __this.forms.itemForm.itemName.$setValidity('duplicate', true);

      if (
        __this.editedItem.form_data.name &&
          __this.editedItem.form_data.name !== __this.editedItem.data.name
      ) {

        var itemIdArray = [];
        itemIdArray.push(__this.editedItem.form_data.id);

        __this.cakeItems.loadItems(
          {
            '$and'      : [
              {
                'name'      : __this.editedItem.form_data.name
              },
              {
                'id'        : {
                  '$nin'        : itemIdArray
                }
              }
            ]
          },
          {
            'limit'   : 1,
            'fields'  : 'id'
          },
          true
        )
          .then(
            function(response) {

              if (response.results && response.results.length > 0) {

                __this.forms.itemForm.itemName.$setValidity('duplicate', false);

              }

            },
            function(error) {

              // silent skip

            }
          );

      }

    }

    _this.newItemVendorUnitDropdownCallback = function() {

      var __this = _this;

      // if add new unit selected, open new unit with conversion popup - no need to validate new vendor item for duplicates, because in this situation with new item unit it just cant be a duplicate of existing vendor item
      if (__this.canEditItem && parseInt(__this.editedItem.vendors.new_vendor_form.inv_item_unit_id, 10) === 0) {

        _openNewItemUnitPopup(
          function() {

            __this.addNewItemUnit()
              .then(
                function(newItemUnit) {

                  __this.editedItem.vendors.new_vendor_form.inv_item_unit_id = newItemUnit.id;

                },
                function(error) {

                  __this.editedItem.vendors.new_vendor_form.inv_item_unit_id = null;

                }
              )

          },
          function() {

            __this.editedItem.vendors.new_vendor_form.inv_item_unit_id = null;

          }
        );

      } else {

        // if unit has changed, validate new vendor item for duplicates
        __this.checkForDuplicateVendorItem(__this.editedItem.vendors.new_vendor_form, __this.forms.newItemVendorForm);

      }

    }

    _this.openEditItemVendorForm = function(itemVendor) {

      var __this = _this;

      __this.closeNewItemVendorForm();
      __this.closeEditItemVendorForm();

      __this.editedItem.vendors.edited_vendor_form_data = angular.copy(_.omit(itemVendor, ['vendor', 'name', 'unit', 'unit_description']));
      __this.editedItem.vendors.edited_vendor_form_data.new_last_price = __this.editedItem.vendors.edited_vendor_form_data.last_price;

      itemVendor.is_edited = true;

    }

    _this.openItemUnitsPage = function() {

      var __this = _this;

      //__this.cakeSharedData.setValue('items_search', {item_id: __this.editedItem.data.id});
      __this.$location.path('/settings/item_units').search('id', null);

    }

    _this.openNewItemUnitForm = function() {

      var __this = _this;

      __this.editedItem.units.new_unit_form.available_units = __this.prepareNewItemUnitAvailableUnits();
      __this.editedItem.units.new_unit_form.show_form = true;


    }

    _this.openNewItemVendorForm = function() {

      var __this = _this;

      __this.closeEditItemVendorForm();

      __this.editedItem.vendors.new_vendor_form.show_form = true;

    }

    _this.prepareNewItemUnitAvailableUnits = function() {

      var __this = _this;

      var availableUnits = [];

      _.each(
        __this.units,
        function(unit) {

          var itemUnits = _.where(__this.editedItem.units.data_array, {unit_id: unit.id});

          if (unit.type == 'each' || itemUnits.length == 0) {

            availableUnits.push(unit);

          }

          return;

        }
      );

      return _.sortBy(availableUnits, 'name');

    }

    _this.saveItem = function() {
      
      var __this = _this;
      
      if (__this.canEditItem && __this.editedItem.data.id) {

        __this.blockers.api_processing = true;

        // update item info tab stuff - common_unit_id and reporting unit are being save on the fly as they change, so we're not sending them here
        __this.cakeItems.updateItem(
          {
            id              : __this.editedItem.data.id,
            name            : __this.editedItem.form_data.name,
            gl_account_id   : parseInt(__this.editedItem.form_data.gl_account_id, 10),
            count_group_id  : parseInt(__this.editedItem.form_data.count_group_id, 10),
            is_active       : __this.editedItem.form_data.is_active
          }
        )
          .then(
            function(response) {

              // next - save changes in locations tab
              _updateItemLocations()
                .then(
                  function(response) {

                    // we don't need to update units tab, as it contents are being saved on the fly as units change, also any new items are already saved
                    __this.blockers.api_processing = false;

                    __this.goBack();
                    

                  },
                  function(error) {
                    
                    __this.blockers.api_processing = false;

                    __this.errorHandler(error);

                  }
                )

            },
            function(error) {
              
              __this.blockers.api_processing = false;

              __this.errorHandler(error);

            }
          )

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

    _this.updateEditedItemVendor = function() {

      var __this = _this;

      if (__this.canEditItem && __this.editedItem.form_data.id) {

        __this.blockers.api_processing = true;

        var editedItemVendorData = {
          vendor_id         : parseInt(__this.editedItem.vendors.edited_vendor_form_data.vendor_id, 10),
          inv_item_unit_id  : parseInt(__this.editedItem.vendors.edited_vendor_form_data.inv_item_unit_id, 10),
          description       : __this.editedItem.vendors.edited_vendor_form_data.description,
          number            : __this.editedItem.vendors.edited_vendor_form_data.number,
          id                : __this.editedItem.vendors.edited_vendor_form_data.id
        };
        
        if (__this.editedItem.vendors.edited_vendor_form_data.new_last_price !== __this.editedItem.vendors.edited_vendor_form_data.last_price) {

          editedItemVendorData.last_price = __this.cakeCommon.parseCakeFloatValue(__this.editedItem.vendors.edited_vendor_form_data.new_last_price, null);
          editedItemVendorData.last_price_on = moment().format('YYYY-MM-DD');

        }

        __this.cakeVendorItems.updateVendorItem(
          editedItemVendorData
        )
          .then(
            function(response) {

              var parsedResponse = _prepareItemVendorHelper(response);
              var editedVendorItem = _.findWhere(__this.editedItem.vendors.data_array, {id: parsedResponse.id});

              // if unit has changed - update units data - some of them may no longer have any vendor items related, maybe we can make them removable
              if (parsedResponse.inv_item_unit_id !== editedVendorItem.inv_item_unit_id) {

                // remove vendor item from old item unit and update it
                editedVendorItem.unit.related_data.unit_vendors = _.without(editedVendorItem.unit.related_data.unit_vendors, editedVendorItem.id);
                editedVendorItem.unit.can_be_deleted = (editedVendorItem.unit.is_common_unit || editedVendorItem.unit.is_report_unit || editedVendorItem.unit.is_wv_conversion) ? false : ((editedVendorItem.unit.related_data.unit_events.length > 0 || editedVendorItem.unit.related_data.unit_counts.length > 0 || editedVendorItem.unit.related_data.unit_recipes.length > 0 || editedVendorItem.unit.related_data.unit_vendors.length > 0) ? false : true);

                // add vendor item to new item unit and update it
                parsedResponse.unit.related_data.unit_vendors.push(parsedResponse.id)
                parsedResponse.unit.can_be_deleted = (parsedResponse.unit.is_common_unit || parsedResponse.unit.is_report_unit || parsedResponse.unit.is_wv_conversion) ? false : ((parsedResponse.unit.related_data.unit_events.length > 0 || parsedResponse.unit.related_data.unit_counts.length > 0 || parsedResponse.unit.related_data.unit_recipes.length > 0 || parsedResponse.unit.related_data.unit_vendors.length > 0) ? false : true);

              }

              editedVendorItem.vendor_id = parsedResponse.vendor_id;
              editedVendorItem.inv_item_unit_id = parsedResponse.inv_item_unit_id;
              editedVendorItem.description = parsedResponse.description;
              editedVendorItem.number = parsedResponse.number;
              /*editedVendorItem.pack_size = parsedResponse.pack_size;*/
              editedVendorItem.vendor = parsedResponse.vendor;
              editedVendorItem.name = parsedResponse.name;
              editedVendorItem.unit = parsedResponse.unit;
              editedVendorItem.unit_description = parsedResponse.unit_description;
              editedVendorItem.last_price_formatted = parsedResponse.last_price_formatted;
              editedVendorItem.last_price = parsedResponse.last_price;

              __this.closeEditItemVendorForm();
              __this.blockers.api_processing = false;

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          );

      }

    }

    _this.updateItemUnitDescription = function(itemUnitId, closeInput) {

      var __this = _this;

      var selectedItemUnit = _.findWhere(__this.editedItem.units.data_array, {id: itemUnitId});

      if (selectedItemUnit && selectedItemUnit.editable_description != selectedItemUnit.description && __this.canEditItem) {

        __this.closeNewItemUnitForm();
        __this.blockers.api_processing = true;

        __this.cakeItemUnits.updateItemUnit(
          {
            id          : selectedItemUnit.id,
            description : selectedItemUnit.editable_description
          }
        )
          .then(
            function(response) {

              if (closeInput) {
                selectedItemUnit.edit_description = false;
              }

              selectedItemUnit.description = selectedItemUnit.editable_description;

              __this.blockers.api_processing = false;

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          );

      } else {

        selectedItemUnit.edit_description = false;

      }

    }

    /*_this.validateNewItemUnitDuplicate = function() {

      var __this = _this;

      if (__this.forms.newItemUnitForm) {

      __this.forms.newItemUnitForm.itemUnitQuantity.$setValidity('duplicate', true);

      if (__this.editedItem.units.new_unit_form.unit_id && __this.editedItem.units.new_unit_form.unit_quantity) {

      var duplicateOf = _.findWhere(__this.editedItem.units.data_array, {unit_id: parseInt(__this.editedItem.units.new_unit_form.unit_id, 10), conversion_value: parseFloat(__this.editedItem.units.new_unit_form.unit_quantity)});
      
      if (duplicateOf) {

      __this.forms.newItemUnitForm.itemUnitQuantity.$setValidity('duplicate', false);

      }

      }

      }

      }*/
  }
}

EditItemController.$inject = ['$location', '$mdDialog', '$timeout', '$peach', '$q',
                              'commonService', 'countGroupsService', 'countItemsService',
                              'eventItemsService', 'glAccountsService', 'invoiceItems',
                              'itemsService', 'itemsDBItemsService', 'itemLocationsService',
                              'cakeItemUnitsService', 'itemUnitLocationsSevice',
                              'permissionsService', 'settingsService', 'sharedDataService', 
                              'unitsService', 'vendorsService', 'vendorItemsService'];

export default EditItemController;