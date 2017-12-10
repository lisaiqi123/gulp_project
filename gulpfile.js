var gulp = require("gulp");
var uglify = require("gulp-uglify"); //压缩js
var minifyCss = require("gulp-minify-css"); //压缩是css
var imggulp = require("gulp-imagemin") //压缩图片
var rev = require("gulp-rev"); //添加MD5
var revCollector = require("gulp-rev-collector"); //替换时间戳
var htmlmin = require('gulp-htmlmin'); //压缩HTML
var del = require("del");
gulp.task('htmlmin', ['jsmin', 'cssmin', 'imgmin'], function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(['rev-manifest/*/*.json', 'demo-echart/*.html'])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('build/'));
});
gulp.task('jsmin', function() { //编译任务,压缩js
    return gulp.src(['demo-echart/*.js', 'demo-echart/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest("build/")) //输出本地文件
        .pipe(rev.manifest()) //生成一个rev-manifest.json
        .pipe(gulp.dest("rev-manifest/revjs"))

})
gulp.task("cssmin", function() { //编译任务，压缩css
    return gulp.src(['demo-echart/*.css', 'demo-echart/**/*.css'])
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest("build/"))
        .pipe(rev.manifest()) //生成一个rev-manifest.json
        .pipe(gulp.dest("rev-manifest/revcss")) //将rev-manifest.json保存到rev目录内
})
gulp.task("imgmin", function() { //编译任务，压缩ing
    return gulp.src(['demo-echart/*.{gif,png,jpg,jpeg,ico}', 'demo-echart/**/*.{gif,png,jpg,ico}'])
        .pipe(imggulp())
        .pipe(gulp.dest("build/"))
})
gulp.task("clean", function() {
    return del(["build/", 'rev-manifest/'])
})

gulp.task("default", ["clean", "htmlmin"])