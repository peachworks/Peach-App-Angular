'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

gulp.task('scripts:app', function () {
  return gulp.src(paths.app.src + '/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.babel())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.app.tmp + '/babel'))
    .pipe($.size())
});

gulp.task('browserify:app', ['scripts:app'], function () {
  return gulp.src(paths.app.tmp + '/babel/index.js', { read: false })
    .pipe($.browserify())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.app.tmp + '/serve'))
    .pipe($.size());
});
