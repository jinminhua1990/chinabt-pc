var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var pump = require('pump');
var autoPrefixer = require('autoprefixer');
var postCss = require('gulp-postcss');
var concat = require('gulp-concat');

//公用依赖
var common = ['lib/jquery.min.js', 'lib/doT.min.js', 'src/js/base.js'];

var jsTasks = ['home', 'article', 'news'];

//SASS 编译为 CSS，并后处理和压缩
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

//各页面JS 合并压缩
jsTasks.forEach(function (pageName) {
    gulp.task(pageName, function (cb) {
        pump([
                gulp.src(common.concat('src/js/' + pageName + '.js')),
                concat(pageName + '.js'),
                uglify(),
                gulp.dest('dist')
            ],
            cb
        );
    });
});

//默认任务 => SASS 编译
gulp.task('default', function () {
    gulp.watch('src/css/*', ['sass']);
});

//各页面 JS 构建为生产版本
gulp.task('dist', jsTasks.concat('sass'));