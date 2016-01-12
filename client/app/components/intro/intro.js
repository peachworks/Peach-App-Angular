
class IntroController {
  constructor($scope, $location, $log, $peach, $q, $window, commonService, cakeCounts,
              cakeItems, cakeActiveLocations, cakeSharedData, cakeInvoices, cakeSettings,
              cakeVendors) {
    /** Items settings page
     * Inventory items management page
     * @author Radoslaw Wrzesien
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = $scope;



    /** PRIVATE VARIABLES (non-scope variables) **/


    /** PRIVATE FUNCTIONS (non-scope functions) **/


    function _calculateCompletion() {

      var __this = _this;
      
      __this.introCompletion = 0;

      // step 1
      if (__this.inventoryLocations.length > 0 || __this.accountLocations.length === 1) {

        __this.stepsCompletion[1] = true;
        __this.introCompletion += 10;
        __this.selectedLocationId = __this.inventoryLocations[0].id
        __this.stepOneTitle += ' (' + __this.accountLocationsById[__this.inventoryLocations[0].id].name + ')';
      }
      
      // step 2
      if (__this.inventoryVendorsCount > 0 && __this.stepsCompletion[1]) {
        __this.stepsCompletion[2] = true;
        __this.introCompletion += 10;
      }
      
      // step 3
      if (__this.stepsCompletion[1] && __this.stepsCompletion[1] && __this.stepsCompletion[2]) {
        if (__this.inventoryItemsCount >= 10) {
          __this.stepsCompletion[3] = true;
          __this.introCompletion += 20;
        } else {
          __this.introCompletion += (2 * __this.inventoryItemsCount);  
        }
      }

      // step 4
      if (_.find(__this.inventoryCounts, function(count){return count.is_complete === true;}) && __this.stepsCompletion[1] && __this.stepsCompletion[2] && __this.stepsCompletion[3]) {
        __this.stepsCompletion[4] = true;
        __this.introCompletion += 20;
      }

      // step 5
      if (__this.inventoryInvoicesCount > 0 && __this.stepsCompletion[1] && __this.stepsCompletion[2] && __this.stepsCompletion[3] && __this.stepsCompletion[4]) {
        __this.stepsCompletion[5] = true;
        __this.introCompletion += 20;
      }

      // step 6
      if (_.max(
        _.values(
          _.countBy(
            _.filter(__this.inventoryCounts, function(count){return count.is_complete === true;}),
            'count_group_id'
          )
        )
      ) > 1 && __this.stepsCompletion[1] && __this.stepsCompletion[2] && __this.stepsCompletion[3] && __this.stepsCompletion[4] && __this.stepsCompletion[5]
         ) {
        __this.stepsCompletion[6] = true;
        __this.introCompletion += 20;
      }

    }


    /** CONSTRUCTOR **/

    function _constructor($scope, $location, $log, $peach, $q, $window, cakeCommon, cakeCounts, cakeItems, cakeActiveLocations, cakeSharedData, cakeInvoices, cakeSettings, cakeVendors) {

      _this.$location = $location;
      _this.$log = $log;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$window = $window;

      // Required services
      _this.cakeCommon = cakeCommon;
      _this.cakeCounts = cakeCounts;
      _this.cakeInvoices = cakeInvoices;
      _this.cakeItems = cakeItems;
      _this.cakeActiveLocations = cakeActiveLocations;
      _this.cakeSharedData = cakeSharedData;
      _this.cakeSettings = cakeSettings;
      _this.cakeVendors = cakeVendors;

      // Steps data
      _this.stepOneTitle = 'Step One: Pick a Location';
      _this.introCompletion = 0;
      _this.stepsCompletion = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false
      };

      // Stuff that is really need to check if steps were completed
      _this.inventoryLocations = []; // step 1
      _this.inventoryVendorsCount = 0; // step 2
      _this.inventoryItemsCount = 0; // step 3
      _this.inventoryCounts = [];    // step 4 & 6
      _this.inventoryInvoicesCount = 0;    // step 5

      // Other controller data
      _this.accountLocations = [];
      _this.accountLocationsIds = [];
      _this.appInfo = {};
      _this.blockers = {
        api_processing  : false
      };
      _this.inventoryLocationsIds = [];
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.selectedLocationId = null;

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      // show loading message
      __this.blockers.api_processing = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      __this.$q.all({
        locations         : __this.cakeActiveLocations.loadActiveLocations(null, {sort: 'created_at'}),
        items             : __this.cakeItems.loadItems(null, {}),
        counts            : __this.cakeCounts.loadCounts(null, {}),
        invoices          : __this.cakeInvoices.loadInvoices(null, {}),
        accountLocations  : __this.$peach.account.getLocations(),
        appInfo           : __this.$peach.app.getInfo(),
        vendors           : __this.cakeVendors.loadVendors(null, {}),
        isAccountAdmin    : __this.cakeCommon.isUserAccountAdmin()
      })
        .then(
          function(results) {
            console.log(results);
            __this.inventoryLocations = results.locations.results || [];
            __this.inventoryItemsCount = results.items.count || 0;
            __this.inventoryCounts = results.counts.results || [];
            __this.inventoryInvoicesCount = results.invoices.count || 0;
            __this.accountLocations = results.accountLocations || [];
            __this.accountLocationsById = _.object(_.pluck(results.accountLocations, 'id'), results.accountLocations);
            __this.appInfo = results.appInfo;
            __this.inventoryVendorsCount = results.vendors.count;
            __this.isAccountAdmin = results.isAccountAdmin;
            
            __this.accountLocationsIds = _.pluck(__this.accountLocations, 'id');

            if (__this.accountLocations.length === 1) {
              if (!(_.find(__this.inventoryLocations, function(loc){ return loc.location_id === __this.accountLocations[0].id;})) && __this.isAccountAdmin) {
                __this.selectedLocationId = __this.accountLocations[0].id;
                __this.setupLocation(__this.selectedLocationId);
              } else {
                _calculateCompletion();
              }
            } else {
              _calculateCompletion();
            }

          },
          function(error) {

            __this.$log.error(error);

          }
        ).finally(
          function() {
            __this.blockers.api_processing = false;
          }
        );
    }

