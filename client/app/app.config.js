/*jshint esnext: true */
'use strict';

function AppConfig($routeProvider, $httpProvider, $peachSessionProvider) {

  angular.extend($peachSessionProvider.defaults, {
    apiURL: 'https://api.dev.peachworks.com/v1'
  });

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

AppConfig.$inject = ['$routeProvider', '$httpProvider', '$peachSessionProvider'];

export default AppConfig;
