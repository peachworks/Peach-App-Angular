'use strict';

describe('Component: Main', function() {

  beforeEach(module('peachApp'));

  describe('Constructor', function() {

    it('should construct a Main Controller', inject(function($controller) {
      var vm = $controller('MainController', {});

      expect(vm.title).to.exist;
    }));
  });
});
