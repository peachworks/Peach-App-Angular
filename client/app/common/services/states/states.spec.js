describe('Service: States', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeStatesServiceTestsMockedData = {
    states_response: {
      count: 2,
      results: [
        {"id":1,"country_id":227,"state":"Alabama"},
        {"id":2,"country_id":227,"state":"Alaska"}
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
    service = $injector.get('States');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct States service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.states).to.deep.equal([]);
      expect(service.statesById).to.deep.equal({});

    });

  });

  describe('Functions', function() {

    it('getState should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.states = cakeStatesServiceTestsMockedData.states_response.results;
      service.statesById = _.object(_.pluck(cakeStatesServiceTestsMockedData.states_response.results, 'id'), cakeStatesServiceTestsMockedData.states_response.results);

      expect(service.getState()).to.deep.equal(service.states);
      expect(service.getState(2)).to.deep.equal(service.states[1]);

    });

    it('getStates should return all cached entries array', function() {

      service.states = cakeStatesServiceTestsMockedData.states_response.results;

      expect(service.getStates()).to.deep.equal(service.states);

    });

    it('getStatesCollection should return all cached entries collection', function() {

      service.statesById = _.object(_.pluck(cakeStatesServiceTestsMockedData.states_response.results, 'id'), cakeStatesServiceTestsMockedData.states_response.results);

      expect(service.getStatesCollection()).to.deep.equal(service.statesById);

    });

    it('loadStates should use api to load data according to params - scenario with api success and cache enabled', function() {

      var testId = "1";
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var mockedApi = {
        find: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeStatesServiceTestsMockedData.states_response);
          return deferred.promise;
        }
      };
      var mockResourceGet = sandbox.mock(service.$peach);
      var resourceGetExpectation = mockResourceGet.expects('api').returns(mockedApi);
      var spyApiFind = sandbox.spy(mockedApi, 'find');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadStates(testId, testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(resourceGetExpectation.withExactArgs('/countries/'+parseInt(testId)+'/states').verify()).to.equal(true);
      expect(spyApiFind.calledWithExactly(testFindParams, testOtherParams)).to.equal(true);
      expect(service.states).to.deep.equal(cakeStatesServiceTestsMockedData.states_response.results);
      expect(_.keys(service.statesById).length).to.equal(service.states.length);
      expect(result).to.deep.equal(cakeStatesServiceTestsMockedData.states_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadStates should use api to load data according to params - scenario with api success and cache disabled', function() {

      var testId = "1";
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var mockedApi = {
        find: function() {
          var deferred = $q.defer();
          deferred.resolve(cakeStatesServiceTestsMockedData.states_response);
          return deferred.promise;
        }
      };
      var mockResourceGet = sandbox.mock(service.$peach);
      var resourceGetExpectation = mockResourceGet.expects('api').returns(mockedApi);
      var spyApiFind = sandbox.spy(mockedApi, 'find');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadStates(testId, testFindParams, testOtherParams, true)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(resourceGetExpectation.withExactArgs('/countries/'+parseInt(testId)+'/states').verify()).to.equal(true);
      expect(spyApiFind.calledWithExactly(testFindParams, testOtherParams)).to.equal(true);
      expect(service.states).to.deep.equal([]);
      expect(service.statesById).to.deep.equal({});
      expect(result).to.deep.equal(cakeStatesServiceTestsMockedData.states_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadStates should use api to load data according to params - scenario with api error', function() {

      var testId = "1";
      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var mockedApi = {
        find: function() {
          var deferred = $q.defer();
          deferred.reject(testError);
          return deferred.promise;
        }
      };
      var mockResourceGet = sandbox.mock(service.$peach);
      var resourceGetExpectation = mockResourceGet.expects('api').returns(mockedApi);
      var spyApiFind = sandbox.spy(mockedApi, 'find');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.loadStates(testId, testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(resourceGetExpectation.withExactArgs('/countries/'+parseInt(testId)+'/states').verify()).to.equal(true);
      expect(spyApiFind.calledWithExactly(testFindParams, testOtherParams)).to.equal(true);
      expect(service.states).to.deep.equal([]);
      expect(service.statesById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});