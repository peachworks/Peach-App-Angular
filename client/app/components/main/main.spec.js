/*jshint esnext: true */
'use strict';

import peachApp from '../../app';
import MainController from './main';

describe('Component: Main', function() {

  beforeEach(angular.mock.module(peachApp));

  describe('Constructor', function() {

    it('should construct a Main Controller', inject(function($controller) {
      var vm = $controller('MainController', {});

      expect(vm.title).to.exist;
    }));
  });
});
