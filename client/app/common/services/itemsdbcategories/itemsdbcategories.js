/** cakeItemsDBCategories service
 * Service which will be used to load categories data from ItemsDB with our magical wtm_inv_item_db object
 * @author Mike Bebas/Levitated
 */



// This code was refactored for later easy v2 ES6 transition:
// - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
// - rename _constructor to constructor, and remove it's call from the bottom
// - update function declarations - remove _this. and 'function' keywords
// - update 'var' to 'let' where it has to be done, add const
// - rename all __this to _this
var _this = this;



/** PRIVATE VARIABLES **/

/** PRIVATE FUNCTIONS **/



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('items_db'));

}



/** PUBLIC FUNCTIONS **/

/**
 * Can be used to load itemsDB categories data from db
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @return {object} promise with response
 */
_this.getData = function(findParams, otherParams) {

  var __this = _this;

  findParams = findParams || null;
  otherParams = otherParams || {};

  otherParams['object'] = cakeCommon.getItemDBObjectKey('categories');

  return __this.$q(function(resolve, reject) {

    __this.$resource.find(findParams, otherParams)
      .then(
        function(response) {
          if (response.trigger_response.error) {
            __this.cakeCommon.apiErrorHandler(response.trigger_response.error);
            reject(response.trigger_response.error);
          } else if (response.trigger_response.results.error) {
            __this.cakeCommon.apiErrorHandler(response.trigger_response.results.error);
            reject(response.trigger_response.results.error);
          } else {
            resolve(response.trigger_response.results);
          }
        },
        function(error) {
          __this.cakeCommon.apiErrorHandler(error);
          reject(error);
        }
      );

  });

}



_constructor(cakeCommon, $peach, $q);
return _this;