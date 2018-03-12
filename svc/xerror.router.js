var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var db = require("../db");
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

mrouter(thisArg, "/FLT", "SELECT"  +
"'SELECT/FLT',XE.EO_ID \
\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ERROR XE \
\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA ON XE.SO_ID=XA.SO_ID \
\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT_2_SOF XAE2S ON XAE2S.EO_ID=XA.EO_ID \
\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.SPECIAL_ORDER_FLAG SOF ON SOF.SPECIAL_ORDER_FLAG_ID=XAE2S.SPECIAL_ORDER_FLAG_ID \
\r\n WHERE 1=1 \
\r\n AND (XE.CODE_INT=:CODE_INT OR :CODE_INT IS NULL)  \
\r\n ORDER BY XE.EO_ID \
"
,"query.CODE_INT","query.CODE_INT"
)


// listet TOP 10 mit exaktem Filter
mrouter(thisArg, "", 
"\r\nSELECT " + 
"\r\n  'SELECT' AS QT" + 
"\r\n, 'ET3' AS QE" + 
"\r\n, E.*" + 
"\r\n, AI.*" + 
"\r\n, AX.EO_ID" + 
"\r\n FROM IDMA_AUFTRAGS_OPDB_DATA.X_ERROR E" + 
"\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG AI ON AI.SO_ID=E.SO_ID" + 
"\r\n RIGHT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT AX  ON AX.EO_ID=E.EO_ID" + 
"\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT_2_SOF AX2S ON AX2S.EO_ID=E.EO_ID" + 
"\r\n LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.SPECIAL_ORDER_FLAG SOF ON SOF.SPECIAL_ORDER_FLAG_ID=AX2S.SPECIAL_ORDER_FLAG_ID" + 
"\r\n WHERE 1=1" + 
"\r\n AND (AX.EO_ID=:EO_ID OR :EO_ID IS NULL)" + 
"\r\n AND (AI.SO_TYPE_ID=:SO_TYPE_ID OR :SO_TYPE_ID IS NULL)" + 
"\r\n AND (AI.STATUS=:STATUS OR :STATUS IS NULL)" + 
"\r\n AND (AX2S.SPECIAL_ORDER_FLAG_ID=:SPECIAL_ORDER_FLAG_ID OR :SPECIAL_ORDER_FLAG_ID IS NULL)" + 
"\r\n AND (E.INC_TEXT_SHORT=:INC_TEXT_SHORT OR :INC_TEXT_SHORT IS NULL)" + 
// "\r\n AND (E.INC_TEXT_LONG=:INC_TEXT_LONG OR :INC_TEXT_LONG IS NULL)" + 
"\r\n AND (E.CODE_INT=:CODE_INT OR :CODE_INT IS NULL)" + 
"\r\n AND (E.TEXT_INT=:TEXT_INT OR :TEXT_INT IS NULL)" + 
"\r\n AND (E.CODE_EXT=:CODE_EXT OR :CODE_EXT IS NULL)" + 
"\r\n AND (E.TEXT_EXT=:TEXT_EXT OR :TEXT_EXT IS NULL)" + 
"\r\n AND (E.SYS=:SYS OR :SYS IS NULL)" + 
"\r\n AND (E.TASK=:TASK OR :TASK IS NULL)" + 
"\r\n AND (E.HANDLING=:HANDLING OR :HANDLING IS NULL)" + 
"\r\n AND (rownum<=:MAX_ROWS OR :MAX_ROWS IS NULL)" + 
"\r\n AND (E.EO_ID>=:MAX_VAL OR :MAX_VAL IS NULL)" + 
"\r\n AND rownum <= 10" + 
"\r\n ORDER BY E.EO_ID" 

,"query.EO_ID","query.EO_ID"
,"query.SO_TYPE_ID","query.SO_TYPE_ID"
,"query.STATUS","query.STATUS"
,"query.SPECIAL_ORDER_FLAG_ID","query.SPECIAL_ORDER_FLAG_ID"
,"query.INC_TEXT_SHORT","query.INC_TEXT_SHORT"
//,"query.INC_TEXT_LONG","query.INC_TEXT_LONG"
,"query.CODE_INT","query.CODE_INT"
,"query.TEXT_INT","query.TEXT_INT"
,"query.CODE_EXT","query.CODE_EXT"
,"query.TEXT_EXT","query.TEXT_EXT"
,"query.SYS","query.SYS"
,"query.TASK","query.TASK"
,"query.HANDLING","query.HANDLING"
,"query.MAX_ROWS","query.MAX_ROWS"
,"query.MAX_VAL","query.MAX_VAL"
)
// listet TOP 10 ohne Filter
mrouter(thisArg, "/", "SELECT \
'SELECT/',XA.SO_TYPE_ID, XA.STATUS \
,SOF.SPECIAL_ORDER_FLAG_ID, SOF.NAME \
,XE.*, dbms_lob.substr(XE.INC_TEXT_LONG , 400,  1), XE.HANDLING \
FROM IDMA_AUFTRAGS_OPDB_DATA.X_ERROR XE \
LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA ON XE.SO_ID=XA.SO_ID \
LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT_2_SOF XAE2S ON XAE2S.EO_ID=XA.EO_ID \
LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.SPECIAL_ORDER_FLAG SOF ON SOF.SPECIAL_ORDER_FLAG_ID=XAE2S.SPECIAL_ORDER_FLAG_ID \
WHERE 1=1 \
AND  rownum <= 10 \
ORDER BY XE.EO_ID \
")


