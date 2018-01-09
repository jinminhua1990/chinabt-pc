var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var pump = require('pump');
var autoPrefixer = require('autoprefixer');
var postCss = require('gulp-postcss');
//var rename = require('gulp-rename');
//var concat = require('gulp-concat');

gulp.task('sass', function () {
    var postCssPlugins = [
        autoPrefixer()
    ];

    return gulp.src(['src/css/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postCss(postCssPlugins))
        //.concat('home.css')
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function (cb) {
    pump([
            gulp.src('src/js/*'),
            //concat('main.js'),
            uglify(),
            //rename({suffix: '-min'}),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('default', function () {
    gulp.watch('src/css/*', ['sass']);
});