import peachApp from '../../app';
import {IntroController} from './intro';

describe('Component: Intro', () => {
  let $rootScope, $controller, ctrl;

  beforeEach(angular.mock.module(peachApp));

  beforeEach(angular.mock.inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    ctrl = $controller('IntroController', {});
  }));

  describe('Constructor', () => {

    it('should construct a Intro Controller', () => {
      expect(ctrl.title).to.be.equals('Intro Page');
    });
  });

  describe('Functions', () => {

    describe('setTitle', () => {

      it('should set a new title', () => {
        ctrl.setTitle('New Title');
        expect(ctrl.title).to.be.equals('New Title');
      });
    });
  });
});
