var context = require.context('./client/app', true, /\.spec\.js$/);
context.keys().forEach(context);
