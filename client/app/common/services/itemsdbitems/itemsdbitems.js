/** cakeItemsDBItems service
 * Service which will be used to load items data from ItemsDB with our magical wtm_inv_item_db object
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

/**
 * Can be used to find 'COGS' type gl account with name exactly like name param
 * Eventually, if parentName param provided, found gl account should also have parent gl account with name exactly like parentName
 * If gl account found - it will be returned, if not - either default gl account (if user doesnt have permissions to create new gl accounts) or dummy gl account (if user can create gl accounts) will be returned
 * @param  {string} name - name of gl account we're looking for
 * @param  {string} [parentName] - name of parent gl account
 * @return {object} promise with gl account
 */
function _glAccountsHelper(name, parentName) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    __this.cakeGLAccounts.loadGLAccounts(
      {
        type: 'COGS'
      },
      null,
      true
    )
      .then(
        function(response) {

          var parentGLAccount;
          var glAccount;

          // if parent category found, look for gl account with the same name
          if (parentName) {

            parentGLAccount = _.find(response.results, {name: parentName});

            // if parent gl account found, look for gl account with name same as category, and parent id set to found parent gl account
            if (parentGLAccount) {

              glAccount = _.find(response.results, {name: name, parent_id: parentGLAccount.id});

            // if parent gl account not found, then also gl account not found
            } else {

            }

          // if there wasn't parent category found, look just for gl account with the same name as category
          } else {

            glAccount = _.find(response.results, {name: name});

          }

          // if gl account was found, return it
          if (glAccount) {

            resolve(glAccount);

          } else {

            // if gl account was not found, return:
            // - default gl account - if current user cant edit gl accounts
            // - temp gl account with id:0 and name like the category we were looking for - if user can edit gl accounts - later on before POST trigger in wtm_inv_items will recognize sent gl_account_id: 0 and create gl accounts structure for us
            __this.cakePermissions.userHasPermission('edit_gl_accounts')
              .then(
                function(canEditGLAccounts) {

                  if (canEditGLAccounts) {

                    resolve({id: 0, name: name});

                  } else {

                    __this.cakeGLAccounts.getDefaultGLAccount()
                      .then(
                        function(defaultGLAccount) {
                          resolve(defaultGLAccount);
                        }
                      );

                  }

                }
              );

          }

        },
        function(error) {

          reject(error);

        }
      );

  });

}



/** CONSTRUCTOR **/

function _constructor(cakeCommon, cakeGLAccounts, cakeItemsDBCategories, cakePermissions, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.cakeGLAccounts = cakeGLAccounts;
  _this.cakeItemsDBCategories = cakeItemsDBCategories;
  _this.cakePermissions = cakePermissions;
  _this.$peach = $peach;
  _this.$q = $q;
  _this.$resource = $peach.api(cakeCommon.getObjectKey('items_db'));

}



/** PUBLIC FUNCTIONS **/

/**
 * Can be used to load itemsDB items data from db
 * @param {object} [findParams] - find query params
 * @param {object} [otherParams] - other query params - paginations, sorting etc
 * @return {object} promise with response
 */
