import Intro from './components/intro/intro';
import Main from './components/main/main';
import Setup from './components/setup/setup';

function AppConfig($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('peachInterceptorAPI');

  $routeProvider
    .when('/intro', {
      name: Intro.name,
      template: Intro.template,
      controller: Intro.controllerName,
      controllerAs: Intro.controllerAs,
      is_welcome_page: true // Reference only.  Change in DevPortal
    })
    .when('/main', {
      name: Main.name,
      template: Main.template,
      controller: Main.controllerName,
      controllerAs: Main.controllerAs
    })
    .when('/settings/setup', {
      name: Setup.name,
      template: Setup.template,
      controller: Setup.controllerName,
      controllerAs: Setup.controllerAs,
      is_settings_page: true  // Reference only.  Change in DevPortal
    })
    .otherwise({
      redirectTo: '/intro'
    });
}

AppConfig.$inject = ['$routeProvider', '$httpProvider'];

export default AppConfig;
