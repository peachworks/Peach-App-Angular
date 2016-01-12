/** cakeCustomMultiinputSelectorDirective
 * Directive which uses three-state checkboxes to render dropdown of options available to be checked in array of selected input objects
 * It uses a joining object to connect two other - item and the option
 * For example it can join items and locations with wtm_inv_item_locations object
 * @author Mike Bebas/Levitated
 */

// public functions
return {
  restrict: 'A',
  replace: true,
  scope: {
    "disabled"                    : "=dropdownDisabled",
    "applyChangesCallback"        : "=applyChangesCallback",
    "joiningObjectKeyField"       : "@joiningObjectKey",
    "joiningObjectItemKeyField"   : "@joiningObjectItemKey",
    "joiningObjectOptionKeyField" : "@joiningObjectOptionKey",
    "optionObjectKeyField"        : "@optionObjectKey",
    "optionObjectLabelField"      : "@optionObjectLabel",
    "itemObjectKeyField"          : "@itemObjectKey"
  },

  template:

    '<div layout="column" flex>' +
    '    <div layout="row" flex>' +
    '        <md-input-container flex md-no-float style="padding-bottom: 10px;">' +
    '            <input type="search" ng-model="filters.searchPhrase" ng-change="onSearchPhraseFilterChange();" aria-label="Search" ng-maxlength="200" placeholder="Search" />' +
    '        </md-input-container>' +
    '    </div>' +
    '    <div layout="row" layout-align="center" flex>' +
    '        <md-button class="md-primary" flex ng-click="applyChanges(); $mdCloseMenu();" ng-disabled="disabled" title="Apply changes" aria-label="Apply changes">APPLY CHANGES</md-button>' +
    '    </div>' +
    '    <div layout="row" flex ng-repeat="option in optionObjectsParsedArray">' +
    '        <md-input-container flex style="padding-bottom: 5px;">' +
    '            <cake-checkbox' +
    '                ng-model="option.value"' +
    '                ng-change="toggleOption(option);"' +
    '                ng-disabled="disabled"' +
    '                aria-label="{{ ::option.label }}"' +
    '                md-checkbox-states="availableBulkCheckboxStates"' +
    '                md-checkbox-initial-state="{{option.init_state}}"' +
    '            >' +
    '                {{ ::option.label }}' +
    '            </cake-checkbox>' +
    '        </md-input-container>' +
    '    </div>' +
    '</div>',

  controller: ["$scope", function($scope) {

    $scope.availableBulkCheckboxStates = [[false, null, 2], [false, 'md-indeterminate', 2], [true, 'md-checked', 0]];
    $scope.joiningObjectsArray = []; // available array of all joining objects to check/uncheck options for
    $scope.joiningObjectsParsedArray = []; // just those input data joining objects which related items were passed in through $scope.itemObjectsArray, additionally parsed
    $scope.joiningObjectsParsedArrayItemsKeys = []; 
    $scope.joiningObjectsWatcherDetachHandler = null; // used to de-register parent watch function
    $scope.optionObjectsArray = []; // available array of options
    $scope.optionObjectsParsedArray = []; // array of available options parsed
    $scope.optionObjectsWatcherDetachHandler = null; // used to de-register parent watch function
    $scope.itemObjectsArray = []; // array of item objects we want actually to check/uncheck options for (items are joined with options through joining object)
    $scope.itemObjectsWatcherDetachHandler = null; // used to de-register parent watch function

    $scope.filters = {
      searchPhrase: ""
    };

    $scope.joiningObjectKeyField = $scope.joiningObjectKeyField ? $scope.joiningObjectKeyField : "id";
    $scope.joiningObjectItemKeyField = $scope.joiningObjectItemKeyField ? $scope.joiningObjectItemKeyField : "item_id";
    $scope.joiningObjectOptionKeyField = $scope.joiningObjectOptionKeyField ? $scope.joiningObjectOptionKeyField : "item_parent_id";
    $scope.optionObjectKeyField = $scope.optionObjectKeyField ? $scope.optionObjectKeyField : "id";
    $scope.optionObjectLabelField = $scope.optionObjectLabelField ? $scope.optionObjectLabelField : "name";
    $scope.itemObjectKeyField = $scope.itemObjectKeyField ? $scope.itemObjectKeyField : "id";



    var optionObjectsParsedArrayCopy = [];



    $scope.parseJoiningData = function() {

      var foundItemsKeys = [];
      var joiningObjectsFiltered = [];

      $scope.joiningObjectsParsedArray = [];

      // in the beginning we'll have to filter all given joining objects and get only those which were selected to operate on (which are joining selected items and options)
      if ($scope.itemObjectsArray.length > 0) {

        var joiningObjectsFiltered = $filter('filter')($scope.joiningObjectsArray, function(joiningObject) {

          var foundItem = _.findWhere($scope.itemObjectsArray, {id: joiningObject[$scope.joiningObjectItemKeyField]});

          if (foundItem) {
            foundItemsKeys.push(foundItem[$scope.itemObjectKeyField]);
            return true;
          }
              
          return false;

        });

      }

      // then parse filtered input objects
      _.each(
        joiningObjectsFiltered,
        function(joiningObject) {

          var joiningObjectParsed = {
            "item_key"            : joiningObject[$scope.joiningObjectItemKeyField],
            "option_key"          : joiningObject[$scope.joiningObjectOptionKeyField],
            "joining_object_key"  : joiningObject[$scope.joiningObjectKeyField],
            "to_be_removed"       : false
          };

          $scope.joiningObjectsParsedArray.push(joiningObjectParsed);

        }
      );

      // add temp objects for items which were in $scope.itemObjectsArray, but were not provided in $scope.joiningObjectsArray
      var unprovidedItems = _.difference(_.pluck($scope.itemObjectsArray, $scope.itemObjectKeyField), _.uniq(foundItemsKeys));
      _.each(
        unprovidedItems,
        function(unprovidedItemId) {

          $scope.joiningObjectsParsedArray.push({
            "item_key"            : unprovidedItemId,
            "option_key"          : undefined,
            "joining_object_key"  : undefined,
            "to_be_removed"       : true
          });

        }
      );

      $scope.joiningObjectsParsedArrayItemsKeys = _.uniq(_.pluck($scope.joiningObjectsParsedArray, "item_key"));

      return $scope.buildSelector();

    };



    // parses input options and parsed input data into data used to build UI
    $scope.buildSelector = function() {
        
      var optionsParsed = [];

      $scope.filters.searchPhrase = "";

      // we have all options objects we need, we use them to build data for dropdown UI
      _.each(
        $scope.optionObjectsArray,
        function(option) {

          var inputOptionParsed = {
            "label"       : option[$scope.optionObjectLabelField],
            "key"         : option[$scope.optionObjectKeyField],
            "init_state"  : 0,
            "value"       : false
          };

          inputOptionParsed["joining_objects_items_keys"] = $filter('filter')($scope.joiningObjectsParsedArray, function(joiningObjectParsed) {
        
            if (joiningObjectParsed.option_key == option[$scope.optionObjectKeyField] && joiningObjectParsed.to_be_removed === false) {
              return true;
            }

            return false;

          });

          inputOptionParsed["joining_objects_items_keys"] = _.pluck(inputOptionParsed["joining_objects_items_keys"], "item_key");
          inputOptionParsed["init_state"] = inputOptionParsed["joining_objects_items_keys"].length > 0 ? (inputOptionParsed["joining_objects_items_keys"].length == $scope.joiningObjectsParsedArrayItemsKeys.length ? 2 : 1) : 0;
          inputOptionParsed["value"] = $scope.availableBulkCheckboxStates[inputOptionParsed["init_state"]];

          optionsParsed.push(inputOptionParsed);

        }
      );

      $scope.optionObjectsParsedArray = optionsParsed;
      optionObjectsParsedArrayCopy = angular.copy(optionsParsed);

      return;
      
    };

    $scope.toggleOption = function(option) {

      var check = option.value;
      var joiningObjectsParsedArrayCopy = angular.copy($scope.joiningObjectsParsedArray);

      // loop through items and joining objects 
      // - if there is joining object for selected option and item, but checkbox was unchecked - remove option id from joing object - we'll later know we need to remove joining objects with undefined option keys form database
      // - if there is joining object for selected option and item, and checkbox wass checked - eventually create missing joining objects - with no key - we'll know we need to create them in database
      _.each(
        $scope.itemObjectsArray,
        function(item) {

          var foundIndex = -1;
          
          _.each(
            $scope.joiningObjectsParsedArray,
            function(joiningObjectParsed, index) {
              
              if (item[$scope.itemObjectKeyField] == joiningObjectParsed.item_key) {

                if (joiningObjectParsed.option_key == option.key) {

                  foundIndex = index;
                  return false; //break out of the loop

                }

              }

            }
          );

          if (check && foundIndex < 0) {

            joiningObjectsParsedArrayCopy.push({
              "item_key"            : item[$scope.itemObjectKeyField],
              "option_key"          : option.key,
              "joining_object_key"  : undefined,
              "to_be_removed"       : false
            });

          } else if (!check && foundIndex >= 0) {

            joiningObjectsParsedArrayCopy[foundIndex]["to_be_removed"] = true;

          } else if (check && foundIndex >= 0) {

            joiningObjectsParsedArrayCopy[foundIndex]["to_be_removed"] = false;

          }

        }

      );

      $scope.joiningObjectsParsedArray = joiningObjectsParsedArrayCopy;
      $scope.joiningObjectsParsedArrayItemsKeys = _.uniq(_.pluck($scope.joiningObjectsParsedArray, "item_key"));

      option["joining_objects_items_keys"] = $filter('filter')($scope.joiningObjectsParsedArray, function(joiningObjectParsed) {
    
        if (joiningObjectParsed.option_key == option.key && joiningObjectParsed.to_be_removed === false) {
          return true;
        }

        return false;

      });

      option["joining_objects_items_keys"] = _.pluck(option["joining_objects_items_keys"], "item_key");

    };

    $scope.applyChanges = function() {

      if (_.isFunction($scope.applyChangesCallback)) {

        var collection = [];
        
        _.each(
          $scope.joiningObjectsParsedArray,
          function(joiningObjectParsed) {

            var resultObject = {};

            resultObject[$scope.joiningObjectItemKeyField] = joiningObjectParsed.item_key;
            resultObject[$scope.joiningObjectOptionKeyField] = joiningObjectParsed.option_key;
            resultObject[$scope.joiningObjectKeyField] = joiningObjectParsed.joining_object_key;
            resultObject["to_be_removed"] = joiningObjectParsed.to_be_removed;

            collection.push(resultObject);

          }
        );
          
        collection = $filter('filter')(collection, function(obj) {
      
          return obj[$scope.joiningObjectKeyField] || obj["to_be_removed"] === false;

        });

        return $scope.applyChangesCallback(collection);

      }

      return;

    };

    $scope.onSearchPhraseFilterChange = function() {

      $scope.optionObjectsParsedArray = $filter('filter')(optionObjectsParsedArrayCopy, {'label': $scope.filters.searchPhrase});
      return;

    };

  }],
  
  link: function(scope, element, attrs) {
      
    // watch for changes in joining objects array, eventually rebuild dropdown
    scope.joiningObjectsWatcherDetachHandler = scope.$parent.$watchCollection(attrs['joiningObjects'], function(value) {
      if (_.isArray(value)) {
        scope.joiningObjectsArray = value;
      } else {
        scope.joiningObjectsArray = [];
      }
      scope.parseJoiningData();
    });

    // watch for changes in options array, eventually rebuild dropdown
    scope.optionObjectsWatcherDetachHandler = scope.$parent.$watchCollection(attrs['optionObjects'], function(value) {
      if (_.isArray(value)) {
        scope.optionObjectsArray = value;
      } else {
        scope.optionObjectsArray = [];
      }
      scope.buildSelector();
    });
    
    // watch for changes in items ids array, eventually rebuild dropdown
    scope.itemObjectsWatcherDetachHandler = scope.$parent.$watchCollection(attrs['itemObjects'], function(value, oldValue) {
      if (_.isArray(value)) {
        scope.itemObjectsArray = value;
      } else if (_.isObject(value)) {
        scope.itemObjectsArray = [value];
      } else {
        scope.itemObjectsArray = [];
      }
      scope.parseJoiningData();
    });

    scope.$on("$destroy", function() {
      scope.joiningObjectsWatcherDetachHandler();
      scope.optionObjectsWatcherDetachHandler();
      scope.itemObjectsWatcherDetachHandler();
    });

  }
};