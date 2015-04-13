var gulp = require('gulp');
var bump = require('gulp-bump');

module.exports = function(options) {

  var VERSION_FILES = ['./package.json', './bower.json'];

  gulp.task('bump', function() {
    return gulp.src(VERSION_FILES)
      .pipe(bump())
      .pipe(gulp.dest('./'));
  });

  gulp.task('bump:minor', function() {

    return gulp.src(VERSION_FILES)
      .pipe(bump({type:'minor'}))
      .pipe(gulp.dest('./'));
  });

  gulp.task('bump:major', function() {

    return gulp.src(VERSION_FILES)
      .pipe(bump({type:'major'}))
      .pipe(gulp.dest('./'));
  });
};
