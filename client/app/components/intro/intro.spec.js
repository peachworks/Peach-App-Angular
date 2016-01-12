/** Unit Test Spec File
 * Tests intro.js controller of Cake app.
 * @author Radek Wrzesien
 */


/*jshint esnext: true */
'use strict';


describe('Component: Intro Page', function() {

    var controller, errorStub, $rootScope, $scope, $httpBackend, $location, $log, $peach, $q, $window, cakeCommon, cakeCounts, cakeItems, cakeActiveLocations, cakeSharedData, cakeInvoices, cakeSettings, cakeVendors, sandbox;

    var MOCKED_LOCATIONS = {
        "type":"wtm_inv_locs",
        "count":1,
        "params":{},
        "results": [
            {"id":1}
        ]
    };
    var MOCKED_ITEMS = {
        "type":"wtm_inv_items",
        "count":10,
        "params":{},
        "results": [
            {"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}, {"id":6}, {"id":7}, {"id":8}, {"id":9}, {"id":10}
        ]
    };
    var MOCKED_ITEMS_PARTIAL = {
        "type":"wtm_inv_items",
        "count":9,
        "params":{},
        "results": [
            {"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}, {"id":6}, {"id":7}, {"id":8}, {"id":9}
        ]
    };
    var MOCKED_COUNTS = {
        "type":"wtm_inv_counts",
        "count":2,
        "params":{},
        "results": [
            {"id":50, "is_complete": true, "count_group_id": 1}, {"id":51, "is_complete": true, "count_group_id": 1}
        ]
    };
    var MOCKED_INVOICES = {
        "type":"wtm_invoices",
        "count":1,
        "params":{},
        "results": [
            {"id":2}
        ]
    };
    var MOCKED_VENDORS = {
        "type":"wtm_vendors",
        "count":1,
        "params":{},
        "results": [
            {"id":2}
        ]
    };
    var MOCKED_ACCOUNT_LOCATIONS = [
        {"id":1, 'name': 'Test 1'}, {"id":2, 'name': 'Test 2'}
    ];

    // initializing main module
    beforeEach(module('cakeApp'));
      
    beforeEach(inject(function($injector) {
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        $log = $injector.get('$log');
        $peach = $injector.get('$peach');
        $q = $injector.get('$q');
        $window = $injector.get('$window');
        
        $httpBackend.whenGET('https://api.peachworks.com/v1/accounts/1/locations/me?sort=name').respond(200, '');
        $httpBackend.whenGET('https://api.peachworks.com/v1/accounts/1/apps').respond(200, '');
        
        cakeCommon = {
            apiErrorHandler: function(param) {},
            isDevPreviewModeRunning: function() {}
        };
        
        cakeCounts = {
            createCount: function() {
                var deferred = $q.defer();
                deferred.resolve({id: 1});
                
                return deferred.promise;
            },
            loadCounts: function() {
                var deferred = $q.defer();
                deferred.resolve(MOCKED_COUNTS);
                
                return deferred.promise;
            },
            updateCount: function() {
                var deferred = $q.defer();
                deferred.resolve({id: 1});
                
                return deferred.promise;
            }
        };
        
        cakeItems = {
            loadItems: function() {
                var deferred = $q.defer();
                deferred.resolve(MOCKED_ITEMS);
                
                return deferred.promise;
            }
        };
        
        cakeActiveLocations = {
            loadActiveLocations: function() {
                var deferred = $q.defer();
                deferred.resolve(MOCKED_LOCATIONS);
                
                return deferred.promise;
            }
        };
        
        cakeSharedData = {
            setValue: function() {}
        };
        
        cakeInvoices = {
            loadInvoices: function() {
                var deferred = $q.defer();
                deferred.resolve(MOCKED_LOCATIONS); // <===========
                
                return deferred.promise;
            }
        };
        
        cakeSettings = {
            activateLocation: function() {
                var deferred = $q.defer();
                deferred.resolve(true); // <===========
                
                return deferred.promise;
            }
        }
        
        cakeVendors = {
            loadVendors: function() {
                var deferred = $q.defer();
                deferred.resolve(MOCKED_LOCATIONS); // <===========
                
                return deferred.promise;
            }
        };
        
        controller = $controller(
            'intro.js',
            {
                '$scope': $scope,
                '$location': $location,
                '$log': $log,
                '$peach': $peach,
                '$q': $q,
                '$window': $window,
                'cakeCommon': cakeCommon,
                'cakeCounts': cakeCounts,
                'cakeItems': cakeItems,
                'cakeActiveLocations': cakeActiveLocations,
                'cakeSharedData': cakeSharedData,
                'cakeInvoices': cakeInvoices,
                'cakeSettings': cakeSettings,
                'cakeVendors': cakeVendors,
            });

        sandbox = sinon.sandbox.create();
        
    }));
    
    afterEach(function() {
        sandbox.restore();
    });
    
    describe('Functions', function() {

        describe('activate', function() {

            it('Expect that none of the steps will be completed on empty initial data', function() {

                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve([]);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve([]);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve([]);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve([]);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(0);
                chai.expect(controller.stepsCompletion).to.eql({1: false, 2: false, 3: false, 4: false, 5: false, 6: false });

            });
            
            it('Expect that first step will be completed on given initial data', function() {

                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve([]);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve([]);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve([]);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(10);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: false, 3: false, 4: false, 5: false, 6: false });

            });
            
            it('Expect that first, second steps will be completed on given initial data', function() {

                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve([]);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve([]);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(20);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: true, 3: false, 4: false, 5: false, 6: false });

            });
            
            it('Expect that first, second steps will be completed and third step partially completed on given initial data', function() {

                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS_PARTIAL);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve([]);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(38);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: true, 3: false, 4: false, 5: false, 6: false });

            });
            
            it('Expect that first, second, third steps will be completed on given initial data', function() {

                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve([]);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(40);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: true, 3: true, 4: false, 5: false, 6: false });

            });
            
            it('Expect that first, second, third steps will be completed on given initial data and fourth step will not be completed if they are counts, but not completed', function() {
                MOCKED_COUNTS['results'][0].is_complete = false;
                MOCKED_COUNTS['results'][1].is_complete = false;
                
                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve(MOCKED_COUNTS);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(40);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: true, 3: true, 4: false, 5: false, 6: false });

            });
            
            it('Expect that first, second, third, fourth steps will be completed on given initial data', function() {
                MOCKED_COUNTS['results'][0].is_complete = true;
                MOCKED_COUNTS['results'][1].is_complete = true;
                
                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve(MOCKED_COUNTS);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve([]);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(60);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: true, 3: true, 4: true, 5: false, 6: false });

            });
            
            it('Expect that first, second, third, fourth, fifth steps will be completed on given initial data', function() {
            
                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve(MOCKED_LOCATIONS);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve(MOCKED_COUNTS);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve(MOCKED_INVOICES);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                chai.expect(controller.introCompletion).to.be.equal(100);
                chai.expect(controller.stepsCompletion).to.eql({1: true, 2: true, 3: true, 4: true, 5: true, 6: true});

            });
            
            it('Expect that location will be setup automatically if only one exists', function() {
               
                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve([]);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.resolve(MOCKED_COUNTS);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve(MOCKED_INVOICES);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve([MOCKED_ACCOUNT_LOCATIONS[0]]);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                var stubSetupLocation = sandbox.stub(controller, 'setupLocation').returns(true);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubSetupLocation);

            });
            
            it('Expect that failed api call will be handled', function() {
               
                var deferredLoadActiveLocations = $q.defer();
                deferredLoadActiveLocations.resolve([]);
                var deferredLoadItems = $q.defer();
                deferredLoadItems.resolve(MOCKED_ITEMS);
                var deferredLoadCounts = $q.defer();
                deferredLoadCounts.reject(false);
                var deferredLoadInvoices = $q.defer();
                deferredLoadInvoices.resolve(MOCKED_INVOICES);
                var deferredGetLocations = $q.defer();
                deferredGetLocations.resolve(MOCKED_ACCOUNT_LOCATIONS);
                var deferredGetInfo = $q.defer();
                deferredGetInfo.resolve([]);
                var deferredLoadVendors = $q.defer();
                deferredLoadVendors.resolve(MOCKED_VENDORS);
                
                var stubLoadActiveLocations = sandbox.stub(controller.cakeActiveLocations, 'loadActiveLocations').returns(deferredLoadActiveLocations.promise);
                var stubLoadItems = sandbox.stub(controller.cakeItems, 'loadItems').returns(deferredLoadItems.promise);
                var stubLoadCounts = sandbox.stub(controller.cakeCounts, 'loadCounts').returns(deferredLoadCounts.promise);
                var stubLoadInvoices = sandbox.stub(controller.cakeInvoices, 'loadInvoices').returns(deferredLoadInvoices.promise);
                var stubGetLocations = sandbox.stub(controller.$peach.account, 'getLocations').returns(deferredGetLocations.promise);
                var stubGetInfo = sandbox.stub(controller.$peach.app, 'getInfo').returns(deferredGetInfo.promise);
                var stubLoadVendors = sandbox.stub(controller.cakeVendors, 'loadVendors').returns(deferredLoadVendors.promise);
                var stubLogError = sandbox.stub(controller.$log, 'error').returns(true);
                $rootScope.$apply();
                
                controller.activate();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubLogError);

            });

        });

        describe('createStartingCount', function() {
        
            it('Expect that first Count will be created and set as completed', function() {
                
                var deferredCreateCount = $q.defer();
                deferredCreateCount.resolve({'id': 1});
                
                var deferredUpdateCount = $q.defer();
                deferredUpdateCount.resolve({'id': 1});
                
                var stubCreateCount = sandbox.stub(controller.cakeCounts, 'createCount').returns(deferredCreateCount.promise);
                var stubUpdateCount = sandbox.stub(controller.cakeCounts, 'updateCount').returns(deferredUpdateCount.promise);
                
                controller.inventoryLocations = MOCKED_LOCATIONS.results;
                controller.accountLocationsById = {1: {'name': 'test'}};
                
                $rootScope.$apply();
                
                controller.createStartingCount();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubCreateCount);
                sinon.assert.calledOnce(stubUpdateCount);
                
                chai.expect(controller.inventoryCounts.length).to.be.equal(1);
                chai.expect(controller.inventoryCounts[0].id).to.be.equal(1);

            });
            
            it('Expect failed api call for createCount will be handled', function() {
                
                var deferredCreateCount = $q.defer();
                deferredCreateCount.reject(false);
                
                var deferredUpdateCount = $q.defer();
                deferredUpdateCount.resolve({'id': 1});
                
                var stubCreateCount = sandbox.stub(controller.cakeCounts, 'createCount').returns(deferredCreateCount.promise);
                var stubUpdateCount = sandbox.stub(controller.cakeCounts, 'updateCount').returns(deferredUpdateCount.promise);
                var stubLogError = sandbox.stub(controller.$log, 'error').returns(true);
                
                controller.inventoryLocations = MOCKED_LOCATIONS.results;
                
                $rootScope.$apply();
                
                controller.createStartingCount();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubCreateCount);
                sinon.assert.calledOnce(stubLogError);
                sinon.assert.notCalled(stubUpdateCount);
                
            });
            
            it('Expect failed api call for updateCount will be handled', function() {
                
                var deferredCreateCount = $q.defer();
                deferredCreateCount.resolve({'id': 1});
                
                var deferredUpdateCount = $q.defer();
                deferredUpdateCount.reject(false);
                
                var stubCreateCount = sandbox.stub(controller.cakeCounts, 'createCount').returns(deferredCreateCount.promise);
                var stubUpdateCount = sandbox.stub(controller.cakeCounts, 'updateCount').returns(deferredUpdateCount.promise);
                var stubLogError = sandbox.stub(controller.$log, 'error').returns(true);
                
                controller.inventoryLocations = MOCKED_LOCATIONS.results;
                
                $rootScope.$apply();
                
                controller.createStartingCount();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubCreateCount);
                sinon.assert.calledOnce(stubUpdateCount);
                sinon.assert.calledOnce(stubLogError);
                
            });

        });

        describe('hideIntroPage', function() {
            
            it('Expect that user Intro Page will be hidden', function() {
                
                var deferredSetPref = $q.defer();
                deferredSetPref.resolve(true);
                
                var deferredPublish = $q.defer();
                deferredPublish.resolve(true);

                var stubSetPref = sandbox.stub($peach.user, 'setPref').returns(deferredSetPref.promise);
                var stubPublish = sandbox.stub($peach.event, 'publish').returns(deferredPublish.promise);
                $rootScope.$apply();

                controller.hideIntroPage();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubSetPref);
                sinon.assert.calledOnce(stubPublish);
            
            });
            
            it('Expect failed api call for setPref will be handled', function() {
                
                var deferredSetPref = $q.defer();
                deferredSetPref.reject(false);
                
                var deferredPublish = $q.defer();
                deferredPublish.resolve(true);
                
                var stubSetPref = sandbox.stub($peach.user, 'setPref').returns(deferredSetPref.promise);
                var stubPublish = sandbox.stub($peach.event, 'publish').returns(deferredPublish.promise);
                var stubLogError = sandbox.stub(controller.$log, 'error').returns(true);

                $rootScope.$apply();
                
                controller.hideIntroPage();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubSetPref);
                sinon.assert.calledOnce(stubLogError);
                sinon.assert.notCalled(stubPublish);
                
            });
            
        });
        
        describe('goToItems', function() {
            
            it('Expect that user will be redirected to /settings/items page', function() {

                var stubSetValue = sandbox.stub(controller.cakeSharedData, 'setValue').returns(true);
                
                controller.goToItems();

                chai.expect(controller.$location.path()).to.be.equal('/settings/items');
                sinon.assert.calledOnce(stubSetValue);
                
            });
        });

        describe('goToReports', function() {
            
            it('Expect that user will be redirected to reports page', function() {

                var stubAbsUrl = sandbox.stub(controller.$location, 'absUrl').returns('https://my.peachworks.com/preview/accounts/1/apps/cake#/intro');
                
                //controller.goToReports();
                
            });

        });
        
        describe('setupLocation', function() {
            
            it('Expect that location will be activated for Cake', function() {
                
                var deferredActivateLocation = $q.defer();
                deferredActivateLocation.resolve({'id': 1});

                var stubActicateLocation = sandbox.stub(controller.cakeSettings, 'activateLocation').returns(deferredActivateLocation.promise);
                
                controller.accountLocationsById = {1: {'name': 'test'}};
                
                $rootScope.$apply();
                
                controller.setupLocation();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubActicateLocation);
                
                chai.expect(controller.inventoryLocations.length).to.be.equal(1);
                chai.expect(controller.inventoryLocations[0].id).to.be.equal(1);

            });
            
                        
            it('Expect failed api call for activateLocation will be handled', function() {
                
                var deferredActivateLocation = $q.defer();
                deferredActivateLocation.reject(false);
                
                var stubActicateLocation = sandbox.stub(controller.cakeSettings, 'activateLocation').returns(deferredActivateLocation.promise);
                var stubLogError = sandbox.stub(controller.$log, 'error').returns(true);
                
                controller.accountLocationsById = {1: {'name': 'test'}};

                $rootScope.$apply();
                
                controller.setupLocation();
                $rootScope.$apply();
                
                sinon.assert.calledOnce(stubActicateLocation);
                sinon.assert.calledOnce(stubLogError);
                
            });
            
        });
    
    });
});