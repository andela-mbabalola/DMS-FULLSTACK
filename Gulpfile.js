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
    jade: ['frontEnd/*.jade', 'frontEnd/**/*.jade'],
    img: 'frontEnd/img/*.*',
    staticFiles: [
        '!frontEnd/**/*.+(scss|css|js|jade)',
        '!frontEnd/img/**/*',
        'frontEnd/**/*.*'
    ]
  }
};

  gulp.task('jade', function() {
    gulp.src(path.frontEnd.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'))
    .pipe(notify('Gulp-jade Done!'));
  });

  gulp.task('js', function(){
    gulp.src(path.frontEnd.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(notify('Js gulpify Done!'));
  });

  gulp.task('sass', function() {
    gulp.src(path.frontEnd.sass)
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(notify('Gulp-sass Done!'));
  });


  gulp.task('images', function() {
    gulp.src(path.frontEnd.img)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/img'))
    .pipe(notify('Gulp-imagemin Done!'));
  });

  gulp.task('minify', ['js'], function(){
    gulp.src('public/js/*.js')
    .pipe(minify())
    .pipe(gulp.dest('./public/js'))
    .pipe(notify('Gulp-minify Done!'));
  });

  gulp.task('minCss', function() {
    gulp.src('public/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/css'))
    .pipe(notify('Gulp-minify-css Done!'));
  });

  gulp.task('bower', function() {
    return bower()
    .pipe(gulp.dest('./public/lib/'))
    .pipe(notify('Gulp-bower Done!'));
  });

  gulp.task('server', function(){
    nodemon({
      script: 'server.js',
      ext: 'js html',
      env: { 'NODE_ENV': 'development' },
      ignore: ['public/**','client/**', 'node_modules/**']
    })
    .on('restart', ['jade','sass'], function () {
      console.log('Server restarted!');
    });
  });

  gulp.task('static-files', ()=> {
    return gulp.src(path.frontEnd.staticFiles)
      .pipe(gulp.dest('public/'));
  });

  gulp.task('browserify', ()=> {
    var b = browserify();
    b.add('./frontEnd/js/app.js');
    return b.bundle()
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil, 'Browserify Error: in browserify gulp task'))
    // vinyl-source-stream makes the bundle compatible with gulp
    .pipe(source('app.js')) // Desired filename
    // Output the file
    .pipe(gulp.dest('./public/js/'));
  });

  gulp.task('watchers', ()=>{
    gulp.watch(path.frontEnd.js,['minify']);
    gulp.watch(path.frontEnd.sass,['sass']);
    gulp.watch(path.frontEnd.jade,['jade']);
  });

  gulp.task('dev', ['watchers']);
  gulp.task('production', ['minifyJs', 'minifyCss','uglify']);
