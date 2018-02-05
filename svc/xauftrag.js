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

mrouter(thisArg, "/", "SELECT  'X_AUFTRAG' AS TBL, AU.*  \
FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AU ON AI.O_ID=AU.EO_ID \
WHERE 1=1 \
AND (A.GUID=:GUID OR :GUID IS NULL ) \
AND (AU.EO_ID=:EO_ID OR :EO_ID IS NULL ) \
AND rownum <= 10 \
ORDER BY AU.TS_LAST_UPDATE \
", "query.GUID", "query.GUID", "query.EO_ID", "query.EO_ID", "query.STOCK_ID", "query.STOCK_ID")


mrouter(thisArg, "/:GUID", "SELECT  'X_AUFTRAG' AS TBL, AU.*  \
FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AU ON AI.O_ID=AU.EO_ID \
WHERE A.GUID=:GUID \
", "GUID")


module.exports = router;