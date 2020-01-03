const gulp = require("gulp");
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const serve = require('gulp-serve');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require("browserify");
const tsify = require("tsify");
const fileinclude = require('gulp-file-include');
const zip = require('gulp-zip');
const del = require('del');

const APP_NAME = 'apexst';
const APP_VERSION = '1.0.0';

const paths = {
    pages: {
        build: [
            'src/html/*.html'
        ], 
        listen: [
            'src/html/**/*.html'
        ]
    },
    scss: [
        'src/scss/**/*.scss'
    ],
    assets: [
        'assets/**',
        // '!assets/plugins/*'
    ],
    core: [
        'core/**',
    ],
    mocks: [
        'mocks/**',
    ],
    typescript: [
        'src/**/*.ts'
    ],
    compress: [
        'app/**/*', 
        'store/**/*'
    ],
    output: {
        root: 'app',
        assets: 'app/files',
        mocks: 'app/files/mocks',
        js: 'app/files/js',
        html: 'app/files/html',
        css: 'app/files/css',
        zip: APP_NAME + '-release-' + APP_VERSION + '.zip'
    }
};

const BUILD = {
    HTML: 'build-html',
    SCSS: 'build-scss',
    MOCKS: 'build-mocks',
    TYPESCRIPT: 'build-typescript',
    TYPESCRIPT_COMPRESSED: 'build-typescript-compressed',
    ASSETS: 'build-assets',
    CORE: 'build-core',
    COMPRESS: 'build-compress',
    WATCH: 'build-watch',
    CLEAN: 'build-clean'
};

gulp.task(BUILD.HTML, function () {
    return gulp.src(paths.pages.build)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                version: '1.0.3'
            }
        }))
        .pipe(gulp.dest(paths.output.html));
});

gulp.task(BUILD.ASSETS, function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest(paths.output.assets));
});

gulp.task(BUILD.CORE, function () {
    return gulp.src(paths.core)
        .pipe(gulp.dest(paths.output.root));
});

gulp.task(BUILD.MOCKS, function () {
    return gulp.src(paths.mocks)
        .pipe(gulp.dest(paths.output.mocks));
});

gulp.task(BUILD.SCSS, function () {
    return gulp.src(paths.scss)
        .pipe(sass({ style: 'expanded' }))
        .pipe(gulp.dest(paths.output.css));
});

gulp.task(BUILD.TYPESCRIPT, function () {
    return browserify({
        basedir: 'src/',
        debug: false,
        entries: [
            'typescript/main.ts'
        ],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.output.js));
});

gulp.task(BUILD.TYPESCRIPT_COMPRESSED, function () {
    return browserify({
        basedir: 'src/',
        debug: false,
        entries: [
            'typescript/main.ts'
        ],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(terser())
        .pipe(gulp.dest(paths.output.js));
});

gulp.task(BUILD.WATCH, function () {
    gulp.watch(paths.pages.listen, gulp.series(BUILD.HTML));
    gulp.watch(paths.scss, gulp.series(BUILD.SCSS));
    gulp.watch(paths.assets, gulp.series(BUILD.ASSETS));
    gulp.watch(paths.core, gulp.series(BUILD.CORE));
    gulp.watch(paths.typescript, gulp.series(BUILD.TYPESCRIPT));
});

gulp.task('serve', serve(paths.output.root));
gulp.task('serve-build', serve(['public', BUILD.WATCH]));
gulp.task('serve-prod', serve({
    root: ['public', 'build'],
    port: 443,
    https: true,
    middleware: function (req, res) {
        // custom optional middleware
    }
}));

gulp.task(BUILD.COMPRESS, () =>
    gulp.src(paths.compress, {base: "."})
        .pipe(zip(paths.output.zip))
        .pipe(gulp.dest('.'))
);

gulp.task(BUILD.CLEAN, function(){
    return del([paths.output.root, paths.output.zip], {force:true});
});

gulp.task("build", gulp.series(BUILD.HTML, BUILD.SCSS, BUILD.ASSETS, BUILD.CORE, BUILD.TYPESCRIPT));

gulp.task("release", gulp.series(BUILD.CLEAN, BUILD.HTML, BUILD.SCSS, BUILD.ASSETS, BUILD.CORE, BUILD.TYPESCRIPT_COMPRESSED, BUILD.COMPRESS));

gulp.task("watch-and-serve", gulp.parallel(BUILD.WATCH, "serve"));

gulp.task("default", gulp.series("build", "watch-and-serve"));
