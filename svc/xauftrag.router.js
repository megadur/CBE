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

mrouter(thisArg, "/", "SELECT  'X_AUFTRAG' AS TBL, A.TO_NR, AU.* \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
\r\n INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AU ON AI.O_ID=AU.EO_ID \
\r\n WHERE 1=1 \
\r\n AND (A.GUID=:GUID OR :GUID IS NULL ) \
\r\n AND (AU.EO_ID=:EO_ID OR :EO_ID IS NULL ) \
\r\n AND (AU.SO_ID=:SO_ID OR :SO_ID IS NULL ) \
\r\n AND rownum <= 10 \
\r\n ORDER BY AU.TS_LAST_UPDATE \
"
, "query.GUID", "query.GUID"
, "query.EOID", "query.EOID"
, "query.SOID", "query.SOID"
)

/*
mrouter(thisArg, "/", "SELECT  'X_AUFTRAG' AS TBL, A.TO_NR, AU.*, AX.*  \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
\r\n INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AU ON AI.O_ID=AU.EO_ID \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT AX ON AX.EO_ID=AU.EO_ID \
\r\n WHERE 1=1 \
\r\n AND (A.GUID=:GUID OR :GUID IS NULL ) \
\r\n AND (AU.EO_ID=:EO_ID OR :EO_ID IS NULL ) \
\r\n AND (AU.SO_ID=:SO_ID OR :SO_ID IS NULL ) \
\r\n AND rownum <= 10 \
\r\n ORDER BY AU.TS_LAST_UPDATE \
", "query.GUID", "query.GUID", "query.EOID", "query.EOID", "query.SOID", "query.SOID")


*/
mrouter(thisArg, "/:GUID", "SELECT  'X_AUFTRAG' AS TBL, AU.*  \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
\r\n INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AU ON AI.O_ID=AU.EO_ID \
\r\n WHERE A.GUID=:GUID \
", "GUID")


module.exports = router;