mrouter(thisArg, "/:GUID/GUID", "SELECT \
'SELECT/GUID',XAC.GUID AS GGG, XAC.TO_NR \
,XE.*,  dbms_lob.substr(XE.INC_TEXT_LONG , 400,  1), XE.HANDLING \
FROM IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT XAC \
JOIN IDMA_AUFTRAGS_OPDB_DATA.X_ACCOUNT_INFO XAI ON XAI.TO_NR=XAC.TO_NR \
JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT XAE ON XAI.O_ID=XAE.EO_ID \
LEFT JOIN IDMA_AUFTRAGS_OPDB_DATA.X_ERROR XE ON XE.EO_ID=XAE.EO_ID \
WHERE 1=1 \
AND  XAC.GUID=:GUID \
", "params.GUID", "body.USER_NAME")

mrouter(thisArg, "/:ID/ID", "SELECT \
'SELECT/ID',XE.*,  dbms_lob.substr(XE.INC_TEXT_LONG , 400,  1), XE.HANDLING \
FROM  IDMA_AUFTRAGS_OPDB_DATA.X_ERROR XE \
WHERE 1=1 \
AND  XE.ID=:ID \
", "params.ID")

mrouter(thisArg, "", "INSERT INTO user_profiles VALUES " +
    "(:USER_NAME, :DISPLAY_NAME, :DESCRIPTION, :GENDER," +
    ":AGE, :COUNTRY, :THEME) ", "body.USER_NAME", "body.DISPLAY_NAME",
        "body.DESCRIPTION", "body.GENDER", "body.AGE", "body.COUNTRY",
        "body.THEME"
    )

// Build UPDATE statement and prepare bind variables
var buildUpdateStatement = function buildUpdateStatement(req) {
    "use strict";

    var statement = "",
        bindValues = {};
    if (req.body.DISPLAY_NAME) {
        statement += "DISPLAY_NAME = :DISPLAY_NAME";
        bindValues.DISPLAY_NAME = req.body.DISPLAY_NAME;
    }
    if (req.body.DESCRIPTION) {
        if (statement) statement = statement + ", ";
        statement += "DESCRIPTION = :DESCRIPTION";
        bindValues.DESCRIPTION = req.body.DESCRIPTION;
    }
    if (req.body.GENDER) {
        if (statement) statement = statement + ", ";
        statement += "GENDER = :GENDER";
        bindValues.GENDER = req.body.GENDER;
    }
    if (req.body.AGE) {
        if (statement) statement = statement + ", ";
        statement += "AGE = :AGE";
        bindValues.AGE = req.body.AGE;
    }
    if (req.body.COUNTRY) {
        if (statement) statement = statement + ", ";
        statement += "COUNTRY = :COUNTRY";
        bindValues.COUNTRY = req.body.COUNTRY;
    }
    if (req.body.THEME) {
        if (statement) statement = statement + ", ";
        statement += "THEME = :THEME";
        bindValues.THEME = req.body.THEME;
    }

    statement += " WHERE USER_NAME = :USER_NAME";
    bindValues.USER_NAME = req.params.USER_NAME;
    statement = "UPDATE USER_PROFILES SET " + statement;

    return {
        statement: statement,
        bindValues: bindValues
    };
};

module.exports = router;