(function() {
  'Use strict';

  var express = require('express'),
    //creating an instance of express
    app = express(),

    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    routes = require('./../server/routes/index'),
    path = require('path'),

  //mounting an instance of the express router on the routes
  router = express.Router();

  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(morgan('dev'));

  app.use(express.static(path.join(__dirname, '../public')));

  routes(router);
  function apiMiddleware(req, res, next){
    // console.log('Yay we got here !!!');
    // console.log(req.body);
    next();
  }
  app.use('/api', apiMiddleware, router);

  // app.get('/', function(req, res) {
  //   console.log(__dirname);
  //   res.sendFile(path.join(__dirname, '../public/index.html'), {
  //     code: 200
  //   });
  // });

  app.get('/*', function (req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  //mounting the router on a /api directory

  //exporting app
  module.exports = app;
})();
