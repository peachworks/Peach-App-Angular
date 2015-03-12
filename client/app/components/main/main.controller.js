'use strict';
/*jshint esnext: true */

const PEACH = new WeakMap();

class MainController {
  constructor ($peach) {
    console.dir($peach);
    PEACH.set(this, $peach);
  }
}

export default MainController;
