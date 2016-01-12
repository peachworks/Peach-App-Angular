/** cakeCustomMultiselectSelectorDirective
 * Directive used to display multiselect dropdown
 * @author Mike Bebas/Levitated
 */

// public functions
return {
  restrict: 'A',
  replace: true,
  scope: {
    "disabled": "=dropdownDisabled",
    "onChangeCallback": "=onChangeCallback",
    "onCloseCallback": "=onCloseCallback"
  },

  template:
    '<div class="btn-group cakeCustomMultiselectSelector" dropdown>' +
        '<button type="button" class="btn btn-default" ng-disabled="disabled"><i>{{label}}</i></button>' +
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-disabled="disabled">' +
            '<span class="caret"></span>' +
            '<span class="sr-only">Split button!</span>' +
        '</button>' +
        '<ul class="dropdown-menu" role="menu">' +
            '<li>' +
                '<form class="form-inline" role="form" style="padding: 5px;" novalidate>' +
                    '<div class="form-group" style="width: 100%;">' +
                        '<input type="search" ng-model="filters.searchPhrase" ng-change="onSearchPhraseFilterChange()"  class="form-control input-sm" style="width: 100%;" placeholder="Search..." />' +
                    '</div>' +
                '</form>' +
            '</li>' +
            '<li>' +
                '<span style="width: 100%; display: block; float: left;">' +
                    '<a ng-click="toggleAllOptions($event);" class="pull-left" style="font-size: 11px; padding: 0px; margin: 0px 5px 15px 5px; display: inline; clear: none;">{{checkAllToggle ? "uncheck all" : "check all"}}</a>' +
                    '<a ng-click="toggleVisible($event);" class="pull-right" style="font-size: 11px; padding: 0px; margin: 0px 5px 15px 5px; display: inline; clear: none;">{{filters.showChecked ? "show all" : "show checked"}}</a>' +
                '</span>' +
            '</li>' +
            '<li ng-repeat="option in selectorOptions">' +
                '<a ng-click="toggleOption($index, $event);" style="padding: 3px 0px;">' +
                    '<span style="display: inline-block; width: 75%; margin: 3px 5%;">' +
                        '{{option[labelField]}}' +
                    '</span>' +
                    '<span style="padding: 3px 0px 3px 0px; width: 10%; display: inline-block;">' +
                        '<span ng-show="option[checkedField]" class="icon-ok-1"></span>' +
                    '</span>' +
                '</a>' +
            '</li>' +
        '</ul>' +
    '</div>',

  controller: ["$scope", function($scope) {

    $scope.results = []; // array which holds key fields values of checked options
    $scope.selectorOptions = []; // all available dropdown options
    $scope.selectorOptionsWatcherDetachHandler = null; // de-register parent watch function
    $scope.checkAllToggle = false;
    $scope.defaultLabel = "options";
    $scope.label = "";
    $scope.keyField = "id"; // field name which will be used as key field of the option object
    $scope.labelField = "label"; // field name which will be used as label field of the option object
    $scope.checkedField = "isChecked"; // field name which will be used as "checked" field of the option object
    $scope.filters = {
      "searchPhrase": "",
      "showChecked": false
    };

    var onChangeCallback = _.isFunction($scope.onChangeCallback) ? $scope.onChangeCallback : function(){};
    var optionsCopy = angular.copy($scope.selectorOptions); // copy of all dropdown options

    // builds dropdown - actually just creates a copy of all options, to be used later where needed
    $scope.buildSelector = function() {

      optionsCopy = angular.copy($scope.selectorOptions);
      return;

    };

    // executes when search phrase changes and updates dropdown data
    $scope.onSearchPhraseFilterChange = function() {

      $scope.filters.showChecked = false;
      var filter = {};
      filter[$scope.labelField] = $scope.filters.searchPhrase;
      $scope.selectorOptions = $filter('filter')(optionsCopy, filter);

      return;

    };

    // toggles checked/unchecked options
    $scope.toggleVisible = function(e) {

      e.stopPropagation();

      $scope.filters.showChecked = !$scope.filters.showChecked;

      $scope.filters.searchPhrase = "";

      if ($scope.filters.showChecked) {
        $scope.selectorOptions = $filter('filter')(optionsCopy, function(option) {
          return option[$scope.checkedField];
        });
      } else {
        $scope.selectorOptions = angular.copy(optionsCopy);
      }

      return;

    };

    // toggles given option and updates result
    $scope.toggleOption = function(index, e) {

      e.stopPropagation();

      var option = $scope.selectorOptions[index];
      var isChecked = !option[$scope.checkedField]
      option[$scope.checkedField] = isChecked;

      if (!isChecked) {
        $scope.results = _.without($scope.results, option[$scope.keyField]);
      } else {
        $scope.results.push(option[$scope.keyField]);
      }

      $scope.results = _.uniq($scope.results);
      onChangeCallback($scope.results);

      $scope.buildSelector();
      $scope.updateLabel();

      return;

    };

    // toggles all options and updates result
    $scope.toggleAllOptions = function(e) {

      e.stopPropagation();

      $scope.selectorOptions = angular.copy(optionsCopy);
      $scope.checkAllToggle = !$scope.checkAllToggle;

      return async.forEach(
        $scope.selectorOptions,
        function(option, callback) {
          option[$scope.checkedField] = $scope.checkAllToggle;

          if (!$scope.checkAllToggle) {
              $scope.results = _.without($scope.results, option[$scope.keyField]);
          } else {
              $scope.results.push(option[$scope.keyField]);
          }

          return callback();
        },
        function(error) {
          $scope.buildSelector();
          $scope.results = _.uniq($scope.results);
          onChangeCallback($scope.results);
          $scope.updateLabel();
          return;
        }
      );

    };

    // updates label each time options are toggled or dropdown is updated
    $scope.updateLabel = function() {

      var length = $scope.results.length;

      if (length === 0) {
        $scope.label = "Select " + $scope.defaultLabel;
      } else if (length === 1) {
        var opt = _.find(optionsCopy, function(o) {
          return o[$scope.keyField] === $scope.results[0];
        });
        $scope.label = opt[$scope.labelField];
      } else if (length === optionsCopy.length) {
        $scope.label = "All selected";
      } else {
        $scope.label = length + " selected";
      }

      return;

    };

  }],

  link: function(scope, element, attrs) {

    scope.keyField = attrs['keyField'] || scope.keyField;
    scope.labelField = attrs['labelField'] || scope.labelField;
    scope.checkedField = attrs['checkedField'] || scope.checkedField;
    scope.defaultLabel = attrs['defaultLabel'] || scope.defaultLabel;

    // build label
    scope.updateLabel();

    // watch for changes in input options array, eventually rebuild dropdown
    scope.selectorOptionsWatcherDetachHandler = scope.$parent.$watchCollection(attrs['selectorOptions'], function(value) {

      var input = [];

      if (_.isArray(value)) {
        scope.selectorOptions = angular.copy(value);
      } else {
        scope.selectorOptions = [];
      }

      _.each(
        scope.selectorOptions,
        function(option) {
          if (option.isChecked) {
            input.push(option[scope.keyField]);
          }
          return;
        }
      );

      scope.results = _.uniq(input);
      scope.buildSelector();
      scope.updateLabel();

      return;

    }, true);

    scope.$on("$destroy", function() {
      scope.selectorOptionsWatcherDetachHandler();
    });

    // if there's a callback function specified to be called after dropdown closes, call it each time dropdown is closed
    if (_.isFunction(scope.onCloseCallback)) {
      element.on('hidden.bs.dropdown', function () {
        scope.onCloseCallback();
      });
    }

    $(element).find('input').on("click", function (e) {
      e.stopPropagation();
    });

    return;

  }
};