import peachRc from '../../.peachrc';

import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularAria from 'angular-aria';
import angularCache from 'angular-cache';
import angularCookies from 'angular-cookies';
import angularMaterial from 'angular-material';
import angularRoute from 'angular-route';
import angularSanitize from 'angular-sanitize';
import ngPeach from 'ng-peach';
import _ from 'lodash';

import 'angular-material/angular-material.min.css'
import 'peach.css';

import routing from './app.config';

// Components
import IntroController            from './components/intro/intro';
import MainController             from './components/main/main';
import SetupController            from './components/setup/setup';

angular.module(peachRc.framework.angular.module, [
  angularAnimate,
  angularAria,
  angularCache,
  angularCookies,
  angularMaterial,
  angularRoute,
  angularSanitize,
  'ngPeach.ui'  // Need to fix this to export properly from ngPeach
])
  .config(routing)
  .controller('IntroController', IntroController)
  .controller('MainController', MainController)
  .controller('SetupController', SetupController);

export default peachRc.framework.angular.module;
