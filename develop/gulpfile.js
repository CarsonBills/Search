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
                //'js/bundle.min.js'
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
            basepath: '@file'
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


gulp.task('eslint', function() {
	return gulp.src(settings.js + "**/*.js")
  		.pipe($.eslint({
  		}))
  		.pipe($.eslint.format());
  		// Brick on failure to be super strict
  		//.pipe($.eslint.failOnError());
});


gulp.task('clean', del.bind(null, [deploy + '*']));

gulp.task('watch', ['fileinclude', 'sass'], function (e) {

    $.livereload.listen();
    $.connect.server({
        root: deploy,
        port:7000,
        livereload: false
    });

    gulp.watch([app + settings.page_templates + '**/*.html'], ['fileinclude']);
    gulp.watch([app + settings.sass + '**/*.scss'], ['sass']);
    //gulp.watch([app + settings.js + "**/*.js"], ['eslint']);
});