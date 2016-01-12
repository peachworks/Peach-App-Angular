
class EditVendorController {
  constructor($location, $mdDialog, $q, cakeCommon, cakePermissions, cakeSettings,
              cakeSharedData, cakeVendors, cakeCountries, cakeStates, cakeVendorLocations) {
    /** Edit Vendor settings modal page
     * Allows a user to create and edit Vendors
     * @author Ryan Marshall
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

    function _loadAdditionalVendorData() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        // load additional item data - locations
        var additionalPromises = {
          vendor_locations      : __this.cakeVendorLocations.loadVendorLocations(
            {
              '$and': [
                {
                  'location_id': _.pluck(__this.activeLocations, 'id')
                },
                {
                  'vendor_id': __this.editedVendor.data.id
                }
              ]
            },
            {
              'limit': 1000 //TODO: remove this hardcoded restriction when platform transparent pagination will be done!!!
            }
          )
        };

        // execute all promises
        __this.$q.all(additionalPromises)
          .then(
            function(results) {
              __this.$q.all([
                _prepareVendorLocations(results['vendor_locations']),
              ])
                .then(
                  function() {
                    resolve(true);
                  },
                  function(error){
                    reject(error);
                  }
                );
            },
            function(error){
              reject(error);
            }
          );
      });
    }

    function _loadPermissions() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$q.all(
          {
            is_account_admin  : __this.cakeCommon.isUserAccountAdmin(),
            can_edit_vendors  : __this.cakePermissions.userHasPermission('edit_vendors'),
            can_delete_vendor   : __this.cakeVendors.canVendorBeDeleted(__this.editedVendor.data.id)
          }
        )
          .then(
            function(results){

              __this.isAccountAdmin = results['is_account_admin'];
              __this.canEditVendor = __this.isAccountAdmin ? true : results['can_edit_vendors'];
              __this.canDeleteVendor = results['can_delete_vendor'] ? __this.canEditVendor : false;

              resolve(true);

            },
            function(error){

              reject(error);

            }
          );

      });

    }


    function _prepareCountries() {
      var __this = _this;

      return __this.$q(function(resolve, reject) {
        __this.countries = __this.cakeCountries.getCountries();
        __this.countriesById = __this.cakeCountries.getCountriesCollection();
        resolve(true);
      });

    }

    function _prepareStates() {
      var __this = _this;

      return __this.$q(function(resolve, reject) {
        __this.states = __this.cakeStates.getStates();
        __this.statesById = __this.cakeStates.getStatesCollection();
        resolve(true);
      });
    }

    function _prepareVendorLocations(vendorLocationsResponse) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var vendorLocations = [];
        var checkedLocations = [];

        _.each(
          __this.activeLocations,
          function(activeLocation) {

            var location = angular.copy(activeLocation);
            var vendorLocation = _.find(vendorLocationsResponse.results, {'location_id': location.id});
            var addToChecked = false;

            if(vendorLocation) {
              location.was_checked = true;
              addToChecked = true;

              location.vendor_location = vendorLocation;
              location.customer_number = vendorLocation.customer_number;

            } else {
              addToChecked = false;
              location.was_checked = false;
              location.customer_number =  '';
            }

            /*
             * If this is a new vendor then we automatically add to check per the spec
             */
            if(!__this.editedVendor.data.id) {
              addToChecked = true;
            }

            if(addToChecked) {
              checkedLocations.push(location);
            }

            location.display_name = location.number ? location.number + ' - ' : '';
            location.display_name = location.display_name + location.name;

            vendorLocations.push(location);
            return;
          }
        );

        __this.editedVendor.locations = {
          checked_locations : checkedLocations,
          data_array        : _.sortBy(vendorLocations, 'display_name'),
          data_collection   : _.object(_.pluck(vendorLocations, 'id'), vendorLocations)
        };

        // show locations tab if there's more than one location available
        if ( __this.editedVendor.locations.data_array.length > 1) {
          __this.tabs.availableTabs[2]['visible'] = true; 
        }

        

        resolve(true);

      });

    }

    function _parseVendorLocationsForUpdate() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        var vendorLocationsToCreate = [];
        var vendorLocationsToRemove = [];
        var vendorLocationsToUpdate = [];

        var newVendorLocationsCollection = [];
        var updateVendorLocationsCollection = [];
        var removeVendorLocationsCollection = [];

        // find locations which were checked before, but are not checked any longer
        _.each(
          __this.editedVendor.locations.data_array,
          function(location) {

            var checkedLocation = _.findWhere( __this.editedVendor.locations.checked_locations, {id: location.id});

            if (!checkedLocation && location.was_checked) {
              vendorLocationsToRemove.push(location);
            }
            return;
          }
        );

        // find locations which were not checked before, but are checked now, additionally get those with unchanged status - which are still checked
        _.each(
          __this.editedVendor.locations.checked_locations,
          function(checkedLocation) {

            if (!checkedLocation.was_checked) {
              vendorLocationsToCreate.push(checkedLocation);
            } else {
              vendorLocationsToUpdate.push(checkedLocation);
            }
            return;
          }
        );

        // now for each new checked location, add the new itemLocation data to bulk collection
        _.each(
          vendorLocationsToCreate,
          function(location) {

            newVendorLocationsCollection.push(
              {
                vendor_id       : __this.editedVendor.data.id,
                location_id     : location.id,
                customer_number : location.customer_number 
              }
            );
            return;
          }
        );

        // now for each new checked location, add the new itemLocation data to bulk collection
        _.each(
          vendorLocationsToUpdate,
          function(location) {

            updateVendorLocationsCollection.push(
              {
                vendor_id       : __this.editedVendor.data.id,
                id              : location.vendor_location.id,
                location_id     : location.id,
                customer_number : location.customer_number 
              }
            );
            return;
          }
        );

        // for each location which has to be removed - add the item location it to remove collection
        _.each(
          vendorLocationsToRemove,
          function(location) {
            removeVendorLocationsCollection.push(
              location.vendor_location.id
            );
            return;
          }
        );

        resolve(
          {
            newVendorLocationsCollection        : newVendorLocationsCollection,
            updateVendorLocationsCollection     : updateVendorLocationsCollection,
            removeVendorLocationsCollection     : removeVendorLocationsCollection
          }
        );

      });

    }


    function _updateVendorLocations() {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        _parseVendorLocationsForUpdate()
          .then(
            function(results) {

              __this.$q.all(
                [
                  // create new item locations
                  __this.$q(function(innerResolve, innerReject) {

                    if (results.newVendorLocationsCollection.length > 0) {

                      __this.cakeVendorLocations.bulkCreateVendorLocations(
                        results.newVendorLocationsCollection
                      )
                        .then(
                          innerResolve,
                          innerReject
                        );

                    } else {

                      innerResolve(true);

                    }

                  }),

                  // update item locations
                  __this.$q(function(innerResolve, innerReject) {

                    if (results.updateVendorLocationsCollection.length > 0) {
                      __this.cakeVendorLocations.bulkUpdateVendorLocations(
                        results.updateVendorLocationsCollection
                      )
                        .then(
                          innerResolve,
                          innerReject
                        );
                    } else {
                      innerResolve(true);
                    }
                  }),

                  // delete unchecked item locations
                  __this.$q(function(innerResolve, innerReject) {

                    if (results.removeVendorLocationsCollection.length > 0) {

                      __this.cakeVendorLocations.bulkDeleteVendorLocations(
                        results.removeVendorLocationsCollection
                      )
                        .then(
                          innerResolve,
                          innerReject
                        );

                    } else {

                      innerResolve(true);

                    }

                  })
                ]
              )
                .then(
                  function() {
                    
                    resolve(true);

                  },
                  function(error) {

                    reject(error);

                  }
                );

            }
          );

      });

    }



    /** CONSTRUCTOR **/

    function _constructor($location, $mdDialog, $q, cakeCommon, cakePermissions, cakeSettings, cakeSharedData, cakeVendors, cakeCountries, cakeStates, cakeVendorLocations) {

      _this.$location = $location;
      _this.$mdDialog = $mdDialog;
      _this.$q = $q;
      _this.cakeCommon = cakeCommon;
      _this.cakeVendorLocations = cakeVendorLocations;
      _this.cakePermissions = cakePermissions;
      _this.cakeSettings = cakeSettings;
      _this.cakeSharedData = cakeSharedData;
      _this.cakeVendors = cakeVendors;
      _this.cakeCountries = cakeCountries;
      _this.cakeStates = cakeStates;

      _this.blockers = {
        api_processing  : false,
        initializing    : true
      };

      _this.editedVendor = {
        data          : {
          id: 0,
          is_active: true
        },
        form_data     : { },
        items_db_item : null,
        locations     : {
          checked_locations : [],
          data_array        : [],
          data_collection   : {}
        },
        vendors       : {
          data_array                : [],
          new_vendor_form           : {
            show_form                 : false
          },
          edited_vendor_form_data   : {}
        }
      };

      _this.tabs = {
        activeTab     : null,
        availableTabs : [
          {
            title             : "VENDOR INFO",
            template          : "vendorInfoTabTemplate",
            deselectCallback  : function(){},
            visible           : true
          },
          {
            title             : "CONTACT INFO",
            template          : "contactInfoTabTemplate",
            deselectCallback  : function(){},
            visible           : true
          },
          {
            title             : "LOCATIONS",
            template          : "vendorLocationsTabTemplate",
            deselectCallback  : function(){},
            visible           : false
          }
        ]
      };

      _this.activeLocations = []; // all locations available for cake app - taken from account preferences using settings service
      _this.activeLocationsById = {}; // collection of all locations availalbe for cake app, location ids are keys
      _this.canDeleteVendor = false // if user has permission to delete item
      _this.canEditVendor = false; // if user has permission to edit items
      _this.countries = []; // all available gl accounts array
      _this.countriesById = {}; // all available gl accounts collection - ids are keys
      _this.forms = {};
      _this.states = []; // all available gl accounts array
      _this.statesById = {}; // all available gl accounts collection - ids are keys
      _this.isAccountAdmin = false; // if user has account admin rights
      _this.isDeveloperMode = false; // if app is opened in dev preview mode
      _this.userInfo = {message: '',type: ''}; // used to display user friendly message about last operations/loading data etc
      _this.vendors = []; // all available vendors array
      _this.vendorsById = {}; // all available vendors collection - ids are keys

      _this.activate();

    }

    _this.activate = function() {

      var __this = _this;

      __this.isDeveloperMode = __this.cakeCommon.isDevPreviewModeRunning();

      __this.$q.all({
        activeLocations : activateActiveLocations(),
        countires       : activateCountries(),
        vendor          : activateVendor((__this.$location.search()['id']))
      })
        .then(
          function(results) {
            if (results.vendor) {
              _loadPermissions().then(
                function() {
                  _loadAdditionalVendorData()
                    .then(handleSuccess , handleError);
                }, handleError
              );

            } else {
              handleError("Couldn't load item with given ID: " + __this.$location.search()['id'] + ".");
            }

          }, handleError
        );

      function handleSuccess() {
        __this.blockers.initializing = false;
      }
      function handleError(error) {
        __this.blockers.initializing = false;
        __this.canDeleteVendor = false;
        __this.canEditVendor = false;
        __this.errorHandler(error);
      }
      function activateCountries() {
        return __this.cakeCountries.loadCountries(null, {sort: 'name'})
          .then(
            function() {
              return _prepareCountries();
            },
            function(error) {
              __this.errorHandler(error);
            }
          );
      }
      function activateActiveLocations() {
        return __this.cakeSettings.getSettings('active_locations')
          .then(
            function(data) {
              
              __this.activeLocations = data;
              return __this.activeLocationsById = _.object(_.pluck(__this.activeLocations, 'id'), __this.activeLocations);
            },
            function(error) {
              __this.errorHandler(error);
            }
          );
      }
      function activateVendor(vendorId) {
        var deferred = __this.$q.defer();
        if(!vendorId) {
          
          __this.editedVendor.form_data = angular.copy(__this.editedVendor.data);
          deferred.resolve(__this.editedVendor.form_data);
        } else {
          __this.cakeVendors.loadVendors( { id: vendorId }, null, true)
            .then( 
              function(data) {

                if( data.results && data.results.length > 0) {
                  __this.editedVendor.data = data.results[0];
                  __this.editedVendor.form_data = angular.copy(__this.editedVendor.data);
                  if(__this.editedVendor.form_data.country_id) {
                    __this.loadStates(__this.editedVendor.form_data.country_id);
                  }
                  deferred.resolve(__this.editedVendor.form_data);
                } else {
                  deferred.resolve(false);
                }
              },
              function(error) {
                __this.errorHandler(error);
                deferred.reject(error);
              }
            );
        }
        return deferred.promise;
      }
    }



    /** PUBLIC FUNCTIONS **/


    _this.confirmDeleteVendor = function() {

      var __this = _this;

      setTimeout( function() {
        __this.$mdDialog.show({
          scope: __this,
          preserveScope: true,
          template: '<md-dialog>' +
            '  <md-dialog-content>' +
            '     <p>'+
            '         <div layout="row" flex>Are you sure you want to delete this vendor?<br /><br /></div>' +
            '         <div layout="row" layout-align="center" flex>' +
            '             <md-button class="md-primary" ng-click="vm.cancel();" title="Cancel" aria-label="Cancel">' +
            '                 <span>CANCEL</span>' +
            '             </md-button>' +
            '             <md-button class="md-primary" ng-click="vm.confirm();" title="Delete vendort" aria-label="Delete vendor">' +
            '                 <span>DELETE VENDOR</span>' +
            '             </md-button>' +
            '         </div>' +
            '     </p>'+
            '  </md-dialog-content>' +
            '</md-dialog>',
          controller: ['$scope', '$mdDialog', function DialogController($scope, $mdDialog) {
            $scope.confirm = function() {
              $scope.deleteVendor();
              $mdDialog.hide();
            };
            $scope.cancel = function() {
              $mdDialog.hide();
            };
          }]
        });
      }, 500);

    }

    _this.deleteVendor = function() {

      var __this = _this;

      if (__this.editedVendor.data.id && __this.canDeleteVendor) {

        __this.blockers.api_processing = true;

        __this.cakeVendors.removeVendor(
          __this.editedVendor.data.id
        )
          .then(
            function(response) {

              __this.blockers.api_processing = false;
              __this.goBack();

            },
            function(error) {

              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          )

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
      __this.$location.path('/settings/vendors').search('id', null);
    }

    _this.openItemsPage = function() {
      var __this = _this;

      if (__this.editedVendor.data.id) {
        __this.cakeSharedData.setValue('items_search', {vendor_id:
                                                        __this.editedVendor.data.id});
        __this.$location.path('/settings/items').search('id', null);
      }
    }


    // hides message
    _this.hideMessage = function() {

      var __this = _this;

      __this.userInfo = {message: '',type: ''};

      return;

    }

    _this.loadStates = function(countryId) {
      var __this = _this;

      __this.cakeStates.loadStates(parseInt(countryId), null, {sort: 'name'})
        .then( 
          function() {
            _prepareStates();
          },
          function(error) {
            //__this.blockers.api_processing = false;
            __this.errorHandler(error);
          }
        );
    }


    _this.nameBlurCallback = function() {

      var __this = _this;

      if (!__this.editedVendor.form_data.name) {
        __this.editedVendor.form_data.name = __this.editedVendor.data.name;
      }

    }

    _this.nameChangeCallback = function() {

      var __this = _this;

      __this.forms.vendorForm.vendorName.$setValidity('duplicate', true);

      if (
        __this.editedVendor.form_data.name &&
          __this.editedVendor.form_data.name !== __this.editedVendor.data.name
      ) {

        var vendorIdArray = [];
        vendorIdArray.push(__this.editedVendor.form_data.id);

        __this.cakeVendors.loadVendors(
          {
            '$and'      : [
              {
                'name'      : __this.editedVendor.form_data.name
              },
              {
                'id'        : {
                  '$nin'        : vendorIdArray
                }
              }
            ]
          },
          {
            'limit'   : 1,
            'fields'  : 'id'
          },
          true
        )
          .then(
            function(response) {

              if (response.results && response.results.length > 0) {

                __this.forms.vendorForm.vendorName.$setValidity('duplicate', false);

              }

            },
            function(error) {

              // skip silently

            }
          );

      }

    }

    _this.saveVendor = function() {
      
      var __this = _this;
      
      var state = '';
      if( __this.editedVendor.form_data.state_id) {
        state = __this.cakeStates.getState(__this.editedVendor.form_data.state_id).state;
      }

      if (__this.canEditVendor && __this.editedVendor.data.id) {

        __this.blockers.api_processing = true;

        // update item info tab stuff - common_unit_id and reporting unit are being save on the fly as they change, so we're not sending them here
        __this.cakeVendors.updateVendor(
          {
            id              : __this.editedVendor.data.id,
            name            : __this.editedVendor.form_data.name,
            address         : __this.editedVendor.form_data.address,
            address2        : __this.editedVendor.form_data.address2,
            city            : __this.editedVendor.form_data.city,
            state           : state,
            state_id        : __this.editedVendor.form_data.state_id,
            zip             : __this.editedVendor.form_data.zip,
            country         : __this.editedVendor.form_data.country,
            country_id      : __this.editedVendor.form_data.country_id,
            phone           : __this.editedVendor.form_data.phone,
            fax             : __this.editedVendor.form_data.fax,
            notes           : __this.editedVendor.form_data.notes,
            is_active       : __this.editedVendor.form_data.is_active,
            contact_first_name  : __this.editedVendor.form_data.contact_first_name,
            contact_last_name   : __this.editedVendor.form_data.contact_last_name,
            contact_email       : __this.editedVendor.form_data.contact_email,
            contact_mobile      : __this.editedVendor.form_data.contact_mobile
          }
        )
          .then(
            function(response) {

              // next - save changes in locations tab
              _updateVendorLocations()
                .then(
                  function(response) {

                    __this.blockers.api_processing = false;
                    __this.goBack();

                  },
                  function(error) {
                    
                    __this.blockers.api_processing = false;
                    __this.errorHandler(error);

                  }
                )
            },
            function(error) {
              
              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          )

      } else if (__this.canEditVendor && !__this.editedVendor.data.id) {

        __this.blockers.api_processing = true;

        // update item info tab stuff - common_unit_id and reporting unit are being save on the fly as they change, so we're not sending them here
        __this.cakeVendors.createVendor(
          {
            name            : __this.editedVendor.form_data.name,
            address         : __this.editedVendor.form_data.address,
            address2        : __this.editedVendor.form_data.address2,
            city            : __this.editedVendor.form_data.city,
            state           : state,
            state_id        : __this.editedVendor.form_data.state_id,
            zip             : __this.editedVendor.form_data.zip,
            country         : __this.editedVendor.form_data.country,
            country_id      : __this.editedVendor.form_data.country_id,
            phone           : __this.editedVendor.form_data.phone,
            fax             : __this.editedVendor.form_data.fax,
            notes           : __this.editedVendor.form_data.notes,
            is_active       : __this.editedVendor.form_data.is_active,
            contact_first_name  : __this.editedVendor.form_data.contact_first_name,
            contact_last_name   : __this.editedVendor.form_data.contact_last_name,
            contact_email       : __this.editedVendor.form_data.contact_email,
            contact_mobile      : __this.editedVendor.form_data.contact_mobile
          }
        )
          .then(
            function(response) {
              __this.editedVendor.data = response;
              __this.editedVendor.form_data = angular.copy(__this.editedVendor.data);

              // next - save changes in locations tab
              _updateVendorLocations()
                .then(
                  function(response) {

                    __this.blockers.api_processing = false;
                    __this.goBack();
                    

                  },
                  function(error) {
                    
                    __this.blockers.api_processing = false;
                    __this.errorHandler(error);

                  }
                )
              __this.blockers.api_processing = false;

            },
            function(error) {
              
              __this.blockers.api_processing = false;
              __this.errorHandler(error);

            }
          )

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

    _this.isLocationChecked = function(location) {
      return !!_.find(_this.editedVendor.locations.checked_locations, 'id', location.id);
    }
  }
}


EditVendorController.$inject = ['$location', '$mdDialog', '$q', 'commonService',
                                'permissionsService', 'settingsService', 'sharedDataService',
                                'vendorsService', 'countriesService', 'statesService',
                                'cakeVendorLocationsService'];

export default EditVendorController;