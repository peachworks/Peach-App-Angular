
class CountGroupsController {
  constructor($document, $location, $q, cakeCommon, cakeCountGroups, cakeItems,
              cakePermissions, cakeSettings) {

    /** Count groups settings page
     * Displays count groups
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

    function _buildTableRequestParams() {

      var __this = _this;

      var findQueryElements = [];

      return __this.$q(function(resolve, reject) {

        __this.requestParams = {};

        if (__this.searchParams.searchQuery !== '') {

          findQueryElements.push(
            {
              'name': {
                "$like" : __this.searchParams.searchQuery
              }
            }
          );      

        }

        __this.requestParams.page = __this.pagination.page_no;
        __this.requestParams.limit = __this.pagination.limit;
        //__this.requestParams.sort = ((__this.tableSort.order === 'desc') ? '-' : '') + __this.tableSort.field;
        __this.requestParams.sort = 'name';

        if (findQueryElements.length > 0) {
          __this.requestParams.find = {
            '$and': findQueryElements
          };
        }

        resolve(true);

      });

    }

    function _loadCountGroups() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _buildTableRequestParams()
          .then(
            function() {

              var findParams = __this.requestParams.find || null;
              var otherParams = _.omit(__this.requestParams, 'find');

              __this.cakeCountGroups.loadCountGroups(
                findParams,
                otherParams
              )
                .then(
                  function(response) {

                    __this.pagination.total_items = response.count || 0;

                    __this.cakeItems.loadItems(
                      {
                        count_group_id: _.keys(__this.cakeCountGroups.getCountGroupsCollection())
                      }
                    )
                      .then(
                        function(response2) {

                          resolve(response);

                        },
                        function(error) {

                          reject(error);

                        }
                      );

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

        /*__this.showMessage('Loading count groups...');*/
        __this.blockers.api_processing = true;

        _loadCountGroups()
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

      });

    }

    function _parseTablePageData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _prepareItems()
          .then(
            function() {

              _prepareCountGroups()
                .then(
                  function() {

                    resolve(true);

                  }
                )

            }
          );

      });

    }

    function _prepareCountGroups() {

      var __this = _this;

      __this.countGroups = __this.cakeCountGroups.getCountGroups();
      __this.countGroupsById = {};

      return __this.$q(function(resolve, reject) {

        _.each(
          __this.countGroups,
          function(countGroup) {

            countGroup.items = __this.itemsByCountGroup[countGroup.id] || [];
            countGroup.schedule_days_arr = (countGroup.schedule_days) ? JSON.parse(countGroup.schedule_days) : [];
            countGroup.frequency = __this.cakeCountGroups.getReadableFrequency(countGroup);
            countGroup.frequency_short = countGroup.frequency.short;
            countGroup.number_of_items = countGroup.items.length;
            __this.countGroupsById[countGroup.id] = countGroup;

            return;

          }
        );

        resolve(true);

      });

    }

    function _prepareItems() {

      var __this = _this;

      __this.items = __this.cakeItems.getItems();
      __this.itemsById = {};
      __this.itemsByCountGroup = {};

      return __this.$q(function(resolve, reject) {

        _.each(
          __this.items,
          function(item) {

            __this.itemsByCountGroup[item.count_group_id] = __this.itemsByCountGroup[item.count_group_id] || [];
            __this.itemsByCountGroup[item.count_group_id].push(item);

            __this.itemsById[item.id] = item;

            return;

          }
        );

        resolve(true);

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($document, $location, $q, cakeCommon, cakeCountGroups, cakeItems, cakePermissions, cakeSettings) {

      _this.$document = $document;
      _this.$location = $location;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeItems = cakeItems;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;

      _this.blockers = {
        api_processing : false
      };

      _this.headerOptions = [
        {
          path  : 'settings/edit_count_group',
          label : 'Add Count Group'
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
      _this.filters = {};
      _this.searchParams = {searchQuery: ''}; // used to filter count groups table

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditCountGroups = false; // if user has permission to edit count groups
      _this.countGroups = []; // all available count groups array
      _this.countGroupsById = {}; // all available count groups collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.items = []; // all available inventory items array
      _this.itemsById = {}; // all available inventory items collection - ids are keys
      _this.itemsByCountGroup = {};
      _this.predefinedFrequencies = {}; // predefined frequencies for count groups
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      /*// show loading message
        __this.showMessage("Loading data...");*/
      __this.blockers.api_processing = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations and count groups
      __this.$q.all({
        is_account_admin      : __this.cakeCommon.isUserAccountAdmin(),
        active_locations      : __this.cakeSettings.getSettings('active_locations'),
        can_edit_count_groups : __this.cakePermissions.userHasPermission('edit_count_groups'),
        predefined_frequencies: __this.cakeCountGroups.getPredefinedFrequencies()
      })
        .then(
          function(results) {

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.isAccountAdmin = results['is_account_admin'];
            __this.canEditCountGroups = results['can_edit_count_groups'];

            __this.predefinedFrequencies = results['predefined_frequencies'];

            _loadTablePageData();

          },
          function(error) {

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

    _this.openEditCountGroupModal = function(countGroupId) {

      var __this = _this;

      __this.$location.path('/settings/edit_count_group').search({id: countGroupId});

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

CountGroupsController.$inject = ['$document', '$location', '$q', 'commonService',
                                 'countGroupsService', 'itemsService', 'permissionsService',
                                 'settingsService'];
export default CountGroupsController;