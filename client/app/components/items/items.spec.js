describe("Controller: Items", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var itemsControllerTestsMockedData = {
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    new_object_default_id       : 888,
    count_groups_response       : {"count":11,"results":[{"schedule_days":null,"next_date":"2015-08-30","start_date":"2015-08-23","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"Default count group","name":"A","id":65,"created_by":44,"created_at":"2015-07-20T13:54:14.714Z","updated_by":44,"updated_at":"2015-08-28T13:10:34.290Z"},{"schedule_days":null,"next_date":"2015-09-27","start_date":"2015-09-13","is_active":false,"is_default":false,"schedule_interval":2,"schedule_type":"week","description":"","name":"Order","id":75,"created_by":44,"created_at":"2015-07-28T14:12:07.167Z","updated_by":44,"updated_at":"2015-09-14T13:40:00.823Z"},{"schedule_days":null,"next_date":"2015-09-01","start_date":"2015-08-01","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"month","description":"","name":"Group Aug 4th","id":80,"created_by":44,"created_at":"2015-08-04T16:58:57.582Z","updated_by":null,"updated_at":"2015-08-04T16:58:57.582Z"},{"schedule_days":null,"next_date":"2015-08-09","start_date":"2015-08-02","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"IPad","id":81,"created_by":44,"created_at":"2015-08-04T17:01:41.824Z","updated_by":null,"updated_at":"2015-08-04T17:01:41.824Z"},{"schedule_days":null,"next_date":"2015-09-27","start_date":"2015-09-13","is_active":false,"is_default":false,"schedule_interval":2,"schedule_type":"week","description":"","name":"New","id":82,"created_by":44,"created_at":"2015-08-09T11:22:23.995Z","updated_by":44,"updated_at":"2015-09-17T11:35:19.300Z"},{"schedule_days":null,"next_date":"2016-02-01","start_date":"2015-10-01","is_active":true,"is_default":false,"schedule_interval":4,"schedule_type":"month","description":null,"name":"B","id":67,"created_by":44,"created_at":"2015-07-20T14:00:29.343Z","updated_by":44,"updated_at":"2015-11-18T19:31:29.414Z"},{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":true,"schedule_interval":1,"schedule_type":"month","description":"","name":"New QA Group","id":69,"created_by":44,"created_at":"2015-07-27T20:44:25.376Z","updated_by":44,"updated_at":"2015-11-18T19:36:14.878Z"},{"schedule_days":null,"next_date":"2015-11-29","start_date":"2015-11-15","is_active":true,"is_default":false,"schedule_interval":2,"schedule_type":"week","description":"","name":"Peach West","id":88,"created_by":44,"created_at":"2015-11-18T19:11:37.455Z","updated_by":44,"updated_at":"2015-11-18T19:35:56.720Z"},{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"month","description":"","name":"tted","id":89,"created_by":44,"created_at":"2015-11-20T16:08:54.600Z","updated_by":44,"updated_at":"2015-11-20T16:09:04.171Z"},{"schedule_days":null,"next_date":"2015-11-22","start_date":"2015-11-15","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"Lorie's count","id":90,"created_by":44,"created_at":"2015-11-20T16:39:34.703Z","updated_by":44,"updated_at":"2015-11-20T16:40:05.401Z"},{"schedule_days":null,"next_date":"2015-12-13","start_date":"2015-12-06","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"C","id":91,"created_by":44,"created_at":"2015-12-08T18:56:25.592Z","updated_by":null,"updated_at":"2015-12-08T18:56:25.592Z"}],"trigger_response":{"default_count_group":{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":true,"schedule_interval":1,"schedule_type":"month","description":"","name":"New QA Group","id":69,"created_by":44,"created_at":"2015-07-27T20:44:25.376Z","updated_by":44,"updated_at":"2015-11-18T19:36:14.878Z"},"default_count_group_included":true}},
    gl_accounts_response: {"count":35,"results":[{"is_active":true,"subtype":"food","type":"COGS","description":"Our food costs","number":"3001","name":"Food","parent_id":null,"id":1,"created_by":44,"created_at":"2014-09-19T10:11:37.735Z","updated_by":null,"updated_at":"2014-09-19T10:11:37.735Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Default","parent_id":null,"id":2,"created_by":44,"created_at":"2014-09-19T10:17:54.819Z","updated_by":44,"updated_at":"2014-09-22T09:53:23.678Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":"001","name":"Testing GL Accounts","parent_id":null,"id":3,"created_by":44,"created_at":"2014-09-19T10:19:32.243Z","updated_by":null,"updated_at":"2015-05-08T08:56:21.365Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Produce","parent_id":null,"id":4,"created_by":44,"created_at":"2014-09-23T06:01:00.439Z","updated_by":null,"updated_at":"2014-09-23T09:44:18.768Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Dairy","parent_id":null,"id":5,"created_by":44,"created_at":"2014-09-23T06:36:37.668Z","updated_by":null,"updated_at":"2014-09-23T09:44:23.076Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Food","parent_id":null,"id":6,"created_by":44,"created_at":"2014-09-23T09:44:59.177Z","updated_by":null,"updated_at":"2014-09-23T09:52:49.147Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Food","parent_id":null,"id":7,"created_by":44,"created_at":"2014-09-23T09:49:28.718Z","updated_by":null,"updated_at":"2014-09-23T09:53:52.112Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Produce","parent_id":7,"id":8,"created_by":44,"created_at":"2014-09-23T09:49:28.827Z","updated_by":null,"updated_at":"2014-09-23T09:53:48.230Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Produce","parent_id":null,"id":9,"created_by":44,"created_at":"2014-09-23T10:18:07.019Z","updated_by":null,"updated_at":"2014-09-23T10:29:07.024Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Produce","parent_id":1,"id":10,"created_by":44,"created_at":"2014-09-23T10:29:24.754Z","updated_by":null,"updated_at":"2014-09-23T10:29:24.754Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Dairy","parent_id":1,"id":11,"created_by":44,"created_at":"2014-09-23T10:51:04.206Z","updated_by":null,"updated_at":"2014-09-23T10:51:04.206Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Alcohol","parent_id":null,"id":12,"created_by":44,"created_at":"2014-09-24T10:33:10.579Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.579Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Liquor","parent_id":12,"id":13,"created_by":44,"created_at":"2014-09-24T10:33:10.670Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.670Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Seafood","parent_id":1,"id":14,"created_by":44,"created_at":"2014-10-02T09:49:58.100Z","updated_by":null,"updated_at":"2014-10-02T09:49:58.100Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Poultry","parent_id":1,"id":15,"created_by":44,"created_at":"2014-10-02T20:34:17.138Z","updated_by":null,"updated_at":"2014-10-02T20:34:17.138Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beer","parent_id":12,"id":16,"created_by":44,"created_at":"2014-10-08T20:58:59.896Z","updated_by":null,"updated_at":"2014-10-08T20:58:59.896Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Meat","parent_id":1,"id":17,"created_by":44,"created_at":"2014-10-27T18:05:32.807Z","updated_by":null,"updated_at":"2014-10-27T18:05:32.807Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":18,"created_by":44,"created_at":"2014-10-29T07:01:22.221Z","updated_by":null,"updated_at":"2014-10-29T07:33:21.228Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":19,"created_by":44,"created_at":"2014-10-29T07:34:46.259Z","updated_by":null,"updated_at":"2014-10-29T07:36:21.557Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":20,"created_by":44,"created_at":"2014-10-29T07:37:13.981Z","updated_by":null,"updated_at":"2014-10-31T09:05:33.166Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":21,"created_by":44,"created_at":"2014-10-31T09:31:12.050Z","updated_by":null,"updated_at":"2014-10-31T09:32:01.722Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":22,"created_by":44,"created_at":"2014-10-31T09:33:42.948Z","updated_by":null,"updated_at":"2014-10-31T09:34:21.798Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":23,"created_by":44,"created_at":"2014-10-31T09:44:46.442Z","updated_by":null,"updated_at":"2014-10-31T09:45:56.958Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":24,"created_by":44,"created_at":"2014-10-31T09:46:38.556Z","updated_by":null,"updated_at":"2014-11-10T15:52:53.208Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":25,"created_by":44,"created_at":"2014-11-10T16:06:53.647Z","updated_by":null,"updated_at":"2014-11-11T10:18:29.453Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":26,"created_by":44,"created_at":"2014-11-11T10:20:04.581Z","updated_by":null,"updated_at":"2014-11-11T10:23:33.682Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":27,"created_by":44,"created_at":"2014-11-11T10:24:47.647Z","updated_by":null,"updated_at":"2015-05-14T19:43:44.107Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beverages","parent_id":1,"id":28,"created_by":44,"created_at":"2014-11-14T08:25:00.699Z","updated_by":null,"updated_at":"2014-11-14T08:25:00.699Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Bread","parent_id":1,"id":29,"created_by":44,"created_at":"2014-12-10T13:12:15.711Z","updated_by":null,"updated_at":"2015-07-17T09:07:44.800Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Misc. Food","parent_id":1,"id":30,"created_by":44,"created_at":"2015-01-22T13:31:10.619Z","updated_by":null,"updated_at":"2015-01-22T13:31:10.619Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":31,"created_by":44,"created_at":"2015-05-14T19:45:20.605Z","updated_by":null,"updated_at":"2015-05-14T20:07:19.843Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":32,"created_by":44,"created_at":"2015-05-14T20:08:31.553Z","updated_by":null,"updated_at":"2015-05-14T20:08:31.553Z"},{"is_active":true,"subtype":null,"type":"COGS","description":"","number":null,"name":"BeerAA","parent_id":null,"id":33,"created_by":44,"created_at":"2015-06-19T12:54:02.103Z","updated_by":null,"updated_at":"2015-06-19T13:12:06.580Z"},{"is_active":true,"subtype":null,"type":"COGS","description":"","number":null,"name":"BeerBBB","parent_id":null,"id":34,"created_by":44,"created_at":"2015-06-19T13:11:01.919Z","updated_by":null,"updated_at":"2015-06-19T13:12:14.503Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Bread","parent_id":1,"id":35,"created_by":44,"created_at":"2015-07-17T09:09:59.773Z","updated_by":null,"updated_at":"2015-07-17T09:09:59.773Z"}]},
    items_response: {"count":2,"results":[{"common_unit_cost":"0.59147","description":"","name":"00001 edit 8.9","report_unit_cost":"20.00000","total_recipes":1,"is_active":true,"refuse_pct":"0.10000","item_db_id":null,"id":1056,"created_by":44,"created_at":"2015-04-06T14:43:27.688Z","updated_by":44,"updated_at":"2015-12-14T20:12:04.778Z","sales_item_id":null,"count_group_id":80,"gl_account_id":16,"common_unit_id":15},{"common_unit_cost":"1.03478","description":"","name":"Absolut Cherrykran 00001","report_unit_cost":"34.99000","total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":25,"id":802,"created_by":44,"created_at":"2014-10-31T16:07:27.169Z","updated_by":44,"updated_at":"2015-12-23T13:54:23.780Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":15}]},
    item_units_response: {"count":1,"results":[{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"2.00000","description":"Batch 2 floz","is_report_unit":false,"id":4762,"created_by":44,"created_at":"2015-12-04T16:49:51.786Z","updated_by":44,"updated_at":"2015-12-04T17:12:19.107Z","unit_id":3,"common_unit_id":15,"inv_item_id":1056}]},
    item_locations_response: {"count":16,"results":[{"starting_cost":"5.00000","last_cost":"17.50000","opening_count_date":null,"is_hot_count":false,"id":1779,"created_by":44,"created_at":"2015-08-28T01:09:39.602Z","updated_by":44,"updated_at":"2015-11-19T16:44:36.970Z","location_id":7,"inv_item_id":802},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":4296,"created_by":44,"created_at":"2015-11-03T14:03:43.601Z","updated_by":null,"updated_at":"2015-11-03T14:03:43.601Z","location_id":14,"inv_item_id":1056},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":1864,"created_by":44,"created_at":"2015-08-28T01:09:39.791Z","updated_by":null,"updated_at":"2015-08-28T01:09:39.791Z","location_id":10,"inv_item_id":802},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":2116,"created_by":44,"created_at":"2015-08-28T01:09:40.311Z","updated_by":null,"updated_at":"2015-08-28T01:09:40.311Z","location_id":14,"inv_item_id":802},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":2234,"created_by":44,"created_at":"2015-08-28T12:32:46.432Z","updated_by":null,"updated_at":"2015-08-28T12:32:46.432Z","location_id":9,"inv_item_id":1056},{"starting_cost":null,"last_cost":null,"opening_count_date":null,"is_hot_count":false,"id":4319,"created_by":44,"created_at":"2015-11-04T17:06:15.905Z","updated_by":null,"updated_at":"2015-11-04T17:06:15.905Z","location_id":11,"inv_item_id":1056},{"starting_cost":"0.09375","last_cost":"10.00000","opening_count_date":"2015-08-30","is_hot_count":false,"id":2792,"created_by":44,"created_at":"2015-10-09T12:50:33.754Z","updated_by":44,"updated_at":"2015-12-22T16:24:00.439Z","location_id":7,"inv_item_id":1056},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":4017,"created_by":44,"created_at":"2015-10-22T14:25:02.474Z","updated_by":null,"updated_at":"2015-10-22T14:25:02.474Z","location_id":8,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":4108,"created_by":44,"created_at":"2015-10-22T14:25:02.625Z","updated_by":null,"updated_at":"2015-10-22T14:25:02.625Z","location_id":8,"inv_item_id":1056},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":2886,"created_by":44,"created_at":"2015-10-09T17:56:58.949Z","updated_by":null,"updated_at":"2015-10-09T17:56:58.949Z","location_id":17,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3006,"created_by":44,"created_at":"2015-10-09T17:56:59.132Z","updated_by":null,"updated_at":"2015-10-09T17:56:59.132Z","location_id":17,"inv_item_id":1056},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3100,"created_by":44,"created_at":"2015-10-09T17:59:43.819Z","updated_by":null,"updated_at":"2015-10-09T17:59:43.819Z","location_id":12,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3220,"created_by":44,"created_at":"2015-10-09T17:59:44.500Z","updated_by":null,"updated_at":"2015-10-09T17:59:44.500Z","location_id":12,"inv_item_id":1056},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3316,"created_by":44,"created_at":"2015-10-09T18:02:03.348Z","updated_by":null,"updated_at":"2015-10-09T18:02:03.348Z","location_id":2,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3434,"created_by":44,"created_at":"2015-10-09T18:02:03.535Z","updated_by":null,"updated_at":"2015-10-09T18:02:03.535Z","location_id":2,"inv_item_id":1056},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":3688,"created_by":44,"created_at":"2015-10-16T15:27:11.190Z","updated_by":null,"updated_at":"2015-10-16T15:27:11.190Z","location_id":3,"inv_item_id":1056}]},
    items_db_items_response: {"count": 0, "results": []},
    items_db_items_units_response: {"count": 0, "results": []},
    units_response: {"count":32,"results":[{"type":"each","metric_base":null,"english_base":null,"abbr":"bg","is_metric":false,"name":"Bag","id":2,"created_by":44,"created_at":"2014-06-17T15:01:02.984Z","updated_by":null,"updated_at":"2014-06-30T14:24:50.873Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bat","is_metric":false,"name":"Batch","id":3,"created_by":44,"created_at":"2014-06-17T15:01:34.911Z","updated_by":null,"updated_at":"2014-06-30T14:24:45.030Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bk","is_metric":false,"name":"Block","id":4,"created_by":44,"created_at":"2014-06-17T15:01:54.954Z","updated_by":null,"updated_at":"2014-06-30T14:24:58.654Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bt","is_metric":false,"name":"Bottle","id":5,"created_by":44,"created_at":"2014-06-17T15:02:12.934Z","updated_by":44,"updated_at":"2014-07-15T06:44:11.711Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bx","is_metric":false,"name":"Box","id":6,"created_by":44,"created_at":"2014-06-17T15:02:38.022Z","updated_by":44,"updated_at":"2014-08-26T12:30:16.239Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bun","is_metric":false,"name":"Bunch","id":7,"created_by":44,"created_at":"2014-06-17T15:03:01.332Z","updated_by":44,"updated_at":"2014-07-15T06:44:36.347Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"can","is_metric":false,"name":"Can","id":8,"created_by":44,"created_at":"2014-06-17T15:03:31.864Z","updated_by":44,"updated_at":"2014-07-15T06:44:42.662Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cs","is_metric":false,"name":"Case","id":9,"created_by":44,"created_at":"2014-06-17T15:03:51.775Z","updated_by":44,"updated_at":"2014-07-15T06:44:52.527Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cnt","is_metric":false,"name":"Container","id":10,"created_by":44,"created_at":"2014-06-17T15:04:24.853Z","updated_by":44,"updated_at":"2014-07-15T06:45:06.460Z"},{"type":"volume","metric_base":"236.588000","english_base":"48.000000","abbr":"cup","is_metric":false,"name":"Cup","id":11,"created_by":44,"created_at":"2014-06-17T15:04:41.649Z","updated_by":44,"updated_at":"2014-10-29T09:30:33.672Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"doz","is_metric":false,"name":"Dozen","id":12,"created_by":44,"created_at":"2014-06-17T15:04:58.222Z","updated_by":44,"updated_at":"2014-07-15T06:45:34.457Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"ea","is_metric":false,"name":"Each","id":13,"created_by":44,"created_at":"2014-06-17T15:05:15.971Z","updated_by":44,"updated_at":"2014-07-15T06:56:29.997Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"fl","is_metric":false,"name":"Flat","id":14,"created_by":44,"created_at":"2014-06-17T15:05:34.037Z","updated_by":44,"updated_at":"2014-07-15T06:45:39.041Z"},{"type":"volume","metric_base":"29.573500","english_base":"6.000000","abbr":"floz","is_metric":false,"name":"Fluid Ounce","id":15,"created_by":44,"created_at":"2014-06-17T15:06:16.282Z","updated_by":44,"updated_at":"2014-10-29T09:33:41.004Z"},{"type":"volume","metric_base":"3785.410000","english_base":"768.000000","abbr":"gal","is_metric":false,"name":"Gallon","id":16,"created_by":44,"created_at":"2014-06-17T15:06:40.661Z","updated_by":44,"updated_at":"2014-10-29T09:33:04.925Z"},{"type":"weight","metric_base":"1.000000","english_base":"0.035274","abbr":"g","is_metric":true,"name":"Gram","id":17,"created_by":44,"created_at":"2014-06-17T15:07:10.619Z","updated_by":44,"updated_at":"2014-10-29T09:31:54.369Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"head","is_metric":false,"name":"Head","id":18,"created_by":44,"created_at":"2014-06-17T15:08:17.021Z","updated_by":44,"updated_at":"2014-07-15T06:46:32.905Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"jar","is_metric":false,"name":"Jar","id":19,"created_by":44,"created_at":"2014-06-17T15:08:30.161Z","updated_by":44,"updated_at":"2014-07-15T06:46:42.268Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"keg","is_metric":false,"name":"Keg","id":20,"created_by":44,"created_at":"2014-06-17T15:08:46.902Z","updated_by":44,"updated_at":"2014-07-15T06:47:14.297Z"},{"type":"weight","metric_base":"1000.000000","english_base":"35.274000","abbr":"kg","is_metric":true,"name":"Kilogram","id":21,"created_by":44,"created_at":"2014-06-17T15:09:10.677Z","updated_by":44,"updated_at":"2014-10-29T09:38:09.297Z"},{"type":"volume","metric_base":"1000.000000","english_base":"202.884000","abbr":"l","is_metric":true,"name":"Liter","id":22,"created_by":44,"created_at":"2014-06-17T15:09:27.622Z","updated_by":44,"updated_at":"2014-10-29T09:39:31.334Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"loaf","is_metric":false,"name":"Loaf","id":23,"created_by":44,"created_at":"2014-06-17T15:09:48.278Z","updated_by":44,"updated_at":"2014-07-15T06:48:02.764Z"},{"type":"volume","metric_base":"1.000000","english_base":"0.202884","abbr":"ml","is_metric":true,"name":"Mililiter","id":24,"created_by":44,"created_at":"2014-06-17T15:10:13.286Z","updated_by":44,"updated_at":"2014-10-29T09:36:33.872Z"},{"type":"weight","metric_base":"28.349500","english_base":"1.000000","abbr":"oz","is_metric":false,"name":"Ounce","id":25,"created_by":44,"created_at":"2014-06-17T15:10:32.094Z","updated_by":44,"updated_at":"2014-10-29T09:37:21.233Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"pk","is_metric":false,"name":"Pack","id":26,"created_by":44,"created_at":"2014-06-17T15:10:53.143Z","updated_by":44,"updated_at":"2014-09-17T10:54:29.514Z"},{"type":"volume","metric_base":"473.176000","english_base":"96.000000","abbr":"pt","is_metric":false,"name":"Pint","id":27,"created_by":44,"created_at":"2014-06-17T15:11:11.444Z","updated_by":44,"updated_at":"2014-10-29T09:36:04.400Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"por","is_metric":false,"name":"Portion","id":28,"created_by":44,"created_at":"2014-06-17T19:52:02.568Z","updated_by":44,"updated_at":"2014-10-29T09:04:20.432Z"},{"type":"weight","metric_base":"453.592000","english_base":"16.000000","abbr":"lb","is_metric":false,"name":"Pound","id":1,"created_by":44,"created_at":"2014-06-17T08:24:51.310Z","updated_by":44,"updated_at":"2015-12-21T21:19:40.109Z"},{"type":"volume","metric_base":"946.353000","english_base":"192.000000","abbr":"qt","is_metric":false,"name":"Quart","id":31,"created_by":44,"created_at":"2014-06-17T19:53:50.356Z","updated_by":44,"updated_at":"2014-10-29T09:34:22.399Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"srv","is_metric":false,"name":"Serving","id":33,"created_by":44,"created_at":"2014-06-17T19:54:48.070Z","updated_by":44,"updated_at":"2014-07-15T06:49:52.702Z"},{"type":"volume","metric_base":"14.786800","english_base":"3.000000","abbr":"tbsp","is_metric":false,"name":"Tablespoon","id":34,"created_by":44,"created_at":"2014-06-17T19:55:09.282Z","updated_by":44,"updated_at":"2014-10-29T09:38:47.443Z"},{"type":"volume","metric_base":"4.928920","english_base":"1.000000","abbr":"tsp","is_metric":false,"name":"Teaspoon","id":35,"created_by":44,"created_at":"2014-06-17T19:55:45.634Z","updated_by":44,"updated_at":"2014-10-29T09:39:00.454Z"}]},
    vendors_response: {"count":10,"results":[{"name":"ABC Beers","contact_last_name":"Jones","country":null,"address":"3434 W Reno","phone":"(555) 867-5309","address2":"Apt 5","city":"Oklahoma City","contact_email":"sjones@gmail.com","contact_name":null,"notes":"This is the notes","contact_first_name":"Skippy","zip":"73034","country_id":227,"state":"Oklahoma","is_active":true,"fax":"What is a Fax?","state_id":3491,"id":17,"created_by":44,"created_at":"2015-10-13T20:29:38.593Z","updated_by":44,"updated_at":"2015-12-04T14:03:19.334Z"},{"name":"ABC Foods","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":18,"created_by":44,"created_at":"2015-10-14T00:06:17.806Z","updated_by":null,"updated_at":"2015-10-14T00:06:17.806Z"},{"name":"CostLow","contact_last_name":null,"country":null,"address":"CostLow","phone":null,"address2":null,"city":"Miami","contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":"39405","country_id":227,"state":"Florida","is_active":true,"fax":null,"state_id":3464,"id":21,"created_by":44,"created_at":"2015-11-18T19:13:17.319Z","updated_by":44,"updated_at":"2015-11-18T19:13:43.593Z"},{"name":"Ice Cream Man","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":14,"created_by":44,"created_at":"2015-09-24T17:11:39.095Z","updated_by":44,"updated_at":"2015-10-02T14:16:22.179Z"},{"name":"Pasta Pete's","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":false,"fax":null,"state_id":null,"id":15,"created_by":44,"created_at":"2015-09-24T19:30:17.604Z","updated_by":44,"updated_at":"2015-09-29T12:30:00.149Z"},{"name":"Some test vendor1","contact_last_name":"Piper","country":"United States","address":"2600 NW 29th St","phone":"4056408232","address2":"apt 77","city":"Oklahoma City","contact_email":"pp@gmail.com","contact_name":null,"notes":"Pie flavor","contact_first_name":"Peter","zip":"73107","country_id":223,"state":"Bugiri District","is_active":true,"fax":"Who has a fax?","state_id":3394,"id":1,"created_by":44,"created_at":"2015-09-08T12:54:53.735Z","updated_by":44,"updated_at":"2015-12-18T17:35:48.748Z"},{"name":"The Muffin Man","contact_last_name":null,"country":null,"address":"1 Drury Ln","phone":null,"address2":null,"city":"Orlando","contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":"76799","country_id":227,"state":"Florida","is_active":true,"fax":null,"state_id":3464,"id":12,"created_by":44,"created_at":"2015-09-24T13:54:06.405Z","updated_by":null,"updated_at":"2015-09-24T13:54:06.405Z"},{"name":"The Pie Guy","contact_last_name":null,"country":null,"address":"999 Sunny Lanne","phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":true,"fax":null,"state_id":null,"id":6,"created_by":44,"created_at":"2015-09-21T22:41:28.424Z","updated_by":44,"updated_at":"2015-09-24T13:45:52.572Z"},{"name":"US Foods","contact_last_name":"Smith","country":null,"address":"123 Main Street","phone":"212-555-1212","address2":"Suite 200","city":"Ann Arbor","contact_email":"ssmith@peachworks.com","contact_name":null,"notes":"We buy food from this vendor.","contact_first_name":"Sam","zip":"222222","country_id":227,"state":"Michigan","is_active":true,"fax":"222-555-1212","state_id":3477,"id":11,"created_by":44,"created_at":"2015-09-23T01:51:06.437Z","updated_by":44,"updated_at":"2015-10-15T12:57:10.424Z"},{"name":"US Foods","contact_last_name":null,"country":null,"address":null,"phone":null,"address2":null,"city":null,"contact_email":null,"contact_name":null,"notes":null,"contact_first_name":null,"zip":null,"country_id":null,"state":"","is_active":false,"fax":null,"state_id":null,"id":2,"created_by":44,"created_at":"2015-09-14T18:19:06.333Z","updated_by":44,"updated_at":"2015-09-25T13:32:46.859Z"}]},
         vendor_items_response: {"count":6,"results":[{"last_price":"10.00000","number":"AE 1223","pack_size":"16 Blocks","description":"16 Block pack","is_active":false,"last_price_on":"2015-11-16","id":14,"created_by":44,"created_at":"2015-09-10T10:48:02.706Z","updated_by":44,"updated_at":"2015-11-17T10:10:16.043Z","vendor_id":1,"inv_item_id":1056,"inv_item_unit_id":3912},{"last_price":"35.00000","number":"3334","pack_size":null,"description":"aaa","is_active":true,"last_price_on":"2015-11-16","id":74,"created_by":44,"created_at":"2015-11-13T15:14:01.362Z","updated_by":44,"updated_at":"2015-11-19T16:44:33.541Z","vendor_id":1,"inv_item_id":802,"inv_item_unit_id":3160},{"last_price":"30.00000","number":"RA 4454","pack_size":null,"description":"some desc ed","is_active":false,"last_price_on":"2015-08-30","id":19,"created_by":44,"created_at":"2015-09-22T13:29:23.460Z","updated_by":44,"updated_at":"2015-11-13T15:19:13.128Z","vendor_id":1,"inv_item_id":1056,"inv_item_unit_id":3847},{"last_price":"20.00000","number":"AE 1227","pack_size":"10 Blocks","description":"10 Block pack edt","is_active":false,"last_price_on":"2015-11-16","id":17,"created_by":44,"created_at":"2015-09-10T16:47:41.555Z","updated_by":44,"updated_at":"2015-11-19T16:44:30.015Z","vendor_id":1,"inv_item_id":1056,"inv_item_unit_id":3979},{"last_price":null,"number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":112,"created_by":44,"created_at":"2015-12-15T11:08:41.515Z","updated_by":null,"updated_at":"2015-12-15T11:08:41.515Z","vendor_id":18,"inv_item_id":1056,"inv_item_unit_id":4238},{"last_price":"2.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":113,"created_by":44,"created_at":"2015-12-15T14:34:00.065Z","updated_by":null,"updated_at":"2015-12-15T14:34:00.065Z","vendor_id":17,"inv_item_id":1056,"inv_item_unit_id":3084}]},
         permissions                 : {
           'edit_items' : true
         },
         account_locations           : [{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":3487,"tags":null,"name":"Andrei204 NYC","id":7,"created_by":44,"created_at":"2013-11-11T15:33:33.187Z","updated_by":138,"updated_at":"2015-05-15T19:04:11.105Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"New York"},{"country_id":null,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":null,"name":"Andrei205","id":10,"created_by":44,"created_at":"2013-11-14T17:22:28.898Z","updated_by":44,"updated_at":"2014-12-22T15:39:01.061Z","is_deleted":false,"org_group_id":null,"country":null,"state":null},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Andrei205","id":8,"created_by":44,"created_at":"2013-11-11T16:08:38.307Z","updated_by":44,"updated_at":"2015-12-11T18:26:31.813Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":null,"timezone":"America/Los_Angeles","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":3502,"tags":["test"],"name":"Bellingham, WA","id":3,"created_by":44,"created_at":"2013-08-08T16:43:25.000Z","updated_by":44,"updated_at":"2015-09-25T16:56:06.001Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Washington"},{"country_id":227,"number":"20","timezone":"America/Los_Angeles","address1":null,"address2":null,"city":null,"zip":"99999","phone":null,"state_id":null,"tags":["bend"],"name":"Bend, Or","id":14,"created_by":44,"created_at":"2014-11-13T17:20:33.519Z","updated_by":44,"updated_at":"2015-09-25T16:55:47.768Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"15","timezone":"America/Los_Angeles","address1":"2530 Jaeger","address2":null,"city":"Bellingham","zip":"98225","phone":null,"state_id":3502,"tags":["Columbia"],"name":"Columbia Station","id":15,"created_by":44,"created_at":"2014-11-24T15:28:01.049Z","updated_by":44,"updated_at":"2014-11-24T15:29:34.567Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Washington"},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Darya's test","id":9,"created_by":44,"created_at":"2013-11-12T12:58:57.675Z","updated_by":44,"updated_at":"2015-09-25T17:01:29.228Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"1","timezone":"America/Detroit","address1":"123 Street","address2":null,"city":"Ann Arbor","zip":null,"phone":null,"state_id":null,"tags":["Chicago","test"],"name":"Downtown Ann Arbor","id":1,"created_by":44,"created_at":"2013-01-29T00:51:00.489Z","updated_by":44,"updated_at":"2015-11-30T21:05:33.151Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Grayling","id":19,"created_by":44,"created_at":"2015-09-23T18:33:11.065Z","updated_by":null,"updated_at":"2015-09-23T18:33:11.065Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"4444","timezone":"Africa/Abidjan","address1":null,"address2":null,"city":null,"zip":"48114","phone":null,"state_id":3498,"tags":[],"name":"LLS location","id":5,"created_by":138,"created_at":"2013-09-27T18:37:45.348Z","updated_by":138,"updated_at":"2014-07-15T00:23:05.650Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Texas"},{"country_id":227,"number":"23","timezone":"America/New_York","address1":"2506 Old US-23","address2":null,"city":"Brighton","zip":"48116","phone":null,"state_id":3477,"tags":[],"name":"Lorie's Test City","id":6,"created_by":138,"created_at":"2013-10-15T19:09:31.971Z","updated_by":44,"updated_at":"2014-12-17T14:44:54.239Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Michigan"},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"m","id":21,"created_by":44,"created_at":"2015-12-11T18:26:51.085Z","updated_by":null,"updated_at":"2015-12-11T18:26:51.085Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"moijoi","id":12,"created_by":138,"created_at":"2014-05-08T15:25:49.839Z","updated_by":44,"updated_at":"2015-12-11T18:26:57.360Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"213","timezone":"America/Denver","address1":null,"address2":null,"city":"Denver","zip":null,"phone":null,"state_id":3460,"tags":["patty"],"name":"Patty-Loc","id":11,"created_by":44,"created_at":"2014-03-14T15:52:50.336Z","updated_by":44,"updated_at":"2015-01-15T19:34:37.649Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Colorado"},{"country_id":227,"number":"","timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Richardson","id":17,"created_by":44,"created_at":"2015-09-23T18:25:41.806Z","updated_by":null,"updated_at":"2015-09-23T18:25:41.806Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"","timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Saline","id":18,"created_by":44,"created_at":"2015-09-23T18:26:13.621Z","updated_by":null,"updated_at":"2015-09-23T18:26:13.621Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":3477,"tags":[],"name":"Sarahville","id":20,"created_by":44,"created_at":"2015-11-17T22:32:58.071Z","updated_by":null,"updated_at":"2015-11-17T22:32:58.071Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Michigan"},{"country_id":227,"number":null,"timezone":"America/Los_Angeles","address1":null,"address2":null,"city":"LA","zip":null,"phone":null,"state_id":3459,"tags":[],"name":"Square Loc","id":16,"created_by":44,"created_at":"2015-01-21T18:17:42.418Z","updated_by":44,"updated_at":"2015-09-25T16:56:22.844Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"California"},{"country_id":227,"number":"test","timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":["test"],"name":"test","id":4,"created_by":44,"created_at":"2013-08-19T03:01:39.551Z","updated_by":44,"updated_at":"2015-09-25T17:01:43.974Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"2","timezone":"America/Los_Angeles","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":["test","test2","test3","test4"],"name":"Test","id":2,"created_by":44,"created_at":"2013-06-19T08:19:54.000Z","updated_by":44,"updated_at":"2014-11-25T18:05:41.764Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null}],
         active_locations            : [{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":3487,"tags":null,"name":"Andrei204 NYC","id":7,"created_by":44,"created_at":"2013-11-11T15:33:33.187Z","updated_by":138,"updated_at":"2015-05-15T19:04:11.105Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"New York"},{"country_id":null,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":null,"name":"Andrei205","id":10,"created_by":44,"created_at":"2013-11-14T17:22:28.898Z","updated_by":44,"updated_at":"2014-12-22T15:39:01.061Z","is_deleted":false,"org_group_id":null,"country":null,"state":null},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Andrei205","id":8,"created_by":44,"created_at":"2013-11-11T16:08:38.307Z","updated_by":44,"updated_at":"2015-12-11T18:26:31.813Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":null,"timezone":"America/Los_Angeles","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":3502,"tags":["test"],"name":"Bellingham, WA","id":3,"created_by":44,"created_at":"2013-08-08T16:43:25.000Z","updated_by":44,"updated_at":"2015-09-25T16:56:06.001Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Washington"},{"country_id":227,"number":"20","timezone":"America/Los_Angeles","address1":null,"address2":null,"city":null,"zip":"99999","phone":null,"state_id":null,"tags":["bend"],"name":"Bend, Or","id":14,"created_by":44,"created_at":"2014-11-13T17:20:33.519Z","updated_by":44,"updated_at":"2015-09-25T16:55:47.768Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"15","timezone":"America/Los_Angeles","address1":"2530 Jaeger","address2":null,"city":"Bellingham","zip":"98225","phone":null,"state_id":3502,"tags":["Columbia"],"name":"Columbia Station","id":15,"created_by":44,"created_at":"2014-11-24T15:28:01.049Z","updated_by":44,"updated_at":"2014-11-24T15:29:34.567Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Washington"},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Darya's test","id":9,"created_by":44,"created_at":"2013-11-12T12:58:57.675Z","updated_by":44,"updated_at":"2015-09-25T17:01:29.228Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"1","timezone":"America/Detroit","address1":"123 Street","address2":null,"city":"Ann Arbor","zip":null,"phone":null,"state_id":null,"tags":["Chicago","test"],"name":"Downtown Ann Arbor","id":1,"created_by":44,"created_at":"2013-01-29T00:51:00.489Z","updated_by":44,"updated_at":"2015-11-30T21:05:33.151Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":null,"timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"moijoi","id":12,"created_by":138,"created_at":"2014-05-08T15:25:49.839Z","updated_by":44,"updated_at":"2015-12-11T18:26:57.360Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"213","timezone":"America/Denver","address1":null,"address2":null,"city":"Denver","zip":null,"phone":null,"state_id":3460,"tags":["patty"],"name":"Patty-Loc","id":11,"created_by":44,"created_at":"2014-03-14T15:52:50.336Z","updated_by":44,"updated_at":"2015-01-15T19:34:37.649Z","is_deleted":false,"org_group_id":null,"country":"USA","state":"Colorado"},{"country_id":227,"number":"","timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":[],"name":"Richardson","id":17,"created_by":44,"created_at":"2015-09-23T18:25:41.806Z","updated_by":null,"updated_at":"2015-09-23T18:25:41.806Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"test","timezone":"America/New_York","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":["test"],"name":"test","id":4,"created_by":44,"created_at":"2013-08-19T03:01:39.551Z","updated_by":44,"updated_at":"2015-09-25T17:01:43.974Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null},{"country_id":227,"number":"2","timezone":"America/Los_Angeles","address1":null,"address2":null,"city":null,"zip":null,"phone":null,"state_id":null,"tags":["test","test2","test3","test4"],"name":"Test","id":2,"created_by":44,"created_at":"2013-06-19T08:19:54.000Z","updated_by":44,"updated_at":"2014-11-25T18:05:41.764Z","is_deleted":false,"org_group_id":null,"country":"USA","state":null}]
  };

  // helper local variables
  var $controller, $log, $rootScope, controllerScope, logStub, errorLogStub, mockedDataCopy;
  // controller injectables
  var $document, $filter, $location, $peachToast, $q, $timeout, cakeCommon, cakeCountGroups, cakeGLAccounts, cakeItems, cakeItemsDBItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeSharedData, cakeTypeaheadHelper, cakeUnits, cakeVendors, cakeVendorItems;


  // initialize app module
  beforeEach(module('cakeApp'));


  // mock and inject additional modules
  beforeEach(inject(function($injector) {

    $controller = $injector.get('$controller');
    $log = $injector.get('$log');
    $rootScope = $injector.get('$rootScope');

    $filter = $injector.get('$filter');
    $location = $injector.get('$location');
    $peachToast = $injector.get('$peachToast');
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');

    $document = [
    {
      getElementById: function() {
        return {
          scrollTop: 0
        }
      }
    }
    ];

    cakeCommon = {
      isUserAccountAdmin: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return itemsControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      },
      parseCakeFloatValue: function(value, defaultValue) {
        defaultValue = _.isUndefined(defaultValue) ? 0 : defaultValue;
                    if (!_.isUndefined(value) && !_.isNull(value)) {
                      return parseFloat(Big(value).toFixed(5));
                    }
                    return defaultValue;
      }
    };

    cakeCountGroups = {
      loadCountGroups: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getCountGroups: function() {
        return itemsControllerTestsMockedData.count_groups_response.results;
      },
      getCountGroupsCollection: function() {
        return _.object(_.pluck(itemsControllerTestsMockedData.count_groups_response.results, 'id'), itemsControllerTestsMockedData.count_groups_response.results);
      },
      getDefaultCountGroup: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.count_groups_response.trigger_response.default_count_group);
        return deferred.promise;
      }
    };

    cakeGLAccounts = {
      loadGLAccounts: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.gl_accounts_response);
        return deferred.promise;
      },
      getGLAccounts: function() {
        return itemsControllerTestsMockedData.gl_accounts_response.results;
      },
      getGLAccountsCollection: function() {
        return _.object(_.pluck(itemsControllerTestsMockedData.gl_accounts_response.results, 'id'), itemsControllerTestsMockedData.gl_accounts_response.results);
      },
      getDefaultGLAccount: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.gl_accounts_response.results[1]);
        return deferred.promise;
      }
    };

    cakeItems = {
      loadItems: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.items_response);
        return deferred.promise;
      },
      getItems: function() {
        return itemsControllerTestsMockedData.items_response.results;
      },
      getItemsCollection: function() {
        return _.object(_.pluck(itemsControllerTestsMockedData.items_response.results, 'id'), itemsControllerTestsMockedData.items_response.results);
      },
      createItem: function(newData) {
        var deferred = $q.defer();
        deferred.resolve(_.extend({id: itemsControllerTestsMockedData.new_object_default_id}, newData));
        return deferred.promise;
      },
      bulkUpdateItems: function(updateData) {
        var deferred = $q.defer();
        deferred.resolve(updateData);
        return deferred.promise;
      }
    };

    cakeItemsDBItems = {
      getData: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.items_db_items_response.results);
        return deferred.promise;
      },
      getItemsDBItemGLAccountFromCategoryId: function() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      },
      getItemsDBItemUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.items_db_items_units_response.results);
        return deferred.promise;
      }
    };

    cakeItemLocations = {
      loadItemLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.item_locations_response);
        return deferred.promise;
      },
      getItemLocations: function() {
        return itemsControllerTestsMockedData.item_locations_response.results;
      },
      bulkCreateItemLocations: function(createData) {
        var deferred = $q.defer();
        deferred.resolve(createData);
        return deferred.promise;
      },
      bulkDeleteItemLocations: function(ids) {
        var deferred = $q.defer();
        deferred.resolve(ids);
        return deferred.promise;
      }
    };

    cakeItemUnits = {
      loadItemUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.item_units_response);
        return deferred.promise;
      },
      createItemUnit: function(newData) {
        var deferred = $q.defer();
        deferred.resolve(_.extend({id: itemsControllerTestsMockedData.new_object_default_id}, newData));
        return deferred.promise;
      }
    };

    cakeItemUnitLocations = {
      bulkCreateItemUnitLocations: function(createData) {
        var deferred = $q.defer();
        deferred.resolve(createData);
        return deferred.promise;
      },
      bulkDeleteItemUnitLocations: function(deleteData) {
        var deferred = $q.defer();
        deferred.resolve(deleteData);
        return deferred.promise;
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData[settingKey]);
        return deferred.promise;
      }
    };

    cakeSharedData = {
      getValue: function(key) {
        return null;
      },
      unsetValue: function(key) {
        return;
      }
    };

    cakeTypeaheadHelper = {
      typeaheadDataLoad: function() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      }
    };

    cakeUnits = {
      loadUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.units_response);
        return deferred.promise;
      },
      getUnits: function() {
        return itemsControllerTestsMockedData.units_response.results;
      },
      getUnitsCollection: function() {
        return _.object(_.pluck(itemsControllerTestsMockedData.units_response.results, 'id'), itemsControllerTestsMockedData.units_response.results);
      }
    };

    cakeVendors = {
      loadVendors: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.vendors_response);
        return deferred.promise;
      },
      getVendors: function() {
        return itemsControllerTestsMockedData.vendors_response.results;
      },
      getVendorsCollection: function() {
        return _.object(_.pluck(itemsControllerTestsMockedData.vendors_response.results, 'id'), itemsControllerTestsMockedData.vendors_response.results);
      }
    };

    cakeVendorItems = {
      loadVendorItems: function() {
        var deferred = $q.defer();
        deferred.resolve(itemsControllerTestsMockedData.vendor_items_response);
        return deferred.promise;
      },
      getVendorItems: function() {
        return itemsControllerTestsMockedData.vendor_items_response.results;
      },
      createVendorItem: function(newData) {
        var deferred = $q.defer();
        deferred.resolve(_.extend({id: itemsControllerTestsMockedData.new_object_default_id}, newData));
        return deferred.promise;
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'items.js as vm',
      {
        '$scope': controllerScope,
        '$document': $document,
        '$filter': $filter,
        '$location': $location,
        '$peachToast': $peachToast,
        '$q': $q,
        '$timeout': $timeout,
        'cakeCommon': cakeCommon,
        'cakeCountGroups': cakeCountGroups,
        'cakeGLAccounts': cakeGLAccounts,
        'cakeItems': cakeItems,
        'cakeItemsDBItems': cakeItemsDBItems,
        'cakeItemLocations': cakeItemLocations,
        'cakeItemUnits': cakeItemUnits,
        'cakeItemUnitLocations': cakeItemUnitLocations,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings,
        'cakeSharedData': cakeSharedData,
        'cakeTypeaheadHelper': cakeTypeaheadHelper,
        'cakeUnits': cakeUnits,
        'cakeVendors': cakeVendors,
        'cakeVendorItems': cakeVendorItems
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});
    
    mockedDataCopy = angular.copy(itemsControllerTestsMockedData);

  }));

  afterEach(function() {

    sandbox.restore();
    
    itemsControllerTestsMockedData = mockedDataCopy;

  });

  describe('Constructor', function() {

    it('should construct Items Controller', function() {

      expect(controllerScope.vm.$document).to.exist;
      expect(controllerScope.vm.$filter).to.exist;
      expect(controllerScope.vm.$location).to.exist;
      expect(controllerScope.vm.$peachToast).to.exist;
      expect(controllerScope.vm.$q).to.exist;
      expect(controllerScope.vm.$timeout).to.exist;
      expect(controllerScope.vm.cakeCommon).to.exist;
      expect(controllerScope.vm.cakeCountGroups).to.exist;
      expect(controllerScope.vm.cakeGLAccounts).to.exist;
      expect(controllerScope.vm.cakeItems).to.exist;
      expect(controllerScope.vm.cakeItemsDBItems).to.exist;
      expect(controllerScope.vm.cakeItemLocations).to.exist;
      expect(controllerScope.vm.cakeItemUnits).to.exist;
      expect(controllerScope.vm.cakeItemUnitLocations).to.exist;
      expect(controllerScope.vm.cakePermissions).to.exist;
      expect(controllerScope.vm.cakeSettings).to.exist;
      expect(controllerScope.vm.cakeSharedData).to.exist;
      expect(controllerScope.vm.cakeTypeaheadHelper).to.exist;
      expect(controllerScope.vm.cakeUnits).to.exist;
      expect(controllerScope.vm.cakeVendors).to.exist;
      expect(controllerScope.vm.cakeVendorItems).to.exist;

      expect(controllerScope.vm.blockers).to.contain.all.keys(['api_processing', 'saving', 'table_updating']);

      expect(controllerScope.vm.headerOptions).to.deep.equal([{'callback': controllerScope.vm.openNewItemForm, 'label': 'Add Item'}]);

      expect(controllerScope.vm.bulkEdit).to.deep.equal({is_enabled: false, show_form: false, form_data: {}, checked_items: []});

      expect(controllerScope.vm.newItem).to.deep.equal({show_form: false, form_data: {}, locations: [], typeahead: {}});

      expect(controllerScope.vm.pagination).to.deep.equal({'limit': 100, 'page_no': 1, 'total_items': 0});
      expect(controllerScope.vm.paginationLimits).to.deep.equal([100]);
      expect(controllerScope.vm.itemsRequestParams).to.deep.equal({});
      expect(controllerScope.vm.tableSort).to.deep.equal({field : 'name', order : 'asc'});
      expect(controllerScope.vm.filters).to.deep.equal({show_inactive_items: false, gl_account_id: null, count_group_id: null, location_id: null, vendor_id: null});
      expect(controllerScope.vm.searchParams).to.deep.equal({'searchQuery': ''});
      expect(controllerScope.vm.customFiltersApplied).to.equal(false);

      expect(controllerScope.vm.accountLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.canEditItems).to.equal(false);
      expect(controllerScope.vm.countGroups).to.deep.equal([]);
      expect(controllerScope.vm.countGroupsById).to.deep.equal({});
      expect(controllerScope.vm.defaultCountGroup).to.equal(null);
      expect(controllerScope.vm.defaultGLAccount).to.equal(null);
      expect(controllerScope.vm.forms).to.deep.equal({});
      expect(controllerScope.vm.glAccounts).to.deep.equal([]);
      expect(controllerScope.vm.glAccountsById).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.isSingleLocationAccount).to.equal(true);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.itemsById).to.deep.equal({});
      expect(controllerScope.vm.itemLocations).to.deep.equal([]);
      expect(controllerScope.vm.itemLocationsById).to.deep.equal({});
      expect(controllerScope.vm.itemVendors).to.deep.equal([]);
      expect(controllerScope.vm.itemVendorsById).to.deep.equal({});
      expect(controllerScope.vm.units).to.deep.equal([]);
      expect(controllerScope.vm.unitsById).to.deep.equal({});
      expect(controllerScope.vm.unitsByAbbr).to.deep.equal({});
      expect(controllerScope.vm.vendors).to.deep.equal([]);
      expect(controllerScope.vm.vendorsById).to.deep.equal({});

      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

    });

  });

  describe('Activate function', function() {

    it('activate should set up correct controller properties', function() {

      var spyCakeCommonDevMode = sandbox.spy(controllerScope.vm.cakeCommon, 'isDevPreviewModeRunning');
      var spyCakeCommonUserAdmin = sandbox.spy(controllerScope.vm.cakeCommon, 'isUserAccountAdmin');
      var spyCakePermissions = sandbox.spy(controllerScope.vm.cakePermissions, 'userHasPermission');
      var spyCakeSettings = sandbox.spy(controllerScope.vm.cakeSettings, 'getSettings');
      var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
      var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
      var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
      var spyCakeVendorsLoad = sandbox.spy(controllerScope.vm.cakeVendors, 'loadVendors');
      var spyDefaultGLAccountLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'getDefaultGLAccount');
      var spyDefaultCountGroupLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'getDefaultCountGroup');
      var spySharedDataValueCheck = sandbox.spy(controllerScope.vm.cakeSharedData, 'getValue');

      controllerScope.vm.activate();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      expect(controllerScope.vm.blockers.table_updating).to.equal(true);

      expect(spyCakeCommonDevMode.called).to.equal(true);
      expect(spyCakeCommonUserAdmin.called).to.equal(true);
      expect(spyCakeSettings.calledWith('active_locations')).to.equal(true);
      expect(spyCakeSettings.calledWith('account_locations')).to.equal(true);
      expect(spyCakePermissions.calledWithExactly('edit_items')).to.equal(true);
      expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
      expect(spyDefaultGLAccountLoad.called).to.equal(true);
      expect(spyDefaultCountGroupLoad.called).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.isAccountAdmin).to.equal(itemsControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(itemsControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.accountLocations).to.deep.equal(itemsControllerTestsMockedData.account_locations);
      expect(controllerScope.vm.isSingleLocationAccount).to.equal(itemsControllerTestsMockedData.account_locations.length <= 1 ? true : false);
      expect(controllerScope.vm.activeLocations).to.deep.equal(itemsControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(itemsControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.canEditItems).to.equal(itemsControllerTestsMockedData.permissions.edit_items);

      expect(controllerScope.vm.defaultGLAccount).to.deep.equal(itemsControllerTestsMockedData.gl_accounts_response.results[1]);
      expect(controllerScope.vm.defaultCountGroup).to.deep.equal(itemsControllerTestsMockedData.count_groups_response.trigger_response.default_count_group);

      expect(controllerScope.vm.countGroups).to.deep.equal(itemsControllerTestsMockedData.count_groups_response.results);
      expect(_.keys(controllerScope.vm.countGroupsById).length).to.equal(itemsControllerTestsMockedData.count_groups_response.count);
      expect(controllerScope.vm.units).to.deep.equal(itemsControllerTestsMockedData.units_response.results);
      expect(_.keys(controllerScope.vm.unitsById).length).to.equal(itemsControllerTestsMockedData.units_response.count);
      expect(controllerScope.vm.glAccounts).to.deep.equal(itemsControllerTestsMockedData.gl_accounts_response.results);
      expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(itemsControllerTestsMockedData.gl_accounts_response.count);
      expect(controllerScope.vm.vendors).to.deep.equal(itemsControllerTestsMockedData.vendors_response.results);
      expect(_.keys(controllerScope.vm.vendorsById).length).to.equal(itemsControllerTestsMockedData.vendors_response.count);

      expect(spySharedDataValueCheck.calledWith('items_search')).to.equal(true);
      expect(spySharedDataValueCheck.calledWith('items_page_init_action')).to.equal(true);

      // tests for loading data will be done in onPaginationChangeCallback function section, so here only check if data set up correctly
      expect(controllerScope.vm.items).to.deep.equal(itemsControllerTestsMockedData.items_response.results);
      expect(controllerScope.vm.pagination.total_items).to.equal(2);
      expect(controllerScope.vm.pagination.page_no).to.equal(1);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.table_updating).to.equal(false);

    });

    it('activate should display error if data not loaded properly from services', function() {

      var spyCakeCommonUserAdmin = sandbox.stub(controllerScope.vm.cakeCommon, 'isUserAccountAdmin', function() {
        var deferred = $q.defer();
        deferred.reject('api error');
        return deferred.promise;
      });
      var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');

      controllerScope.vm.activate();

      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      expect(controllerScope.vm.blockers.table_updating).to.equal(true);

      expect(spyCakeCommonUserAdmin.called).to.equal(true);

      controllerScope.$digest();

      expect(spyErrorHandler.calledWithExactly('api error')).to.equal(true);

      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.blockers.table_updating).to.equal(false);

    });

  });

  describe('Functions', function() {

    it('addNewItem - should create new item in database - no itemsDBItem and no vendor given scenario', function() {

      controllerScope.$digest();

      var spyCreateItem = sandbox.spy(controllerScope.vm.cakeItems, 'createItem');
      var spyItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
      var spyGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');

      controllerScope.vm.newItem.locations = ['1'];
      controllerScope.vm.newItem.typeahead.search_text = 'test';
      controllerScope.vm.newItem.form_data.gl_account_id = 2;
      controllerScope.vm.newItem.form_data.count_group_id = 1;
      controllerScope.vm.newItem.form_data.common_unit_id = 1;
      controllerScope.vm.newItem.form_data.new_vendor_conversion_label = 999; // this field should not be sent

      controllerScope.vm.addNewItem();

      expect(controllerScope.vm.blockers.saving).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      expect(spyCreateItem.calledWithExactly({
        gl_account_id: 2,
        count_group_id: 1,
        common_unit_id: 1,
        name: 'test',
        locations: [1],
        item_db_id: undefined
      }, {extended: true})).to.equal(true);

      controllerScope.$digest();

      expect(spyItemLocationsLoad.calledWithExactly(
        {
          '$and': [
            {
              'location_id': [1]
            },
            {
              'inv_item_id': itemsControllerTestsMockedData.new_object_default_id
            }
          ]
        },
        null,
        true
      )).to.equal(true);
      expect(spyGLAccountsLoad.calledWithExactly({id: 2}, null, true)).to.equal(true);

      expect(controllerScope.vm.itemsById[itemsControllerTestsMockedData.new_object_default_id]).to.exist;
      expect(controllerScope.vm.items[0]['id']).to.equal(itemsControllerTestsMockedData.new_object_default_id);

      expect(controllerScope.vm.blockers.saving).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('addNewItem - should create new item in database - itemsDBItem found and no vendor given scenario', function() {

      controllerScope.$digest();

      var spyCreateItem = sandbox.spy(controllerScope.vm.cakeItems, 'createItem');
      var spyItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
      var spyGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');

      controllerScope.vm.newItem.typeahead.items_db_item = {id: 5, name: 'test'};
      controllerScope.vm.newItem.locations = ['1'];
      controllerScope.vm.newItem.form_data.items_db_id = 5;
      controllerScope.vm.newItem.form_data.gl_account_id = 2;
      controllerScope.vm.newItem.form_data.count_group_id = 1;
      controllerScope.vm.newItem.form_data.common_unit_id = 1;
      controllerScope.vm.newItem.form_data.new_vendor_conversion_label = 999; // this field should not be sent

      controllerScope.vm.addNewItem();

      expect(controllerScope.vm.blockers.saving).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      expect(spyCreateItem.calledWithExactly({
        gl_account_id: 2,
        count_group_id: 1,
        common_unit_id: 1,
        name: 'test',
        locations: [1],
        item_db_id: 5
      }, {extended: true, item_db_id: 5})).to.equal(true);

      controllerScope.$digest();

      expect(spyItemLocationsLoad.calledWithExactly(
        {
          '$and': [
            {
              'location_id': [1]
            },
            {
              'inv_item_id': itemsControllerTestsMockedData.new_object_default_id
            }
          ]
        },
        null,
        true
      )).to.equal(true);
      expect(spyGLAccountsLoad.calledWithExactly({id: 2}, null, true)).to.equal(true);

      expect(controllerScope.vm.itemsById[itemsControllerTestsMockedData.new_object_default_id]).to.exist;
      expect(controllerScope.vm.items[0]['id']).to.equal(itemsControllerTestsMockedData.new_object_default_id);

      expect(controllerScope.vm.blockers.saving).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('addNewItem - should create new item in database - itemsDBItem found and vendor data given scenario', function() {
      
      controllerScope.$digest();
      
      var spyCreateItem = sandbox.spy(controllerScope.vm.cakeItems, 'createItem');
      var spyItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
      var spyGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
      var spyItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');
      var spyItemUnitsCreate = sandbox.spy(controllerScope.vm.cakeItemUnits, 'createItemUnit');
      var spyItemUnitLocationsCreate = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'bulkCreateItemUnitLocations');
      var spyVendorItemCreate = sandbox.spy(controllerScope.vm.cakeVendorItems, 'createVendorItem');
      var spyPeachToast = sandbox.spy(controllerScope.vm.$peachToast, 'show');

      controllerScope.vm.newItem.typeahead.items_db_item = {id: 5, name: 'test'};
      controllerScope.vm.newItem.locations = ['1'];
      controllerScope.vm.newItem.form_data.items_db_id = 5;
      controllerScope.vm.newItem.form_data.gl_account_id = 2;
      controllerScope.vm.newItem.form_data.count_group_id = 1;
      controllerScope.vm.newItem.form_data.common_unit_id = 3;
      controllerScope.vm.newItem.form_data.new_vendor_id = '1';
      controllerScope.vm.newItem.form_data.new_vendor_last_price = 100;
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = '2';
      controllerScope.vm.newItem.form_data.new_vendor_unit_conversion = 12.12;

      controllerScope.vm.addNewItem();

      expect(controllerScope.vm.blockers.saving).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      expect(spyCreateItem.calledWithExactly({
        gl_account_id: 2,
        count_group_id: 1,
        common_unit_id: 3,
        name: 'test',
        locations: [1],
        item_db_id: 5
      }, {extended: true, item_db_id: 5})).to.equal(true);

      controllerScope.$digest();

      expect(spyItemLocationsLoad.calledWithExactly(
        {
          '$and': [
            {
              'location_id': [1]
            },
            {
              'inv_item_id': itemsControllerTestsMockedData.new_object_default_id
            }
          ]
        },
        null,
        true
      )).to.equal(true);
      expect(spyGLAccountsLoad.calledWithExactly({id: 2}, null, true)).to.equal(true);

      expect(spyItemUnitsLoad.calledWithExactly(
        {
          'inv_item_id' : itemsControllerTestsMockedData.new_object_default_id,
          'unit_id'     : 2
        },
        null,
        true
      )).to.equal(true);
      expect(spyItemUnitsCreate.calledWithExactly(
        {
          unit_id         : 2,
          unit_quantity   : 12.12,
          is_report_unit  : false,
          inv_item_id     : itemsControllerTestsMockedData.new_object_default_id,
          common_unit_id  : 3,
          description     : 'Bag 12.12 bat'
        }
      )).to.equal(true);
      expect(spyItemUnitLocationsCreate.calledWithExactly(
        [
          {
            inv_item_id       : itemsControllerTestsMockedData.new_object_default_id,
            location_id       : 1,
            inv_item_unit_id  : itemsControllerTestsMockedData.new_object_default_id,
            is_count_unit     : true
          }
        ]
      )).to.equal(true);
      expect(spyVendorItemCreate.calledWithExactly(
        {
          vendor_id         : 1,
          inv_item_id       : itemsControllerTestsMockedData.new_object_default_id,
          inv_item_unit_id  : itemsControllerTestsMockedData.new_object_default_id,
          is_active         : true,
          last_price        : 100,
          last_price_on     : moment().format('YYYY-MM-DD')
        }
      )).to.equal(true);

      expect(controllerScope.vm.itemsById[itemsControllerTestsMockedData.new_object_default_id]).to.exist;
      expect(controllerScope.vm.items[0]['id']).to.equal(itemsControllerTestsMockedData.new_object_default_id);
      expect(controllerScope.vm.itemVendorsById[itemsControllerTestsMockedData.new_object_default_id]).to.exist;
      
      expect(spyPeachToast.calledWithExactly('New item added!')).to.equal(true);

      expect(controllerScope.vm.blockers.saving).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('autoCalculateConversionForNewVendorUnit should set proper conversion values for various units given', function() {
      
      controllerScope.$digest();

      // not existing units scenario
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = 999;
      controllerScope.vm.newItem.form_data.common_unit_id = 1000;
      controllerScope.vm.autoCalculateConversionForNewVendorUnit();
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_conversion).to.equal(1);
      expect(controllerScope.vm.newItem.form_data.new_vendor_disable_conversion).to.equal(false);
      expect(controllerScope.vm.newItem.form_data.new_vendor_conversion_label).to.equal('');
      
      // two each-type units
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = 3;
      controllerScope.vm.newItem.form_data.common_unit_id = 2;
      controllerScope.vm.autoCalculateConversionForNewVendorUnit();
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_conversion).to.equal(1);
      expect(controllerScope.vm.newItem.form_data.new_vendor_disable_conversion).to.equal(false);
      expect(controllerScope.vm.newItem.form_data.new_vendor_conversion_label).to.equal('Bag(s) per Batch');
      
      // two non-each units of the same type
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = 24;
      controllerScope.vm.newItem.form_data.common_unit_id = 15;
      controllerScope.vm.autoCalculateConversionForNewVendorUnit();
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_conversion).to.equal(0.03381);
      expect(controllerScope.vm.newItem.form_data.new_vendor_disable_conversion).to.equal(true);
      expect(controllerScope.vm.newItem.form_data.new_vendor_conversion_label).to.equal('Fluid Ounce(s) per Mililiter');
      
      // two non-each units of different type - no conversion data from itemsDB loaded
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = 21;
      controllerScope.vm.newItem.form_data.common_unit_id = 15;
      controllerScope.vm.autoCalculateConversionForNewVendorUnit();
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_conversion).to.equal(1);
      expect(controllerScope.vm.newItem.form_data.new_vendor_disable_conversion).to.equal(false);
      expect(controllerScope.vm.newItem.form_data.new_vendor_conversion_label).to.equal('Fluid Ounce(s) per Kilogram');
      
      // two non-each units of different type - conversion data from itemsDB loaded
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = 21;
      controllerScope.vm.newItem.form_data.common_unit_id = 15;
      controllerScope.vm.newItem.form_data.items_db_units = {all_units: [{
        abbr: "g",
        created_at: "2014-06-17T15:07:10.619Z",
        created_by: 44,
        english_base: "0.035274",
        id: 17,
        is_common_unit: false,
        is_metric: true,
        items_db_item_unit: {
          common_unit_id: {
            abbr: "floz",
            created_at: "2014-08-12T00:46:49.595Z",
            created_by: 221,
            english_base: "6.000000",
            id: 14,
            is_metric: false,
            metric_base: "29.573500",
            name: "Fluid Ounce",
            type: "volume",
            updated_at: "2014-10-29T09:17:47.816Z",
            updated_by: 142,
          },
          created_at: "2014-10-09T18:40:14.401Z",
          created_by: 142,
          description: "Gram 0.03448 floz",
          id: 1579,
          is_report_unit: false,
          item_id: 585,
          pack_size: null,
          unit_id: {
            abbr: "g",
            created_at: "2014-08-12T00:46:49.596Z",
            created_by: 221,
            english_base: "0.035274",
            id: 16,
            is_metric: true,
            metric_base: "1.000000",
            name: "Gram",
            type: "weight",
            updated_at: "2014-10-29T09:19:28.238Z",
            updated_by: 142,
          },
          unit_quantity: "0.03448",
          updated_at: "2014-10-09T18:40:14.401Z",
          updated_by: null,
        },
        metric_base: "1.000000",
        name: "Gram",
        type: "weight",
        updated_at: "2014-10-29T09:31:54.369Z",
        updated_by: 44
      }]}
      controllerScope.vm.autoCalculateConversionForNewVendorUnit();
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_conversion).to.equal(34.48);
      expect(controllerScope.vm.newItem.form_data.new_vendor_disable_conversion).to.equal(true);
      expect(controllerScope.vm.newItem.form_data.new_vendor_conversion_label).to.equal('Fluid Ounce(s) per Kilogram');

    });

    it('bulkEditItemsCategoryCallback should bulk update selected items with new gl account id and reload table after that', function() {

      controllerScope.$digest();

      var spyItemsUpdate = sandbox.spy(controllerScope.vm.cakeItems, 'bulkUpdateItems');
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyPeachToast = sandbox.spy(controllerScope.vm.$peachToast, 'show');

      controllerScope.vm.bulkEdit.form_data.gl_account_id = 1;
      controllerScope.vm.bulkEdit.checked_items = [{id: 1}, {id: 2}];

      controllerScope.vm.bulkEditItemsCategoryCallback();

      expect(controllerScope.vm.blockers.table_updating).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      expect(spyItemsUpdate.calledWithExactly([{id: 1, gl_account_id: 1}, {id: 2, gl_account_id: 1}])).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.bulkEdit.form_data.gl_account_id).to.equal(null);
      expect(spyItemsLoad.called).to.equal(true);
      expect(spyPeachToast.calledWithExactly('Data updated!')).to.equal(true);

      expect(controllerScope.vm.blockers.table_updating).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('bulkEditItemsCountGroupCallback should bulk update selected items with new count group id and reload table after that', function() {

      controllerScope.$digest();

      var spyItemsUpdate = sandbox.spy(controllerScope.vm.cakeItems, 'bulkUpdateItems');
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyPeachToast = sandbox.spy(controllerScope.vm.$peachToast, 'show');

      controllerScope.vm.bulkEdit.form_data.count_group_id = 1;
      controllerScope.vm.bulkEdit.checked_items = [{id: 1}, {id: 2}];

      controllerScope.vm.bulkEditItemsCountGroupCallback();

      expect(controllerScope.vm.blockers.table_updating).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);

      expect(spyItemsUpdate.calledWithExactly([{id: 1, count_group_id: 1}, {id: 2, count_group_id: 1}])).to.equal(true);

      controllerScope.$digest();

      expect(controllerScope.vm.bulkEdit.form_data.count_group_id).to.equal(null);
      expect(spyItemsLoad.called).to.equal(true);
      expect(spyPeachToast.calledWithExactly('Data updated!')).to.equal(true);

      expect(controllerScope.vm.blockers.table_updating).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('bulkEditItemsLocationsCallback should bulk update selected items assigning/removing them to/from chosen locations, it should also update item units locations and reload table after that', function() {
      
      controllerScope.$digest();
      
      var testItemLocationsCollection = [
        {
          id: 1,
          inv_item_id: 1,
          location_id: 1,
        },
        {
          id: null,
          inv_item_id: 1056,
          location_id: 2
        },
        {
          id: 3,
          inv_item_id: 802,
          location_id: 3,
          to_be_removed: true
        },
        {
          id: 4,
          inv_item_id: 4,
          location_id: 4,
          to_be_removed: false
        }
      ];
      var spyItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');
      var spyItemLocationsCreate = sandbox.spy(controllerScope.vm.cakeItemLocations, 'bulkCreateItemLocations');
      var spyItemLocationsDelete = sandbox.spy(controllerScope.vm.cakeItemLocations, 'bulkDeleteItemLocations');
      var spyItemUnitLocationsCreate = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'bulkCreateItemUnitLocations');
      var spyItemUnitLocationsDelete = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'bulkDeleteItemUnitLocations');
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyPeachToast = sandbox.spy(controllerScope.vm.$peachToast, 'show');
      
      controllerScope.vm.bulkEditItemsLocationsCallback(testItemLocationsCollection);
      
      expect(controllerScope.vm.blockers.table_updating).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      
      controllerScope.$digest();
      
      expect(spyItemUnitsLoad.calledWithExactly({'inv_item_id': [1,1056,802,4]}, null, true)).to.equal(true);
      expect(spyItemLocationsCreate.calledWithExactly([{inv_item_id: 1056, location_id: 2}])).to.equal(true);
      expect(spyItemLocationsDelete.calledWithExactly([3])).to.equal(true);
      expect(spyItemUnitLocationsCreate.calledWithExactly([{inv_item_id: "1056", inv_item_unit_id: 4762, is_count_unit: true, location_id: 2}])).to.equal(true);
      expect(spyItemUnitLocationsDelete.calledWithExactly(
        {
          location_ids  : [3],
          find          : {
            'inv_item_id' : [802]
          }
        }
      )).to.equal(true);
      
      expect(spyItemsLoad.called).to.equal(true);
      expect(spyPeachToast.calledWithExactly('Data updated!')).to.equal(true);

      expect(controllerScope.vm.blockers.table_updating).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('clearFilters should clear selected custom filters and reload data', function() {

      controllerScope.$digest();

      var spyReload = sandbox.spy(controllerScope.vm, 'filterTable');

      controllerScope.vm.filters.count_group_id = 5;
      controllerScope.vm.filters.show_inactive_items = true;
      controllerScope.vm.customFiltersApplied = true;

      controllerScope.vm.clearFilters();

      expect(spyReload.called).to.equal(true);

    });

    it('closeBulkEdit should hide bulk edit form and reset the bulk edit data', function() {

      controllerScope.$digest();

      controllerScope.vm.bulkEdit.show_form = true;
      controllerScope.vm.bulkEdit.form_data.count_group_id = 1;

      controllerScope.vm.closeBulkEdit();

      expect(controllerScope.vm.bulkEdit).to.deep.equal({
        is_enabled    : false,
        show_form     : false,
        form_data     : {},
        checked_items : []
      });

    });

    it('closeNewItemForm should reset new item form data and hide it (eventually clear temp gl account)', function() {

      controllerScope.$digest();

      controllerScope.vm.newItem.show_form = true;
      controllerScope.vm.newItem.form_data.count_group_id = 1;

      controllerScope.vm.closeNewItemForm();

      expect(controllerScope.vm.newItem).to.deep.equal({
        show_form               : false,
        form_data               : {},
        locations               : [],
        typeahead               : {}
      });
      expect(controllerScope.vm.glAccountsById[0]).not.to.exist;

    });

    it('filterTable should go to 1st page and use onPaginationChangeCallback to reload data with filters applied', function() {

      controllerScope.$digest();

      var spyReload = sandbox.spy(controllerScope.vm, 'onPaginationChangeCallback');

      controllerScope.vm.pagination.page_no = 10;

      controllerScope.vm.filterTable();

      expect(controllerScope.vm.pagination.page_no).to.equal(1);
      expect(spyReload.called).to.equal(true);

    });

    it('loadNewItemTypeaheadOptions should return a promise with typeahead results from typeahead helper service', function() {

      controllerScope.$digest();

      var searchText = 'test';
      var results;
      var spyTypeahead = sandbox.spy(controllerScope.vm.cakeTypeaheadHelper, 'typeaheadDataLoad');
      
      controllerScope.vm.newItem.typeahead.search_text = searchText;
      
      var results = controllerScope.vm.loadNewItemTypeaheadOptions();
      
      controllerScope.$digest();
      
      expect(spyTypeahead.called).to.equal(true);

    });

    it('newItemFormTypeaheadSearchTextCallback should check if given item name already exists in database, depending on this it should pre-set some new item values and display validation error', function() {
      
      controllerScope.$digest();
      
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');

      inject(function($compile) {
        
        var element = angular.element(
          '<form name="vm.forms.newItemForm">' +
            '<input type="text" name="newItemName" ng-model="vm.newItem.typeahead.search_text">' +
          '</form>'
        );
        $compile(element)(controllerScope);
        
        controllerScope.vm.newItem.typeahead.search_text = '';
        controllerScope.vm.newItemFormTypeaheadSearchTextCallback();
        controllerScope.$digest();
        expect(controllerScope.vm.newItem.locations).to.deep.equal([]);
        expect(controllerScope.vm.newItem.form_data.gl_account_id).to.equal(null);
        expect(controllerScope.vm.newItem.form_data.count_group_id).to.equal(null);
        expect(spyItemsLoad.called).to.equal(false);
        expect(controllerScope.vm.forms.newItemForm.newItemName.$valid).to.equal(true);
        
        controllerScope.vm.newItem.typeahead.search_text = 'test';
        controllerScope.vm.newItemFormTypeaheadSearchTextCallback();
        controllerScope.$digest();
        expect(controllerScope.vm.newItem.locations).to.deep.equal(_.pluck(itemsControllerTestsMockedData.active_locations, 'id'));
        expect(controllerScope.vm.newItem.form_data.gl_account_id).to.equal(null);
        expect(controllerScope.vm.newItem.form_data.count_group_id).to.equal(itemsControllerTestsMockedData.count_groups_response.trigger_response.default_count_group.id);
        expect(spyItemsLoad.calledWithExactly(
          {
            'name' : 'test'
          },
          {
            fields: 'id',
            limit: 1
          },
          true
        )).to.equal(true);
        expect(controllerScope.vm.forms.newItemForm.newItemName.$valid).to.equal(false);
        expect(controllerScope.vm.forms.newItemForm.newItemName.$error).to.deep.equal({'unique': true});
        
      });

    });

    it('newItemFormTypeaheadSelectedItemCallback should pre-set new item values properly, according to selected itemsDB item data', function() {
      
      controllerScope.$digest();
      
      var deferred = $q.defer();
          deferred.resolve({id: 0, name: 'test gl from category'});
      var spyVendorsDataReset = sandbox.spy(controllerScope.vm, 'resetNewItemVendorData');
      var stubCakeItemsDBGLAccount = sandbox.stub(controllerScope.vm.cakeItemsDBItems, 'getItemsDBItemGLAccountFromCategoryId', function() { return deferred.promise; });
      var spyCakeItemsDBUnits = sandbox.spy(controllerScope.vm.cakeItemsDBItems, 'getItemsDBItemUnits');
      
      // no name in typeahead, nothing selected
      controllerScope.vm.newItem.typeahead.items_db_item = null;
      controllerScope.vm.newItem.typeahead.search_text = '';
      controllerScope.vm.newItemFormTypeaheadSelectedItemCallback();
      controllerScope.$digest();
      expect(controllerScope.vm.glAccountsById[0]).not.to.exist;
      expect(controllerScope.vm.newItem.locations).to.deep.equal([]);
      expect(controllerScope.vm.newItem.form_data.gl_account_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.count_group_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.items_db_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.common_unit_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.items_db_units).to.deep.equal({
        common_unit: null,
        all_units: []
      });
      expect(spyVendorsDataReset.callCount).to.equal(1);
      
      // name given, but no itemsdb item selected
      controllerScope.vm.newItem.typeahead.items_db_item = null;
      controllerScope.vm.newItem.typeahead.search_text = 'test';
      controllerScope.vm.newItemFormTypeaheadSelectedItemCallback();
      controllerScope.$digest();
      expect(controllerScope.vm.glAccountsById[0]).not.to.exist;
      expect(controllerScope.vm.newItem.locations).to.deep.equal(_.pluck(itemsControllerTestsMockedData.active_locations, 'id'));
      expect(controllerScope.vm.newItem.form_data.gl_account_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.count_group_id).to.equal(itemsControllerTestsMockedData.count_groups_response.trigger_response.default_count_group.id);
      expect(controllerScope.vm.newItem.form_data.items_db_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.common_unit_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.items_db_units).to.deep.equal({
        common_unit: null,
        all_units: []
      });
      expect(spyVendorsDataReset.callCount).to.equal(2);
      
      // name given and itemsdb item selected
      controllerScope.vm.newItem.typeahead.items_db_item = {id: 1, category_id: 2};
      controllerScope.vm.newItem.typeahead.search_text = 'test';
      controllerScope.vm.newItemFormTypeaheadSelectedItemCallback();
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(stubCakeItemsDBGLAccount.calledWithExactly(2)).to.equal(true);
      expect(controllerScope.vm.glAccountsById[0]).to.exist;
      expect(controllerScope.vm.newItem.locations).to.deep.equal(_.pluck(itemsControllerTestsMockedData.active_locations, 'id'));
      expect(controllerScope.vm.newItem.form_data.gl_account_id).to.equal(0);
      expect(controllerScope.vm.newItem.form_data.count_group_id).to.equal(itemsControllerTestsMockedData.count_groups_response.trigger_response.default_count_group.id);
      expect(controllerScope.vm.newItem.form_data.items_db_id).to.equal(1);
      expect(spyCakeItemsDBUnits.calledWithExactly(1)).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyVendorsDataReset.callCount).to.equal(3);

    });

    it('onBulkEditModeChangeCallback should toggle bulk edit mode', function() {

      controllerScope.$digest();

      var spyOpenBulkEdit = sandbox.spy(controllerScope.vm, 'openBulkEdit');
      var spyCloseBulkEdit = sandbox.spy(controllerScope.vm, 'closeBulkEdit');

      controllerScope.vm.bulkEdit.is_enabled = true;

      controllerScope.vm.onBulkEditModeChangeCallback();

      expect(spyOpenBulkEdit.callCount).to.equal(1);
      expect(spyCloseBulkEdit.callCount).to.equal(0);

      controllerScope.vm.bulkEdit.is_enabled = false;

      controllerScope.vm.onBulkEditModeChangeCallback();

      expect(spyOpenBulkEdit.callCount).to.equal(1); // previous text triggered this
      expect(spyCloseBulkEdit.callCount).to.equal(1);

    });

    it('onPaginationChangeCallback - should load and parse data - no filters scenario', function() {
      
      controllerScope.$digest();
      
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
      var spyVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
      var spyCloseNewItemForm = sandbox.spy(controllerScope.vm, 'closeNewItemForm');
      var spyPeachToast = sandbox.spy(controllerScope.vm.$peachToast, 'show');
      
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 100;
      controllerScope.vm.tableSort = {order: 'asc', field: 'name'};
      
      controllerScope.vm.onPaginationChangeCallback();
      
      expect(controllerScope.vm.blockers.table_updating).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      
      controllerScope.$digest();
      
      expect(spyCloseNewItemForm.called).to.equal(true);
      expect(spyItemsLoad.calledWithExactly(
        {'$and': [{is_active: true}]},
        {'page': 1, 'limit': 100, 'sort': 'name'}
      )).to.equal(true);
      expect(spyPeachToast.called).to.equal(false);
      
      expect(controllerScope.vm.pagination.total_items).to.equal(itemsControllerTestsMockedData.items_response.count);
      
      expect(spyItemLocationsLoad.calledWithExactly(
        {
          '$and': [
            {
              'location_id': _.pluck(itemsControllerTestsMockedData.active_locations, 'id')
            },
            {
              'inv_item_id': _.keys(controllerScope.vm.cakeItems.getItemsCollection())
            }
          ]
        }
      )).to.equal(true);
      expect(spyVendorItemsLoad.calledWithExactly(
        {
          'inv_item_id': _.keys(controllerScope.vm.cakeItems.getItemsCollection())
        }
      )).to.equal(true);
      
      expect(controllerScope.vm.items.length).to.equal(itemsControllerTestsMockedData.items_response.count);
      expect(_.keys(controllerScope.vm.itemsById).length).to.equal(itemsControllerTestsMockedData.items_response.count);
      expect(controllerScope.vm.items[0]).to.contain.all.keys(['glAccount', 'glAccountName', 'countGroup', 'countGroupName', 'commonUnit', 'commonUnitName', 'locations', 'itemLocations', 'locationsNames', 'vendors', 'vendorsById', 'itemVendors', 'vendorsNames']);
      
      expect(controllerScope.vm.itemLocations.length).to.equal(itemsControllerTestsMockedData.item_locations_response.count);
      expect(_.keys(controllerScope.vm.itemLocationsById).length).to.equal(itemsControllerTestsMockedData.item_locations_response.count);
      expect(controllerScope.vm.itemLocations[0]).to.contain.all.keys(['location']);
      
      expect(controllerScope.vm.itemVendors.length).to.equal(itemsControllerTestsMockedData.vendor_items_response.count);
      expect(_.keys(controllerScope.vm.itemVendorsById).length).to.equal(itemsControllerTestsMockedData.vendor_items_response.count);
      expect(controllerScope.vm.itemVendors[0]).to.contain.all.keys(['vendor']);
      
      expect(controllerScope.vm.blockers.table_updating).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.customFiltersApplied).to.equal(false);

    });
    
    it('onPaginationChangeCallback - should load and parse data - all possible filters scenario', function() {
      
      controllerScope.$digest();
      
      var spyItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
      var spyItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
      var spyVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
      var spyCloseNewItemForm = sandbox.spy(controllerScope.vm, 'closeNewItemForm');
      var spyPeachToast = sandbox.spy(controllerScope.vm.$peachToast, 'show');
      
      controllerScope.vm.pagination.page_no = 1;
      controllerScope.vm.pagination.limit = 100;
      controllerScope.vm.filters.location_id = 1;
      controllerScope.vm.filters.vendor_id = 2;
      controllerScope.vm.filters.gl_account_id = 3;
      controllerScope.vm.filters.count_group_id = 4;
      controllerScope.vm.filters.show_inactive_items = true;
      controllerScope.vm.searchParams.searchQuery = 'test';
      controllerScope.vm.tableSort = {order: 'asc', field: 'name'};
      
      controllerScope.vm.onPaginationChangeCallback();
      
      expect(controllerScope.vm.blockers.table_updating).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      
      controllerScope.$digest();
      
      expect(spyCloseNewItemForm.called).to.equal(true);
      
      expect(spyItemLocationsLoad.calledWith(
        {
          'location_id': 1
        }
      )).to.equal(true);
      expect(spyVendorItemsLoad.calledWith(
        {
          'vendor_id': 2
        }
      )).to.equal(true);
      
      expect(spyItemsLoad.calledWithExactly(
        {'$and': [{name:{"$like":"test"}},{gl_account_id:3},{count_group_id:4},{id:[802, 1056]}]},
        {'page': 1, 'limit': 100, 'sort': 'name'}
      )).to.equal(true);
      expect(spyPeachToast.called).to.equal(false);
      
      expect(controllerScope.vm.pagination.total_items).to.equal(itemsControllerTestsMockedData.items_response.count);
      
      expect(spyItemLocationsLoad.calledWith(
        {
          '$and': [
            {
              'location_id': _.pluck(itemsControllerTestsMockedData.active_locations, 'id')
            },
            {
              'inv_item_id': _.keys(controllerScope.vm.cakeItems.getItemsCollection())
            }
          ]
        }
      )).to.equal(true);
      expect(spyVendorItemsLoad.calledWith(
        {
          'inv_item_id': _.keys(controllerScope.vm.cakeItems.getItemsCollection())
        }
      )).to.equal(true);
      
      expect(controllerScope.vm.items.length).to.equal(itemsControllerTestsMockedData.items_response.count);
      expect(_.keys(controllerScope.vm.itemsById).length).to.equal(itemsControllerTestsMockedData.items_response.count);
      expect(controllerScope.vm.items[0]).to.contain.all.keys(['glAccount', 'glAccountName', 'countGroup', 'countGroupName', 'commonUnit', 'commonUnitName', 'locations', 'itemLocations', 'locationsNames', 'vendors', 'vendorsById', 'itemVendors', 'vendorsNames']);
      
      expect(controllerScope.vm.itemLocations.length).to.equal(itemsControllerTestsMockedData.item_locations_response.count);
      expect(_.keys(controllerScope.vm.itemLocationsById).length).to.equal(itemsControllerTestsMockedData.item_locations_response.count);
      expect(controllerScope.vm.itemLocations[0]).to.contain.all.keys(['location']);
      
      expect(controllerScope.vm.itemVendors.length).to.equal(itemsControllerTestsMockedData.vendor_items_response.count);
      expect(_.keys(controllerScope.vm.itemVendorsById).length).to.equal(itemsControllerTestsMockedData.vendor_items_response.count);
      expect(controllerScope.vm.itemVendors[0]).to.contain.all.keys(['vendor']);
      
      expect(controllerScope.vm.blockers.table_updating).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(controllerScope.vm.customFiltersApplied).to.equal(true);

    });

    it('onSearchPhraseUpdateCallback should call filterTable to update results', function() {

      controllerScope.$digest();

      var spyReload = sandbox.spy(controllerScope.vm, 'filterTable');

      controllerScope.vm.onSearchPhraseUpdateCallback();

      expect(spyReload.called).to.equal(true);

    });

    it('openAddActiveLocationModal should redirect to \'activate location\' modal', function() {

      controllerScope.$digest();

      controllerScope.vm.openAddActiveLocationModal();

      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/add_active_location');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');

    });

    it('openBulkEdit should open bulk edit form and eventually close new item form', function() {

      controllerScope.$digest();

      var spyCloseNewItemForm = sandbox.spy(controllerScope.vm, 'closeNewItemForm');

      controllerScope.vm.bulkEdit.is_enabled = false;
      controllerScope.vm.bulkEdit.show_form = false;

      controllerScope.vm.openBulkEdit();

      expect(controllerScope.vm.bulkEdit.is_enabled).to.equal(true);
      expect(controllerScope.vm.bulkEdit.show_form).to.equal(true);
      expect(spyCloseNewItemForm.called).to.equal(true);

    });

    it('openEditItemModal should redirect to edit item page', function() {

      var testId = 1;

      controllerScope.$digest();

      controllerScope.vm.openEditItemModal(testId);

      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/edit_item');
      expect(controllerScope.vm.$location.search()['id']).to.be.equal(testId);

    });

    it('openItemsDBSearchModal should redirect to \'bulk add items\' page', function() {

      controllerScope.$digest();

      controllerScope.vm.openItemsDBSearchModal();

      expect(controllerScope.vm.$location.path()).to.be.equal('/settings/bulk_add_items');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');

    });

    it('openNewItemForm should open new item form, eventually exit bulk edit mode', function() {

      controllerScope.$digest();

      var spyCloseBulkEditForm = sandbox.spy(controllerScope.vm, 'closeBulkEdit');

      controllerScope.vm.newItem.form_data.is_active = false;
      controllerScope.vm.newItem.show_form = false;

      controllerScope.vm.openNewItemForm();

      expect(controllerScope.vm.newItem.form_data.is_active).to.equal(true);
      expect(controllerScope.vm.newItem.show_form).to.equal(true);
      expect(spyCloseBulkEditForm.called).to.equal(true);

    });

    it('resetNewItemVendorData should reset vendor item data part of the new item form', function() {

      controllerScope.$digest();

      controllerScope.vm.newItem.form_data.new_vendor_id = 1;
      controllerScope.vm.newItem.form_data.new_vendor_unit_id = 1;
      controllerScope.vm.newItem.form_data.new_vendor_unit_conversion = 1;
      controllerScope.vm.newItem.form_data.new_vendor_last_price = 1;
      controllerScope.vm.newItem.form_data.new_vendor_disable_conversion = true;
      controllerScope.vm.newItem.form_data.new_vendor_conversion_label = 'test';

      controllerScope.vm.resetNewItemVendorData();

      expect(controllerScope.vm.newItem.form_data.new_vendor_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_id).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.new_vendor_unit_conversion).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.new_vendor_last_price).to.equal(null);
      expect(controllerScope.vm.newItem.form_data.new_vendor_disable_conversion).to.equal(false);
      expect(controllerScope.vm.newItem.form_data.new_vendor_conversion_label).to.equal('');

    });

    it('toggleInactiveItems should toggle inactive items filter and reload data', function() {

      controllerScope.$digest();

      var spyReload = sandbox.spy(controllerScope.vm, 'filterTable');

      controllerScope.vm.filters.show_inactive_items = true;

      controllerScope.vm.toggleInactiveItems();

      expect(controllerScope.vm.filters.show_inactive_items).to.equal(false);
      expect(spyReload.called).to.equal(true);

    });

    it('errorHandler should display message, eventually log message and call callback', function() {

      var spyCallback = sandbox.stub();
      var spyCakeCommonAPIError = sandbox.spy(controllerScope.vm.cakeCommon, 'apiErrorHandler');
      var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
      var messageString = 'some error message';
      var messageObject = {someval: 1};

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

      controllerScope.vm.userInfo = {message: 'message',type: 'error'};

      controllerScope.vm.hideMessage();

      expect(controllerScope.vm.userInfo.message).to.equal('');
      expect(controllerScope.vm.userInfo.type).to.equal('');

    });

    it('showMessage should set user message data accoring to params', function() {

      var messageString = 'some message';
      var typeString = 'alert';
      var defaultType = 'info'

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