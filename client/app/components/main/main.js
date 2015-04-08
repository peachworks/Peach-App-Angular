/*jshint esnext: true */
'use strict';

class MainController {
  constructor($peach) {
    this.MyDogs = null;
    this.dogs = {};
    this.$peach = $peach;
    this.title = 'Hello from Peachworks!';

    this.activate();
  }
}

MainController.$inject = ['$peach'];

export default MainController;
