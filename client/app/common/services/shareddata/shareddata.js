let moduleName = 'sharedDataService';

class SharedDataService {
  constructor($peach) {


    /** cakeSharedData service
     * Service which can be used to share some data between app controllers
     * This was made to eliminate passing data by $location.search() params - changing those always make $routeProvider to reload app controller and view - it's not always a good solution, sometimes it breaks worflow
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE VARIABLES **/

    var sharedData = {};



    /** CONSTRUCTOR **/

    function _constructor($peach) {

      _this.$peach = $peach;

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Gets value from shared object
     * @param  {string} [key] - optional key, if not specified, will return whole object
     * @return {object|*} any type of data which was held in shared object, or whole object
     */
    _this.getValue = function(key) {

      if (_.isUndefined(key)) {
        return sharedData;
      }

      return sharedData[key];

    }

    /**
     * Can be used to set value in shared data object
     * @param {string} key - key under which we'll store the data
     * @param {*} value - value to be stored, can be of any type
     */
    _this.setValue = function(key, value) {

      sharedData[key] = value;
      return;

    }

    /**
     * Can be used to removed stored shared data object value
     * @param  {string} key - key of the value we want to remove
     */
    _this.unsetValue = function(key) {

      delete sharedData[key];
      return;

    }
  }
}

SharedDataService.$inject = ['$peach'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, SharedDataService)

export default {moduleName, service: SharedDataService};
