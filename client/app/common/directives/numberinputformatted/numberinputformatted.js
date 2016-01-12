/** cakeNumberInputFormatted
 * This directive ensures value in input type=number will always have at least 2, and max 5 decimals displayed
 * It will also validate given value if it's a valid cake float format
 * @author Mike Bebas/Levitated
 */

return {
  restrict : 'A',
  require  : 'ngModel',
  compile: function compile(tElement, tAttrs, transclude) {
    
    return {
        
      pre: function preLink(scope, element, attrs, ngModel) {
      
        var cakeFloatRegex = cakeCommon.getCakeFloatRegex();
        var fractionSize = null;
        var formatter = function(modelValue) {
            
          return !ngModel.$isEmpty(modelValue) ? cakeCommon.parseCakeCostFloatValue(modelValue, null, fractionSize) : null;
          
        }
        
        if (attrs['round'] && _.isNumber(parseInt(attrs['round'], 10))) {
            
          fractionSize = parseInt(attrs['round'], 10);
          
        }
        
        ngModel.$formatters.push(formatter);

        ngModel.$parsers.unshift(function(viewValue) {

          // consider empty value to be valid
          if (ngModel.$isEmpty(viewValue)) {
            
            return null;

          } else {

            if (cakeFloatRegex.test(viewValue)) {

              ngModel.$setValidity('cakeFloat', true);

              if (_.isNumber(viewValue)) {

                return viewValue;

              } else {

                return parseFloat(viewValue.replace(',', '.'));

              }

            } else {

              ngModel.$setValidity('cakeFloat', false);
              return undefined;

            }

          }

        });
        
        element.bind('blur', function() {
            
          ngModel.$viewValue = formatter(ngModel.$modelValue);
          ngModel.$render();
          
        });

      }

    }
    
  }
};