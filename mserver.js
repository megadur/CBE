var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

debugger;

// Use body parser to parse JSON body
app.use(bodyParser.json());

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}
var connAttrs1 = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "localhost:1521/XE"
}

//app.configure(..);
/*
app.get('/account', function(req, res) {
    res.send('respond with a account list resource');
  });
*/
//app.get('/', ....)
app.use('/bestand', require('./bestand'));    
app.use('/account', require('./account'));    
app.get('/admin', function(req, res, next) {  // GET 'http://www.example.com/admin/new'
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
  next();
});
//app.use('/where/ever', require('./module-b'));    


var server = app.listen(3300, function () {
    "use strict";

    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});
/*
nodemon mserver.js
*/