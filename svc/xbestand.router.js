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
    var GUID = req.query.GUID;
    var TONR = req.query.TONR;
    var KDNR = req.query.KDNR;
    var STID = req.query.STID;
    console.log('router.get:', GUID, TONR, KDNR, STID);
    var r = getBestandListByPar(connAttrs, GUID, TONR, KDNR, STID, false, false, function (xbestandList) {
        console.log('call getBestandListByGuid()) ');
        res.send(JSON.stringify(xbestandList));
        return;

    });
})
// define the home page route
router.get('/MSG', function (req, res) {
    var GUID = req.query.GUID;
    var TONR = req.query.TONR;
    var KDNR = req.query.KDNR;
    var STID = req.query.STID;
    console.log('router.get/MSG:', GUID, TONR, KDNR, STID);
    var r = getBestandListByPar(connAttrs, GUID, TONR, KDNR, STID, false, true, function (xbestandList) {
        console.log('call getBestandListByGuid()) ');
        res.send(JSON.stringify(xbestandList));
        return;

    });
})
// define the home page route
router.get('/DET', function (req, res) {
    var GUID = req.query.GUID;
    var TONR = req.query.TONR;
    var KDNR = req.query.KDNR;
    var STID = req.query.STID;
    console.log('router.getDET:', GUID, TONR, KDNR, STID);
    var r = getBestandListByPar(connAttrs, GUID, TONR, KDNR, STID,  true,false, function (xbestandList) {
        console.log('call getBestandListByGuid()) ');
        res.send(JSON.stringify(xbestandList));
        return;

    });
})

