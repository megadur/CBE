module.exports = function (selector, sSQL, ...params) {
    ({ router, oracledb, connAttrs } = this);
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

            var reqparams = params.map(e => req.params[String(e)]);
            var dateTime = require('node-datetime');

            connection.execute(sSQL, reqparams, {
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
                    var dt = dateTime.create();
                    var formatted = dt.format('Y-m-d H:M:S');
                    console.log(formatted+"Connection GET: " + router.String);

                    res.contentType('application/json').status(200);
                    res.send(JSON.stringify(result.rows));
                    console.log(formatted + " GET " + selector + "(" + reqparams + ") = length " + result.rows.length);
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
}