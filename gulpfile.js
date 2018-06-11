var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var server = require('gulp-webserver');
var concat = require('gulp-concat');
var minCss = require('gulp-clean-css')
var url = require('url');
var fs = require('fs');
var path = require('path');
//起服务
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 8080,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false
                }
                if (pathname === '/list') {
                    res.end(JSON.stringify({ code: 0, msg: 'wwt' }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//编译scss 并且合并压缩
gulp.task('css', function() {
    gulp.src('src/css/*.scss')
        .pipe(concat('all.css'))
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('build/css'))
})

//js文件合并压缩
gulp.task('uglify', function() {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
})

gulp.task('default', ['css', 'uglify', 'server'])