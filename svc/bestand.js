var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("../router");

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

mrouter.call(thisArg, "/", "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A WHERE  rownum <= 10")
//mrouter.call(thisArg, "/:GUID", "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A WHERE A.GUID=:GUID", "GUID")
mrouter.call(thisArg, "/:GUID", "SELECT  'X_HIS_AUFTRAG' AS TBL, XH.*  \
FROM IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO AI \
INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.TO_NR=AI.TO_NR \
INNER JOIN IDMA_AUFTRAGS_DISPDB_DATA.X_HIS_AUFTRAG XH ON AI.O_ID=XH.EO_ID \
WHERE A.GUID=:GUID \
ORDER BY XH.TS_LAST_UPDATE ", "GUID")


module.exports = router;