_this.getData = function(findParams, otherParams) {

  var __this = _this;

  findParams = findParams || null;
  otherParams = otherParams || {};

  otherParams['object'] = cakeCommon.getItemDBObjectKey('items');

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

/**
 * This can be used to find gl account for item from itemsDB, based on it's category id
 * @param  {number} dbItemCategoryId - id of category
 * @return {object} promise with gl account
 */
_this.getItemsDBItemGLAccountFromCategoryId = function(dbItemCategoryId) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    // load db item category
    __this.cakeItemsDBCategories.getData(
      {
        id: dbItemCategoryId
      },
      {
        fields: 'id,name,parent_id'
      }
    )
      .then(
        function(results) {

          // couldn't find category, return default gl account
          if (results.length == 0) {

            __this.cakeGLAccounts.getDefaultGLAccount()
              .then(
                function(defaultGLAccount) {
                  resolve(defaultGLAccount);
                }
              );

          // got category name, find gl account with the same name
          } else {

            var categoryName = results['results'][0]['name'];

            // if this category also has parent category - load it before searchning for gl accounts
            if (results['results'][0]['parent_id']) {

              __this.cakeItemsDBCategories.getData(
                {
                  id: results['results'][0]['parent_id']
                },
                {
                  fields: 'id,name,parent_id'
                }
              )
                .then(
                  function(results2) {

                    // if there wasn't parent category found, look just for gl account with the same name as category
                    if (results2.length == 0) {

                      _glAccountsHelper(categoryName)
                        .then(
                          function(glAccount) {
                            resolve(glAccount);
                          },
                          function(error) {
                            reject(error);
                          }
                        );

                    // if parent category found, look for gl account with the same name and the parent
                    } else {

                      var parentCategoryName = results2['results'][0]['name'];

                      _glAccountsHelper(categoryName, parentCategoryName)
                        .then(
                          function(glAccount) {
                            resolve(glAccount);
                          },
                          function(error) {
                            reject(error);
                          }
                        );

                    }

                  },
                  function(error) {

                    reject(error);

                  }
                );

            // if category doesnt have any parent, look just for gl account with the same name as category
            } else {

              _glAccountsHelper(categoryName)
                .then(
                  function(glAccount) {
                    resolve(glAccount);
                  },
                  function(error) {
                    reject(error);
                  }
                );

            }

          }

        },
        function(error) {

          reject(error);

        }
      );

  });

}

// get itemsdb item units combined with itemdb units
_this.getItemsDBItemUnits = function(itemsDBItemId) {

  var __this = _this;

  var findParams = {
    item_id : itemsDBItemId
  };

  var otherParams = {
    object    : cakeCommon.getItemDBObjectKey('item_units'),
    limit     : 1000
  }

  return __this.$q(function(resolve, reject) {

    __this.$resource.find(findParams, otherParams)
      .then(
        function(response1) {

          if (response1.trigger_response.error) {
            __this.cakeCommon.apiErrorHandler(response1.trigger_response.error);
            reject(response1.trigger_response.error);
          } else if (response1.trigger_response.results.error) {
            __this.cakeCommon.apiErrorHandler(response1.trigger_response.results.error);
            reject(response1.trigger_response.results.error);
          } else {

            var unitsIds = _.uniq(_.pluck(response1.trigger_response.results.results, 'unit_id'));

            var findParams2 = {
              id : unitsIds.length > 0 ? unitsIds : 0
            };

            var otherParams2 = {
              object    : cakeCommon.getItemDBObjectKey('units'),
              limit     : 1000
            }

            __this.$resource.find(findParams2, otherParams2)
              .then(
                function(response2) {

                  if (response2.trigger_response.error) {
                    __this.cakeCommon.apiErrorHandler(response2.trigger_response.error);
                    reject(response2.trigger_response.error);
                  } else if (response2.trigger_response.results.error) {
                    __this.cakeCommon.apiErrorHandler(response2.trigger_response.results.error);
                    reject(response2.trigger_response.results.error);
                  } else {

                    var unitsById = _.object(_.pluck(response2.trigger_response.results.results, 'id'), response2.trigger_response.results.results);

                    _.each(
                      response1.trigger_response.results.results,
                      function(itemsDBItemUnit) {

                        itemsDBItemUnit.unit_id = unitsById[itemsDBItemUnit.unit_id] ? unitsById[itemsDBItemUnit.unit_id] : itemsDBItemUnit.unit_id;
                        itemsDBItemUnit.common_unit_id = unitsById[itemsDBItemUnit.common_unit_id] ? unitsById[itemsDBItemUnit.common_unit_id] : itemsDBItemUnit.common_unit_id;

                        return;

                      }
                    );

                    resolve(response1.trigger_response.results);

                  }

                },
                function(error) {
                  __this.cakeCommon.apiErrorHandler(error);
                  reject(error);
                }
              );

          }

        },
        function(error) {
          __this.cakeCommon.apiErrorHandler(error);
          reject(error);
        }
      );

  });

}




_constructor(cakeCommon, cakeGLAccounts, cakeItemsDBCategories, cakePermissions, $peach, $q);
return _this;