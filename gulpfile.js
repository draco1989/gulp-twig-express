
var gulp 					= require('gulp'),
	path 						= require('path'),
	less 						= require('gulp-less'),
	watch 					= require('gulp-watch'),
	inject 					= require('gulp-inject'),
	notify 					= require('gulp-notify'),
	server					= require('gulp-express'),
	uglify					= require('gulp-uglify'),
	rename					= require('gulp-rename'),
	replace					= require('gulp-replace'),
	ngAnnotate 			= require('gulp-ng-annotate'),
	bowerFiles 			= require('main-bower-files'),
	config 					= require('./config.json'),
	removeRootPath = function (root) {
		return function (path) {
			var args = arguments;
			args[0] = path.slice(path.indexOf(root) + root.length);
			return inject.transform.apply(inject.transform, args);
		}
	},
	transform = function (filepath, file, index, length, targetFile) {
		var filename = path.basename(filepath, path.extname(filepath)),
			targetname = path.basename(targetFile.relative, path.extname(targetFile.relative));

		if (filename === targetname || (filename === 'base' && targetname === 'layout')){
			return removeRootPath('public')(filepath, file, index, length, targetFile);
		}
	};

gulp
	.task('styles', function () {
		gulp.src('private/less/**/*.less')
			.pipe(less({
				paths: [path.join(__dirname, 'less', 'includes')]
			}))
			.pipe(gulp.dest('public/stylesheets'));
	})


	.task('javascripts', function () {
		gulp.src('private/js/**/*.js')
			.pipe(ngAnnotate())
			.pipe(uglify())
			.pipe(gulp.dest('public/javascripts'));
	})


	.task('inject:bower', function () {
		gulp.src('./views/*.twig')
			.pipe(
				inject(
					gulp.src(
						bowerFiles(), {read: false}), 
					{name: 'bower', transform: removeRootPath('bower_components')}))
			.pipe(gulp.dest('./views'));
	})

	.task('inject:dist', ['styles', 'javascripts'], function () {
		gulp.src('./views/*.twig')
			.pipe(
				inject(
					gulp.src(['public/**/*.{js,css}'], {read: false}), 
					{transform: transform}))
			.pipe(gulp.dest('./views'));
	})

	.task('static:templates', function () {
		gulp.src(config.static.templates.src, {base: config.static.templates.cwd})
			.pipe(rename(function (file) {
				file.basename = file.dirname.replace(/[\/-]/g, '_') + '_' + file.basename;
				file.dirname = '';
				file.extname = '.twig';
			}))	
			.pipe(
				replace(
					new RegExp('"(' + config.static.resources.search + ')(.*\.(css|js))"', 'g'), 
					// /"(\.\.)(.*\.(css|js))"/g,
					'"' + config.static.resources.replace + '$2"'
				)
			)
			.pipe(gulp.dest('./views'));
	})

	.task('watch', ['inject:bower', 'inject:dist', 'static:templates'], function () {
		gulp.watch(['./private/less/*.less'], ['styles', 'inject:dist']);
		gulp.watch(['./private/js/*.js'], ['javascripts', 'inject:dist']);
		gulp.watch([config.static.templates.src], ['static:templates']);
	})


	.task('default', ['watch'], function () {
		server.run({file: 'bin/www'});

		gulp.watch(['public/**/*'], server.notify);
		gulp.watch(['./app.js', 'routes/**/*', 'views/**/*'], function (event) {
			server.run({file: 'bin/www'})
			setTimeout(function () {
				server.notify(event) 
			}, 1000);
		});
	})