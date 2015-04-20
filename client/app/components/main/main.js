/*jshint esnext: true */
'use strict';

class MainController {
  constructor($peach) {
    this.$peach = $peach;
    this.title = 'Hello from Peachworks!';

    this.activate();


  }

  activate() {
    // Bootstrap

  }
}

MainController.$inject = ['$peach'];

export default MainController;
