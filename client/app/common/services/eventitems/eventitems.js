let moduleName = 'eventItemsService';

class EventItemsService {
  constructor(cakeCommon, $peach, $q) {
    /** cakeEventItems service
     * Service which provides event items data
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
     * Used to cache loadEventItems request results
     * @param  {object} reqData - response object
     */
    function _processEventItems(reqData) {

      var __this = _this;

      __this.eventItems = reqData.results;
      __this.eventItemsById = _.object(_.pluck(__this.eventItems, 'id'), __this.eventItems);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('event_items'));

      _this.eventItems = [];
      _this.eventItemsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new event item in db
     * @param  {object} eventItemData - data which will be used to create new event item
     * @return {object} promise with response
     */
    _this.createEventItem = function(eventItemData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('event_items'),
        eventItemData
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
     * Returns single cached event item, or whole array if eventItemId not specified or incorrect
     * @param  {number} [eventItemId] - id of the event item to get
     * @return {object|Array} single event item or all event items array
     */
    _this.getEventItem = function(eventItemId) {

      var __this = _this;

      if (_.isUndefined(eventItemId)) {
        return __this.eventItems;
      } else {
        return __this.eventItemsById[eventItemId];
      }

    }

    /**
     * Returns cached event items array
     * @return {Array} event items array
     */
    _this.getEventItems = function() {

      var __this = _this;

      return __this.eventItems;

    }

    /**
     * Returns cached event items collection
     * @return {object} event items collection
     */
    _this.getEventItemsCollection = function() {

      var __this = _this;

      return __this.eventItemsById;

    }

    /**
     * Can be used to load event items from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadEventItems = function(findParams, otherParams, disableCache) {

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
                _processEventItems(response);
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
     * Deletes event item from db
     * @param {number} eventItemId - id of the event item to be deleted
     * @return {object} promise with response
     */
    _this.removeEventItem = function(eventItemId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(eventItemId)
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
     * Updates existing event item in db
     * @param  {object} eventItemData - data which will be used to update event item
     * @return {object} promise with response
     */
    _this.updateEventItem = function(eventItemData) {

      var __this = _this;

      var data = _.pick(
        eventItemData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('event_items')
        )
      );
      data['id'] = eventItemData.id;

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

EventItemsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, EventItemsService)

export default {moduleName, service: EventItemsService};
