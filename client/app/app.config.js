'use strict';

function AppConfig($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('peachInterceptorAPI');

  $routeProvider
    .when('/intro', {
      name: 'Intro',
      position: 0,
      template: require('./components/intro/intro.html'),
      controller: 'IntroController',
      controllerAs: 'intro',
      is_welcome_page: true
    })
    .when('/main', {
      name: 'Main',
      position: 1,
      template: require('./components/main/main.html'),
      controller: 'MainController',
      controllerAs: 'main'
    })
    .when('/settings/setup', {
      name: 'Setup',
      position: 0,
      template: require('./components/setup/setup.html'),
      controller: 'SetupController',
      controllerAs: 'setup',
      is_settings_page: true
    })
    .otherwise({
      redirectTo: '/intro'
    });
}

AppConfig.$inject = ['$routeProvider', '$httpProvider'];

export default AppConfig;
