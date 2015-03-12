'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

//////////////////////////////////
// PARTIALS

gulp.task('partials', ['partials:app']);

gulp.task('partials:app', function () {
  return gulp.src([
    paths.app.src + '/**/*.html'
    //paths.app.tmp + '/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'peachApp'
    }))
    .pipe(gulp.dest(paths.app.tmp + '/partials/'));
});


//////////////////////////////////
// HTML

gulp.task('html', ['html:app']);

gulp.task('html:app', ['inject:app', 'partials:app'], function () {
  var partialsInjectFile = gulp.src(paths.app.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.app.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(paths.app.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.app.dist + '/'))
    .pipe($.size({ title: paths.app.dist + '/', showFiles: true }));
});


//////////////////////////////////
// IMAGES

gulp.task('images', ['images:app']);

gulp.task('images:app', function () {
  return gulp.src(paths.app.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.app.dist + '/assets/images/'));
});


//////////////////////////////////
// FONTS

gulp.task('fonts', ['fonts:app']);

gulp.task('fonts:app', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.app.dist + '/fonts/'));
});


//////////////////////////////////
// MISC

gulp.task('misc', ['misc:app']);

gulp.task('misc:app', function () {
  return gulp.src(paths.app.src + '/**/*.ico')
    .pipe(gulp.dest(paths.app.dist + '/'));
});


//////////////////////////////////
// CLEAN

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('clean:app', function (done) {
  $.del([paths.app.dist + '/', paths.app.tmp + '/'], done);
});


//////////////////////////////////
// BUILD

gulp.task('build', ['build:app']);
gulp.task('build:app', ['html:app', 'images:app', 'fonts:app', 'misc:app']);
