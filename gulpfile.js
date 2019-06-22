var themename = 'themes/afrihostchatgroup';


var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    globbing = require('gulp-css-globbing'),
    sourcemaps = require('gulp-sourcemaps'),
    opn = require('opn');


var root = themename + '/',
    scss = root + 'sass/',
    js = root + 'src/js/';


var indexHtmlWatchFile = 'index.html',
    styleWatchFiles = scss + '**/*.scss';

var cssSRC = [
    root + 'styles.css'
];

var server = {
  host: 'localhost',
  port: '8001'
}

function sass(){
  return gulp.src([scss + 'styles.scss'])
    .pipe(globbing({ extensions: ['.scss'] }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(root));
}

function printCSS(){
    return gulp.src(cssSRC)
    .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
    .pipe(gulp.dest(root));
}

function webserver(){
  return gulp.src( '.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      directoryListing: false
    }));
}

function openbrowser(){
  opn( 'http://' + server.host + ':' + server.port );
}

function watch(){
  browserSync.init({
        open: 'external'
  });
  gulp.watch('*.html').on('change', reload);
  gulp.watch(styleWatchFiles, gulp.series([sass,printCSS]));
  gulp.watch([indexHtmlWatchFile, root + 'styles.css']).on('change', browserSync.reload);
}

exports.sass = sass;
exports.printCSS = printCSS;
exports.webserver = webserver;
exports.openbrowser = openbrowser;
exports.watch = watch;


var build = gulp.parallel(watch);
gulp.task('default', build, sass , printCSS, webserver, openbrowser, watch);
