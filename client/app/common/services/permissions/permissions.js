/** cakePermissions service
 * Service which provides info about user permissions in cake app
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

var appPermissions;



/** CONSTRUCTOR **/

function _constructor(cakeCommon, $peach, $q) {

  _this.cakeCommon = cakeCommon;
  _this.$peach = $peach;
  _this.$q = $q;

  _this.activate();

}

_this.activate = function() {

  var __this = _this;

  var permissions = {};

  appPermissions = __this.$q(function(resolve, reject) {

    __this.cakeCommon.isUserAccountAdmin()
      .then(
        function(isAccountAdmin) {

          permissions['edit_gl_accounts'] = isAccountAdmin ? true : false;
          permissions['edit_count_groups'] = true; //isAccountAdmin ? true : false;
          permissions['edit_items'] = true; //isAccountAdmin ? true : false;
          permissions['edit_item_units'] = true; //isAccountAdmin ? true : false;
          permissions['edit_counts'] = true; //isAccountAdmin ? true : false;
          permissions['edit_receipts'] = true; //isAccountAdmin ? true : false;
          permissions['edit_invoices'] = true; //isAccountAdmin ? true : false;
          permissions['edit_vendors'] = true; //isAccountAdmin ? true : false;
          permissions['edit_active_locations'] = true; //isAccountAdmin ? true : false;

          resolve(permissions);

        }
      );

  });

}



/** PUBLIC FUNCTIONS **/

/**
 * Can be used to check if logged in user has some app permission
 * @param  {string} permissionKey - app permission key
 * @return {object} promise with permission value
 */
_this.userHasPermission = function(permissionKey) {

  var __this = _this;

  return __this.$q(function(resolve, reject) {

    appPermissions
      .then(
        function(permissions) {

          resolve(!_.isUndefined(permissions[permissionKey]) ? permissions[permissionKey] : false);

        }
      );

  });

}



_constructor(cakeCommon, $peach, $q);
return _this;