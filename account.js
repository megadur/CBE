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

// GET users listing. */
/*
router.get('/', function (req, res) {
    res.send('respond with a account list resource');
});
router.get('/:id', function (req, res) {
    res.send('respond with a account resource + ' + req.params.id);
});
*/

var thisArg = {
    router: router,
    oracledb: oracledb,
    connAttrs: connAttrs
};
mrouter.call(thisArg, "/", "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.ACCOUNT A WHERE  rownum <= 10")
/*
router.get("/", function (req, res) {
    "use strict";

    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        var sSQL;
        sSQL = "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.ACCOUNT A WHERE rownum <= 10";

        connection.execute(sSQL, {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the user profile",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /user_profiles : Connection released");
                    }
                });
        });
    });
});
*/
mrouter.call(thisArg, "/:GUID", "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.ACCOUNT A WHERE A.GUID=:GUID", "GUID")
/* router.get("/:GUID", function (req, res) {
    "use strict";

    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        var sSQL;
        var params;
        sSQL = "SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.ACCOUNT A WHERE A.GUID=:GUID";
        params = [req.params.GUID];

        connection.execute(sSQL, params, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the user profile",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /user_profiles : Connection released");
                    }
                });
        });
    });
}); */

module.exports = router;
