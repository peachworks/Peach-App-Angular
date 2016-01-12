describe("Service: Settings", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeSettingsServiceTestsMockedData = {
    api_url             : 'url/',
    api_version         : 'v1',
    prefs               : {
      units_of_measure_loaded: true
    },
    active_locations_response : {
      count: 1,
      results: [
        {
          copied_from: null,
          created_at: "2015-10-08T14:43:58.042Z",
          created_by: 44,
          id: 1,
          is_copied: false,
          location_id: 7,
          updated_at: "2015-10-08T14:43:58.042Z",
          updated_by: null
        }
      ]
    },
    locations_response  : {
      count: 2,
      results: [
        {
          address1: null,
          address2: null,
          city: null,
          country_id: 227,
          created_at: "2013-09-27T18:37:45.348Z",
          created_by: 138,
          id: 5,
          is_deleted: false,
          name: "LLS location",
          number: "4444",
          org_group_id: null,
          phone: null,
          state_id: 3498,
          tags: null,
          timezone: "Africa/Abidjan",
          updated_at: "2014-07-15T00:23:05.650Z",
          updated_by: 138,
          zip: "48114"
        },
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
          zip: null
        }
      ]
    }
  };

  // helper local variables
  var service, $rootScope, $httpBackend, $peach, $q, cakeActiveLocations, cakeCommon;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

      $provide.value('$peach', {
        account: {
          getPrefs: function(prefName) {
            var deferred = $q.defer();
            deferred.resolve({is_admin: cakeSettingsServiceTestsMockedData.prefs[prefName]});
            return deferred.promise;
          },
          getLocations: function() {
            var deferred = $q.defer();
            deferred.resolve({is_admin: cakeSettingsServiceTestsMockedData.locations_response});
            return deferred.promise;
          }
        },
        session: {
          getApiUrl: function() {
            return cakeSettingsServiceTestsMockedData.api_url;
          },
          getApiVersion: function() {
            return cakeSettingsServiceTestsMockedData.api_version;
          }
        }
      });

      $provide.value('cakeActiveLocations', {
        loadActiveLocations: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeSettingsServiceTestsMockedData.active_locations_response);
          return deferred.promise;
        },
        createActiveLocation: function(newActiveLocationData) {
          var deferred = $q.defer();
          deferred.resolve(newActiveLocationData);
          return deferred.promise;
        }
      });

      $provide.value('cakeCommon', {
        apiErrorHandler: function() {}
      });

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeActiveLocations = $injector.get('cakeActiveLocations');
    cakeCommon = $injector.get('cakeCommon');
    service = $injector.get('Settings');

    $httpBackend.when('GET', 'url/time').respond({time: 000000011112222});

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Settings service', function() {

      expect(service).to.be.an("object");
      expect(service.$http).to.exist;
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.cakeActiveLocations).to.exist;
      expect(service.cakeCommon).to.exist;

    });

  });

  describe('Activate function', function() {

    it('activate should refresh settings', function() {

      var spyRefresh = sandbox.spy(service, 'refreshSettings');
      
      service.activate();

      expect(spyRefresh.called).to.equal(true);

    });

  });

  describe('Functions', function() {

    it('activateLocation should use api to create new entry and refresh active locations settings - scenario without copying', function() {

      var spyCreate = sandbox.spy(service.cakeActiveLocations, 'createActiveLocation');
      var spyReresh = sandbox.spy(service, 'refreshSettings');

      service.activateLocation({location_id: 1}).then(function(){

        expect(spyCreate.calledWithExactly({location_id: 1})).to.equal(true);
        expect(spyReresh.calledWithExactly('active_locations')).to.equal(true);

      });

      $rootScope.$digest();

    });

    it('activateLocation should use api to create new entry and refresh active locations settings - scenario with copying', function() {

      var spyCreate = sandbox.spy(service.cakeActiveLocations, 'createActiveLocation');
      var spyReresh = sandbox.spy(service, 'refreshSettings');

      service.activateLocation({location_id: 1, copy_data_from_location_id: 2}).then(function(){

        expect(spyCreate.calledWithExactly({location_id: 1, is_copied: true, copied_from: 2})).to.equal(true);
        expect(spyReresh.calledWithExactly('active_locations')).to.equal(true);

      });

      $rootScope.$digest();

    });

    it('getSettings should return previously loaded and parsed values', function() {

      var spyPeachAccount = sandbox.spy(service.$peach.account, 'getPrefs');

      expect(service.getSettings()).to.be.an('object');
      expect(service.getSettings('x')).to.equal(undefined);

      service.getSettings('units_of_measure_loaded').then(function(response) {

        expect(response).to.equal(cakeSettingsServiceTestsMockedData.prefs['units_of_measure_loaded']);

      });

      $rootScope.$digest();

    });

    it('refreshSettings without param should refresh all settings', function() {

      var spyPeachAccountPrefs = sandbox.spy(service.$peach.account, 'getPrefs');
      var spyPeachAccountLocs = sandbox.spy(service.$peach.account, 'getLocations');
      var spyCakeActLocs = sandbox.spy(service.cakeActiveLocations, 'loadActiveLocations');
      var spyPeachSessionApiUrl = sandbox.spy(service.$peach.session, 'getApiUrl');
      var spyPeachSessionApiVersion = sandbox.spy(service.$peach.session, 'getApiVersion');

      expect(service.refreshSettings()).to.be.an('object');
      $rootScope.$digest();
      expect(spyPeachAccountPrefs.calledWithExactly('units_of_measure_loaded')).to.equal(true);
      expect(spyPeachAccountLocs.called).to.equal(true);
      expect(spyCakeActLocs.called).to.equal(true);
      expect(spyPeachSessionApiUrl.called).to.equal(true);
      expect(spyPeachSessionApiVersion.called).to.equal(true);

    });

    it('refreshSettings with unknown param should do nothing and return undefined', function() {

      expect(service.refreshSettings('x')).to.equal(undefined);

    });

  });

});