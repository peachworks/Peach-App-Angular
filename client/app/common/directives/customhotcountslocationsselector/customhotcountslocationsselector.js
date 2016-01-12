/** cakeCustomHotCountsLocationsSelectorDirective
 * Directive used to manipulate hot counts
 * @author Mike Bebas/Levitated
 */

// public functions
return {
  restrict: 'A',
  replace: true,
  scope: {
    "disabled": "=dropdownDisabled",
    "onCloseCallback": "=onCloseCallback",
    "onChangeCallback": "=onChangeCallback"
  },

  template:
    '<div class="btn-group cakeCustomHotCountsLocationsSelector" dropdown>' +
        '<button type="button" class="btn btn-default" ng-disabled="disabled"><i>{{label}}</i></button>' +
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-disabled="disabled">' +
            '<span class="caret"></span>' +
            '<span class="sr-only">Split button!</span>' +
        '</button>' +
        '<ul class="dropdown-menu" role="menu">' +
            '<li>' +
                '<form class="form-inline" role="form" style="padding: 5px;" novalidate>' +
                    '<div class="form-group" style="width: 100%;">' +
                        '<input type="search" ng-model="filters.searchPhrase" ng-change="onSearchPhraseFilterChange();" class="form-control input-sm" style="width: 100%;" placeholder="Search..." />' +
                    '</div>' +
                '</form>' +
            '</li>' +
            '<li>' +
                '<span style="width: 100%; display: block; float: left;">' +
                    '<a ng-click="toggleAllLocations($event);" class="pull-left" style="font-size: 11px; padding: 0px; margin: 0px 5px 15px 5px; display: inline; clear: none;">{{checkAllToggle ? "uncheck all" : "check all"}}</a>' +
                    '<a ng-click="toggleVisible($event);" class="pull-right" style="font-size: 11px; padding: 0px; margin: 0px 5px 15px 5px; display: inline; clear: none;">{{filters.showChecked ? "show all" : "show checked"}}</a>' +
                '</span>' +
            '</li>' +
            '<li ng-repeat="location in locationsParsed">' +
                '<a ng-click="toggleLocation($index, $event);" style="padding: 3px 0px;">' +
                    '<span style="position: relative; padding: 3px 0px 3px 10px;">' +
                        '<input type="checkbox" readonly onclick="return false;" />' +
                        '<span ng-show="location.connectionIds.length > 0 && location.connectionIds.length === location.hotCountsConnectionIds.length" class="icon-ok-1" style="color: #9c0735; position: absolute;float: none;display: block;top: -2px;left: 8px;"></span>' +
                        '<span ng-show="location.connectionIds.length > 0 && location.connectionIds.length !== location.hotCountsConnectionIds.length && location.hotCountsConnectionIds.length > 0" class="icon-minus" style="color: #9c0735; position: absolute;float: none;display: block;top: -1px;left: 7px;"></span>' +
                    '</span>' +
                    '<span style="margin-left: 10px;" >' +
                        '{{location.locationName}}' +
                    '</span>' +
                '</a>' +
            '</li>' +
        '</ul>' +
    '</div>',

  controller: ["$scope", function($scope) {

    $scope.result = {};
    $scope.itemLocations = []; // available item locations objects
    $scope.itemLocationsWatcherDetachHandler = null; // used to de-register parent watch function
    $scope.itemIds = []; // ids of items we want to manipulate locations for
    $scope.itemIdsWatcherDetachHandler = null; // used to de-register parent watch function
    $scope.locationsParsed = []; // parsed item locations data used to build dropdown ui
    $scope.checkAllToggle = false;
    $scope.label = "locations";
    $scope.filters = {
      "searchPhrase": "",
      "showChecked": false
    };

    var onChangeCallback = _.isFunction($scope.onChangeCallback) ? $scope.onChangeCallback : function(){};
    var locationsParsedCopy = angular.copy($scope.locationsParsed); // copy of parsed data
    var itemLocationsFiltered = []; // item locations objects filtered for just with given item ids from itemIds

    // parses input data into data used to build UI
    $scope.buildSelector = function() {

      var locationsParsed = {};

      // in the beginning we'll have to filter all given item locations and get only those which relate to item ids from $scope.itemIds array - we don't want to display locations which are not connected with items we operate on
      itemLocationsFiltered = $filter('filter')($scope.itemLocations, function(itemLocation) {
        var result = false;

        if ($scope.itemIds.length > 0) {
          if ($scope.itemIds.indexOf(itemLocation.inv_item_id) >= 0) {
            result = true;
          }
        }

        return result;
      });

      // next, after we have all item locations we need, we use them to build data for dropdown UI
      return async.forEach(
        itemLocationsFiltered,
        function(itemLocation, callback) {
          locationsParsed[itemLocation.location.id] = locationsParsed[itemLocation.location.id] || {
            locationName: itemLocation.location.name,
            locationId: itemLocation.location.id,
            connectionIds: [],
            itemIds: [],
            hotCountsConnectionIds: []
          };
          locationsParsed[itemLocation.location.id].connectionIds.push(itemLocation.id);
          locationsParsed[itemLocation.location.id].itemIds.push(itemLocation.inv_item_id);
          if (itemLocation.is_hot_count) {
              locationsParsed[itemLocation.location.id].hotCountsConnectionIds.push(itemLocation.id);
          }
          return callback();
        },
        function(error) {
          $scope.locationsParsed = _.values(locationsParsed);
          locationsParsedCopy = angular.copy($scope.locationsParsed);
          return;
        }
      );

    };

    // executes when search phrase changes and updates dropdown data
    $scope.onSearchPhraseFilterChange = function() {

      $scope.filters.showChecked = false;
      $scope.locationsParsed = $filter('filter')(locationsParsedCopy, {'locationName': $scope.filters.searchPhrase});
      return;

    };

    // toggles checked/unchecked locations (TADA!)
    $scope.toggleVisible = function(event) {

      event.stopPropagation();

      $scope.filters.showChecked = !$scope.filters.showChecked;
      
      $scope.filters.searchPhrase = "";

      if ($scope.filters.showChecked) {
        $scope.locationsParsed = $filter('filter')(locationsParsedCopy, function(location) {
          return location.connectionIds.length === location.hotCountsConnectionIds.length;
        });
      } else {
        $scope.locationsParsed = angular.copy(locationsParsedCopy);
      }

      return;

    };

    // toggles is_hot_count for all item locations bound to given location - updates not only parsed location for dropdown UI, but also $scope.result object
    $scope.toggleLocation = function(index, event) {

      event.stopPropagation();

      var parsedLocation = $scope.locationsParsed[index];
      var checkAll = parsedLocation.connectionIds.length !== parsedLocation.hotCountsConnectionIds.length;
      var itemLocationsToUpdate = $filter('filter')(itemLocationsFiltered, function(itemLocation) {
        var result = false;

        if (parsedLocation.connectionIds.indexOf(itemLocation.id) >= 0) {
          result = true;
        }

        return result;
      });

      return async.forEach(
        itemLocationsToUpdate,
        function(itemLocation, callback) {
          itemLocation.is_hot_count = checkAll;
          $scope.result[itemLocation.id] = checkAll;
          return callback();
        },
        function(error) {
          onChangeCallback($scope.result);
          return $scope.buildSelector();
        }
      );

    }

    // toggles is_hot_count value for all item locations - of course only those filtered to be used in dropdown, also updates $scope.result
    $scope.toggleAllLocations = function(event) {

      event.stopPropagation();

      $scope.checkAllToggle = !$scope.checkAllToggle;

      return async.forEach(
        itemLocationsFiltered,
        function(itemLocation, callback) {
          itemLocation.is_hot_count = $scope.checkAllToggle;
          $scope.result[itemLocation.id] = $scope.checkAllToggle;
          return callback();
        },
        function(error) {
          onChangeCallback($scope.result);
          return $scope.buildSelector();
        }
      );

    }

  }],

  link: function(scope, element, attrs) {

    // watch for changes in input item locations array, eventually rebuild dropdown
    scope.itemLocationsWatcherDetachHandler = scope.$parent.$watchCollection(attrs['itemLocations'], function(value) {
      if (_.isArray(value)) {
        scope.itemLocations = value;
      } else {
        scope.itemLocations = [];
      }
      scope.result = {};
      scope.buildSelector();
    });

    // watch for changes in input item ids array, eventually rebuild dropdown
    scope.itemIdsWatcherDetachHandler = scope.$parent.$watch(attrs['itemIds'], function(value) {
      if (_.isArray(value)) {
        scope.itemIds = value;
      } else if (_.isNumber(value)) {
        scope.itemIds = [value];
      } else {
        scope.itemIds = [];
      }
      scope.result = {};
      scope.buildSelector();
    });

    scope.$on("$destroy", function() {
      scope.itemLocationsWatcherDetachHandler();
      scope.itemIdsWatcherDetachHandler();
    });

    $(element).on('hidden.bs.dropdown', function () {
      if (_.isFunction(scope.onCloseCallback) && !_.isEmpty(scope.result)) {
        scope.onCloseCallback();
      }
    });

    $(element).find('input').on("click", function (e) {
      e.stopPropagation();
    });

  }
};