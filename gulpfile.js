const path = {
  src: {
    i: `./src/`
  },

  styles: {
    i: `src/sass/**/*.scss`,
    o: `src/styles`,
  },

  mq: {
    i: `src/styles/index.min.css`,
    o: `src/styles`,
  },

  scripts: {
    i: `src/scripts/index.js`,
    o: `src/scripts/`,
  },

  html: {
    i: `src/*.html`,
    o: null,
  },

  images: {
    i: [
        `src/img/*.*`,
        `!src/img/favicon.ico`,
        `!src/img/*.svg`,
       ],
    o: `build/img`,
  },

  sprite: {
    i: [
        `build/img/svg/*.svg`,
        `build/img/*.svg`
      ],
    o: `build/img/svg/`,
  },

  favicon: {
    i: `src/img/favicon.png`,
    o: `src/img/`,
  },

  other: {
    i: [
        `src/robots.txt`,
        `./changelog.md`
      ],
    o: `build`,
  },

  build: {
    i:
      [
        './src/index.html',
        './src/styles/mq.css',
        './src/styles/index.min.css',
        './src/scripts/index.min.js',
        './src/scripts/index.min.js.map',
      ],
    o: `build`,
  },

  watching: {
    i: [
      `src/sass/**/*.scss`,
      `src/scripts/*.js`,
      `src/*.html`,
      `src/img/`
    ]
  }
}

const { src, dest, watch, series, parallel } = require(`gulp`),
  browserSync = require(`browser-sync`).create(),
  scss = require(`gulp-sass`)(require(`sass`)),
  autoprefixer = require(`gulp-autoprefixer`),
	ugly = require(`gulp-uglify-es`).default,
  sourcemaps = require(`gulp-sourcemaps`),
  filter = require(`postcss-filter-mq`),
  imagemin = require(`gulp-imagemin`),
  htmlmin = require(`gulp-htmlmin`),
	purge = require(`gulp-css-purge`),
  changed = require(`gulp-changed`),
  postcss = require(`gulp-postcss`),
  svg = require(`gulp-svg-sprite`),
  rename = require(`gulp-rename`),
	concat = require(`gulp-concat`),
  cache = require(`gulp-cached`),
  newer = require(`gulp-newer`),
  babel = require(`gulp-babel`),
	clean = require(`gulp-clean`),
  ico = require(`gulp-to-ico`),
  avif = require(`gulp-avif`),
  svgo = require(`gulp-svgo`),
  webp = require(`gulp-webp`);

const styles = () => {
	return src(path.styles.i)
		.pipe(concat(`index.min.css`))
		.pipe(scss({ outputStyle: `compressed` }))
    .pipe(purge())
		.pipe(
			autoprefixer({
				overrideBrowserslist: [`last 12 versions`],
				browsers: [
					`Android >= 4`,
					`Chrome >= 22`,
					`Firefox >= 24`,
					`Explorer >= 11`,
					`iOS >= 6`,
					`Opera >= 11`,
					`Safari >= 6`,
				],
			})
		)
		.pipe(dest(path.styles.o))
		.pipe(browserSync.stream());
}

const mq = () => {
  return src(path.mq.i)
    .pipe(postcss( [ filter ] ))
    .pipe(rename({
      basename: `mq`,
      extname: `.css`
    }))
    .pipe(dest(path.mq.o))
}

const scripts = () => {
	return src(path.scripts.i)
    .pipe(newer(`${path.scripts.o}index.min.js`))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [`@babel/preset-env`]
    }))
		.pipe(concat(`index.min.js`))
		.pipe(ugly())
    .pipe(sourcemaps.write(`.`))
		.pipe(dest(path.scripts.o))
		.pipe(browserSync.stream());
}

const html = () => {
	return src(path.html.i)
		.pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(browserSync.stream());
}

const images = () => {
  return src(path.images.i)
    .pipe(newer(path.images.o))
    .pipe(avif({ quality: 50 }))

    .pipe(src(path.images.i[0]))
    .pipe(newer(path.images.o))
    .pipe(webp())

    .pipe(src(path.images.i[0]))
    .pipe(newer(path.images.o))
    .pipe(imagemin())

    .pipe(dest(path.images.o))
    .pipe(browserSync.stream());
}

const sprite = () => {
  return src(path.sprite.i)
    .pipe(svg({
      mode: {
        stack: {
          sprite: `../sprite.svg`,
          example: true,
        }
      }
    }))
    .pipe(svgo())
    .pipe(dest(path.sprite.o));
}

const favicon = () => {
  return src(path.favicon.i)
    .pipe(ico(`favicon.ico`))
    .pipe(dest(path.favicon.o));
}

const otherFiles = () => {
  return src(path.other.i).pipe(dest(path.other.o));
}

const watching = () => {
  watch(path.watching.i[0], styles).on(`change`, browserSync.reload);

  watch(path.watching.i[1], scripts).on(`change`, browserSync.reload);

  watch(path.watching.i[2], html).on(`change`, browserSync.reload);

  watch(path.watching.i[3], images).on(`change`, browserSync.reload);
}

const browser = () => {
	browserSync.init({
    open: false,
		server: {
			baseDir: path.src.i
		},
	});
}

const cleanDist = () => {
	return src(path.build.o).pipe(clean());
}

const buildDist = () => {
	return src(
    path.build.i,
		{ base: path.src.i }
	).pipe(dest(path.build.o));
}

exports.styles = styles;
exports.mq = mq;

exports.scripts = scripts;
exports.html = html;

exports.images = images;
exports.favicon = favicon;

exports.sprite = sprite;
exports.otherFiles = otherFiles;

exports.watching = watching;
exports.browser = browser;

exports.build = series(
	cleanDist,
	buildDist,
	styles,
  mq,
	scripts,
	html,
  images,
  favicon,
  sprite,
	otherFiles
);

exports.default = parallel(
	styles,
  mq,
	scripts,
	html,
	watching,
	browser
);
