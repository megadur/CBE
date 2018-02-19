var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("../mrouter");

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}

var thisArg = {
    router: router,
    oracledb: oracledb,
    connAttrs: connAttrs
};

mrouter(thisArg, "", "SELECT \
 dbms_lob.substr(XM.MESSAGE, 4000, 1) AS MSG \
 FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM \
WHERE 1=1 \
AND (XM.ID=:MDG_ID OR :MDG_ID IS NULL)  \
AND  rownum <= 11 \
","query.MSG_ID")


module.exports = router;