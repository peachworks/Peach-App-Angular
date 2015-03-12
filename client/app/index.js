'use strict';
/*jshint esnext: true */

import MainController from './components/main/main.controller';
//import NavbarCtrl from '../components/navbar/navbar.controller';

angular.module('peachApp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute'])
  .controller('MainController', MainController)
  //.controller('NavbarCtrl', NavbarCtrl)

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/main/main.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
