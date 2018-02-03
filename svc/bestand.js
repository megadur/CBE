var express = require('express')
var router = express.Router()
var dateFormat = 'YYYY-MM-DD';

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}

function generateParams(req, params) {
    return params.map(e => {
        var a = e.split(".");
        return req[String(a[0])][String(a[1])];
    });
}
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log(formatted + " router.use ");
    next();
})
// define the home page route
router.get('/', function (req, res) {
    var reqparams = generateParams(req, ["query.GUID"]);
    console.log('router.get: ' + reqparams);
    if (reqparams[0] !== '') {
        var r = getBestandByGuid(connAttrs, reqparams[0], function (bestand) {
            console.log('getBestandByGuid: ', bestand);
            /*
            if (bestand.em)
                console.log('bestand.em: ');
            if (bestand.rnr)
                console.log('bestand.rnr: ');
            if (bestand.spr)
                console.log('bestand.spr: ');
            if (bestand.par)
                console.log('bestand.par: ');
            if (bestand.ins)
                console.log('bestand.ins: ');
*/
            console.log('check: em:' & bestand.em == undefined & ', rnr:' & bestand.rnr == undefined & ', spr:' & bestand.spr == undefined & ', par:' & bestand.par == undefined & ', ins:' & bestand.ins == undefined);
            if (!bestand.i) {
                res.send(JSON.stringify(bestand));
                return;
            }

            if (true && bestand.em && bestand.rnr && bestand.spr && bestand.par && bestand.ins) {
                res.send(JSON.stringify(bestand));
                return;
            }
        });
        //console.log('r: ', r);

    }
    //res.send('Birds home page')
    //res.send(JSON.stringify(results.rows));
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds')
})

function getBestandByGuid(connAttrs, aGUID, callback) {
    console.log('getBestandByGuid: ', aGUID);

    oracledb.getConnection(connAttrs,
        function (err, connection) {
            if (err) throw err;

            connection.execute(
                'SELECT \'BESTAND\' AS TBL, B.* FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B  \n' +
                'WHERE B.GUID = :GUID', {
                    GUID: aGUID
                }, {
                    outFormat: oracledb.OBJECT
                },
                function (err, results) {
                    // Get the size of an object
                    var size = Object.size(results.rows);
                    xbestandList: XBestand[];
                    //bestand.stock = {};
                    //bestand.em = {};
                    //bestand.par = {};

                    if (err) {
                        throw err;
                    }
                    for (var i in results.rows) {
                        var r = results.rows[i];
                        var bestand;
                        bestand.stock = r;
                        var stockId = r.STOCK_ID;
                        console.log(stockId);
                        if (stockId) {

                            getEMDetails(bestand, stockId, connection, function (result) {
                                console.log('getEMDetails: ', result);
                                bestand.em = result;
                                //                                callback(bestand);
                            });
                            getPARDetails(bestand, stockId, connection, function (result) {
                                console.log('getPARDetails: ', result);
                                bestand.par = result;
                                //                                callback(bestand);
                            });
                            getRNRDetails(bestand, stockId, connection, function (result) {
                                console.log('getRNRDetails: ', result);
                                bestand.rnr = result;
                                //                                callback(bestand);
                            });
                            getSPRDetails(bestand, stockId, connection, function (result) {
                                console.log('getSPRDetails: ', result);
                                bestand.spr = result;
                                //                                callback(bestand);
                            });
                            getINSDetails(bestand, stockId, connection, function (result) {
                                console.log('getINSDetails: ', result);
                                bestand.ins = result;
                                //                                callback(bestand);
                            });
                            if (true && bestand.em && bestand.rnr && bestand.spr && bestand.par && bestand.ins) {
                                xbestandList[i] = bestand;
                               // next;
                            }

                        }
                    }
                    if (!bestand.i) callback(bestand);

                    //return bestand;
                    //callback.send(JSON.stringify(results.rows));
                    //getLocationDetails(results.rows[0][3], department, connection, callback);
                }
            );
        }
    );
}

module.exports = router;

function getEMDetails(bestand, StockId, connection, callback) {
    connection.execute(
        'SELECT \'EM\' AS TBL, E.*  \n' +
        ' FROM IDMA_BESTANDS_OPDB_DATA.X_EINZELMODUL E \n' +
        ' WHERE E.STOCK_ID=:StockId', {
            StockId: StockId
        }, {
            outFormat: oracledb.OBJECT
        },
        function (err, results) {
            if (err) throw err;
            bestand.em = results.rows
            for (var i in results.rows) {
                var r = results.rows[i];
                console.log(r.ID + '=' + r[1]);
            }
            callback(results.rows);

            //            getCountryDetails(results.rows[0][3], department, connection, callback);
        }
    );
}

function getPARDetails(bestand, StockId, connection, callback) {
    connection.execute(
        'SELECT \'PAR\' AS TBL, P.*  \n' +
        ' FROM IDMA_BESTANDS_OPDB_DATA.X_PARAMETER P  \n' +
        ' WHERE P.STOCK_ID=:StockId', {
            StockId: StockId
        }, {
            outFormat: oracledb.OBJECT
        },
        function (err, results) {
            if (err) throw err;
            bestand.par = results.rows
            for (var i in results.rows) {
                var r = results.rows[i];
                console.log(r[0]);
            }
            callback(results.rows);

            //            getCountryDetails(results.rows[0][3], department, connection, callback);
        }
    );
}

function getRNRDetails(bestand, StockId, connection, callback) {
    connection.execute(
        'SELECT \'RNR\' AS TBL, R.*  \n' +
        ' FROM IDMA_BESTANDS_OPDB_DATA.X_RUFNUMMER R  \n' +
        ' WHERE R.STOCK_ID=:StockId', {
            StockId: StockId
        }, {
            outFormat: oracledb.OBJECT
        },
        function (err, results) {
            if (err) throw err;
            bestand.rnr = results.rows
            for (var i in results.rows) {
                var r = results.rows[i];
                console.log(r[0]);
            }
            callback(results.rows);

            //            getCountryDetails(results.rows[0][3], department, connection, callback);
        }
    );
}

function getSPRDetails(bestand, StockId, connection, callback) {
    connection.execute(
        'SELECT \'SPR\' AS TBL, S.*  \n' +
        ' FROM IDMA_BESTANDS_OPDB_DATA.X_SPERRE S   \n' +
        ' WHERE S.STOCK_ID=:StockId', {
            StockId: StockId
        }, {
            outFormat: oracledb.OBJECT
        },
        function (err, results) {
            if (err) throw err;
            bestand.spr = results.rows
            for (var i in results.rows) {
                var r = results.rows[i];
                console.log(r[0]);
            }
            callback(results.rows);

            //            getCountryDetails(results.rows[0][3], department, connection, callback);
        }
    );
}


function getINSDetails(bestand, StockId, connection, callback) {
    connection.execute(
        'SELECT \'INS\' AS TBL, I.*  \n' +
        ' FROM IDMA_BESTANDS_OPDB_DATA.X_INSTANZ I    \n' +
        ' WHERE I.STOCK_ID=:StockId', {
            StockId: StockId
        }, {
            outFormat: oracledb.OBJECT
        },
        function (err, results) {
            if (err) throw err;
            bestand.ins = results.rows
            for (var i in results.rows) {
                var r = results.rows[i];
                console.log(r[0]);
            }
            callback(results.rows);

            //            getCountryDetails(results.rows[0][3], department, connection, callback);
        }
    );
}