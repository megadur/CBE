var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("../mrouter");
var db = require("../db");

var xconnAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}
connAttrs =db.getConn();
// GET users listing. */
/*
router.get('/', function (req, res) {
    res.send('respond with a account list resource');
});
router.get('/:id', function (req, res) {
    res.send('respond with a account resource + ' + req.params.id);
});
*/

console.log( "accrouter.connectString: " + connAttrs.connectString);

var thisArg = {
    router: router,
    oracledb: oracledb,
    connAttrs: connAttrs
};
mrouter(thisArg, "/", "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A WHERE  rownum <= 10")
mrouter(thisArg, "/:GUID", "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A WHERE A.GUID=:GUID", "GUID")
//mrouter(thisArg, "/:GUID/:CMD", "SELECT 'EM' AS  TBL, E.*  FROM IDMA_BESTANDS_OPDB_DATA.X_EINZELMODUL E INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_BESTAND B ON E.STOCK_ID=B.STOCK_ID WHERE B.GUID=:GUID", "GUID")
mrouter(thisArg, "/:GUID/EM", " SELECT 'EM'  AS CMD, :GUID AS GUID, E.*  FROM IDMA_BESTANDS_OPDB_DATA.X_EINZELMODUL E INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_BESTAND B ON E.STOCK_ID=B.STOCK_ID WHERE B.GUID=:GUID", "GUID")
mrouter(thisArg, "/:GUID/PAR", "SELECT 'RNR' AS CMD, :GUID AS GUID, P.*  FROM IDMA_BESTANDS_OPDB_DATA.X_PARAMETER   P INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_BESTAND B ON P.STOCK_ID=B.STOCK_ID WHERE B.GUID=:GUID", "GUID")
mrouter(thisArg, "/:GUID/RNR", "SELECT 'RNR' AS CMD, :GUID AS GUID, R.*  FROM IDMA_BESTANDS_OPDB_DATA.X_RUFNUMMER   R INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_BESTAND B ON B.STOCK_ID=R.STOCK_ID WHERE B.GUID=:GUID", "GUID")
mrouter(thisArg, "/:GUID/SPR", "SELECT 'SPR' AS CMD, :GUID AS GUID, S.*  FROM IDMA_BESTANDS_OPDB_DATA.X_SPERRE      S INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_BESTAND B ON B.STOCK_ID=S.STOCK_ID WHERE B.GUID=:GUID", "GUID")
mrouter(thisArg, "/:GUID/INS", "SELECT 'INS' AS CMD, :GUID AS GUID, I.*  FROM IDMA_BESTANDS_OPDB_DATA.X_INSTANZ     I INNER JOIN IDMA_BESTANDS_OPDB_DATA.X_BESTAND B ON B.STOCK_ID=I.STOCK_ID WHERE B.GUID=:GUID", "GUID")
//mrouter(thisArg, "/:GUID/:CMD", "SELECT 'HUHU', :GUID, :CMD FROM DUAL", "GUID", "CMD")
//mrouter(thisArg, "/:GUID/PAR", "SELECT :v_guid,  CASE WHEN 'EM'=:v_cmd THEN 'PAR' ELSE  'HUHU' END FROM DUAL ", "GUID", "CMD")


module.exports = router;
