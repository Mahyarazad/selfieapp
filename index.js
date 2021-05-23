const express = require('express');
const router = require('express').Router();
const Base64 = require('js-base64');
const fs = require("fs");
const passport = require('passport')
const port = process.env.PORT || 3000;
const expressValidator = require('express-validator');
const session = require('express-session');
const path = require('path');
const shortid = require('shortid');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const https = require("https");
const http = require('http');
// const csrf = require('csrf');
// const cookieParser = require('cookie-parser');
const config = require(__dirname + '/config/config.json');

const client = new Client({
    host: process.env.DB_HOST,
    port:5432,
    user: process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASS,
    connectionString: process.env.DB_URI
});

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})
// const csrfMiddlewear = csrf({cookie:true});

const enforce = require('express-sslify');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(require('connect-flash')());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: "asdcasdc987236872368723",
    //secret: process.env.API_KEY,
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
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));



app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(app, passport);
app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/user', require('./routes/user'));
const db = require('./models/index.js');

// const privateKey = fs.readFileSync( 'privateKey.key' );
// const certificate = fs.readFileSync( 'certificate.crt' );

// https.createServer(
//   {
//       key: privateKey,
//       cert: certificate
//   },app).listen(port);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
