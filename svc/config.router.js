var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("../mrouter");


var thisArg = {
    router: router,
    oracledb: oracledb,
    connAttrs: connAttrs
};

mrouter(thisArg, "/FLT", "SELECT \
'Test',XE.EO_ID \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ERROR XE \
\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA ON XE.SO_ID=XA.SO_ID \
\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT_2_SOF XAE2S ON XAE2S.EO_ID=XA.EO_ID \
\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.SPECIAL_ORDER_FLAG SOF ON SOF.SPECIAL_ORDER_FLAG_ID=XAE2S.SPECIAL_ORDER_FLAG_ID \
\r\n WHERE 1=1 \
\r\n AND (XE.CODE_INT=:CODE_INT OR :CODE_INT IS NULL)  \
\r\n ORDER BY XE.EO_ID \
"
,"query.FLT_CODE_INT","query.FLT_CODE_INT"
)

