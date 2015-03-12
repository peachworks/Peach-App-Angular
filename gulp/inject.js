'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

gulp.task('inject:app', ['browserify:app'], function () {

  var injectStyles = gulp.src([
    paths.app.src + '/**/*.css'
  ], { read: false });

  var injectScripts = gulp.src([
    paths.app.tmp + '/serve/**/*.js',
    '!' + paths.app.src + '/**/*.spec.js',
    '!' + paths.app.src + '/**/*.mock.js'
  ], { read: false });

  var injectOptions = {
    ignorePath: [paths.app.src, paths.app.tmp + '/serve'],
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components'
  };

  return gulp.src('client/app.index.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.app.tmp + '/serve'));

});
