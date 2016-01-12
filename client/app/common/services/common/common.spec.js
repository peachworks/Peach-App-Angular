describe("Service: Common", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var cakeCommonServiceTestsMockedData = {
    dev_preview: false,
    is_admin: true
  };

  // helper local variables
  var service, $rootScope, $log, $peach, $q, peachSessionStub, peachAccountStub;


  // initialize app module
  beforeEach(module('cakeApp'));


  beforeEach(module(function($provide) {
      $provide.value('$peach', {
        session: {
          isPreview: function() {
            return cakeCommonServiceTestsMockedData.dev_preview;
          }
        },
        account: {
          getInfo: function() {
            var deferred = $q.defer();
            deferred.resolve({is_admin: cakeCommonServiceTestsMockedData.is_admin});
            return deferred.promise;
          }
        }
      });

      window.alert = function() {};

  }));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $log = $injector.get('$log');
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $peach = $injector.get('$peach');
    service = $injector.get('Common');

  }));


  afterEach(function() {

    sandbox.restore();

  });


  describe('Constructor', function() {

    it('should construct Common service', function() {

      expect(service).to.be.an("object");
      expect(service.$peach).to.not.equal(null);
      expect(service.$q).to.not.equal(null);

    });

  });

  describe('Activate function', function() {

    it('activate should set up correct properties which it also gets from $peach - non dev preview scenario', function() {
      
      service.activate();

      $rootScope.$digest();

      expect(service.isDevPreviewModeRunning()).to.equal(cakeCommonServiceTestsMockedData.dev_preview);
      service.isUserAccountAdmin().then(function(result) {
        expect(result).to.equal(cakeCommonServiceTestsMockedData.is_admin);
      })

    });

    it('activate should set up correct properties which it also gets from $peach - dev preview scenario', function() {

      peachAccountStub = sandbox.stub(service.$peach.account, 'getInfo', function() {
        var deferred = $q.defer();
        deferred.resolve({is_admin: false});
        return deferred.promise;
      });
      peachSessionStub = sandbox.stub(service.$peach.session, 'isPreview', function() { return true; });

      service.activate();

      $rootScope.$digest();

      expect(service.isDevPreviewModeRunning()).to.equal(true);
      service.isUserAccountAdmin().then(function(result) {
        expect(result).to.equal(true);
      })

    });

    it('activate should set up correct properties which it also gets from $peach - dev preview scenario with api error', function() {

      peachAccountStub = sandbox.stub(service.$peach.account, 'getInfo', function() {
        var deferred = $q.defer();
        deferred.reject({error: 'api error'});
        return deferred.promise;
      });

      service.activate();

      $rootScope.$digest();

      expect(service.isDevPreviewModeRunning()).to.equal(false);
      service.isUserAccountAdmin().then(function(result) {
        expect(result).to.equal(false);
      })

    });

  });

  describe('Functions', function() {

    it('apiErrorHandler should log error message and eventually display alert', function() {

      var messageString = 'some error message';
      var messageObject = {someval: 1};
      var spyErrorLog = sinon.spy(service.$log, 'error');
      var spyAlert = sinon.spy(window, 'alert');

      service.apiErrorHandler(messageString);

      expect(spyErrorLog.calledWithExactly(messageString)).to.equal(true);
      expect(spyAlert.callCount).to.equal(0);

      service.apiErrorHandler(messageString, true);

      expect(spyErrorLog.calledWithExactly(messageString)).to.equal(true);
      expect(spyAlert.callCount).to.equal(1);

    });

    it('getCakeApiKey should return correct setting value', function() {

      expect(service.getCakeApiKey()).to.equal('cake');

    });

    it('getCakeFloatRegex should return correct setting value', function() {

      expect(service.getCakeFloatRegex().toString()).to.equal(/^\s*[-+]?(\d{0,9}\.?\d{0,5}|\d{1,9}\.)\s*$/i.toString());

    });

    it('getCoreApiKey should return correct setting value', function() {

      expect(service.getCoreApiKey()).to.equal('wtm');

    });

    it('getCountingTaskId should return correct setting value', function() {

      expect(service.getCountingTaskId()).to.equal(50);

    });

    it('getDatabaseDateFormat should return correct setting value', function() {

      expect(service.getDatabaseDateFormat()).to.equal('YYYY-MM-DD');

    });

    it('getDatabaseTimeFormat should return correct setting value', function() {

      expect(service.getDatabaseTimeFormat()).to.equal('HH:mm:ss');

    });

    it('getItemDBObjectKey should return correct setting value', function() {

      expect(service.getItemDBObjectKey('items')).to.equal('wtm_item_db_items');
      expect(service.getItemDBObjectKey('x')).to.equal(undefined);
      expect(service.getItemDBObjectKey()).to.be.an('object');

    });

    it('getObjectDefaultData should return correct setting value', function() {

      expect(service.getObjectDefaultData('active_locations')).to.deep.equal({
        is_copied         : false,
        copied_from       : null,
        location_id       : null
      });
      expect(service.getObjectDefaultData('x')).to.equal(null);
      expect(service.getObjectDefaultData()).to.equal(null);

    });

    it('getObjectKey should return correct setting value', function() {

      expect(service.getObjectKey('active_locations')).to.equal('wtm_inv_locs');
      expect(service.getObjectKey('x')).to.equal(null);
      expect(service.getObjectKey()).to.equal(null);

    });

    it('isDevPreviewModeRunning should return correct setting value', function() {

      expect(service.isDevPreviewModeRunning()).to.equal(cakeCommonServiceTestsMockedData.dev_preview);

    });

    it('isUserAccountAdmin should return correct setting value', function() {

      service.isUserAccountAdmin().then(function(result) {
        expect(result).to.equal(cakeCommonServiceTestsMockedData.is_admin);
      })

    });

    it('makeAutoPaginatedGETRequest should autopaginate call and return all pages results together in sigle result set', function() {

      var resource = {
        find: function(findParams, otherParams) {

          var deferred = $q.defer();

          if (otherParams.page == 10) {

            deferred.resolve({count:9999, results: [1]});

          } else {

            deferred.resolve({count:9999, results: [0]});

          }

          return deferred.promise;

        }
      };
      var spyRequest = sinon.spy(resource, 'find');

      service.makeAutoPaginatedGETRequest(resource, null, {limit: 100}).then(function() {

        expect(spyRequest.calledWithExactly(null, {limit: 100})).to.equal(true);
        expect(spyRequest.callCount).to.equal(1);

      });

      $rootScope.$digest();

      spyRequest.reset();

      service.makeAutoPaginatedGETRequest(resource).then(function(response) {

        expect(spyRequest.callCount).to.equal(10);

        expect(response.results.length).to.equal(10);
        expect(response.results[9]).to.equal(1);

      });

      $rootScope.$digest();

    });

    it('parseCakeFloatValue should either return default value or float with max 5 decimal digits, but always a number', function() {

      var input = 3.333333333;
      var input2 = '1';
      var defVal = 10;

      expect(service.parseCakeFloatValue()).to.equal(0);
      expect(service.parseCakeFloatValue(null, defVal)).to.equal(defVal);
      expect(service.parseCakeFloatValue(undefined, defVal)).to.equal(defVal);

      expect(service.parseCakeFloatValue(input)).to.equal(3.33333);
      expect(service.parseCakeFloatValue(input2)).to.equal(1);

    });

    it('parseCakeCostFloatValue should either return default value or formatted string, but the value always should be string type', function() {

      var input = 3.333333333;
      var input2 = '1';
      var input3 = '2.999999';
      var defVal = '3.33';

      expect(service.parseCakeCostFloatValue()).to.equal('0.00');
      expect(service.parseCakeCostFloatValue(null, defVal)).to.equal(defVal);
      expect(service.parseCakeCostFloatValue(undefined, defVal)).to.equal(defVal);

      expect(service.parseCakeCostFloatValue(input)).to.equal('3.33333');
      expect(service.parseCakeCostFloatValue(input2)).to.equal('1.00');
      expect(service.parseCakeCostFloatValue(input3, '0.00', 3)).to.equal('3.000');

    });

    it('uppercaseWord should uppercase word :)', function() {

      var input = "test string";
      var output= "Test string";

      expect(service.uppercaseWord(input)).to.equal(output);

    });

  });

});