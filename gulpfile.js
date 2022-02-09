const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const bulkImport = require('gulp-sass-bulk-import');
const notify = require('gulp-notify');
const concat = require('gulp-concat');

const wpTheme = 'pdm';
const devURL = 'portfolio.dev.cc';
const themeDir = 'wp-content/themes/' + wpTheme + '/';

const path = {
    dist: themeDir + 'dist',
    sourcemaps: '/sourcemaps/',
    php: themeDir + '**/*.php',
    css: {
        root: themeDir + 'src/sass/',
        src: themeDir + 'src/sass/**/*.scss',
    },
    js: {
        root: themeDir + 'src/js/',
        src: [
            themeDir + 'src/js/**/*.js',
            '!' + themeDir + 'src/js/admin.js',
            '!' + themeDir + 'src/js/vendor/**'
        ],
        vendors: themeDir + 'src/js/vendor/**.js',
        admin: themeDir + 'src/js/admin.js'
    }
};

/** BUILD CSS ***/
function buildCSS() {
    return gulp.src(path.css.root + '*.scss')
        .pipe(sourcemaps.init())
        .pipe(bulkImport())
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on('error', sass.logError)
            .on('error', handleErrors))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(path.sourcemaps))
        .pipe(gulp.dest(path.dist))
        .pipe(browserSync.stream());
}

function lintJS() {
    return gulp.src(path.js.root + 'site.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
}

function buildVendorJS() {
    return gulp.src(path.js.vendors)
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest(path.dist))
        .pipe(browserSync.stream());
}

function buildJS() {
    return gulp.src(path.js.src)
        .pipe(concat('site.min.js'))
        .pipe(gulp.dest(path.dist))
        .pipe(browserSync.stream());
}

function buildAdminJS() {
    return gulp.src(path.js.admin)
        .pipe(uglify({ output: { comments: /^!|@preserve|@license|@cc_on/i } }))
        .on('error', handleErrors)
        .pipe(gulp.dest(path.dist))
        .pipe(browserSync.stream());
}

function bundleJS() {
    return gulp.src([path.dist + '/vendors.min.js', path.dist + '/site.min.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.min.js'))
        .pipe(uglify({ output: { comments: /^!|@preserve|@license|@cc_on/i } }))
        .on('error', handleErrors)
        .pipe(sourcemaps.write(path.sourcemaps))
        .pipe(gulp.dest(path.dist))
        .pipe(browserSync.stream());
}

function watch(done) {
    browserSync.init({
        proxy: 'http://' + devURL,
        host: devURL,
        open: 'external'
    });

    gulp.watch(path.css.src, buildCSS);
    gulp.watch(path.js.vendors, gulp.series(buildVendorJS, bundleJS));
    gulp.watch(path.js.src, gulp.series(lintJS, buildJS, bundleJS));
    gulp.watch(path.js.admin, gulp.series(buildAdminJS));
    gulp.watch(path.php).on("change", browserSync.reload);
}

/** TASK ERROR HANDLER ***/
var handleErrors = function () {
    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>",
        timeout: 3
    }).apply(this, arguments);

    // Keep gulp from hanging on this task
    this.emit('end');
};

const compile = gulp.parallel(buildCSS, gulp.series(lintJS, buildVendorJS, buildJS, buildAdminJS, bundleJS));

gulp.task('default', gulp.parallel(compile, watch));
gulp.task('compile', compile);