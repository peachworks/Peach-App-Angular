'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'client',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  app: {
    src: 'client/app',
    dist: 'dist/app',
    tmp: '.tmp/app',
    e2e: 'e2e/app'
  }
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
