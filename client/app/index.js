'use strict';
/*jshint esnext: true */

import MainController from './components/main/main.controller';
//import NavbarCtrl from '../components/navbar/navbar.controller';

angular.module('peachApp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngNewRouter'])
  .controller('AppController', ['$router', AppController])
  .controller('MainController', [MainController]);

function AppController($router) {

  $router.config([
    {path:'/', redirectTo: '/main'},
    {path:'/', component: 'main'}
  ]);
}