// define the home page route
router.get('/ALL', function (req, res) {
    var GUID = req.query.GUID;
    var TONR = req.query.TONR;
    var KDNR = req.query.KDNR;
    var STID = req.query.STID;
    console.log('router.getALL:', GUID, TONR, KDNR, STID);
    var r = getBestandListByPar(connAttrs, GUID, TONR, KDNR, STID,  true, true, function (xbestandList) {
        console.log('call getBestandListByGuid()) ');
        res.send(JSON.stringify(xbestandList));
        return;

    });
})
// define the home page route
router.get('/EM', function (req, res) {
    var stockId = generateParams(req, ["query.STOCK_ID"]);
    console.log('router.get: ' + req.baseUrl + stockId);
    if (stockId !== '') {
        oracledb.getConnection(connAttrs,
            async function (err, connection) {
                if (err) throw err;
                var em = await getEMListByStockId(stockId, connection);
                console.log('getEMListByStockId(' + stockId + '): ', em.length);
                res.send(JSON.stringify(em));
                return;
            }
        );
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

function getBestandListByPar(connAttrs, aGUID, aTONR, aKDNR, aSTID, okDet, okMsg, callback) {
    console.log('getBestandListByPar: ', aGUID, aTONR, aKDNR, aSTID);

    oracledb.getConnection(connAttrs,
        function (err, connection) {
            if (err) throw err;

            var sSQL = 'SELECT \'BESTAND\' AS TBL, :GUID AS GUID, B.*, A.TO_NR, A.KDNR FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B  \n' +
                // 'WHERE B.GUID = :GUID';
                ' JOIN IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT A ON A.GUID=B.GUID \n' +
                ' WHERE 1=1 \n' +
                ' AND (B.GUID=:GUID OR :GUID IS NULL ) \n' +
                ' AND (A.TO_NR=:TONR OR :TONR IS NULL) \n' +
                ' AND (A.KDNR=:KDNR OR :KDNR IS NULL) \n' +
                ' AND (B.STOCK_ID=:STID OR :STID IS NULL) \n' +
                ' AND rownum <10 \n' +
                ' ORDER BY B.STOCK_ID \n' +
                '';
            console.log('getBestandListByPar sSQL:\n ', sSQL);

            //                TONR: aTONR,
            //KDNR: aKDNR
            connection.execute(sSQL, {
                    GUID: aGUID,
                    TONR: aTONR,
                    KDNR: aKDNR,
                    STID: aSTID
                }, {
                    outFormat: oracledb.OBJECT
                },
                async function (err, results) {
                    if (err) {
                        console.log('err: ', err);
                        throw err;
                    }

                    var xbestandList = [];

                    for (var i in results.rows) {
                        var r = results.rows[i];
                        var bestand = {};
                        bestand.id = i;
                        bestand.stock = r;
                        console.log('stockId(' + i + '): ' + r.STOCK_ID);
                        
                        if(okDet)
                        await getBestandDet(bestand, connection);

                        if(okMsg)
                        await getBestandMsg(bestand, connection);

                        xbestandList[i] = bestand;
                    }
                    //console.log('callback: ', xbestandList);

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

async function xgetBestandDet(bestand, connection) {
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

    bestand.xai = await getXAIListByStockId(stockId, connection);
    console.log('getXAIListByStockId(' + stockId + '): ', bestand.xai.length);
    bestand.xae = await getXAEListByStockId(stockId, connection);
    console.log('getXAEListByStockId(' + stockId + '): ', bestand.xae.length);
    bestand.msg = await getMSGListByStockId(stockId, connection);
    console.log('getMSGListByStockId(' + stockId + '): ', bestand.msg.length);
    bestand.err = await getERRListByStockId(stockId, connection);
    console.log('getERRListByStockId(' + stockId + '): ', bestand.err.length);

}
async function getBestand(bestand, connection) {
    var stockId;
    stockId = bestand.stock.STOCK_ID;
    console.log('getBestandDet(' + stockId + ') ');

    //var result = await resolveAfter2Seconds();
    //console.log(result);

    getBestandDet(bestand, connection);
    getBestandMsg(bestand, connection);
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

async function getBestandMsg(bestand, connection) {
    var stockId;
    stockId = bestand.stock.STOCK_ID;
    console.log('getBestandDet(' + stockId + ') ');

    //var result = await resolveAfter2Seconds();
    //console.log(result);

  
    bestand.xai = await getXAIListByStockId(stockId, connection);
    console.log('getXAIListByStockId(' + stockId + '): ', bestand.xai.length);
    bestand.xae = await getXAEListByStockId(stockId, connection);
    console.log('getXAEListByStockId(' + stockId + '): ', bestand.xae.length);
    bestand.msg = await getMSGListByStockId(stockId, connection);
    console.log('getMSGListByStockId(' + stockId + '): ', bestand.msg.length);
    bestand.err = await getERRListByStockId(stockId, connection);
    console.log('getERRListByStockId(' + stockId + '): ', bestand.err.length);

}

function getEMListByStockId(StockId, connection) {
    return new Promise(resolve => {

        connection.execute(
            'SELECT \'EM\' AS TBL, E.* , EM.CAPTION \n' +
            ' FROM IDMA_BESTANDS_OPDB_DATA.X_EINZELMODUL E \n' +
            ' INNER JOIN IDMA_BESTANDS_OPDB_DATA.PRD_EM EM ON EM.EM_MATNO=E.EM_MATNO' +
            ' WHERE E.STOCK_ID=:StockId \n' +
            ' ORDER BY E.EM_MATNO', {
                StockId: StockId
            }, {
                outFormat: oracledb.OBJECT
            },
            function (err, results) {
                if (err) throw err;
                printResult(results);
                resolve(results.rows);
            }
        );
    });
}

function getPARListByStockId(StockId, connection) {
    return new Promise(resolve => {
        connection.execute(
            'SELECT \'PAR\' AS TBL, P.*, PAR.*  \n' +
            ' FROM IDMA_BESTANDS_OPDB_DATA.X_PARAMETER P  \n' +
            ' INNER JOIN IDMA_BESTANDS_OPDB_DATA.PRD_PARAM PAR ON PAR.PARAM_ID=P.PARAM_ID  \n' +
            ' WHERE P.STOCK_ID=:StockId \n' +
            ' ORDER BY P.PARAM_ID', {
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
            ' WHERE R.STOCK_ID=:StockId\n' +
            ' ORDER BY R.RN_UNSTRUCT', {
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

function getXAIListByStockId(StockId, connection) {
    return new Promise(resolve => {
        connection.execute(
            'SELECT \'X_AUFTRAG\' AS TBL, XA.*  \n' +
            ' FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B     \n' +
            ' JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA on B.SO_ID = XA.SO_ID     \n' +
            ' WHERE B.STOCK_ID=:StockId', {
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

function getXAEListByStockId(StockId, connection) {
    return new Promise(resolve => {
        connection.execute(
            'SELECT \'X_AUFTRAG_EXT\' AS TBL, XAE.*  \n' +
            ' FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B     \n' +
            ' JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA on B.SO_ID = XA.SO_ID     \n' +
            ' JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG_EXT XAE on XAE.EO_ID= XA.EO_ID \n ' +
            ' WHERE B.STOCK_ID=:StockId', {
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

function getMSGListByStockId(StockId, connection) {
    return new Promise(resolve => {
        connection.execute(
            'SELECT \'X_MESSAGES\' AS TBL, XM.*  \n' +
            ' FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B     \n' +
            ' JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA on B.SO_ID = XA.SO_ID     \n' +
            ' JOIN IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM ON XA.EO_ID=XM.EO_ID \n ' +
            ' WHERE B.STOCK_ID=:StockId', {
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

function getERRListByStockId(StockId, connection) {
    return new Promise(resolve => {
        connection.execute(
            'SELECT \'X_ERROR\' AS TBL, XE.*  \n' +
            ' FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B     \n' +
            ' JOIN IDMA_AUFTRAGS_OPDB_DATA.X_AUFTRAG XA on B.SO_ID = XA.SO_ID     \n' +
            ' JOIN IDMA_AUFTRAGS_OPDB_DATA.X_ERROR XE ON XA.EO_ID=XE.EO_ID \n ' +
            ' WHERE B.STOCK_ID=:StockId', {
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