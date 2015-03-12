'use strict';
/*jshint esnext: true */

var moduleName = '$peach';

class PeachService {
  constructor () {
    this.api = {};
    this.user = {};
    this.account = {};
  }

  static peachFactory() {
    return new PeachService();
  }
}

PeachService.peachFactory.$inject = [];

angular.module(moduleName, [])
  .factory('$peach', PeachService.peachFactory);

export default moduleName;
