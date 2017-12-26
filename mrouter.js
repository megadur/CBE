module.exports = function(selector, sSQL, ...params) {
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
            var val;
            for (var i in req.params) {
                val = req.params[i];
                console.log(val.path);
                console.log(i);
              }
            var reqparams = params.map(e => req.params[String(e)]);
    
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
                    console.log("Connection GET: " + selector + "=" + params);

                    res.contentType('application/json').status(200);
                    res.send(JSON.stringify(result.rows));
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