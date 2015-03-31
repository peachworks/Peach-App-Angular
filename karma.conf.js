'use strict';

module.exports = function(config) {

  var configuration = {
    autoWatch : false,

    frameworks: ['mocha', 'sinon-chai'],

    reporters: [ 'mocha', 'coverage'], //report results in this format

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/app/',
      moduleName: 'templates'
    },

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sinon-chai',
      'karma-coverage',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
      'client/app/**/*.html': ['ng-html2js'],
      '.tmp/app/serve/app.js': ['coverage']
    },

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'text', subdir: '.' }
      ]
    }
  };

  config.set(configuration);
};
