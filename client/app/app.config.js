/*jshint esnext: true */
'use strict';

function AppConfig($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      name: 'Title',
      path: 'main',
      position: 0
    })
    .when('/settings', {
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      name: 'Settings',
      path: 'settings',
      position: 0,
      is_settings_page: true,
      is_welcome_page: false
    })
    .otherwise({
      redirectTo: '/'
    });
}

AppConfig.$inject = ['$routeProvider'];

export default AppConfig;
