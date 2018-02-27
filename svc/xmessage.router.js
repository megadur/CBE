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

mrouter(thisArg, "", "SELECT XM.*, \
 dbms_lob.substr(XM.MESSAGE, 4000, 1) AS MSG \
 FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM \
WHERE 1=1 \
AND (XM.ID=:MSG_ID OR :MSG_ID IS NULL)  \
AND (XM.SO_ID=:SO_ID OR :SO_ID IS NULL)  \
AND  rownum <= 11 \
"
, "query.MSG_ID","query.MSG_ID"
, "query.SO_ID","query.SO_ID"
)


module.exports = router;