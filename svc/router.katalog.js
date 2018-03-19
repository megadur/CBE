var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');
var Archiver = require('archiver');

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}

// We specify a param in our path for the GET of a specific object
router.get('/', lookupKat, function (req, res) {
    res.json(req.fbs);
});

function lookupKat(req, res, next) {
    console.log('lookupKat:', req.query);
    let guid = req.query.GUID;
    return new Promise(async function (resolve, reject) {
        let conn; // Declared here for scoping purposes.

        try {
            conn = await oracledb.getConnection();

            console.log('Connected to database');
            let sSQL = 'SELECT GUID, TO_NR, KDNR, KDNR_NEW, KDNR_OLD, SYSTEL, STATUS, ACCOUNT_TYPE_ID, TS_BESTELLT, TS_LAST_UPDATE, TS_DEAKTIVIERT, SO_AKTIVIERT, SO_INAKTIV, SO_DEAKTIVIERT, TS_INAKTIV, TS_AKTIVIERT, TS_STORNIERT, LAST_UPD, PRIVACY, PRIVACY_NEW, PRIVACY_OLD';
            sSQL = sSQL+ ' FROM IDMA_BESTANDS_OPDB_DATA.X_ACCOUNT ';
            sSQL = sSQL+ ' where GUID = :guid';
            let result = await conn.execute(
                sSQL, [guid], {
                    outFormat: oracledb.OBJECT
                }
            );

            console.log('Query executed');

            resolve(result.rows[0]);
        } catch (err) {
            console.log('Error occurred', err);

            reject(err);
        } finally {
            // If conn assignment worked, need to close.
            if (conn) {
                try {
                    await conn.close();

                    console.log('Connection closed');
                } catch (err) {
                    console.log('Error closing connection', err);
                }
            }
        }
    });
}

function lookupKatalog(req, res, next) {
    console.log('lookupKatalog:', req.query);
    return new Promise(function (resolve, reject) {
        oracledb.getConnection(connAttrs,
            function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
                /*            
                            var r = getPrdEmList_ByEoId(connection, req)
                                .then(function (result) {
                                    console.log("Initialized user details");
                                    // Use user details from here
                                    console.log(result)
                                    res.send(JSON.stringify(result));
                                }, function (err) {
                                    console.log(err);
                                })
                                */
                /*
                            var r = await getPrdEmList_ByEoId(connection, req, function (x) {
                                // console.log('getMsg_ById() ret ', x);
                                res.send(JSON.stringify(x));
                                return;
                            });
                            */
            })
    })
}
// router.get('/', lookupKatalog(req, res, next));
function getPrdEmList_ByEoId(connection, req) {
    return new Promise(function (resolve, reject) {
        var data = [];
        var sSQL = '';
        sSQL = sSQL + '\n SELECT ';
        sSQL = sSQL + '\n \'KATALOG\' AS TBL';
        sSQL = sSQL + '\n, EM.*';
        sSQL = sSQL + '\n FROM IDMA_BESTANDS_OPDB_DATA.PRD_EM EM';
        sSQL = sSQL + '\n WHERE 1=1';
        // sSQL = sSQL + '\n AND (EM.EM_MATNO=:EM_MATNO OR :EM_MATNO IS NULL)' ;
        if (req.query.EM_MATNO) {
            sSQL = sSQL + ' AND EM.EM_MATNO LIKE ? ';
            data.push('%' + req.query.EM_MATNO + '%');
        }
        // sSQL = sSQL + '\n AND (EM.CAPTION LIKE :CAPTION OR :CAPTION IS NULL)'; 
        if (req.query.CAPTION) {
            sSQL = sSQL + ' AND EM.CAPTION LIKE ? ';
            data.push('\'%' + req.query.CAPTION + '%\'');
        }
        // sSQL = sSQL + '\n AND (rownum<=:MAX_ROWS OR :MAX_ROWS IS NULL)' ;
        if (req.query.MAX_ROWS) {
            sSQL = sSQL + ' AND rownum<= ';
            data.push('%' + req.query.MAX_ROWS + '%');
        }
        // sSQL = sSQL + '\n AND (EM.EM_MATNO>=:MAX_VAL OR :MAX_VAL IS NULL)'; 
        if (req.query.MAX_VAL) {
            sSQL = sSQL + ' AND EM.EM_MATNO>= ';
            data.push('%' + req.query.MAX_VAL + '%');
        }
        sSQL = sSQL + '\n AND rownum <= 10';
        sSQL = sSQL + '\n ORDER BY EM.EM_MATNO';

        // sSQL = sSQL + ' LIMIT 1'
        console.log('lookup sSQL=' + sSQL);
        console.log('lookup data=' + data);

        connection.execute(
            sSQL, data, {
                outFormat: oracledb.OBJECT
            },
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            }
        );
    });
}

