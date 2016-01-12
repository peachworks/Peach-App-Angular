let moduleName = 'itemsService';

class ItemsService {
  constructor(cakeCommon, cakeCountItems, cakeEventItems, $peach, $q) {
    /** cakeItems service
     * Service which provides items data
     * @author Mike Bebas/Levitated
     */



    // This code was refactored for later easy v2 ES6 transition:
    // - using _this, later on declaration at the top and return statement at the very bottom should be removed, and all _this renamed to this
    // - rename _constructor to constructor, and remove it's call from the bottom
    // - update function declarations - remove _this. and 'function' keywords
    // - update 'var' to 'let' where it has to be done, add const
    // - rename all __this to _this
    var _this = this;



    /** PRIVATE FUNCTIONS **/

    /**
     * Used to cache loadItems request results
     * @param  {object} reqData - response object
     */
    function _processItems(reqData) {

      var __this = _this;

      __this.items = reqData.results;
      __this.itemsById = _.object(_.pluck(__this.items, 'id'), __this.items);

    }



    /** CONSTRUCTOR **/

    function _constructor(cakeCommon, cakeCountItems, cakeEventItems, $peach, $q) {

      _this.cakeCommon = cakeCommon;
      _this.cakeCountItems = cakeCountItems;
      _this.cakeEventItems = cakeEventItems;
      _this.$peach = $peach;
      _this.$q = $q;
      _this.$resource = $peach.api(cakeCommon.getObjectKey('items'));

      _this.items = [];
      _this.itemsById = {};

    }



    /** PUBLIC FUNCTIONS **/

    /**
     * Updates existing inventory items in db using bulk request
     * @param  {Array} collection - collection of items to be updated
     * @return {object} promise with response
     */
    _this.bulkUpdateItems = function(collection) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        if (collection.length > 0) {

          __this.$resource.update(collection)
            .then(
              function(response) {
                resolve(response);
              },
              function(error) {
                __this.cakeCommon.apiErrorHandler(error);
                reject(error);
              }
            );

        } else {

          resolve({collection: []});

        }

      });

    }

    /**
     * Can be used to determine if given item can be deleted
     * It doesn't check permissions, but performs additional checks, according to spec below.
     * Item can't be deleted if item has ever been used in:
     * - a recipe
     * - a count
     * - a receipt ticket
     * - a transfer event
     * - a waste event
     * - an order (supply chain integrated add on - future)
     * - an invoice (supply chain add on - future)
     * - a batch recipe (prep add on - future)
     * @param  {number} itemId - id of the item :]
     * @return {object} promise with result true/false
     */
    _this.canItemBeDeleted = function(itemId) {

      var __this = _this;

      var recipeItemsResource = __this.$peach.api(cakeCommon.getObjectKey('recipe_items'));

      return __this.$q(function(resolve, reject) {

        __this.cakeCountItems.loadCountItems(
          {
            'inv_item_id' : itemId
          },
          {
            'limit' : 1
          },
          true
        )
          .then(
            function(response) {

              if (response.results.length > 0) {

                resolve(false);

              } else {

                recipeItemsResource.find(
                  {
                    'item_id' : itemId
                  },
                  {
                    'limit' : 1
                  }
                )
                  .then(
                    function(response) {

                      if (response.results.length > 0) {

                        resolve(false);

                      } else {

                        __this.cakeEventItems.loadEventItems(
                          {
                            'inv_item_id': itemId
                          },
                          {
                            'limit' : 1
                          },
                          true
                        )
                          .then(
                            function(response) {

                              if (response.results.length > 0) {

                                resolve(false);

                              } else {

                                resolve(true);

                              }

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

              }

            },
            function(error) {

              reject(error);

            }
          );

      });

    }

    /**
     * Can be used to determine if given item common unit of measure can be changed
     * It doesn't check permissions, but performs additional checks, according to spec below.
     * Item comon unit of measure can't be changed if item has ever been used in:
     * - a recipe
     * - a count
     * - a receipt ticket
     * - a transfer event
     * - a waste event
     * - an order (supply chain integrated add on - future)
     * - an invoice (supply chain add on - future)
     * - a batch recipe (prep add on - future)
     * @param  {number} itemId - id of the item :]
     * @return {object} promise with result true/false
     */
    _this.canItemCommonUnitBeChanged = function(itemId) {

      var __this = _this;

      // this is basically the same as in canItemBeDeleted - the same conditions
      return __this.canItemBeDeleted(itemId);
      
    }

    /**
     * Creates new item in db
     * @param  {object} itemData - data which will be used to create new item
     * @param  {object} [additionalQueryParams={extended: true}] - some additional query params
     * @return {object} promise with response
     */
    _this.createItem = function(itemData, additionalQueryParams) {

      var __this = _this;

      var data = _.extend(
        {},
        __this.cakeCommon.getObjectDefaultData('items'),
        itemData
      );
      
      var queryParams = additionalQueryParams || {};
      queryParams = _.extend({extended: true}, queryParams);

      return __this.$q(function(resolve, reject) {

        __this.$resource.create(data, queryParams)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Returns single cached item, or whole array if itemId not specified or incorrect
     * @param  {number} [itemId] - id of the item to get
     * @return {object|Array} single item or all items array
     */
    _this.getItem = function(itemId) {

      var __this = _this;

      if (_.isUndefined(itemId)) {
        return __this.items;
      } else {
        return __this.itemsById[itemId];
      }

    }

    /**
     * Returns cached items array
     * @return {Array} items array
     */
    _this.getItems = function() {

      var __this = _this;

      return __this.items;

    }

    /**
     * Returns cached items collection
     * @return {object} items collection
     */
    _this.getItemsCollection = function() {

      var __this = _this;

      return __this.itemsById;

    }

    /**
     * Can be used to load items from db, eventually caching results
     * @param {object} [findParams] - find query params
     * @param {object} [otherParams] - other query params - paginations, sorting etc
     * @param {boolean} [disableCache=false] - true/false depending if user wants results to be cached
     * @return {object} promise with response
     */
    _this.loadItems = function(findParams, otherParams, disableCache) {

      var __this = _this;

      findParams = findParams || null;
      otherParams = otherParams || null;
      disableCache = disableCache || false;

      return __this.$q(function(resolve, reject) {

        //__this.$resource.find(findParams, otherParams)
        __this.cakeCommon.makeAutoPaginatedGETRequest(__this.$resource, findParams, otherParams)
          .then(
            function(response) {
              if (!disableCache) {
                _processItems(response);
              }
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Deletes item from db
     * @param {number} itemId - id of the item to be deleted
     * @return {object} promise with response
     */
    _this.removeItem = function(itemId) {

      var __this = _this;

      return __this.$q(function(resolve, reject) {

        __this.$resource.remove(itemId)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

    /**
     * Updates existing item in db
     * @param  {object} itemData - data which will be used to update item
     * @param  {object} [additionalQueryParams={extended: true}] - some additional query params
     * @return {object} promise with response
     */
    _this.updateItem = function(itemData, additionalQueryParams) {

      var __this = _this;

      var data = _.pick(
        itemData,
        _.keys(
          __this.cakeCommon.getObjectDefaultData('items')
        )
      );
      data['id'] = itemData.id;
      
      var queryParams = additionalQueryParams || {};
      queryParams = _.extend({extended: true}, queryParams);


      return __this.$q(function(resolve, reject) {

        __this.$resource.update(data, queryParams)
          .then(
            function(response) {
              resolve(response);
            },
            function(error) {
              __this.cakeCommon.apiErrorHandler(error);
              reject(error);
            }
          );

      });

    }

  }
}

ItemsService.$inject = ['commonService', 'countItemsService', 'eventItemsService', '$peach', '$q'];

angular.module(moduleName, ['ngPeach.ui', 'ngRoute']).service(moduleName, ItemsService)

export default {moduleName, service: ItemsService};