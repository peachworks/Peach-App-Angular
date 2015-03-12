'use strict';
/*jshint esnext: true */

import MainController from './components/main/main.controller';
import $peach from './common/services/peach.service';

function AppController($router) {
  $router.config([
    {path:'/', redirectTo: '/main'},
    {path:'/', component: 'main'}
  ]);
}

angular.module('peachApp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngNewRouter', $peach])
  .controller('AppController', ['$router', AppController])
  .controller('MainController', [MainController]);
