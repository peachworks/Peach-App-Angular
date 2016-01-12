
class CountsController {
  constructor($document, $filter, $location, $peach, $q, cakeCommon, cakeCountGroups,
              cakeCounts, cakePermissions, cakeSettings) {

    /** Counts page
     * Displays counts, with option to add new ones
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE VARIABLES (non-scope variables) **/

    /** PRIVATE FUNCTIONS (non-scope functions) **/

    function _buildCountGroupsSearchIdsParam(searchQuery) {

      var __this = _this;

      var selectedCountGroups = __this.$filter("filter")(__this.countGroups, {"name": searchQuery});

      return _.pluck(selectedCountGroups, ['id']);

    }

    function _buildTableRequestParams() {

      var __this = _this;

      var findQueryElements = [];

      return __this.$q(function(resolve, reject) {

        __this.requestParams = {};

        if (__this.searchParams.searchQuery !== '') {

          var findQuerySubelements = [];
          var countGroupsSearchIds = _buildCountGroupsSearchIdsParam(__this.searchParams.searchQuery);

          if (countGroupsSearchIds.length > 0) {

            findQuerySubelements.push(
              {
                'count_group_id': countGroupsSearchIds
              }
            );

          }

          if (moment(__this.searchParams.searchQuery, 'l').isValid()) {

            findQuerySubelements.push(
              {
                'date': moment(__this.searchParams.searchQuery, 'l').format('YYYY-MM-DD')
              }
            );

          }

          if (findQuerySubelements.length > 0) {

            if (findQuerySubelements.length > 1) {

              findQueryElements.push(
                {
                  '$or': findQuerySubelements
                }
              );

            } else {

              findQueryElements.push(findQuerySubelements[0]);

            }

          }
          
        }

        if (__this.filters.location_id) {
          findQueryElements.push(
            {
              'location_id': __this.filters.location_id
            }
          );
        }

        __this.requestParams.page = __this.pagination.page_no;
        __this.requestParams.limit = __this.pagination.limit;
        //__this.requestParams.sort = ((__this.tableSort.order === 'desc') ? '-' : '') + __this.tableSort.field;
        __this.requestParams.sort = '-date,-created_at';

        if (findQueryElements.length > 0) {
          __this.requestParams.find = {
            '$and': findQueryElements
          };
        }

        resolve(true);

      });

    }

    function _getLocationAndLoadTableData(locationId) {

      var __this = _this;

      if (locationId) {

        __this.blockers.no_location = false;

        if (__this.activeLocationsById[locationId]) {

          __this.filters.location_id = locationId;

          // if we havent yet checked if there are any counts in this location, do this before anything else
          if (_.isUndefined(__this.locationCountsCheck[locationId])) {

            _checkLocationCounts(locationId)
              .then(
                function(countsNumber) {

                  __this.locationCountsCheck[locationId] = countsNumber;
                  _getLocationAndLoadTableData(locationId);

                },
                function(error) {

                  __this.errorHandler(error);
                  __this.blockers.api_processing = false;

                }
              )

            // else - if we have already checked if there are any counts for given location, but there arent any - open new count form right away
          } else if (__this.locationCountsCheck[locationId] == 0 && __this.canEditCounts) {

            __this.openNewCountModal();

            // finally - if we have already checked if there are any counts, and there are some, continue
          } else {

            __this.onPaginationChangeCallback();

          }

        } else {
          
          __this.counts = [];
          __this.countsById = {};
          __this.pagination.total_items = 0;

          __this.showMessage("Selected location is not an active Cake location.");
          __this.blockers.api_processing = false;
          __this.blockers.no_location = true;

        }

      } else {

        __this.counts = [];
        __this.countsById = {};
        __this.pagination.total_items = 0;
        
        __this.blockers.api_processing = false;
        __this.blockers.no_location = true;

      }

    }

    function _loadCounts() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _buildTableRequestParams()
          .then(
            function() {

              var findParams = __this.requestParams.find || null;
              var otherParams = _.omit(__this.requestParams, 'find');

              __this.$q.all(
                [
                  __this.cakeCounts.loadCounts(
                    findParams,
                    otherParams
                  ),
                  __this.cakeCounts.loadOpeningCounts(
                    {
                      'location_id': __this.filters.location_id
                    }
                  )
                ]
              )
                .then(
                  function(results) {

                    __this.pagination.total_items = results[0]['count'] || 0;

                    resolve(results);

                  },
                  function(error) {

                    reject(error);

                  }
                );

            }
          );

      });

    }

    function _loadTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        if (__this.filters.location_id) {

          __this.blockers.api_processing = true;

          _loadCounts()
            .then(
              function(results) {

                _parseTablePageData()
                  .then(
                    function() {

                      __this.hideMessage();
                      __this.blockers.api_processing = false;

                      __this.$document[0].getElementById('page_frame').scrollTop = 0;

                      resolve(true);

                    }
                  );

              },
              function(error) {

                __this.errorHandler(error);
                __this.blockers.api_processing = false;

                reject(error);

              }
            );

        } else {

          __this.counts = [];
          __this.countsById = {};
          __this.pagination.total_items = 0;

          __this.blockers.api_processing = false;
          __this.blockers.no_location = true;

        }    

      });

    }

    function _parseTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.counts = __this.cakeCounts.getCounts();
        __this.openingCounts = __this.cakeCounts.getOpeningCounts();
        __this.openingCountsById = __this.cakeCounts.getOpeningCountsCollection();

        var openingCountsByCountGroupId = _.groupBy(__this.openingCounts, function(openingCount) { return openingCount.count_group_id });

        _.each(
          __this.counts,
          function(count) {

            count.is_opening_count = false;
            count.date_formatted = moment(count.date, 'YYYY-MM-DD').format('l');
            count.count_group = __this.countGroupsById[count.count_group_id];
            count.status = count.percent_complete ? parseFloat(Big(count.percent_complete).toFixed(2)) : 0;

            if (openingCountsByCountGroupId[count.count_group_id]) {

              // there should be always one opening count per count group and location, so we may assume the first one is the only one and is correct
              count.is_opening_count = (moment(openingCountsByCountGroupId[count.count_group_id][0]['count_date'], 'YYYY-MM-DD').diff(moment(count.date, 'YYYY-MM-DD'), 'days') == 0) ? true : false;

            }

            __this.countsById[count.id] = count;

            return;

          }
        );

        resolve(true);

      });

    }

    function _checkLocationCounts(locationId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.cakeCounts.loadCounts(
          {
            'location_id' : locationId
          },
          {
            'fields'  : 'id',
            'limit'   : 1
          },
          true
        )
          .then(
            function(response) {

              resolve(response.count);

            },
            function(error) {

              reject(error);

            }

          );

      });

    }

    function _prepareCountGroups() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.countGroups = __this.cakeCountGroups.getCountGroups();
        __this.countGroupsById = __this.cakeCountGroups.getCountGroupsCollection();

        resolve(true);

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($document, $filter, $location, $peach, $q, cakeCommon, cakeCountGroups, cakeCounts, cakePermissions, cakeSettings) {

      _this.$document = $document;
      _this.$filter = $filter;
      _this.$location = $location;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeCounts = cakeCounts;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;

      _this.blockers = {
        api_processing : false,
        no_location    : true
      };

      _this.headerOptions = [
        {
          callback: _this.openNewCountModal,
          label: 'Add Count'
        }
      ];

      //*** Table data related variables ***//
      _this.pagination = {
        limit       : 50,
        page_no     : 1,
        total_items : 0
      };
      _this.paginationLimits = [
        50
      ];
      /*_this.tableSort = {
        field : 'name',
        order : 'asc'
        };*/
      _this.requestParams = {}; // all counts requests params - find filter and pagination stuff
      _this.filters = {
        location_id         : null
      };
      _this.searchParams = {searchQuery: ''}; // used to filter count groups table

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditCounts = false; // if user has permission to edit counts
      _this.countGroups = []; // all available count groups array
      _this.countGroupsById = {}; // all available count groups collection - ids are keys
      _this.counts = []; // all available counts array
      _this.countsById = {}; // all available counts collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.openingCounts = []; // opening counts array - from wtm_inv_opening_counts table
      _this.openingCountsById = {}; // opening counts collection - ids are keys - from wtm_inv_opening_counts table
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.locationCountsCheck = {} // here we will keep number of counts by location ids ( i mean 0 or 1 if there are some). Every time location changes we will first check if there are any counts, and if not - we will open new count form immediately

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.blockers.api_processing = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations and count groups
      __this.$q.all({
        is_account_admin      : __this.cakeCommon.isUserAccountAdmin(),
        active_locations      : __this.cakeSettings.getSettings('active_locations'),
        can_edit_counts       : __this.cakePermissions.userHasPermission('edit_counts'),
        count_groups          : __this.cakeCountGroups.loadCountGroups(null, {sort: 'name'})
      })
        .then(
          function(results) {

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditCounts = results['can_edit_counts'];

            _prepareCountGroups()
              .then(
                function() {

                  // get active location from locations dropdown and continue
                  _getLocationAndLoadTableData(__this.$peach.session.getActiveLocation());

                  // watch for location changes
                  __this.$peach.event.subscribe(__this.$peach.event.events.LOCATION_CHANGE, function(id) {

                    if (_.isUndefined(id) || _.isNumber(id) || _.isNull(id)) {

                      _getLocationAndLoadTableData(id);

                    }

                  });

                }
              );

          },
          function(error) {

            __this.blockers.api_processing = false;
            __this.canEditCounts = false;

            __this.errorHandler(error);

          }
        );

    }



    /** PUBLIC FUNCTIONS **/

    // handle errors
    _this.errorHandler = function(error, logError, callback) {

      var __this = _this;

      var message = '';

      logError = logError || false;

      if (_.isString(error)) {

        message = 'There was an error: ' + error;

      } else {

        message = 'There was an error, please check console log for more details.';

      }

      __this.showMessage(message, 'alert');

      if (logError) {

        __this.cakeCommon.apiErrorHandler(error);

      }

      if (_.isFunction(callback)) {

        return callback();

      }

      return;

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.onPaginationChangeCallback = function() {

      var __this = _this;

      _loadTablePageData();

    }

    _this.onSearchPhraseUpdateCallback = function() {

      var __this = _this;

      __this.pagination.page_no = 1;

      __this.onPaginationChangeCallback();

    }

    _this.openNewCountModal = function() {

      var __this = _this;

      if (!__this.blockers.no_location) {

        __this.$location.path('/edit_count');
        
      }

    }

    _this.openEditCountModal = function(countId) {

      var __this = _this;

      __this.$location.path('/edit_count').search({id: countId});

    }

    // shows user friendly message
    _this.showMessage = function(message, type) {

      var __this = _this;

      type = type || 'info';

      __this.userInfo.message = message;
      __this.userInfo.type = type;

      return;

    }
  }
}


CountsController.$inject = ['$document', '$filter', '$location', '$peach', '$q', 'commonService',
                            'countGroupsService', 'countsService', 'permissionsService', 'settingsService'];

export default CountsController;
