var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("./mrouter");

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.45:51521/IDMET3AA.tsystems.com"
}

var thisArg = {
    router: router,
    oracledb: oracledb,
    connAttrs: connAttrs
};

mrouter(thisArg, "/", "SELECT \
CAMPAIGN_ID, SERVICE, TICKET, TS_CREATION, REPRO_SPERRE, REPRO_EM, REPRO_RUFNR, REPRO_PARAM, STATUS, ANZ_JOBS, DELAY, WAITING_PERIOD \
FROM IDMA_AUFTRAGS_OPDB_DATA.KAMPAGNE")

module.exports = router;