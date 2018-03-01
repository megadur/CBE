var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var express = require('express')
var mrouter = require("../mrouter");

const path = require('path')
const dbPath = path.resolve(__dirname, '../data/cbe.db')
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('sqlite3.Database:' + dbPath);
        console.error(err.message);
    } else {
        console.log('Connected to the database: ' + dbPath);
    }
});
// Create the express router object for Photos
var fbRouter = express.Router();


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
// listet TOP 10 mit  Filter
mrouter(thisArg, "", "SELECT " +
" 'SELECT' AS QT, '" + db.getEnv() + "' AS QE, " + 
" FB.* \
\r\n FROM FROM FEHLERBILD FB \
\r\n WHERE 1=1 \
\r\n  \
\r\n AND FB.SELECT ID=:SELECT ID OR :SELECT ID IS NULL  \
\r\n AND FB.BILDNUMMER=:BILDNUMMER OR :BILDNUMMER IS NULL  \
\r\n  \
\r\n AND FB.FLT_SO_TYPE_ID=:FLT_SO_TYPE_ID OR :FLT_SO_TYPE_ID IS NULL  \
\r\n AND FB.FLT_STATUS=:FLT_STATUS OR :FLT_STATUS IS NULL  \
\r\n AND FB.FLT_SPECIAL_ORDER_FLAG_ID=:FLT_SPECIAL_ORDER_FLAG_ID OR :FLT_SPECIAL_ORDER_FLAG_ID IS NULL  \
\r\n  \
\r\n AND FB.FLT_INC_TEXT_SHORT=:FLT_INC_TEXT_SHORT OR :FLT_INC_TEXT_SHORT IS NULL  \
\r\n AND FB.FLT_INC_TEXT_LONG=:FLT_INC_TEXT_LONG OR :FLT_INC_TEXT_LONG IS NULL  \
\r\n AND FB.FLT_CODE_INT=:FLT_CODE_INT OR :FLT_CODE_INT IS NULL  \
\r\n AND FB.FLT_TEXT_INT=:FLT_TEXT_INT OR :FLT_TEXT_INT IS NULL  \
\r\n AND FB.FLT_CODE_EXT=:FLT_CODE_EXT OR :FLT_CODE_EXT IS NULL  \
\r\n AND FB.FLT_TEXT_EXT=:FLT_TEXT_EXT OR :FLT_TEXT_EXT IS NULL  \
\r\n AND FB.FLT_SYS=:FLT_SYS OR :FLT_SYS IS NULL  \
\r\n AND FB.FLT_TASK=:FLT_TASK OR :FLT_TASK IS NULL  \
\r\n AND FB.FLT_HANDLING=:FLT_HANDLING OR :FLT_HANDLING IS NULL  \
\r\n AND FB.STATUS=:STATUS OR :STATUS IS NULL  \
\r\n AND FB.PRIO=:PRIO OR :PRIO IS NULL  \
\r\n AND FB.SYMPTOM=:SYMPTOM OR :SYMPTOM IS NULL  \
\r\n AND FB.LOESUNG=:LOESUNG OR :LOESUNG IS NULL  \
\r\n AND FB.AUSLOESER=:AUSLOESER OR :AUSLOESER IS NULL  \
\r\n AND FB.BESCHREIBUNG=:BESCHREIBUNG OR :BESCHREIBUNG IS NULL  \
\r\n AND FB.ERSTELLT_TS=:ERSTELLT_TS OR :ERSTELLT_TS IS NULL  \
\r\n AND FB.GEAENDERT_TS=:GEAENDERT_TS OR :GEAENDERT_TS IS NULL  \
\r\n  \
\r\n AND (rownum<=:MAX_ROWS OR :MAX_ROWS IS NULL)  \
\r\n AND (XE.EO_ID>=:MAX_VAL OR :MAX_VAL IS NULL)  \
\r\n AND rownum <= 10 \
\r\n ORDER BY FB.ID \
"
,"query.ID","query.ID"
,"query.BILDNUMMER","query.BILDNUMMER"
,"query.FLT_SO_TYPE_ID","query.FLT_SO_TYPE_ID"
,"query.FLT_STATUS","query.FLT_STATUS"
,"query.FLT_SPECIAL_ORDER_FLAG_ID","query.FLT_SPECIAL_ORDER_FLAG_ID"

,"query.FLT_INC_TEXT_SHORT","query.FLT_INC_TEXT_SHORT"
,"query.FLT_INC_TEXT_LONG","query.FLT_INC_TEXT_LONG"
,"query.FLT_CODE_INT","query.FLT_CODE_INT"
,"query.FLT_TEXT_INT","query.FLT_TEXT_INT"
,"query.FLT_CODE_EXT","query.FLT_CODE_EXT"
,"query.FLT_TEXT_EXT","query.FLT_TEXT_EXT"
,"query.FLT_SYS","query.FLT_SYS"
,"query.FLT_TASK","query.FLT_TASK"
,"query.FLT_HANDLING","query.FLT_HANDLING"
,"query.STATUS","query.STATUS"
,"query.PRIO","query.PRIO"
,"query.SYMPTOM","query.SYMPTOM"
,"query.LOESUNG","query.LOESUNG"
,"query.AUSLOESER","query.AUSLOESER"
,"query.BESCHREIBUNG","query.BESCHREIBUNG"
,"query.ERSTELLT_TS","query.ERSTELLT_TS"
,"query.GEAENDERT_TS","query.GEAENDERT_TS"

,"query.MAX_ROWS","query.MAX_ROWS"
,"query.MAX_VAL","query.MAX_VAL"
)
*/
module.exports = fbRouter;
