describe("Controller: Edit Count", function() {

  var expect = chai.expect;
  var sandbox = sinon.sandbox.create();

  var editCountControllerTestsMockedData = {
    task_id                     : 1, 
    is_user_account_admin       : true,
    is_dev_preview_mode_running : false,
    float_regex                 : /^\s*[-+]?(\d{0,9}\.?\d{0,5}|\d{1,9}\.)\s*$/i,
    user                        : {first_name: 'test', last_name: 'tester', id: 44},
    gl_accounts_response        : {"count": 14, "results":[{"is_active":true,"subtype":"food","type":"COGS","description":"Our food costs","number":"3001","name":"Food","parent_id":null,"id":1,"created_by":44,"created_at":"2014-09-19T10:11:37.735Z","updated_by":null,"updated_at":"2014-09-19T10:11:37.735Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Default","parent_id":null,"id":2,"created_by":44,"created_at":"2014-09-19T10:17:54.819Z","updated_by":44,"updated_at":"2014-09-22T09:53:23.678Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Produce","parent_id":1,"id":10,"created_by":44,"created_at":"2014-09-23T10:29:24.754Z","updated_by":null,"updated_at":"2014-09-23T10:29:24.754Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Dairy","parent_id":1,"id":11,"created_by":44,"created_at":"2014-09-23T10:51:04.206Z","updated_by":null,"updated_at":"2014-09-23T10:51:04.206Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Alcohol","parent_id":null,"id":12,"created_by":44,"created_at":"2014-09-24T10:33:10.579Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.579Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Liquor","parent_id":12,"id":13,"created_by":44,"created_at":"2014-09-24T10:33:10.670Z","updated_by":null,"updated_at":"2014-09-24T10:33:10.670Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Seafood","parent_id":1,"id":14,"created_by":44,"created_at":"2014-10-02T09:49:58.100Z","updated_by":null,"updated_at":"2014-10-02T09:49:58.100Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Poultry","parent_id":1,"id":15,"created_by":44,"created_at":"2014-10-02T20:34:17.138Z","updated_by":null,"updated_at":"2014-10-02T20:34:17.138Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beer","parent_id":12,"id":16,"created_by":44,"created_at":"2014-10-08T20:58:59.896Z","updated_by":null,"updated_at":"2014-10-08T20:58:59.896Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Meat","parent_id":1,"id":17,"created_by":44,"created_at":"2014-10-27T18:05:32.807Z","updated_by":null,"updated_at":"2014-10-27T18:05:32.807Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Beverages","parent_id":1,"id":28,"created_by":44,"created_at":"2014-11-14T08:25:00.699Z","updated_by":null,"updated_at":"2014-11-14T08:25:00.699Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Misc. Food","parent_id":1,"id":30,"created_by":44,"created_at":"2015-01-22T13:31:10.619Z","updated_by":null,"updated_at":"2015-01-22T13:31:10.619Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Wine","parent_id":12,"id":32,"created_by":44,"created_at":"2015-05-14T20:08:31.553Z","updated_by":null,"updated_at":"2015-05-14T20:08:31.553Z"},{"is_active":true,"subtype":null,"type":"COGS","description":null,"number":null,"name":"Bread","parent_id":1,"id":35,"created_by":44,"created_at":"2015-07-17T09:09:59.773Z","updated_by":null,"updated_at":"2015-07-17T09:09:59.773Z"}]},
    count_groups_response       : {"count":11,"results":[{"schedule_days":null,"next_date":"2015-08-30","start_date":"2015-08-23","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"Default count group","name":"A","id":65,"created_by":44,"created_at":"2015-07-20T13:54:14.714Z","updated_by":44,"updated_at":"2015-08-28T13:10:34.290Z"},{"schedule_days":null,"next_date":"2016-02-01","start_date":"2015-10-01","is_active":true,"is_default":false,"schedule_interval":4,"schedule_type":"month","description":null,"name":"B","id":67,"created_by":44,"created_at":"2015-07-20T14:00:29.343Z","updated_by":44,"updated_at":"2015-11-18T19:31:29.414Z"},{"schedule_days":null,"next_date":"2015-12-13","start_date":"2015-12-06","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"C","id":91,"created_by":44,"created_at":"2015-12-08T18:56:25.592Z","updated_by":null,"updated_at":"2015-12-08T18:56:25.592Z"},{"schedule_days":null,"next_date":"2015-09-01","start_date":"2015-08-01","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"month","description":"","name":"Group Aug 4th","id":80,"created_by":44,"created_at":"2015-08-04T16:58:57.582Z","updated_by":null,"updated_at":"2015-08-04T16:58:57.582Z"},{"schedule_days":null,"next_date":"2015-08-09","start_date":"2015-08-02","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"IPad","id":81,"created_by":44,"created_at":"2015-08-04T17:01:41.824Z","updated_by":null,"updated_at":"2015-08-04T17:01:41.824Z"},{"schedule_days":null,"next_date":"2015-11-22","start_date":"2015-11-15","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"week","description":"","name":"Lorie's count","id":90,"created_by":44,"created_at":"2015-11-20T16:39:34.703Z","updated_by":44,"updated_at":"2015-11-20T16:40:05.401Z"},{"schedule_days":null,"next_date":"2015-09-27","start_date":"2015-09-13","is_active":false,"is_default":false,"schedule_interval":2,"schedule_type":"week","description":"","name":"New","id":82,"created_by":44,"created_at":"2015-08-09T11:22:23.995Z","updated_by":44,"updated_at":"2015-09-17T11:35:19.300Z"},{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":true,"schedule_interval":1,"schedule_type":"month","description":"","name":"New QA Group","id":69,"created_by":44,"created_at":"2015-07-27T20:44:25.376Z","updated_by":44,"updated_at":"2015-11-18T19:36:14.878Z"},{"schedule_days":null,"next_date":"2015-09-27","start_date":"2015-09-13","is_active":false,"is_default":false,"schedule_interval":2,"schedule_type":"week","description":"","name":"Order","id":75,"created_by":44,"created_at":"2015-07-28T14:12:07.167Z","updated_by":44,"updated_at":"2015-09-14T13:40:00.823Z"},{"schedule_days":null,"next_date":"2015-11-29","start_date":"2015-11-15","is_active":true,"is_default":false,"schedule_interval":2,"schedule_type":"week","description":"","name":"Peach West","id":88,"created_by":44,"created_at":"2015-11-18T19:11:37.455Z","updated_by":44,"updated_at":"2015-11-18T19:35:56.720Z"},{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":false,"schedule_interval":1,"schedule_type":"month","description":"","name":"tted","id":89,"created_by":44,"created_at":"2015-11-20T16:08:54.600Z","updated_by":44,"updated_at":"2015-11-20T16:09:04.171Z"}],"trigger_response":{"default_count_group":{"schedule_days":null,"next_date":"2015-12-01","start_date":"2015-11-01","is_active":true,"is_default":true,"schedule_interval":1,"schedule_type":"month","description":"","name":"New QA Group","id":69,"created_by":44,"created_at":"2015-07-27T20:44:25.376Z","updated_by":44,"updated_at":"2015-11-18T19:36:14.878Z"},"default_count_group_included":true}},
    units_response              : {"count":32,"results":[{"type":"each","metric_base":null,"english_base":null,"abbr":"bg","is_metric":false,"name":"Bag","id":2,"created_by":44,"created_at":"2014-06-17T15:01:02.984Z","updated_by":null,"updated_at":"2014-06-30T14:24:50.873Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bat","is_metric":false,"name":"Batch","id":3,"created_by":44,"created_at":"2014-06-17T15:01:34.911Z","updated_by":null,"updated_at":"2014-06-30T14:24:45.030Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bk","is_metric":false,"name":"Block","id":4,"created_by":44,"created_at":"2014-06-17T15:01:54.954Z","updated_by":null,"updated_at":"2014-06-30T14:24:58.654Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bt","is_metric":false,"name":"Bottle","id":5,"created_by":44,"created_at":"2014-06-17T15:02:12.934Z","updated_by":44,"updated_at":"2014-07-15T06:44:11.711Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bx","is_metric":false,"name":"Box","id":6,"created_by":44,"created_at":"2014-06-17T15:02:38.022Z","updated_by":44,"updated_at":"2014-08-26T12:30:16.239Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"bun","is_metric":false,"name":"Bunch","id":7,"created_by":44,"created_at":"2014-06-17T15:03:01.332Z","updated_by":44,"updated_at":"2014-07-15T06:44:36.347Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"can","is_metric":false,"name":"Can","id":8,"created_by":44,"created_at":"2014-06-17T15:03:31.864Z","updated_by":44,"updated_at":"2014-07-15T06:44:42.662Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cs","is_metric":false,"name":"Case","id":9,"created_by":44,"created_at":"2014-06-17T15:03:51.775Z","updated_by":44,"updated_at":"2014-07-15T06:44:52.527Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"cnt","is_metric":false,"name":"Container","id":10,"created_by":44,"created_at":"2014-06-17T15:04:24.853Z","updated_by":44,"updated_at":"2014-07-15T06:45:06.460Z"},{"type":"volume","metric_base":"236.588000","english_base":"48.000000","abbr":"cup","is_metric":false,"name":"Cup","id":11,"created_by":44,"created_at":"2014-06-17T15:04:41.649Z","updated_by":44,"updated_at":"2014-10-29T09:30:33.672Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"doz","is_metric":false,"name":"Dozen","id":12,"created_by":44,"created_at":"2014-06-17T15:04:58.222Z","updated_by":44,"updated_at":"2014-07-15T06:45:34.457Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"ea","is_metric":false,"name":"Each","id":13,"created_by":44,"created_at":"2014-06-17T15:05:15.971Z","updated_by":44,"updated_at":"2014-07-15T06:56:29.997Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"fl","is_metric":false,"name":"Flat","id":14,"created_by":44,"created_at":"2014-06-17T15:05:34.037Z","updated_by":44,"updated_at":"2014-07-15T06:45:39.041Z"},{"type":"volume","metric_base":"29.573500","english_base":"6.000000","abbr":"floz","is_metric":false,"name":"Fluid Ounce","id":15,"created_by":44,"created_at":"2014-06-17T15:06:16.282Z","updated_by":44,"updated_at":"2014-10-29T09:33:41.004Z"},{"type":"volume","metric_base":"3785.410000","english_base":"768.000000","abbr":"gal","is_metric":false,"name":"Gallon","id":16,"created_by":44,"created_at":"2014-06-17T15:06:40.661Z","updated_by":44,"updated_at":"2014-10-29T09:33:04.925Z"},{"type":"weight","metric_base":"1.000000","english_base":"0.035274","abbr":"g","is_metric":true,"name":"Gram","id":17,"created_by":44,"created_at":"2014-06-17T15:07:10.619Z","updated_by":44,"updated_at":"2014-10-29T09:31:54.369Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"head","is_metric":false,"name":"Head","id":18,"created_by":44,"created_at":"2014-06-17T15:08:17.021Z","updated_by":44,"updated_at":"2014-07-15T06:46:32.905Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"jar","is_metric":false,"name":"Jar","id":19,"created_by":44,"created_at":"2014-06-17T15:08:30.161Z","updated_by":44,"updated_at":"2014-07-15T06:46:42.268Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"keg","is_metric":false,"name":"Keg","id":20,"created_by":44,"created_at":"2014-06-17T15:08:46.902Z","updated_by":44,"updated_at":"2014-07-15T06:47:14.297Z"},{"type":"weight","metric_base":"1000.000000","english_base":"35.274000","abbr":"kg","is_metric":true,"name":"Kilogram","id":21,"created_by":44,"created_at":"2014-06-17T15:09:10.677Z","updated_by":44,"updated_at":"2014-10-29T09:38:09.297Z"},{"type":"volume","metric_base":"1000.000000","english_base":"202.884000","abbr":"l","is_metric":true,"name":"Liter","id":22,"created_by":44,"created_at":"2014-06-17T15:09:27.622Z","updated_by":44,"updated_at":"2014-10-29T09:39:31.334Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"loaf","is_metric":false,"name":"Loaf","id":23,"created_by":44,"created_at":"2014-06-17T15:09:48.278Z","updated_by":44,"updated_at":"2014-07-15T06:48:02.764Z"},{"type":"volume","metric_base":"1.000000","english_base":"0.202884","abbr":"ml","is_metric":true,"name":"Mililiter","id":24,"created_by":44,"created_at":"2014-06-17T15:10:13.286Z","updated_by":44,"updated_at":"2014-10-29T09:36:33.872Z"},{"type":"weight","metric_base":"28.349500","english_base":"1.000000","abbr":"oz","is_metric":false,"name":"Ounce","id":25,"created_by":44,"created_at":"2014-06-17T15:10:32.094Z","updated_by":44,"updated_at":"2014-10-29T09:37:21.233Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"pk","is_metric":false,"name":"Pack","id":26,"created_by":44,"created_at":"2014-06-17T15:10:53.143Z","updated_by":44,"updated_at":"2014-09-17T10:54:29.514Z"},{"type":"volume","metric_base":"473.176000","english_base":"96.000000","abbr":"pt","is_metric":false,"name":"Pint","id":27,"created_by":44,"created_at":"2014-06-17T15:11:11.444Z","updated_by":44,"updated_at":"2014-10-29T09:36:04.400Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"por","is_metric":false,"name":"Portion","id":28,"created_by":44,"created_at":"2014-06-17T19:52:02.568Z","updated_by":44,"updated_at":"2014-10-29T09:04:20.432Z"},{"type":"weight","metric_base":"453.592000","english_base":"16.000000","abbr":"pound","is_metric":false,"name":"Pound","id":1,"created_by":44,"created_at":"2014-06-17T08:24:51.310Z","updated_by":44,"updated_at":"2015-11-30T22:02:29.961Z"},{"type":"volume","metric_base":"946.353000","english_base":"192.000000","abbr":"qt","is_metric":false,"name":"Quart","id":31,"created_by":44,"created_at":"2014-06-17T19:53:50.356Z","updated_by":44,"updated_at":"2014-10-29T09:34:22.399Z"},{"type":"each","metric_base":null,"english_base":null,"abbr":"srv","is_metric":false,"name":"Serving","id":33,"created_by":44,"created_at":"2014-06-17T19:54:48.070Z","updated_by":44,"updated_at":"2014-07-15T06:49:52.702Z"},{"type":"volume","metric_base":"14.786800","english_base":"3.000000","abbr":"tbsp","is_metric":false,"name":"Tablespoon","id":34,"created_by":44,"created_at":"2014-06-17T19:55:09.282Z","updated_by":44,"updated_at":"2014-10-29T09:38:47.443Z"},{"type":"volume","metric_base":"4.928920","english_base":"1.000000","abbr":"tsp","is_metric":false,"name":"Teaspoon","id":35,"created_by":44,"created_at":"2014-06-17T19:55:45.634Z","updated_by":44,"updated_at":"2014-10-29T09:39:00.454Z"}]},
    counts_response             : {"count":15,"results":[{"date":"2015-09-10","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"89.00","id":81,"created_by":44,"created_at":"2015-09-08T11:59:37.795Z","updated_by":44,"updated_at":"2015-12-01T16:11:25.834Z","location_id":7,"count_group_id":65},{"date":"2015-09-13","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"87.00","id":82,"created_by":44,"created_at":"2015-09-17T11:00:15.625Z","updated_by":44,"updated_at":"2015-11-10T16:43:58.445Z","location_id":7,"count_group_id":65},{"date":"2015-09-17","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"100.00","id":83,"created_by":44,"created_at":"2015-09-17T11:35:04.916Z","updated_by":44,"updated_at":"2015-10-14T20:58:24.113Z","location_id":7,"count_group_id":82},{"date":"2015-10-08","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"30.00","id":84,"created_by":44,"created_at":"2015-10-02T12:04:03.110Z","updated_by":44,"updated_at":"2015-11-19T17:29:44.003Z","location_id":7,"count_group_id":67},{"date":"2015-08-30","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"39.00","id":76,"created_by":44,"created_at":"2015-08-28T15:18:15.312Z","updated_by":44,"updated_at":"2015-11-17T09:47:10.517Z","location_id":7,"count_group_id":67},{"date":"2015-08-17","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"100.00","id":104,"created_by":44,"created_at":"2015-10-30T11:13:06.417Z","updated_by":44,"updated_at":"2015-11-20T13:10:40.313Z","location_id":7,"count_group_id":81},{"date":"2015-08-10","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"67.00","id":102,"created_by":44,"created_at":"2015-10-30T11:05:43.197Z","updated_by":44,"updated_at":"2015-11-20T13:17:12.820Z","location_id":7,"count_group_id":81},{"date":"2015-09-16","task_id":null,"time":null,"notes":"1313","is_complete":false,"is_opening":true,"percent_complete":"91.00","id":97,"created_by":44,"created_at":"2015-10-22T13:45:30.144Z","updated_by":44,"updated_at":"2015-11-20T16:03:09.233Z","location_id":7,"count_group_id":65},{"date":"2015-10-09","task_id":null,"time":null,"notes":"","is_complete":true,"is_opening":true,"percent_complete":"38.00","id":85,"created_by":44,"created_at":"2015-10-02T17:14:46.505Z","updated_by":44,"updated_at":"2015-11-19T17:34:24.966Z","location_id":7,"count_group_id":67},{"date":"2015-09-18","task_id":null,"time":null,"notes":"","is_complete":true,"is_opening":true,"percent_complete":"98.00","id":80,"created_by":44,"created_at":"2015-09-08T11:56:07.723Z","updated_by":44,"updated_at":"2015-11-20T16:02:58.145Z","location_id":7,"count_group_id":65},{"date":"2015-08-20","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"60.00","id":105,"created_by":44,"created_at":"2015-10-30T11:58:09.568Z","updated_by":44,"updated_at":"2015-12-01T15:24:16.062Z","location_id":7,"count_group_id":81},{"date":"2015-10-08","task_id":null,"time":null,"notes":"","is_complete":false,"is_opening":true,"percent_complete":"93.00","id":87,"created_by":44,"created_at":"2015-10-08T21:23:29.482Z","updated_by":44,"updated_at":"2015-12-01T16:08:48.426Z","location_id":7,"count_group_id":65},{"date":"2015-10-13","task_id":null,"time":null,"notes":"","is_complete":true,"is_opening":true,"percent_complete":"98.00","id":91,"created_by":44,"created_at":"2015-10-13T20:47:08.979Z","updated_by":44,"updated_at":"2015-12-04T16:51:36.018Z","location_id":7,"count_group_id":65},{"date":"2015-08-16","task_id":null,"time":null,"notes":"","is_complete":true,"is_opening":true,"percent_complete":"60.00","id":103,"created_by":44,"created_at":"2015-10-30T11:10:05.564Z","updated_by":44,"updated_at":"2015-12-04T17:04:45.574Z","location_id":7,"count_group_id":81},{"date":"2015-10-11","task_id":null,"time":null,"notes":"","is_complete":true,"is_opening":true,"percent_complete":"93.00","id":90,"created_by":44,"created_at":"2015-10-13T20:46:26.590Z","updated_by":44,"updated_at":"2015-11-30T12:32:21.728Z","location_id":7,"count_group_id":65}]},
    opening_counts_response     : {"count":4,"results":[{"count_date":"2015-08-30","id":6,"created_by":44,"created_at":"2015-08-28T15:18:15.457Z","updated_by":null,"updated_at":"2015-08-28T15:18:15.457Z","location_id":7,"count_group_id":67},{"count_date":"2015-09-10","id":10,"created_by":44,"created_at":"2015-09-08T11:56:07.874Z","updated_by":44,"updated_at":"2015-09-17T11:33:15.733Z","location_id":7,"count_group_id":65},{"count_date":"2015-09-17","id":11,"created_by":44,"created_at":"2015-09-17T11:35:05.059Z","updated_by":44,"updated_at":"2015-09-29T11:45:28.192Z","location_id":7,"count_group_id":82},{"count_date":"2015-08-10","id":17,"created_by":44,"created_at":"2015-10-30T11:05:43.335Z","updated_by":null,"updated_at":"2015-10-30T11:05:43.335Z","location_id":7,"count_group_id":81}]},
    item_locations_response     : {"count":5,"results":[{"starting_cost":"5.00000","last_cost":"17.50000","opening_count_date":null,"is_hot_count":false,"id":1779,"created_by":44,"created_at":"2015-08-28T01:09:39.602Z","updated_by":44,"updated_at":"2015-11-19T16:44:36.970Z","location_id":7,"inv_item_id":802},{"starting_cost":"0.00000","last_cost":"0.66667","opening_count_date":"2015-08-10","is_hot_count":false,"id":1105,"created_by":44,"created_at":"2015-08-07T17:52:10.231Z","updated_by":44,"updated_at":"2015-10-30T12:44:04.843Z","location_id":7,"inv_item_id":1392},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":"2015-08-10","is_hot_count":false,"id":1581,"created_by":44,"created_at":"2015-08-27T11:13:50.577Z","updated_by":44,"updated_at":"2015-10-30T12:44:04.846Z","location_id":7,"inv_item_id":1421},{"starting_cost":"0.00000","last_cost":"0.00000","opening_count_date":null,"is_hot_count":false,"id":6763,"created_by":44,"created_at":"2015-12-17T17:41:54.307Z","updated_by":null,"updated_at":"2015-12-17T17:41:54.307Z","location_id":7,"inv_item_id":1730},{"starting_cost":"20.00000","last_cost":"20.00000","opening_count_date":null,"is_hot_count":false,"id":5937,"created_by":44,"created_at":"2015-11-17T16:02:17.680Z","updated_by":44,"updated_at":"2015-11-20T13:17:19.794Z","location_id":7,"inv_item_id":1660}]},
    vendor_locations_response   : {"count":4,"results":[{"customer_number":"","id":213,"created_by":44,"created_at":"2015-10-13T20:29:38.710Z","updated_by":44,"updated_at":"2015-12-04T14:10:07.150Z","location_id":7,"vendor_id":17},{"customer_number":"","id":221,"created_by":44,"created_at":"2015-10-14T00:06:17.952Z","updated_by":null,"updated_at":"2015-10-14T00:06:17.952Z","location_id":7,"vendor_id":18},{"customer_number":"","id":245,"created_by":44,"created_at":"2015-11-18T19:13:17.484Z","updated_by":44,"updated_at":"2015-11-18T19:13:43.677Z","location_id":7,"vendor_id":21},{"customer_number":"","id":192,"created_by":44,"created_at":"2015-09-28T11:11:17.883Z","updated_by":44,"updated_at":"2015-12-11T11:16:35.755Z","location_id":7,"vendor_id":1}]},
    count_items_response        : {"count":14,"results":[{"common_unit_quantity":"2.11855","quantity":"5.00000","details_json":null,"id":6296,"created_by":44,"created_at":"2015-11-20T13:17:19.290Z","updated_by":null,"updated_at":"2015-11-20T13:17:19.290Z","location_id":7,"inv_item_id":1660,"inv_item_unit_id":4654,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"0.55965","quantity":"5.00000","details_json":null,"id":6295,"created_by":44,"created_at":"2015-11-20T13:17:12.330Z","updated_by":null,"updated_at":"2015-11-20T13:17:12.330Z","location_id":7,"inv_item_id":1660,"inv_item_unit_id":4657,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6101,"created_by":44,"created_at":"2015-10-30T11:06:21.563Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.563Z","location_id":7,"inv_item_id":1525,"inv_item_unit_id":4320,"common_unit_id":15,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6100,"created_by":44,"created_at":"2015-10-30T11:06:21.562Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.562Z","location_id":7,"inv_item_id":1525,"inv_item_unit_id":4319,"common_unit_id":15,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6099,"created_by":44,"created_at":"2015-10-30T11:06:21.562Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.562Z","location_id":7,"inv_item_id":1525,"inv_item_unit_id":4318,"common_unit_id":15,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6098,"created_by":44,"created_at":"2015-10-30T11:06:21.562Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.562Z","location_id":7,"inv_item_id":1421,"inv_item_unit_id":4056,"common_unit_id":15,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6097,"created_by":44,"created_at":"2015-10-30T11:06:21.562Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.562Z","location_id":7,"inv_item_id":1421,"inv_item_unit_id":4055,"common_unit_id":15,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6096,"created_by":44,"created_at":"2015-10-30T11:06:21.560Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.560Z","location_id":7,"inv_item_id":1421,"inv_item_unit_id":4054,"common_unit_id":15,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6095,"created_by":44,"created_at":"2015-10-30T11:06:21.559Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.559Z","location_id":7,"inv_item_id":1392,"inv_item_unit_id":3971,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6094,"created_by":44,"created_at":"2015-10-30T11:06:21.559Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.559Z","location_id":7,"inv_item_id":1392,"inv_item_unit_id":3969,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6093,"created_by":44,"created_at":"2015-10-30T11:06:21.559Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.559Z","location_id":7,"inv_item_id":1392,"inv_item_unit_id":3970,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6092,"created_by":44,"created_at":"2015-10-30T11:06:21.558Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.558Z","location_id":7,"inv_item_id":1392,"inv_item_unit_id":3967,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"0.00000","quantity":"0.00000","details_json":null,"id":6091,"created_by":44,"created_at":"2015-10-30T11:06:21.555Z","updated_by":null,"updated_at":"2015-10-30T11:06:21.555Z","location_id":7,"inv_item_id":1392,"inv_item_unit_id":3968,"common_unit_id":1,"inv_count_id":102},{"common_unit_quantity":"338.14000","quantity":"10.00000","details_json":null,"id":6090,"created_by":44,"created_at":"2015-10-30T11:05:58.576Z","updated_by":null,"updated_at":"2015-10-30T11:05:58.576Z","location_id":7,"inv_item_id":1525,"inv_item_unit_id":4321,"common_unit_id":15,"inv_count_id":102}]},
    items_response              : {"count":6,"results":[{"common_unit_cost":"1.03478","description":"","name":"Absolut Cherrykran","report_unit_cost":"34.99000","total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":25,"id":802,"created_by":44,"created_at":"2014-10-31T16:07:27.169Z","updated_by":44,"updated_at":"2015-11-18T17:11:00.635Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":15,"wtm_invoice_items":{"type":"wtm_invoice_items","count":1,"params":{},"results":[{"extended_price":"175.00000","unit_price":"35.00000","quantity":"5.000","id":201,"created_by":44,"created_at":"2015-11-19T16:44:32.562Z","updated_by":44,"updated_at":"2015-11-19T16:44:36.524Z","is_deleted":false,"location_id":7,"vendor_id":1,"vendor_inventory_item_id":74,"inv_item_id":802,"inv_event_item_id":182,"invoice_id":73}]}},{"common_unit_cost":"0.00000","description":"","name":"Victory Prima Pils Draft","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":604,"id":1525,"created_by":44,"created_at":"2015-10-30T11:01:27.781Z","updated_by":44,"updated_at":"2015-10-30T11:05:21.394Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":15,"wtm_invoice_items":{"type":"wtm_invoice_items","count":1,"params":{},"results":[{"extended_price":"500.00000","unit_price":"10.00000","quantity":"50.000","id":165,"created_by":44,"created_at":"2015-11-02T16:36:55.031Z","updated_by":44,"updated_at":"2015-11-02T16:36:55.401Z","is_deleted":false,"location_id":7,"vendor_id":17,"vendor_inventory_item_id":57,"inv_item_id":1525,"inv_event_item_id":146,"invoice_id":47}]}},{"common_unit_cost":"0.00000","description":"","name":"testing","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1730,"created_by":44,"created_at":"2015-12-17T17:41:53.718Z","updated_by":null,"updated_at":"2015-12-17T17:41:53.718Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":5},{"common_unit_cost":null,"description":"","name":"KK 1","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1392,"created_by":44,"created_at":"2015-08-07T17:52:08.182Z","updated_by":44,"updated_at":"2015-08-27T19:56:32.730Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":1},{"common_unit_cost":"0.00000","description":"","name":"wvconvtest","report_unit_cost":"0.00000","total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":null,"id":1660,"created_by":44,"created_at":"2015-11-17T16:02:17.035Z","updated_by":44,"updated_at":"2015-11-20T13:32:02.481Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":1},{"common_unit_cost":null,"description":"","name":"Dogfish Head Saison du Buff Draft","report_unit_cost":null,"total_recipes":null,"is_active":true,"refuse_pct":null,"item_db_id":618,"id":1421,"created_by":44,"created_at":"2015-08-27T11:13:48.803Z","updated_by":44,"updated_at":"2015-08-27T19:56:32.727Z","sales_item_id":null,"count_group_id":81,"gl_account_id":16,"common_unit_id":15}]},
    item_units_response         : {"count":24,"results":[{"is_active":null,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"33.81400","description":"Bottle 1 Ltr","is_report_unit":true,"id":2227,"created_by":44,"created_at":"2014-10-31T16:07:27.397Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.397Z","unit_id":5,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.03704","description":"Gram 0.03704 floz","is_report_unit":false,"id":2228,"created_by":44,"created_at":"2014-10-31T16:07:27.556Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.556Z","unit_id":17,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"1 floz","is_report_unit":false,"id":2229,"created_by":44,"created_at":"2014-10-31T16:07:27.711Z","updated_by":null,"updated_at":"2014-10-31T16:07:27.711Z","unit_id":15,"common_unit_id":15,"inv_item_id":802},{"is_active":null,"is_wv_conversion":false,"pack_size":"","unit_quantity":"2.00000","description":"Bottle 2.00000 floz","is_report_unit":false,"id":3160,"created_by":44,"created_at":"2015-04-16T19:27:21.575Z","updated_by":null,"updated_at":"2015-04-16T19:27:21.575Z","unit_id":5,"common_unit_id":15,"inv_item_id":802},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":null,"is_report_unit":false,"id":3967,"created_by":44,"created_at":"2015-08-07T17:52:08.448Z","updated_by":44,"updated_at":"2015-08-07T17:53:27.757Z","unit_id":1,"common_unit_id":1,"inv_item_id":1392},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"3.00000","description":"Portion 1 pound","is_report_unit":false,"id":3968,"created_by":44,"created_at":"2015-08-07T17:52:55.522Z","updated_by":null,"updated_at":"2015-08-07T17:52:55.522Z","unit_id":28,"common_unit_id":1,"inv_item_id":1392},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"3.00000","description":"Bag 1 pound","is_report_unit":false,"id":3970,"created_by":44,"created_at":"2015-08-07T18:12:02.525Z","updated_by":null,"updated_at":"2015-08-07T18:12:02.525Z","unit_id":2,"common_unit_id":1,"inv_item_id":1392},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"2.00000","description":"Block 2 pound","is_report_unit":false,"id":3971,"created_by":44,"created_at":"2015-08-07T18:13:47.231Z","updated_by":null,"updated_at":"2015-08-07T18:13:47.231Z","unit_id":4,"common_unit_id":1,"inv_item_id":1392},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.25000","description":"Serving 0.25000 pound","is_report_unit":true,"id":3969,"created_by":44,"created_at":"2015-08-07T17:53:26.967Z","updated_by":44,"updated_at":"2015-08-12T16:41:45.304Z","unit_id":33,"common_unit_id":1,"inv_item_id":1392},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"1 floz","is_report_unit":false,"id":4054,"created_by":44,"created_at":"2015-08-27T11:13:49.044Z","updated_by":null,"updated_at":"2015-08-27T11:13:49.044Z","unit_id":15,"common_unit_id":15,"inv_item_id":1421},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1984.00000","description":"Keg 1984.00000 floz","is_report_unit":true,"id":4055,"created_by":44,"created_at":"2015-08-27T11:13:49.347Z","updated_by":null,"updated_at":"2015-08-27T11:13:49.347Z","unit_id":20,"common_unit_id":15,"inv_item_id":1421},{"is_active":true,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.03448","description":"Gram 0.03448 floz","is_report_unit":false,"id":4056,"created_by":44,"created_at":"2015-08-27T11:13:49.639Z","updated_by":null,"updated_at":"2015-08-27T11:13:49.639Z","unit_id":17,"common_unit_id":15,"inv_item_id":1421},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"33.81400","description":"Bottle 33.814 floz","is_report_unit":true,"id":4321,"created_by":44,"created_at":"2015-10-30T11:02:33.342Z","updated_by":44,"updated_at":"2015-10-30T11:03:10.596Z","unit_id":5,"common_unit_id":15,"inv_item_id":1525},{"is_active":true,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.03448","description":"Gram 0.03448 floz","is_report_unit":false,"id":4320,"created_by":44,"created_at":"2015-10-30T11:01:28.598Z","updated_by":null,"updated_at":"2015-10-30T11:01:28.598Z","unit_id":17,"common_unit_id":15,"inv_item_id":1525},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1984.00000","description":"Keg 1984.00000 floz","is_report_unit":false,"id":4319,"created_by":44,"created_at":"2015-10-30T11:01:28.314Z","updated_by":44,"updated_at":"2015-10-30T11:03:11.091Z","unit_id":20,"common_unit_id":15,"inv_item_id":1525},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"1 floz","is_report_unit":false,"id":4318,"created_by":44,"created_at":"2015-10-30T11:01:28.025Z","updated_by":null,"updated_at":"2015-10-30T11:01:28.025Z","unit_id":15,"common_unit_id":15,"inv_item_id":1525},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"12.00000","description":"Each 12 pound","is_report_unit":true,"id":4695,"created_by":44,"created_at":"2015-11-20T13:31:58.839Z","updated_by":44,"updated_at":"2015-11-20T13:37:39.951Z","unit_id":13,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.11193","description":"Liter 0.11193 pound","is_report_unit":false,"id":4657,"created_by":44,"created_at":"2015-11-17T16:19:47.920Z","updated_by":null,"updated_at":"2015-11-17T16:19:47.920Z","unit_id":22,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":true,"pack_size":null,"unit_quantity":"0.42371","description":"Gallon 0.42371 pound","is_report_unit":false,"id":4654,"created_by":44,"created_at":"2015-11-17T16:03:18.877Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.340Z","unit_id":16,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"2.20463","description":"Kilogram 2.20463 pound","is_report_unit":false,"id":4655,"created_by":44,"created_at":"2015-11-17T16:03:55.534Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.340Z","unit_id":21,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":"","unit_quantity":"0.00331","description":"Fluid Ounce 0.00331 pound","is_report_unit":false,"id":4652,"created_by":44,"created_at":"2015-11-17T16:02:17.220Z","updated_by":44,"updated_at":"2015-11-20T13:32:00.404Z","unit_id":15,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"0.03310","description":"Bag 0.0331 pound","is_report_unit":false,"id":4653,"created_by":44,"created_at":"2015-11-17T16:03:04.582Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.330Z","unit_id":2,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":"Pound 1 pound","is_report_unit":false,"id":4656,"created_by":44,"created_at":"2015-11-17T16:04:19.697Z","updated_by":44,"updated_at":"2015-11-17T16:10:05.330Z","unit_id":1,"common_unit_id":1,"inv_item_id":1660},{"is_active":true,"is_wv_conversion":false,"pack_size":null,"unit_quantity":"1.00000","description":null,"is_report_unit":true,"id":4819,"created_by":44,"created_at":"2015-12-17T17:41:53.925Z","updated_by":null,"updated_at":"2015-12-17T17:41:53.925Z","unit_id":5,"common_unit_id":5,"inv_item_id":1730}]},
    item_unit_locations_response: {"count":20,"results":[{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":3794,"created_by":44,"created_at":"2015-08-27T11:13:50.279Z","updated_by":null,"updated_at":"2015-08-27T11:13:50.279Z","location_id":7,"inv_item_unit_id":4054,"inv_item_id":1421},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":3795,"created_by":44,"created_at":"2015-08-27T11:13:50.376Z","updated_by":null,"updated_at":"2015-08-27T11:13:50.376Z","location_id":7,"inv_item_unit_id":4055,"inv_item_id":1421},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":3796,"created_by":44,"created_at":"2015-08-27T11:13:50.476Z","updated_by":null,"updated_at":"2015-08-27T11:13:50.476Z","location_id":7,"inv_item_unit_id":4056,"inv_item_id":1421},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4967,"created_by":44,"created_at":"2015-08-28T01:09:42.420Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.420Z","location_id":7,"inv_item_unit_id":2227,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4976,"created_by":44,"created_at":"2015-08-28T01:09:42.433Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.433Z","location_id":7,"inv_item_unit_id":2228,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4977,"created_by":44,"created_at":"2015-08-28T01:09:42.439Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.439Z","location_id":7,"inv_item_unit_id":2229,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":4986,"created_by":44,"created_at":"2015-08-28T01:09:42.451Z","updated_by":null,"updated_at":"2015-08-28T01:09:42.451Z","location_id":7,"inv_item_unit_id":3160,"inv_item_id":802},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":1573,"created_by":44,"created_at":"2015-08-07T17:52:10.135Z","updated_by":null,"updated_at":"2015-08-07T17:52:10.135Z","location_id":7,"inv_item_unit_id":3967,"inv_item_id":1392},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":1592,"created_by":44,"created_at":"2015-08-07T17:52:55.813Z","updated_by":null,"updated_at":"2015-08-07T17:52:55.813Z","location_id":7,"inv_item_unit_id":3968,"inv_item_id":1392},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":1608,"created_by":44,"created_at":"2015-08-07T17:53:27.521Z","updated_by":null,"updated_at":"2015-08-07T17:53:27.521Z","location_id":7,"inv_item_unit_id":3969,"inv_item_id":1392},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":1621,"created_by":44,"created_at":"2015-08-07T18:12:02.967Z","updated_by":null,"updated_at":"2015-08-07T18:12:02.967Z","location_id":7,"inv_item_unit_id":3970,"inv_item_id":1392},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":true,"id":1637,"created_by":44,"created_at":"2015-08-07T18:13:47.481Z","updated_by":null,"updated_at":"2015-08-07T18:13:47.481Z","location_id":7,"inv_item_unit_id":3971,"inv_item_id":1392},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":15603,"created_by":44,"created_at":"2015-11-17T16:02:17.565Z","updated_by":null,"updated_at":"2015-11-17T16:02:17.565Z","location_id":7,"inv_item_unit_id":4652,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":15612,"created_by":44,"created_at":"2015-11-17T16:03:05.000Z","updated_by":null,"updated_at":"2015-11-17T16:03:05.000Z","location_id":7,"inv_item_unit_id":4653,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":15626,"created_by":44,"created_at":"2015-11-17T16:03:19.364Z","updated_by":null,"updated_at":"2015-11-17T16:03:19.364Z","location_id":7,"inv_item_unit_id":4654,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":15638,"created_by":44,"created_at":"2015-11-17T16:03:56.051Z","updated_by":null,"updated_at":"2015-11-17T16:03:56.051Z","location_id":7,"inv_item_unit_id":4655,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":15650,"created_by":44,"created_at":"2015-11-17T16:04:20.240Z","updated_by":null,"updated_at":"2015-11-17T16:04:20.240Z","location_id":7,"inv_item_unit_id":4656,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":15662,"created_by":44,"created_at":"2015-11-17T16:19:48.597Z","updated_by":null,"updated_at":"2015-11-17T16:19:48.597Z","location_id":7,"inv_item_unit_id":4657,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":16083,"created_by":44,"created_at":"2015-11-20T13:31:59.600Z","updated_by":null,"updated_at":"2015-11-20T13:31:59.600Z","location_id":7,"inv_item_unit_id":4695,"inv_item_id":1660},{"is_report_unit":false,"is_waste_unit":false,"is_count_unit":true,"is_transfer_unit":false,"is_order_unit":false,"id":17574,"created_by":44,"created_at":"2015-12-17T17:41:54.207Z","updated_by":null,"updated_at":"2015-12-17T17:41:54.207Z","location_id":7,"inv_item_unit_id":4819,"inv_item_id":1730}]},
    invoices_response           : {"count":2,"results":[{"invoice_number":null,"is_complete":false,"receipt_date":"2015-10-08","invoice_date":"2015-10-07","total":"3295.00","id":47,"created_by":44,"created_at":"2015-10-13T20:30:29.673Z","updated_by":44,"updated_at":"2015-11-12T18:11:12.002Z","location_id":7,"vendor_id":17,"inv_event_id":53},{"invoice_number":null,"is_complete":true,"receipt_date":"2015-11-16","invoice_date":"2015-11-16","total":"803.00","id":73,"created_by":44,"created_at":"2015-11-16T13:57:53.728Z","updated_by":44,"updated_at":"2015-11-30T14:28:37.687Z","location_id":7,"vendor_id":1,"inv_event_id":79}]},
    vendor_items_response       : {"count":4,"results":[{"last_price":"5.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":"2015-12-17","id":116,"created_by":44,"created_at":"2015-12-17T17:41:55.788Z","updated_by":null,"updated_at":"2015-12-17T17:41:55.788Z","vendor_id":1,"inv_item_id":1730,"inv_item_unit_id":4819},{"last_price":"20.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":null,"id":84,"created_by":44,"created_at":"2015-11-20T12:42:21.757Z","updated_by":null,"updated_at":"2015-11-20T12:42:21.757Z","vendor_id":1,"inv_item_id":1660,"inv_item_unit_id":4656},{"last_price":"35.00000","number":"3334","pack_size":null,"description":"aaa","is_active":true,"last_price_on":"2015-11-16","id":74,"created_by":44,"created_at":"2015-11-13T15:14:01.362Z","updated_by":44,"updated_at":"2015-11-19T16:44:33.541Z","vendor_id":1,"inv_item_id":802,"inv_item_unit_id":3160},{"last_price":"10.00000","number":null,"pack_size":null,"description":null,"is_active":true,"last_price_on":"2015-10-08","id":57,"created_by":44,"created_at":"2015-10-30T11:08:58.013Z","updated_by":44,"updated_at":"2015-11-02T16:36:55.876Z","vendor_id":17,"inv_item_id":1525,"inv_item_unit_id":4321}]},
    permissions                 : {
      'edit_counts' : true
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
  var $filter, $location, $mdDialog, $peach, $q, $timeout, cakeCommon, cakeCountGroups, cakeCounts, cakeCountItems, cakeGLAccounts, cakeInvoices, cakeItems, cakeItemLocations, cakeItemUnits, cakeItemUnitLocations, cakePermissions, cakeSettings, cakeUnits, cakeVendorItems, cakeVendorLocations;


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
      getCountingTaskId: function() {
        return editCountControllerTestsMockedData.task_id
      },
      parseCakeFloatValue: function(value, defaultValue) {
        defaultValue = _.isUndefined(defaultValue) ? 0 : defaultValue;
        if (!_.isUndefined(value) && !_.isNull(value)) {
          return parseFloat(Big(value).toFixed(5));
        }
        return defaultValue;
      },
      getCakeFloatRegex: function() {
        return editCountControllerTestsMockedData.float_regex;
      },
      isUserAccountAdmin: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.is_user_account_admin);
        return deferred.promise;
      },
      isDevPreviewModeRunning: function() {
        return editCountControllerTestsMockedData.is_dev_preview_mode_running;
      },
      apiErrorHandler: function(error, showAlert) {
        return $log.error([error, showAlert]);
      }
    };

    cakeCountGroups = {
      loadCountGroups: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.count_groups_response);
        return deferred.promise;
      },
      getCountGroups: function() {
        return editCountControllerTestsMockedData.count_groups_response.results;
      }
    };

    cakeCounts = {
      loadCounts: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.counts_response);
        return deferred.promise;
      },
      loadOpeningCounts: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.opening_counts_response);
        return deferred.promise;
      },
      getCounts: function() {
        return editCountControllerTestsMockedData.counts_response.results;
      },
      getOpeningCounts: function() {
        return editCountControllerTestsMockedData.opening_counts_response.results;
      },
      getCountsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.counts_response.results, 'id'), editCountControllerTestsMockedData.counts_response.results);
      },
      getOpeningCountsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.opening_counts_response.results, 'id'), editCountControllerTestsMockedData.opening_counts_response.results);
      },
      createCount: function(newCountData) {
        var deferred = $q.defer();
        deferred.resolve(newCountData);
        return deferred.promise;
      },
      updateCount: function(countData) {
        var deferred = $q.defer();
        deferred.resolve(countData);
        return deferred.promise;
      },
      removeCount: function(countId) {
        var deferred = $q.defer();
        deferred.resolve(true);
        return deferred.promise;
      }
    };

    cakeCountItems = {
      loadCountItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.count_items_response);
        return deferred.promise;
      },
      getCountItems: function() {
        return editCountControllerTestsMockedData.count_items_response.results;
      },
      bulkCreateCountItems: function(newCountItemData) {
        var deferred = $q.defer();
        deferred.resolve(newCountItemData);
        return deferred.promise;
      },
      createCountItem: function(newCountItemData) {
        var deferred = $q.defer();
        deferred.resolve(newCountItemData);
        return deferred.promise;
      },
      updateCountItem: function(countItemData) {
        var deferred = $q.defer();
        deferred.resolve(countItemData);
        return deferred.promise;
      },
      removeCountItem: function(countItemId) {
        var deferred = $q.defer();
        deferred.resolve(true);
        return deferred.promise;
      }
    };

    cakeGLAccounts = {
      loadGLAccounts: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.gl_accounts_response);
        return deferred.promise;
      },
      getGLAccounts: function() {
        return editCountControllerTestsMockedData.gl_accounts_response.results;
      },
      getGLAccountsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.gl_accounts_response.results, 'id'), editCountControllerTestsMockedData.gl_accounts_response.results);
      }
    };

    cakeInvoices = {
      loadInvoices: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.invoices_response);
        return deferred.promise;
      },
      getInvoices: function() {
        return editCountControllerTestsMockedData.invoices_response.results;
      }
    };

    cakeItems = {
      loadItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.items_response);
        return deferred.promise;
      },
      getItems: function() {
        return editCountControllerTestsMockedData.items_response.results;
      },
      getItemsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.items_response.results, 'id'), editCountControllerTestsMockedData.items_response.results);
      }
    };

    cakeItemLocations = {
      loadItemLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.item_locations_response);
        return deferred.promise;
      },
      getItemLocations: function() {
        return editCountControllerTestsMockedData.item_locations_response.results;
      },
      getItemLocationsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.item_locations_response.results, 'id'), editCountControllerTestsMockedData.item_locations_response.results);
      },
      updateItemLocation: function(itemLocationData) {
        var deferred = $q.defer();
        deferred.resolve(itemLocationData);
        return deferred.promise;
      },
    };

    cakeItemUnits = {
      loadItemUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.item_units_response);
        return deferred.promise;
      },
      getItemUnits: function() {
        return editCountControllerTestsMockedData.item_units_response.results;
      },
      getItemUnitsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.item_units_response.results, 'id'), editCountControllerTestsMockedData.item_units_response.results);
      }
    };

    cakeItemUnitLocations = {
      loadItemUnitLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.item_unit_locations_response);
        return deferred.promise;
      },
      getItemUnitLocations: function() {
        return editCountControllerTestsMockedData.item_unit_locations_response.results;
      }
    };

    cakePermissions = {
      userHasPermission: function(permissionKey) {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.permissions[permissionKey]);
        return deferred.promise;
      }
    };

    cakeSettings = {
      getSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData[settingKey]);
        return deferred.promise;
      },
      refreshSettings: function(settingKey) {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData[settingKey]);
        return deferred.promise;
      }
    };

    cakeUnits = {
      loadUnits: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.units_response);
        return deferred.promise;
      },
      getUnits: function() {
        return editCountControllerTestsMockedData.units_response.results;
      },
      getUnitsCollection: function() {
        return _.object(_.pluck(editCountControllerTestsMockedData.units_response.results, 'id'), editCountControllerTestsMockedData.units_response.results);
      }
    };

    cakeVendorItems = {
      loadVendorItems: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.vendor_items_response);
        return deferred.promise;
      },
      getVendorItems: function() {
        return editCountControllerTestsMockedData.vendor_items_response.results;
      }
    };

    cakeVendorLocations = {
      loadVendorLocations: function() {
        var deferred = $q.defer();
        deferred.resolve(editCountControllerTestsMockedData.vendor_locations_response);
        return deferred.promise;
      },
      getVendorLocations: function() {
        return editCountControllerTestsMockedData.vendor_locations_response.results;
      }
    };

    controllerScope = $rootScope.$new();
    $controller(
      'edit_count.js as vm',
      {
        '$filter': $filter,
        '$location': $location,
        '$mdDialog': $mdDialog,
        '$peach': $peach,
        '$q': $q,
        '$scope': controllerScope,
        '$timeout': $timeout,
        'cakeCommon': cakeCommon,
        'cakeCountGroups': cakeCountGroups,
        'cakeCounts': cakeCounts,
        'cakeCountItems': cakeCountItems,
        'cakeGLAccounts': cakeGLAccounts,
        'cakeInvoices': cakeInvoices,
        'cakeItems': cakeItems,
        'cakeItemLocations': cakeItemLocations,
        'cakeItemUnits': cakeItemUnits,
        'cakeItemUnitLocations': cakeItemUnitLocations,
        'cakePermissions': cakePermissions,
        'cakeSettings': cakeSettings,
        'cakeUnits': cakeUnits,
        'cakeVendorItems': cakeVendorItems,
        'cakeVendorLocations': cakeVendorLocations
      }
    );

    logStub = sandbox.stub($log, 'log').returns({'message': 'There was an output logged'});
    errorLogStub = sandbox.stub($log, 'error').returns({'message': 'There was an error logged'});
    userDeferred = $q.defer();
    userDeferred.resolve(editCountControllerTestsMockedData.user);
    accountUserStub = sandbox.stub($peach.account, 'getUsers').returns(userDeferred.promise);

  }));

  afterEach(function() {

    sandbox.restore();

  });

  describe('Constructor', function() {

    it('should construct Edit Count Controller', function() {

      expect(controllerScope.vm.$filter).to.exist;
      expect(controllerScope.vm.$location).to.exist;
      expect(controllerScope.vm.$mdDialog).to.exist;
      expect(controllerScope.vm.$peach).to.exist;
      expect(controllerScope.vm.$q).to.exist;
      expect(controllerScope.vm.$timeout).to.exist;
      expect(controllerScope.vm.cakeCommon).to.exist;
      expect(controllerScope.vm.cakeCountGroups).to.exist;
      expect(controllerScope.vm.cakeCounts).to.exist;
      expect(controllerScope.vm.cakeCountItems).to.exist;
      expect(controllerScope.vm.cakeGLAccounts).to.exist;
      expect(controllerScope.vm.cakeInvoices).to.exist;
      expect(controllerScope.vm.cakeItems).to.exist;
      expect(controllerScope.vm.cakeItemLocations).to.exist;
      expect(controllerScope.vm.cakeItemUnits).to.exist;
      expect(controllerScope.vm.cakeItemUnitLocations).to.exist;
      expect(controllerScope.vm.cakePermissions).to.exist;
      expect(controllerScope.vm.cakeSettings).to.exist;
      expect(controllerScope.vm.cakeUnits).to.exist;
      expect(controllerScope.vm.cakeVendorItems).to.exist;
      expect(controllerScope.vm.cakeVendorLocations).to.exist;
      expect(controllerScope.vm.taskResource).to.exist;
      expect(controllerScope.vm.taskQueueResource).to.exist;

      expect(controllerScope.vm.blockers).to.deep.equal({'api_processing': false, 'initializing': true});

      expect(controllerScope.vm.editedCount).to.deep.equal({
        data              : {},
        form_data         : {},
        items_data        : {},
        is_opening_count  : false,
        parent_group      : {},
        percentage        : 0,
        was_complete      : false,
        update_timestamp  : ''
      });

      expect(controllerScope.vm.activeLocations).to.deep.equal([]);
      expect(controllerScope.vm.activeLocationsById).to.deep.equal({});
      expect(controllerScope.vm.cakeFloatPattern).to.equal(editCountControllerTestsMockedData.float_regex);
      expect(controllerScope.vm.canEditCount).to.equal(false);
      expect(controllerScope.vm.countGroups).to.deep.equal([]);
      expect(controllerScope.vm.countGroupsById).to.deep.equal({});
      expect(controllerScope.vm.counts).to.deep.equal([]);
      expect(controllerScope.vm.countsById).to.deep.equal({});
      expect(controllerScope.vm.editingPreviouslyCreatedCount).to.equal(false);
      expect(controllerScope.vm.forms).to.deep.equal({});
      expect(controllerScope.vm.glAccounts).to.deep.equal([]);
      expect(controllerScope.vm.glAccountsById).to.deep.equal({});
      expect(controllerScope.vm.isAccountAdmin).to.equal(false);
      expect(controllerScope.vm.isDeveloperMode).to.equal(false);
      expect(controllerScope.vm.items).to.deep.equal([]);
      expect(controllerScope.vm.itemsById).to.deep.equal({});
      expect(controllerScope.vm.itemUnitsById).to.deep.equal({});
      expect(controllerScope.vm.locationTime).to.deep.equal({utc_time_diff: 0, timezone: 'America/New_York'});
      expect(controllerScope.vm.openingCounts).to.deep.equal([]);
      expect(controllerScope.vm.openingCountsById).to.deep.equal({});
      expect(controllerScope.vm.openingCountsByCountGroupId).to.deep.equal({});
      expect(controllerScope.vm.units).to.deep.equal([]);
      expect(controllerScope.vm.unitsById).to.deep.equal({});
      expect(controllerScope.vm.unitsByAbbr).to.deep.equal({});
      expect(controllerScope.vm.userInfo).to.deep.equal({'message': '', 'type': ''});

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
      expect(spyCakePermissions.calledWithExactly('edit_counts')).to.equal(true);
      expect(spyCakeSettings.calledWithExactly('active_locations')).to.equal(true);
      expect(spyCakeSettingsRefresh.calledWithExactly('current_utc_timestamp')).to.equal(true);
      expect(controllerScope.vm.blockers.initializing).to.equal(true);

      $rootScope.$digest();
      
      expect(controllerScope.vm.activeLocations).to.equal(editCountControllerTestsMockedData.active_locations);
      expect(_.keys(controllerScope.vm.activeLocationsById).length).to.equal(editCountControllerTestsMockedData.active_locations.length);
      expect(controllerScope.vm.isAccountAdmin).to.equal(editCountControllerTestsMockedData.is_user_account_admin);
      expect(controllerScope.vm.isDeveloperMode).to.equal(editCountControllerTestsMockedData.is_dev_preview_mode_running);
      expect(controllerScope.vm.locationTime.utc_time_diff).to.to.be.above(0);
    
    });

    describe('activate should set up extended controller properties scenarios', function() {

      describe('activate should finish without loading count scenarios', function() {

        it('no location selected scenario', function() {

          var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
          var spyPeachSession = sandbox.spy(controllerScope.vm.$peach.session, 'getActiveLocation');

          $rootScope.$digest();

          expect(spyPeachEvent.called).to.equal(true);
          expect(spyPeachSession.called).to.equal(true);

          expect(controllerScope.vm.canEditCount).to.equal(false);
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

          expect(controllerScope.vm.canEditCount).to.equal(false);
          expect(controllerScope.vm.blockers.initializing).to.equal(false);
        
        });

        it('cake active location selected but no active count group available scenario', function() {

          var locationId = 7;
          var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
          var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
          var spyShowMessage = sandbox.spy(controllerScope.vm, 'showMessage');
          var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
          var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
          var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');

          var dataCopy = angular.copy(editCountControllerTestsMockedData.count_groups_response);
          editCountControllerTestsMockedData.count_groups_response = {count: 0, results: []};

          $rootScope.$digest();

          expect(spyPeachEvent.called).to.equal(false);
          expect(stubPeachSession.called).to.equal(true);

          expect(controllerScope.vm.locationTime.timezone).to.equal(editCountControllerTestsMockedData.active_locations[0]['timezone']);
          expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);

          expect(controllerScope.vm.countGroups.length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(_.keys(controllerScope.vm.countGroupsById).length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(controllerScope.vm.glAccounts.length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(controllerScope.vm.units.length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsByAbbr).length).to.equal(editCountControllerTestsMockedData.units_response.count);

          expect(controllerScope.vm.editedCount.form_data.location_id).to.equal(locationId);

          expect(spyShowMessage.calledWithExactly('There are no active count groups you could create/edit count for.')).to.equal(true);

          expect(controllerScope.vm.canEditCount).to.equal(false);
          expect(controllerScope.vm.blockers.initializing).to.equal(false);

          editCountControllerTestsMockedData.count_groups_response = dataCopy;
        
        });

        it('cake active location selected, active count group available but no id in url (opening new count form) scenario', function() {

          var locationId = 7;
          var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
          var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
          var spyHideMessage = sandbox.spy(controllerScope.vm, 'hideMessage');
          var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
          var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
          var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
          var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
          var spyCakeOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');

          $rootScope.$digest();

          expect(stubPeachSession.called).to.equal(true);

          expect(controllerScope.vm.locationTime.timezone).to.equal(editCountControllerTestsMockedData.active_locations[0]['timezone']);
          expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);

          expect(controllerScope.vm.countGroups.length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(_.keys(controllerScope.vm.countGroupsById).length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(controllerScope.vm.glAccounts.length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(controllerScope.vm.units.length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsByAbbr).length).to.equal(editCountControllerTestsMockedData.units_response.count);

          expect(spyCakeCountsLoad.calledWithExactly({'$and': [{location_id: locationId}, {count_group_id: _.pluck(editCountControllerTestsMockedData.count_groups_response.results, 'id')}]})).to.equal(true);
          expect(spyCakeOpeningCountsLoad.calledWithExactly({'$and': [{location_id: locationId}, {count_group_id: _.pluck(editCountControllerTestsMockedData.count_groups_response.results, 'id')}]})).to.equal(true);
          expect(controllerScope.vm.counts.length).to.equal(editCountControllerTestsMockedData.counts_response.count);
          expect(_.keys(controllerScope.vm.countsById).length).to.equal(editCountControllerTestsMockedData.counts_response.count);
          expect(controllerScope.vm.openingCounts.length).to.equal(editCountControllerTestsMockedData.opening_counts_response.count);
          expect(_.keys(controllerScope.vm.openingCountsById).length).to.equal(editCountControllerTestsMockedData.opening_counts_response.count);

          expect(controllerScope.vm.countGroupsById[81]).to.contain.all.keys(['counts', 'disabled_dates']);
          expect(controllerScope.vm.countGroupsById[81]['counts']).to.deep.equal(_.where(editCountControllerTestsMockedData.counts_response.results, {'count_group_id': 81}));

          expect(spyPeachEvent.called).to.equal(true);
          expect(spyHideMessage.called).to.equal(true);
          expect(controllerScope.vm.editingPreviouslyCreatedCount).to.equal(false);
          expect(controllerScope.vm.editedCount).to.deep.equal({
            data              : {},
            form_data         : {location_id: locationId},
            items_data        : {},
            is_opening_count  : false,
            parent_group      : {},
            percentage        : 0,
            was_complete      : false,
            update_timestamp  : ''
          });

          expect(controllerScope.vm.canEditCount).to.equal(true);
          expect(controllerScope.vm.blockers.initializing).to.equal(false);
        
        });

        it('cake active location selected, active count group available but incorrect id in url given (can\'t edit count) scenario', function() {

          var locationId = 7;
          var testId = 999;
          var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
          var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
          var spyErrorHandler = sandbox.spy(controllerScope.vm, 'errorHandler');
          var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
          var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
          var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
          var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
          var spyCakeOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');
          var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });

          $rootScope.$digest();

          expect(stubPeachSession.called).to.equal(true);

          expect(controllerScope.vm.locationTime.timezone).to.equal(editCountControllerTestsMockedData.active_locations[0]['timezone']);
          expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);

          expect(controllerScope.vm.countGroups.length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(_.keys(controllerScope.vm.countGroupsById).length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(controllerScope.vm.glAccounts.length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(controllerScope.vm.units.length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsByAbbr).length).to.equal(editCountControllerTestsMockedData.units_response.count);

          expect(spyCakeCountsLoad.calledWithExactly({'$and': [{location_id: locationId}, {count_group_id: _.pluck(editCountControllerTestsMockedData.count_groups_response.results, 'id')}]})).to.equal(true);
          expect(spyCakeOpeningCountsLoad.calledWithExactly({'$and': [{location_id: locationId}, {count_group_id: _.pluck(editCountControllerTestsMockedData.count_groups_response.results, 'id')}]})).to.equal(true);
          expect(controllerScope.vm.counts.length).to.equal(editCountControllerTestsMockedData.counts_response.count);
          expect(_.keys(controllerScope.vm.countsById).length).to.equal(editCountControllerTestsMockedData.counts_response.count);
          expect(controllerScope.vm.openingCounts.length).to.equal(editCountControllerTestsMockedData.opening_counts_response.count);
          expect(_.keys(controllerScope.vm.openingCountsById).length).to.equal(editCountControllerTestsMockedData.opening_counts_response.count);

          expect(controllerScope.vm.countGroupsById[81]).to.contain.all.keys(['counts', 'disabled_dates']);
          expect(controllerScope.vm.countGroupsById[81]['counts']).to.deep.equal(_.where(editCountControllerTestsMockedData.counts_response.results, {'count_group_id': 81}));

          expect(stubLocation.called).to.equal(true);

          expect(spyPeachEvent.called).to.equal(false);
          expect(spyErrorHandler.calledWithExactly('Couldn\'t find a count with id: ' + testId)).to.equal(true);

          expect(controllerScope.vm.canEditCount).to.equal(false);
          expect(controllerScope.vm.blockers.initializing).to.equal(false);
        
        });

      });

      describe('activate should finish and load count scenarios', function() {

        it('should set up extended controller data common for all subscenarios', function() {

          var locationId = 7;
          var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
          var spyCakeCountGroupsLoad = sandbox.spy(controllerScope.vm.cakeCountGroups, 'loadCountGroups');
          var spyCakeUnitsLoad = sandbox.spy(controllerScope.vm.cakeUnits, 'loadUnits');
          var spyCakeGLAccountsLoad = sandbox.spy(controllerScope.vm.cakeGLAccounts, 'loadGLAccounts');
          var spyCakeCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadCounts');
          var spyCakeOpeningCountsLoad = sandbox.spy(controllerScope.vm.cakeCounts, 'loadOpeningCounts');

          $rootScope.$digest();

          expect(stubPeachSession.called).to.equal(true);

          expect(controllerScope.vm.locationTime.timezone).to.equal(editCountControllerTestsMockedData.active_locations[0]['timezone']);
          expect(spyCakeCountGroupsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeGLAccountsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);
          expect(spyCakeUnitsLoad.calledWithExactly(null, {sort: 'name'})).to.equal(true);

          expect(controllerScope.vm.countGroups.length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(_.keys(controllerScope.vm.countGroupsById).length).to.equal(editCountControllerTestsMockedData.count_groups_response.count);
          expect(controllerScope.vm.glAccounts.length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(_.keys(controllerScope.vm.glAccountsById).length).to.equal(editCountControllerTestsMockedData.gl_accounts_response.count);
          expect(controllerScope.vm.units.length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsById).length).to.equal(editCountControllerTestsMockedData.units_response.count);
          expect(_.keys(controllerScope.vm.unitsByAbbr).length).to.equal(editCountControllerTestsMockedData.units_response.count);

          expect(spyCakeCountsLoad.calledWithExactly({'$and': [{location_id: locationId}, {count_group_id: _.pluck(editCountControllerTestsMockedData.count_groups_response.results, 'id')}]})).to.equal(true);
          expect(spyCakeOpeningCountsLoad.calledWithExactly({'$and': [{location_id: locationId}, {count_group_id: _.pluck(editCountControllerTestsMockedData.count_groups_response.results, 'id')}]})).to.equal(true);
          expect(controllerScope.vm.counts.length).to.equal(editCountControllerTestsMockedData.counts_response.count);
          expect(_.keys(controllerScope.vm.countsById).length).to.equal(editCountControllerTestsMockedData.counts_response.count);
          expect(controllerScope.vm.openingCounts.length).to.equal(editCountControllerTestsMockedData.opening_counts_response.count);
          expect(_.keys(controllerScope.vm.openingCountsById).length).to.equal(editCountControllerTestsMockedData.opening_counts_response.count);

          expect(controllerScope.vm.countGroupsById[81]).to.contain.all.keys(['counts', 'disabled_dates']);
          expect(controllerScope.vm.countGroupsById[81]['counts']).to.deep.equal(_.where(editCountControllerTestsMockedData.counts_response.results, {'count_group_id': 81}));

        });

        it('should display page blocking dialog if counting task is pending', function() {

          var locationId = 7;
          var testId = 102;
          var taskId = 66;
          var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
          var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
          var spyDialogShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');
          var deferred = $q.defer();
              deferred.resolve({taskId: 999});
          var mockTaskResource = sandbox.mock(controllerScope.vm.taskResource);
          var taskCreateExpectation = mockTaskResource.expects('create').returns(deferred.promise);
          var deferred2 = $q.defer();
              deferred2.resolve({status: 'job processing'});
          var mockTaskQueueResource = sandbox.mock(controllerScope.vm.taskQueueResource);
          var taskQueueFindExpectation = mockTaskQueueResource.expects('find').returns(deferred2.promise);

          editCountControllerTestsMockedData.counts_response.results[6]['task_id'] = taskId;

          $rootScope.$digest();

          expect(taskQueueFindExpectation.withExactArgs(taskId).verify()).to.equal(true);
          expect(spyDialogShow.called).to.equal(true);

          editCountControllerTestsMockedData.counts_response.results[6]['task_id'] = null;

        });

        it('shouldn\'t display page blocking dialog if counting task has finished or there was no task running yet for count', function() {

          var locationId = 7;
          var testId = 102;
          var taskId = 66;
          var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
          var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
          var spyDialogShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');
          var spyCakeCountUpdate = sandbox.spy(controllerScope.vm.cakeCounts, 'updateCount');
          var deferred = $q.defer();
              deferred.resolve({taskId: 999});
          var mockTaskResource = sandbox.mock(controllerScope.vm.taskResource);
          var taskCreateExpectation = mockTaskResource.expects('create').returns(deferred.promise);
          var deferred2 = $q.defer();
              deferred2.resolve({status: 'job completed'});
          var mockTaskQueueResource = sandbox.mock(controllerScope.vm.taskQueueResource);
          var taskQueueFindExpectation = mockTaskQueueResource.expects('find').returns(deferred2.promise);

          editCountControllerTestsMockedData.counts_response.results[6]['task_id'] = taskId;

          $rootScope.$digest();

          expect(taskQueueFindExpectation.withExactArgs(taskId).verify()).to.equal(true);
          expect(spyDialogShow.called).to.equal(false);
          expect(spyCakeCountUpdate.calledWithExactly({
            id        : testId,
            task_id   : null
          })).to.equal(true);

          editCountControllerTestsMockedData.counts_response.results[6]['task_id'] = null;

        });

        describe('starting count scenarios', function() {

          it('should set up extended controller data common for all subscenarios', function() {

            var locationId = 7;
            var testId = 102;
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });

            $rootScope.$digest();

            expect(stubLocation.called).to.equal(true);

            expect(controllerScope.vm.editedCount.data).to.deep.equal(_.extend({}, controllerScope.vm.countsById[testId], {formatted_date: moment(controllerScope.vm.countsById[testId]['date'], 'YYYY-MM-DD').format('l')}));
            expect(controllerScope.vm.editedCount.form_data).to.deep.equal(_.extend({}, controllerScope.vm.editedCount.data, {date: moment(controllerScope.vm.editedCount.data.date, 'YYYY-MM-DD').toDate()}));
            expect(controllerScope.vm.editedCount.percentage).to.equal(parseInt(Big(controllerScope.vm.editedCount.data.percent_complete ? controllerScope.vm.editedCount.data.percent_complete : 0).round()));
            expect(controllerScope.vm.editedCount.parent_group).to.deep.equal(controllerScope.vm.countGroupsById[controllerScope.vm.editedCount.data.count_group_id]);
            expect(controllerScope.vm.editedCount.was_complete).to.equal(controllerScope.vm.editedCount.data.is_complete ? true : false);
            expect(controllerScope.vm.editingPreviouslyCreatedCount).to.equal(true);
            expect(controllerScope.vm.editedCount.is_opening_count).to.equal(true);

            expect(controllerScope.vm.canEditCount).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);

          });

          it('no items to load for count scenario', function() {

            var locationId = 7;
            var testId = 102;
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var spyCakeItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
            var spyCakeVendorLocationsLoad = sandbox.spy(controllerScope.vm.cakeVendorLocations, 'loadVendorLocations');
            var spyCakeVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
            var spyCakeInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
            var spyCakeItemUnitLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'loadItemUnitLocations');

            var deferred1 = $q.defer();
                deferred1.resolve({count: 0, results:[]});
            var mockCakeItems = sandbox.mock(controllerScope.vm.cakeItems);
            var cakeItemsLoadExpectation = mockCakeItems.expects('loadItems').returns(deferred1.promise);
            var cakeItemsGetExpectation = mockCakeItems.expects('getItems').returns([]);

            var deferred2 = $q.defer();
                deferred2.resolve({count: 0, results:[]});
            var mockCakeCountItems = sandbox.mock(controllerScope.vm.cakeCountItems);
            var cakeCountItemsLoadExpectation = mockCakeCountItems.expects('loadCountItems').returns(deferred2.promise);

            var deferred3 = $q.defer();
                deferred3.resolve({count: 0, results:[]});
            var mockCakeItemUnits = sandbox.mock(controllerScope.vm.cakeItemUnits);
            var cakeItemUnitsLoadExpectation = mockCakeItemUnits.expects('loadItemUnits').returns(deferred3.promise);

            $rootScope.$digest();

            expect(spyCakeItemLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(spyCakeVendorLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(cakeCountItemsLoadExpectation.withExactArgs({'$and': [{inv_count_id: controllerScope.vm.editedCount.data.id, location_id: locationId}]}, {sort: '-updated_at'}).verify()).to.equal(true);
            expect(cakeItemsLoadExpectation.withExactArgs(
              {
                '$or' : [
                  {   
                    '$and' : [
                      {
                        'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.item_locations_response.results, 'inv_item_id'))
                      },
                      {
                        'count_group_id' : controllerScope.vm.editedCount.data.count_group_id
                      },
                      {
                        'is_active' : true
                      }
                    ]
                  },
                  {
                    'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.count_items_response.results, 'inv_item_id'))
                  }
                ]
              },
              {
                'includes': 'wtm_invoice_items'
              }
            ).verify()).to.equal(true);
            expect(cakeItemUnitsLoadExpectation.withExactArgs({inv_item_id: 0}).verify()).to.equal(true);
            expect(spyCakeVendorItemsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'inv_item_id' :  0
                  },
                  {
                    'vendor_id' : _.uniq(_.pluck(editCountControllerTestsMockedData.vendor_locations_response.results, 'vendor_id'))
                  }
                ]
              },
              {
                'sort' : '-created_at'
              }
            )).to.equal(true);
            expect(spyCakeInvoicesLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'id' : 0
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  }
                ]
              }
            )).to.equal(true);
            expect(spyCakeItemUnitLocationsLoad.calledWithExactly(
              {
                '$and': [
                  {
                    'inv_item_unit_id' : 0
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  },
                  {
                    'is_count_unit' : true
                  }
                ]
              }
            )).to.equal(true);

            expect(controllerScope.vm.editedCount.items_data).to.deep.equal({});
            expect(controllerScope.vm.editedCount.update_timestamp).to.equal("Last Updated by " + editCountControllerTestsMockedData.user.first_name + " " + editCountControllerTestsMockedData.user.last_name + " on " + moment(controllerScope.vm.editedCount.data.updated_at, moment.ISO_8601).tz(controllerScope.vm.locationTime.timezone).format('llll') + ' ' + moment(controllerScope.vm.editedCount.data.updated_at, moment.ISO_8601).tz(controllerScope.vm.locationTime.timezone).zoneAbbr());

            expect(spyPeachEvent.called).to.equal(true);
            expect(controllerScope.vm.canEditCount).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });

          it('count with items scenario', function() {

            var locationId = 7;
            var testId = 102;
            
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var spyCakeItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
            var spyCakeVendorLocationsLoad = sandbox.spy(controllerScope.vm.cakeVendorLocations, 'loadVendorLocations');
            var spyCakeCountItemsLoad = sandbox.spy(controllerScope.vm.cakeCountItems, 'loadCountItems');
            var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
            var spyCakeItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');
            var spyCakeVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
            var spyCakeInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
            var spyCakeItemUnitLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'loadItemUnitLocations');

            var itemLocationsById = controllerScope.vm.cakeItemLocations.getItemLocationsCollection();

            $rootScope.$digest();

            expect(stubLocation.called).to.equal(true);

            expect(spyCakeItemLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(spyCakeVendorLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(spyCakeCountItemsLoad.calledWithExactly({'$and': [{inv_count_id: controllerScope.vm.editedCount.data.id}, {location_id: locationId}]}, {sort: '-updated_at'})).to.equal(true);
            expect(spyCakeItemsLoad.calledWithExactly(
              {
                '$or' : [
                  {   
                    '$and' : [
                      {
                        'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.item_locations_response.results, 'inv_item_id'))
                      },
                      {
                        'count_group_id' : controllerScope.vm.editedCount.data.count_group_id
                      },
                      {
                        'is_active' : true
                      }
                    ]
                  },
                  {
                    'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.count_items_response.results, 'inv_item_id'))
                  }
                ]
              },
              {
                'includes': 'wtm_invoice_items'
              }
            )).to.equal(true);
            expect(spyCakeItemUnitsLoad.calledWithExactly({inv_item_id: _.uniq(_.pluck(editCountControllerTestsMockedData.items_response.results, 'id'))})).to.equal(true);
            expect(spyCakeVendorItemsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'inv_item_id' :  _.uniq(_.pluck(editCountControllerTestsMockedData.items_response.results, 'id'))
                  },
                  {
                    'vendor_id' : _.uniq(_.pluck(editCountControllerTestsMockedData.vendor_locations_response.results, 'vendor_id'))
                  }
                ]
              },
              {
                'sort' : '-created_at'
              }
            )).to.equal(true);
            expect(spyCakeInvoicesLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'id' : _.uniq(_.pluck(_.flatten(_.compact(_.pluck(_.pluck(editCountControllerTestsMockedData.items_response.results, 'wtm_invoice_items'), 'results'))), 'invoice_id'))
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  }
                ]
              }
            )).to.equal(true);
            expect(spyCakeItemUnitLocationsLoad.calledWithExactly(
              {
                '$and': [
                  {
                    'inv_item_unit_id' : _.uniq(_.pluck(editCountControllerTestsMockedData.item_units_response.results, 'id'))
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  },
                  {
                    'is_count_unit' : true
                  }
                ]
              }
            )).to.equal(true);


            /* VALIDATING IF DATA GETS PARSED CORRECTLY */
            expect(controllerScope.vm.items.length).to.equal(editCountControllerTestsMockedData.items_response.results.length);
            expect(_.keys(controllerScope.vm.itemsById).length).to.equal(editCountControllerTestsMockedData.items_response.results.length);
            expect(_.keys(controllerScope.vm.itemUnitsById).length).to.equal(editCountControllerTestsMockedData.item_units_response.results.length);
            expect(controllerScope.vm.items.length).to.equal(editCountControllerTestsMockedData.items_response.results.length);

            _.each(controllerScope.vm.items, function(parsedItem) {
              expect(parsedItem).to.contain.all.keys(['starting_cost', 'category', 'category_id', 'category_name', 'counted', 'display', 'last_cost_updateable', 'starting_cost_updateable', 'save_starting_cost_along_with_quantity', 'units_data']);
              return;
            });

            expect(controllerScope.vm.itemsById[802]['item_location']).to.equal(itemLocationsById[1779]);
            expect(controllerScope.vm.itemsById[802]['starting_cost']).to.equal(5);
            expect(controllerScope.vm.itemsById[802]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[802]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[802]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[802]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['display']).equal(true);
            expect(controllerScope.vm.itemsById[802]['last_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[802]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['units_data'].length).to.equal(4);
            _.each(controllerScope.vm.itemsById[802]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['count_label']).to.equal('Fluid Ounce (1 floz)');
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['cost_label']).to.equal('per Fluid Ounce');
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['item']['id']).to.equal(802);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['cost_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['new_cost_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['count_object']).to.equal(null);



            expect(controllerScope.vm.itemsById[1421]['item_location']).to.equal(itemLocationsById[1581]);
            expect(controllerScope.vm.itemsById[1421]['starting_cost']).to.equal(0);
            expect(controllerScope.vm.itemsById[1421]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1421]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1421]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1421]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['last_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[1421]['units_data'].length).to.equal(3);
            _.each(controllerScope.vm.itemsById[1421]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['count_label']).to.equal('Keg (Keg 1984.00000 floz)');
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['cost_label']).to.equal('per Keg');
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['item']['id']).to.equal(1421);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['new_cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['quantity_value']).to.equal(0);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['new_quantity_value']).to.equal(0);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['count_object']['id']).to.equal(6097);

            

            expect(controllerScope.vm.itemsById[1730]['item_location']).to.equal(itemLocationsById[6763]);
            expect(controllerScope.vm.itemsById[1730]['starting_cost']).to.equal(0);
            expect(controllerScope.vm.itemsById[1730]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1730]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1730]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1730]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[1730]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['last_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['save_starting_cost_along_with_quantity']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['units_data'].length).to.equal(1);
            _.each(controllerScope.vm.itemsById[1730]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['count_label']).to.equal('Bottle');
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['cost_label']).to.equal('per Bottle');
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['item']['id']).to.equal(1730);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['new_cost_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['count_object']).to.equal(null);

            

            expect(controllerScope.vm.itemsById[1525]['item_location']).to.equal(undefined);
            expect(controllerScope.vm.itemsById[1525]['starting_cost']).to.equal(0);
            expect(controllerScope.vm.itemsById[1525]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1525]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1525]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1525]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1525]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1525]['last_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[1525]['starting_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[1525]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[1525]['units_data'].length).to.equal(4);
            _.each(controllerScope.vm.itemsById[1525]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['count_label']).to.equal('Bottle (Bottle 33.814 floz)');
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['cost_label']).to.equal('per Bottle');
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['item']['id']).to.equal(1525);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['new_cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['quantity_value']).to.equal(10);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['new_quantity_value']).to.equal(10);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['count_object']['id']).to.equal(6090);



            expect(controllerScope.vm.itemsById[1660]['item_location']).to.equal(itemLocationsById[5937]);
            expect(controllerScope.vm.itemsById[1660]['starting_cost']).to.equal(20);
            expect(controllerScope.vm.itemsById[1660]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1660]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1660]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1660]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['last_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[1660]['units_data'].length).to.equal(7);
            _.each(controllerScope.vm.itemsById[1660]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['count_label']).to.equal('Liter (Liter 0.11193 pound)');
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['cost_label']).to.equal('per Liter');
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['item']['id']).to.equal(1660);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['cost_value']).to.equal(2.2386);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['new_cost_value']).to.equal(2.2386);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['quantity_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['new_quantity_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['count_object']['id']).to.equal(6295);

            expect(controllerScope.vm.editedCount.items_data).to.contain.all.keys('Beer');
            expect(controllerScope.vm.editedCount.items_data['Beer']).to.contain.all.keys('counted_items', 'items');
            expect(controllerScope.vm.editedCount.items_data['Beer']['counted_items'].length).to.equal(4);
            expect(controllerScope.vm.editedCount.items_data['Beer']['items'].length).to.equal(6);
            expect(controllerScope.vm.editedCount.items_data['Beer']['items'][0]['id']).to.equal(802);
            expect(controllerScope.vm.editedCount.items_data['Beer']['items'][5]['id']).to.equal(1660);

            expect(spyPeachEvent.called).to.equal(true);
            expect(controllerScope.vm.canEditCount).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });
          

        });

        describe('regular count scenarios', function() {

          beforeEach(function() {

            // change mocked data slightly to test this scenario
            var openingCountsMockedData = [{"count_date":"2015-08-30","id":6,"created_by":44,"created_at":"2015-08-28T15:18:15.457Z","updated_by":null,"updated_at":"2015-08-28T15:18:15.457Z","location_id":7,"count_group_id":67},{"count_date":"2015-09-10","id":10,"created_by":44,"created_at":"2015-09-08T11:56:07.874Z","updated_by":44,"updated_at":"2015-09-17T11:33:15.733Z","location_id":7,"count_group_id":65},{"count_date":"2015-09-17","id":11,"created_by":44,"created_at":"2015-09-17T11:35:05.059Z","updated_by":44,"updated_at":"2015-09-29T11:45:28.192Z","location_id":7,"count_group_id":82},{"count_date":"2015-08-11","id":17,"created_by":44,"created_at":"2015-10-30T11:05:43.335Z","updated_by":null,"updated_at":"2015-10-30T11:05:43.335Z","location_id":7,"count_group_id":81}];

            var openingCountsLoadStub = sandbox.stub(controllerScope.vm.cakeCounts, 'getOpeningCounts', function() { return openingCountsMockedData; });
            var openingCountsLoadCollectionStub = sandbox.stub(controllerScope.vm.cakeCounts, 'getOpeningCountsCollection', function() { 
              return _.object(_.pluck(openingCountsMockedData, 'id'), openingCountsMockedData);
            });

          });

          it('should set up extended controller data common for all subscenarios', function() {

            var locationId = 7;
            var testId = 102;
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });

            $rootScope.$digest();

            expect(stubLocation.called).to.equal(true);

            expect(controllerScope.vm.editedCount.data).to.deep.equal(_.extend({}, controllerScope.vm.countsById[testId], {formatted_date: moment(controllerScope.vm.countsById[testId]['date'], 'YYYY-MM-DD').format('l')}));
            expect(controllerScope.vm.editedCount.form_data).to.deep.equal(_.extend({}, controllerScope.vm.editedCount.data, {date: moment(controllerScope.vm.editedCount.data.date, 'YYYY-MM-DD').toDate()}));
            expect(controllerScope.vm.editedCount.percentage).to.equal(parseInt(Big(controllerScope.vm.editedCount.data.percent_complete ? controllerScope.vm.editedCount.data.percent_complete : 0).round()));
            expect(controllerScope.vm.editedCount.parent_group).to.deep.equal(controllerScope.vm.countGroupsById[controllerScope.vm.editedCount.data.count_group_id]);
            expect(controllerScope.vm.editedCount.was_complete).to.equal(controllerScope.vm.editedCount.data.is_complete ? true : false);
            expect(controllerScope.vm.editingPreviouslyCreatedCount).to.equal(true);
            expect(controllerScope.vm.editedCount.is_opening_count).to.equal(false);

            expect(controllerScope.vm.canEditCount).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);

          });

          it('no items to load for count scenario', function() {

            var locationId = 7;
            var testId = 102;
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var spyCakeItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
            var spyCakeVendorLocationsLoad = sandbox.spy(controllerScope.vm.cakeVendorLocations, 'loadVendorLocations');
            var spyCakeVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
            var spyCakeInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
            var spyCakeItemUnitLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'loadItemUnitLocations');

            var deferred1 = $q.defer();
                deferred1.resolve({count: 0, results:[]});
            var mockCakeItems = sandbox.mock(controllerScope.vm.cakeItems);
            var cakeItemsLoadExpectation = mockCakeItems.expects('loadItems').returns(deferred1.promise);
            var cakeItemsGetExpectation = mockCakeItems.expects('getItems').returns([]);

            var deferred2 = $q.defer();
                deferred2.resolve({count: 0, results:[]});
            var mockCakeCountItems = sandbox.mock(controllerScope.vm.cakeCountItems);
            var cakeCountItemsLoadExpectation = mockCakeCountItems.expects('loadCountItems').returns(deferred2.promise);

            var deferred3 = $q.defer();
                deferred3.resolve({count: 0, results:[]});
            var mockCakeItemUnits = sandbox.mock(controllerScope.vm.cakeItemUnits);
            var cakeItemUnitsLoadExpectation = mockCakeItemUnits.expects('loadItemUnits').returns(deferred3.promise);

            $rootScope.$digest();

            expect(spyCakeItemLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(spyCakeVendorLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(cakeCountItemsLoadExpectation.withExactArgs({'$and': [{inv_count_id: controllerScope.vm.editedCount.data.id, location_id: locationId}]}, {sort: '-updated_at'}).verify()).to.equal(true);
            expect(cakeItemsLoadExpectation.withExactArgs(
              {
                '$or' : [
                  {   
                    '$and' : [
                      {
                        'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.item_locations_response.results, 'inv_item_id'))
                      },
                      {
                        'count_group_id' : controllerScope.vm.editedCount.data.count_group_id
                      },
                      {
                        'is_active' : true
                      }
                    ]
                  },
                  {
                    'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.count_items_response.results, 'inv_item_id'))
                  }
                ]
              },
              {
                'includes': 'wtm_invoice_items'
              }
            ).verify()).to.equal(true);
            expect(cakeItemUnitsLoadExpectation.withExactArgs({inv_item_id: 0}).verify()).to.equal(true);
            expect(spyCakeVendorItemsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'inv_item_id' :  0
                  },
                  {
                    'vendor_id' : _.uniq(_.pluck(editCountControllerTestsMockedData.vendor_locations_response.results, 'vendor_id'))
                  }
                ]
              },
              {
                'sort' : '-created_at'
              }
            )).to.equal(true);
            expect(spyCakeInvoicesLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'id' : 0
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  }
                ]
              }
            )).to.equal(true);
            expect(spyCakeItemUnitLocationsLoad.calledWithExactly(
              {
                '$and': [
                  {
                    'inv_item_unit_id' : 0
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  },
                  {
                    'is_count_unit' : true
                  }
                ]
              }
            )).to.equal(true);

            expect(controllerScope.vm.editedCount.items_data).to.deep.equal({});
            expect(controllerScope.vm.editedCount.update_timestamp).to.equal("Last Updated by " + editCountControllerTestsMockedData.user.first_name + " " + editCountControllerTestsMockedData.user.last_name + " on " + moment(controllerScope.vm.editedCount.data.updated_at, moment.ISO_8601).tz(controllerScope.vm.locationTime.timezone).format('llll') + ' ' + moment(controllerScope.vm.editedCount.data.updated_at, moment.ISO_8601).tz(controllerScope.vm.locationTime.timezone).zoneAbbr());

            expect(spyPeachEvent.called).to.equal(true);
            expect(controllerScope.vm.canEditCount).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });

          it('count with items scenario', function() {

            var locationId = 7;
            var testId = 102;
            
            var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
            var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
            var spyPeachEvent = sandbox.spy(controllerScope.vm.$peach.event, 'subscribe');
            var spyCakeItemLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemLocations, 'loadItemLocations');
            var spyCakeVendorLocationsLoad = sandbox.spy(controllerScope.vm.cakeVendorLocations, 'loadVendorLocations');
            var spyCakeCountItemsLoad = sandbox.spy(controllerScope.vm.cakeCountItems, 'loadCountItems');
            var spyCakeItemsLoad = sandbox.spy(controllerScope.vm.cakeItems, 'loadItems');
            var spyCakeItemUnitsLoad = sandbox.spy(controllerScope.vm.cakeItemUnits, 'loadItemUnits');
            var spyCakeVendorItemsLoad = sandbox.spy(controllerScope.vm.cakeVendorItems, 'loadVendorItems');
            var spyCakeInvoicesLoad = sandbox.spy(controllerScope.vm.cakeInvoices, 'loadInvoices');
            var spyCakeItemUnitLocationsLoad = sandbox.spy(controllerScope.vm.cakeItemUnitLocations, 'loadItemUnitLocations');

            var itemLocationsById = controllerScope.vm.cakeItemLocations.getItemLocationsCollection();

            $rootScope.$digest();

            expect(stubLocation.called).to.equal(true);

            expect(spyCakeItemLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(spyCakeVendorLocationsLoad.calledWithExactly({location_id: locationId})).to.equal(true);
            expect(spyCakeCountItemsLoad.calledWithExactly({'$and': [{inv_count_id: controllerScope.vm.editedCount.data.id}, {location_id: locationId}]}, {sort: '-updated_at'})).to.equal(true);
            expect(spyCakeItemsLoad.calledWithExactly(
              {
                '$or' : [
                  {   
                    '$and' : [
                      {
                        'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.item_locations_response.results, 'inv_item_id'))
                      },
                      {
                        'count_group_id' : controllerScope.vm.editedCount.data.count_group_id
                      },
                      {
                        'is_active' : true
                      }
                    ]
                  },
                  {
                    'id' : _.uniq(_.pluck(editCountControllerTestsMockedData.count_items_response.results, 'inv_item_id'))
                  }
                ]
              },
              {
                'includes': 'wtm_invoice_items'
              }
            )).to.equal(true);
            expect(spyCakeItemUnitsLoad.calledWithExactly({inv_item_id: _.uniq(_.pluck(editCountControllerTestsMockedData.items_response.results, 'id'))})).to.equal(true);
            expect(spyCakeVendorItemsLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'inv_item_id' :  _.uniq(_.pluck(editCountControllerTestsMockedData.items_response.results, 'id'))
                  },
                  {
                    'vendor_id' : _.uniq(_.pluck(editCountControllerTestsMockedData.vendor_locations_response.results, 'vendor_id'))
                  }
                ]
              },
              {
                'sort' : '-created_at'
              }
            )).to.equal(true);
            expect(spyCakeInvoicesLoad.calledWithExactly(
              {
                '$and' : [
                  {
                    'id' : _.uniq(_.pluck(_.flatten(_.compact(_.pluck(_.pluck(editCountControllerTestsMockedData.items_response.results, 'wtm_invoice_items'), 'results'))), 'invoice_id'))
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  }
                ]
              }
            )).to.equal(true);
            expect(spyCakeItemUnitLocationsLoad.calledWithExactly(
              {
                '$and': [
                  {
                    'inv_item_unit_id' : _.uniq(_.pluck(editCountControllerTestsMockedData.item_units_response.results, 'id'))
                  },
                  {
                    'location_id' : controllerScope.vm.editedCount.data.location_id
                  },
                  {
                    'is_count_unit' : true
                  }
                ]
              }
            )).to.equal(true);


            /* VALIDATING IF DATA GETS PARSED CORRECTLY */
            expect(controllerScope.vm.items.length).to.equal(editCountControllerTestsMockedData.items_response.results.length);
            expect(_.keys(controllerScope.vm.itemsById).length).to.equal(editCountControllerTestsMockedData.items_response.results.length);
            expect(_.keys(controllerScope.vm.itemUnitsById).length).to.equal(editCountControllerTestsMockedData.item_units_response.results.length);
            expect(controllerScope.vm.items.length).to.equal(editCountControllerTestsMockedData.items_response.results.length);

            _.each(controllerScope.vm.items, function(parsedItem) {
              expect(parsedItem).to.contain.all.keys(['starting_cost', 'category', 'category_id', 'category_name', 'counted', 'display', 'last_cost_updateable', 'starting_cost_updateable', 'save_starting_cost_along_with_quantity', 'units_data']);
              return;
            });

            expect(controllerScope.vm.itemsById[802]['item_location']).to.equal(itemLocationsById[1779]);
            expect(controllerScope.vm.itemsById[802]['starting_cost']).to.equal(5);
            expect(controllerScope.vm.itemsById[802]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[802]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[802]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[802]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['display']).equal(true);
            expect(controllerScope.vm.itemsById[802]['last_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[802]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[802]['units_data'].length).to.equal(4);
            _.each(controllerScope.vm.itemsById[802]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['count_label']).to.equal('Fluid Ounce (1 floz)');
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['cost_label']).to.equal('per Fluid Ounce');
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['item']['id']).to.equal(802);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['cost_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['new_cost_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[802]['units_data'][2]['count_object']).to.equal(null);



            expect(controllerScope.vm.itemsById[1421]['item_location']).to.equal(itemLocationsById[1581]);
            expect(controllerScope.vm.itemsById[1421]['starting_cost']).to.equal(0);
            expect(controllerScope.vm.itemsById[1421]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1421]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1421]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1421]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['last_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1421]['starting_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[1421]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[1421]['units_data'].length).to.equal(3);
            _.each(controllerScope.vm.itemsById[1421]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['count_label']).to.equal('Keg (Keg 1984.00000 floz)');
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['cost_label']).to.equal('per Keg');
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['item']['id']).to.equal(1421);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['new_cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['quantity_value']).to.equal(0);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['new_quantity_value']).to.equal(0);
            expect(controllerScope.vm.itemsById[1421]['units_data'][1]['count_object']['id']).to.equal(6097);

            

            expect(controllerScope.vm.itemsById[1730]['item_location']).to.equal(itemLocationsById[6763]);
            expect(controllerScope.vm.itemsById[1730]['starting_cost']).to.equal(0);
            expect(controllerScope.vm.itemsById[1730]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1730]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1730]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1730]['counted']).to.equal(false);
            expect(controllerScope.vm.itemsById[1730]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['last_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['save_starting_cost_along_with_quantity']).to.equal(true);
            expect(controllerScope.vm.itemsById[1730]['units_data'].length).to.equal(1);
            _.each(controllerScope.vm.itemsById[1730]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['count_label']).to.equal('Bottle');
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['cost_label']).to.equal('per Bottle');
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['item']['id']).to.equal(1730);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['new_cost_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['new_quantity_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1730]['units_data'][0]['count_object']).to.equal(null);

            

            expect(controllerScope.vm.itemsById[1525]['item_location']).to.equal(undefined);
            expect(controllerScope.vm.itemsById[1525]['starting_cost']).to.equal(0);
            expect(controllerScope.vm.itemsById[1525]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1525]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1525]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1525]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1525]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1525]['last_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[1525]['starting_cost_updateable']).to.equal(false);
            expect(controllerScope.vm.itemsById[1525]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[1525]['units_data'].length).to.equal(4);
            _.each(controllerScope.vm.itemsById[1525]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['count_label']).to.equal('Bottle (Bottle 33.814 floz)');
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['cost_label']).to.equal('per Bottle');
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['item']['id']).to.equal(1525);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['new_cost_value']).to.equal(null);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['quantity_value']).to.equal(10);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['new_quantity_value']).to.equal(10);
            expect(controllerScope.vm.itemsById[1525]['units_data'][0]['count_object']['id']).to.equal(6090);



            expect(controllerScope.vm.itemsById[1660]['item_location']).to.equal(itemLocationsById[5937]);
            expect(controllerScope.vm.itemsById[1660]['starting_cost']).to.equal(20);
            expect(controllerScope.vm.itemsById[1660]['category']).to.deep.equal(controllerScope.vm.glAccountsById[16]);
            expect(controllerScope.vm.itemsById[1660]['category_id']).to.equal(controllerScope.vm.glAccountsById[16]['id']);
            expect(controllerScope.vm.itemsById[1660]['category_name']).to.equal(controllerScope.vm.glAccountsById[16]['name']);
            expect(controllerScope.vm.itemsById[1660]['counted']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['display']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['last_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['starting_cost_updateable']).to.equal(true);
            expect(controllerScope.vm.itemsById[1660]['save_starting_cost_along_with_quantity']).to.equal(false);
            expect(controllerScope.vm.itemsById[1660]['units_data'].length).to.equal(7);
            _.each(controllerScope.vm.itemsById[1660]['units_data'], function(parsedItemUnit) {
              expect(parsedItemUnit).to.contain.all.keys(['count_label', 'cost_label', 'item', 'cost_value', 'new_cost_value', 'quantity_value', 'new_quantity_value', 'count_object']);
              return;
            });
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['count_label']).to.equal('Liter (Liter 0.11193 pound)');
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['cost_label']).to.equal('per Liter');
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['item']['id']).to.equal(1660);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['cost_value']).to.equal(2.2386);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['new_cost_value']).to.equal(2.2386);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['quantity_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['new_quantity_value']).to.equal(5);
            expect(controllerScope.vm.itemsById[1660]['units_data'][1]['count_object']['id']).to.equal(6295);

            expect(controllerScope.vm.editedCount.items_data).to.contain.all.keys('Beer');
            expect(controllerScope.vm.editedCount.items_data['Beer']).to.contain.all.keys('counted_items', 'items');
            expect(controllerScope.vm.editedCount.items_data['Beer']['counted_items'].length).to.equal(4);
            expect(controllerScope.vm.editedCount.items_data['Beer']['items'].length).to.equal(6);
            expect(controllerScope.vm.editedCount.items_data['Beer']['items'][0]['id']).to.equal(802);
            expect(controllerScope.vm.editedCount.items_data['Beer']['items'][5]['id']).to.equal(1660);

            expect(spyPeachEvent.called).to.equal(true);
            expect(controllerScope.vm.canEditCount).to.equal(true);
            expect(controllerScope.vm.blockers.initializing).to.equal(false);
          
          });        

        });
  
      });

    });

  });

  describe('Functions', function() {

    it('closeModal should display confirmation dialog and redirect to counts page', function() {

      var spyClosingConfirmation = sandbox.spy(controllerScope.vm, 'confirmSaveCount');
      var spyGoBack = sandbox.spy(controllerScope.vm, 'goBack');

      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.editedCount.data.is_complete = true;
      controllerScope.vm.closeModal();
      expect(spyClosingConfirmation.called).to.equal(false);
      expect(spyGoBack.calledOnce).to.equal(true);

      controllerScope.vm.editedCount.data = {};
      controllerScope.vm.closeModal();
      expect(spyClosingConfirmation.called).to.equal(false);
      expect(spyGoBack.calledTwice).to.equal(true);

      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.editedCount.data.is_complete = false;
      controllerScope.vm.closeModal();
      expect(spyClosingConfirmation.calledOnce).to.equal(true);
      expect(spyGoBack.calledThrice).to.equal(false);

    });

    it('confirmDeleteCount should display count delete confirmation dialog', function() {

      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return 7; });
      var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": 102}; });
      var spyModalShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');

      controllerScope.$digest();
      controllerScope.vm.confirmDeleteCount();
      controllerScope.$digest();
      expect(spyModalShow.called).to.equal(true);

    });

    it('confirmSaveCount should display count save confirmation dialog', function() {

      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return 7; });
      var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": 102}; });
      var spyModalShow = sandbox.spy(controllerScope.vm.$mdDialog, 'show');

      controllerScope.$digest();
      controllerScope.vm.confirmDeleteCount();
      controllerScope.$digest();
      expect(spyModalShow.called).to.equal(true);

    });

    it('createCount should create new count in database and open it for editing', function() {

      var locationId = 7;
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var spyCountCreate = sandbox.spy(controllerScope.vm.cakeCounts, 'createCount');
      // change mocked data slightly to test this scenario
      var countItemsMockedData = [];
      var countItemsLoadStub = sandbox.stub(controllerScope.vm.cakeCountItems, 'getCountItems', function() { return countItemsMockedData; });

      controllerScope.$digest();

      controllerScope.vm.canEditCount = false;
      controllerScope.vm.createCount();
      expect(spyCountCreate.called).to.equal(false);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.form_data.count_group_id = 81;
      controllerScope.vm.editedCount.form_data.date = moment('1.1.2015', 'D.M.YYYY');
      controllerScope.vm.editedCount.form_data.updated_at = moment().toISOString();
      controllerScope.vm.editedCount.form_data.updated_by = 44;
      var formDataCopy = angular.copy(controllerScope.vm.editedCount.form_data);
      controllerScope.vm.createCount();
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(controllerScope.vm.editedCount.data.formatted_date).to.equal(moment(formDataCopy.date, 'YYYY-MM-DD').format('l'));
      expect(controllerScope.vm.editedCount.form_data).to.deep.equal(_.extend({}, controllerScope.vm.editedCount.data, {date: moment(controllerScope.vm.editedCount.data.date, 'YYYY-MM-DD').toDate()}));
      expect(controllerScope.vm.editedCount.percentage).to.equal(0);
      expect(controllerScope.vm.editedCount.parent_group).to.deep.equal(controllerScope.vm.countGroupsById[controllerScope.vm.editedCount.data.count_group_id]);
      expect(controllerScope.vm.editedCount.was_complete).to.equal(false);
      expect(controllerScope.vm.editingPreviouslyCreatedCount).to.equal(false);
      expect(controllerScope.vm.editedCount.is_opening_count).to.equal(true); 
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('deleteCount should remove count from database and redirect to counts page', function() {

      var spyRemoveCount = sandbox.spy(controllerScope.vm.cakeCounts, 'removeCount');
      var spyGoBack = sandbox.spy(controllerScope.vm, 'goBack');

      controllerScope.vm.canEditCount = false;
      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.deleteCount();
      expect(spyRemoveCount.called).to.equal(false);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.data = {};
      controllerScope.vm.deleteCount();
      expect(spyRemoveCount.called).to.equal(false);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.deleteCount();
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyRemoveCount.called).to.equal(true);
      expect(spyGoBack.called).to.equal(true);

    });

    it('goBack should redirect back to counts page', function() {

      controllerScope.vm.goBack();

      expect(controllerScope.vm.$location.path()).to.be.equal('/counts');
      expect(controllerScope.vm.$location.search()).not.to.have.property('id');

    });

    it('saveCost should update item location entry with given cost', function() {

      var locationId = 7;
      var testId = 102;
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
      var spyCakeItemLocationsUpdate = sandbox.spy(controllerScope.vm.cakeItemLocations, 'updateItemLocation');

      controllerScope.$digest();

      controllerScope.vm.itemUnitsById[4695]['new_cost_value'] = 240;
      controllerScope.vm.saveCost(4695);
      expect(spyCakeItemLocationsUpdate.called).to.equal(false);

      controllerScope.vm.itemUnitsById[4695]['new_cost_value'] = 280;
      controllerScope.vm.saveCost(4695);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyCakeItemLocationsUpdate.calledWithExactly({id: 5937, starting_cost: 20, last_cost: 20})).to.equal(true);
      expect(controllerScope.vm.itemUnitsById[4695]['cost_value']).to.equal(280);
      expect(controllerScope.vm.itemUnitsById[4695]['item']['starting_cost']).to.equal(20);
      

    });

    it('saveQuantity should create/update count item entry with given quantity', function() {

      var locationId = 7;
      var testId = 102;
      var stubPeachSession = sandbox.stub(controllerScope.vm.$peach.session, 'getActiveLocation', function() { return locationId; });
      var stubLocation = sandbox.stub(controllerScope.vm.$location, 'search', function() { return {"id": testId}; });
      var spyCakeCountItemCreate = sandbox.spy(controllerScope.vm.cakeCountItems, 'createCountItem');
      var spyCakeCountItemUpdate = sandbox.spy(controllerScope.vm.cakeCountItems, 'updateCountItem');
      var spyCakeCountItemDelete = sandbox.spy(controllerScope.vm.cakeCountItems, 'removeCountItem');
      var spyCakeCountsUpdate = sandbox.spy(controllerScope.vm.cakeCounts, 'updateCount');
      var spyAutoSaveCost = sandbox.spy(controllerScope.vm, 'saveCost');

      controllerScope.$digest();

      controllerScope.vm.itemUnitsById[4054]['new_quantity_value'] = 0;
      controllerScope.vm.saveQuantity(4054);
      controllerScope.$digest();
      expect(spyCakeCountItemCreate.called).to.equal(false);
      expect(spyCakeCountItemUpdate.called).to.equal(false);
      expect(spyCakeCountItemDelete.called).to.equal(false);
      expect(spyCakeCountsUpdate.called).to.equal(false);
      expect(spyAutoSaveCost.called).to.equal(false);

      controllerScope.vm.itemUnitsById[4054]['new_quantity_value'] = null;
      controllerScope.vm.saveQuantity(4054);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(spyCakeCountItemCreate.called).to.equal(false);
      expect(spyCakeCountItemUpdate.called).to.equal(false);
      expect(spyCakeCountItemDelete.calledWithExactly({id: 6096})).to.equal(true);
      expect(controllerScope.vm.itemUnitsById[4054]['count_object']).to.equal(null);
      expect(controllerScope.vm.itemUnitsById[4054]['quantity_value']).to.equal(null);
      expect(controllerScope.vm.itemUnitsById[4054]['new_quantity_value']).to.equal(null);
      expect(controllerScope.vm.itemUnitsById[4054]['item']['counted']).to.equal(true);
      expect(spyCakeCountsUpdate.called).to.equal(false);
      expect(spyAutoSaveCost.called).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

      controllerScope.vm.itemUnitsById[4055]['new_quantity_value'] = 10;
      controllerScope.vm.saveQuantity(4055);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(spyCakeCountItemCreate.called).to.equal(false);
      expect(spyCakeCountItemUpdate.calledWithExactly({
        id                    : 6097,
        quantity              : 10,
        common_unit_quantity  : 19840
      })).to.equal(true);
      expect(spyCakeCountItemDelete.calledOnce).to.equal(true); // prev test called it
      expect(controllerScope.vm.itemUnitsById[4055]['count_object']['common_unit_quantity']).to.equal(19840);
      expect(controllerScope.vm.itemUnitsById[4055]['quantity_value']).to.equal(10);
      expect(controllerScope.vm.itemUnitsById[4055]['item']['counted']).to.equal(true);
      expect(spyCakeCountsUpdate.called).to.equal(false);
      expect(spyAutoSaveCost.called).to.equal(false);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

      controllerScope.vm.itemUnitsById[4819]['new_quantity_value'] = 10;
      controllerScope.vm.saveQuantity(4819);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(spyCakeCountItemCreate.calledWithExactly({
        inv_count_id          : 102,
        inv_item_id           : 1730,
        inv_item_unit_id      : 4819,
        common_unit_id        : 5,
        quantity              : 10,
        common_unit_quantity  : 10,
        location_id           : 7
      })).to.equal(true);
      expect(spyCakeCountItemUpdate.calledOnce).to.equal(true); // prev test called it
      expect(spyCakeCountItemDelete.calledOnce).to.equal(true); // first test called it
      expect(controllerScope.vm.itemUnitsById[4819]['count_object']).to.not.equal(null);
      expect(controllerScope.vm.itemUnitsById[4819]['quantity_value']).to.equal(10);
      expect(controllerScope.vm.itemUnitsById[4819]['item']['counted']).to.equal(true);
      expect(controllerScope.vm.itemUnitsById[4819]['item']['save_starting_cost_along_with_quantity']).to.equal(false);
      expect(spyCakeCountsUpdate.called).to.equal(true);
      expect(spyAutoSaveCost.calledWithExactly(4819)).to.equal(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);

    });

    it('toggleCountIsComplete should toggle count status (and either make it editable or run counting task)', function() {

      var spyUpdateCount = sandbox.spy(controllerScope.vm, 'updateCount');
      var spyCakeCountsUpdate = sandbox.spy(controllerScope.vm.cakeCounts, 'updateCount');

      controllerScope.vm.canEditCount = false;
      controllerScope.vm.editedCount.was_complete = true;
      controllerScope.vm.editedCount.form_data.is_complete = true;
      controllerScope.vm.toggleCountIsComplete();
      expect(spyUpdateCount.called).to.equal(false);
      expect(spyCakeCountsUpdate.called).to.equal(false);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.form_data.is_complete = true;
      controllerScope.vm.editedCount.was_complete = true;
      controllerScope.vm.toggleCountIsComplete();
      expect(spyUpdateCount.calledWith(true)).to.equal(true);
      expect(spyCakeCountsUpdate.called).to.equal(false);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.form_data.is_complete = false;
      controllerScope.vm.editedCount.was_complete = true;
      controllerScope.vm.toggleCountIsComplete();
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyUpdateCount.calledOnce).to.equal(true); // prev test called it
      expect(spyCakeCountsUpdate.called).to.equal(true);
      expect(controllerScope.vm.editedCount.form_data.is_complete).to.equal(false);
      expect(controllerScope.vm.editedCount.data.is_complete).to.equal(false);

    });

    it('updateCount should update count with given data using api call, eventually running counting task', function() {

      var spyCakeCountsUpdate = sandbox.spy(controllerScope.vm.cakeCounts, 'updateCount');
      var spyCakeCountItems = sandbox.spy(controllerScope.vm.cakeCountItems, 'bulkCreateCountItems');
      var spyGoBack = sandbox.spy(controllerScope.vm, 'goBack');
      var deferred = $q.defer();
          deferred.resolve({taskId: 999});
      var mockTaskResource = sandbox.mock(controllerScope.vm.taskResource);
      var taskCreateExpectation = mockTaskResource.expects('create').returns(deferred.promise);
      var deferred2 = $q.defer();
          deferred2.resolve({status: 'job completed'});
      var mockTaskQueueResource = sandbox.mock(controllerScope.vm.taskQueueResource);
      var taskQueueFindExpectation = mockTaskQueueResource.expects('find').returns(deferred2.promise);

      controllerScope.vm.canEditCount = false;
      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.updateCount();
      expect(spyCakeCountsUpdate.called).to.equal(false);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.editedCount.data.is_complete = false;
      controllerScope.vm.editedCount.percentage = 10;
      controllerScope.vm.editedCount.form_data.notes = 'test';
      controllerScope.vm.editedCount.form_data.date = moment('1.1.2015', 'D.M.YYYY');
      controllerScope.vm.updateCount();
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyCakeCountsUpdate.calledWith({
        id                : 1,
        percent_complete  : 10,
        notes             : 'test',
        date              : '2015-01-01'
      })).to.equal(true);
      expect(spyGoBack.called).to.equal(true);

      controllerScope.vm.canEditCount = true;
      controllerScope.vm.editedCount.data.id = 1;
      controllerScope.vm.editedCount.data.is_complete = true;
      controllerScope.vm.editedCount.percentage = 10;
      controllerScope.vm.editedCount.form_data.notes = 'test';
      controllerScope.vm.editedCount.form_data.date = moment('1.1.2015', 'D.M.YYYY');
      controllerScope.vm.updateCount(true);
      expect(controllerScope.vm.blockers.api_processing).to.equal(true);
      controllerScope.$digest();
      expect(controllerScope.vm.blockers.api_processing).to.equal(false);
      expect(spyCakeCountsUpdate.calledWith({
        id                : 1,
        percent_complete  : 10,
        notes             : 'test',
        is_complete       : true
      })).to.equal(true);
      expect(spyCakeCountItems.called).to.equal(true);
      expect(taskCreateExpectation.withExactArgs({
        id        : editCountControllerTestsMockedData.task_id,
        task_data : JSON.stringify({count_id: 1})
      }).verify()).to.equal(true);
      expect(spyCakeCountsUpdate.calledWith({
         id        : 1,
         task_id   : 999
      }));
      expect(controllerScope.vm.editedCount.data.task_id).to.equal(999);
      expect(taskQueueFindExpectation.withExactArgs(999).verify()).to.equal(true);
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