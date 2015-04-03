'use strict';
/*jshint esnext: true */

class MainController {
  constructor($peach) {
    this.title = 'Hi, from Main!';
  }
}

MainController.$inject = ['$peach'];

export default MainController;
