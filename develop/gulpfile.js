var gulp = require('gulp'),
    $ = require("gulp-load-plugins")({
            pattern: ['gulp-*', 'gulp.*'],
            replaceString: /\bgulp[\-.]/
        }),
    del         = require('del'),
    gulpif      = require('gulp-if'),
    hbsfy       = require('browserify-handlebars'),
    fileinclude = require('gulp-file-include'),
    htmlreplace = require('gulp-html-replace'),
    svgSprite = require('gulp-svg-sprite'),

    app = "app/",
    deploy = "deploy/",
    settings = {
        page_templates: "page_templates/", // file-include templates
        templates: "templates/", // handlebars templates
        js: "js/",
        json: "json/",
        fonts: "fonts/",
        sass: "sass/",
        sass_sprite: '/sass/sprite/',
        images: "images/",
        svg_sprite: '/images/svg_sprite.svg',
        svg: "images/svg/",
        js_vendor: "js/vendor/",
        css: "css/"
    };

function getHTMLAssets(path) {
    return {
        css: {
            src: path +'css/style.css',
            tpl: '<link rel="stylesheet" href="%s">'
        },
        js: {
            src: [
                'https://code.jquery.com/jquery-2.2.2.min.js',
                'js/bundle.min.js'
            ],
            tpl: '<script src="%s"></script>'
        }/*,
        icon: {
            src: [path + '/images/favicon.png'],
            tpl: '<link rel="icon" type="image/png" href="%s">'
        }*/
    }
}

var VERSION = (process.env.VERSION) ? process.env.VERSION : "dev"

function isDev() {
    return VERSION === 'dev';
}

gulp.task('fileinclude', function () {
    var assets = getHTMLAssets('');
    return gulp.src([
            app + settings.page_templates + '*.html'
        ])
        .pipe($.plumber(function (error) {
            $.util.beep();
            $.util.log($.util.colors.red(error));
            this.emit('end');
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                gtm: 'GTM-KV4V6R',
                ga: 'UA-66576513-2'
            }

        }))
        .pipe(htmlreplace(assets))
        .pipe(gulp.dest(deploy))
        .pipe($.size())
        .pipe($.notify({
            message: ' fileinclude done'
        }))
        .pipe(gulpif(isDev(), $.livereload()));
});


gulp.task('sass', function () {
    gulp.src([
            app + settings.sass + '**/*.scss',
            '!' + app + settings.sass_sprite + '**/*.scss'
        ])
        .pipe(gulpif(isDev(), $.sourcemaps.init()))
        .pipe($.sass({
            precision: 6,
            outputStyle: 'compact'
        }))
        .on("error", $.notify.onError(function (error) {
            return "Error: " + error.message;
         }))
        .pipe($.postcss([
            require('autoprefixer')({browsers: ['ie >= 10', 'last 2 version']})
        ]))
        .pipe(gulpif(isDev(), $.sourcemaps.write()))
        .pipe(gulp.dest(deploy + settings.css))
        .pipe($.notify({
            message: 'Sass done'
        }))
        .pipe($.size())
        .pipe(gulpif(isDev(), $.livereload()))
});


gulp.task('browserify', function () {
    return gulp.src([
            app + settings.js + 'app.js',
            '!' + app + settings.vendor + '**/*.js'
        ])
        .pipe($.browserify({
            transform: ['debowerify', hbsfy],
            debug: isDev(),
            paths: [
                './node_modules/',
                './' + app + settings.js,
                './' + app + settings.templates
            ]
        }))
        .pipe(gulpif(!isDev(), $.uglify()))
        .pipe($.rename({basename: 'bundle', extname: '.min.js'}))
        .pipe($.notify({
            message: 'Browserify done'
        }))
        .pipe(gulp.dest(deploy + "js"))
        .pipe($.livereload());
});


gulp.task('eslint', function() {
	return gulp.src(app + settings.js + "**/*.js")
  		.pipe($.eslint({
  		}))
  		.pipe($.eslint.format());
  		// Brick on failure to be super strict
  		//.pipe($.eslint.failOnError());
});


gulp.task('copy_data', function () {
    return gulp.src([
            app + settings.json + '**/*.json'
        ])
        .pipe(gulp.dest(deploy + settings.json));
});

gulp.task('build', function () {
    return gulp.src('')
        .pipe($.shell([
            'gulp copy_data',
            'gulp browserify',
            'gulp fileinclude',
            'gulp sass'
        ], {
            maxBuffer: 4000
        }));
});

gulp.task('clean', del.bind(null, [deploy + '*']));

gulp.task('watch', ['fileinclude', 'sass', 'browserify', 'copy_data'], function (e) {

    $.livereload.listen();
    $.connect.server({
        root: deploy,
        port:7000,
        livereload: false
    });

    gulp.watch([app + settings.page_templates + '**/*.html'], ['fileinclude']);
    gulp.watch([app + settings.sass + '**/*.scss'], ['sass']);
    gulp.watch([app + settings.json + '**/*.json'], ['copy_data']);
    gulp.watch([app + settings.js + "**/*.js"], ['eslint']);
    gulp.watch([
        app + settings.templates + '**/*',
        app + settings.js + '**/*'

    ], ['browserify']);
});