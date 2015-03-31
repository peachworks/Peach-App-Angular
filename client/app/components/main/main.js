'use strict';
/*jshint esnext: true */

class MainController {
  constructor() {
    this.title = 'Hi, from Main!';
  }

  truthy() {
    return true;
  }
}

MainController.$inject = [];


export default MainController;
