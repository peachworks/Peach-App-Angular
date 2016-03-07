import peachApp from '../../app';
import Setup from './setup';

describe('Component: Setup', () => {
  let $rootScope, $controller, ctrl;

  beforeEach(angular.mock.module(peachApp));

  beforeEach(angular.mock.inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    ctrl = $controller(Setup.controllerName, {});
  }));

  describe('Constructor', () => {

    it('should construct a Setup Controller', () => {
      expect(ctrl.title).to.be.equals('Setup Page');
    });
  });

  describe('Functions', () => {

  });
});
