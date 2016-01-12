(function() {
  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var mockedData = {
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    vendors_response:
    {
      type:"wtm_vendors",
      count:1,
      results:[
        {   
          "name":"ABC Beers",
          "contact_last_name":"Jones",
          "country":null,
          "address":"3434 W Reno",
          "phone":"(555) 867-5309",
          "address2":"Apt 5",
          "city":"Oklahoma City",
          "contact_email":"sjones@gmail.com",
          "contact_name":null,
          "notes":"This is the notes",
          "contact_first_name":"Skippy",
          "zip":"73034",
          "country_id":227,
          "state":"Oklahoma",
          "is_active":true,
          "fax":"What is a Fax?",
          "state_id":3491,
          "id":17,
          "created_by":44,
          "created_at":"2015-10-13T20:29:38.593Z",
          "updated_by":44,
          "updated_at":"2015-12-04T14:03:19.334Z"
        }   
      ]
    },
    countries_response:
    {
      type:"countries",
      count:7,
      results:[
        {"id":223,"iso2":"UG","iso3":"UGA","name_en":"Uganda"},
        {"id":224,"iso2":"UA","iso3":"UKR","name_en":"Ukraine"},
        {"id":225,"iso2":"AE","iso3":"ARE","name_en":"United Arab Emirates"},
        {"id":226,"iso2":"GB","iso3":"GBR","name_en":"United Kingdom (Great Britain)"},
        {"id":227,"iso2":"US","iso3":"USA","name_en":"United States"},
        {"id":228,"iso2":"UM","iso3":"UMI","name_en":"United States Minor Outlying Islands"},
        {"id":241,"iso2":"ZW","iso3":"ZWE","name_en":"Zimbabwe"}
      ]
    },
    states_response:
    {
      type:"states",
      count:16,
      results:[
        {"id":3477,"country_id":227,"state":"Michigan"},
        {"id":3478,"country_id":227,"state":"Minnesota"},
        {"id":3479,"country_id":227,"state":"Mississippi"},
        {"id":3480,"country_id":227,"state":"Missouri"},
        {"id":3481,"country_id":227,"state":"Montana"},
        {"id":3482,"country_id":227,"state":"Nebraska"},
        {"id":3483,"country_id":227,"state":"Nevada"},
        {"id":3484,"country_id":227,"state":"New Hampshire"},
        {"id":3485,"country_id":227,"state":"New Jersey"},
        {"id":3486,"country_id":227,"state":"New Mexico"},
        {"id":3487,"country_id":227,"state":"New York"},
        {"id":3488,"country_id":227,"state":"North Carolina"},
        {"id":3489,"country_id":227,"state":"North Dakota"},
        {"id":3490,"country_id":227,"state":"Ohio"},
        {"id":3491,"country_id":227,"state":"Oklahoma"},
        {"id":3505,"country_id":227,"state":"Wyoming"}
      ]
    },
    invoice_items:
    {
      type:"wtm_invoice_items",
      count:21,
      results:[
        {
          "extended_price":"100.00000",
          "unit_price":"10.00000",
          "quantity":"10.000",
          "id":119,
          "created_by":44,
          "created_at":"2015-10-16T16:09:49.999Z",
          "updated_by":44,
          "updated_at":"2015-10-16T16:09:50.538Z",
          "location_id":3,
          "vendor_id":17,
          "vendor_inventory_item_id":49,
          "inv_item_id":1272,
          "inv_event_item_id":100,
          "invoice_id":50
        }
      ]
    },
    vendor_locs:
    {
      type:"wtm_vendor_locs",
      count:12,
      results:[
        {"customer_number":"","id":260,"created_by":44,"created_at":"2015-12-04T14:09:41.279Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.145Z","location_id":11,"vendor_id":17},
        {"customer_number":"","id":231,"created_by":44,"created_at":"2015-10-16T16:06:25.554Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.149Z","location_id":3,"vendor_id":17},
        {"customer_number":"","id":232,"created_by":44,"created_at":"2015-10-16T16:06:25.555Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.139Z","location_id":1,"vendor_id":17},
        {"customer_number":"","id":216,"created_by":44,"created_at":"2015-10-13T20:29:38.711Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.149Z","location_id":17,"vendor_id":17},
        {"customer_number":"","id":213,"created_by":44,"created_at":"2015-10-13T20:29:38.710Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.150Z","location_id":7,"vendor_id":17},
        {"customer_number":"","id":259,"created_by":44,"created_at":"2015-12-04T14:09:41.279Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.150Z","location_id":8,"vendor_id":17},
        {"customer_number":"","id":258,"created_by":44,"created_at":"2015-12-04T14:09:41.279Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.145Z","location_id":15,"vendor_id":17},
        {"customer_number":"","id":211,"created_by":44,"created_at":"2015-10-13T20:29:38.708Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.145Z","location_id":2,"vendor_id":17},
        {"customer_number":"","id":215,"created_by":44,"created_at":"2015-10-13T20:29:38.710Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.145Z","location_id":14,"vendor_id":17},
        {"customer_number":"","id":262,"created_by":44,"created_at":"2015-12-04T14:10:07.142Z","updated_by":null,"updated_at":"2015-12-04T14:10:07.142Z","location_id":12,"vendor_id":17},
        {"customer_number":"","id":263,"created_by":44,"created_at":"2015-12-04T14:10:07.142Z","updated_by":null,"updated_at":"2015-12-04T14:10:07.142Z","location_id":4,"vendor_id":17},
        {"customer_number":"","id":264,"created_by":44,"created_at":"2015-12-04T14:10:07.142Z","updated_by":null,"updated_at":"2015-12-04T14:10:07.142Z","location_id":9,"vendor_id":17}
      ]
    },
    permissions                 : {
      edit_vendors : true
    },
    active_locations: 
    [
      {
        address1: null,
        address2: null,
        city: null,
        country_id: 227,
        created_at: "2013-11-11T15:33:33.187Z",
        created_by: 44,
        id: 7,
        is_deleted: false,
        name: "Andrei204 NYC",
        number: null,
        org_group_id: null,
        phone: null,
        state_id: 3487,
        tags: null,
        timezone: "America/New_York",
        updated_at: "2015-05-15T19:04:11.105Z",
        updated_by: 138,
        zip: null,
        wtm_inv_loc: {
          copied_from: null,
          created_at: "2015-10-08T14:43:58.042Z",
          created_by: 44,
          id: 10,
          is_copied: true,
          location_id: 7,
          updated_at: "2015-10-08T14:43:58.042Z",
          updated_by: null
        }
      }
    ]
  };

  describe("Controller: Edit vendor", function() {

    // helper local variables
    var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub;
    // controller injectables
    var $location, $mdDialog, $q, cakeCommon, cakePermissions, cakeSettings, cakeSharedData, cakeVendors, cakeCountries, cakeStates, cakeVendorLocations

    // initialize app module
    beforeEach(module('cakeApp'));

      
    // mock and inject additional modules
    beforeEach(inject(function($injector) {

      $controller = $injector.get('$controller');
      $log = $injector.get('$log');
      $rootScope = $injector.get('$rootScope');

      $location = $injector.get('$location');
      $mdDialog = $injector.get('$mdDialog');
      $q = $injector.get('$q');

      cakeCommon = {
        isUserAccountAdmin: function() {
          var deferred = $q.defer();
          deferred.resolve(mockedData.is_user_account_admin);
          return deferred.promise;
        },
        isDevPreviewModeRunning: function() {
          return mockedData.is_dev_preview_mode_running;
        },
        apiErrorHandler: function(error, showAlert) {
          return $log.error([error, showAlert]);
        }
      };

      cakePermissions = {
        userHasPermission: function(permissionKey) {
          var deferred = $q.defer();
          deferred.resolve(mockedData.permissions[permissionKey]);
          return deferred.promise;
        }
      };

      cakeSettings = {
        getSettings: function(permissionKey) {
          var deferred = $q.defer();
          deferred.resolve(mockedData.permissions[permissionKey]);
          return deferred.promise;
        }
      };

      cakeSharedData = {
        setValue: function(key, val) {
          return;
        }
      };

     cakeVendors = {
        loadVendors: function() {
          var deferred = $q.defer();
          deferred.resolve(mockedData.vendors_response);
          return deferred.promise;
        },
        createVendor: function(vendorData) {
          var deferred = $q.defer();
          deferred.resolve(vendorData);
          return deferred.promise;
        },
        updateVendor: function(vendorData) {
          var deferred = $q.defer();
          deferred.resolve(vendorData);
          return deferred.promise;
        },
        removeVendor: function(vendorId) {
          var deferred = $q.defer();
          deferred.resolve(true);
          return deferred.promise;
        },
        canVendorBeDeleted: function(id) {
          return true;
        }
      };

      cakeCountries = {
        loadCountries: function() {
          var deferred = $q.defer();
          deferred.resolve(mockedData.countries_response);
          return deferred.promise;
        },
        getCountries: function() {
          return mockedData.countries_response.results;
        },
        getCountriesCollection: function() {
          return _.object(_.pluck(mockedData.countries_response.results, 'id'), mockedData.countries_response.results);
        }
      };

      cakeStates = {
        loadStates: function() {
          var deferred = $q.defer();
          deferred.resolve(mockedData.states_response);
          return deferred.promise;
        },
        getStates: function() {
          return mockedData.states_response.results;
        },
        getStatesCollection: function() {
          return _.object(_.pluck(mockedData.states_response.results, 'id'), mockedData.states_response.results);
        },
        getState: function(state_id) {
          return _.find(mockedData.states_response.results, {"id": state_id});;
        },
      };

     cakeVendorLocations = {
        loadVendorLocations: function(params) {
          var deferred = $q.defer();
          deferred.resolve(mockedData.vendor_locs_response);
          return deferred.promise;
        },
        bulkCreateVendorLocations: function(data) {
          var deferred = $q.defer();
          deferred.resolve(data);
          return deferred.promise;
        },
        bulkUpdateVendorLocations: function(dta) {
          var deferred = $q.defer();
          deferred.resolve(data);
          return deferred.promise;
        }
      };

      controllerScope = $rootScope.$new();
      $controller(
        'edit_vendor.js as vm',
        {
          '$scope': controllerScope,
          '$location': $location,
          '$mdDialog': $mdDialog,
          '$q': $q,
          'cakeCommon': cakeCommon,
          'cakePermissions': cakePermissions,
          'cakeSettings': cakeSettings,
          'cakeSharedData': cakeSharedData,
          'cakeVendors': cakeVendors,
          'cakeCountries': cakeCountries,
          'cakeStates': cakeStates,
          'cakeVendorLocations': cakeVendorLocations
        }
      );

      logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
      errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});

    }));

    afterEach(function() {

      sandbox.restore();

    });

    describe('Constructor', function() {

      it('should construct an Edit Vendor  Controller', function() {

        expect(controllerScope.vm.$location).to.not.equal(null);
        expect(controllerScope.vm.$mdDialog).to.not.equal(null);
        expect(controllerScope.vm.$q).to.not.equal(null);
        expect(controllerScope.vm.cakeCommon).to.not.equal(null);
        expect(controllerScope.vm.cakePermissions).to.not.equal(null);
        expect(controllerScope.vm.cakeSettings).to.not.equal(null);
        expect(controllerScope.vm.cakeSharedData).to.not.equal(null);
        expect(controllerScope.vm.cakeVendors).to.not.equal(null);
        expect(controllerScope.vm.cakeCountries).to.not.equal(null);
        expect(controllerScope.vm.cakeStates).to.not.equal(null);
        expect(controllerScope.vm.cakeVendorLocations).to.not.equal(null);

        expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'initializing']);

        expect(controllerScope.vm.editedVendor).to.deep.equal({ 
              'data'          : { 
                'id': 0,
                'is_active': true
              },  
              'form_data'     : { 
                'id': 0,
                'is_active': true
              },
              'items_db_item' : null,
              'locations'     : { 
                'checked_locations' : [], 
                'data_array'        : [], 
                'data_collection'   : {}
              },  
              'vendors'       : { 
                'data_array'                : [], 
                'new_vendor_form'           : { 
                  'show_form'                 : false
                },  
                'edited_vendor_form_data'   : {}
              }   
            });

        expect(controllerScope.vm.canDeleteVendor).to.equal(false);
        expect(controllerScope.vm.canEditVendor).to.equal(false);
        expect(controllerScope.vm.vendors).to.deep.equal([]);
        expect(controllerScope.vm.forms).to.deep.equal({});
        expect(controllerScope.vm.isAccountAdmin).to.equal(false);
        expect(controllerScope.vm.isDeveloperMode).to.equal(false);

        expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

      });

    });

    describe('Activate function', function() {

      it('activate should set up initial correct values loaded from database/services', function() {

        var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
        var spyCakeCommonIsUserAccountAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');

        var spyCakePermissionsUserHasPermission = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');

        var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');

        var spyCakeCountriesLoad = sandbox.spy(controllerScope.vm.cakeCountries, 'loadCountries');
        var spyCakeCountriesGet = sandbox.spy(controllerScope.vm.cakeCountries, 'getCountries');
        var spyCakeCountriesCollection = sandbox.spy(controllerScope.vm.cakeCountries, 'getCountriesCollection');

        var spyCakeVendorsCanVendorBeDeleted = sandbox.spy(controllerScope.vm.cakeVendors, 'canVendorBeDeleted');

        //var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
        //var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
        //var spyCakeCountGroupsFrequencies = sandbox.spy(controllerScope.vm.cakeCountGroups, 'getPredefinedFrequencies');
        //var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');

        controllerScope.vm.activate();

        expect(spyCakeCommonDevMode.calledOnce).to.equal(true);
        expect(spyCakeSettings.calledWith('active_locations')).to.equal(true);
        expect(spyCakeCountriesLoad.called).to.equal(true);
        expect(controllerScope.vm.editedVendor.form_data).to.deep.equal(controllerScope.vm.editedVendor.data);


        //expect(spyCakeCommonUserAdmin.calledOnce).to.equal(true);
        //expect(spyCakePermissions.calledOnce).to.equal(true);
        //expect(spyCakeCountGroupsFrequencies.calledOnce).to.equal(true);
        //expect(spyCakeCountGroupsLoad.calledOnce).to.equal(true);

        controllerScope.$digest();

        expect(spyCakeCountriesGet.called).to.equal(true);
        expect(spyCakeCountriesCollection.called).to.equal(true);
        expect(spyCakeCommonIsUserAccountAdmin.called).to.equal(true);
        expect(spyCakePermissionsUserHasPermission.withArgs('edit_vendors').called).to.equal(true);
        expect(spyCakeVendorsCanVendorBeDeleted.withArgs(controllerScope.vm.editedVendor.data.id).called).to.equal(true);

        expect(controllerScope.vm.isAccountAdmin).to.equal(mockedData.is_user_account_admin);
        expect(controllerScope.vm.isDeveloperMode).to.equal(mockedData.is_dev_preview_mode_running);
        expect(controllerScope.vm.canEditVendor).to.equal(mockedData.permissions.edit_vendors);
        expect(controllerScope.vm.blockers.initializing).to.equal(false);
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);

      });

      it('activate should set up correct controller properties when existing vendor id given in url', function() {

        var testVendorId = 17;
        var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');

        controllerScope.vm.$location.search({id: testVendorId});

        controllerScope.vm.activate();

        controllerScope.$digest();

        expect(spyCakeVendorsLoad.calledWith({'id': testVendorId},null,true)).to.equal(true);
        expect(controllerScope.vm.editedVendor.data).to.have.property('id', testVendorId);

      });

 

    }); 

    describe('Functions', function() {

      it('deleteVendor should remove vendor if page was opened with existing id param and count group can be deleted', function() {

        var testVendorId = 17;
        var spyDeleteFunc = sandbox.spy(controllerScope.vm.cakeVendors, 'removeVendor');
        var spyRedirectFunc = sandbox.spy(controllerScope.vm, 'goBack');

        controllerScope.vm.$location.search({id: testVendorId});

        controllerScope.vm.activate();
        controllerScope.$digest();

        controllerScope.vm.deleteVendor();

        expect(controllerScope.vm.blockers.api_processing).to.equal(true);

        controllerScope.$digest();

        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyDeleteFunc.calledWithExactly(testVendorId)).to.equal(true);
        expect(spyRedirectFunc.called).to.equal(true);

      });
      it('errorHandler should display message, eventually log message and call callback', function() {

        var spyCallback = sandbox.stub();
        var spyCakeCommonAPIError = sandbox.spy(controllerScope.vm.cakeCommon, 'apiErrorHandler');
        var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
        var messageString = 'some error message';
        var messageObject = {someval: 1};

        controllerScope.$digest();

        controllerScope.vm.errorHandler(messageString);

        expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(0);
        expect(spyCallback.callCount).to.equal(0);
        expect(errorLogStub.callCount).to.equal(0);

        controllerScope.vm.errorHandler(messageObject);

        expect(spyShowMessage.calledWithExactly('There was an error, please check console log for more details.', 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(0);
        expect(spyCallback.callCount).to.equal(0);
        expect(errorLogStub.callCount).to.equal(0);

        controllerScope.vm.errorHandler(messageString, true);

        expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(1);
        expect(spyCallback.callCount).to.equal(0);
        expect(errorLogStub.callCount).to.equal(1);

        controllerScope.vm.errorHandler(messageString, true, spyCallback);

        expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(2);
        expect(spyCallback.callCount).to.equal(1);
        expect(errorLogStub.callCount).to.equal(2);

      });
      it('hideMessage should clear user message data', function() {

        controllerScope.$digest();

        controllerScope.vm.userInfo = {message: 'message',type: 'error'};

        controllerScope.vm.hideMessage();

        expect(controllerScope.vm.userInfo.message).to.equal('');
        expect(controllerScope.vm.userInfo.type).to.equal('');

      });

      it('showMessage should set user message data accoring to params', function() {

        var messageString = 'some message';
        var typeString = 'alert';
        var defaultType = 'info'

        controllerScope.$digest();

        controllerScope.vm.hideMessage();
        controllerScope.vm.showMessage(messageString);

        expect(controllerScope.vm.userInfo.message).to.equal(messageString);
        expect(controllerScope.vm.userInfo.type).to.equal(defaultType);

        controllerScope.vm.hideMessage();
        controllerScope.vm.showMessage(messageString, typeString);

        expect(controllerScope.vm.userInfo.message).to.equal(messageString);
        expect(controllerScope.vm.userInfo.type).to.equal(typeString);

      });


      it('nameChangeCallback should validate duplicate vendor name', function() {

        var spyValidationFunc = sandbox.spy(controllerScope.vm, 'nameChangeCallback');
        var vendorResponseResults = mockedData.vendors_response.results;

        inject(function($compile) {

          controllerScope.$digest();

          var element = angular.element(
          '<form name="vm.forms.vendorForm">' +
            '<input type="text" name="vendorName" ng-model="vm.editedVendor.form_data.name" ng-change="vm.nameChangeCallback();" aria-label="Vendor Name" ng-maxlength="200" required>' +
          '</form>'
          );
          $compile(element)(controllerScope);

          mockedData.vendors_response.results = [];
          controllerScope.vm.forms.vendorForm.vendorName.$setViewValue('test');
          expect(controllerScope.vm.forms.vendorForm.vendorName.$valid).to.equal(true);

          mockedData.vendors_response.results = vendorResponseResults;
          controllerScope.vm.forms.vendorForm.vendorName.$setViewValue(mockedData.vendors_response.results[0].name);
          expect(controllerScope.vm.forms.vendorForm.vendorName.$valid).to.equal(false);
          expect(controllerScope.vm.forms.vendorForm.vendorName.$error).to.deep.equal({'duplicate': true});

        });

      });

      it('nameBlurCallback should reset vendor name if there was some original value but user left empty input', function() {

        controllerScope.$digest();

        controllerScope.vm.editedVendor.data.name = "test";
        controllerScope.vm.editedVendor.form_data.name = "";

        controllerScope.vm.nameBlurCallback();

        expect(controllerScope.vm.editedVendor.form_data.name).to.equal(controllerScope.vm.editedVendor.data.name);

      });

      it('openItemsPage should redirect to items page and set vendor id in shared data', function() {

        var testVendorId = 17;
        var spyRedirectFunc = sandbox.spy(controllerScope.vm.cakeSharedData, 'setValue');

        controllerScope.vm.$location.search({id: testVendorId});

        controllerScope.vm.activate();

        controllerScope.$digest();

        controllerScope.vm.openItemsPage();

        expect(spyRedirectFunc.calledWithExactly('items_search', {vendor_id: testVendorId})).to.equal(true);
        expect(controllerScope.vm.$location.path()).to.be.equal('/settings/items');
        expect(controllerScope.vm.$location.search()).not.to.have.property('id');

      });

      it('saveVendor should create new vendor if page was opened without id param', function() {

        var spyCreateFunc = sandbox.spy(controllerScope.vm.cakeVendors, 'createVendor');
        var spyRedirectFunc = sandbox.spy(controllerScope.vm, 'goBack');

        var testData = {
          name            : 'teestName',
          address         : 'test address',
          address2        : 'test address2',
          city            : 'test city',
          state           : 'Oklahoma',
          state_id        : 3491,
          zip             : 'test zip',
          country         : 'United States',
          country_id      : 227,
          phone           : 'teest phone',
          fax             : 'test fax',
          notes           : 'test notes',
          is_active       : true,
          contact_first_name  : 'test contact first name',
          contact_last_name   : 'test contact last name',
          contact_email       : 'test contact email',
          contact_mobile      : 'test contact mobile'
        }

        controllerScope.$digest();

        controllerScope.vm.editedVendor.form_data.name = testData.name;
        controllerScope.vm.editedVendor.form_data.address = testData.address;
        controllerScope.vm.editedVendor.form_data.address2 = testData.address2;
        controllerScope.vm.editedVendor.form_data.city = testData.city;
        controllerScope.vm.editedVendor.form_data.state = testData.state;
        controllerScope.vm.editedVendor.form_data.state_id = testData.state_id;
        controllerScope.vm.editedVendor.form_data.zip = testData.zip;
        controllerScope.vm.editedVendor.form_data.country = testData.country;
        controllerScope.vm.editedVendor.form_data.country_id = testData.country_id;
        controllerScope.vm.editedVendor.form_data.phone = testData.phone;
        controllerScope.vm.editedVendor.form_data.fax = testData.fax;
        controllerScope.vm.editedVendor.form_data.notes = testData.notes;
        controllerScope.vm.editedVendor.form_data.is_active = testData.is_active;
        controllerScope.vm.editedVendor.form_data.contact_first_name = testData.contact_first_name;
        controllerScope.vm.editedVendor.form_data.contact_last_name = testData.contact_last_name;
        controllerScope.vm.editedVendor.form_data.contact_email = testData.contact_email;
        controllerScope.vm.editedVendor.form_data.contact_mobile = testData.contact_mobile;

        controllerScope.vm.saveVendor();

        expect(controllerScope.vm.blockers.api_processing).to.equal(true);

        controllerScope.$digest();

        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyCreateFunc.calledWithExactly(testData)).to.equal(true);
        expect(spyRedirectFunc.called).to.equal(true);

      });

      it('saveVendor should call updateVendor if page was opened with an id param', function() {

        var spyUpdateFunc = sandbox.spy(controllerScope.vm.cakeVendors, 'updateVendor');
        var spyRedirectFunc = sandbox.spy(controllerScope.vm, 'goBack');

        var testData = {
          id              : 17,
          name            : 'teestName',
          address         : 'test address',
          address2        : 'test address2',
          city            : 'test city',
          state           : 'Oklahoma',
          state_id        : 3491,
          zip             : 'test zip',
          country         : 'United States',
          country_id      : 227,
          phone           : 'teest phone',
          fax             : 'test fax',
          notes           : 'test notes',
          is_active       : true,
          contact_first_name  : 'test contact first name',
          contact_last_name   : 'test contact last name',
          contact_email       : 'test contact email',
          contact_mobile      : 'test contact mobile'
        }

        controllerScope.$digest();

        controllerScope.vm.editedVendor.data.id = 17; 


        controllerScope.vm.editedVendor.form_data.name = testData.name;
        controllerScope.vm.editedVendor.form_data.address = testData.address;
        controllerScope.vm.editedVendor.form_data.address2 = testData.address2;
        controllerScope.vm.editedVendor.form_data.city = testData.city;
        controllerScope.vm.editedVendor.form_data.state = testData.state;
        controllerScope.vm.editedVendor.form_data.state_id = testData.state_id;
        controllerScope.vm.editedVendor.form_data.zip = testData.zip;
        controllerScope.vm.editedVendor.form_data.country = testData.country;
        controllerScope.vm.editedVendor.form_data.country_id = testData.country_id;
        controllerScope.vm.editedVendor.form_data.phone = testData.phone;
        controllerScope.vm.editedVendor.form_data.fax = testData.fax;
        controllerScope.vm.editedVendor.form_data.notes = testData.notes;
        controllerScope.vm.editedVendor.form_data.is_active = testData.is_active;
        controllerScope.vm.editedVendor.form_data.contact_first_name = testData.contact_first_name;
        controllerScope.vm.editedVendor.form_data.contact_last_name = testData.contact_last_name;
        controllerScope.vm.editedVendor.form_data.contact_email = testData.contact_email;
        controllerScope.vm.editedVendor.form_data.contact_mobile = testData.contact_mobile;

        controllerScope.vm.saveVendor();

        expect(controllerScope.vm.blockers.api_processing).to.equal(true);

        controllerScope.$digest();

        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyUpdateFunc.calledWithExactly(testData)).to.equal(true);
        expect(spyRedirectFunc.called).to.equal(true);

      });

      it('saveVendor should NOT call createVendor if canEditVendor is false and the passed id is empty', function() {
        var spyCreateFunc = sandbox.spy(controllerScope.vm.cakeVendors, 'createVendor');

        controllerScope.vm.canEditVendor = false;
        controllerScope.vm.editedVendor.data.id = null; 
        controllerScope.vm.saveVendor();
        controllerScope.$digest();

        expect(spyCreateFunc.called).to.equal(false);
      });

      it('saveVendor should NOT call updateVendor if canEditVendor is false and the passed id is populated', function() {
        var spyFunc = sandbox.spy(controllerScope.vm.cakeVendors, 'updateVendor');

        controllerScope.vm.canEditVendor = false;
        controllerScope.vm.editedVendor.data.id = 17; 
        controllerScope.vm.saveVendor();
        controllerScope.$digest();

        expect(spyFunc.called).to.equal(false);
      });


      it('goBack should redirect to vendors list page', function() {

        controllerScope.$digest();

        controllerScope.vm.goBack();

        expect(controllerScope.vm.$location.path()).to.be.equal('/settings/vendors');
        expect(controllerScope.vm.$location.search()).not.to.have.property('id');

      });

    });
  });
})();