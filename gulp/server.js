'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var util = require('util');

var middleware = require('./proxy');

module.exports = function(options) {

  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components',
        '/preview/accounts/1/apps/appKey': options.tmp + '/serve',
        '/preview/accounts/1/apps/appKey/components': options.src + '/components',
        '/preview/accounts/1/apps/appKey/common': options.src + '/common',
        '/preview/accounts/1/apps/appKey/assets': options.src + '/assets',
        '/preview/accounts/1/bower_components': 'bower_components'
      };
    } else if (baseDir === options.dist || (util.isArray(baseDir) && baseDir.indexOf(options.dist) !== -1)) {
      routes = {
        '/bower_components': 'bower_components',
        '/preview/accounts/1/apps/appKey/scripts': options.dist + '/scripts',
        '/preview/accounts/1/apps/appKey/assets': options.dist + '/assets',
        '/preview/accounts/1/apps/appKey/styles': options.dist + '/styles',
        '/preview/accounts/1/bower_components': 'bower_components'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      startPath: 'login.html',
      server: server,
      browser: browser
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  gulp.task('serve', ['watch'], function () {
    browserSyncInit([options.tmp + '/serve', options.src, 'client']);
  });

  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit([options.dist, 'client']);
  });

  gulp.task('serve:e2e', ['inject'], function () {
    browserSyncInit([options.tmp + '/serve', options.src, 'client'], []);
  });

  gulp.task('serve:e2e-dist', ['build'], function () {
    browserSyncInit([options.dist, 'client'], []);
  });
};
