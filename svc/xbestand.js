var express = require('express')
var router = express.Router()
var dateFormat = 'YYYY-MM-DD';

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}

function generateParams(req, params) {
    return params.map(e => {
        var a = e.split(".");
        return req[String(a[0])][String(a[1])];
    });
}
/*
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log(formatted + " router.use ");
    next();
})
*/
router.get('/', function (req, res) {
    res.send('birds')
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds')
})
