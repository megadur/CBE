/*jslint node:true*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');


// Use body parser to parse JSON body
app.use(bodyParser.json());

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}
var connAttrs1 = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "localhost:1521/XE"
}

// Http Method: GET
// URI        : /bestand
// Read all the user bestand
app.get('/bestand/:GUID', function (req, res) {
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

        connection.execute("SELECT 'BESTAND' AS TBL, B.* FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B WHERE B.GUID=:GUID", [req.params.GUID], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the BESTAND",
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
                        console.log("GET /bestand : Connection released");
                    }
                });
        });
    });
});

// Http Method: GET
// URI        : /account
// Read all the account
app.get('/accountlist', function (req, res) {
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

        connection.execute("SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.ACCOUNT A WHERE rownum <= 10", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the account",
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
                        console.log("GET /account : Connection released");
                    }
                });
        });
    });
});

// Http method: GET
// URI        : /account/:GUID
// Read the account given in :GUID
app.get('/account/:GUID', function (req, res) {
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

        connection.execute("SELECT 'ACCOUNT' AS TBL, A.* FROM IDMA_BESTANDS_OPDB_DATA.ACCOUNT A WHERE A.GUID=:GUID", [req.params.GUID], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the account" : "account doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /account/" + req.params.GUID + " : Connection released");
                    }
                });
        });
    });
});




// Http Method: GET
// URI        : /user_profiles
// Read all the user profiles
app.get('/user_profiles', function (req, res) {
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

        connection.execute("SELECT * FROM USER_PROFILES", {}, {
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

// Http method: GET
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/user_profiles/:USER_NAME', function (req, res) {
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

        connection.execute("SELECT * FROM USER_PROFILES WHERE USER_NAME = :USER_NAME", [req.params.USER_NAME], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /user_profiles/" + req.params.USER_NAME + " : Connection released");
                    }
                });
        });
    });
});



var server = app.listen(3000, function () {
    "use strict";

    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});