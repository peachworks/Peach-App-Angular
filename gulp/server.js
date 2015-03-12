'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser, indexFile) {
  browser = browser === undefined ? 'default' : browser;
  indexFile = indexFile === undefined ? 'app.index.html' : indexFile;

  var routes = null;
  if(baseDir === paths.app.src || (util.isArray(baseDir) && baseDir.indexOf(paths.app.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components',
      '/node_modules': 'node_modules'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/' + indexFile,
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });
}

gulp.task('serve', ['serve:app']);

gulp.task('serve:app', ['watch:app'], function () {
  browserSyncInit([
    paths.app.tmp + '/serve',
    paths.app.src
  ], [
    paths.app.src + '/{app,components}/**/*.css',
    paths.app.tmp + '/serve/{app,components}/**/*.js',
    paths.app.src + 'src/assets/images/**/*',
    paths.app.tmp + '/serve/**/*.html',
    paths.app.src + '/**/*.html'
  ], undefined, 'app.index.html');
});

gulp.task('serve:app:dist', ['build:app'], function () {
  browserSyncInit(paths.app.dist, [], undefined, 'app.index.html');
});

gulp.task('serve:app:e2e', ['inject:app'], function () {
  browserSyncInit([paths.app.tmp + '/serve', paths.app.src], null, [], 'app.index.html');
});

gulp.task('serve:app:e2e-dist', ['build:app'], function () {
  browserSyncInit(paths.app.dist, null, [], 'app.index.html');
});
