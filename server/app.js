var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var clientsRouter = require('./routes/clients');
var chargesRouter = require('./routes/charges');
var emailRouter = require('./routes/email')
var paymentsRouter = require('./routes/payments');
var madeBillsrouter = require('./routes/bills');
var profileRouter = require('./routes/profile');
var statsRouter = require('./routes/stats');
var providerRouter = require('./routes/providers');
var articlesRouter = require('./routes/articles');

// import our postgres db
const db = require('./db/index');
const queries = require('./db/queries');

var app = express();

// Middleware
app.use(express.json());
app.use('./uploads', express.static('uploads')); // Serves files from the uploads folder

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Allow requests from your frontend's origin
app.use(cors({
  origin: 'http://localhost:1212', // Replace with your React app's URL
  credentials: true, // Allow cookies and other credentials
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// serve static files in your app
// app.use(express.static('public'))

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/clients', clientsRouter);
app.use('/charges', chargesRouter);
app.use('/email', emailRouter);
app.use('/payments', paymentsRouter);
app.use('/madeBills', madeBillsrouter);
app.use('/profile', profileRouter);
app.use('/stats', statsRouter);
app.use('/providers', providerRouter);
app.use('/articles', articlesRouter);

// DB crud functions for users
app.get('/users', queries.getUsers);
app.get('/users/:id', queries.getUserById);
app.post('/users/create', queries.createUser);
app.put('/users/:id', queries.updateUser);
app.delete('/users/:id', queries.deleteUser);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
  res.send('Got a POST request');
});

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});

module.exports = app;
