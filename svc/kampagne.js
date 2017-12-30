var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("../router");

//SELECT CAMPAIGN_ID, SERVICE, TICKET, TS_CREATION, REPRO_SPERRE, REPRO_EM, REPRO_RUFNR, REPRO_PARAM, STATUS, ANZ_JOBS, DELAY, WAITING_PERIOD FROM IDMA_AUFTRAGS_OPDB_DATA.KAMPAGNE;
// GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a bestand list resource');
  });
  router.get('/:id', function(req, res) {
    res.send('respond with a bestand resource + '+req.params.id);
  });
  router.get('/:cmd/:id', function(req, res) {
    res.send('respond with a bestand + '+req.params.cmd + '=' +req.params.id  );
  });
  
    router.get('/admin', function(req, res, next) {  // GET 'http://www.example.com/admin/new'
    console.log(req.originalUrl); // '/admin/new'
    console.log(req.baseUrl); // '/admin'
    console.log(req.path); // '/new'
    next();
  });
  