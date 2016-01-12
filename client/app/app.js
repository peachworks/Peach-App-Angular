import peachRc from '../../.peachrc';

import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularAria from 'angular-aria';
import angularCache from 'angular-cache';
import angularCookies from 'angular-cookies';
import angularMaterial from 'angular-material';
import angularRoute from 'angular-route';
import angularSanitize from 'angular-sanitize';
import ngPeach from 'ng-peach';
import _ from 'lodash';

import 'angular-material/angular-material.min.css'
import 'peach.css';

import routing from './app.config';

// Services
import activeLocationsService            from './common/services/activelocations/activelocations';
import commonService                     from './common/services/common/common'; // The service formerly known as cakeCommon
import countGroupsService                from './common/services/countgroups/countgroups';
import countItemsService                 from './common/services/countitems/countitems';
import countriesService                  from './common/services/countries/countries';
import countsService                     from './common/services/counts/counts';
import eventItemsService                 from './common/services/eventitems/eventitems';
import eventsService                     from './common/services/events/events';
import glAccountsService                 from './common/services/glaccounts/glaccounts';
import invoiceItemsService               from './common/services/invoiceitems/invoiceitems';
import invoicesService                   from './common/services/invoices/invoices';
import itemsService                      from './common/services/items/items';
import settingsService                   from './common/services/settings/settings';
import sharedDataService                 from './common/services/shareddata/shareddata';
import vendorsService                    from './common/services/vendors/vendors';

// Components
import AddActiveLocationController       from './components/add_active_location/add_active_location';
import BulkAddItemsController            from './components/bulk_add_items/bulk_add_items';
import CountGroupsController             from './components/count_groups/count_groups';
import CountsController                  from './components/counts/counts';
import EditCountController               from './components/edit_count/edit_count';
import EditCountGroupController          from './components/edit_count_group/edit_count_group';
import EditInvoiceController             from './components/edit_invoice/edit_invoice';
import EditItemController                from './components/edit_item/edit_item';
import EditVendorController              from './components/edit_vendor/edit_vendor';
import IntroController                   from './components/intro/intro';
import InvoicesController                from './components/invoices/invoices';
import ItemUnitsController               from './components/item_units/item_units';
import ItemsController                   from './components/items/items';
import VendorsController                 from './components/vendors/vendors';

//import MainController                    from './components/main/main';
//import SetupController                   from './components/setup/setup';

angular.module(peachRc.framework.angular.module, [
  angularAnimate,
  angularAria,
  angularCache,
  angularCookies,
  angularMaterial,
  angularRoute,
  angularSanitize,
  'ngPeach.ui',  // Need to fix this to export properly from ngPeach

  // Services
  activeLocationsService.moduleName,
  commonService.moduleName,
  countGroupsService.moduleName,
  countItemsService.moduleName,
  countriesService.moduleName,
  countsService.moduleName,
  eventItemsService.moduleName,
  eventsService.moduleName,
  glAccountsService.moduleName,
  invoiceItemsService.moduleName,
  invoicesService.moduleName,
  itemsService.moduleName,
  settingsService.moduleName,
  sharedDataService.moduleName,
  vendorsService.moduleName
])
  .config(routing)
  .controller('AddActiveLocationController', AddActiveLocationController)
  .controller('BulkAddItemsController', BulkAddItemsController)
  .controller('CountGroupsController', CountGroupsController)
  .controller('CountsController', CountsController)
  .controller('EditCountController', EditCountController)
  .controller('EditCountGroupController', EditCountGroupController)
  .controller('EditInvoiceController', EditInvoiceController)
  .controller('EditItemController', EditItemController)
  .controller('EditVendorController', EditVendorController)
  .controller('IntroController', IntroController)
  .controller('InvoicesController', InvoicesController)
  .controller('ItemUnitsController', ItemUnitsController)
  .controller('VendorsController', VendorsController);

//  .controller('MainController', MainController)
//  .controller('SetupController', SetupController);

export default peachRc.framework.angular.module;
