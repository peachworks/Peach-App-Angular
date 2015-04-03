/*jshint esnext: true */
'use strict';

class MainController {
  constructor($peach) {
    this.title = 'Hi, from Main!';
  }
}

MainController.$inject = ['$peach'];

export default MainController;
