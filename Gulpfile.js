var gulp = require('gulp'),
  minifyCss = require('gulp-minify-css'),
  // nodemon = require('gulp-nodemon'),
  gutil = require('gulp-util'),
  bower = require('gulp-bower'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  //mocha = require('gulp-mocha'),
  Server = require('karma').Server,
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),

  path = {
    public: 'public/',
    app: {
      js: 'app/**/*.js',
      sass: 'app/sass/*.scss',
      jade: ['app/*.jade', '!app/shared/**', 'app/**/*.jade'],
      img: 'app/img/*.*',
      staticFiles: [
        '!app/**/*.+(scss|css|js|jade)',
        '!app/img/**/*',
        'app/**/*.*'
      ]
    },
    serverTests: ['./spec/server/**/*.spec.js'],
    unitTests: [
      'public/lib/angular/angular.js',
      'public/lib/angular-ui-router/release/angular-ui-router.min.js',
      'public/lib/angular-aria/angular-aria.min.js',
      'public/lib/angular-route/angular-route.min.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/lib/angular-sanitize/angular-sanitize.min.js',
      'public/lib/angular-animate/angular-animate.min.js',
      'public/lib/angular-material/angular-material.min.js',
      'public/lib/angular-resource/angular-resource.min.js',
      'public/lib/ng-file-upload/ng-file-upload-shim.js',
      'public/lib/lodash/lodash.js',
      'public/lib/cloudinary-core/cloudinary-core.js',
      'public/lib/cloudinary_ng/js/angular.cloudinary.js',
      'public/lib/ng-file-upload/ng-file-upload.js',
      'public/lib/angular-material-data-table/dist/md-data-table.min.js',

      //tinyMCE script
      'public/lib/tinymce-dist/tinymce.js',
      'public/lib/angular-ui-tinymce/src/tinymce.js',


      // Font Awesome dependency
      'public/lib/font-awesome/css/font-awesome.css',
      'public/js/application.js',
      'spec/unit/client/**/*.js'
    ]
  };

/**
 * [task to convert jade files to html]
 * @param  {[.jade]} 'jade' [files written in jade]
 * @return {[html]}        [files converted to html]
 */
gulp.task('jade', function() {
  return gulp.src(path.app.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'))
    .pipe(notify('Gulp-jade Done!'));
});

/**
 * [task to convert sass files to css]
 * @param  {[.scss]} 'sass' [files written in scss]
 * @return {[css]}        [files converted to css]
 */
gulp.task('sass', function() {
  return gulp.src(path.app.sass)
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(notify('Gulp-sass Done!'));
});


/**
 * [task to minify images]
 * @param  {[.jpg, .png]} 'images' [images]
 * @return {[.jpg, .png]}          [minified image]
 */
gulp.task('images', function() {
  return gulp.src(path.app.img)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/img'))
    .pipe(notify('Gulp-imagemin Done!'));
});

/**
 * [task to minify css files]
 * @param  {[.css]} 'minCss' [files to be minified]
 * @return {[.css]}          [minified css file]
 */
gulp.task('minCss', function() {
  return gulp.src('public/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/css'))
    .pipe(notify('Gulp-minify-css Done!'));
});

/**
 * [task to enable bower components install dependencies]
 */
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./public/lib/'));
});

/**
 * [task to start the api server]
 */
// gulp.task('server', function() {
//   nodemon({
//       script: 'server.js',
//       ext: 'js html',
//       env: {
//         'NODE_ENV': 'development'
//       },
//       ignore: ['public/**', 'client/**', 'node_modules/**']
//     })
//     .on('restart', ['jade', 'sass'], function() {
//       console.log('Server restarted!');
//     });
// });

/**
 * [task to handle static files]
 */
gulp.task('static-files', function() {
  return gulp.src(path.app.staticFiles)
    .pipe(gulp.dest('public/'));
});

gulp.task('browserify', function() {
  return browserify('./app/js/app.js').bundle()
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil, 'Browserify ' +
      'Error: in browserify gulp task'))
    // vinyl-source-stream makes the bundle compatible with gulp
    .pipe(source('application.js')) // Desired filename
    // Output the file
    .pipe(gulp.dest('./public/js/'))
    .pipe(notify('Browserify Done!'));
});

gulp.task('test:fend', ['build'], function(done) {
  // Be sure to return the stream
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  },done()).start();
});

// gulp.task('test:bend', ['test:fend'], function() {
//   return gulp.src(path.serverTests)
//     .pipe(mocha({
//       reporter: 'spec'
//     }))
//     .once('error', function(err) {
//       throw err;
//     });
// });

/**
 * [task to watch for changes]
 */
gulp.task('watchers', function() {
  // gulp.watch(path.app.js,['minify']);
  gulp.watch(path.app.sass, ['sass']);
  gulp.watch(path.app.jade, ['jade']);
  gulp.watch(path.app.js, ['browserify']);
});

gulp.task('build', ['jade', 'sass', 'static-files', 'images',
  'browserify', 'bower'
]);

gulp.task('dev', ['watchers']);
gulp.task('production', ['minifyJs', 'minifyCss']);
gulp.task('default', ['server', 'watchers', 'build']);