    // For step 3
    _this.createStartingCount = function() {

      var __this = _this;

      __this.blockers.api_processing = true;

      var now = moment();

      __this.cakeCounts.createCount(
        {
          date: now.format('YYYY-MM-DD'),
          time: now.format('HH:mm:ss'),
          is_opening: true,
          location_id: __this.inventoryLocations[0].location_id
        }
      ).then(
        function(results) {

          __this.cakeCounts.updateCount(
            {
              id: results.id,
              is_complete: true
            }
          ).then(
            function(results) {

              __this.inventoryCounts.push(results);
              _calculateCompletion();

            },
            function(error) {

              __this.$log.error(error);

            }
          ).finally(
            function() {
              __this.blockers.api_processing = false;
            }
          );

        },
        function(error) {

          __this.$log.error(error);

        }
      ).finally(
        function() {
          __this.blockers.api_processing = false;
        }
      );

    }

    // Hide Intro Page
    _this.hideIntroPage = function() {

      var __this = _this;

      __this.blockers.api_processing = true;

      __this.$peach.user.setPref(
        'hide_cake_welcome_page',
        true
      ).then(
        function(results) {
          __this.$peach.event.publish(
            __this.$peach.event.events.HIDE_INTRO_PAGE, 
            {'key': __this.appInfo.key}
          );

          __this.$location.path('#/intro');
          
        },
        function(error) {

          __this.$log.error(error);

        }
      ).finally(
        function() {
          __this.blockers.api_processing = false;
        }
      );
      
    }

    // Redirect to Items Page with setting which allows to open Add Count
    _this.goToItems = function() {

      var __this = _this;
      
      __this.cakeSharedData.setValue('items_page_init_action', 'open_item_form');
      __this.$location.path('/settings/items');
      
    }

    // Redirect to Reports App
    _this.goToReports = function() {

      var __this = _this;

      var url = __this.$location.absUrl().replace('apps/cake#/intro', 'reports');

      __this.$window.location.href = url;

    }

    // For step 1
    _this.setupLocation = function(selectedLocationId) {

      var __this = _this;

      __this.blockers.api_processing = true;

      __this.cakeSettings.activateLocation(
        {
          location_id: parseInt(selectedLocationId)
        }
      ).then(
        function(results) {

          __this.inventoryLocations.push(results)  ;
          _calculateCompletion();

        },
        function(error) {

          __this.$log.error(error);

        }
      ).finally(
        function() {
          __this.blockers.api_processing = false;
        }
      );

    }


    /** PUBLIC FUNCTIONS **/

  }
}

IntroController.$inject = ['$scope', '$location', '$log', '$peach', '$q', '$window',
                           'commonService', 'countsService', 'itemsService',
                           'activeLocationsService', 'sharedDataService', 'invoicesService',
                           'settingsService', 'vendorsService'];

export default IntroController;