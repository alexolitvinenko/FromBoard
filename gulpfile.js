const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
function browsersync() {
	browserSync.init({
		server: { baseDir: 'dest/' },
		notify: false,
		online: true
	})
}

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.min.js',
		'app/js/app.js',
		])
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(dest('dest/js/'))
	.pipe(browserSync.stream())
}

const fileinclude = require('gulp-file-include');
function html() {
	return src('app/index.html')
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
    .pipe(dest('dest/'))
    .pipe(browserSync.reload({stream: true}))
}

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
function styles() {
	return src('app/scss/style.scss')
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(eval('sass')())
	.pipe(concat('app.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) 
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }} ))
	.pipe(dest('dest/css/'))
	.pipe(browserSync.stream())
}

const imagecomp = require('compress-images');
const clean = require('gulp-clean');
async function images() {
	imagecomp(
		"app/img/**/*",
		"dest/img/",
		{ compress_force: false, statistic: true, autoupdate: true }, false,
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) {
			if (completed === true) {
				browserSync.reload()
			}
		}
	)
}
function cleanimg() {
	return src('/dest/img/', {allowEmpty: true}).pipe(clean())
}

function fonts() {
	return src('app/fonts/*')
	.pipe(dest('dest/fonts/'))
	.pipe(browserSync.stream())
}

function cleandest() {
	return src('dest', {allowEmpty: true}).pipe(clean())
}

function startwatch() {
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
	watch('app/scss/**/*', styles);
	watch('app/img/**/*', images);
	watch('app/fonts/**/*', fonts);
	watch('app/**/*.html', html);
}

exports.browsersync = browsersync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.cleandest = cleandest;

exports.build = series(cleandest, html, styles, images, scripts, fonts, startwatch, browsersync);
exports.default = series(cleandest, parallel(html, styles, images, scripts, fonts), parallel(startwatch, browsersync));