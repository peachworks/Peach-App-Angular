'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function(options) {
  function listFiles(callback) {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      exclude: [/jquery/, /bootstrap\.js/],
      dependencies: true,
      devDependencies: true
    });

    var srcFiles = [
      'tests.webpack.js'
    ];

    gulp.src(srcFiles)
      .pipe(concat(function(files) {
        callback(bowerDeps.js
          .concat(_.pluck(files, 'path')));
      }));
  }

  function runTests (singleRun, done) {
    listFiles(function(files) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun
      }, done);
    });
  }

  gulp.task('test', function(done) {
    runTests(true, done);
  });

  gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
  });

  gulp.task('test:tdd', ['serve', 'watch'], function(done) {
    runTests(false, done);
  });
};
