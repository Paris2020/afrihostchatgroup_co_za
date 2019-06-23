var themename = 'themes/afrihostchatgroup';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    sourcemaps = require('gulp-sourcemaps'),
    fs = require('fs');


if( fs.existsSync('./domain.json') ) {
    var domain = require('./domain.json');
}

var root = themename + '/',
    scss = root + 'sass/',
    js = root + 'src/js/';

var indexHtmlWatchFile = 'index.html',
    styleWatchFiles = scss + '**/*.scss';

var cssSRC = [
    root + 'styles.css'
];


var imgSRC = root + 'src/images/*',
    imgDEST = root + 'dist/images';



function css(){

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


function watch(){
    browserSync.init({
        open: 'external',
        proxy: domain,
        baseDir: './'
    });
    gulp.watch('*.html').on('change', reload);
    gulp.watch(styleWatchFiles, gulp.series([css,printCSS]));
    gulp.watch(imgSRC);
    gulp.watch([indexHtmlWatchFile, root + 'styles.css']).on('change', browserSync.reload);

}


exports.css = css;
exports.printCSS = printCSS;
exports.watch = watch;


var build = gulp.parallel(watch);
gulp.task('default', build);
