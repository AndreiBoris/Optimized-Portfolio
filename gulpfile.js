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
    critical = require('critical');

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
  gulp.start('styles', 'scripts', 'images', 'lazycss', 'copyhtml');
});

// Default
gulp.task('default', ['main'], function() {
  gulp.start('critical')
})

/*gulp.task('copystyles', function () {
    return gulp.src(['dist/styles/main.min.css'])
        .pipe(rename({
            basename: "site" // site.css
        }))
        .pipe(gulp.dest('dist/styles'));
});*/

gulp.task('copyhtml', function () {
    return gulp.src(['index.html'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('lazycss', function() {
    return gulp.src('src/cssLoading.js')
      .pipe(gulp.dest('dist/scripts'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'))
      .pipe(notify({ message: 'LazyCSS task complete' }));

})

// Critical CSS
gulp.task('critical', ['styles', 'copyhtml'], function () {
    critical.generate({
        inline: false,
        base: 'dist/',
        src: 'index.html',
        css: ['dist/styles/main.min.css'],
        width: 1300,
        height: 900,
        dest: 'css-critical.css',

    });
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch index.html
  gulp.watch('index.html', ['copyhtml']);

  // Watch copy of index.html
  gulp.watch('dist/index.html', ['critical']);

  // Watch cssLoading.js
  gulp.watch('src/cssLoading.js', ['lazycss']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});