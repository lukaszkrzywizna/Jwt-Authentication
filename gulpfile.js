"use strict";

var gulp = require("gulp");

var webroot = "./wwwroot/";

var paths = {
    npmSrc: "./node_modules/",
    npmLibs: webroot + "lib/"
};

gulp.task("restore", function () {
    gulp.src(paths.npmSrc + '/reflect-metadata/reflect.js').pipe(gulp.dest(paths.npmLibs + '/reflect-metadata'));
    gulp.src(paths.npmSrc + '/core-js/client/*.js').pipe(gulp.dest(paths.npmLibs + '/core-js'));
    gulp.src(paths.npmSrc + '/zone.js/dist/*.js').pipe(gulp.dest(paths.npmLibs + '/zone.js'));
    gulp.src(paths.npmSrc + '/rxjs/**/*.js').pipe(gulp.dest(paths.npmLibs + '/rxjs'));
    gulp.src(paths.npmSrc + '/@angular/**/*.js').pipe(gulp.dest(paths.npmLibs + '/@angular'));
    gulp.src(paths.npmSrc + '/systemjs/dist/*.js').pipe(gulp.dest(paths.npmLibs + '/systemjs'));
    return true;
});