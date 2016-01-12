describe("Controller: Edit Invoice", function() {

    var expect = chai.expect;
    var sandbox = sinon.sandbox.create();

    var editInvoiceControllerTestsMockedData = {
      is_user_account_admin       : true,
      is_dev_preview_mode_running : false,
      float_regex                 : /^\s*[-+]?(\d{0,9}\.?\d{0,5}|\d{1,9}\.)\s*$/i,
      user                        : {first_name: 'test', last_name: 'tester', id: 44},
      gl_accounts_response        : {"count": 14, "results":[{"is_active":true,"subtype":"food","type":"COGS","description":"Our food costs","number":"3001","name":"Food","parent_id":null,"id":1,"created_by":44,"created_at":"2014-09-19T10:11:37.735Z","updated_by":null,"updated_at":"2014-09-19T10:11:37.735Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Default","parent_id":null,"id":2,"created_by":44,"created_at":"2014-09-19T10:17:54.819Z","updated_by":44,"updated_at":"2014-09-22T09:53:23.678Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Produce","parent_id":1,"id":10,"created_by":44,"created_at":"2014-09-23T10:29:24.754Z","updated_by":null,"updated_at":"2014-09-23T10:29:24.754Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Dairy","parent_id":1,"id":11,"created_by":44,"created_at":"2014-09-23T10:51:04.206Z","updated_by":null,"updated_at":"2014-09-23T10:51:04.206Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Alcohol","parent_id":null,"id":12,"created_by":44,"created_at":"2014-09-24T10:33:10.579Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.579Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Liquor","parent_id":12,"id":13,"created_by":44,"created_at":"2014-09-24T10:33:10.670Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.670Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Seafood","parent_id":1,"id":14,"created_by":44,"created_at":"2014-10-02T09:49:58.100Z","updated_by":null,"updated_at":"2014-10-02T09:49:58.100Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Poultry","parent_id":1,"id":15,"created_by":44,"created_at":"2014-10-02T20:34:17.138Z","updated_by":null,"updated_at":"2014-10-02T20:34:17.138Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beer","parent_id":12,"id":16,"created_by":44,"created_at":"2014-10-08T20:58:59.896Z","updated_by":null,"updated_at":"2014-10-08T20:58:59.896Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Meat","parent_id":1,"id":17,"created_by":44,"created_at":"2014-10-27T18:05:32.807Z","updated_by":null,"updated_at":"2014-10-27T18:05:32.807Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beverages","parent_id":1,"id":28,"created_by":44,"created_at":"2014-11-14T08:25:00.699Z","updated_by":null,"updated_at":"2014-11-14T08:25:00.699Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Misc. Food","parent_id":1,"id":30,"created_by":44,"created_at":"2015-01-22T13:31:10.619Z","updated_by":null,"updated_at":"2015-01-22T13:31:10.619Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":32,"created_by":44,"created_at":"2015-05-14T20:08:31.553Z","updated_by":null,"updated_at":"2015-05-14T20:08:31.553Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Bread","parent_id":1,"id":35,"created_by":44,"created_at":"2015-07-17T09:09:59.773Z","updated_by":null,"updated_at":"2015-07-17T09:09:59.773Z"}]},
      units_response              : {"count":32,"results":[{"type":"each","metric_base":null,"english_base":null,"abbr":"bg","is_metric":false,"name":"Bag","id":2,"created_by":44,"created_at":"2014-06-17T15:01:02.984Z","updated_by":null,"updated_at":"2014-06-30T14:24:50.873Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bat","is_metric":false,"name":"Batch","id":3,"created_by":44,"created_at":"2014-06-17T15:01:34.911Z","updated_by":null,"updated_at":"2014-06-30T14:24:45.030Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bk","is_metric":false,"name":"Block","id":4,"created_by":44,"created_at":"2014-06-17T15:01:54.954Z","updated_by":null,"updated_at":"2014-06-30T14:24:58.654Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bt","is_metric":false,"name":"Bottle","id":5,"created_by":44,"created_at":"2014-06-17T15:02:12.934Z","updated_by":44,"updated_at":"2014-07-15T06:44:11.711Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bx","is_metric":false,"name":"Box","id":6,"created_by":44,"created_at":"2014-06-17T15:02:38.022Z","updated_by":44,"updated_at":"2014-08-26T12:30:16.239Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bun","is_metric":false,"name":"Bunch","id":7,"created_by":44,"created_at":"2014-06-17T15:03:01.332Z","updated_by":44,"updated_at":"2014-07-15T06:44:36.347Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"can","is_metric":false,"name":"Can","id":8,"created_by":44,"created_at":"2014-06-17T15:03:31.864Z","updated_by":44,"updated_at":"2014-07-15T06:44:42.662Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cs","is_metric":false,"name":"Case","id":9,"created_by":44,"created_at":"2014-06-17T15:03:51.775Z","updated_by":44,"updated_at":"2014-07-15T06:44:52.527Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cnt","is_metric":false,"name":"Container","id":10,"created_by":44,"created_at":"2014-06-17T15:04:24.853Z","updated_by":44,"updated_at":"2014-07-15T06:45:06.460Z"},{"type":"volume","metric_base":"236.588000","english_base":"48.000000","abbr":"cup","is_metric":false,"name":"Cup","id":11,"created_by":44,"created_at":"2014-06-17T15:04:41.649Z","updated_by":44,"updated_at":"2014-10-29T09:30:33.672Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"doz","is_metric":false,"name":"Dozen","id":12,"created_by":44,"created_at":"2014-06-17T15:04:58.222Z","updated_by":44,"updated_at":"2014-07-15T06:45:34.457Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"ea","is_metric":false,"name":"Each","id":13,"created_by":44,"created_at":"2014-06-17T15:05:15.971Z","updated_by":44,"updated_at":"2014-07-15T06:56:29.997Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"fl","is_metric":false,"name":"Flat","id":14,"created_by":44,"created_at":"2014-06-17T15:05:34.037Z","updated_by":44,"updated_at":"2014-07-15T06:45:39.041Z"},{"type":"volume","metric_base":"29.573500","english_base":"6.000000","abbr":"floz","is_metric":false,"name":"Fluid Ounce","id":15,"created_by":44,"created_at":"2014-06-17T15:06:16.282Z","updated_by":44,"updated_at":"2014-10-29T09:33:41.004Z"},{"type":"volume","metric_base":"3785.410000","english_base":"768.000000","abbr":"gal","is_metric":false,"name":"Gallon","id":16,"created_by":44,"created_at":"2014-06-17T15:06:40.661Z","updated_by":44,"updated_at":"2014-10-29T09:33:04.925Z"},{"type":"weight","metric_base":"1.000000","english_base":"0.035274","abbr":"g","is_metric":true,"name":"Gram","id":17,"created_by":44,"created_at":"2014-06-17T15:07:10.619Z","updated_by":44,"updated_at":"2014-10-29T09:31:54.369Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"head","is_metric":false,"name":"Head","id":18,"created_by":44,"created_at":"2014-06-17T15:08:17.021Z","updated_by":44,"updated_at":"2014-07-15T06:46:32.905Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"jar","is_metric":false,"name":"Jar","id":19,"created_by":44,"created_at":"2014-06-17T15:08:30.161Z","updated_by":44,"updated_at":"2014-07-15T06:46:42.268Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"keg","is_metric":false,"name":"Keg","id":20,"created_by":44,"created_at":"2014-06-17T15:08:46.902Z","updated_by":44,"updated_at":"2014-07-15T06:47:14.297Z"},{"type":"weight","metric_base":"1000.000000","english_base":"35.274000","abbr":"kg","is_metric":true,"name":"Kilogram","id":21,"created_by":44,"created_at":"2014-06-17T15:09:10.677Z","updated_by":44,"updated_at":"2014-10-29T09:38:09.297Z"},{"type":"volume","metric_base":"1000.000000","english_base":"202.884000","abbr":"l","is_metric":true,"name":"Liter","id":22,"created_by":44,"created_at":"2014-06-17T15:09:27.622Z","updated_by":44,"updated_at":"2014-10-29T09:39:31.334Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"loaf","is_metric":false,"name":"Loaf","id":23,"created_by":44,"created_at":"2014-06-17T15:09:48.278Z","updated_by":44,"updated_at":"2014-07-15T06:48:02.764Z"},{"type":"volume","metric_base":"1.000000","english_base":"0.202884","abbr":"ml","is_metric":true,"name":"Mililiter","id":24,"created_by":44,"created_at":"2014-06-17T15:10:13.286Z","updated_by":44,"updated_at":"2014-10-29T09:36:33.872Z"},{"type":"weight","metric_base":"28.349500","english_base":"1.000000","abbr":"oz","is_metric":false,"name":"Ounce","id":25,"created_by":44,"created_at":"2014-06-17T15:10:32.094Z","updated_by":44,"updated_at":"2014-10-29T09:37:21.233Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"pk","is_metric":false,"name":"Pack","id":26,"created_by":44,"created_at":"2014-06-17T15:10:53.143Z","updated_by":44,"updated_at":"2014-09-17T10:54:29.514Z"},{"type":"volume","metric_base":"473.176000","english_base":"96.000000","abbr":"pt","is_metric":false,"name":"Pint","id":27,"created_by":44,"created_at":"2014-06-17T15:11:11.444Z","updated_by":44,"updated_at":"2014-10-29T09:36:04.400Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"por","is_metric":false,"name":"Portion","id":28,"created_by":44,"created_at":"2014-06-17T19:52:02.568Z","updated_by":44,"updated_at":"2014-10-29T09:04:20.432Z"},{"type":"weight","metric_base":"453.592000","english_base":"16.000000","abbr":"pound","is_metric":false,"name":"Pound","id":1,"created_by":44,"created_at":"2014-06-17T08:24:51.310Z","updated_by":44,"updated_at":"2015-11-30T22:02:29.961Z"},{"type":"volume","metric_base":"946.353000","english_base":"192.000000","abbr":"qt","is_metric":false,"name":"Quart","id":31,"created_by":44,"created_at":"2014-06-17T19:53:50.356Z","updated_by":44,"updated_at":"2014-10-29T09:34:22.399Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"srv","is_metric":false,"name":"Serving","id":33,"created_by":44,"created_at":"2014-06-17T19:54:48.070Z","updated_by":44,"updated_at":"2014-07-15T06:49:52.702Z"},{"type":"volume","metric_base":"14.786800","english_base":"3.000000","abbr":"tbsp","is_metric":false,"name":"Tablespoon","id":34,"created_by":44,"created_at":"2014-06-17T19:55:09.282Z","updated_by":44,"updated_at":"2014-10-29T09:38:47.443Z"},{"type":"volume","metric_base":"4.928920","english_base":"1.000000","abbr":"tsp","is_metric":false,"name":"Teaspoon","id":35,"created_by":44,"created_at":"2014-06-17T19:55:45.634Z","updated_by":44,"updated_at":"2014-10-29T09:39:00.454Z"}]},
      events_response             : {"notes":null,"type":"invoice","is_complete":false,"description":"Event for invoice winth vendor_id: 1","date":"2015-08-30","id":65,"created_by":44,"created_at":"2015-10-28T17:27:02.760Z","updated_by":44,"updated_at":"2015-11-03T12:44:44.665Z","location_id":7},
      invoices_response           : {"invoice_number":null,"is_complete":false,"receipt_date":"2015-08-30","invoice_date":"2015-08-30","total":"1820.00","id":59,"created_by":44,"created_at":"2015-10-28T17:27:02.564Z","updated_by":44,"updated_at":"2015-11-30T14:27:40.930Z","location_id":7,"vendor_id":1,"inv_event_id":65},
      invoice_items_response      : {"count":4,"results":[{"extended_price":"900.00000","unit_price":"30.00000","quantity":"30.000","id":173,"created_by":44,"created_at":"2015-11-03T12:44:33.736Z","updated_by":44,"updated_at":"2015-11-03T12:44:36.928Z","location_id":7,"vendor_id":1,"vendor_inventory_item_id":19,"inv_item_id":1056,"inv_event_item_id":154,"invoice_id":59},{"extended_price":"400.00000","unit_price":"20.00000","quantity":"20.000","id":172,"created_by":44,"created_at":"2015-11-03T12:44:31.253Z","updated_by":44,"updated_at":"2015-11-03T12:44:31.648Z","location_id":7,"vendor_id":1,"vendor_inventory_item_id":17,"inv_item_id":1056,"inv_event_item_id":153,"invoice_id":59},{"extended_price":"100.00000","unit_price":"10.00000","quantity":"10.000","id":171,"created_by":44,"created_at":"2015-11-03T12:44:29.103Z","updated_by":44,"updated_at":"2015-11-03T12:44:29.507Z","location_id":7,"vendor_id":1,"vendor_inventory_item_id":14,"inv_item_id":1056,"inv_event_item_id":152,"invoice_id":59},{"extended_price":"400.00000","unit_price":"20.00000","quantity":"20.000","id":130,"created_by":44,"created_at":"2015-10-28T17:27:25.344Z","updated_by":44,"updated_at":"2015-11-03T12:44:21.769Z","location_id":7,"vendor_id":1,"vendor_inventory_item_id":55,"inv_item_id":1511,"inv_event_item_id":111,"invoice_id":59}]},
      invoice_gl_accounts_response: {"count":1,"results":[{"amount":"20.00","description":"test","id":66,"created_by":44,"created_at":"2015-11-30T14:27:40.459Z","updated_by":44,"updated_at":"2015-11-30T14:27:48.175Z","location_id":7,"invoice_id":59,"gl_account_id":35,"vendor_id":1}]},
      items_response              : {"count":8,"results":[{"common_unit_cost":"0.59147","description":"","name":"00001 edit 8.9","report_unit_cost":"20.00000","total_recipes":1,"is_active":true,"refuse_pct":"0.10000","item_db_id":null,"id":1056,"created_by":44,"created_at":"2015-04-06T14:43:27.688Z","updated_by":44,"updated_at":"2015-12-14T20:12:04.778Z","sales_item_id":null,"count_group_id":80,"gl_account_id":16,"common_unit_id":15},{"common_unit_cost":"0.00000","description":"","name":"Tuna","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1511,"created_by":44,"created_at":"2015-10-21T16:09:16.478Z","updated_by":44,"updated_at":"2015-11-04T17:06:26.338Z","sales_item_id":null,"count_group_id":67,"gl_account_id":14,"common_unit_id":1},{"common_unit_cost":null,"description":"","name":"WhistlePig, Rye","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":836,"id":1494,"created_by":44,"created_at":"2015-10-15T16:19:30.607Z","updated_by":44,"updated_at":"2015-10-15T16:27:46.481Z","sales_item_id":null,"count_group_id":67,"gl_account_id":13,"common_unit_id":23},{"common_unit_cost":"1.03478","description":"","name":"Absolut Cherrykran","report_unit_cost":"34.99000","total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":25,"id":802,"created_by":44,"created_at":"2014-10-31T16:07:27.169Z","updated_by":44,"updated_at":"2015-11-18T17:11:00.635Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":15},{"common_unit_cost":"0.00000","description":"","name":"testing","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1730,"created_by":44,"created_at":"2015-12-17T17:41:53.718Z","updated_by":null,"updated_at":"2015-12-17T17:41:53.718Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":5},{"common_unit_cost":"2.99000","description":"","name":"CranBerry Juice","report_unit_cost":"2.99000","total_recipes":null,"is_active":true,"refuse_pct":"0.00000","item_db_id":null,"id":1615,"created_by":44,"created_at":"2015-11-12T16:31:54.489Z","updated_by":44,"updated_at":"2015-11-12T16:32:35.610Z","sales_item_id":null,"count_group_id":67,"gl_account_id":28,"common_unit_id":16},{"common_unit_cost":"0.00000","description":"","name":"wvconvtest","report_unit_cost":"0.00000","total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1660,"created_by":44,"created_at":"2015-11-17T16:02:17.035Z","updated_by":44,"updated_at":"2015-11-20T13:32:02.481Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":1},{"common_unit_cost":"0.00000","description":"","name":"wvconvtest2","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1667,"created_by":44,"created_at":"2015-11-17T16:44:44.273Z","updated_by":null,"updated_at":"2015-11-17T16:44:44.273Z","sales_item_id":null,"count_group_id":67,"gl_account_id":16,"common_unit_id":15}]},
      item_locations_response     : {"count":9,"results":[{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":"2015-08-30","is_hot_count":false,"id":3594,"created_by":44,"created_at":"2015-10-15T16:19:32.666Z","updated_by":44,"updated_at":"2015-10-28T17:29:26.557Z","location_id":7,"inv_item_id":1494},{"starting_cost":"5.00000","last_cost":"17.50000","opening_count_date":null,"is_hot_count":false,"id":1779,"created_by":44,"created_at":"2015-08-28T01:09:39.602Z","updated_by":44,"updated_at":"2015-11-19T16:44:36.970Z","location_id":7,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":6024,"created_by":44,"created_at":"2015-11-17T16:44:44.919Z","updated_by":null,"updated_at":"2015-11-17T16:44:44.919Z","location_id":7,"inv_item_id":1667},{"starting_cost":"21.00000","last_cost":"8.50000","opening_count_date":null,"is_hot_count":false,"id":1182,"created_by":44,"created_at":"2015-08-09T11:25:30.860Z","updated_by":44,"updated_at":"2015-10-02T15:10:42.962Z","location_id":7,"inv_item_id":722},{"starting_cost":"58.82353","last_cost":"58.82353","opening_count_date":"2015-08-30","is_hot_count":false,"id":3886,"created_by":44,"created_at":"2015-10-21T16:09:17.892Z","updated_by":44,"updated_at":"2015-11-03T12:44:22.703Z","location_id":7,"inv_item_id":1511},{"starting_cost":"5.00000","last_cost":"5.00000","opening_count_date":null,"is_hot_count":false,"id":5396,"created_by":44,"created_at":"2015-11-12T16:31:55.082Z","updated_by":44,"updated_at":"2015-11-19T17:31:40.123Z","location_id":7,"inv_item_id":1615},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":6763,"created_by":44,"created_at":"2015-12-17T17:41:54.307Z","updated_by":null,"updated_at":"2015-12-17T17:41:54.307Z","location_id":7,"inv_item_id":1730},{"starting_cost":"0.09375","last_cost":"10.00000","opening_count_date":"2015-08-30","is_hot_count":false,"id":2792,"created_by":44,"created_at":"2015-10-09T12:50:33.754Z","updated_by":44,"updated_at":"2015-11-20T11:45:18.160Z","location_id":7,"inv_item_id":1056},{"starting_cost":"20.00000","last_cost":"20.00000","opening_count_date":null,"is_hot_count":false,"id":5937,"created_by":44,"created_at":"2015-11-17T16:02:17.680Z","updated_by":44,"updated_at":"2015-11-20T13:17:19.794Z","location_id":7,"inv_item_id":1660}]},
      item_units_response         : {"count":44,"results":[{"is_active":null,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"33.81400","description":"Bottle 1 Ltr","is_report_unit":true,"id":2227,"created_by":44,"created_at":"2014-10-31T16:07:27.397Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.397Z","unit_id":5,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.03704","description":"Gram 0.03704 floz","is_report_unit":false,"id":2228,"created_by":44,"created_at":"2014-10-31T16:07:27.556Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.556Z","unit_id":17,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"1 floz","is_report_unit":false,"id":2229,"created_by":44,"created_at":"2014-10-31T16:07:27.711Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.711Z","unit_id":15,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":false,"pack_size":"","unit_quantity":"2.00000","description":"Bottle 2.00000 floz","is_report_unit":false,"id":3160,"created_by":44,"created_at":"2015-04-16T19:27:21.575Z","updated_by":null,"updated_at":"2015-04-16T19:27:21.575Z","unit_id":5,"common_unit_id":15,"inv_item_id":802},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"2.00000","description":"Batch 2 floz","is_report_unit":false,"id":4762,"created_by":44,"created_at":"2015-12-04T16:49:51.786Z","updated_by":44,"updated_at":"2015-12-04T17:12:19.107Z","unit_id":3,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"33.81400","description":"Liter 33.81400 floz","is_report_unit":true,"id":4679,"created_by":44,"created_at":"2015-11-17T19:20:23.290Z","updated_by":null,"updated_at":"2015-11-17T19:20:23.290Z","unit_id":22,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"128.00000","description":"Fluid Ounce 128 floz","is_report_unit":false,"id":3980,"created_by":44,"created_at":"2015-08-08T02:19:03.345Z","updated_by":44,"updated_at":"2015-10-15T15:36:00.215Z","unit_id":16,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"111.00000","description":"Batch 111 floz","is_report_unit":false,"id":4238,"created_by":44,"created_at":"2015-10-14T14:18:37.587Z","updated_by":44,"updated_at":"2015-11-20T17:46:28.803Z","unit_id":3,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"11.00000","description":"Batch 11 floz","is_report_unit":false,"id":4237,"created_by":44,"created_at":"2015-10-14T14:18:07.028Z","updated_by":null,"updated_at":"2015-10-14T14:18:07.028Z","unit_id":3,"common_unit_id":15,"inv_item_id":1056},{"is_active":null,"is_wv_conversion":false,"pack_size":"","unit_quantity":"1.00000","description":"Fluid Ounce 1 floz","is_report_unit":false,"id":3084,"created_by":44,"created_at":"2015-04-06T14:43:27.963Z","updated_by":44,"updated_at":"2015-08-08T02:19:04.159Z","unit_id":15,"common_unit_id":15,"inv_item_id":1056},{"is_active":null,"is_wv_conversion":false,"pack_size":"","unit_quantity":"0.50000","description":"Each 0.50000 floz","is_report_unit":false,"id":3085,"created_by":44,"created_at":"2015-04-06T14:43:40.167Z","updated_by":44,"updated_at":"2015-04-06T14:57:46.661Z","unit_id":13,"common_unit_id":15,"inv_item_id":1056},{"is_active":null,"is_wv_conversion":false,"pack_size":"","unit_quantity":"0.05000","description":"Each 0.05000 floz","is_report_unit":false,"id":3086,"created_by":44,"created_at":"2015-04-06T14:57:46.102Z","updated_by":44,"updated_at":"2015-11-17T19:21:38.133Z","unit_id":13,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"2.00000","description":"Container 2 floz","is_report_unit":false,"id":3847,"created_by":44,"created_at":"2015-07-29T14:12:36.934Z","updated_by":44,"updated_at":"2015-09-22T13:32:52.483Z","unit_id":10,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":true,"pack_size":"","unit_quantity":"5.00000","description":"Kilogram 5 floz","is_report_unit":false,"id":3886,"created_by":44,"created_at":"2015-08-05T18:25:31.533Z","updated_by":44,"updated_at":"2015-11-17T19:20:23.765Z","unit_id":21,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Jar 1 floz","is_report_unit":false,"id":3906,"created_by":44,"created_at":"2015-08-06T15:49:46.009Z","updated_by":null,"updated_at":"2015-08-06T15:49:46.009Z","unit_id":19,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Batch 1 floz edit not ve","is_report_unit":false,"id":3911,"created_by":44,"created_at":"2015-08-07T02:03:33.140Z","updated_by":44,"updated_at":"2015-08-07T03:19:21.565Z","unit_id":3,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Block 1 floz","is_report_unit":false,"id":3912,"created_by":44,"created_at":"2015-08-07T02:04:03.851Z","updated_by":44,"updated_at":"2015-09-10T10:47:46.227Z","unit_id":4,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"2.00000","description":"Can 2 floz","is_report_unit":false,"id":3979,"created_by":44,"created_at":"2015-08-08T01:23:04.557Z","updated_by":44,"updated_at":"2015-11-02T16:39:03.108Z","unit_id":8,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"5.00000","description":"Pack 5 floz","is_report_unit":false,"id":4110,"created_by":44,"created_at":"2015-09-22T13:33:42.622Z","updated_by":null,"updated_at":"2015-09-22T13:33:42.622Z","unit_id":26,"common_unit_id":15,"inv_item_id":1056},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Bag 1 loaf","is_report_unit":false,"id":4252,"created_by":44,"created_at":"2015-10-15T17:04:24.223Z","updated_by":null,"updated_at":"2015-10-15T17:04:24.223Z","unit_id":2,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"8.00000","description":"Bag 8 loaf","is_report_unit":false,"id":4251,"created_by":44,"created_at":"2015-10-15T17:03:31.002Z","updated_by":null,"updated_at":"2015-10-15T17:03:31.002Z","unit_id":2,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"12.00000","description":"Bag 12 loaf","is_report_unit":false,"id":4250,"created_by":44,"created_at":"2015-10-15T17:01:23.374Z","updated_by":null,"updated_at":"2015-10-15T17:01:23.374Z","unit_id":2,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"4.00000","description":"Bag 4 loaf","is_report_unit":false,"id":4249,"created_by":44,"created_at":"2015-10-15T17:00:49.140Z","updated_by":null,"updated_at":"2015-10-15T17:00:49.140Z","unit_id":2,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.47063","description":"Bottle 1.47063 loaf","is_report_unit":true,"id":4246,"created_by":44,"created_at":"2015-10-15T16:19:31.096Z","updated_by":44,"updated_at":"2015-10-15T16:27:46.924Z","unit_id":5,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.04348","description":"Fluid Ounce 0.04348 loaf","is_report_unit":false,"id":4245,"created_by":44,"created_at":"2015-10-15T16:19:30.826Z","updated_by":44,"updated_at":"2015-10-15T16:27:46.924Z","unit_id":15,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"5.56700","description":"Gallon 5.567 loaf","is_report_unit":false,"id":4247,"created_by":44,"created_at":"2015-10-15T16:24:26.070Z","updated_by":44,"updated_at":"2015-10-15T16:27:46.923Z","unit_id":16,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Loaf 1 loaf","is_report_unit":false,"id":4248,"created_by":44,"created_at":"2015-10-15T16:27:44.674Z","updated_by":44,"updated_at":"2015-10-15T16:27:46.920Z","unit_id":23,"common_unit_id":23,"inv_item_id":1494},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.34000","description":"Can 0.34 pound","is_report_unit":false,"id":4279,"created_by":44,"created_at":"2015-10-21T16:09:19.799Z","updated_by":null,"updated_at":"2015-10-21T16:09:19.799Z","unit_id":8,"common_unit_id":1,"inv_item_id":1511},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":null,"is_report_unit":true,"id":4278,"created_by":44,"created_at":"2015-10-21T16:09:16.698Z","updated_by":null,"updated_at":"2015-10-21T16:09:16.698Z","unit_id":1,"common_unit_id":1,"inv_item_id":1511},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"5.00000","description":"Can 5 gal","is_report_unit":false,"id":4694,"created_by":44,"created_at":"2015-11-19T17:26:40.269Z","updated_by":null,"updated_at":"2015-11-19T17:26:40.269Z","unit_id":8,"common_unit_id":16,"inv_item_id":1615},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"1.00000","description":"Can 1 gal","is_report_unit":false,"id":4540,"created_by":44,"created_at":"2015-11-12T16:32:33.892Z","updated_by":null,"updated_at":"2015-11-12T16:32:33.892Z","unit_id":8,"common_unit_id":16,"inv_item_id":1615},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":null,"is_report_unit":true,"id":4539,"created_by":44,"created_at":"2015-11-12T16:31:54.656Z","updated_by":null,"updated_at":"2015-11-12T16:31:54.656Z","unit_id":16,"common_unit_id":16,"inv_item_id":1615},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"12.00000","description":"Each 12 pound","is_report_unit":true,"id":4695,"created_by":44,"created_at":"2015-11-20T13:31:58.839Z","updated_by":44,"updated_at":"2015-11-20T13:37:39.951Z","unit_id":13,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.11193","description":"Liter 0.11193 pound","is_report_unit":false,"id":4657,"created_by":44,"created_at":"2015-11-17T16:19:47.920Z","updated_by":null,"updated_at":"2015-11-17T16:19:47.920Z","unit_id":22,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.42371","description":"Gallon 0.42371 pound","is_report_unit":false,"id":4654,"created_by":44,"created_at":"2015-11-17T16:03:18.877Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.340Z","unit_id":16,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"2.20463","description":"Kilogram 2.20463 pound","is_report_unit":false,"id":4655,"created_by":44,"created_at":"2015-11-17T16:03:55.534Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.340Z","unit_id":21,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"0.00331","description":"Fluid Ounce 0.00331 pound","is_report_unit":false,"id":4652,"created_by":44,"created_at":"2015-11-17T16:02:17.220Z","updated_by":44,"updated_at":"2015-11-20T13:32:00.404Z","unit_id":15,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.03310","description":"Bag 0.0331 pound","is_report_unit":false,"id":4653,"created_by":44,"created_at":"2015-11-17T16:03:04.582Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.330Z","unit_id":2,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Pound 1 pound","is_report_unit":false,"id":4656,"created_by":44,"created_at":"2015-11-17T16:04:19.697Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.330Z","unit_id":1,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Can 1 floz","is_report_unit":false,"id":4684,"created_by":44,"created_at":"2015-11-18T11:22:57.389Z","updated_by":null,"updated_at":"2015-11-18T11:22:57.389Z","unit_id":8,"common_unit_id":15,"inv_item_id":1667},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.45359","description":"Pound 0.45359 floz","is_report_unit":false,"id":4678,"created_by":44,"created_at":"2015-11-17T16:45:27.274Z","updated_by":null,"updated_at":"2015-11-17T16:45:27.274Z","unit_id":1,"common_unit_id":15,"inv_item_id":1667},{"is_active":true,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"1.00000","description":"Kilogram 1 floz","is_report_unit":false,"id":4677,"created_by":44,"created_at":"2015-11-17T16:45:17.941Z","updated_by":null,"updated_at":"2015-11-17T16:45:17.941Z","unit_id":21,"common_unit_id":15,"inv_item_id":1667},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":null,"is_report_unit":true,"id":4676,"created_by":44,"created_at":"2015-11-17T16:44:44.456Z","updated_by":null,"updated_at":"2015-11-17T16:44:44.456Z","unit_id":15,"common_unit_id":15,"inv_item_id":1667},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":null,"is_report_unit":true,"id":4819,"created_by":44,"created_at":"2015-12-17T17:41:53.925Z","updated_by":null,"updated_at":"2015-12-17T17:41:53.925Z","unit_id":5,"common_unit_id":5,"inv_item_id":1730}]},
      vendors_response            : {"count":8,"results":[{"name":"ABC Beers","contact_last_name":"Jones","country":null,"address":"3434 W Reno","phone":"(555) 867-5309","address2":"Apt 5","city":"Oklahoma City","contact_email":"sjones@gmail.com","contact_name":null,"notes":"This is the notes","contact_first_name":"Skippy","zip":"73034","country_id":227,"state":"Oklahoma","is_active":true,"fax":"What is a Fax?","state_id":3491,"id":17,"created_by":44,"created_at":"2015-10-13T20:29:38.593Z","updated_by":44,"updated_at":"2015-12-04T14:03:19.334Z"},{"name":"ABC Foods","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":18,"created_by":44,"created_at":"2015-10-14T00:06:17.806Z","updated_by":null,"updated_at":"2015-10-14T00:06:17.806Z"},{"name":"CostLow","contact_last_name":null,"country":null,"address":"CostLow","phone":null,"address2":null,"city":"Miami","contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":"39405","country_id":227,"state":"Florida","is_active":true,"fax":null,"state_id":3464,"id":21,"created_by":44,"created_at":"2015-11-18T19:13:17.319Z","updated_by":44,"updated_at":"2015-11-18T19:13:43.593Z"},{"name":"Ice Cream Man","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":14,"created_by":44,"created_at":"2015-09-24T17:11:39.095Z","updated_by":44,"updated_at":"2015-10-02T14:16:22.179Z"},{"name":"Some test vendor1","contact_last_name":"Piper","country":"United States","address":"2600 NW 29th St","phone":"4056408232","address2":"apt 77","city":"Oklahoma City","contact_email":"pp@gmail.com","contact_name":null,"notes":"Pie flavor","contact_first_name":"Peter","zip":"73107","country_id":223,"state":"Bugiri District","is_active":true,"fax":"Who has a fax?","state_id":3394,"id":1,"created_by":44,"created_at":"2015-09-08T12:54:53.735Z","updated_by":44,"updated_at":"2015-12-18T17:35:48.748Z"},{"name":"The Muffin Man","contact_last_name":null,"country":null,"address":"1 Drury Ln","phone":null,"address2":null,"city":"Orlando","contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":"76799","country_id":227,"state":"Florida","is_active":true,"fax":null,"state_id":3464,"id":12,"created_by":44,"created_at":"2015-09-24T13:54:06.405Z","updated_by":null,"updated_at":"2015-09-24T13:54:06.405Z"},{"name":"The Pie Guy","contact_last_name":null,"country":null,"address":"999 Sunny Lanne","phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":6,"created_by":44,"created_at":"2015-09-21T22:41:28.424Z","updated_by":44,"updated_at":"2015-09-24T13:45:52.572Z"},{"name":"US Foods","contact_last_name":"Smith","country":null,"address":"123 Main Street","phone":"212-555-1212","address2":"Suite 200","city":"Ann Arbor","contact_email":"ssmith@peachworks.com","contact_name":null,"notes":"We buy food from this vendor.","contact_first_name":"Sam","zip":"222222","country_id":227,"state":"Michigan","is_active":true,"fax":"222-555-1212","state_id":3477,"id":11,"created_by":44,"created_at":"2015-09-23T01:51:06.437Z","updated_by":44,"updated_at":"2015-10-15T12:57:10.424Z"}]},
      vendor_items_response       : {"count":13,"results":[{"last_price":"10.00000","number":"AE 1223","pack_size":"16 Blocks","description":"16 Block pack","is_active":false,"last_price_on":"2015-11-16","id":14,"created_by":44,"created_at":"2015-09-10T10:48:02.706Z","updated_by":44,"updated_at":"2015-11-17T10:10:16.043Z","vendor_id":1,"inv_item_id":1056,"inv_item_unit_id":3912},{"last_price":null,"number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":75,"created_by":44,"created_at":"2015-11-17T16:53:10.986Z","updated_by":44,"updated_at":"2015-11-17T16:53:28.658Z","vendor_id":1,"inv_item_id":1667,"inv_item_unit_id":4677},{"last_price":null,"number":"5","pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":76,"created_by":44,"created_at":"2015-11-18T13:25:26.224Z","updated_by":null,"updated_at":"2015-11-18T13:25:26.224Z","vendor_id":1,"inv_item_id":1667,"inv_item_unit_id":4677},{"last_price":"35.00000","number":"3334","pack_size":null,"description":"aaa","is_active":true,"last_price_on":"2015-11-16","id":74,"created_by":44,"created_at":"2015-11-13T15:14:01.362Z","updated_by":44,"updated_at":"2015-11-19T16:44:33.541Z","vendor_id":1,"inv_item_id":802,"inv_item_unit_id":3160},{"last_price":"25.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":83,"created_by":44,"created_at":"2015-11-19T17:27:00.225Z","updated_by":null,"updated_at":"2015-11-19T17:27:00.225Z","vendor_id":1,"inv_item_id":1615,"inv_item_unit_id":4694},{"last_price":"20.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":84,"created_by":44,"created_at":"2015-11-20T12:42:21.757Z","updated_by":null,"updated_at":"2015-11-20T12:42:21.757Z","vendor_id":1,"inv_item_id":1660,"inv_item_unit_id":4656},{"last_price":"0.29998","number":"EE 11100","pack_size":"24 Bottles","description":"24 Bottle pack","is_active":false,"last_price_on":"2015-10-08","id":18,"created_by":44,"created_at":"2015-09-10T16:48:26.284Z","updated_by":44,"updated_at":"2015-11-03T12:41:24.036Z","vendor_id":1,"inv_item_id":877,"inv_item_unit_id":3958},{"last_price":"21.00000","number":null,"pack_size":null,"description":null,"is_active":false,"last_price_on":"2015-10-02","id":40,"created_by":44,"created_at":"2015-10-02T12:10:02.989Z","updated_by":null,"updated_at":"2015-10-02T12:10:02.989Z","vendor_id":1,"inv_item_id":722,"inv_item_unit_id":2094},{"last_price":"40.00000","number":"000999","pack_size":null,"description":null,"is_active":false,"last_price_on":"2015-10-28","id":47,"created_by":44,"created_at":"2015-10-15T17:04:28.439Z","updated_by":44,"updated_at":"2015-10-29T16:20:05.843Z","vendor_id":1,"inv_item_id":1494,"inv_item_unit_id":4252},{"last_price":"2.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":"2015-10-28","id":55,"created_by":44,"created_at":"2015-10-21T16:09:20.496Z","updated_by":44,"updated_at":"2015-10-29T16:20:54.800Z","vendor_id":1,"inv_item_id":1511,"inv_item_unit_id":4279},{"last_price":"30.00000","number":"RA 4454","pack_size":null,"description":"some desc ed","is_active":false,"last_price_on":"2015-08-30","id":19,"created_by":44,"created_at":"2015-09-22T13:29:23.460Z","updated_by":44,"updated_at":"2015-11-13T15:19:13.128Z","vendor_id":1,"inv_item_id":1056,"inv_item_unit_id":3847},{"last_price":"20.00000","number":"AE 1227","pack_size":"10 Blocks","description":"10 Block pack edt","is_active":false,"last_price_on":"2015-11-16","id":17,"created_by":44,"created_at":"2015-09-10T16:47:41.555Z","updated_by":44,"updated_at":"2015-11-19T16:44:30.015Z","vendor_id":1,"inv_item_id":1056,"inv_item_unit_id":3979},{"last_price":"5.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":"2015-12-17","id":116,"created_by":44,"created_at":"2015-12-17T17:41:55.788Z","updated_by":null,"updated_at":"2015-12-17T17:41:55.788Z","vendor_id":1,"inv_item_id":1730,"inv_item_unit_id":4819}]},
      vendor_locations_response   : {"count":4,"results":[{"customer_number":"","id":213,"created_by":44,"created_at":"2015-10-13T20:29:38.710Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.150Z","location_id":7,"vendor_id":17},{"customer_number":"","id":221,"created_by":44,"created_at":"2015-10-14T00:06:17.952Z","updated_by":null,"updated_at":"2015-10-14T00:06:17.952Z","location_id":7,"vendor_id":18},{"customer_number":"","id":245,"created_by":44,"created_at":"2015-11-18T19:13:17.484Z","updated_by":44,"updated_at":"2015-11-18T19:13:43.677Z","location_id":7,"vendor_id":21},{"customer_number":"","id":192,"created_by":44,"created_at":"2015-09-28T11:11:17.883Z","updated_by":44,"updated_at":"2015-12-18T17:35:49.116Z","location_id":7,"vendor_id":1}]},
      permissions                 : {
        'edit_invoices' : true
      },
      active_locations            : [
        {
          address1: null,
          address2: null,
          city: null,
          country_id: 227,
          created_at: "2013-11-11T15:33:33.187Z",
          created_by: 44,
          id: 7,
          is_deleted: false,
          name: "Andrei204 NYC",
          number: null,
          org_group_id: null,
          phone: null,
          state_id: 3487,
          tags: null,
          timezone: "America/New_York",
          updated_at: "2015-05-15T19:04:11.105Z",
          updated_by: 138,
          wtm_inv_loc: {
            copied_from: null,
            created_at: "2015-10-08T14:43:58.042Z",
            created_by: 44,
            id: 10,
            is_copied: true,
            location_id: 7,
            updated_at: "2015-10-08T14:43:58.042Z",
            updated_by: null
          }
        }
      ],
      current_utc_timestamp         : moment().utc().add(5, "minutes").toISOString()
    };

    // helper local variables
    var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub, userDeferred, accountUserStub;
    // controller injectables
    var $filter, $location, $mdDialog, $peach, $q, $timeout, cakeCommon, cakeEvents, cakeGLAccounts, cakeInvoices, cakeInvoiceGLAccounts, cakeInvoiceItems, cakeItems, cakeItemLocations, cakeItemUnits, cakePermissions, cakeSettings, cakeUnits, cakeVendors, cakeVendorItems, cakeVendorLocations;


    // initialize app module
    beforeEach(module('cakeApp'));

      
    // mock and inject additional modules
    beforeEach(inject(function($injector) {

      $controller = $injector.get('$controller');
      $log = $injector.get('$log');
      $rootScope = $injector.get('$rootScope');

      $filter = $injector.get('$filter');
      $location = $injector.get('$location');
      $mdDialog = $injector.get('$mdDialog');
      $peach = $injector.get('$peach');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');

      cakeCommon = {
        parseCakeCostFloatValue: function(value, defaultValue, fractionSize) {
          defaultValue = _.isUndefined(defaultValue) ? '0.00' : defaultValue;
          fractionSize = _.isUndefined(fractionSize) ? null : fractionSize;
          if (!_.isUndefined(value) && !_.isNull(value)) {
            return fractionSize !== null ? Big(value).round(fractionSize).toFixed(fractionSize) : Big(value).toFixed(5).replace(/0{0,3}$/, "");
          } else {
            return defaultValue;
          }
        },
        parseCakeFloatValue: function(value, defaultValue) {
          defaultValue = _.isUndefined(defaultValue) ? 0 : defaultValue;
          if (!_.isUndefined(value) && !_.isNull(value)) {
            return parseFloat(Big(value).toFixed(5));
          }
          return defaultValue;
        },
        getCakeFloatRegex: function() {
          return editInvoiceControllerTestsMockedData.float_regex;
        },
        isUserAccountAdmin: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.is_user_account_admin);
          return deferred.promise;
        },
        isDevPreviewModeRunning: function() {
          return editInvoiceControllerTestsMockedData.is_dev_preview_mode_running;
        },
        apiErrorHandler: function(error, showAlert) {
          return $log.error([error, showAlert]);
        }
      };

      cakeEvents = {
        loadEvents: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.events_response);
          return deferred.promise;
        }
      };

      cakeGLAccounts = {
        loadGLAccounts: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.gl_accounts_response);
          return deferred.promise;
        },
        getGLAccounts: function() {
          return editInvoiceControllerTestsMockedData.gl_accounts_response.results;
        },
        getGLAccountsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.gl_accounts_response.results, 'id'), editInvoiceControllerTestsMockedData.gl_accounts_response.results);
        }
      };

      cakeInvoices = {
        loadInvoices: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.invoices_response);
          return deferred.promise;
        },
        createInvoice: function(newInvoiceData) {
          var deferred = $q.defer();
          deferred.resolve(newInvoiceData);
          return deferred.promise;
        },
        updateInvoice: function(invoiceData) {
          var deferred = $q.defer();
          deferred.resolve(invoiceData);
          return deferred.promise;
        },
        removeInvoice: function(invoiceId) {
          var deferred = $q.defer();
          deferred.resolve(true);
          return deferred.promise;
        }
      };

      cakeInvoiceGLAccounts = {
        loadInvoiceGLAccounts: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response);
          return deferred.promise;
        },
        getInvoiceGLAccounts: function() {
          return editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.results;
        },
        getInvoiceGLAccountsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.results, 'id'), editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.results);
        },
        createInvoiceGLAccount: function(newData) {
          var deferred = $q.defer();
          deferred.resolve(newData);
          return deferred.promise;
        },
        updateInvoiceGLAccount: function(data) {
          var deferred = $q.defer();
          deferred.resolve(data);
          return deferred.promise;
        },
        removeInvoiceGLAccount: function(id) {
          var deferred = $q.defer();
          deferred.resolve(true);
          return deferred.promise;
        }
      };

      cakeInvoiceItems = {
        loadInvoiceItems: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.invoice_items_response);
          return deferred.promise;
        },
        getInvoiceItems: function() {
          return editInvoiceControllerTestsMockedData.invoice_items_response.results;
        },
        getInvoiceItemsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.invoice_items_response.results, 'id'), editInvoiceControllerTestsMockedData.invoice_items_response.results);
        },
        createInvoiceItem: function(newData) {
          var deferred = $q.defer();
          deferred.resolve(newData);
          return deferred.promise;
        },
        updateInvoiceItem: function(data) {
          var deferred = $q.defer();
          deferred.resolve(data);
          return deferred.promise;
        },
        removeInvoiceItem: function(id) {
          var deferred = $q.defer();
          deferred.resolve(true);
          return deferred.promise;
        }
      };

      cakeItems = {
        loadItems: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.items_response);
          return deferred.promise;
        },
        getItems: function() {
          return editInvoiceControllerTestsMockedData.items_response.results;
        },
        getItemsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.items_response.results, 'id'), editInvoiceControllerTestsMockedData.items_response.results);
        }
      };

      cakeItemLocations = {
        loadItemLocations: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.item_locations_response);
          return deferred.promise;
        }
      };

      cakeItemUnits = {
        loadItemUnits: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.item_units_response);
          return deferred.promise;
        },
        getItemUnits: function() {
          return editInvoiceControllerTestsMockedData.item_units_response.results;
        },
        getItemUnitsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.item_units_response.results, 'id'), editInvoiceControllerTestsMockedData.item_units_response.results);
        }
      };

      cakePermissions = {
        userHasPermission: function(permissionKey) {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.permissions[permissionKey]);
          return deferred.promise;
        }
      };

      cakeSettings = {
        getSettings: function(settingKey) {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData[settingKey]);
          return deferred.promise;
        },
        refreshSettings: function(settingKey) {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData[settingKey]);
          return deferred.promise;
        }
      };

      cakeUnits = {
        loadUnits: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.units_response);
          return deferred.promise;
        },
        getUnits: function() {
          return editInvoiceControllerTestsMockedData.units_response.results;
        },
        getUnitsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.units_response.results, 'id'), editInvoiceControllerTestsMockedData.units_response.results);
        }
      };

      cakeVendors = {
        loadVendors: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.vendors_response);
          return deferred.promise;
        },
        getVendors: function() {
          return editInvoiceControllerTestsMockedData.vendors_response.results;
        },
        getVendorsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.vendors_response.results, 'id'), editInvoiceControllerTestsMockedData.vendors_response.results);
        }
      };

      cakeVendorItems = {
        loadVendorItems: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.vendor_items_response);
          return deferred.promise;
        },
        getVendorItems: function() {
          return editInvoiceControllerTestsMockedData.vendor_items_response.results;
        },
        getVendorItemsCollection: function() {
          return _.object(_.pluck(editInvoiceControllerTestsMockedData.vendor_items_response.results, 'id'), editInvoiceControllerTestsMockedData.vendor_items_response.results);
        }
      };

      cakeVendorLocations = {
        loadVendorLocations: function() {
          var deferred = $q.defer();
          deferred.resolve(editInvoiceControllerTestsMockedData.vendor_locations_response);
          return deferred.promise;
        },
        getVendorLocations: function() {
          return editInvoiceControllerTestsMockedData.vendor_locations_response.results;
        }
      };

      controllerScope = $rootScope.$new();
      $controller(
        'edit_invoice.js as vm',
        {
          '$filter': $filter,
          '$location': $location,
          '$mdDialog': $mdDialog,
          '$peach': $peach,
          '$q': $q,
          '$scope': controllerScope,
          '$timeout': $timeout,
          'cakeCommon': cakeCommon,
          'cakeEvents': cakeEvents,
          'cakeGLAccounts': cakeGLAccounts,
          'cakeInvoices': cakeInvoices,
          'cakeInvoiceGLAccounts': cakeInvoiceGLAccounts,
          'cakeInvoiceItems': cakeInvoiceItems,
          'cakeItems': cakeItems,
          'cakeItemLocations': cakeItemLocations,
          'cakeItemUnits': cakeItemUnits,
          'cakePermissions': cakePermissions,
          'cakeSettings': cakeSettings,
          'cakeUnits': cakeUnits,
          'cakeVendors': cakeVendors,
          'cakeVendorItems': cakeVendorItems,
          'cakeVendorLocations': cakeVendorLocations
        }
      );

      logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
      errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});
      userDeferred = $q.defer();
      userDeferred.resolve(editInvoiceControllerTestsMockedData.user);
      accountUserStub = sandbox.stub($peach.account, 'getUsers').returns(userDeferred.promise);

    }));

    afterEach(function() {

      sandbox.restore();

    });

    describe('Constructor', function() {

      it('should construct Edit Invoice Controller', function() {

        expect(controllerScope.vm.$filter).to.exist;
        expect(controllerScope.vm.$location).to.exist;
        expect(controllerScope.vm.$mdDialog).to.exist;
        expect(controllerScope.vm.$peach).to.exist;
        expect(controllerScope.vm.$q).to.exist;
        expect(controllerScope.vm.$timeout).to.exist;
        expect(controllerScope.vm.cakeCommon).to.exist;
        expect(controllerScope.vm.cakeEvents).to.exist;
        expect(controllerScope.vm.cakeGLAccounts).to.exist;
        expect(controllerScope.vm.cakeInvoices).to.exist;
        expect(controllerScope.vm.cakeInvoiceGLAccounts).to.exist;
        expect(controllerScope.vm.cakeInvoiceItems).to.exist;
        expect(controllerScope.vm.cakeItems).to.exist;
        expect(controllerScope.vm.cakeItemLocations).to.exist;
        expect(controllerScope.vm.cakeItemUnits).to.exist;
        expect(controllerScope.vm.cakePermissions).to.exist;
        expect(controllerScope.vm.cakeSettings).to.exist;
        expect(controllerScope.vm.cakeUnits).to.exist;
        expect(controllerScope.vm.cakeVendors).to.exist;
        expect(controllerScope.vm.cakeVendorItems).to.exist;
        expect(controllerScope.vm.cakeVendorLocations).to.exist;

        expect(controllerScope.vm.blockers).to.deep.equal({'api_processing': false, 'initializing': true});

        expect(controllerScope.vm.editedInvoice).to.deep.equal({
          data                        : {},
          form_data                   : {},
          items_data                  : {},
          misc_data                   : {
            opened_by_default           : true,
            total_price_value           : 0,
            total_price_value_formatted : '0.00',
            items_data                  : [],
            items_data_by_id            : {}
          },
          was_complete                : false,
          update_timestamp            : '',
          total_price_value           : 0,
          total_price_value_formatted : '0.00'
        });

        expect(controllerScope.vm.activeLocations).to.deep.equal([]);
        expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
        expect(controllerScope.vm.availableVendors).to.deep.equal([]);
        expect(controllerScope.vm.cakeFloatPattern).to.equal(editInvoiceControllerTestsMockedData.float_regex);
        expect(controllerScope.vm.canEditInvoice).to.equal(false);
        expect(controllerScope.vm.editingPreviouslyCreatedInvoice).to.equal(false);
        expect(controllerScope.vm.forms).to.deep.equal({});
        expect(controllerScope.vm.glAccounts).to.deep.equal([]);
        expect(controllerScope.vm.glAccountsById).to.deep.equal({});
        expect(controllerScope.vm.isAccountAdmin).to.equal(false);
        expect(controllerScope.vm.isDeveloperMode).to.equal(false);
        expect(controllerScope.vm.items).to.deep.equal([]);
        expect(controllerScope.vm.itemsById).to.deep.equal({});
        expect(controllerScope.vm.itemUnitsbyId).to.deep.equal({});
        expect(controllerScope.vm.invoiceGLAccounts).to.deep.equal([]);
        expect(controllerScope.vm.invoiceGLAccountsById).to.deep.equal({});
        expect(controllerScope.vm.invoiceItems).to.deep.equal([]);
        expect(controllerScope.vm.invoiceItemsById).to.deep.equal({});
        expect(controllerScope.vm.locationTime).to.deep.equal({utc_time_diff: 0, timezone: 'America/New_York'});
        expect(controllerScope.vm.units).to.deep.equal([]);
        expect(controllerScope.vm.unitsById).to.deep.equal({});
        expect(controllerScope.vm.unitsByAbbr).to.deep.equal({});
        expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});
        expect(controllerScope.vm.vendors).to.deep.equal([]);
        expect(controllerScope.vm.vendorsById).to.deep.equal({});
        expect(controllerScope.vm.vendorItems).to.deep.equal([]);
        expect(controllerScope.vm.vendorItemsById).to.deep.equal({});

      });

    });

    describe('Activate function', function() {

      it('should always set up common controller properties', function() {

        var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
        var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
        var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
        var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
        var spyCakeSettingsRefresh = sandbox.spy(controllerScope.vm.cakeSettings, 'refreshSettings');

        controllerScope.vm.activate();

        expect(spyCakeCommonDevMode.called).to.equal(true);
        expect(spyCakeCommonUserAdmin.called).to.equal(true);
        expect(spyCakePermissions.calledWithExactly('edit_invoices')).to.equal(true);
        expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
        expect(spyCakeSettingsRefresh.calledWithExactly('current_utc_timestamp')).to.equal(true);
        expect(controllerScope.vm.blockers.initializing).to.equal(true);

        $rootScope.$digest();
        
        expect(controllerScope.vm.activeLocations).to.equal(editInvoiceControllerTestsMockedData.active_locations);
        expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(editInvoiceControllerTestsMockedData.active_locations.length);
        expect(controllerScope.vm.isAccountAdmin).to.equal(editInvoiceControllerTestsMockedData.is_user_account_admin);
        expect(controllerScope.vm.isDeveloperMode).to.equal(editInvoiceControllerTestsMockedData.is_dev_preview_mode_running);
        expect(controllerScope.vm.locationTime.utc_time_diff).to.to.be.above(0);
      
      });

      describe('activate should set up extended controller properties scenarios', function() {

        describe('activate should finish without loading invoice scenarios', function() {

          it('no location selected scenario', function() {

            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var spyPeachSession = sandbox.spy(controllerScope.vm.$peach.session, 'getActiveLocation');

            $rootScope.$digest();

            expect(spyPeachEvent.called).to.equal(true);
            expect(spyPeachSession.called).to.equal(true);

            expect(controllerScope.vm.canEditInvoice).to.equal(false);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });

          it('not cake active location selected scenario', function() {

            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return 5; });
            var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');

            $rootScope.$digest();

            expect(spyPeachEvent.called).to.equal(true);
            expect(stubPeachSession.called).to.equal(true);

            expect(spyShowMessage.calledWithExactly('Selected location is not an active Cake location.')).to.equal(true);

            expect(controllerScope.vm.canEditInvoice).to.equal(false);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });

          it('cake active location selected but no id in url (opening new invoice form) scenario', function() {

            var locationId = 7;
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
            var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
            var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
            var spyCakeVendorLocationsLoad = sandbox.spy(controllerScope.vm.cakeVendorLocations, 'loadVendorLocations');

            $rootScope.$digest();

            expect(stubPeachSession.called).to.equal(true);

            expect(controllerScope.vm.locationTime.timezone).to.equal(editInvoiceControllerTestsMockedData.active_locations[0]['timezone']);
            expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
            expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
            expect(spyCakeVendorsLoad.calledWithExactly({is_active: true}, {sort: 'name'})).to.equal(true);
            expect(spyCakeVendorLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);

            expect(controllerScope.vm.glAccounts.length).to.equal(editInvoiceControllerTestsMockedData.gl_accounts_response.count);
            expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editInvoiceControllerTestsMockedData.gl_accounts_response.count);
            expect(controllerScope.vm.glAccounts[0]).to.contain.all.keys(['total_price_value', 'total_price_value_formatted', 'invoice_item_ids', 'parent']);
            expect(controllerScope.vm.units.length).to.equal(editInvoiceControllerTestsMockedData.units_response.count);
            expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editInvoiceControllerTestsMockedData.units_response.count);
            expect(_.keys(controllerScope.vm.unitsByAbbr).length).to.equal(editInvoiceControllerTestsMockedData.units_response.count);
            expect(controllerScope.vm.vendors.length).to.equal(editInvoiceControllerTestsMockedData.vendors_response.count);
            expect(_.keys(controllerScope.vm.vendorsById).length).to.equal(editInvoiceControllerTestsMockedData.vendors_response.count);
            expect(controllerScope.vm.availableVendors.length).to.equal(4);

            expect(spyPeachEvent.called).to.equal(true);
            expect(controllerScope.vm.editingPreviouslyCreatedInvoice).to.equal(false);
            expect(controllerScope.vm.editedInvoice.form_data.location_id).to.equal(locationId);
            expect(controllerScope.vm.editedInvoice.form_data.invoice_date).to.deep.equal(controllerScope.vm.editedInvoice.form_data.receipt_date);
            expect(moment(controllerScope.vm.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));

            expect(controllerScope.vm.canEditInvoice).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });

          it('cake active location selected but incorrect id in url given (can\'t edit invoice) scenario', function() {

            var locationId = 7;
            var testId = 999;
            var testError = {error: 'api error'};
            var deferred1 = $q.defer();
                deferred1.reject(testError);
            var mockCakeInvoices = sandbox.mock(controllerScope.vm.cakeInvoices);
            var cakeInvoiceLoadExpectation = mockCakeInvoices.expects('loadInvoices').returns(deferred1.promise);
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
            var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
            var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
            var spyCakeVendorLocationsLoad = sandbox.spy(controllerScope.vm.cakeVendorLocations, 'loadVendorLocations');
            var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });

            $rootScope.$digest();

            expect(stubPeachSession.called).to.equal(true);

            expect(controllerScope.vm.locationTime.timezone).to.equal(editInvoiceControllerTestsMockedData.active_locations[0]['timezone']);
            expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
            expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
            expect(spyCakeVendorsLoad.calledWithExactly({is_active: true}, {sort: 'name'})).to.equal(true);
            expect(spyCakeVendorLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);

            expect(controllerScope.vm.glAccounts.length).to.equal(editInvoiceControllerTestsMockedData.gl_accounts_response.count);
            expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editInvoiceControllerTestsMockedData.gl_accounts_response.count);
            expect(controllerScope.vm.glAccounts[0]).to.contain.all.keys(['total_price_value', 'total_price_value_formatted', 'invoice_item_ids', 'parent']);
            expect(controllerScope.vm.units.length).to.equal(editInvoiceControllerTestsMockedData.units_response.count);
            expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editInvoiceControllerTestsMockedData.units_response.count);
            expect(_.keys(controllerScope.vm.unitsByAbbr).length).to.equal(editInvoiceControllerTestsMockedData.units_response.count);
            expect(controllerScope.vm.vendors.length).to.equal(editInvoiceControllerTestsMockedData.vendors_response.count);
            expect(_.keys(controllerScope.vm.vendorsById).length).to.equal(editInvoiceControllerTestsMockedData.vendors_response.count);
            expect(controllerScope.vm.availableVendors.length).to.equal(4);

            expect(controllerScope.vm.editingPreviouslyCreatedInvoice).to.equal(false);
            expect(controllerScope.vm.editedInvoice.form_data.location_id).to.equal(locationId);
            expect(controllerScope.vm.editedInvoice.form_data.invoice_date).to.deep.equal(controllerScope.vm.editedInvoice.form_data.receipt_date);
            expect(moment(controllerScope.vm.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));

            expect(stubLocation.called).to.equal(true);

            expect(cakeInvoiceLoadExpectation.withExactArgs(testId).verify()).to.equal(true);

            expect(spyPeachEvent.called).to.equal(false);
            expect(spyErrorHandler.calledWithExactly(testError)).to.equal(true);

            expect(controllerScope.vm.canEditInvoice).to.equal(false);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });

        });

        describe('activate should finish and load invoice scenarios', function() {

          it('should set up extended controller data common for all subscenarios', function() {

            var locationId = 7;
            var testId = 59;
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var spyCakeInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
            var spyCakeEventsLoad = sandbox.spy(controllerScope.vm.cakeEvents, 'loadEvents');

            $rootScope.$digest();

            expect(stubPeachSession.called).to.equal(true);
            expect(stubLocation.called).to.equal(true);
            expect(spyCakeInvoicesLoad.calledWithExactly(testId)).to.equal(true);

            expect(controllerScope.vm.editedInvoice.data).to.deep.equal(editInvoiceControllerTestsMockedData.invoices_response);
            expect(controllerScope.vm.editedInvoice.data.formatted_receipt_date).to.equal(moment(editInvoiceControllerTestsMockedData.invoices_response.receipt_date, 'YYYY-MM-DD').format('l'));
            expect(controllerScope.vm.editedInvoice.data.formatted_invoice_date).to.equal(moment(editInvoiceControllerTestsMockedData.invoices_response.invoice_date, 'YYYY-MM-DD').format('l'));
            expect(_.omit(controllerScope.vm.editedInvoice.data, ['receipt_date', 'invoice_date'])).to.deep.equal(_.omit(controllerScope.vm.editedInvoice.form_data, ['receipt_date', 'invoice_date']));
            expect(controllerScope.vm.editedInvoice.form_data.receipt_date).to.deep.equal(moment(editInvoiceControllerTestsMockedData.invoices_response.receipt_date, 'YYYY-MM-DD').toDate());
            expect(controllerScope.vm.editedInvoice.form_data.invoice_date).to.deep.equal(moment(editInvoiceControllerTestsMockedData.invoices_response.invoice_date, 'YYYY-MM-DD').toDate());
            expect(controllerScope.vm.editedInvoice.data.vendor).to.deep.equal(controllerScope.vm.vendorsById[1]);
            expect(controllerScope.vm.editedInvoice.was_complete).to.equal(false);
            expect(controllerScope.vm.editingPreviouslyCreatedInvoice).to.equal(true);

            expect(spyCakeEventsLoad.calledWithExactly(editInvoiceControllerTestsMockedData.invoices_response.inv_event_id)).to.equal(true);

            expect(controllerScope.vm.editedInvoice.data.notes).to.equal(editInvoiceControllerTestsMockedData.events_response.notes);

            expect(spyPeachEvent.called).to.equal(true);

            expect(controllerScope.vm.canEditInvoice).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);

          });

          it('should throw error if vendor for invoice no longer exists', function() {

            var locationId = 7;
            var testId = 59;
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var deferred1 = $q.defer();
                deferred1.resolve(_.extend({}, editInvoiceControllerTestsMockedData.invoices_response, {vendor_id: 999}));
            var mockCakeInvoices = sandbox.mock(controllerScope.vm.cakeInvoices);
            var cakeInvoiceLoadExpectation = mockCakeInvoices.expects('loadInvoices').returns(deferred1.promise);
            var spyCakeEventsLoad = sandbox.spy(controllerScope.vm.cakeEvents, 'loadEvents');
            var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');

            $rootScope.$digest();

            expect(stubPeachSession.called).to.equal(true);
            expect(stubLocation.called).to.equal(true);

            expect(cakeInvoiceLoadExpectation.withExactArgs(testId).verify()).to.equal(true);            

            expect(spyCakeEventsLoad.called).to.equal(false);
            expect(spyPeachEvent.called).to.equal(false);

            expect(controllerScope.vm.canEditInvoice).to.equal(false);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
            expect(spyErrorHandler.calledWithExactly('Vendor for this invoice no longer exists')).to.equal(true);
          
          });

          it('should load data for given invoice', function() {

            var locationId = 7;
            var testId = 59;
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var spyCakeVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
            var spyCakeInvoiceItemsLoad = sandbox.spy(controllerScope.vm.cakeInvoiceItems, 'loadInvoiceItems');
            var spyCakeInvoiceGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeInvoiceGLAccounts, 'loadInvoiceGLAccounts');
            var spyCakeItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
            var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
            var spyCakeItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');

            $rootScope.$digest();

            expect(spyCakeVendorItemsLoad.calledWithExactly({vendor_id: 1})).to.equal(true);
            expect(spyCakeInvoiceItemsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'vendor_id': 1
                  },
                  {
                    'location_id': locationId
                  },
                  {
                    'invoice_id': testId
                  }
                ]
              },
              {
                'sort'  : '-updated_at'
              }
            )).to.equal(true);
            expect(spyCakeInvoiceGLAccountsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'vendor_id': 1
                  },
                  {
                    'location_id': locationId
                  },
                  {
                    'invoice_id': testId
                  }
                ]
              },
              {
                'sort'  : '-updated_at'
              }
            )).to.equal(true);
            expect(controllerScope.vm.vendorItems.length).to.equal(editInvoiceControllerTestsMockedData.vendor_items_response.count);
            expect(_.keys(controllerScope.vm.vendorItemsById).length).to.equal(editInvoiceControllerTestsMockedData.vendor_items_response.count);
            expect(controllerScope.vm.invoiceItems.length).to.equal(editInvoiceControllerTestsMockedData.invoice_items_response.count);
            expect(_.keys(controllerScope.vm.invoiceItemsById).length).to.equal(editInvoiceControllerTestsMockedData.invoice_items_response.count);
            expect(controllerScope.vm.invoiceGLAccounts.length).to.equal(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.count);
            expect(_.keys(controllerScope.vm.invoiceGLAccountsById).length).to.equal(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.count);
            expect(spyCakeItemLocationsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'location_id': locationId
                  },
                  {
                    'inv_item_id' : [1056,1667,802,1615,1660,877,722,1494,1511,1730]
                  }
                ]
              }
            )).to.equal(true);
            expect(spyCakeItemsLoad.calledWithExactly(
              {
                '$or' : [
                  {   
                    '$and' : [
                      {
                        'id' : [1494,802,1667,722,1511,1615,1730,1056,1660]
                      },
                      {
                        'is_active' : true
                      }
                    ]
                  },
                  {
                    'id' : [1056,1511]
                  }
                ]
              }
            )).to.equal(true);
            expect(controllerScope.vm.items.length).to.equal(editInvoiceControllerTestsMockedData.items_response.count);
            expect(_.keys(controllerScope.vm.itemsById).length).to.equal(editInvoiceControllerTestsMockedData.items_response.count);
            expect(spyCakeItemUnitsLoad.calledWithExactly(
              {
                'inv_item_id' : [1056,1511,1494,802,1730,1615,1660,1667]
              }
            )).to.equal(true);
            expect(_.keys(controllerScope.vm.itemUnitsbyId).length).to.equal(editInvoiceControllerTestsMockedData.item_units_response.count);

            expect(spyPeachEvent.called).to.equal(true);

            expect(controllerScope.vm.canEditInvoice).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);

          });

          it('should parse loaded data for given invoice', function() {

            var locationId = 7;
            var testId = 59;
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });

            $rootScope.$digest();

            _.each(controllerScope.vm.items, function(parsedItem) {
              expect(parsedItem).to.contain.all.keys(['category', 'category_name', 'category_id', 'displayed', 'counted', 'vendor_items_data', 'counted_vendor_items_data']);
              return;
            });


            expect(controllerScope.vm.itemsById[1056]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1056]['category_id']).to.equal(16);
            expect(controllerScope.vm.itemsById[1056]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1056]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1056]['displayed']).to.equal(true);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'].length).to.equal(3);
            expect(controllerScope.vm.itemsById[1056]['counted_vendor_items_data'].length).to.equal(3);
            _.each(controllerScope.vm.itemsById[1056]['vendor_items_data'], function(parsedVendorItem) {
              expect(parsedVendorItem).to.contain.all.keys(['item', 'name', 'quantity_label', 'quantity_value', 'new_quantity_value', 'unit_price_value', 'new_unit_price_value', 'extended_price_value', 'new_extended_price_value', 'invoice_object', 'counted']);
              return;
            });
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['item']).to.deep.equal(controllerScope.vm.itemsById[1056]);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['name']).to.equal(controllerScope.vm.itemsById[1056]['name']);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['quantity_label']).to.equal('10 Blocks');
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['quantity_value']).to.equal(20);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['new_quantity_value']).to.equal(20);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['unit_price_value']).to.equal(20);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['new_unit_price_value']).to.equal(20);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['extended_price_value']).to.equal(400);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['new_extended_price_value']).to.equal(400);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['invoice_object']).to.deep.equal(controllerScope.vm.invoiceItemsById[172]);


            expect(controllerScope.vm.itemsById[802]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[802]['category_id']).to.equal(16);
            expect(controllerScope.vm.itemsById[802]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[802]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['displayed']).to.equal(true);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'].length).to.equal(1);
            expect(controllerScope.vm.itemsById[802]['counted_vendor_items_data'].length).to.equal(0);
            _.each(controllerScope.vm.itemsById[802]['vendor_items_data'], function(parsedVendorItem) {
              expect(parsedVendorItem).to.contain.all.keys(['item', 'name', 'quantity_label', 'quantity_value', 'new_quantity_value', 'unit_price_value', 'new_unit_price_value', 'extended_price_value', 'new_extended_price_value', 'invoice_object', 'counted']);
              return;
            });
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['item']).to.deep.equal(controllerScope.vm.itemsById[802]);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['name']).to.equal(controllerScope.vm.itemsById[802]['name']);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['quantity_label']).to.equal('Bottle (Bottle 2.00000 floz)');
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['unit_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['new_unit_price_value']).to.equal(35);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['extended_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['new_extended_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['vendor_items_data'][0]['invoice_object']).to.equal(null);


            expect(controllerScope.vm.itemsById[1667]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1667]['category_id']).to.equal(16);
            expect(controllerScope.vm.itemsById[1667]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1667]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[1667]['displayed']).to.equal(true);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'].length).to.equal(2);
            expect(controllerScope.vm.itemsById[1667]['counted_vendor_items_data'].length).to.equal(0);
            _.each(controllerScope.vm.itemsById[1667]['vendor_items_data'], function(parsedVendorItem) {
              expect(parsedVendorItem).to.contain.all.keys(['item', 'name', 'quantity_label', 'quantity_value', 'new_quantity_value', 'unit_price_value', 'new_unit_price_value', 'extended_price_value', 'new_extended_price_value', 'invoice_object', 'counted']);
              return;
            });
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['item']).to.deep.equal(controllerScope.vm.itemsById[1667]);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['name']).to.equal(controllerScope.vm.itemsById[1667]['name']);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['quantity_label']).to.equal('Kilogram (Kilogram 1 floz)');
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['unit_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['new_unit_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['extended_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['new_extended_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[1667]['vendor_items_data'][1]['invoice_object']).to.equal(null);


            expect(controllerScope.vm.itemsById[1615]['category']).to.deep.equal(controllerScope.vm.glAccountsById[28]);
            expect(controllerScope.vm.itemsById[1615]['category_id']).to.equal(28);
            expect(controllerScope.vm.itemsById[1615]['category_name']).to.equal(controllerScope.vm.glAccountsById[28]['name']);
            expect(controllerScope.vm.itemsById[1615]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[1615]['displayed']).to.equal(true);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'].length).to.equal(1);
            expect(controllerScope.vm.itemsById[1615]['counted_vendor_items_data'].length).to.equal(0);
            _.each(controllerScope.vm.itemsById[1615]['vendor_items_data'], function(parsedVendorItem) {
              expect(parsedVendorItem).to.contain.all.keys(['item', 'name', 'quantity_label', 'quantity_value', 'new_quantity_value', 'unit_price_value', 'new_unit_price_value', 'extended_price_value', 'new_extended_price_value', 'invoice_object', 'counted']);
              return;
            });
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['item']).to.deep.equal(controllerScope.vm.itemsById[1615]);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['name']).to.equal(controllerScope.vm.itemsById[1615]['name']);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['quantity_label']).to.equal('Can (Can 5 gal)');
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['unit_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['new_unit_price_value']).to.equal(25);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['extended_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['new_extended_price_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[1615]['vendor_items_data'][0]['invoice_object']).to.equal(null);


            expect(controllerScope.vm.editedInvoice.misc_data.items_data.length).to.equal(2);
            expect(_.keys(controllerScope.vm.editedInvoice.misc_data.items_data_by_id).length).to.equal(2);
            expect(controllerScope.vm.editedInvoice.misc_data.opened_by_default).to.equal(false);
            expect(controllerScope.vm.editedInvoice.misc_data.total_price_value).to.equal(20);
            expect(controllerScope.vm.editedInvoice.misc_data.total_price_value_formatted).to.equal('20.00');
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]).to.contain.all.keys(['new_gl_account_id', 'gl_account_name', 'amount_value', 'new_amount_value', 'new_description_value', 'item_object']);
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]['new_gl_account_id']).to.equal(35);
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]['gl_account_name']).to.equal('Bread');
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]['amount_value']).to.equal(20);
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]['new_amount_value']).to.equal(20);
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]['new_description_value']).to.equal('test');
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[0]['item_object']).to.deep.equal(controllerScope.vm.invoiceGLAccountsById[66]);
            expect(controllerScope.vm.editedInvoice.misc_data.items_data[1]).to.deep.equal({id: 0});


            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][0]['number']).to.equal('AE 1223');
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][1]['number']).to.equal('AE 1227');
            expect(controllerScope.vm.itemsById[1056]['vendor_items_data'][2]['number']).to.equal('RA 4454');


            expect(controllerScope.vm.editedInvoice.items_data).to.contain.all.keys(['Beer', 'Beverages', 'Liquor', 'Seafood']);
            expect(controllerScope.vm.editedInvoice.items_data['Beer']['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.editedInvoice.items_data['Beer']['counted_items'].length).to.equal(1);
            expect(controllerScope.vm.editedInvoice.items_data['Beer']['items'].length).to.equal(5);
            expect(controllerScope.vm.editedInvoice.items_data['Beer']['category']['invoice_item_ids'].length).to.equal(3);
            expect(controllerScope.vm.editedInvoice.items_data['Beer']['category']['total_price_value']).to.equal(1400);
            expect(controllerScope.vm.editedInvoice.items_data['Beer']['category']['total_price_value_formatted']).to.equal('1400.00');


            expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1820);
            expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1820.00');
            expect(controllerScope.vm.editedInvoice.update_timestamp).to.equal('Last Updated by test tester on Mon, Nov 30, 2015 9:27 AM EST');

          });        

        });

      });

    });

    describe('Functions', function() {

      it('closeModal should display confirmation dialog and redirect to invoices page', function() {

        var spyClosingConfirmation = sandbox.spy(controllerScope.vm, 'confirmSaveInvoice');
        var spyGoBack = sandbox.spy(controllerScope.vm, 'goBack');

        controllerScope.vm.editedInvoice.data.id = 1;
        controllerScope.vm.editedInvoice.data.is_complete = true;
        controllerScope.vm.closeModal();
        expect(spyClosingConfirmation.called).to.equal(false);
        expect(spyGoBack.calledOnce).to.equal(true);

        controllerScope.vm.editedInvoice.data = {};
        controllerScope.vm.closeModal();
        expect(spyClosingConfirmation.called).to.equal(false);
        expect(spyGoBack.calledTwice).to.equal(true);

        controllerScope.vm.editedInvoice.data.id = 1;
        controllerScope.vm.editedInvoice.data.is_complete = false;
        controllerScope.vm.closeModal();
        expect(spyClosingConfirmation.calledOnce).to.equal(true);
        expect(spyGoBack.calledThrice).to.equal(false);

      });

      it('confirmDeleteInvoice should display count delete confirmation dialog', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyModalShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');

        controllerScope.$digest();
        controllerScope.vm.confirmDeleteInvoice();
        controllerScope.$digest();
        expect(spyModalShow.called).to.equal(true);

      });

      it('confirmSaveInvoice should display invoice save confirmation dialog', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyModalShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');

        controllerScope.$digest();
        controllerScope.vm.confirmDeleteInvoice();
        controllerScope.$digest();
        expect(spyModalShow.called).to.equal(true);

      });

      it('createInvoice should create new invoice in database and open it for editing', function() {

        var locationId = 7;
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyInvoiceCreate = sandbox.spy(controllerScope.vm.cakeInvoices, 'createInvoice');
        
        // change mocked data slightly to test this scenario
        var invoiceItemsMockedData = [];
        var invoiceGLAccountsMockedData = [];
        var invoiceItemsLoadStub = sandbox.stub(controllerScope.vm.cakeInvoiceItems, 'getInvoiceItems', function() { return invoiceItemsMockedData; });
        var invoiceGLAccountsLoadStub = sandbox.stub(controllerScope.vm.cakeInvoiceGLAccounts, 'getInvoiceGLAccounts', function() { return invoiceGLAccountsMockedData; });

        controllerScope.$digest();

        controllerScope.vm.canEditInvoice = false;
        controllerScope.vm.createInvoice();
        expect(spyInvoiceCreate.called).to.equal(false);

        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.form_data.vendor_id = 1;
        controllerScope.vm.editedInvoice.form_data.receipt_date = moment('1.1.2015', 'D.M.YYYY');
        controllerScope.vm.editedInvoice.form_data.invoice_number = '1a';
        controllerScope.vm.editedInvoice.form_data.updated_at = moment().toISOString();
        controllerScope.vm.editedInvoice.form_data.updated_by = 44;

        var formDataCopy = angular.copy(controllerScope.vm.editedInvoice.form_data);

        controllerScope.vm.createInvoice();
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.editedInvoice.data.formatted_receipt_date).to.equal(moment(formDataCopy.receipt_date, 'YYYY-MM-DD').format('l'));
        expect(controllerScope.vm.editedInvoice.data.formatted_invoice_date).to.equal(moment(formDataCopy.receipt_date, 'YYYY-MM-DD').format('l'));
        expect(controllerScope.vm.editedInvoice.data.vendor).to.deep.equal(controllerScope.vm.vendorsById[1]);
        expect(controllerScope.vm.editedInvoice.form_data).to.deep.equal(_.extend({}, controllerScope.vm.editedInvoice.data, {receipt_date: moment(controllerScope.vm.editedInvoice.data.receipt_date, 'YYYY-MM-DD').toDate(), invoice_date: moment(controllerScope.vm.editedInvoice.data.invoice_date, 'YYYY-MM-DD').toDate()}));
        expect(controllerScope.vm.editedInvoice.was_complete).to.equal(false);
        expect(controllerScope.vm.editingPreviouslyCreatedInvoice).to.equal(false);
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(0); 
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('0.00'); 
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);

      });

      it('deleteInvoice should remove invoice from database and redirect to invoices page', function() {

        var spyRemoveInvoice = sandbox.spy(controllerScope.vm.cakeInvoices, 'removeInvoice');
        var spyGoBack = sandbox.spy(controllerScope.vm, 'goBack');

        controllerScope.vm.canEditInvoice = false;
        controllerScope.vm.editedInvoice.data.id = 1;
        controllerScope.vm.deleteInvoice();
        expect(spyRemoveInvoice.called).to.equal(false);


        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.data = {};
        controllerScope.vm.deleteInvoice();
        expect(spyRemoveInvoice.called).to.equal(false);


        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.data.id = 1;
        controllerScope.vm.deleteInvoice();
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyRemoveInvoice.calledWithExactly(1)).to.equal(true);
        expect(spyGoBack.called).to.equal(true);

      });

      it('deleteInvoiceMiscItem should remove misc item entry from database and update total price', function() {

        var testId = 59;
        var locationId = 7;
        var invoiceGLAccountId = 66;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyRemoveMiscItem = sandbox.spy(controllerScope.vm.cakeInvoiceGLAccounts, 'removeInvoiceGLAccount');
        var mockCakeInvoiceGLAccounts = sandbox.mock(controllerScope.vm.cakeInvoiceGLAccounts);
        var cakeInvoiceGLAccountsGetExpectation = mockCakeInvoiceGLAccounts.expects('getInvoiceGLAccounts').returns(angular.copy(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.results));
        var cakeInvoiceGLAccountsGetCollectionExpectation = mockCakeInvoiceGLAccounts.expects('getInvoiceGLAccountsCollection').returns(_.object(_.pluck(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.results, 'id'), angular.copy(editInvoiceControllerTestsMockedData.invoice_gl_accounts_response.results)));

        controllerScope.$digest();

        controllerScope.vm.canEditInvoice = false;
        controllerScope.vm.deleteInvoiceMiscItem(invoiceGLAccountId);
        expect(spyRemoveMiscItem.called).to.equal(false);


        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.deleteInvoiceMiscItem(invoiceGLAccountId);
        expect(spyRemoveMiscItem.calledWithExactly(invoiceGLAccountId)).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceGLAccountsById[invoiceGLAccountId]).to.equal(undefined);
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[invoiceGLAccountId]).to.equal(undefined);
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1800);

      });

      it('goBack should redirect back to invoices page', function() {

        controllerScope.vm.goBack();

        expect(controllerScope.vm.$location.path()).to.be.equal('/invoices');
        expect(controllerScope.vm.$location.search()).not.to.have.property('id');

      });

      it('saveInvoiceItemExtendedPrice should update invoice item entry data with extended price value and calculated unit price value', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyCakeInvoiceItemUpdate = sandbox.spy(controllerScope.vm.cakeInvoiceItems, 'updateInvoiceItem');

        controllerScope.$digest();

        controllerScope.vm.vendorItemsById[14]['new_extended_price_value'] = 100;
        controllerScope.vm.saveInvoiceItemExtendedPrice(14);
        expect(spyCakeInvoiceItemUpdate.called).to.equal(false);


        controllerScope.vm.vendorItemsById[14]['new_extended_price_value'] = 200;
        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = null;
        controllerScope.vm.saveInvoiceItemExtendedPrice(14);
        expect(spyCakeInvoiceItemUpdate.called).to.equal(false);


        controllerScope.vm.vendorItemsById[14]['new_extended_price_value'] = 200;
        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 15;
        controllerScope.vm.saveInvoiceItemExtendedPrice(14);
        expect(spyCakeInvoiceItemUpdate.calledWith(
          {
            id                : 171,
            unit_price        : 13.33333,
            extended_price    : 200
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[171]['unit_price']).to.equal(13.33333);
        expect(controllerScope.vm.invoiceItemsById[171]['extended_price']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['unit_price']).to.equal(13.33333);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['extended_price']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['unit_price_value']).to.equal(13.33333);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1500);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1500.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1920);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1920.00');


        controllerScope.vm.vendorItemsById[14]['new_extended_price_value'] = null;
        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 10;
        controllerScope.vm.saveInvoiceItemExtendedPrice(14);
        expect(spyCakeInvoiceItemUpdate.calledWith(
          {
            id                : 171,
            unit_price        : 0,
            extended_price    : 0
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[171]['unit_price']).to.equal(0);
        expect(controllerScope.vm.invoiceItemsById[171]['extended_price']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['unit_price']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['extended_price']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['unit_price_value']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['new_unit_price_value']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['new_extended_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1300);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1300.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1720);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1720.00');
        
      });

      it('saveInvoiceItemPrice should update invoice item entry data with unit price value and calculated extended price value', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyCakeInvoiceItemUpdate = sandbox.spy(controllerScope.vm.cakeInvoiceItems, 'updateInvoiceItem');

        controllerScope.$digest();

        controllerScope.vm.vendorItemsById[14]['new_unit_price_value'] = 10;
        controllerScope.vm.saveInvoiceItemPrice(14);
        expect(spyCakeInvoiceItemUpdate.called).to.equal(false);


        controllerScope.vm.vendorItemsById[14]['new_unit_price_value'] = 20;
        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = null;
        controllerScope.vm.saveInvoiceItemPrice(14);
        expect(spyCakeInvoiceItemUpdate.called).to.equal(false);


        controllerScope.vm.vendorItemsById[14]['new_unit_price_value'] = 20;
        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 15;
        controllerScope.vm.saveInvoiceItemPrice(14);
        expect(spyCakeInvoiceItemUpdate.calledWith(
          {
            id                : 171,
            unit_price        : 20,
            extended_price    : 300
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[171]['unit_price']).to.equal(20);
        expect(controllerScope.vm.invoiceItemsById[171]['extended_price']).to.equal(300);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['unit_price']).to.equal(20);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['extended_price']).to.equal(300);
        expect(controllerScope.vm.vendorItemsById[14]['unit_price_value']).to.equal(20);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(300);
        expect(controllerScope.vm.vendorItemsById[14]['new_extended_price_value']).to.equal(300);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1600);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1600.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(2020);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('2020.00');


        controllerScope.vm.vendorItemsById[14]['new_unit_price_value'] = null;
        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 15;
        controllerScope.vm.saveInvoiceItemPrice(14);
        expect(spyCakeInvoiceItemUpdate.calledWith(
          {
            id                : 171,
            unit_price        : 0,
            extended_price    : 0
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[171]['unit_price']).to.equal(0);
        expect(controllerScope.vm.invoiceItemsById[171]['extended_price']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['unit_price']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['extended_price']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['unit_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['new_unit_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['new_extended_price_value']).to.equal(0);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1300);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1300.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1720);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1720.00');
        
      });

      it('saveInvoiceItemQuantity should either update invoice item entry, create new or delete it depending on given value and current invoice state', function() {

        var testId = 59;
        var locationId = 7;
        var createTestData = {
          invoice_id                : testId,
          vendor_id                 : 1,
          vendor_inventory_item_id  : 14,
          inv_item_id               : 1056,
          quantity                  : 20,
          unit_price                : 10,
          extended_price            : 200,
          location_id               : locationId
        };
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var deferred1 = $q.defer();
            deferred1.resolve(_.extend({}, createTestData, {id: 888}));
        var spyCakeInvoiceItemCreate = sandbox.stub(controllerScope.vm.cakeInvoiceItems, 'createInvoiceItem', function(){ return deferred1.promise; });
        var spyCakeInvoiceItemUpdate = sandbox.spy(controllerScope.vm.cakeInvoiceItems, 'updateInvoiceItem');
        var spyCakeInvoiceItemRemove = sandbox.spy(controllerScope.vm.cakeInvoiceItems, 'removeInvoiceItem');

        controllerScope.$digest();

        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 10;
        controllerScope.vm.saveInvoiceItemQuantity(14);
        expect(spyCakeInvoiceItemCreate.called).to.equal(false);
        expect(spyCakeInvoiceItemUpdate.called).to.equal(false);
        expect(spyCakeInvoiceItemRemove.called).to.equal(false);


        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 15;
        controllerScope.vm.saveInvoiceItemQuantity(14);
        expect(spyCakeInvoiceItemCreate.called).to.equal(false);
        expect(spyCakeInvoiceItemUpdate.calledWith(
          {
            id                : 171,
            quantity          : 15,
            extended_price    : 150
          }
        )).to.equal(true);
        expect(spyCakeInvoiceItemRemove.called).to.equal(false);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[171]['quantity']).to.equal(15);
        expect(controllerScope.vm.invoiceItemsById[171]['extended_price']).to.equal(150);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['quantity']).to.equal(15);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['extended_price']).to.equal(150);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(150);
        expect(controllerScope.vm.vendorItemsById[14]['new_extended_price_value']).to.equal(150);
        expect(controllerScope.vm.vendorItemsById[14]['quantity_value']).to.equal(15);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1450);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1450.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1870);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1870.00');


        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = 20;
        controllerScope.vm.vendorItemsById[14]['invoice_object'] = null;
        controllerScope.vm.vendorItemsById[14]['item']['category']['invoice_item_ids'] = [173, 172];
        controllerScope.vm.saveInvoiceItemQuantity(14);
        expect(spyCakeInvoiceItemCreate.calledWithExactly(createTestData)).to.equal(true);
        expect(spyCakeInvoiceItemUpdate.calledOnce).to.equal(true); // prev test called it
        expect(spyCakeInvoiceItemRemove.called).to.equal(false);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[888]['quantity']).to.equal(20);
        expect(controllerScope.vm.invoiceItemsById[888]['extended_price']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['quantity']).to.equal(20);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']['extended_price']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['new_extended_price_value']).to.equal(200);
        expect(controllerScope.vm.vendorItemsById[14]['quantity_value']).to.equal(20);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1500);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1500.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1920);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1920.00');
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['invoice_item_ids'].slice(-1)[0]).to.equal(888);


        controllerScope.vm.vendorItemsById[14]['new_quantity_value'] = null;
        controllerScope.vm.saveInvoiceItemQuantity(14);
        expect(spyCakeInvoiceItemCreate.calledOnce).to.equal(true); // prev test called it
        expect(spyCakeInvoiceItemUpdate.calledOnce).to.equal(true); // prev test called it
        expect(spyCakeInvoiceItemRemove.calledWithExactly({id: 888})).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceItemsById[888]).to.equal(undefined);
        expect(controllerScope.vm.vendorItemsById[14]['invoice_object']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['extended_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['new_extended_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['quantity_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['new_quantity_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['unit_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['new_unit_price_value']).to.equal(null);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value']).to.equal(1300);
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['total_price_value_formatted']).to.equal('1300.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1720);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1720.00');
        expect(controllerScope.vm.vendorItemsById[14]['item']['category']['invoice_item_ids'].indexOf(888)).to.equal(-1);
        
      });

      it('saveInvoiceMiscItemAmount should update existing misc item db entry and update invoice totals', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyCakeInvoiceMiscItemUpdate = sandbox.spy(controllerScope.vm.cakeInvoiceGLAccounts, 'updateInvoiceGLAccount');

        controllerScope.$digest();

        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[0]['new_amount_value'] = 10;
        controllerScope.vm.saveInvoiceMiscItemAmount(0);
        expect(spyCakeInvoiceMiscItemUpdate.called).to.equal(false);


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_amount_value'] = 20;
        controllerScope.vm.saveInvoiceMiscItemAmount(66);
        expect(spyCakeInvoiceMiscItemUpdate.called).to.equal(false);


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_amount_value'] = 30;
        controllerScope.vm.saveInvoiceMiscItemAmount(66);
        expect(spyCakeInvoiceMiscItemUpdate.calledWith(
          {
            id: 66,
            amount: 30
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceGLAccountsById[66]['amount']).to.equal(30);
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['amount_value']).to.equal(30);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value).to.equal(30);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value_formatted).to.equal('30.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1830);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1830.00');


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_amount_value'] = null;
        controllerScope.vm.saveInvoiceMiscItemAmount(66);
        expect(spyCakeInvoiceMiscItemUpdate.calledWith(
          {
            id: 66,
            amount: 0
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceGLAccountsById[66]['amount']).to.equal(0);
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['amount_value']).to.equal(null);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value).to.equal(0);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value_formatted).to.equal('0.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1800);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1800.00');
        
      });

      it('saveInvoiceMiscItemDescription should update existing misc item db entry', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyCakeInvoiceMiscItemUpdate = sandbox.spy(controllerScope.vm.cakeInvoiceGLAccounts, 'updateInvoiceGLAccount');

        controllerScope.$digest();

        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[0]['new_description_value'] = 'test';
        controllerScope.vm.saveInvoiceMiscItemDescription(0);
        expect(spyCakeInvoiceMiscItemUpdate.called).to.equal(false);


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_description_value'] = 'test';
        controllerScope.vm.saveInvoiceMiscItemDescription(66);
        expect(spyCakeInvoiceMiscItemUpdate.called).to.equal(false);


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_description_value'] = 'Test edited';
        controllerScope.vm.saveInvoiceMiscItemDescription(66);
        expect(spyCakeInvoiceMiscItemUpdate.calledWith(
          {
            id: 66,
            description: 'Test edited'
          }
        )).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceGLAccountsById[66]['description']).to.equal('Test edited');
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['description']).to.equal('Test edited');
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value).to.equal(20);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value_formatted).to.equal('20.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1820);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1820.00');
        
      });

      it('saveInvoiceMiscItemGLAccount should update existing misc item gl account or create new misc item entry if it was called on placeholder item', function() {

        var testId = 59;
        var locationId = 7;
        var createTestData = {
          invoice_id        : testId,
          vendor_id         : 1,
          gl_account_id     : 11,
          description       : undefined,
          amount            : 0,
          location_id       : locationId
        };
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyCakeInvoiceMiscItemUpdate = sandbox.spy(controllerScope.vm.cakeInvoiceGLAccounts, 'updateInvoiceGLAccount');
        var deferred1 = $q.defer();
            deferred1.resolve(_.extend({}, createTestData, {id: 888}));
        var spyCakeInvoiceMiscItemCreate = sandbox.stub(controllerScope.vm.cakeInvoiceGLAccounts, 'createInvoiceGLAccount', function(){ return deferred1.promise; });

        controllerScope.$digest();

        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_gl_account_id'] = '35';
        controllerScope.vm.saveInvoiceMiscItemGLAccount(66);
        expect(spyCakeInvoiceMiscItemUpdate.called).to.equal(false);
        expect(spyCakeInvoiceMiscItemCreate.called).to.equal(false);


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['new_gl_account_id'] = '11';
        controllerScope.vm.saveInvoiceMiscItemGLAccount(66);
        expect(spyCakeInvoiceMiscItemUpdate.calledWithExactly(
          {
            id: 66,
            gl_account_id: 11
          }
        )).to.equal(true);
        expect(spyCakeInvoiceMiscItemCreate.called).to.equal(false);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceGLAccountsById[66]['gl_account_id']).to.equal(11);
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[66]['gl_account_id']).to.equal(11);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value).to.equal(20);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value_formatted).to.equal('20.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1820);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1820.00');


        controllerScope.vm.editedInvoice.misc_data.items_data_by_id[0]['new_gl_account_id'] = '11';
        controllerScope.vm.saveInvoiceMiscItemGLAccount(0);
        expect(spyCakeInvoiceMiscItemUpdate.calledOnce).to.equal(true); // prev test called it
        expect(spyCakeInvoiceMiscItemCreate.calledWithExactly(createTestData)).to.equal(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(controllerScope.vm.invoiceGLAccountsById[888]['gl_account_id']).to.equal(11);
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[888]['gl_account_id']).to.equal(11);
        expect(controllerScope.vm.editedInvoice.misc_data.items_data_by_id[0]['new_gl_account_id']).to.equal(undefined);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value).to.equal(20);
        expect(controllerScope.vm.editedInvoice.misc_data.total_price_value_formatted).to.equal('20.00');
        expect(controllerScope.vm.editedInvoice.total_price_value).to.equal(1820);
        expect(controllerScope.vm.editedInvoice.total_price_value_formatted).to.equal('1820.00');

      });

      it('toggleInvoiceIsComplete should toggle invoice status (and either make it editable or go back to invoices page)', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyUpdateInvoice = sandbox.spy(controllerScope.vm, 'updateInvoice');
        var spyCakeInvoicesUpdate = sandbox.spy(controllerScope.vm.cakeInvoices, 'updateInvoice');

        controllerScope.$digest();

        controllerScope.vm.canEditInvoice = false;
        controllerScope.vm.editedInvoice.form_data.is_complete = true;
        controllerScope.vm.toggleInvoiceIsComplete();
        expect(spyUpdateInvoice.called).to.equal(false);
        expect(spyCakeInvoicesUpdate.called).to.equal(false);

        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.form_data.is_complete = true;
        controllerScope.vm.toggleInvoiceIsComplete();
        expect(spyUpdateInvoice.calledWith(true)).to.equal(true);
        expect(spyCakeInvoicesUpdate.called).to.equal(true);

        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.form_data.is_complete = false;
        controllerScope.vm.toggleInvoiceIsComplete();
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyUpdateInvoice.calledOnce).to.equal(true); // prev test called it
        expect(spyCakeInvoicesUpdate.calledWithExactly({id: testId, is_complete: false})).to.equal(true);
        expect(controllerScope.vm.editedInvoice.form_data.is_complete).to.equal(false);
        expect(controllerScope.vm.editedInvoice.data.is_complete).to.equal(false);

      });

      it('updateInvoice should update invoice with given data using api call, eventually call goBack function', function() {

        var testId = 59;
        var locationId = 7;
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
        var spyCakeInvoicesUpdate = sandbox.spy(controllerScope.vm.cakeInvoices, 'updateInvoice');
        var spyGoBack = sandbox.spy(controllerScope.vm, 'goBack');

        controllerScope.$digest();

        controllerScope.vm.canEditInvoice = false;
        controllerScope.vm.updateInvoice();
        expect(spyCakeInvoicesUpdate.called).to.equal(false);

        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.form_data.invoice_number = '2b';
        controllerScope.vm.updateInvoice();
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyCakeInvoicesUpdate.calledWith({
          id                : testId,
          receipt_date      : moment(controllerScope.vm.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD'),
          invoice_date      : moment(controllerScope.vm.editedInvoice.form_data.invoice_date).format('YYYY-MM-DD'),
          invoice_number    : '2b',
          notes             : controllerScope.vm.editedInvoice.form_data.notes
        })).to.equal(true);
        expect(spyGoBack.called).to.equal(true);

        controllerScope.vm.canEditInvoice = true;
        controllerScope.vm.editedInvoice.form_data.invoice_number = '2b';
        controllerScope.vm.updateInvoice(true);
        expect(controllerScope.vm.blockers.api_processing).to.equal(true);
        controllerScope.$digest();
        expect(controllerScope.vm.blockers.api_processing).to.equal(false);
        expect(spyCakeInvoicesUpdate.calledWith({
          id                : testId,
          receipt_date      : moment(controllerScope.vm.editedInvoice.form_data.receipt_date).format('YYYY-MM-DD'),
          invoice_date      : moment(controllerScope.vm.editedInvoice.form_data.invoice_date).format('YYYY-MM-DD'),
          invoice_number    : '2b',
          notes             : controllerScope.vm.editedInvoice.form_data.notes,
          is_complete       : true
        })).to.equal(true);
        expect(spyGoBack.calledTwice).to.equal(true);

      });

      it('errorHandler should display message, eventually log message and call callback', function() {

        var spyCallback = sandbox.stub();
        var spyCakeCommonAPIError = sandbox.spy(controllerScope.vm.cakeCommon, 'apiErrorHandler');
        var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
        var messageString = 'some error message';
        var messageObject = {someval: 1};

        controllerScope.$digest();

        controllerScope.vm.errorHandler(messageString);

        expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(0);
        expect(spyCallback.callCount).to.equal(0);
        expect(errorLogStub.callCount).to.equal(0);

        controllerScope.vm.errorHandler(messageObject);

        expect(spyShowMessage.calledWithExactly('There was an error, please check console log for more details.', 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(0);
        expect(spyCallback.callCount).to.equal(0);
        expect(errorLogStub.callCount).to.equal(0);

        controllerScope.vm.errorHandler(messageString, true);

        expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(1);
        expect(spyCallback.callCount).to.equal(0);
        expect(errorLogStub.callCount).to.equal(1);

        controllerScope.vm.errorHandler(messageString, true, spyCallback);

        expect(spyShowMessage.calledWithExactly('There was an error: ' + messageString, 'alert')).to.equal(true);
        expect(spyCakeCommonAPIError.callCount).to.equal(2);
        expect(spyCallback.callCount).to.equal(1);
        expect(errorLogStub.callCount).to.equal(2);

      });

      it('hideMessage should clear user message data', function() {

        controllerScope.$digest();

        controllerScope.vm.userInfo = {message: 'message',type: 'error'};

        controllerScope.vm.hideMessage();

        expect(controllerScope.vm.userInfo.message).to.equal('');
        expect(controllerScope.vm.userInfo.type).to.equal('');

      });

      it('showMessage should set user message data accoring to params', function() {

        var messageString = 'some message';
        var typeString = 'alert';
        var defaultType = 'info'

        controllerScope.$digest();

        controllerScope.vm.hideMessage();
        controllerScope.vm.showMessage(messageString);

        expect(controllerScope.vm.userInfo.message).to.equal(messageString);
        expect(controllerScope.vm.userInfo.type).to.equal(defaultType);

        controllerScope.vm.hideMessage();
        controllerScope.vm.showMessage(messageString, typeString);

        expect(controllerScope.vm.userInfo.message).to.equal(messageString);
        expect(controllerScope.vm.userInfo.type).to.equal(typeString);

      });

    });

  });