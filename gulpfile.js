const gulp = require("gulp");
const plumber = require("gulp-plumber");
const htmlmin = require("gulp-htmlmin");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const terser = require("gulp-terser");
const sync = require("browser-sync").create();

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(terser({
      ecma: 2015,
      keep_fnames: false,
      mangle: {
        toplevel: true,
      },
    }))
    .pipe(rename( { suffix: '.min'} ))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src("source/img/*.{jpg,png,svg}")
   .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
   .pipe(gulp.dest("build/img"));
}

exports.images = images;

// WebP

const createWebp = () => {
  return gulp.src("source/img/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
}

exports.createWebp = createWebp;

// Copy

const copy = (done) => {
  gulp.src([
  "source/fonts/*.{woff2,woff}",
  "source/*.ico",
  "source/img/**/*.{jpg,png,svg}",
  ], {
  base: "source"
  })
  .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    copy,
    html,
    styles,
    scripts,
    images,
    createWebp,
  )
);

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    copy,
    html,
    styles,
    scripts,
    images,
    createWebp,
  ),
  gulp.series(
    server,
    watcher
  )
);
