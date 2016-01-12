let moduleName = 'eventsService';

class EventsService {
  constructor(cakeCommon, $peach, $q) {
    /** cakeEvents service
     * Service which provides events data
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
     * Used to cache loadEvents request results
     * @param  {object} reqData - response object
     */
    function _processEvents(reqData) {

      var __this = _this;

      __this.events = reqData.results;
      __this.eventsById = _.object(_.pluck(__this.events, 'id'), __this.events);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('events'));

      _this.events = [];
      _this.eventsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new event in db
     * @param  {object} eventData - data which will be used to create new event
     * @return {object} promise with response
     */
    _this.createEvent = function(eventData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('events'),
        eventData
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
     * Returns single cached event, or whole array if eventId not specified or incorrect
     * @param  {number} [eventId] - id of the event to get
     * @return {object|Array} single event or all events array
     */
    _this.getEvent = function(eventId) {

      var __this = _this;

      if (_.isUndefined(eventId)) {
        return __this.events;
      } else {
        return __this.eventsById[eventId];
      }

    }

    /**
     * Returns cached events array
     * @return {Array} events array
     */
    _this.getEvents = function() {

      var __this = _this;

      return __this.events;

    }

    /**
     * Returns cached events collection
     * @return {object} events collection
     */
    _this.getEventsCollection = function() {

      var __this = _this;

      return __this.eventsById;

    }

    /**
     * Can be used to load events from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadEvents = function(findParams, otherParams, disableCache) {

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
                _processEvents(response);
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
     * Deletes event from db
     * @param {number} eventId - id of the event to be deleted
     * @return {object} promise with response
     */
    _this.removeEvent = function(eventId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(eventId)
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
     * Updates existing event in db
     * @param  {object} eventData - data which will be used to update event
     * @return {object} promise with response
     */
    _this.updateEvent = function(eventData) {

      var __this = _this;

      var data = _.pick(
        eventData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('events')
        )
      );
      data['id'] = eventData.id;

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

EventsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, EventsService)

export default {moduleName, service: EventsService};