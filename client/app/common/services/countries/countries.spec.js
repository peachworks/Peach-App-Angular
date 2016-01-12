describe('Service: Countries', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeCountriesServiceTestsMockedData = {
    countries_response: {
      count: 2,
      results: [
        {
          "id": 1,
          "iso2": "AF",
          "iso3": "AFG",
          "name_en": "Afghanistan"
        }, {
          "id": 2,
          "iso2": "AX",
          "iso3": "ALA",
          "name_en": "Åland Islands"
        }
      ]
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

    $provide.value('cakeCommon', {
      apiErrorHandler: function() {}
    });

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    service = $injector.get('Countries');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Countries service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.countries).to.deep.equal([]);
      expect(service.countriesById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('getCountry should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.countries = cakeCountriesServiceTestsMockedData.countries_response.results;
      service.countriesById = _.object(_.pluck(cakeCountriesServiceTestsMockedData.countries_response.results, 'id'), cakeCountriesServiceTestsMockedData.countries_response.results);

      expect(service.getCountry()).to.deep.equal(service.countries);
      expect(service.getCountry(2)).to.deep.equal(service.countries[1]);

    });

    it('getCountries should return all cached entries array', function() {

      service.countries = cakeCountriesServiceTestsMockedData.countries_response.results;

      expect(service.getCountries()).to.deep.equal(service.countries);

    });

    it('getCountriesCollection should return all cached entries collection', function() {

      service.countriesById = _.object(_.pluck(cakeCountriesServiceTestsMockedData.countries_response.results, 'id'), cakeCountriesServiceTestsMockedData.countries_response.results);

      expect(service.getCountriesCollection()).to.deep.equal(service.countriesById);

    });

    it('loadCountries should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      service.$resource = {
        find: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeCountriesServiceTestsMockedData.countries_response);
          return deferred.promise;
        }
      };

      var spyResourceGet = sandbox.spy(service.$resource, 'find');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadCountries(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyResourceGet.calledWithExactly(testFindParams, testOtherParams)).to.equal(true);
      expect(service.countries).to.deep.equal(cakeCountriesServiceTestsMockedData.countries_response.results);
      expect(_.keys(service.countriesById).length).to.equal(service.countries.length);
      expect(result).to.deep.equal(cakeCountriesServiceTestsMockedData.countries_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCountries should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      service.$resource = {
        find: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeCountriesServiceTestsMockedData.countries_response);
          return deferred.promise;
        }
      };

      var spyResourceGet = sandbox.spy(service.$resource, 'find');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadCountries(testFindParams, testOtherParams, true)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyResourceGet.calledWithExactly(testFindParams, testOtherParams)).to.equal(true);
      expect(service.countries).to.deep.equal([]);
      expect(service.countriesById).to.deep.equal({});
      expect(result).to.deep.equal(cakeCountriesServiceTestsMockedData.countries_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCountries should use api to load data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResourceGet = sandbox.mock(service.$resource);
      var resourceGetExpectation = mockResourceGet.expects('find').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadCountries(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(resourceGetExpectation.withExactArgs(testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.countries).to.deep.equal([]);
      expect(service.countriesById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});