const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const wikiRouter = require('./routes/wiki');
const usersRouter = require('./routes/users');

const models = require('./models');
const Page = models.Page;
const User = models.User;

// incorportate nujucks into its rendering
var env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

// logging middleware
app.use(morgan('dev'));
// static middleware
app.use(express.static('public'));
// bodyparsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// sync databases, listen to port
Page.sync({})
.then(function() {
  return User.sync({});
})
.then(function() {
  app.listen(3000, function() {
    console.log('Listening on port 3000');
  });
})
.catch(console.error);

// routes
app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);

app.get('/', function(req, res, next) {
  res.render('index');
});

// errors
app.use(function (err, req, res, next) {
  res.status(500).send(err.message);
});

