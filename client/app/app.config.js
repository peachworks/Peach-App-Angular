/*jshint esnext: true */
'use strict';

function AppConfig($routeProvider, /*$httpProvider, */$peachSessionProvider) {

  angular.extend($peachSessionProvider.defaults, {
    apiURL: 'https://api.peachworks.com'
  });

  //$httpProvider.interceptors.push('peachHttpInterceptor');

  $routeProvider
    .when('/', {
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      title: "Title",
      position: 0
    })
    .when('/settings', {
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      title: "Settings",
      position: 0,
      is_settings_page: true,
      is_welcome_page: false
    })
    .otherwise({
      redirectTo: '/'
    });
}

AppConfig.$inject = ['$routeProvider', /*'$httpProvider', */'$peachSessionProvider'];

export default AppConfig;
