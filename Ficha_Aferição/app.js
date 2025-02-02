var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose")

var mongoDB = 'mongodb://127.0.0.1:20408/ficha_afericao';
mongoose.connect(mongoDB);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'));
db.once('open', () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
});

var indexRouter = require('./routes/index');
var pessoasRouter = require('./routes/pessoas');
var modalidadesRouter = require('./routes/modalidades');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pessoas', pessoasRouter);
app.use('/modalidades', modalidadesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;