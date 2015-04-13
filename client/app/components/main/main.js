/*jshint esnext: true */
'use strict';

class MainController {
  constructor($peach) {
    this.$peach = $peach;
    this.title = 'Hello from Peachworks!';
  }
}

MainController.$inject = ['$peach'];

export default MainController;
