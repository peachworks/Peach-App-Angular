describe('Service: Count Groups', function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeCountGroupsServiceTestsMockedData = {
    count_groups_response: {
      'count': 2,
      'results': [
        {
          'schedule_days': null,
          'next_date': '2015-08-30',
          'start_date': '2015-08-23',
          'is_active': true,
          'is_default': false,
          'schedule_interval': 1,
          'schedule_type': 'week',
          'description': 'Default count group',
          'name': 'A',
          'id': 1,
          'created_by': 44,
          'created_at': '2015-07-20T13:54:14.714Z',
          'updated_by': 44,
          'updated_at': '2015-08-28T13:10:34.290Z'
        },
        {
          'schedule_days': null,
          'next_date': '2016-02-01',
          'start_date': '2015-10-01',
          'is_active': true,
          'is_default': false,
          'schedule_interval': 1,
          'schedule_type': 'day',
          'description': null,
          'name': 'B',
          'id': 2,
          'created_by': 44,
          'created_at': '2015-07-20T14:00:29.343Z',
          'updated_by': 44,
          'updated_at': '2015-11-18T19:31:29.414Z'
        }
      ],
      'trigger_response': {
        'default_count_group': {
          'schedule_days': null,
          'next_date': '2016-02-01',
          'start_date': '2015-10-01',
          'is_active': true,
          'is_default': false,
          'schedule_interval': 4,
          'schedule_type': 'month',
          'description': null,
          'name': 'B',
          'id': 2,
          'created_by': 44,
          'created_at': '2015-07-20T14:00:29.343Z',
          'updated_by': 44,
          'updated_at': '2015-11-18T19:31:29.414Z'
        },
        'default_count_group_included': true
      }
    },
    settings: {
      count_groups: {
        key: 'wtm_inv_count_groups',
        default_data: {
          name: '',
          description: '',
          schedule_type: 'none',
          schedule_interval: null,
          schedule_days: null,
          start_date: null,
          next_date: null,
          is_active: true,
          is_default: false
        }
      }
    }
  };

  // helper local variables
  var service, $rootScope, $peach, $q, cakeCommon;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {

    $provide.value('cakeCommon', {
      getObjectKey: function(key) {
        return cakeCountGroupsServiceTestsMockedData.settings[key]['key'];
      },
      getObjectDefaultData: function(key) {
        return cakeCountGroupsServiceTestsMockedData.settings[key]['default_data'];
      },
      makeAutoPaginatedGETRequest: function() {
        var deferred = $q.defer();
        deferred.resolve(cakeCountGroupsServiceTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getDatabaseDateFormat: function() {
        return 'YYYY-MM-DD';
      },
      uppercaseWord: function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      },
      apiErrorHandler: function() {}
    });

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');
    cakeCommon = $injector.get('cakeCommon');
    service = $injector.get('CountGroups');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Count Groups service', function() {

      expect(service).to.be.an('object');
      expect(service.$peach).to.exist;
      expect(service.$q).to.exist;
      expect(service.$resource).to.exist;
      expect(service.cakeCommon).to.exist;

      expect(service.countGroups).to.deep.equal([]);
      expect(service.countGroupsById).to.deep.equal({});
      expect(service.countGroupsInitialized).to.equal(false);

    });

  });

  describe('Activate function', function() {

    it('activate should pre-build frequencies array and pre-load default count group - api success scenario', function() {

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonDatabaseFormat = sandbox.spy(service.cakeCommon, 'getDatabaseDateFormat');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(service.countGroupsInitialized).to.equal(true);
      expect(spyCakeCommonGet.calledWithExactly(service.$resource)).to.equal(true);
      expect(spyCakeCommonGet.calledBefore(spyCakeCommonDatabaseFormat)).to.equal(true);
      expect(spyCakeCommonDatabaseFormat.called).to.equal(true);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('activate should do nothing - api error scenario', function() {

      var testError = {
        message: 'api error'
      };

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.countGroupsInitialized = false;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonDatabaseFormat = sandbox.spy(service.cakeCommon, 'getDatabaseDateFormat');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      $rootScope.$digest();

      expect(service.countGroupsInitialized).to.equal(false);
      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource).verify()).to.equal(true);
      expect(spyCakeCommonDatabaseFormat.called).to.equal(false);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

  describe('Functions', function() {

    it('createCountGroup should use given data to create entry in db using api - api success scenario', function() {

      var testData = {
        next_date: '2015-08-30',
        start_date: '2015-08-23',
        is_active: true,
        is_default: false,
        schedule_interval: 1,
        schedule_type: 'week',
        name: 'A'
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('count_groups'),
        testData
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createCountGroup(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_groups')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('createCountGroup should use given data to create entry in db using api - api error scenario', function() {

      var testData = {
        next_date: '2015-08-30',
        start_date: '2015-08-23',
        is_active: true,
        is_default: false,
        schedule_interval: 1,
        schedule_type: 'week',
        name: 'A'
      };
      var testDataParsed = _.extend(
        {},
        service.cakeCommon.getObjectDefaultData('count_groups'),
        testData
      );
      var testError = {
        message: 'api error'
      };
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceCreateExpectation = mockResource.expects('create').returns(deferred.promise);

      service.createCountGroup(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_groups')).to.equal(true);
      expect(resourceCreateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('getCountGroup should either return cached entry with given id from cache or all cached entries array if no id param given', function() {

      service.countGroups = cakeCountGroupsServiceTestsMockedData.count_groups_response.results;
      service.countGroupsById = _.object(_.pluck(cakeCountGroupsServiceTestsMockedData.count_groups_response.results, 'id'), cakeCountGroupsServiceTestsMockedData.count_groups_response.results);

      expect(service.getCountGroup()).to.deep.equal(service.countGroups);
      expect(service.getCountGroup(2)).to.deep.equal(service.countGroups[1]);

    });

    it('getCountGroups should return all cached entries array', function() {

      service.countGroups = cakeCountGroupsServiceTestsMockedData.count_groups_response.results;

      expect(service.getCountGroups()).to.deep.equal(service.countGroups);

    });

    it('getCountGroupsCollection should return all cached entries collection', function() {

      service.countGroupsById = _.object(_.pluck(cakeCountGroupsServiceTestsMockedData.count_groups_response.results, 'id'), cakeCountGroupsServiceTestsMockedData.count_groups_response.results);

      expect(service.getCountGroupsCollection()).to.deep.equal(service.countGroupsById);

    });

    it('getDefaultCountGroup should use return default count group preloaded in activate function - scenario when service already initialized', function() {

      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');

      service.getDefaultCountGroup()
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.called).to.equal(false);
      expect(result).to.deep.equal(cakeCountGroupsServiceTestsMockedData.count_groups_response.trigger_response.default_count_group);

    });

    it('getDefaultCountGroup should use return default count group preloaded in activate function - scenario when service haven\'t yet fully initialized', function() {

      var result;

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.countGroupsInitialized = false;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');

      service.getDefaultCountGroup()
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource)).to.equal(false);
      expect(result).to.deep.equal(cakeCountGroupsServiceTestsMockedData.count_groups_response.trigger_response.default_count_group);

    });

    it('getPredefinedFrequencies should use return default frequencies data pre-built in activate function - scenario when service already initialized', function() {

      var dailyFreqStartDate = moment().startOf('day').format(service.cakeCommon.getDatabaseDateFormat());
      var dailyFreqEndDate = moment(dailyFreqStartDate).add(1, 'days').format(service.cakeCommon.getDatabaseDateFormat());
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');

      service.getPredefinedFrequencies()
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.called).to.equal(false);
      expect(result).to.be.an('object');
      expect(_.keys(result).length).to.equal(8);
      expect(result['Daily']).to.deep.equal({
        schedule_type     : 'day',
        schedule_interval : 1,
        schedule_days     : null,
        start_date        : dailyFreqStartDate,
        next_date         : dailyFreqEndDate
      });

    });

    it('getPredefinedFrequencies should use return default frequencies data pre-built in activate function - scenario when service haven\'t yet fully initialized', function() {

      var dailyFreqStartDate = moment().startOf('day').format(service.cakeCommon.getDatabaseDateFormat());
      var dailyFreqEndDate = moment(dailyFreqStartDate).add(1, 'days').format(service.cakeCommon.getDatabaseDateFormat());
      var result;

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.countGroupsInitialized = false;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');

      service.getPredefinedFrequencies()
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.called).to.equal(false);
      expect(result).to.be.an('object');
      expect(_.keys(result).length).to.equal(8);
      expect(result['Daily']).to.deep.equal({
        schedule_type     : 'day',
        schedule_interval : 1,
        schedule_days     : null,
        start_date        : dailyFreqStartDate,
        next_date         : dailyFreqEndDate
      });

    });

    it('getReadableFrequency should return readable user-friendly frequency data correctly parsed from given count group data', function() {

      var testData1 = {};
      var testData2 = {schedule_type: 'never', schedule_interval: 1};
      var testData3 = {schedule_type: 'day', schedule_interval: 1};
      var testData4 = {schedule_type: 'week', schedule_interval: 1};
      var testData5 = {schedule_type: 'month', schedule_interval: 1};
      var testData6 = {schedule_type: 'year', schedule_interval: 1};
      var testData7 = {schedule_type: 'day', schedule_interval: 2, schedule_days: "[\"wednesday\",\"friday\"]"};
      var testData8 = {schedule_type: 'week', schedule_interval: 2, schedule_days: "[\"wednesday\",\"friday\"]"};
      var testData9 = {schedule_type: 'month', schedule_interval: 2, schedule_days: "[\"wednesday\",\"friday\"]"};
      var testData10 = {schedule_type: 'year', schedule_interval: 2, schedule_days: "[\"wednesday\",\"friday\"]"};
      var testData11 = {schedule_type: 'month', schedule_interval: 4, schedule_days: "[\"wednesday\",\"thursday\",\"friday\"]"};
      var testData12 = {schedule_type: 'week', schedule_interval: 4, schedule_days: "[\"wednesday\",\"thursday\",\"friday\"]"};

      expect(service.getReadableFrequency(testData1)).to.deep.equal({short: 'Never', full: 'Never'});
      expect(service.getReadableFrequency(testData2)).to.deep.equal({short: 'Never', full: 'Never'});
      expect(service.getReadableFrequency(testData3)).to.deep.equal({short: 'Daily', full: 'Every Day'});
      expect(service.getReadableFrequency(testData4)).to.deep.equal({short: 'Weekly', full: 'Every Week'});
      expect(service.getReadableFrequency(testData5)).to.deep.equal({short: 'Monthly', full: 'Every Month'});
      expect(service.getReadableFrequency(testData6)).to.deep.equal({short: 'Annual', full: 'Every Year'});
      expect(service.getReadableFrequency(testData7)).to.deep.equal({short: 'Bi-Daily', full: 'Every 2 Days'});
      expect(service.getReadableFrequency(testData8)).to.deep.equal({short: 'Bi-Weekly (Wednesday, Friday)', full: 'Every 2 Weeks on Wednesday and Friday'});
      expect(service.getReadableFrequency(testData9)).to.deep.equal({short: 'Bi-Monthly', full: 'Every 2 Months'});
      expect(service.getReadableFrequency(testData10)).to.deep.equal({short: 'Bi-Yearly', full: 'Every 2 Years'});
      expect(service.getReadableFrequency(testData11)).to.deep.equal({short: 'Quarterly', full: 'Every 4 Months'});
      expect(service.getReadableFrequency(testData12)).to.deep.equal({short: 'Every 4 Weeks (Wednesday, Thursday, Friday)', full: 'Every 4 Weeks on Wednesday, Thursday and Friday'});

    });

    it('loadCountGroups should use api to load data according to params - scenario with api success, cache enabled and service already preloaded default count group', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadCountGroups(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.countGroups).to.deep.equal(cakeCountGroupsServiceTestsMockedData.count_groups_response.results);
      expect(_.keys(service.countGroupsById).length).to.equal(service.countGroups.length);
      expect(result).to.deep.equal(cakeCountGroupsServiceTestsMockedData.count_groups_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCountGroups should use api to load data according to params - scenario with api success, cache enabled and service havent yet preloaded default count group', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var result;

      $rootScope.$digest(); // flush initial activate() function call results - its always called in contructor
      service.countGroupsInitialized = false;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'makeAutoPaginatedGETRequest');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadCountGroups(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.firstCall.calledWithExactly(service.$resource)).to.equal(true);
      expect(spyCakeCommonGet.secondCall.calledWithExactly(service.$resource, testFindParams, testOtherParams)).to.equal(true);
      expect(service.countGroups).to.deep.equal(cakeCountGroupsServiceTestsMockedData.count_groups_response.results);
      expect(_.keys(service.countGroupsById).length).to.equal(service.countGroups.length);
      expect(result).to.deep.equal(cakeCountGroupsServiceTestsMockedData.count_groups_response);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('loadCountGroups should use api to load  data according to params - scenario with api error', function() {

      var testFindParams = {test: 'test'};
      var testOtherParams = {test2: 'test2'};
      var testError = {message: 'api error'};
      var result;

      var deferred = $q.defer();
          deferred.reject(testError);
      var mockCakeCommonGet = sandbox.mock(service.cakeCommon);
      var cakeCommonAPIRequestExpectation = mockCakeCommonGet.expects('makeAutoPaginatedGETRequest').returns(deferred.promise);
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');

      service.activate();
      service.loadCountGroups(testFindParams, testOtherParams)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(cakeCommonAPIRequestExpectation.withExactArgs(service.$resource, testFindParams, testOtherParams).verify()).to.equal(true);
      expect(service.countGroups).to.deep.equal([]);
      expect(service.countGroupsById).to.deep.equal({});
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('removeCountGroup should use given id param to delete entry from db using api - api success scenario', function() {

      var testId = 1;
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve('success');
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeCountGroup(testId)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.equal('success');
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('removeCountGroup should use given id param to delete entry from db using api - api error scenario', function() {

      var testId = 1;
      var testError = {
        message: 'api error'
      };
      var result;

      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceRemoveExpectation = mockResource.expects('remove').returns(deferred.promise);

      service.removeCountGroup(testId)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(resourceRemoveExpectation.withExactArgs(testId).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

    it('updateCountGroup should use given data to update entry in db using api - api success scenario', function() {

      var testData = {
        id: 1,
        is_active: false,
        some_junk_field: true
      };
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('count_groups')
          )
        ),
        {id: testData.id}
      );
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.resolve(testDataParsed);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.updateCountGroup(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_groups')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testDataParsed);
      expect(spyCakeCommonErrorHandler.called).to.equal(false);

    });

    it('updateCountGroup should use given data to update entry in db using api - api error scenario', function() {

      var testData = {
        id: 1,
        is_active: false,
        some_junk_field: true
      };
      var testDataParsed = _.extend(
        {},
        _.pick(
          testData,
          _.keys(
            service.cakeCommon.getObjectDefaultData('count_groups')
          )
        ),
        {id: testData.id}
      );
      var testError = {
        message: 'api error'
      };
      var result;

      var spyCakeCommonGet = sandbox.spy(service.cakeCommon, 'getObjectDefaultData');
      var spyCakeCommonErrorHandler = sandbox.spy(service.cakeCommon, 'apiErrorHandler');
      var deferred = $q.defer();
          deferred.reject(testError);
      var mockResource = sandbox.mock(service.$resource);
      var resourceUpdateExpectation = mockResource.expects('update').returns(deferred.promise);

      service.updateCountGroup(testData)
        .then(
          function(response) {
            result = response;
          }, function(error) {
            result = error;
          }
        );
      $rootScope.$digest();

      expect(spyCakeCommonGet.calledWithExactly('count_groups')).to.equal(true);
      expect(resourceUpdateExpectation.withExactArgs(testDataParsed).verify()).to.equal(true);
      expect(result).to.deep.equal(testError);
      expect(spyCakeCommonErrorHandler.calledWithExactly(testError)).to.equal(true);

    });

  });

});