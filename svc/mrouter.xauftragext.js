var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("./mrouter");

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
/*

*/
mrouter(thisArg, "/", "SELECT DISTINCT  'X_AUFTRAG_EXT' AS TBL, A.TO_NR, AX.*  \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
\r\n INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT AX ON AX.EO_ID=AI.O_ID \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AN ON AX.EO_ID=AN.EO_ID \
\r\n WHERE 1=1 \
\r\n AND (A.GUID=:GUID OR :GUID IS NULL ) \
\r\n AND (AX.EO_ID=:EOID OR :EOID IS NULL ) \
\r\n AND (AN.SO_ID=:SOID OR :SOID IS NULL ) \
\r\n AND (AX.ORDER_ID_BSSOE=:BSSOE OR :BSSOE IS NULL ) \
\r\n AND (AX.ORDER_ID_CRM=:CRM OR :CRM IS NULL ) \
\r\n AND (AX.ORDER_ID_DKK=:DKK OR :DKK IS NULL ) \
\r\n AND (AX.ORDER_ID_MISC=:MISC OR :MISC IS NULL ) \
\r\n AND (AX.ORDER_ID_SMF=:SMF OR :SMF IS NULL ) \
\r\n AND rownum <= 10 \
\r\n ORDER BY AX.TS_LAST_UPDATE \
"
, "query.GUID", "query.GUID"
, "query.EOID", "query.EOID"
, "query.SOID", "query.SOID"
, "query.BSSOE", "query.BSSOE"
, "query.CRM", "query.CRM"
, "query.DKK", "query.DKK"
, "query.MISC", "query.MISC"
, "query.SMF", "query.SMF"
)


mrouter(thisArg, "/:GUID", "SELECT 'X_AUFTRAG_EXT' AS TBL, AX.*  \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
\r\n INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
\r\n INNER JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AX ON AI.O_ID=AX.EO_ID \
\r\n WHERE A.GUID=:GUID \
", "GUID")


module.exports = router;