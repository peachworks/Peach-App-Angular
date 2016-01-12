
class BulkAddItemsController {
  constructor($location, $mdDialog, $peachToast, $q, cakeCommon, cakeCountGroups,
              cakeGLAccounts, cakeItems, cakeItemsDBItems, cakeItemsDBCategories,
              cakeItemsDBItemTags, cakeItemsDBTags, cakePermissions, cakeSettings) {
    /** Bulk add items settings modal page
     * Can be used to add multiple items from ItemsDB at once
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

    function _addItemsDBItem(itemsDBItem) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        itemsDBItem.saving = true;

        var newItemData = {
          'name'            : itemsDBItem.name,
          'gl_account_id'   : null,
          'count_group_id'  : null,
          'common_unit_id'  : itemsDBItem.common_unit_id,
          'item_db_id'      : itemsDBItem.id,
          'is_active'       : true,
          'locations'       : _.pluck(__this.activeLocations, 'id')
        };

        __this.cakeItemsDBItems.getItemsDBItemGLAccountFromCategoryId(itemsDBItem.category_id)
          .then(
            function(result) {

              newItemData.gl_account_id = result.id;
              newItemData.count_group_id = __this.defaultCountGroup.id;

              _createNewItem(
                newItemData
              )
                .then(
                  function(newItemData) {

                    itemsDBItem.already_added = true;
                    itemsDBItem.saving = false;

                    __this.bulkFormData.progress.processed_items++;
                    __this.bulkFormData.progress.percentage = parseInt((__this.bulkFormData.progress.processed_items / __this.bulkFormData.progress.total_items) * 100);

                    resolve(newItemData);

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

      });

    }

    function _createNewItem(itemData) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var extendedOptions = {extended: true};

        if (itemData.item_db_id) { // add item_db_id to query params so the BEFORE POST trigger would load data for new item from itemsDB
          extendedOptions.item_db_id = itemData.item_db_id;
        }

        __this.cakeItems.createItem(
          itemData,
          extendedOptions
        )
          .then(
            function(newItemData) {

              resolve(newItemData);

            },
            function(error) {

              reject(error);

            }
          );

      });

    }

    function _hidePageBlockingPopup() {

      var __this = _this;

      __this.$mdDialog.hide();

    }

    function _preloadItemsDBCommonData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$q.all([
          __this.cakeItemsDBCategories.getData(null, {sort: 'name'}),
          __this.cakeItemsDBTags.getData(null, {sort: 'name'}),
        ])
          .then(
            function(results) {

              __this.itemsDBCategories = results[0]['results'] ? results[0]['results'] : [];
              __this.itemsDBTags = results[1]['results'] ? results[1]['results'] : [];

              __this.$q.all([
                _prepareItemsDBCategories(),
                _prepareItemsDBTags()
              ])
                .then(
                  function() {

                    resolve(true);

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

      });

    }

    function _prepareItemsDBCategories() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _.each(
          __this.itemsDBCategories,
          function(itemDBCategory) {
            itemDBCategory.is_category = true;
            __this.itemsDBCategoriesById[itemDBCategory.id] = itemDBCategory;
            return;
          }
        );

        resolve(true);

      });

    }

    function _prepareItemsDBTags() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _.each(
          __this.itemsDBTags,
          function(itemDBTag) {
            __this.itemsDBTagsById[itemDBTag.id] = itemDBTag;
            return;
          }
        );

        resolve(true);

      });

    }

    function _prepareUpdateItemsDBSearchResultsParams() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var findQueryElements = [];

        if (__this.bulkFormData.search_query !== '') {

          findQueryElements.push(
            {
              'name': {
                '$like': __this.bulkFormData.search_query
              }
            }
          );

        }

        if (__this.bulkFormData.search_category_tag_index !== null) {

          var categoryTag = __this.itemDBCategoriesAndTags[parseInt(__this.bulkFormData.search_category_tag_index, 10)];

          // if selected category - it's pretty straightforward, just load items with category_id like the one selected
          if (categoryTag.is_category) {

            findQueryElements.push(
              {
                'category_id': categoryTag.id
              }
            );

            resolve(findQueryElements);

            // if not category, but a tag, first find all itemDB items ids which belong to this tag
          } else {

            __this.cakeItemsDBItemTags.getData(
              {
                'tag_id' : categoryTag.id
              },
              {
                fields: 'item_id',
              }
            )
              .then(
                function(response) {

                  if (response.results && response.results.length > 0) {

                    findQueryElements.push(
                      {
                        'id': _.pluck(response.results, 'item_id')
                      }
                    );

                  } else {

                    findQueryElements.push(
                      {
                        'id': 0
                      }
                    );

                  }

                  resolve(findQueryElements);

                },
                function(error) {

                  reject(error);

                }
              );

          }

        } else {

          resolve(findQueryElements);

        }

      });

    }

    function _showPageBlockingPopup(initialItemsToProcess) {

      var __this = _this;

      __this.bulkFormData.progress.total_items = initialItemsToProcess;
      __this.bulkFormData.progress.processed_items = 0;
      __this.bulkFormData.progress.percentage = 0;

      __this.$mdDialog.show({
        escapeToClose       : false,
        clickOutsideToClose : false,
        parent              : angular.element(document.getElementsByClassName("peach-modal")),
        locals              : {
          percentage          : __this.bulkFormData.progress.percentage
        },
        template            : '<md-dialog flex-sm="60" flex-md="45" flex-gt-md="25">' +
          '  <md-dialog-content>' +
          '     <p>'+
          '         <div layout="row" flex>Please wait while we process your items.<br /><br /></div>' +
          '         <div layout="row" flex>' +
          //'             <cake-progress-linear value="percentage"></cake-progress-linear>' + 
          '             <cake-progress-linear style="width: 100%;"></cake-progress-linear>' +          
          '         </div>' +
          '     </p>' +
          '  </md-dialog-content>' +
          '</md-dialog>',
        controller          : ['$scope', '$mdDialog', 'percentage', function DialogController($scope, $mdDialog, percentage) {
          $scope.percentage = percentage;
        }]
      });

    }

    function _showToast(message) {

      var __this = _this;

      __this.$peachToast.show(message);

    }

    function _updateItemsDBSearchResults() {

      var __this = _this;

      __this.blockers.api_processing = true;

      __this.bulkFormData.cached_options = [];

      _prepareUpdateItemsDBSearchResultsParams()
        .then(
          function(paramsArray) {

            if (paramsArray.length > 1) {
              paramsArray = {'$and' : paramsArray};
            } else if (paramsArray.length == 1) {
              paramsArray = paramsArray[0];
            } else {
              paramsArray = null;
            }

            __this.cakeItemsDBItems.getData(
              paramsArray,
              {
                'limit'   : __this.pagination.limit,
                'page'    : __this.pagination.page_no,
                'fields'  : 'id,name,category_id,common_unit_id',
                'sort'    : 'name'
              }
            )
              .then(
                function(itemsDBresponse) {

                  if (itemsDBresponse.results && itemsDBresponse.results.length > 0) {

                    __this.pagination.total_items = itemsDBresponse.count || 0;

                    __this.cakeItems.loadItems(
                      {
                        'name'    : {
                          '$in'     : _.pluck(itemsDBresponse.results, 'name')
                        }
                      },
                      {
                        'fields'  : 'id,name,item_db_id'
                      },
                      true
                    )
                      .then(
                        function(response) {

                          var addedItemsNames = _.pluck(response.results, 'name');

                          _.each(
                            itemsDBresponse.results,
                            function(itemsDBitem) {

                              if (addedItemsNames.indexOf(itemsDBitem.name) !== -1) {
                                itemsDBitem.already_added = true;
                              }

                              itemsDBitem.saving = false;
                              
                              return;

                            }
                          );

                          __this.bulkFormData.cached_options = itemsDBresponse.results;
                          __this.blockers.api_processing = false;

                        },
                        function(error) {

                          __this.bulkFormData.cached_options = itemsDBresponse.results;
                          __this.blockers.api_processing = false;

                        }
                      );

                  } else {

                    __this.pagination.total_items = 0;
                    __this.blockers.api_processing = false;

                  }

                },
                function(error) {

                  __this.pagination.total_items = 0;
                  __this.blockers.api_processing = false;

                }
              );

          },
          function(error) {

            __this.pagination.total_items = 0;
            __this.blockers.api_processing = false;

          }
        );

    }



    /** CONSTRUCTOR **/

    function _constructor($location, $mdDialog, $peachToast, $q, cakeCommon, cakeCountGroups, cakeGLAccounts, cakeItems, cakeItemsDBItems, cakeItemsDBCategories, cakeItemsDBItemTags, cakeItemsDBTags, cakePermissions, cakeSettings) {

      _this.$location = $location;
      _this.$mdDialog = $mdDialog;
      _this.$peachToast = $peachToast;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeCountGroups = cakeCountGroups;
      _this.cakeGLAccounts = cakeGLAccounts;
      _this.cakeItems = cakeItems;
      _this.cakeItemsDBItems = cakeItemsDBItems;
      _this.cakeItemsDBCategories = cakeItemsDBCategories;
      _this.cakeItemsDBItemTags = cakeItemsDBItemTags;
      _this.cakeItemsDBTags = cakeItemsDBTags;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;

      _this.blockers = {
        api_processing  : false,
        saving          : false
      };

      _this.bulkFormData = {
        search_category_tag_index   : null,
        search_query                : '',
        cached_options              : [],
        progress                    : {
          total_items                 : 0,
          processed_items             : 0,
          percentage                  : 0
        }
      };

      _this.pagination = {
        limit       : 50,
        page_no     : 1,
        total_items : 0
      };
      _this.paginationLimits = [50];

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canEditItems = false; // if user has permission to edit items
      _this.defaultCountGroup = null;
      _this.defaultGLAccount = null;
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.itemDBCategoriesAndTags = []; // all items db categories and tags mixed together and sorted by name
      _this.itemsDBCategories = []; // all available itemsDB categories array
      _this.itemsDBCategoriesById = []; // all available itemsDB categories collection - ids are keys
      _this.itemsDBTags = []; // all available itemsDB tags array
      _this.itemsDBTagsById = []; // all available itemsDB tags collection - ids are keys
      _this.userInfo = {message: '', type: ''}; // used to display user friendly message about last operations/loading data etc

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.blockers.api_processing = true;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      // load initial data - active locations, gl accounts, count groups and common units
      __this.$q.all({
        is_account_admin    : __this.cakeCommon.isUserAccountAdmin(),
        can_edit_items      : __this.cakePermissions.userHasPermission('edit_items'),
        active_locations    : __this.cakeSettings.getSettings('active_locations'),
        default_gl_account  : __this.cakeGLAccounts.getDefaultGLAccount(),
        default_count_group : __this.cakeCountGroups.getDefaultCountGroup()
      })
        .then(
          function(results) {

            __this.isAccountAdmin = results['is_account_admin'];

            // parse active locations
            __this.activeLocations = results['active_locations'];
            __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);

            __this.canEditItems = results['can_edit_items'];

            __this.defaultGLAccount = results['default_gl_account'];
            __this.defaultCountGroup = results['default_count_group'];

            _preloadItemsDBCommonData()
              .then(
                function() {

                  var tempOptions = _.sortBy(__this.itemsDBCategories.concat(__this.itemsDBTags), 'name');

                  __this.itemDBCategoriesAndTags = _.map(
                    tempOptions,
                    function(opt, index) {
                      opt.index = index;
                      return opt;
                    }
                  );

                  __this.hideMessage();
                  __this.blockers.api_processing = false;

                  // load some initial data
                  //__this.bulkFormResultsUpdate();

                }
              );

          },
          function(error) {

            __this.errorHandler(error);

          }
        );     

    }



