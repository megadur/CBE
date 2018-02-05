
function generateParams(req, params) {
    return params.map(e => {
        var a = e.split(".");
        return req[String(a[0])][String(a[1])];
 //       return String(a[1]) +': \''+ req[String(a[0])][String(a[1])] + '\'';
    });
}

module.exports = function (arg, selector, sSQL, ...params) {
    ({
        router,
        oracledb,
        connAttrs
    } = arg);

    router.get(selector, function (req, res) {
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


            console.log( " params: " + params);
            var reqparams = generateParams(req, params);
            console.log( " sSQL: " + sSQL);
            console.log( " reqparams " + reqparams);
            
             /*
            connection.execute(sSQL, reqparams, {
                outFormat: oracledb.OBJECT // Return the result as Object
            },handleCall(err, res, reqparams));
            */

            connection.execute(sSQL, reqparams, {
                outFormat: oracledb.OBJECT // Return the result as Object
            }, function (err, result) {
                if (err) {
                    console.log( " err " + err);
     
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: "Error getting the user profile",
                        detailed_message: err.message
                    }));
                } else {
                    var dateTime = require('node-datetime');
                    var dt = dateTime.create();
                    var formatted = dt.format('Y-m-d H:M:S');
                    console.log(formatted + " Connection GET: " + selector);
                    console.log(formatted + " req.baseUrl: " + req.baseUrl);
                    if(req.baseUrl == '/bestand'){
                        result.rows.forEach(function(row) {
                            console.log(formatted + " row[0][1]: " + row.STOCK_ID);                            
                            best.getDepartment(connAttrs, 'selector', null);
                        })
                    }
                    res.contentType('application/json').status(200);
                    res.send(JSON.stringify(result.rows));
                    console.log(formatted + " GET [" + selector + "](" + reqparams + ")("+ "(" + params + ") = length " + result.rows.length);
                    console.log(formatted + " SQL " + sSQL);
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            // console.log("Connection released GET: " + selector );
                        }
                    });
            });

        });
    });
    // Http method: POST
    // URI        : /user_profiles
    // Creates a new user profile
    router.post(selector, function (req, res) {
        "use strict";
        if ("application/json" !== req.get('Content-Type')) {
            res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
                status: 415,
                message: "Wrong content-type. Only application/json is supported",
                detailed_message: null
            }));
            return;
        }
        oracledb.getConnection(connAttrs, function (err, connection) {
            if (err) {
                // Error connecting to DB
                res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error connecting to DB",
                    detailed_message: err.message
                }));
                return;
            }

            var reqparams = generateParams(req, params);
        
            connection.execute(sSQL, reqparams, {
                    autoCommit: true,
                    outFormat: oracledb.OBJECT // Return the result as Object
                },
                function (err, result) {
                    if (err) {
                        // Error
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                            detailed_message: err.message
                        }));
                    } else {
                        var dateTime = require('node-datetime');
                        var dt = dateTime.create();
                        var formatted = dt.format('Y-m-d H:M:S');
                        console.log(formatted + " Connection POST: " + selector);
    
                        // Successfully created the resource
                        res.status(201).set('Location', '/user_profiles/' + req.body.USER_NAME).end();
                        console.log(formatted + " POST " + selector + "(" + reqparams + ") = length " + result.rows.length);
                        console.log(formatted + " SQL " + sSQL);
                    }
                    // Release the connection
                    connection.release(
                        function (err) {
                            if (err) {
                                console.error(err.message);
                            } else {
                                console.log("POST /user_profiles : Connection released");
                            }
                        });
                });
        });
    });

    router.put(selector, function (req, res) {
        "use strict";
        if ("application/json" !== req.get('Content-Type')) {
            res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
                status: 415,
                message: "Wrong content-type. Only application/json is supported",
                detailed_message: null
            }));
            return;
        }

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

            var reqparams = params.map(e => req.params[String(e)]);
            var updateStatement = buildUpdateStatement(req);
            connection.execute(updateStatement.statement, updateStatement.bindValues, {
                    autoCommit: true,
                    outFormat: oracledb.OBJECT // Return the result as Object
                },
                function (err, result) {
                    if (err || result.rowsAffected === 0) {
                        // Error
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: err ? "Input Error" : "User doesn't exist",
                            detailed_message: err ? err.message : ""
                        }));
                    } else {
                        var dateTime = require('node-datetime');
                        var dt = dateTime.create();
                        var formatted = dt.format('Y-m-d H:M:S');
                        console.log(formatted + " Connection PUT: " + router.String);
                        // Resource successfully updated. Sending an empty response body. 
                        res.status(204).end();
                    }
                    // Release the connection
                    connection.release(
                        function (err) {
                            if (err) {
                                console.error(err.message);
                            } else {
                                console.log("PUT /user_profiles/" + req.params.USER_NAME + " : Connection released ");
                            }
                        });
                });

        });
    });
}