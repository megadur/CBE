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

mrouter(thisArg, "", "SELECT   'X_MESSAGES' AS TBL, XM.*, \
dbms_lob.substr( XM.MESSAGE, dbms_lob.getlength(XM.MESSAGE), 1)  AS MSG \
 \r\n  FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM \
 \r\n WHERE 1=1 \
 \r\n AND (XM.ID=:MSG_ID OR :MSG_ID IS NULL)  \
 \r\n AND (XM.SO_ID=:SO_ID OR :SO_ID IS NULL)  \
 \r\n AND (XM.EO_ID=:EO_ID OR :EO_ID IS NULL)  \
 \r\n AND  rownum <= 11 \
 \r\n ORDER BY XM.ID \
"
, "query.MSG_ID","query.MSG_ID"
, "query.SO_ID","query.SO_ID"
, "query.EO_ID","query.EO_ID"
)


mrouter(thisArg, "/MSG_LEN", " SELECT  \
XM.ID AS ID, dbms_lob.getlength(XM.MESSAGE) AS LEN \
 \r\n  FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM \
 \r\n WHERE 1=1 \
 \r\n AND (XM.ID=:MSG_ID OR :MSG_ID IS NULL)  \
 \r\n AND (XM.SO_ID=:SO_ID OR :SO_ID IS NULL)  \
 \r\n AND (XM.EO_ID=:EO_ID OR :EO_ID IS NULL)  \
 \r\n AND  rownum <= 11 \
 \r\n ORDER BY XM.ID \
"
, "query.MSG_ID","query.MSG_ID"
, "query.SO_ID","query.SO_ID"
, "query.EO_ID","query.EO_ID"
)

module.exports = router;