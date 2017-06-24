var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var path = require('path');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


function getWordsList(text) {
  var words = [];

  words = text.split(/\s+/g)
    .map(function (w) {
      return w.trim().replace(/[^’.0-9a-zA-Z-]/g, '');
    })
    .filter(function (w) {
      return w !== "" && !/^.{1,2}$/g.test(w);
    })
    //remove duplicate
    .filter(function (val, index, arr) {
      return arr.indexOf(val) === index;
    })
    .sort();

  return words;
}

var greList = [];

function readGre() {
  fs.readFile(path.join(__dirname, '/words/gre.txt'), 'utf-8',
    function (err, data) {
      greList = data.split('\n');
      console.log('greList', greList);
    });
}
readGre();

app.get("/sentences", function (req, res, next) {

  var text = req.query.data;

  var words = getWordsList(text);

  var result = words.filter(function (ele) {
    return greList.indexOf(ele) > 0;
  });

  res.send(JSON.stringify(result));
});


app.get("/links", function (req, res, next) {

  var links = req.query.data;
  var ret = 'more';
  res.send(JSON.stringify(ret));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;