'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch:app', ['inject:app'], function () {
  gulp.watch([
    paths.app.src + '/*.html',
    paths.app.src + '/**/*.css',
    paths.app.src + '/**/*.js',
    'bower.json'
  ], ['inject:app']);
});
