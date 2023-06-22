const gulp = require('gulp');
const data = require('gulp-data');
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const fs = require('fs');


// Compile Nunjucks templates
function compileNunjucks() {
  return gulp
    .src('src/templates/pages/**/*.njk')
    .pipe(data(() => JSON.parse(fs.readFileSync('src/data/content.json'))))
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Compile SCSS files
function compileSass() {
  return gulp
    .src('src/assets/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(browserSync.stream());
}

// Copy assets
function copyAssets() {
  return gulp
    .src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.stream());
}

// Watch for changes in Nunjucks, Sass, data, and image files
function watchFiles() {
  gulp.watch('src/templates/**/*.njk', compileNunjucks);
  gulp.watch('src/assets/styles/**/*.scss', compileSass);
  gulp.watch('src/data/content.json', compileNunjucks);
  gulp.watch('src/assets/**/*', copyAssets);
}

// Initialize BrowserSync
function browserSyncTask() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    port: 3000, // Customize as per your preference
    open: true, // Set to false if you don't want the browser to open automatically
  });
}

// Default task
gulp.task(
  'default',
  gulp.parallel(compileNunjucks, compileSass, copyAssets, watchFiles, browserSyncTask)
);
