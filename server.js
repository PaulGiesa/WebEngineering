var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get config file
var user   = require('./model/user'); // get users from file

var routes = require('./controller/routes'); //routes defined here

// use body parser to get information from POST
// needs to be before app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/V1',routes);

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.set('superSecret', config.secret); // secret variable



// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Stiiift needed at http://localhost:' + port +"\n" + "Awesome kittens too!");
