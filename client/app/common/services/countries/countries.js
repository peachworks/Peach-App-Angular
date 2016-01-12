let moduleName = 'countriesService';

class CountriesService {
  constructor(cakeCommon, $peach, $q) {
    /** cakeUnits service
     * Service which provides country data
     * @author Ryan Marshall
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE VARIABLES **/


    /** PRIVATE FUNCTIONS **/

    /**
     * Used to cache loadCountries request results
     * @param  {object} reqData - response object
     */
    function _processCountries(reqData) {

      var __this = _this;

      __this.countries = reqData.results;
      __this.countriesById = _.object(_.pluck(__this.countries, 'id'), __this.countries);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api('/countries');

      _this.countries = [];
      _this.countriesById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Returns single cached country, or whole array if countryId not specified or incorrect
     * @param  {number} [countryId] - id of the country to get
     * @return {object|Array} single country or all countries array
     */
    _this.getCountry = function(countryId) {

      var __this = _this;

      if (_.isUndefined(countryId)) {
        return __this.countries;
      } else {
        return __this.countriesById[countryId];
      }

    }

    /**
     * Returns cached countries array
     * @return {Array} countries array
     */
    _this.getCountries = function() {

      var __this = _this;

      return __this.countries;

    }

    /**
     * Returns cached countries collection
     * @return {object} countries collection
     */
    _this.getCountriesCollection = function() {

      var __this = _this;

      return __this.countriesById;

    }

    /**
     * Can be used to load countries from db, eventually caching results - it will also ensure there already are some countries on given account
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadCountries = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {
        __this.$resource.find(findParams, otherParams)
          .then(
            function(response) {
              if (!disableCache) {
                _processCountries(response);
              }
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );
      });

    }
  }
}

Countrieservice.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, CountriesService)

export default {moduleName, service: CountriesService};
