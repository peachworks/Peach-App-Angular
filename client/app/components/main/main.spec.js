import peachApp from '../../app';
import Main from './main';

describe('Component: Main', () => {
  let $rootScope, $controller, ctrl;

  beforeEach(angular.mock.module(peachApp));

  beforeEach(angular.mock.inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    ctrl = $controller(Main.controllerName, {});
  }));

  describe('Constructor', () => {

    it('should construct a Main Controller', () => {
      expect(ctrl.title).to.be.equals('Main Page');
    });
  });

  describe('Functions', () => {

  });
});
