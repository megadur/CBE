var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('data/fb.db');

//debugger;

/*
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
    db.run("CREATE TABLE IF NOT EXISTS photo (id integer primary key AUTOINCREMENT, description TEXT, filepath TEXT, album_id INTEGER)");
});
*/
// Use body parser to parse JSON body
app.use(bodyParser.json());
var connAttrList1 = [{
        "ET2": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    },
    {

        "ET3": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }

    }
]
var connAttrList = [{
        "Name": "ET2",
        "Werte": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    },
    {
        "Name": "ET3",
        "Werte": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    },
    {
        "Name": "TU",
        "Werte": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    },
    {
        "Name": "CIT2",
        "Werte": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    },
    {
        "Name": "CIT4",
        "Werte": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    },
    {
        "Name": "CTU2",
        "Werte": {
            "user": "IDMA_SELECT",
            "password": "HappyNewYear2017",
            "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
        }
    }
]
var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}
/*
app.get('/data', function(req, res){
    db.get("SELECT value FROM counts", function(err, row){
        res.json({ "count" : row.value });
    });
});

app.post('/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});
*/
//app.configure(..);
/*
app.get('/account', function(req, res) {
    res.send('respond with a account list resource');
  });
*/
//app.get('/', ....)

app.use('/account', require('./svc/account.router'));
app.use('/auftrag', require('./svc/auftrag.router'));
app.use('/kampagne', require('./svc/kampagne.router'));
app.use('/bestand', require('./svc/bestand.router'));
app.use('/xauftrag', require('./svc/xauftrag.router'));
app.use('/xbestand', require('./svc/xbestand.router'));
app.use('/xmessage', require('./svc/xmessage.router'));
app.use('/xerror', require('./svc/xerror.router'));
//app.use('/photo', require('./srouter'));
// Attach the routers for their respective paths
app.use('/fb', require('./svc/fehlerbild.router'));

app.get('/config', function (req, res, next) { // GET 'http://www.example.com/admin/new'
    console.log('app.get config');
    console.log("req.originalUrl:" + req.originalUrl); // '/admin/new'
    console.log("req.baseUrl:" + req.baseUrl); // '/admin'
    console.log("req.path:" + req.path); // '/new'
    connAttrs= connAttrList.map(x => x.Name['ET3']);
    next();
});


app.get('/admin', function (req, res, next) { // GET 'http://www.example.com/admin/new'
    console.log('app.get admin');
    console.log("req.originalUrl:" + req.originalUrl); // '/admin/new'
    console.log("req.baseUrl:" + req.baseUrl); // '/admin'
    console.log("req.path:" + req.path); // '/new'
    next();
});

app.post('/admin', function (req, res, next) { // GET 'http://www.example.com/admin/new'
    console.log('app.post admin');
    console.log("req.originalUrl:" + req.originalUrl); // '/admin/new'
    console.log("req.baseUrl:" + req.baseUrl); // '/admin'
    console.log("req.path:" + req.path); // '/new'
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