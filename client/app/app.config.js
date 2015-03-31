'use strict';
/*jshint esnext: true */

function AppConfig($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .otherwise({
      redirectTo: '/'
    });
}

AppConfig.$inject = ['$routeProvider'];

export default AppConfig;
