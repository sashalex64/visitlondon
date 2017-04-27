var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var browserify = require('gulp-browserify');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');

var SOURCEPATHS = {
    sassSource:'src/scss/*.scss',
    sassApp: 'src/scss/app.scss',
    htmlSource: 'src/*.html',
    htmlPartialSource: 'src/partial/*.html',
    jsSource: 'src/js/*.js',
    imgSource: 'src/img/**'
}

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',
    fonts: 'app/fonts',
    img:'app/img'
}

gulp.task('sass', function(){
    // var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    // var sassFiles;
    
   sassFiles = gulp.src(SOURCEPATHS.sassApp)
       .pipe(autoprefixer('last 10 versions'))
       .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    //    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css));
});

gulp.task('clean-html', function() {
    return gulp.src(APPPATH.root + '/*.html', {
        read: false,
        force: true
    })
    .pipe(clean());
});

gulp.task('clean-scripts', function() {
    return gulp.src(APPPATH.js + '/*.js', {
        read: false,
        force: true
    })
    .pipe(clean());
});

/*====PRODUCTION TASKS=====*/


gulp.task('compress', function() {
   gulp.src(SOURCEPATHS.jsSource)
   .pipe(concat('main.js'))
   .pipe(browserify())
   .pipe(minify())
   .pipe(gulp.dest(APPPATH.js))
});



gulp.task('compresscss', function(){
    // var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    // var sassFiles;
    
   sassFiles = gulp.src(SOURCEPATHS.sassSource)
       .pipe(autoprefixer('last 10 versions'))
       .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    //    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(APPPATH.css));
});

gulp.task('minifyHtml', function() {
    return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(APPPATH.root));
});

/*==== end of PRODUCTION TASKS=====*/

gulp.task('images', function() {
    return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});
/*
gulp.task('moveFonts', function() {
    gulp.src('./node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')
    //above: syntax for mooving diferent extensions into destination folder
    .pipe(gulp.dest(APPPATH.fonts));
});
*/          
gulp.task('scripts', ['clean-scripts'], function() {
   gulp.src(SOURCEPATHS.jsSource)
   .pipe(concat('main.js'))
   .pipe(browserify())
   .pipe(gulp.dest(APPPATH.js))
});

gulp.task('html', function() {
    return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APPPATH.root));
});

/*
gulp.task('copy',['clean-html'],   function() {
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
}); 
*/

gulp.task('serve', ['sass'], function() {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir:APPPATH.root   
        },
        browser: ['chrome']
    });
});
gulp.task('watch', ['serve', 'sass', /*'copy',*/ 'clean-html', 'scripts', 'clean-scripts',/* 'moveFonts',*/ 'images', 'html','compress'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    /*gulp.watch([SOURCEPATHS.htmlSource], ['copy']);*/
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    gulp.watch([SOURCEPATHS.imgSource],['images']);
    gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
});

gulp.task('default', ['watch']);

gulp.task('work', ['serve','sass'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
});

gulp.task('production', ['minifyHtml', 'compresscss', 'compress']);