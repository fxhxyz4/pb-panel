const { src, dest, watch, series, parallel } = require('gulp'),
  browserSync = require('browser-sync').create(),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
	ugly = require('gulp-uglify-es').default,
  sourcemaps = require("gulp-sourcemaps"),
  htmlmin = require('gulp-htmlmin'),
	purge = require('gulp-css-purge'),
  changed = require('gulp-changed'),
	concat = require('gulp-concat'),
  newer = require('gulp-newer'),
  babel = require("gulp-babel"),
	clean = require('gulp-clean');

const styles = () => {
	return src('src/sass/**/*.scss')
		.pipe(concat('index.min.css'))
		.pipe(scss({ outputStyle: 'compressed' }))
    .pipe(purge())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 8 versions'],
				browsers: [
					'Android >= 4',
					'Chrome >= 22',
					'Firefox >= 24',
					'Explorer >= 11',
					'iOS >= 6',
					'Opera >= 11',
					'Safari >= 6',
				],
			})
		)
		.pipe(dest('src/styles'))
		.pipe(browserSync.stream());
}

const scripts = () => {
	return src('src/scripts/index.js')
    .pipe(newer('src/scripts/index.min.js'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
		.pipe(concat('index.min.js'))
		.pipe(ugly())
    .pipe(sourcemaps.write("."))
		.pipe(dest('src/scripts'))
		.pipe(browserSync.stream());
}

const html = () => {
	return src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(browserSync.stream());
}

const images = () => {
  return src(['src/img/*.*']).pipe(dest('build/img'));
}

const otherFiles = () => {
  return src(['src/robots.txt', './changelog.md']).pipe(dest('build'));
}

const watching = () => {
  watch(['src/sass/**/*.scss'], styles).on('change', browserSync.reload);
  watch(['src/scripts/*.js'], scripts).on('change', browserSync.reload);
  watch(['src/*.html'], html).on('change', browserSync.reload);
}

const browser = () => {
	browserSync.init({
    open: false,
		server: {
			baseDir: 'src/'
		},
	});
}

const cleanDist = () => {
	return src('build').pipe(clean());
}

const buildDist = () => {
	return src(
		[
			'./src/index.html',
			'./src/styles/index.min.css',
      './src/scripts/index.min.js',
      './src/scripts/index.min.js.map',
		],
		{ base: './src' }
	).pipe(dest('build'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.otherFiles = otherFiles;
exports.watching = watching;
exports.browser = browser;
exports.build = series(
	cleanDist,
	buildDist,
	styles,
	scripts,
	html,
  images,
	otherFiles
);
exports.default = parallel(
	styles,
	scripts,
	html,
	watching,
	browser
);
