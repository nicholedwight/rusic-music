gulp = require("gulp")
gutil = require("gulp-util")
_ = require('lodash')
sass = require('gulp-ruby-sass')
coffee = require("gulp-coffee")
concat = require('gulp-concat')
livereload = require('gulp-livereload')
uglify = require('gulp-uglify')
gulpFilter = require('gulp-filter')
prefix = require('gulp-autoprefixer')

paths = {
  output: "assets"
  sass: "scss/style.scss"
  js: "js/**/*.js"
  vendorJS: [
    "components/jquery-legacy/jquery.js"
    "components/bootstrap/dist/js/bootstrap.js"
  ]
  vendorCSS: [
    "components/bootstrap/dist/css/bootstrap.css"
  ]
}

gulp.task "scripts", ->
  combinedFiles = _.flatten([
    paths.vendorJS
    paths.js
  ])
  

  gulp
    .src(combinedFiles)
    .pipe(concat("script.js"))
    .pipe(uglify())
    .pipe gulp.dest( paths.output )

gulp.task "styles", ->

  combinedFiles = _.flatten([
    paths.vendorCSS
    paths.sass
  ])
  
  scssFilter = gulpFilter("**/*.scss")

  gulp
    .src(combinedFiles)
    .pipe(scssFilter)
    .pipe(sass({
      style: "compressed"
    }))
    .pipe(scssFilter.restore())
    .pipe(concat("style.css"))
    .pipe(prefix())
    .pipe gulp.dest( paths.output )

gulp.task "watch", ->

  gulp.watch [
    paths.vendorJS
    paths.js
  ], ["scripts"]

  gulp.watch [
    paths.vendorCSS
    "**/*.scss"
  ], ["styles"]

gulp.task "build", ["scripts", "styles"]
gulp.task "default", ["scripts", "styles", "watch"]
