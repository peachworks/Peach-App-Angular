'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

var paths = gulp.paths;

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractorApp (done) {

  gulp.src(paths.app.e2e + '/**/*.js')
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
}

gulp.task('protractor', ['protractor:app']);
gulp.task('protractor:app', ['serve:app:e2e', 'webdriver-update'], runProtractorApp);
gulp.task('protractor:app:dist', ['serve:app:e2e-dist', 'webdriver-update'], runProtractorApp);
