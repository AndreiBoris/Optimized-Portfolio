/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    critical = require('critical'),
    minifyHTML = require('gulp-minify-html');

// Styles
gulp.task('styles', function() {
  return sass('src/styles/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images']);
});

// Main task
gulp.task('main', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'lazycss');
});

// Default
gulp.task('default', ['main', 'minify-html'], function() {
  gulp.start('critical')
})

gulp.task('lazycss', function() {
    return gulp.src('src/cssLoading.js')
      .pipe(gulp.dest('dist/scripts'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'))
})

// Critical CSS
gulp.task('critical', ['styles'], function () {
    critical.generate({
        inline: true,
        base: 'dist/html/',
        src: 'index.html',
        css: ['dist/styles/main.min.css'],
        width: 1300,
        height: 900,
        dest: 'dist/../index.html',
    });
});

// scan main.js
gulp.task('scan', function() {
  return gulp.src('views/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
});

// Minify HTML
gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('src/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist/html/'));
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch .js files for views
  gulp.watch('views/js/**/*.js', ['scan']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch src/index.html
  gulp.watch('src/index.html', ['minify-html']);

  // Watch copy of index.html
  gulp.watch('dist/html/index.html', ['critical']);

  // Watch cssLoading.js
  gulp.watch('src/cssLoading.js', ['lazycss']);

  /*// Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);*/

});