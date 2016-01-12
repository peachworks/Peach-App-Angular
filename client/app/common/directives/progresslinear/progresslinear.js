return {

  restrict: 'E',
  replace: true,
  scope: {
    label: '=label',
    value: '=value'
  },
  template: '' +
    '<div class="cake-progress-linear" ng-class="{\'no-label\': !showLabel}" layout="column">' +
        '<div ng-if="showLabel" layout="row" class="md-caption" flex>{{ label }}</div>' +
        '<div layout="row" flex>' +
            '<md-progress-linear md-mode="{{ ::mode }}" ng-value="value"></md-progress-linear>' +
        '</div>' +
        '<div ng-if="showValue" class="inner-label">' +
            '{{ value }}%' +
        '</div>' +
    '</div>',
  controller: ["$scope", function($scope) {

    $scope.value = $scope.value ? $scope.value : 0;
    $scope.label = $scope.label ? $scope.label : 'Progress';
    $scope.showLabel = false;
    $scope.showValue = false;
    $scope.mode = 'indeterminate';

  }],
  link: function(scope, element, attrs) {
      
    if (attrs['showLabel']) {
      scope.showLabel = true;
    } 
    
    if (attrs['showValue']) {
      scope.showValue = true;
    }
    
    if (attrs['mode']) {
      scope.mode = attrs['mode'];
    }
      
  }
};