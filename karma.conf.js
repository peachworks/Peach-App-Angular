'use strict';

module.exports = function(config) {

  var configuration = {
    browsers : ['Chrome'],
    autoWatch : true,
    singleRun: true,
    frameworks: ['mocha', 'sinon-chai'],
    //files: [] /* Populated by gulp */
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha', 'coverage'],
    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'text', subdir: '.' }
      ]
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /(client\/app)(.+)\.js$/, exclude: /node_modules/, loader: 'babel-loader?blacklist=useStrict' },
          { test: /(client\/app)(.+)\.html$/, exclude: /node_modules/, loader: "ngtemplate?relativeTo=client/app/&prefix=./!html" }
        ],
        preLoaders: [
          { test: /(client\/app)(.+)\.js$/, loader: 'baggage?[file].html' }
        ],
        postLoaders: [
          { test: /(client\/app)(.+)\.js$/, exclude: /.spec.js/, loader: 'istanbul-instrumenter' }
        ]
      },
      resolve: {
        extensions: ['', '.js', '.json']
      }
    },
    webpackServer: {
      noInfo: true
    }
  };

  config.set(configuration);
};
