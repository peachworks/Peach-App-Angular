'use strict';
/*jshint esnext: true */

function AppConfig($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('peachHttpInterceptor');

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

AppConfig.$inject = ['$routeProvider', '$httpProvider'];

export default AppConfig;
