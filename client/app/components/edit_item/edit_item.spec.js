describe("Controller: Edit item", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var editItemControllerTestsMockedData = {
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    float_regex                 : /^\s*[-+]?(\d{0,9}\.?\d{0,5}|\d{1,9}\.)\s*$/i,
    can_item_be_deleted         : true,
    can_item_common_unit_be_changed: true,
    count_groups_response       : {"count":5,"results":[{"schedule_days":null,"next_date":"2015-08-30","start_date":"2015-08-23","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"Default count group","name":"A","id":65,"created_by":44,"created_at":"2015-07-20T13:54:14.714Z","updated_by":44,"updated_at":"2015-08-28T13:10:34.290Z"},{"schedule_days":null,"next_date":"2016-02-01","start_date":"2015-10-01","is_active":true,"is_default":false,"schedule_interval":4,"schedule_type":"month","description":null,"name":"B","id":67,"created_by":44,"created_at":"2015-07-20T14:00:29.343Z","updated_by":44,"updated_at":"2015-11-18T19:31:29.414Z"},{"schedule_days":null,"next_date":"2015-09-01","start_date":"2015-08-01","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"month","description":"","name":"Group Aug 4th","id":80,"created_by":44,"created_at":"2015-08-04T16:58:57.582Z","updated_by":null,"updated_at":"2015-08-04T16:58:57.582Z"},{"schedule_days":null,"next_date":"2015-08-09","start_date":"2015-08-02","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"IPad","id":81,"created_by":44,"created_at":"2015-08-04T17:01:41.824Z","updated_by":null,"updated_at":"2015-08-04T17:01:41.824Z"},{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":true,"schedule_interval":1,"schedule_type":"month","description":"","name":"New QA Group","id":69,"created_by":44,"created_at":"2015-07-27T20:44:25.376Z","updated_by":44,"updated_at":"2015-11-18T19:36:14.878Z"}],"trigger_response":{"default_count_group":{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":true,"schedule_interval":1,"schedule_type":"month","description":"","name":"New QA Group","id":69,"created_by":44,"created_at":"2015-07-27T20:44:25.376Z","updated_by":44,"updated_at":"2015-11-18T19:36:14.878Z"},"default_count_group_included":true}},
    gl_accounts_response: {"count":2,"results":[{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Alcohol","parent_id":null,"id":12,"created_by":44,"created_at":"2014-09-24T10:33:10.579Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.579Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beer","parent_id":12,"id":16,"created_by":44,"created_at":"2014-10-08T20:58:59.896Z","updated_by":null,"updated_at":"2014-10-08T20:58:59.896Z"}]},
    units_response: {"count":32,"results":[{"type":"each","metric_base":null,"english_base":null,"abbr":"bg","is_metric":false,"name":"Bag","id":2,"created_by":44,"created_at":"2014-06-17T15:01:02.984Z","updated_by":null,"updated_at":"2014-06-30T14:24:50.873Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bat","is_metric":false,"name":"Batch","id":3,"created_by":44,"created_at":"2014-06-17T15:01:34.911Z","updated_by":null,"updated_at":"2014-06-30T14:24:45.030Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bk","is_metric":false,"name":"Block","id":4,"created_by":44,"created_at":"2014-06-17T15:01:54.954Z","updated_by":null,"updated_at":"2014-06-30T14:24:58.654Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bt","is_metric":false,"name":"Bottle","id":5,"created_by":44,"created_at":"2014-06-17T15:02:12.934Z","updated_by":44,"updated_at":"2014-07-15T06:44:11.711Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bx","is_metric":false,"name":"Box","id":6,"created_by":44,"created_at":"2014-06-17T15:02:38.022Z","updated_by":44,"updated_at":"2014-08-26T12:30:16.239Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bun","is_metric":false,"name":"Bunch","id":7,"created_by":44,"created_at":"2014-06-17T15:03:01.332Z","updated_by":44,"updated_at":"2014-07-15T06:44:36.347Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"can","is_metric":false,"name":"Can","id":8,"created_by":44,"created_at":"2014-06-17T15:03:31.864Z","updated_by":44,"updated_at":"2014-07-15T06:44:42.662Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cs","is_metric":false,"name":"Case","id":9,"created_by":44,"created_at":"2014-06-17T15:03:51.775Z","updated_by":44,"updated_at":"2014-07-15T06:44:52.527Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cnt","is_metric":false,"name":"Container","id":10,"created_by":44,"created_at":"2014-06-17T15:04:24.853Z","updated_by":44,"updated_at":"2014-07-15T06:45:06.460Z"},{"type":"volume","metric_base":"236.588000","english_base":"48.000000","abbr":"cup","is_metric":false,"name":"Cup","id":11,"created_by":44,"created_at":"2014-06-17T15:04:41.649Z","updated_by":44,"updated_at":"2014-10-29T09:30:33.672Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"doz","is_metric":false,"name":"Dozen","id":12,"created_by":44,"created_at":"2014-06-17T15:04:58.222Z","updated_by":44,"updated_at":"2014-07-15T06:45:34.457Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"ea","is_metric":false,"name":"Each","id":13,"created_by":44,"created_at":"2014-06-17T15:05:15.971Z","updated_by":44,"updated_at":"2014-07-15T06:56:29.997Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"fl","is_metric":false,"name":"Flat","id":14,"created_by":44,"created_at":"2014-06-17T15:05:34.037Z","updated_by":44,"updated_at":"2014-07-15T06:45:39.041Z"},{"type":"volume","metric_base":"29.573500","english_base":"6.000000","abbr":"floz","is_metric":false,"name":"Fluid Ounce","id":15,"created_by":44,"created_at":"2014-06-17T15:06:16.282Z","updated_by":44,"updated_at":"2014-10-29T09:33:41.004Z"},{"type":"volume","metric_base":"3785.410000","english_base":"768.000000","abbr":"gal","is_metric":false,"name":"Gallon","id":16,"created_by":44,"created_at":"2014-06-17T15:06:40.661Z","updated_by":44,"updated_at":"2014-10-29T09:33:04.925Z"},{"type":"weight","metric_base":"1.000000","english_base":"0.035274","abbr":"g","is_metric":true,"name":"Gram","id":17,"created_by":44,"created_at":"2014-06-17T15:07:10.619Z","updated_by":44,"updated_at":"2014-10-29T09:31:54.369Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"head","is_metric":false,"name":"Head","id":18,"created_by":44,"created_at":"2014-06-17T15:08:17.021Z","updated_by":44,"updated_at":"2014-07-15T06:46:32.905Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"jar","is_metric":false,"name":"Jar","id":19,"created_by":44,"created_at":"2014-06-17T15:08:30.161Z","updated_by":44,"updated_at":"2014-07-15T06:46:42.268Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"keg","is_metric":false,"name":"Keg","id":20,"created_by":44,"created_at":"2014-06-17T15:08:46.902Z","updated_by":44,"updated_at":"2014-07-15T06:47:14.297Z"},{"type":"weight","metric_base":"1000.000000","english_base":"35.274000","abbr":"kg","is_metric":true,"name":"Kilogram","id":21,"created_by":44,"created_at":"2014-06-17T15:09:10.677Z","updated_by":44,"updated_at":"2014-10-29T09:38:09.297Z"},{"type":"volume","metric_base":"1000.000000","english_base":"202.884000","abbr":"l","is_metric":true,"name":"Liter","id":22,"created_by":44,"created_at":"2014-06-17T15:09:27.622Z","updated_by":44,"updated_at":"2014-10-29T09:39:31.334Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"loaf","is_metric":false,"name":"Loaf","id":23,"created_by":44,"created_at":"2014-06-17T15:09:48.278Z","updated_by":44,"updated_at":"2014-07-15T06:48:02.764Z"},{"type":"volume","metric_base":"1.000000","english_base":"0.202884","abbr":"ml","is_metric":true,"name":"Mililiter","id":24,"created_by":44,"created_at":"2014-06-17T15:10:13.286Z","updated_by":44,"updated_at":"2014-10-29T09:36:33.872Z"},{"type":"weight","metric_base":"28.349500","english_base":"1.000000","abbr":"oz","is_metric":false,"name":"Ounce","id":25,"created_by":44,"created_at":"2014-06-17T15:10:32.094Z","updated_by":44,"updated_at":"2014-10-29T09:37:21.233Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"pk","is_metric":false,"name":"Pack","id":26,"created_by":44,"created_at":"2014-06-17T15:10:53.143Z","updated_by":44,"updated_at":"2014-09-17T10:54:29.514Z"},{"type":"volume","metric_base":"473.176000","english_base":"96.000000","abbr":"pt","is_metric":false,"name":"Pint","id":27,"created_by":44,"created_at":"2014-06-17T15:11:11.444Z","updated_by":44,"updated_at":"2014-10-29T09:36:04.400Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"por","is_metric":false,"name":"Portion","id":28,"created_by":44,"created_at":"2014-06-17T19:52:02.568Z","updated_by":44,"updated_at":"2014-10-29T09:04:20.432Z"},{"type":"weight","metric_base":"453.592000","english_base":"16.000000","abbr":"lb","is_metric":false,"name":"Pound","id":1,"created_by":44,"created_at":"2014-06-17T08:24:51.310Z","updated_by":44,"updated_at":"2015-12-21T21:19:40.109Z"},{"type":"volume","metric_base":"946.353000","english_base":"192.000000","abbr":"qt","is_metric":false,"name":"Quart","id":31,"created_by":44,"created_at":"2014-06-17T19:53:50.356Z","updated_by":44,"updated_at":"2014-10-29T09:34:22.399Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"srv","is_metric":false,"name":"Serving","id":33,"created_by":44,"created_at":"2014-06-17T19:54:48.070Z","updated_by":44,"updated_at":"2014-07-15T06:49:52.702Z"},{"type":"volume","metric_base":"14.786800","english_base":"3.000000","abbr":"tbsp","is_metric":false,"name":"Tablespoon","id":34,"created_by":44,"created_at":"2014-06-17T19:55:09.282Z","updated_by":44,"updated_at":"2014-10-29T09:38:47.443Z"},{"type":"volume","metric_base":"4.928920","english_base":"1.000000","abbr":"tsp","is_metric":false,"name":"Teaspoon","id":35,"created_by":44,"created_at":"2014-06-17T19:55:45.634Z","updated_by":44,"updated_at":"2014-10-29T09:39:00.454Z"}]},
    vendors_response: {"count":3,"results":[{"name":"ABC Beers","contact_last_name":"Jones","country":null,"address":"3434 W Reno","phone":"(555) 867-5309","address2":"Apt 5","city":"Oklahoma City","contact_email":"sjones@gmail.com","contact_name":null,"notes":"This is the notes","contact_first_name":"Skippy","zip":"73034","country_id":227,"state":"Oklahoma","is_active":true,"fax":"What is a Fax?","state_id":3491,"id":17,"created_by":44,"created_at":"2015-10-13T20:29:38.593Z","updated_by":44,"updated_at":"2015-12-04T14:03:19.334Z"},{"name":"ABC Foods","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":18,"created_by":44,"created_at":"2015-10-14T00:06:17.806Z","updated_by":null,"updated_at":"2015-10-14T00:06:17.806Z"},{"name":"Some test vendor1","contact_last_name":"Piper","country":"United States","address":"2600 NW 29th St","phone":"4056408232","address2":"apt 77","city":"Oklahoma City","contact_email":"pp@gmail.com","contact_name":null,"notes":"Pie flavor","contact_first_name":"Peter","zip":"73107","country_id":223,"state":"Bugiri District","is_active":true,"fax":"Who has a fax?","state_id":3394,"id":1,"created_by":44,"created_at":"2015-09-08T12:54:53.735Z","updated_by":44,"updated_at":"2015-12-18T17:35:48.748Z"}]},
    items_response: {"count":1,"results":[{"common_unit_cost":"1.03478","description":"","name":"Absolut Cherrykran 00001","report_unit_cost":"34.99000","total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":25,"id":802,"created_by":44,"created_at":"2014-10-31T16:07:27.169Z","updated_by":44,"updated_at":"2015-12-23T13:54:23.780Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":15}]},
    count_items_response: {"count":1,"results":[{"common_unit_quantity":"10.00000","quantity":"10.00000","details_json":null,"id":6170,"created_by":44,"created_at":"2015-11-13T15:23:29.290Z","updated_by":null,"updated_at":"2015-11-13T15:23:29.290Z","location_id":7,"inv_item_id":802,"inv_item_unit_id":2229,"common_unit_id":15,"inv_count_id":104}]},
    item_units_response: {"count":4,"results":[{"is_active":null,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"33.81400","description":"Bottle 1 Ltr","is_report_unit":true,"id":2227,"created_by":44,"created_at":"2014-10-31T16:07:27.397Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.397Z","unit_id":5,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.03704","description":"Gram 0.03704 floz","is_report_unit":false,"id":2228,"created_by":44,"created_at":"2014-10-31T16:07:27.556Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.556Z","unit_id":17,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"1 floz","is_report_unit":false,"id":2229,"created_by":44,"created_at":"2014-10-31T16:07:27.711Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.711Z","unit_id":15,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":false,"pack_size":"","unit_quantity":"2.00000","description":"Bottle 2.00000 floz","is_report_unit":false,"id":3160,"created_by":44,"created_at":"2015-04-16T19:27:21.575Z","updated_by":null,"updated_at":"2015-04-16T19:27:21.575Z","unit_id":5,"common_unit_id":15,"inv_item_id":802}]},
    item_locations_response: {"count":7,"results":[{"starting_cost":"5.00000","last_cost":"17.50000","opening_count_date":null,"is_hot_count":false,"id":1779,"created_by":44,"created_at":"2015-08-28T01:09:39.602Z","updated_by":44,"updated_at":"2015-11-19T16:44:36.970Z","location_id":7,"inv_item_id":802},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":1864,"created_by":44,"created_at":"2015-08-28T01:09:39.791Z","updated_by":null,"updated_at":"2015-08-28T01:09:39.791Z","location_id":10,"inv_item_id":802},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":2116,"created_by":44,"created_at":"2015-08-28T01:09:40.311Z","updated_by":null,"updated_at":"2015-08-28T01:09:40.311Z","location_id":14,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":4017,"created_by":44,"created_at":"2015-10-22T14:25:02.474Z","updated_by":null,"updated_at":"2015-10-22T14:25:02.474Z","location_id":8,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":2886,"created_by":44,"created_at":"2015-10-09T17:56:58.949Z","updated_by":null,"updated_at":"2015-10-09T17:56:58.949Z","location_id":17,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3100,"created_by":44,"created_at":"2015-10-09T17:59:43.819Z","updated_by":null,"updated_at":"2015-10-09T17:59:43.819Z","location_id":12,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3316,"created_by":44,"created_at":"2015-10-09T18:02:03.348Z","updated_by":null,"updated_at":"2015-10-09T18:02:03.348Z","location_id":2,"inv_item_id":802}]},
    item_unit_locations_response:{"count":28,"results":[{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":10774,"created_by":44,"created_at":"2015-10-22T14:25:03.365Z","updated_by":null,"updated_at":"2015-10-22T14:25:03.365Z","location_id":8,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":10772,"created_by":44,"created_at":"2015-10-22T14:25:03.362Z","updated_by":null,"updated_at":"2015-10-22T14:25:03.362Z","location_id":8,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":10771,"created_by":44,"created_at":"2015-10-22T14:25:03.361Z","updated_by":null,"updated_at":"2015-10-22T14:25:03.361Z","location_id":8,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":10770,"created_by":44,"created_at":"2015-10-22T14:25:03.361Z","updated_by":null,"updated_at":"2015-10-22T14:25:03.361Z","location_id":8,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8738,"created_by":44,"created_at":"2015-10-09T18:02:04.158Z","updated_by":null,"updated_at":"2015-10-09T18:02:04.158Z","location_id":2,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8737,"created_by":44,"created_at":"2015-10-09T18:02:04.158Z","updated_by":null,"updated_at":"2015-10-09T18:02:04.158Z","location_id":2,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8736,"created_by":44,"created_at":"2015-10-09T18:02:04.158Z","updated_by":null,"updated_at":"2015-10-09T18:02:04.158Z","location_id":2,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8735,"created_by":44,"created_at":"2015-10-09T18:02:04.154Z","updated_by":null,"updated_at":"2015-10-09T18:02:04.154Z","location_id":2,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8164,"created_by":44,"created_at":"2015-10-09T17:59:44.511Z","updated_by":null,"updated_at":"2015-10-09T17:59:44.511Z","location_id":12,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8163,"created_by":44,"created_at":"2015-10-09T17:59:44.510Z","updated_by":null,"updated_at":"2015-10-09T17:59:44.510Z","location_id":12,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8162,"created_by":44,"created_at":"2015-10-09T17:59:44.510Z","updated_by":null,"updated_at":"2015-10-09T17:59:44.510Z","location_id":12,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":8161,"created_by":44,"created_at":"2015-10-09T17:59:44.510Z","updated_by":null,"updated_at":"2015-10-09T17:59:44.510Z","location_id":12,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":7590,"created_by":44,"created_at":"2015-10-09T17:56:59.919Z","updated_by":null,"updated_at":"2015-10-09T17:56:59.919Z","location_id":17,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":7589,"created_by":44,"created_at":"2015-10-09T17:56:59.919Z","updated_by":null,"updated_at":"2015-10-09T17:56:59.919Z","location_id":17,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":7588,"created_by":44,"created_at":"2015-10-09T17:56:59.914Z","updated_by":null,"updated_at":"2015-10-09T17:56:59.914Z","location_id":17,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":7587,"created_by":44,"created_at":"2015-10-09T17:56:59.914Z","updated_by":null,"updated_at":"2015-10-09T17:56:59.914Z","location_id":17,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4967,"created_by":44,"created_at":"2015-08-28T01:09:42.420Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.420Z","location_id":7,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4969,"created_by":44,"created_at":"2015-08-28T01:09:42.425Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.425Z","location_id":14,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4970,"created_by":44,"created_at":"2015-08-28T01:09:42.426Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.426Z","location_id":10,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4973,"created_by":44,"created_at":"2015-08-28T01:09:42.432Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.432Z","location_id":10,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4976,"created_by":44,"created_at":"2015-08-28T01:09:42.433Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.433Z","location_id":7,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4977,"created_by":44,"created_at":"2015-08-28T01:09:42.439Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.439Z","location_id":7,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4978,"created_by":44,"created_at":"2015-08-28T01:09:42.439Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.439Z","location_id":14,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4979,"created_by":44,"created_at":"2015-08-28T01:09:42.444Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.444Z","location_id":14,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4980,"created_by":44,"created_at":"2015-08-28T01:09:42.444Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.444Z","location_id":10,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4983,"created_by":44,"created_at":"2015-08-28T01:09:42.450Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.450Z","location_id":10,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4986,"created_by":44,"created_at":"2015-08-28T01:09:42.451Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.451Z","location_id":7,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4988,"created_by":44,"created_at":"2015-08-28T01:09:42.457Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.457Z","location_id":14,"inv_item_unit_id":3160,"inv_item_id":802}]},
    event_items_response: {"count":1,"results":[{"common_unit_quantity":"10.00000","cost":"175.00000","quantity":"5.00000","id":182,"created_by":44,"created_at":"2015-11-19T16:44:32.718Z","updated_by":null,"updated_at":"2015-11-19T16:44:32.718Z","location_id":7,"inv_event_id":79,"inv_item_unit_id":3160,"inv_item_id":802,"common_unit_id":15}]},
    recipe_items_response: {"count":0,"results":[]},
    invoice_items_response: {"count":1,"results":[{"extended_price":"175.00000","unit_price":"35.00000","quantity":"5.000","id":201,"created_by":44,"created_at":"2015-11-19T16:44:32.562Z","updated_by":44,"updated_at":"2015-11-19T16:44:36.524Z","location_id":7,"vendor_id":1,"vendor_inventory_item_id":74,"inv_item_id":802,"inv_event_item_id":182,"invoice_id":73}]},
    vendor_items_response: {"count":1,"results":[{"last_price":"35.00000","number":"3334","pack_size":null,"description":"aaa","is_active":true,"last_price_on":"2015-11-16","id":74,"created_by":44,"created_at":"2015-11-13T15:14:01.362Z","updated_by":44,"updated_at":"2015-11-19T16:44:33.541Z","vendor_id":1,"inv_item_id":802,"inv_item_unit_id":3160}]},
    items_db_items_response: {"count":1,"results":[{"id":25,"name":"Absolut Cherrykran"}]},
    settings: {
      recipe_items          : {
        key           : 'wtm_recipe_items',
        default_data  : {}
      }
    },
    permissions                 : {
      'edit_items' : true
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
    ]
  };

  // helper local variables
  var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub, mockedDataCopy;
  // controller injectables
  var $location, $mdDialog, $timeout, $peach, $q, cakeCommon, cakeCountGroups, cakeCountItems, cakeEventItems, cakeGLAccounts, cakeInvoiceItems, cakeItems, cakeItemsDBItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeSharedData, cakeUnits, cakeVendors, cakeVendorItems;

  // initialize app module
  beforeEach(module('cakeApp'));

    
  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

    $location = $injector.get('$location');
    $mdDialog = $injector.get('$mdDialog');
    $timeout = $injector.get('$timeout');
    $peach = $injector.get('$peach');
    $q = $injector.get('$q');

    cakeCommon = {
      isUserAccountAdmin: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return editItemControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      },
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
        return editItemControllerTestsMockedData.float_regex;
      },
      uppercaseWord: function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      },
      getObjectKey: function(key) {
        return editItemControllerTestsMockedData.settings[key]['key'];
      }
    };

    cakeCountGroups = {
      loadCountGroups: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getCountGroups: function() {
        return editItemControllerTestsMockedData.count_groups_response.results;
      },
      getCountGroupsCollection: function() {
        return _.object(_.pluck(editItemControllerTestsMockedData.count_groups_response.results, 'id'), editItemControllerTestsMockedData.count_groups_response.results);
      }
    };
    
    cakeCountItems = {
      loadCountItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.count_items_response);
        return deferred.promise;
      }
    };
    
    cakeEventItems = {
      loadEventItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.event_items_response);
        return deferred.promise;
      }
    };
    
    cakeGLAccounts = {
      loadGLAccounts: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.gl_accounts_response);
        return deferred.promise;
      },
      getGLAccounts: function() {
        return editItemControllerTestsMockedData.gl_accounts_response.results;
      },
      getGLAccountsCollection: function() {
        return _.object(_.pluck(editItemControllerTestsMockedData.gl_accounts_response.results, 'id'), editItemControllerTestsMockedData.count_groups_response.results);
      }
    };
    
    cakeInvoiceItems = {
      loadInvoiceItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.invoice_items_response);
        return deferred.promise;
      }
    };
    
    cakeItems = {
      loadItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.items_response);
        return deferred.promise;
      },
      updateItem: function(itemData) {
        var deferred = $q.defer();
        deferred.resolve(itemData);
        return deferred.promise;
      },
      removeItem: function(itemId) {
        var deferred = $q.defer();
        deferred.resolve(true);
        return deferred.promise;
      },
      canItemBeDeleted: function(itemId) {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.can_item_be_deleted);
        return deferred.promise;
      },
      canItemCommonUnitBeChanged: function(itemId) {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.can_item_common_unit_be_changed);
        return deferred.promise;
      }
    };
    
    cakeItemsDBItems = {
      getData: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.items_db_items_response);
        return deferred.promise;
      }
    };
    
    cakeItemLocations = {
      loadItemLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.item_locations_response);
        return deferred.promise;
      },
      bulkCreateItemLocations: function(data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      },
      bulkDeleteItemLocations: function(data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      }
    };
    
    cakeItemUnits = {
      loadItemUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.item_units_response);
        return deferred.promise;
      },
      createItemUnit: function(itemUnitData) {
        var deferred = $q.defer();
        deferred.resolve(itemUnitData);
        return deferred.promise;
      },
      updateItemUnit: function(itemUnitData) {
        var deferred = $q.defer();
        deferred.resolve(itemUnitData);
        return deferred.promise;
      },
      removeItemUnit: function(itemUnitId) {
        var deferred = $q.defer();
        deferred.resolve(true);
        return deferred.promise;
      }
    };
    
    cakeItemUnitLocations = {
      loadItemUnitLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.item_unit_locations_response);
        return deferred.promise;
      },
      bulkCreateItemUnitLocations: function(data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      },
      bulkDeleteItemUnitLocations: function(data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      }
    };
    
    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };
    
    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData[settingKey]);
        return deferred.promise;
      },
      refreshSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData[settingKey]);
        return deferred.promise;
      }
    };
    
    cakeSharedData = {};
    
    cakeUnits = {
      loadUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.units_response);
        return deferred.promise;
      },
      getUnits: function() {
        return editItemControllerTestsMockedData.units_response.results;
      },
      getUnitsCollection: function() {
        return _.object(_.pluck(editItemControllerTestsMockedData.units_response.results, 'id'), editItemControllerTestsMockedData.units_response.results);
      }
    };
    
    cakeVendors = {
      loadVendors: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.vendors_response);
        return deferred.promise;
      },
      getVendors: function() {
        return editItemControllerTestsMockedData.vendors_response.results;
      },
      getVendorsCollection: function() {
        return _.object(_.pluck(editItemControllerTestsMockedData.vendors_response.results, 'id'), editItemControllerTestsMockedData.vendors_response.results);
      }
    };
    
    cakeVendorItems = {
      loadVendorItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editItemControllerTestsMockedData.vendor_items_response);
        return deferred.promise;
      },
      createVendorItem: function(vendorItemData) {
        var deferred = $q.defer();
        deferred.resolve(vendorItemData);
        return deferred.promise;
      },
      updateVendorItem: function(vendorItemData) {
        var deferred = $q.defer();
        deferred.resolve(vendorItemData);
        return deferred.promise;
      },
      removeVendorItem: function(vendorItemId) {
        var deferred = $q.defer();
        deferred.resolve(true);
        return deferred.promise;
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'edit_item.js as vm',
      {
        '$scope': controllerScope,
        '$location': $location,
        '$mdDialog': $mdDialog,
        '$timeout': $timeout,
        '$peach': $peach,
        '$q': $q,
        'cakeCommon': cakeCommon,
        'cakeCountGroups': cakeCountGroups,
        'cakeCountItems': cakeCountItems,
        'cakeEventItems': cakeEventItems,
        'cakeGLAccounts': cakeGLAccounts,
        'cakeInvoiceItems': cakeInvoiceItems,
        'cakeItems': cakeItems,
        'cakeItemsDBItems': cakeItemsDBItems,
        'cakeItemLocations': cakeItemLocations,
        'cakeItemUnits': cakeItemUnits,
        'cakeItemUnitLocations': cakeItemUnitLocations,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings,
        'cakeSharedData': cakeSharedData,
        'cakeUnits': cakeUnits,
        'cakeVendors': cakeVendors,
        'cakeVendorItems': cakeVendorItems
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});
    
    mockedDataCopy = angular.copy(editItemControllerTestsMockedData);

  }));

  afterEach(function() {

    sandbox.restore();
    editItemControllerTestsMockedData = mockedDataCopy;

  });

  describe('Constructor', function() {

    it('should construct Edit Item Controller', function() {

      expect(controllerScope.vm.$location).to.exist;
      expect(controllerScope.vm.$mdDialog).to.exist;
      expect(controllerScope.vm.$timeout).to.exist;
      expect(controllerScope.vm.$peach).to.exist;
      expect(controllerScope.vm.$q).to.exist;
      expect(controllerScope.vm.cakeCommon).to.exist;
      expect(controllerScope.vm.cakeCountGroups).to.exist;
      expect(controllerScope.vm.cakeCountItems).to.exist;
      expect(controllerScope.vm.cakeEventItems).to.exist;
      expect(controllerScope.vm.cakeGLAccounts).to.exist;
      expect(controllerScope.vm.cakeInvoiceItems).to.exist;
      expect(controllerScope.vm.cakeItems).to.exist;
      expect(controllerScope.vm.cakeItemsDBItems).to.exist;
      expect(controllerScope.vm.cakeItemLocations).to.exist;
      expect(controllerScope.vm.cakeItemUnits).to.exist;
      expect(controllerScope.vm.cakeItemUnitLocations).to.exist;
      expect(controllerScope.vm.cakePermissions).to.exist;
      expect(controllerScope.vm.cakeSettings).to.exist;
      expect(controllerScope.vm.cakeSharedData).to.exist;
      expect(controllerScope.vm.cakeUnits).to.exist;
      expect(controllerScope.vm.cakeVendors).to.exist;
      expect(controllerScope.vm.cakeVendorItems).to.exist;

      expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'initializing']);

      expect(controllerScope.vm.editedItem).to.deep.equal(
        {
          data          : null,
          form_data     : {},
          items_db_item : null,
          locations     : {
            checked_locations : [],
            data_array        : [],
            data_collection   : {}
          },
          units         : {
            data_array                : [],
            common_unit               : null,
            reporting_unit            : null,
            available_reporting_units : [],
            new_unit_form             : {
              show_form                 : false,
              disable_conversion        : false
            }
          },
          vendors       : {
            data_array                : [],
            new_vendor_form           : {
              show_form                 : false
            },
            edited_vendor_form_data   : {}
          }
        }
      );
      
      expect(controllerScope.vm.tabs).to.contain.all.keys(['activeTab', 'availableTabs']);
      expect(controllerScope.vm.tabs['activeTab']).to.equal(null);
      expect(controllerScope.vm.tabs['availableTabs'].length).to.equal(4);
      expect(controllerScope.vm.tabs['availableTabs'][0]['title']).to.equal('ITEM INFO');
      expect(controllerScope.vm.tabs['availableTabs'][0]['template']).to.equal('itemInfoTabTemplate');
      expect(controllerScope.vm.tabs['availableTabs'][0]['deselectCallback']).to.be.a('function');
      expect(controllerScope.vm.tabs['availableTabs'][0]['visible']).to.equal(true);
      expect(controllerScope.vm.tabs['availableTabs'][1]['title']).to.equal('UNITS OF MEASURE');
      expect(controllerScope.vm.tabs['availableTabs'][1]['template']).to.equal('itemUnitsTabTemplate');
      expect(controllerScope.vm.tabs['availableTabs'][1]['deselectCallback']).to.equal(controllerScope.vm.closeNewItemUnitForm);
      expect(controllerScope.vm.tabs['availableTabs'][1]['visible']).to.equal(true);
      expect(controllerScope.vm.tabs['availableTabs'][2]['title']).to.equal('VENDORS');
      expect(controllerScope.vm.tabs['availableTabs'][2]['template']).to.equal('itemVendorsTabTemplate');
      expect(controllerScope.vm.tabs['availableTabs'][2]['deselectCallback']).to.equal(controllerScope.vm.closeNewItemVendorForm);
      expect(controllerScope.vm.tabs['availableTabs'][2]['visible']).to.equal(true);
      expect(controllerScope.vm.tabs['availableTabs'][3]['title']).to.equal('LOCATIONS');
      expect(controllerScope.vm.tabs['availableTabs'][3]['template']).to.equal('itemLocationsTabTemplate');
      expect(controllerScope.vm.tabs['availableTabs'][3]['deselectCallback']).to.be.a('function');
      expect(controllerScope.vm.tabs['availableTabs'][3]['visible']).to.equal(false);
      
      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.cakeFloatPattern).to.equal(editItemControllerTestsMockedData.float_regex);
      expect(controllerScope.vm.canChangeCommonUnit).to.equal(false);
      expect(controllerScope.vm.canDeleteItem).to.equal(false);
      expect(controllerScope.vm.canEditItem).to.equal(false);
      expect(controllerScope.vm.countGroups).to.deep.equal([]);
      expect(controllerScope.vm.countGroupsById).to.deep.equal({});
      expect(controllerScope.vm.countItems).to.deep.equal([]);
      expect(controllerScope.vm.eventItems).to.deep.equal([]);
      expect(controllerScope.vm.forms).to.deep.equal({});
      expect(controllerScope.vm.glAccounts).to.deep.equal([]);
      expect(controllerScope.vm.glAccountsById).to.deep.equal({});
      expect(controllerScope.vm.itemUnitLocations).to.deep.equal([]);
      expect(controllerScope.vm.itemUnitLocationsByLocationIdAndItemUnitId).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.recipeItems).to.deep.equal([]);
      expect(controllerScope.vm.relatedInvoiceItems).to.deep.equal([]);
      expect(controllerScope.vm.units).to.deep.equal([]);
      expect(controllerScope.vm.unitsById).to.deep.equal({});
      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});
      expect(controllerScope.vm.vendorItems).to.deep.equal([]);
      expect(controllerScope.vm.vendors).to.deep.equal([]);
      expect(controllerScope.vm.vendorsById).to.deep.equal({});

    });

  });

  describe('Activate function', function() {

    it('should always set up common controller properties', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
      var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
      var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
      
      controllerScope.vm.activate();

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeVendorsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(controllerScope.vm.blockers.initializing).to.equal(true);

      $rootScope.$digest();
      
      expect(controllerScope.vm.activeLocations).to.equal(editItemControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(editItemControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.countGroups).to.equal(editItemControllerTestsMockedData.count_groups_response.results);
      expect(_.keys(controllerScope.vm.countGroupsById).length).to.equal(editItemControllerTestsMockedData.count_groups_response.results.length);
      expect(controllerScope.vm.glAccounts).to.equal(editItemControllerTestsMockedData.gl_accounts_response.results);
      expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editItemControllerTestsMockedData.gl_accounts_response.results.length);
      expect(controllerScope.vm.vendors).to.equal(editItemControllerTestsMockedData.vendors_response.results);
      expect(_.keys(controllerScope.vm.vendorsById).length).to.equal(editItemControllerTestsMockedData.vendors_response.results.length);
      expect(controllerScope.vm.units).to.equal(editItemControllerTestsMockedData.units_response.results);
      expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editItemControllerTestsMockedData.units_response.results.length);
      expect(controllerScope.vm.isDeveloperMode).to.equal(editItemControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.blockers.initializing).to.equal(false);
    
    });
    
    describe('activate should set up extended controller properties scenarios', function() {
      
      it('no id in url scenario', function() {
        
        var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
        
        controllerScope.vm.activate();
        $rootScope.$digest();
        
        expect(spyErrorHandler.calledWithExactly('ID of the item to edit was not specified.')).to.equal(true);
        expect(controllerScope.vm.canChangeCommonUnit).to.equal(false);
        expect(controllerScope.vm.canDeleteItem).to.equal(false);
        expect(controllerScope.vm.canEditItem).to.equal(false);
        expect(controllerScope.vm.blockers.initializing).to.equal(false);
      
      });
      
      it('incorrect id in url scenario', function() {
        
        var testId = 999;
        var deferred1 = $q.defer();
            deferred1.resolve({"count":0,"results":[]});
        var stubCakeItemsLoad = sandbox.stub(controllerScope.vm.cakeItems, 'loadItems', function() { return deferred1.promise; });
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
        
        controllerScope.vm.activate();
        $rootScope.$digest();
        
        expect(stubCakeItemsLoad.calledWithExactly({id: testId}, null, true)).to.equal(true);
        expect(spyErrorHandler.calledWithExactly('Couldn\'t load item with given ID: ' + testId + '.')).to.equal(true);
        expect(controllerScope.vm.canChangeCommonUnit).to.equal(false);
        expect(controllerScope.vm.canDeleteItem).to.equal(false);
        expect(controllerScope.vm.canEditItem).to.equal(false);
        expect(controllerScope.vm.blockers.initializing).to.equal(false);
      
      });
      
      it('api error when loading extended data scenario', function() {
        
        var testId = editItemControllerTestsMockedData.items_response.results[0]['id'];
        var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
        var spyCakeCommonUserAdmin = sandbox.stub(controllerScope.vm.cakeCommon, 'isUserAccountAdmin', function() {
          var deferred = $q.defer();
          deferred.reject('api error');
          return deferred.promise;
        });
        
        controllerScope.vm.activate();
        $rootScope.$digest();
        
        expect(spyCakeItemsLoad.calledWithExactly({id: testId}, null, true)).to.equal(true);
        expect(spyErrorHandler.calledWithExactly('api error')).to.equal(true);
        expect(controllerScope.vm.canChangeCommonUnit).to.equal(false);
        expect(controllerScope.vm.canDeleteItem).to.equal(false);
        expect(controllerScope.vm.canEditItem).to.equal(false);
        expect(controllerScope.vm.blockers.initializing).to.equal(false);
      
      });
      
      it('api success when loading extended data scenario', function() {
        
        $rootScope.$digest();

        controllerScope.vm.$peach = {
          api: function() {
            return {
              find: function() {
                var  deferred = $q.defer();
                deferred.resolve(editItemControllerTestsMockedData.recipe_items_response);
                return deferred.promise;
              }
            };
          }
        };
        var testId = editItemControllerTestsMockedData.items_response.results[0]['id'];
        var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
        var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
        
        var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
        var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
        var spyCanItemBeDeleted = sandbox.spy(controllerScope.vm.cakeItems, 'canItemBeDeleted');
        var spyCanItemUnitBeChanged = sandbox.spy(controllerScope.vm.cakeItems, 'canItemCommonUnitBeChanged');
        var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
        var spyCakeItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
        var spyCakeItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');
        var spyCakeItemUnitLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'loadItemUnitLocations');
        var spyCakeCountItemsLoad = sandbox.spy(controllerScope.vm.cakeCountItems, 'loadCountItems');
        var spyCakeEventItemsLoad = sandbox.spy(controllerScope.vm.cakeEventItems, 'loadEventItems');
        var spyCakeVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
        var spyCakeItemsDBItemsLoad = sandbox.spy(controllerScope.vm.cakeItemsDBItems, 'getData');
        var spyCakeInvoiceItemsLoad = sandbox.spy(controllerScope.vm.cakeInvoiceItems, 'loadInvoiceItems');
        
        controllerScope.vm.activate();
        $rootScope.$digest();

        expect(controllerScope.vm.editedItem.data).to.deep.equal(editItemControllerTestsMockedData.items_response.results[0]);
        expect(_.omit(controllerScope.vm.editedItem.form_data, 'reporting_unit_key')).to.deep.equal(editItemControllerTestsMockedData.items_response.results[0]);
        
        expect(controllerScope.vm.editedItem.data.gl_account_id).not.to.equal(null);
        expect(controllerScope.vm.editedItem.data.count_group_id).not.to.equal(null);
        expect(controllerScope.vm.editedItem.data.common_unit_id).not.to.equal(null);
        
        expect(spyCakeCommonUserAdmin.called).to.equal(true);
        expect(spyCakePermissions.calledWithExactly('edit_items')).to.equal(true);
        expect(spyCanItemBeDeleted.calledWithExactly(testId)).to.equal(true);
        expect(spyCanItemUnitBeChanged.calledWithExactly(testId)).to.equal(true);
        
        expect(controllerScope.vm.canChangeCommonUnit).to.equal(editItemControllerTestsMockedData.can_item_common_unit_be_changed);
        expect(controllerScope.vm.canDeleteItem).to.equal(editItemControllerTestsMockedData.can_item_be_deleted);
        expect(controllerScope.vm.canEditItem).to.equal(editItemControllerTestsMockedData.permissions.edit_items);
        expect(controllerScope.vm.isAccountAdmin).to.equal(editItemControllerTestsMockedData.is_user_account_admin);
        
        expect(spyCakeItemLocationsLoad.calledWithExactly(
          {
            '$and': [
              {
                'location_id': _.pluck(editItemControllerTestsMockedData.active_locations, 'id')
              },
              {
                'inv_item_id': testId
              }
            ]
          }
        )).to.equal(true);
        expect(spyCakeItemUnitsLoad.calledWithExactly({'inv_item_id': testId})).to.equal(true);
        expect(spyCakeItemUnitLocationsLoad.calledWithExactly({'inv_item_id': testId})).to.equal(true);
        expect(spyCakeCountItemsLoad.calledWithExactly({'inv_item_id': testId})).to.equal(true);
        expect(spyCakeEventItemsLoad.calledWithExactly({'inv_item_id': testId})).to.equal(true);
        expect(spyCakeVendorItemsLoad.calledWithExactly({'inv_item_id': testId})).to.equal(true);
        expect(spyCakeItemsDBItemsLoad.calledWithExactly(
          {
            'id': editItemControllerTestsMockedData.items_response.results[0]['item_db_id']
          },
          {
            'fields'  : 'id,name'
          }
        )).to.equal(true);
        
        expect(controllerScope.vm.countItems).to.deep.equal(editItemControllerTestsMockedData.count_items_response.results);
        expect(controllerScope.vm.eventItems).to.deep.equal(editItemControllerTestsMockedData.event_items_response.results);
        expect(controllerScope.vm.recipeItems).to.deep.equal(editItemControllerTestsMockedData.recipe_items_response.results);
        expect(controllerScope.vm.vendorItems).to.deep.equal(editItemControllerTestsMockedData.vendor_items_response.results);
        expect(controllerScope.vm.itemUnitLocations).to.deep.equal(editItemControllerTestsMockedData.item_unit_locations_response.results);
        expect(controllerScope.vm.editedItem.items_db_item).to.deep.equal(editItemControllerTestsMockedData.items_db_items_response.results[0]);
        
        expect(controllerScope.vm.itemUnitLocationsByLocationIdAndItemUnitId[12]).to.deep.equal(
          {
            2227: 8161,
            2228: 8162,
            2229: 8163,
            3160: 8164
          }
        );

        expect(spyCakeInvoiceItemsLoad.calledWithExactly({'vendor_inventory_item_id': [editItemControllerTestsMockedData.vendor_items_response.results[0]['id']]}, null, true)).to.equal(true);
        expect(controllerScope.vm.relatedInvoiceItems).to.deep.equal(editItemControllerTestsMockedData.invoice_items_response.results);
        expect(controllerScope.vm.tabs.availableTabs[3]['visible']).to.equal(false);
        //parsing units,locations and vendor items in loadAdditionalItemData
        
        expect(spyErrorHandler.called).to.equal(false);
        expect(controllerScope.vm.blockers.initializing).to.equal(false);
      
      });
      
    });

  }); 

  describe('Functions', function() {
    
    it('TODO: addNewItemUnit', function() {
      
      // TODO
      
    });
    
    it('TODO: addNewItemVendor', function() {
      
      // TODO
      
    });
    
    it('TODO: autoCalculateConversionForNewUnit', function() {
      
      // TODO
      
    });
    
    it('TODO: calculateConversionAndChangeCommonUnit', function() {
      
      // TODO
      
    });
    
    it('TODO: calculateConversionAndChangeReportingUnit', function() {
      
      // TODO
      
    });
    
    it('cancelCommonUnitIdUpdate should reset common unit and cancel api processing', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.blockers.api_processing = true;
      controllerScope.vm.editedItem.data = {common_unit_id: 999};
      
      controllerScope.vm.cancelCommonUnitIdUpdate();
      
      expect(controllerScope.vm.editedItem.form_data.common_unit_id).to.equal(999);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      
    });
    
    it('cancelReportingUnitIdUpdate should reset reporting unit and cancel api processing', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.blockers.api_processing = true;
      controllerScope.vm.editedItem.units.reporting_unit = {reporting_unit_key: 'test'};
      
      controllerScope.vm.cancelReportingUnitIdUpdate();
      
      expect(controllerScope.vm.editedItem.form_data.reporting_unit_key).to.equal('test');
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      
    });
    
    it('TODO: changeCommonUnit', function() {
      
      // TODO
      
    });
    
    it('TODO: changeReportingUnit', function() {
      
      // TODO
      
    });
    
    it('TODO: checkForDuplicateVendorItem', function() {
      
      // TODO
      
    });
    
    it('closeEditItemVendorForm should close all edited vendor items and reset edited vendor item form', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.editedItem.vendors.edited_vendor_form_data = {test: 'some junk'};
      controllerScope.vm.editedItem.vendors.data_array = [{is_edited: true}, {is_edited: false}];
      
      controllerScope.vm.closeEditItemVendorForm();
      
      expect(controllerScope.vm.editedItem.vendors.edited_vendor_form_data).to.deep.equal({});
      expect(controllerScope.vm.editedItem.vendors.data_array[0]['is_edited']).to.equal(false);
      expect(controllerScope.vm.editedItem.vendors.data_array[1]['is_edited']).to.equal(false);
      
    });
    
    it('closeNewItemUnitForm should reset new item unit form if it was opened, and close it', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.editedItem.units.new_unit_form.unit_id = 5;
      controllerScope.vm.editedItem.units.new_unit_form.show_form = false;
      controllerScope.vm.closeNewItemUnitForm();
      expect(controllerScope.vm.editedItem.units.new_unit_form.unit_id).to.equal(5);
      
      controllerScope.vm.editedItem.units.new_unit_form.unit_id = 5;
      controllerScope.vm.editedItem.units.new_unit_form.show_form = true;
      controllerScope.vm.closeNewItemUnitForm();
      expect(controllerScope.vm.editedItem.units.new_unit_form.unit_id).to.equal(null);
      expect(controllerScope.vm.editedItem.units.new_unit_form.unit_quantity).to.equal(null);
      expect(controllerScope.vm.editedItem.units.new_unit_form.description).to.equal(null);
      expect(controllerScope.vm.editedItem.units.new_unit_form.available_units).to.deep.equal([]);
      expect(controllerScope.vm.editedItem.units.new_unit_form.disable_conversion).to.equal(false);
      expect(controllerScope.vm.editedItem.units.new_unit_form.show_form).to.equal(false);
      
    });
    
    it('closeNewItemVendorForm should reset new item vendor form if it was opened, and close it', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.editedItem.vendors.new_vendor_form.vendor_id = 5;
      controllerScope.vm.editedItem.vendors.new_vendor_form.show_form = false;
      controllerScope.vm.closeNewItemVendorForm();
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.vendor_id).to.equal(5);
      
      controllerScope.vm.editedItem.vendors.new_vendor_form.vendor_id = 5;
      controllerScope.vm.editedItem.vendors.new_vendor_form.show_form = true;
      controllerScope.vm.closeNewItemVendorForm();
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.vendor_id).to.equal(null);
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.description).to.equal(null);
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.number).to.equal(null);
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.inv_item_unit_id).to.equal(null);
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.last_price).to.equal(null);
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.show_form).to.equal(false);
      
    });
    
    it('confirmDeleteItem should display modal dialog', function() {
      
      controllerScope.$digest();
      
      var spyModalShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');
      
      controllerScope.vm.confirmDeleteItem();

      expect(spyModalShow.called).to.equal(true);
      
    });
    
    it('countGroupsFilter should recognize if given count group is active or assigned to item or not', function() {
      
      controllerScope.$digest();
      
      var testCountGroup = {
        is_active: false,
        id: 1
      };
      
      controllerScope.vm.editedItem.form_data.count_group_id = 10;
      expect(controllerScope.vm.countGroupsFilter(testCountGroup)).to.equal(false);
      
      controllerScope.vm.editedItem.form_data.count_group_id = 1;
      expect(controllerScope.vm.countGroupsFilter(testCountGroup)).to.equal(true);
      
      controllerScope.vm.editedItem.form_data.count_group_id = 10;
      testCountGroup.is_active = true
      expect(controllerScope.vm.countGroupsFilter(testCountGroup)).to.equal(true);
      
    });
    
    it('TODO: deleteItem', function() {
      
      // TODO
      
    });
    
    it('TODO: deleteItemUnit', function() {
      
      // TODO
      
    });
    
    it('TODO: deleteItemVendor', function() {
      
      // TODO
      
    });
    
    it('TODO: editedItemVendorUnitDropdownCallback', function() {
      
      // TODO
      
    });
    
    it('goBack should redirect to main items page', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.goBack();
      
      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/items');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');
      
    });
    
    it('nameBlurCallback should restore original item name if it was erased', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.editedItem.form_data.name = 'test updated';
      controllerScope.vm.editedItem.data = {name: 'test'};
      controllerScope.vm.nameBlurCallback();
      expect(controllerScope.vm.editedItem.form_data.name).not.to.equal(controllerScope.vm.editedItem.data.name);
      
      controllerScope.vm.editedItem.form_data.name = '';
      controllerScope.vm.nameBlurCallback();
      expect(controllerScope.vm.editedItem.form_data.name).to.equal(controllerScope.vm.editedItem.data.name);
      
    });
    
    it('TODO: nameChangeCallback', function() {
      
      // TODO
      
    });
    
    it('TODO: newItemVendorUnitDropdownCallback', function() {
      
      // TODO
      
    });
    
    it('openEditItemVendorForm should close other opened vendor item forms and open form for given vendor item', function() {
      
      controllerScope.$digest();
      
      var testData = {
        'vendor': null,
        'name': 'test',
        'unit': null,
        'unit_description': 'test desc',
        'id': 5,
        'inv_item_unit_id': 3,
        'last_price': 5,
        'is_edited': false
      };
      var spyCloseNewItemVendorForm = sandbox.spy(controllerScope.vm, 'closeNewItemVendorForm');
      var spyCloseEditItemVendorForm = sandbox.spy(controllerScope.vm, 'closeEditItemVendorForm');
      
      controllerScope.vm.openEditItemVendorForm(testData);

      expect(_.omit(controllerScope.vm.editedItem.vendors.edited_vendor_form_data, 'is_edited')).to.deep.equal(_.extend({}, _.omit(angular.copy(testData), ['vendor', 'name', 'unit', 'unit_description', 'is_edited']), {'new_last_price': 5}));
      expect(testData.is_edited).to.equal(true);
      expect(spyCloseNewItemVendorForm.called).to.equal(true);
      expect(spyCloseEditItemVendorForm.called).to.equal(true);
      
    });
    
    it('openItemUnitsPage should redirect to item units page', function() {
      
      controllerScope.$digest();
      
      controllerScope.vm.openItemUnitsPage();
      
      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/item_units');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');
      
    });
    
    it('openNewItemUnitForm should prepare available units and display form', function() {
      
      controllerScope.$digest();
      
      var spyNewUnitsParse = sandbox.spy(controllerScope.vm, 'prepareNewItemUnitAvailableUnits');
      
      controllerScope.vm.openNewItemUnitForm();
      
      expect(spyNewUnitsParse.called).to.equal(true);
      
      expect(controllerScope.vm.editedItem.units.new_unit_form.available_units.length).to.equal(editItemControllerTestsMockedData.units_response.count);
      expect(controllerScope.vm.editedItem.units.new_unit_form.show_form).to.equal(true);
      
    });
    
    it('openNewItemVendorForm should turn off any vendor items edit forms and show up new vendor item form', function() {
      
      controllerScope.$digest();
      
      var spyEditVendorFormClose = sandbox.spy(controllerScope.vm, 'closeEditItemVendorForm');
      
      controllerScope.vm.openNewItemVendorForm();
      
      expect(spyEditVendorFormClose.called).to.equal(true);
      expect(controllerScope.vm.editedItem.vendors.new_vendor_form.show_form).to.equal(true);
      
    });
    
    it('TODO: prepareNewItemUnitAvailableUnits', function() {
      
      // TODO
      
    });
    
    it('TODO: saveItem', function() {
      
      // TODO
      
    });
    
    it('TODO: updateEditedItemVendor', function() {
      
      // TODO
      
    });
    
    it('TODO: updateItemUnitDescription', function() {
      
      // TODO
      
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