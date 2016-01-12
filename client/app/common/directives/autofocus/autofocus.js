return {

  link : function(scope, element, attrs) {
   
    var watchUnlinkFunction = scope.$watch(attrs['cakeAutofocus'], function(value) {
    
      if (value) {
       
        $timeout(function() {
       
          element[0].focus();
          return;

        });

      }

      return;

    });

    scope.$on("$destroy", function() {

      watchUnlinkFunction();
      return;

    });

    return;
     
  }

};