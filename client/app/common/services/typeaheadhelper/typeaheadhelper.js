/** cakeTypeaheadHelper service
 * This is a helper service which can be used to build typehead directive suggestions
 * @author Mike Bebas/Levitated
 */



/** PRIVATE VARIABLES **/

var typeaheadData = {};



/** PRIVATE FUNCTIONS **/

/**
 * Used to load/filter cached suggestions for typeahead. It will load results from database only once - after valueMinLength characters are given in value.
 * After loading results it will only filter cached results. If again less than valueMinLength characters will be provided in value, cached results will be removed.
 * New reuqest will be made after again more than valueMinLength value characters will be provided
 * @param  {string} value                   string we search for
 * @param  {string} filteringFieldName      name of the object field we will filter results with
 * @param  {string} uniqueId                unique name under which we will cache results - identifies given typehead in this service
 * @param  {Array}  promisesArray           array with promises which will be used to load suggestions results
 * @param  {object} [loadingIndicators={}]  optional - controller scope object which will be used to display 'loading' indicators - keys are the same as passed in 'uniqueId'
 * @param  {number} [valueMinLength=2]      optional - minimal input value string length required to load suggestions from database
 * @param  {string} [sortingFieldName='']   optional - results objects field name we want to have them sorted by, if not provided, results won't be sorted
 * @return {object}                         promise object with typeahead suggestions results
 */
function typeaheadDataLoad(value, filteringFieldName, uniqueId, promisesArray, loadingIndicators, valueMinLength, sortingFieldName) {

  loadingIndicators = loadingIndicators || {};
  valueMinLength = valueMinLength || 3;
  sortingFieldName = sortingFieldName || '';

  var deferred = $q.defer();
  var dbSearchSubstr = value.substring(0, valueMinLength);
  
  //console.log("1. TYPEAHEAD PARAMS", value, filteringFieldName, uniqueId, promisesArray, loadingIndicators, valueMinLength, sortingFieldName);

  if (value && value.length >= valueMinLength) {

    if (typeaheadData[uniqueId] && typeaheadData[uniqueId]['cached'] && dbSearchSubstr === typeaheadData[uniqueId]['db_search_string'] && !typeaheadData[uniqueId]['loading']) {
        
      //console.log("TYPEAHEAD CACHED DATA");

      var filteredData = [];
      var filterObject = {};
      filterObject[filteringFieldName] = value;

      _.each(
        typeaheadData[uniqueId]['data'],
        function(data, index) {
          filteredData.splice(index, 1, $filter('filter')(data, filterObject));
          return;
        }
      );

      deferred.resolve(filteredData);

    } else if (typeaheadData[uniqueId] && typeaheadData[uniqueId]['loading'] && dbSearchSubstr === typeaheadData[uniqueId]['db_search_string']) {
        
      //console.log("TYPEAHEAD IN PROGRESS");

      typeaheadData[uniqueId]['innerDeferred'].promise.then(function() {

        var filteredData = [];
        var filterObject = {};
        filterObject[filteringFieldName] = value;

        _.each(
          typeaheadData[uniqueId]['data'],
          function(data, index) {
            filteredData.splice(index, 1, $filter('filter')(data, filterObject));
            return;
          }
        );

        deferred.resolve(filteredData);

      });

    } else if (!typeaheadData[uniqueId] || (typeaheadData[uniqueId] && !typeaheadData[uniqueId]['loading']) || (typeaheadData[uniqueId] && dbSearchSubstr !== typeaheadData[uniqueId]['db_search_string'])) {
        
      //console.log("TYPEAHEAD PULL");

      loadingIndicators[uniqueId] = true;

      typeaheadData[uniqueId] = {loading: true, cached: false, db_search_string: dbSearchSubstr, data: [], innerDeferred: $q.defer()};

      $q.all(
        _.map(
          promisesArray,
          function(promise) {
            return promise(dbSearchSubstr, 1000);
          }
        )
      )
        .then(
          function(allData) {

            _.each(
              allData,
              function(data, index) {
                if (_.isArray(data)) {
                  typeaheadData[uniqueId]['data'].splice(index, 1, data);
                } else if (data.results) {
                  typeaheadData[uniqueId]['data'].splice(index, 1, data.results);
                } else if (data.trigger_response && data.trigger_response.results && data.trigger_response.results.results) {
                  typeaheadData[uniqueId]['data'].splice(index, 1, data.trigger_response.results.results);
                } else {
                  typeaheadData[uniqueId]['data'].splice(index, 1, []);
                }

                if (sortingFieldName != '') {
                  typeaheadData[uniqueId]['data'][index] = $filter('orderBy')(typeaheadData[uniqueId]['data'][index], sortingFieldName);
                }

                return;
              }
            );

            typeaheadData[uniqueId]['cached'] = true;
            typeaheadData[uniqueId]['loading'] = false;
            typeaheadData[uniqueId]['innerDeferred'].resolve();

            loadingIndicators[uniqueId] = false;
            
            var filteredData = [];
            var filterObject = {};
            filterObject[filteringFieldName] = value;
    
            _.each(
              typeaheadData[uniqueId]['data'],
              function(data, index) {
                filteredData.splice(index, 1, $filter('filter')(data, filterObject));
                return;
              }
            );

            deferred.resolve(filteredData);

          },
          function(error) {

            // log error
            typeaheadData[uniqueId]['loading'] = false;
            deferred.resolve(typeaheadData[uniqueId]['data']);

          }
        );

    }

  } else {
      
    //console.log("TYPEAHEAD RESET");

    typeaheadData[uniqueId] = {loading: false, cached: false, db_search_string: '', data: [], innerDeferred: $q.defer()};
    deferred.resolve(typeaheadData[uniqueId]['data']);

  }

  return deferred.promise;

}



return {
  typeaheadDataLoad: typeaheadDataLoad
};