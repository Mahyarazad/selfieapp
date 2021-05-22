const express = require('express');
const router = require('express').Router();
const Base64 = require('js-base64');
const fs = require("fs");
const port = process.env.PORT || 3000;
const expressValidator = require('express-validator');
const session = require('express-session');
const path  = require('path');
const shortid = require('shortid');
const {Client} = require('pg');
const bodyParser = require('body-parser');
// const csrf = require('csrf');
// const cookieParser = require('cookie-parser');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// const csrfMiddlewear = csrf({cookie:true});
const http = require('http');
const enforce = require('express-sslify');
const app = express();

app.listen(port, () => console.log("Listening at port: %s",port));

app.use(express.json({ limit: '1mb' }));

app.use(require('connect-flash')());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.API_KEY,
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
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

//Time out
const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  // Only extend the timeout for API requests
  if (!req.url.includes('/api')) {
    next();
    return;
  }

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(202);
        }

        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

app.use(extendTimeoutMiddleware);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(app,passport);
app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public','favicon.ico')));
app.use('/user',require('./routes/user'));
const db = require('./models/index.js');
