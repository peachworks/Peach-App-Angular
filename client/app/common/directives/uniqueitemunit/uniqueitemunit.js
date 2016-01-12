// THIS DIRECTIVE WAS MADE FOR EDIT ITEM PAGE USE ONLY!!!
// WHEN VALIDATING IT USES FORM DATA FROM SCOPE, FORM DATA SOURCE HAS TO BE PROVIDED IN attrs['cakeUniqueItemUnit']
// DATA SOURCE (FORM DATA IN SCOPE) HAS TO HAVE TWO FIELDS NAMED unid_id and unid_quantity
// IT VALIDATES FORM DATA AGAINST ARRAY OF ITEM UNITS IN scope.editedItem.units.data_array

return {
  restrict: 'A',
  require: 'ngModel',
  scope: {
    parent: "=cakeUniqueItemUnitController"
  },
  link: function (scope, element, attrs, ngModel) {

    var scopeFormDataObjectName = attrs['cakeUniqueItemUnit'] || '';

    if (scopeFormDataObjectName) {

      var validate = function() {

        ngModel.$setValidity('unique', true); // by default set to unique

        var unit_id = fetchFromObject(scope.parent, scopeFormDataObjectName)['unit_id'];
        var unit_quantity = fetchFromObject(scope.parent, scopeFormDataObjectName)['unit_quantity'];

        if (unit_id && unit_quantity) {

          var duplicateOf = _.findWhere(scope.parent.editedItem.units.data_array, {unit_id: parseInt(unit_id, 10), conversion_value: parseFloat(unit_quantity)});
          
          if (duplicateOf) {

            ngModel.$setValidity('unique', false);

          }

        }

      };

      // helper function which will be used to find specific nested object data in scope
      var fetchFromObject = function(object, property) {

        if (typeof object === 'undefined') {
          return {};
        }

        var _index = property.indexOf('.');

        if (_index > -1) {
          return fetchFromObject(object[property.substring(0, _index)], property.substr(_index + 1));
        }

        return object[property];

      };

      // watch for any changes od unit id or unit quantity in scope form data
      var detachWatcher1 = scope.$watch(
        function () {

          return fetchFromObject(scope.parent, scopeFormDataObjectName)['unit_id'];

        },
        function(newValue) {

          if (newValue) {

            validate();

          }

        }
      );

      var detachWatcher2 = scope.$watch(
        function () {

          return fetchFromObject(scope.parent, scopeFormDataObjectName)['unit_quantity'];

        },
        function(newValue) {

          if (newValue) {

            validate();

          }

        }
      );

      // on destroy remove watchers
      scope.$on('$destroy', function() {

        detachWatcher1();
        detachWatcher2();

      });

    }

  }
};