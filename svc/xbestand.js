var express = require('express')
var router = express.Router()
var dateFormat = 'YYYY-MM-DD';

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}
var m_debug = false;

function generateParams(req, params) {
    return params.map(e => {
        var a = e.split(".");
        return req[String(a[0])][String(a[1])];
    });
}

function printResult(results) {
    if (m_debug) {
        for (var i in results.rows) {
            var r = results.rows[i];
            console.log(r.ID + '=' + r[1]);
        }
    }
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
        var r = getBestandListByGuid(connAttrs, reqparams[0], function (xbestandList) {
            console.log('call getBestandListByGuid()) ');
            res.send(JSON.stringify(xbestandList));
            return;

        });
    }
})
// define the home page route
router.get('/EM', function (req, res) {
    var reqparams = generateParams(req, ["query.GUID"]);
    console.log('router.get: ' + reqparams);
    if (reqparams[0] !== '') {
        var r = getBestandByGuid(connAttrs, reqparams[0], function (bestand) {
            console.log('getBestandByGuid: ', bestand);

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
router.get('/about', async function (req, res) {
    var result = await resolveAfter2Seconds();
    console.log(result);

    res.send('About BESTAND')
})
var callbackCount = 0;

function getBestandListByGuid(connAttrs, aGUID, callback) {
    console.log('getBestandListByGuid: ', aGUID);

    oracledb.getConnection(connAttrs,
        function (err, connection) {
            if (err) throw err;

            var sSQL = 'SELECT \'BESTAND\' AS TBL, B.* FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B  \n' +
                'WHERE B.GUID = :GUID';
            //console.log('sSQL: ', sSQL);

            connection.execute(sSQL, {
                    GUID: aGUID
                }, {
                    outFormat: oracledb.OBJECT
                },
                async function (err, results) {
                    // Get the size of an object
                    //var size = Object.size(results.rows);
                    //xbestandList: XBestand[];
                    var xbestandList = {};
                    if (err) {
                        throw err;
                    }

                    var waiting = 0;
                    for (var i in results.rows) {
                        var r = results.rows[i];
                        var bestand = {};
                        bestand.stock = r;
                        var stockId = r.STOCK_ID;
                        console.log('stockId(' + i + '): ' + stockId);
                        if (stockId) {

                            await getBestandDet(bestand, connection);

                            xbestandList[i] = bestand;
                        }
                    }
                    callback(xbestandList);

                }
            );
        }
    );
}


function resolveAfter2Seconds() {
    return new Promise(resolve => {

        setTimeout(() => {
            resolve('resolved 2');
        }, 2000);

    });
}

async function getBestandDet(bestand, connection) {
    var stockId;
    stockId = bestand.stock.STOCK_ID;
    console.log('getBestandDet(' + stockId + ') ');

    //var result = await resolveAfter2Seconds();
    //console.log(result);

    bestand.em = await getEMListByStockId(stockId, connection);
    console.log('getEMListByStockId(' + stockId + '): ', bestand.em.length);
    bestand.par = await getPARListByStockId(stockId, connection);
    console.log('getPARListByStockId(' + stockId + '): ', bestand.par.length);
    bestand.rnr = await getRNRListByStockId(stockId, connection);
    console.log('getRNRListByStockId(' + stockId + '): ', bestand.rnr.length);
    bestand.spr = await getSPRListByStockId(stockId, connection);
    console.log('getSPRListByStockId(' + stockId + '): ', bestand.spr.length);
    bestand.ins = await getINSListByStockId(stockId, connection);
    console.log('getINSListByStockId(' + stockId + '): ', bestand.ins.length);
}

function getEMListByStockId(StockId, connection) {
    return new Promise(resolve => {

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
                //printResult(results);
                resolve(results.rows);
            }
        );
    });
}

function getPARListByStockId(StockId, connection) {
    return new Promise(resolve => {
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
                //printResult(results);
                resolve(results.rows);
            }
        );
    });
}

function getRNRListByStockId(StockId, connection) {
    return new Promise(resolve => {
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
                //printResult(results);
                resolve(results.rows);
            }
        );
    });


}

function getSPRListByStockId(StockId, connection) {
    return new Promise(resolve => {
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
                //printResult(results);
                resolve(results.rows);
            }
        );
    });

}


function getINSListByStockId(StockId, connection) {
    return new Promise(resolve => {
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
                //printResult(results);
                resolve(results.rows);
            }
        );

    });

}
/*
 */
module.exports = router;