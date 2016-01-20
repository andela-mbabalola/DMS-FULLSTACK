var gulp = require('gulp'),
  minifyCss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  nodemon = require('gulp-nodemon'),
  bower = require('gulp-bower'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  minify = require('gulp-minify'),
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),

path = {
  public: 'public/',
  frontEnd: {
    js:'frontEnd/js/*.js',
    sass: 'frontEnd/sass/*.scss',
    jade: ['frontEnd/*.jade', '!frontEnd/shared/**', 'frontEnd/**/*.jade'],
    img: 'frontEnd/img/*.*',
    staticFiles: [
        '!frontEnd/**/*.+(scss|css|js|jade)',
        '!frontEnd/img/**/*',
        'frontEnd/**/*.*'
    ]
  }
};

  /**
   * [task to convert jade files to html]
   * @param  {[.jade]} 'jade' [files written in jade]
   * @return {[html]}        [files converted to html]
   */
  gulp.task('jade', ()=> {
    gulp.src(path.frontEnd.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'))
    .pipe(notify('Gulp-jade Done!'));
  });

  /**
   * [task to concatenate js files into a public folder]
   * @param  {[.js]} 'js' [files written in js]
   * @return {[js]}      [concatenated js file]
   */
  gulp.task('js', ()=> {
    gulp.src(path.frontEnd.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(notify('Js gulpify Done!'));
  });

  /**
   * [task to convert sass files to css]
   * @param  {[.scss]} 'sass' [files written in scss]
   * @return {[css]}        [files converted to css]
   */
  gulp.task('sass', ()=> {
    gulp.src(path.frontEnd.sass)
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(notify('Gulp-sass Done!'));
  });


  /**
   * [task to minify images]
   * @param  {[.jpg, .png]} 'images' [images]
   * @return {[.jpg, .png]}          [minified image]
   */
  gulp.task('images', ()=> {
    gulp.src(path.frontEnd.img)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/img'))
    .pipe(notify('Gulp-imagemin Done!'));
  });

  /**
   * [task to minify js files]
   * @param  {[.js]} ['js']   [files to be minified]
   * @return {[.js]}          [minified js file]
   */
  gulp.task('minify', ['js'], ()=> {
    gulp.src('public/js/*.js')
    .pipe(minify())
    .pipe(gulp.dest('./public/js'))
    .pipe(notify('Gulp-minify Done!'));
  });

  /**
   * [task to minify css files]
   * @param  {[.css]} 'minCss' [files to be minified]
   * @return {[.css]}          [minified css file]
   */
  gulp.task('minCss', ()=> {
    gulp.src('public/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/css'))
    .pipe(notify('Gulp-minify-css Done!'));
  });

  /**
   * [task to enable bower components install dependencies]
   */
  gulp.task('bower', ()=> {
    return bower()
    .pipe(gulp.dest('./public/lib/'))
    .pipe(notify('Gulp-bower Done!'));
  });

  /**
   * [task to start the api server]
   */
  gulp.task('server', ()=> {
    nodemon({
      script: 'server.js',
      ext: 'js html',
      env: { 'NODE_ENV': 'development' },
      ignore: ['public/**','client/**', 'node_modules/**']
    })
    .on('restart', ['jade','sass'], ()=> {
      console.log('Server restarted!');
    });
  });

  /**
   * [task to handle static files]
   */
  gulp.task('static-files', ()=> {
    return gulp.src(path.frontEnd.staticFiles)
      .pipe(gulp.dest('public/'));
  });

  gulp.task('browserify', ()=> {
    var b = browserify();
    b.add('./frontEnd/js/app.js');
    return b.bundle()
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil,
      'Browserify Error: in browserify gulp task'))
    // vinyl-source-stream makes the bundle compatible with gulp
    .pipe(source('app.js')) // Desired filename
    // Output the file
    .pipe(gulp.dest('./public/js/'));
  });

  /**
   * [task to watch for changes]
   */
  gulp.task('watchers', ()=>{
    gulp.watch(path.frontEnd.js,['minify']);
    gulp.watch(path.frontEnd.sass,['sass']);
    gulp.watch(path.frontEnd.jade,['jade']);
  });

  gulp.task('dev', ['watchers']);
  gulp.task('production', ['minifyJs', 'minifyCss']);
