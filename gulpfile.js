var gulp = require('gulp');
var karma = require('karma').server;

gulp.task('test', function (cb) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
  }, cb);
});
