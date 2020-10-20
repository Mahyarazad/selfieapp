  const express = require('express');
const router = require('express').Router();
const Base64 = require('js-base64');
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3000;
const expressValidator = require('express-validator');
const session = require('express-session');
const path  = require('path');
const shortid = require('shortid');
const mysql = require('mysql');
const {Client} = require('pg');
const bodyParser = require('body-parser');
// const csrf = require('csrf');
// const cookieParser = require('cookie-parser');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// const csrfMiddlewear = csrf({cookie:true});




app.listen(port, () => console.log("Listening at port: %s",port));
app.use(express.json({ limit: '1mb' }));

app.use(require('connect-flash')());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'ThisLIUACBHJAKdnkalsd872364',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(csrfMiddlewear);

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

///passport
const passport = require('passport')

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(app,passport);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user',require('./routes/user'));
const db = require('./models/index.js');