    /** PUBLIC FUNCTIONS **/

    _this.addItemsDBItem = function(itemsDBItem) {

      var __this = _this;

      if (!__this.blockers.api_processing && !__this.blockers.saving && __this.canEditItems) {

        return __this.$q(function(resolve, reject) {

          __this.blockers.api_processing = true;
          __this.blockers.saving = true;

          //_showPageBlockingPopup(1);

          _addItemsDBItem(
            itemsDBItem
          )
            .then(
              function(newItemData) {

                __this.blockers.api_processing = false;
                __this.blockers.saving = false;

                //_hidePageBlockingPopup();

                _showToast('New item added!');

                resolve(newItemData);

              },
              function(error) {

                __this.blockers.api_processing = false;
                __this.blockers.saving = false;

                reject(error);

              }
            );

        });

      }

    }

    _this.addAllFoundItemsDBItems = function() {

      var __this = _this;

      if (!__this.blockers.api_processing && !__this.blockers.saving && __this.canEditItems) {

        return __this.$q(function(resolve, reject) {

          __this.blockers.api_processing = true;
          __this.blockers.saving = true;

          var promises = [];

          _.each(
            __this.bulkFormData.cached_options,
            function(itemsDBItem) {
              if (!itemsDBItem.already_added) {
                promises.push(
                  _addItemsDBItem(itemsDBItem)
                );
              }
            }
          );

          //_showPageBlockingPopup(promises.length);

          __this.$q.all(promises)
            .then(
              function(itemsResults) {

                __this.blockers.api_processing = false;
                __this.blockers.saving = false;

                //_hidePageBlockingPopup();

                _showToast('New items added!');

                resolve(itemsResults);

              },
              function(error) {

                __this.blockers.api_processing = false;
                __this.blockers.saving = false;

                reject(error);

              }
            );

        });

      }

    }

    _this.bulkFormResultsUpdate = function() {

      var __this = _this;

      if (!__this.blockers.api_processing && !__this.blockers.saving && __this.canEditItems) {

        __this.pagination.page_no = 1;

        _updateItemsDBSearchResults();

      }

    }

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

    _this.goBack = function() {

      var __this = _this;

      __this.$location.path('/settings/items');

    }

    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.onPaginationChangeCallback = function() {

      var __this = _this;

      if (!__this.blockers.api_processing && !__this.blockers.saving && __this.canEditItems) {

        _updateItemsDBSearchResults();

      }

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

BulkAddItemsController.$inject = ['$location', '$mdDialog', '$peachToast', '$q', 'commonService',
                                  'countGroupsService', 'glAccountsService', 'itemsService',
                                  'itemsDBItemsService', 'itemsDBCategoriesServices',
                                  'itemsDBItemTagsService', 'itemsDBTagsService',
                                  'permissionsService', 'settingsService'];

export default BulkAddItemsController;