function xlookupKatalog(req, res, next) {
    /*var data = [
        req.params.EO_ID,
        req.params.CODE_INT,
        req.params.STATUS,
        req.params.SYS
    ];*/
    var data = [];
    var sSQL = '';
    sSQL = sSQL + '\n SELECT ';
    sSQL = sSQL + '\n \'KATALOG\' AS TBL';
    sSQL = sSQL + '\n, EM.*';
    sSQL = sSQL + '\n FROM IDMA_BESTANDS_OPDB_DATA.PRD_EM EM';
    sSQL = sSQL + '\n WHERE 1=1';
    // sSQL = sSQL + '\n AND (EM.EM_MATNO=:EM_MATNO OR :EM_MATNO IS NULL)' ;
    if (req.query.EM_MATNO) {
        sSQL = sSQL + ' AND EM.EM_MATNO LIKE ? ';
        data.push('%' + req.query.EM_MATNO + '%');
    }
    /*
        // sSQL = sSQL + '\n AND (EM.CAPTION LIKE :CAPTION OR :CAPTION IS NULL)'; 
        if (req.query.CAPTION) {
            sSQL = sSQL + ' AND EM.CAPTION LIKE ? ';
            data.push('\'%' + req.query.CAPTION + '%\'');
        }*/
    // sSQL = sSQL + '\n AND (rownum<=:MAX_ROWS OR :MAX_ROWS IS NULL)' ;
    if (req.query.MAX_ROWS) {
        sSQL = sSQL + ' AND rownum<= ';
        data.push('%' + req.query.MAX_ROWS + '%');
    }
    // sSQL = sSQL + '\n AND (EM.EM_MATNO>=:MAX_VAL OR :MAX_VAL IS NULL)'; 
    if (req.query.MAX_VAL) {
        sSQL = sSQL + ' AND EM.EM_MATNO>= ';
        data.push('%' + req.query.MAX_VAL + '%');
    }
    sSQL = sSQL + '\n AND rownum <= 10';
    sSQL = sSQL + '\n ORDER BY EM.EM_MATNO';

    // sSQL = sSQL + ' LIMIT 1'
    console.log('lookup sSQL=' + sSQL);
    console.log('lookup data=' + data);
    // Build an SQL query to select the resource object by ID
    // var sql = 'SELECT * FROM fehlerbild LIMIT 10';
    db.all(sSQL, data, function (err, rows) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve katalog']
            });
        }
        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['katalog not found']
            });
        }
        // By attaching a property to the request
        // Its data is now made available in our handler function
        req.fbs = rows;
        console.log('lookup ' + req.fbs);
        next();
    });
}

router.get('/:ID', function (req, res) {
    var EM_MATNO = req.params.EM_MATNO;
    console.log('katalog.router.get/ID:', EM_MATNO);
    var r = getEm_ByEmMatno(connAttrs, EM_MATNO, function (x) {
        // console.log('getPrdEm_ById() ret ', x);
        res.set('Content-Type', 'text/xml');
        res.send(x);
        return;
    });
})

function getEm_ByEmMatno(connAttrs, aEM_MATNO, callback) {
    console.log('getEm_ByEmMatno: ', aEM_MATNO);

    oracledb.getConnection(connAttrs,
        function (err, connection) {
            if (err) throw err;

            var sSQL = 'SELECT \'PRD_EM\' AS TBL';
            sSQL = sSQL + '\n EM.*';
            sSQL = sSQL + '\n FROM IDMA_BESTANDS_OPDB_DATA.PRD_EM EM';
            sSQL = sSQL + '\n WHERE EM.EM_MATNO = :EM_MATNO';
            // '';
            '';
            console.log('getEm_ByEmMatno sSQL:\n ', sSQL);

            connection.execute(sSQL, {
                    EM_MATNO: aEM_MATNO
                }, {
                    outFormat: oracledb.OBJECT
                },
                async function (err, results) {
                    if (err) {
                        console.log('err: ', err);
                        throw err;
                    }


                    //console.log('callback: ', xbestandList);

                    callback(xbestandList);

                }
            );
        }
    );
}


function getEmRuleListById(Id, connection) {
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


function releaseConn(connection) {
    // Release the connection
    connection.release(
        function (err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Connection released ");
            }
        });

}



function xgetPrdEmLen_ByPrdEmId(PrdEmId, connection) {
    console.log(' getPrdEmLen_ByPrdEmId: ', PrdEmId);
    var sSQL = '' +
        'SELECT \'X_MESSAGES\' AS TBL ' +
        '\r\n , XM.EO_ID, XM.SERVICE, dbms_lob.getlength(XM.MESSAGE) AS Len' +
        '\r\n FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM' +
        '\r\n WHERE XM.ID=:PrdEmId' +
        '';
    console.log('getMSG_ById sSQL:\n ', sSQL);

    connection.execute(sSQL, {
            PrdEmId: PrdEmId
        }, {
            outFormat: oracledb.OBJECT
        },
        async function (err, results) {
            if (err) {
                console.log('err: ', err);
                throw err;
            }

            //console.log('callback: ', xbestandList);

            var r = results.rows[0].LEN;
            console.log('getPrdEmLen_ByPrdEmId callback: ', r);
            return r;

        }
    );
}


/**/
module.exports = router;