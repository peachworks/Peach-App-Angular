let moduleName = 'countGroupsService';

class CountGroupsService {
  constructor(cakeCommon, $peach, $q) {
    /** cakeCountGroups service
     * Service which provides count groups data
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

    var countGroupsInitializePromise = null;
    var defaultCountGroup = null;
    var predefinedFrequencies = {};



    /** PRIVATE FUNCTIONS **/

    /**
     * Creates readable string from weekdays names array
     * @param  {Array} weekdaysArray - array of weekdays
     * @return {string} readable string
     */
    function _createWeekdaysReadableEnum(weekdaysArray) {

      var __this = _this;

      var result = '';

      _.each(
        weekdaysArray,
        function(weekday, index) {

          if (index === 0) {

            result = result + __this.cakeCommon.uppercaseWord(weekday);

          } else if (index === weekdaysArray.length - 1) {

            result = result + ' and ' + __this.cakeCommon.uppercaseWord(weekday);

          } else {

            result = result + ', ' + __this.cakeCommon.uppercaseWord(weekday);

          }

          return;

        }

      );

      return result;

    }

    /**
     * Used to cache loadCountGroups request results
     * @param  {object} reqData - response object
     */
    function _processCountGroups(reqData) {

      var __this = _this;

      __this.countGroups = reqData.results;
      __this.countGroupsById = _.object(_.pluck(__this.countGroups, 'id'), __this.countGroups);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('count_groups'));

      _this.countGroups = [];
      _this.countGroupsById = {}
      _this.countGroupsInitialized = false;

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      countGroupsInitializePromise = __this.$q(function(resolve, reject) {

        //__this.$resource.find(null, {limit: 1000})
        __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource)
          .then(
            function(response) {

              predefinedFrequencies = {
                Weekly      : {
                  schedule_type     : 'week',
                  schedule_interval : 1,
                  schedule_days     : null,
                  start_date        : moment().startOf('week').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                'Bi-Weekly'   : {
                  schedule_type     : 'week',
                  schedule_interval : 2,
                  schedule_days     : null,
                  start_date        : moment().startOf('week').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                Monthly     : {
                  schedule_type     : 'month',
                  schedule_interval : 1,
                  schedule_days     : null,
                  start_date        : moment().startOf('month').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                Period      : { // this one should be account-specific, for now it's predefined just like Monthly option
                  schedule_type     : 'month',
                  schedule_interval : 1,
                  schedule_days     : null,
                  start_date        : moment().startOf('month').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                Annual      : {
                  schedule_type     : 'year',
                  schedule_interval : 1,
                  schedule_days     : null,
                  start_date        : moment().startOf('year').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                Quarterly   : {
                  schedule_type     : 'month',
                  schedule_interval : 4,
                  schedule_days     : null,
                  start_date        : moment().startOf('quarter').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                Daily       : {
                  schedule_type     : 'day',
                  schedule_interval : 1,
                  schedule_days     : null,
                  start_date        : moment().startOf('day').format(__this.cakeCommon.getDatabaseDateFormat()),
                  next_date         : null
                },
                Never       : {
                  schedule_type     : 'never',
                  schedule_interval : 0,
                  schedule_days     : null,
                  start_date        : null,
                  next_date         : null
                }
              };

              _.each(
                predefinedFrequencies,
                function(data) {
                  data.next_date = data.start_date ? moment(data.start_date).add(data.schedule_interval, data.schedule_type + 's').format(__this.cakeCommon.getDatabaseDateFormat()) : null;
                }
              );

              defaultCountGroup = response.trigger_response ? (response.trigger_response.default_count_group ? response.trigger_response.default_count_group : null) : null;

              __this.countGroupsInitialized = true;

              resolve(true);

            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Creates new count group in db
     * @param  {object} countGroupData - data which will be used to create new count group
     * @return {object} promise with response
     */
    _this.createCountGroup = function(countGroupData) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('count_groups'),
        countGroupData
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
     * Returns single cached count group, or whole array if countGroupId not specified or incorrect
     * @param  {number} [countGroupId] - id of the count group to get
     * @return {object|Array} single count group or all count groups array
     */
    _this.getCountGroup = function(countGroupId) {

      var __this = _this;

      if (_.isUndefined(countGroupId)) {
        return __this.countGroups;
      } else {
        return __this.countGroupsById[countGroupId];
      }

    }

    /**
     * Returns cached count groups array
     * @return {Array} count groups array
     */
    _this.getCountGroups = function() {

      var __this = _this;

      return __this.countGroups;

    }

    /**
     * Returns cached count groups collection
     * @return {object} count groups collection
     */
    _this.getCountGroupsCollection = function() {

      var __this = _this;

      return __this.countGroupsById;

    }

    /**
     * Returns default count group data
     * @return {object} promise with default count group
     */
    _this.getDefaultCountGroup = function() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        if (__this.countGroupsInitialized) {

          resolve(defaultCountGroup);

        } else {

          countGroupsInitializePromise
            .then(
              function() {
                resolve(defaultCountGroup);
              },
              function(error) {
                reject(error);
              }
            );

        }

      });

    }

    /**
     * Returns predefined count group frequencies
     * @return {object} promise with predefined frequencies
     */
    _this.getPredefinedFrequencies = function() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        if (__this.countGroupsInitialized) {

          resolve(predefinedFrequencies);

        } else {

          countGroupsInitializePromise
            .then(
              function() {
                resolve(predefinedFrequencies);
              },
              function(error) {
                reject(error);
              }
            );

        }

      });

    }

    /**
     * Transforms given count group frequency fields into readable string
     * @param  {object} countGroup - count group object, with all fields
     * @return {object} object with two options of readable string - shorter and longer
     */
    _this.getReadableFrequency = function(countGroup) {

      var __this = _this;

      if (countGroup.schedule_type && countGroup.schedule_type !== 'never') {

        var result = {
          short : '',
          full  : ''
        };

        if (!countGroup.schedule_interval || countGroup.schedule_interval === 1) {

          result.full = 'Every ' + __this.cakeCommon.uppercaseWord(countGroup.schedule_type);
          result.short = (countGroup.schedule_type === 'day') ? 'daily' : countGroup.schedule_type + 'ly';
          result.short = (countGroup.schedule_type === 'year') ? 'Annual' : result.short; //exception for 1 year interval
          result.short = __this.cakeCommon.uppercaseWord(result.short);

        } else {

          result.short = result.full = 'Every ' + countGroup.schedule_interval + ' ' + __this.cakeCommon.uppercaseWord(countGroup.schedule_type) + 's';

          if (countGroup.schedule_interval === 2) {

            result.short = (countGroup.schedule_type === 'day') ? 'daily' : countGroup.schedule_type + 'ly';
            result.short = 'Bi-' + __this.cakeCommon.uppercaseWord(result.short);

          }

          if (countGroup.schedule_interval === 4 && countGroup.schedule_type === 'month') {

            result.short = 'Quarterly'; //exception for Quarterly

          }

        }

        if (countGroup.schedule_type === 'week' && countGroup.schedule_days) {

          var scheduleDaysArr = countGroup.scheduleDaysArr ? countGroup.scheduleDaysArr : JSON.parse(countGroup.schedule_days);
          result.short = result.short + ' (' + _.map(scheduleDaysArr, __this.cakeCommon.uppercaseWord).join(', ') + ')';
          result.full = result.full + ' on ' + _createWeekdaysReadableEnum(scheduleDaysArr);

        }

        return result;

      }

      return {
        short : 'Never',
        full  : 'Never'
      };

    }

    /**
     * Can be used to load count groups from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadCountGroups = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {

        if (__this.countGroupsInitialized) {

          //__this.$resource.find(findParams, otherParams)
          __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
            .then(
              function(response) {
                if (!disableCache) {
                  _processCountGroups(response);
                }
                resolve(response);
              },
              function(error) {
                __this.cakeCommon.apiErrorHandler(error);
                reject(error);
              }
            );

        } else {

          countGroupsInitializePromise
            .then(
              function() {
                
                //__this.$resource.find(findParams, otherParams)
                __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
                  .then(
                    function(response) {
                      if (!disableCache) {
                        _processCountGroups(response);
                      }
                      resolve(response);
                    },
                    function(error) {
                      __this.cakeCommon.apiErrorHandler(error);
                      reject(error);
                    }
                  );

              },
              function(error) {
                reject(error);
              }
            );

        }

      });

    }

    /**
     * Deletes count group from db
     * @param {number} countGroupId - id of the count group to be deleted
     * @return {object} promise with response
     */
    _this.removeCountGroup = function(countGroupId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(countGroupId)
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
     * Updates existing count group in db
     * @param  {object} countGroupData - data which will be used to update count group
     * @return {object} promise with response
     */
    _this.updateCountGroup = function(countGroupData) {

      var __this = _this;

      var data = _.pick(
        countGroupData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('count_groups')
        )
      );
      data['id'] = countGroupData.id;

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


CountGroupsService.$inject = ['commonService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, CountGroupsService)

export default {moduleName, service: CountGroupsService};