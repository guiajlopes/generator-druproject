'use strict'

var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    minify      = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    plumber     = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith'),
    neat        = require('node-neat').includePaths;

//////////////////////////////
// PATHS
//////////////////////////////
var path = {
  sassWatch: [
    'assets/scss/*.scss',
    'assets/scss/**/*.scss'
  ],
  sass_src_S: 'assets/scss/style.scss',
  sass_src_P: 'assets/scss/print.scss',
  sass_dest: 'dist/css',
  js_lint_src: [
      'dist/js/*.js'
  ],
  js_src : [
      'assets/js/*.js'
  ],
  js_dest : 'dist/js/'
};

//////////////////////////////
// BrowserSync
//////////////////////////////
gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        proxy: "<%= projectHost %>",
        notify: false
    });
});

gulp.task('bs-reload', function (){
    browserSync.reload();
});

//////////////////////////////
// JS Tasks
//////////////////////////////
gulp.task('js', function () {
    gulp.src(path.js_src)
        .on('error',console.log.bind(console))
        .pipe(uglify())
        .on('error',console.log.bind(console))
        .pipe(concat('main.js'))
        .on('error',console.log.bind(console))
        .pipe(gulp.dest('dist/js'))
        .on('error',console.log.bind(console));
});

//////////////////////////////
// SASS Tasks
//////////////////////////////
gulp.task('sass', function(){
    gulp.src(path.sass_src_S)
        .pipe(sass({
            includePaths: ['styles'].concat(neat)
        }))
        .on('error',console.log.bind(console))
        .pipe(minify())
        .on('error',console.log.bind(console))
        .pipe(concat('style.css'))
        .on('error',console.log.bind(console))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .on('error',console.log.bind(console));
    gulp.src(path.sass_src_P)
        .pipe(sass({
            includePaths: ['styles'].concat(neat)
        }))
        .on('error',console.log.bind(console))
        .pipe(minify())
        .on('error',console.log.bind(console))
        .pipe(concat('print.css'))
        .on('error',console.log.bind(console))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .on('error',console.log.bind(console));
});

//////////////////////////////
// SPRITE Tasks
//////////////////////////////
gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/img/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png'
  })).on('error',console.log.bind(console));
  spriteData.img.pipe(gulp.dest('dist/img/')).on('error',console.log.bind(console));
  spriteData.css.pipe(gulp.dest('assets/scss/config/')).on('error',console.log.bind(console));
});

//////////////////////////////
// Watch Tasks
//////////////////////////////
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(path.js_src, ['js']).on('error',console.log.bind(console));
    gulp.watch(path.sassWatch, ['sass']).on('error',console.log.bind(console));
    gulp.watch('assets/img/sprite/*.*', ['sprite']).on('error',console.log.bind(console));

    gulp.watch('dist/js/*.*').on('change', browserSync.reload);
});

//////////////////////////////
//Default Tasks
//////////////////////////////
gulp.task('default', [
    'sass',
    'js',
    'watch',
    'sprite'
]);

//////////////////////////////
// img Deploy
//////////////////////////////
gulp.task('img-deploy', function () {
    gulp.src(['assets/img/*']).pipe(gulp.dest('dist/img'))
});

//////////////////////////////
// Font Deploy
//////////////////////////////
gulp.task('font-deploy', function () {
    gulp.src(['assets/fonts/*']).pipe(gulp.dest('dist/fonts'))
});

//////////////////////////////
/// BUILD TASK FOR JENKINS
//////////////////////////////
gulp.task('build', [
    'sass',
    'js',
    'sprite',
    'font-deploy',
    'img-deploy'
]);
