/*jshint esnext: true */
'use strict';

// Config
import AppConfig from './app.config';

// Controllers
import MainController from './components/main/main';

angular.module('peachApp', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ngResource',
  'ngRoute',
  'ngMaterial',
  'ngPeach'
])
  .config(                        AppConfig)
  .controller('MainController',   MainController);

export default 'peachApp';
