'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

var paths = gulp.paths;

function runTestsApp (singleRun, done) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    'node_modules/angular-new-router/dist/router.es5.js',
    paths.app.tmp + '/serve/index.js',
    paths.app.src + '/**/*.spec.js',
    paths.app.src + '/**/*.mock.js'
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
}

gulp.task('test:app', ['browserify:app'], function (done) { runTestsApp(true /* singleRun */, done) });
gulp.task('test:app:auto', ['browserify:app'], function (done) { runTestsApp(false /* singleRun */, done) });
