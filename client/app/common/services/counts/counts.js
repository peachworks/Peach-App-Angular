let moduleName = 'countsService';

class CountsService {
  constructor(cakeCommon, $peach, $q) {


    /** cakeCounts service
     * Service which provides counts data
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE FUNCTIONS **/

    /**
     * Used to cache loadCounts request results
     * @param  {object} reqData - response object
     */
    function _processCounts(reqData) {

      var __this = _this;

      __this.counts = reqData.results;
      __this.countsById = _.object(_.pluck(__this.counts, 'id'), __this.counts);

    }

    /**
     * Used to cache loadOpeningCounts request results
     * @param  {object} reqData - response object
     */
    function _processOpeningCounts(reqData) {

      var __this = _this;

      __this.openingCounts = reqData.results;
      __this.openingCountsById = _.object(_.pluck(__this.openingCounts, 'id'), __this.openingCounts);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('counts'));
      _this.$openingCountsResource = $peach.api(cakeCommon.getObjectKey('opening_counts'));

      _this.counts = [];
      _this.countsById = {};
      _this.openingCounts = [];
      _this.openingCountsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new count in db
     * @param  {object} countData - data which will be used to create new count
     * @return {object} promise with response
     */
    _this.createCount = function(countData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('counts'),
        countData
      );

      return __this.$q(function(resolve, reject) {

        __this.$resource.create(data)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Returns single cached count, or whole array if countId not specified or incorrect
     * @param  {number} [countId] - id of the count to get
     * @return {object|Array} single count or all counts array
     */
    _this.getCount = function(countId) {

      var __this = _this;

      if (_.isUndefined(countId)) {
        return __this.counts;
      } else {
        return __this.countsById[countId];
      }

    }

    /**
     * Returns cached counts array
     * @return {Array} counts array
     */
    _this.getCounts = function() {

      var __this = _this;

      return __this.counts;

    }

    /**
     * Returns cached counts collection
     * @return {object} counts collection
     */
    _this.getCountsCollection = function() {

      var __this = _this;

      return __this.countsById;

    }

    /**
     * Returns cached opening counts array
     * @return {Array} opening counts array
     */
    _this.getOpeningCounts = function() {

      var __this = _this;

      return __this.openingCounts;

    }

    /**
     * Returns cached opening counts collection
     * @return {object} opening counts collection
     */
    _this.getOpeningCountsCollection = function() {

      var __this = _this;

      return __this.openingCountsById;

    }

    /**
     * Can be used to load counts from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadCounts = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {

        //__this.$resource.find(findParams, otherParams)
        __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
          .then(
            function(response) {
              if (!disableCache) {
                _processCounts(response);
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

    /**
     * Can be used to load opening counts from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadOpeningCounts = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {

        //__this.$openingCountsResource.find(findParams, otherParams)
        __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$openingCountsResource, findParams, otherParams)
          .then(
            function(response) {
              if (!disableCache) {
                _processOpeningCounts(response);
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

    /**
     * Deletes count from db
     * @param {number} countId - id of the count to be deleted
     * @return {object} promise with response
     */
    _this.removeCount = function(countId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(countId)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Updates existing count in db
     * @param  {object} countData - data which will be used to update count
     * @return {object} promise with response
     */
    _this.updateCount = function(countData) {

      var __this = _this;

      var data = _.pick(
        countData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('counts')
        )
      );
      data['id'] = countData.id;

      return __this.$q(function(resolve, reject) {

        __this.$resource.update(data)
          .then(
            function(response) {
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


CountsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, CountsService)

export default {moduleName, service: CountsService};
