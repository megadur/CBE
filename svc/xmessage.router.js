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

router.get('/', function (req, res) {
    var msgid = req.query.MSG_ID;
    var eoid = req.query.EO_ID;
    console.log('xmessage.router.get/MSG:', msgid, eoid);
    if (msgid) {
        var r = getMsg_ById(connAttrs, msgid, function (x) {
            // console.log('getMsg_ById() ret ', x);
            res.set('Content-Type', 'text/xml');
            res.send(x);
            return;

        });

    }
    if (eoid) {
        var r = getMsgs_ByEoId(connAttrs, eoid, function (msgList) {
            var zip = Archiver('zip');
            // Tell the browser that this is a zip file.
            res.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-disposition': 'attachment; filename='+eoid+'.zip'
            });
            // Send the file to the page output.
            zip.pipe(res);
            var i = 0;
            for (i in msgList) {
                var r = msgList[i];
                zip.append(r.MSG, {
                    name: r.ID + '_' + r.SERVICE + '.xml'
                })
            }
            zip.finalize();
            /*
            // Create zip with some files. Two dynamic, one static. Put #2 in a sub folder.
            zip.append('Some text to go in file 1.', {
                    name: '1.txt'
                })
                .append('Some text to go in file 2. I go in a folder!', {
                    name: 'somefolder/2.txt'
                })
                .file('staticFiles/3.txt', {
                    name: '3.txt'
                })
                .finalize();
                */
            // console.log('getMsg_ById() ret ', x);
            //res.set('Content-Type', 'text/xml');
            //res.send(x);
            return;

        });

    }
})

function getMsgs_ByEoId(connAttrs, EO_ID, callback) {
    console.log('getMsgs_ByEoId: ', EO_ID);
    /**/
    oracledb.getConnection(connAttrs,
        async function (err, connection) {
            if (err) throw err;
            let xmlist = await getMsgIdList_ByEoId(connection, EO_ID);
            var i = 0;
            let msgList = [];
            for (i in xmlist) {
                var r = xmlist[i];
                let msg = await getMsg_ById(r.ID, connection);
                // console.log('getMsg_ById: ', r.ID, msg.length);
                msgList[i] = {
                    MSG: msg,
                    ID: r.ID,
                    SERVICE: r.SERVICE
                };

            }

            callback(msgList);

        }
    );

}

async function getMsgIdList_ByEoId(connection, eoid) {
    return new Promise(resolve => {
        var sSQL = '' +
            'SELECT \'X_MESSAGES\' AS TBL' +
            '\n, XM.ID, XM.EO_ID , XM.SERVICE  ' +
            '\n FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM  ' +
            '\n WHERE XM.EO_ID=:EoId'
        '';
        console.log('getMsgIdList_ByEoId sSQL:\n ', sSQL);

        connection.execute(
            sSQL, {
                EoId: eoid
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
router.get('/:ID', function (req, res) {
    var MSG_ID = req.params.ID;
    console.log('xmessage.router.get/MSG/ID:', MSG_ID);
    var r = getMsg_ById(connAttrs, MSG_ID, function (x) {
        // console.log('getMsg_ById() ret ', x);
        res.set('Content-Type', 'text/xml');
        res.send(x);
        return;
    });
})

function getMsg_ByMsgId(connAttrs, MSG_ID, callback) {
    console.log('getMsg_ByMsgId: ', MSG_ID);

    oracledb.getConnection(connAttrs,
        async function (err, connection) {
            if (err) throw err;

            let len = await getMsgLen_ById(MSG_ID, connection);
            // console.log('getMessageLen_ById: return ', len);
            const nSize = 2000;
            let s = '',
                ss = '';
            let nChunk = Math.floor(len / nSize);
            // nChunk = 55000 % 4000;
            for (let n = 0; n < nChunk + 1; n++) {
                // console.log('getMsgChunk_ById: ', MSG_ID, n, nSize, (len - n * nSize) % nSize);
                ss = await getMsgChunk_ById(MSG_ID, nSize, n * nSize + 1, connection);
                s = s + ss
                // console.log('getMsgChunk_ById s= ', ss.length, s.length);
            }
            callback(s);

        }
    );
}

async function getMsg_ById(MsgId, connection) {

    let len = await getMsgLen_ById(MsgId, connection);
    // console.log('getMessageLen_ById: return ', len);
    const nSize = 2000;
    let s = '',
        ss = '';
    let nChunk = Math.floor(len / nSize);
    // nChunk = 55000 % 4000;
    for (let n = 0; n < nChunk + 1; n++) {
        // console.log('getMsgChunk_ById: ', MSG_ID, n, nSize, (len - n * nSize) % nSize);
        ss = await getMsgChunk_ById(MsgId, nSize, n * nSize + 1, connection);
        s = s + ss
        // console.log('getMsgChunk_ById s= ', ss.length, s.length);
    }
    return (s);

}

function getMsgLen_ById(MsgId, connection) {
    return new Promise(resolve => {
        // console.log(' getMsgLen: ', MsgId);
        var sSQL = '' +
            'SELECT \'X_MESSAGES\' AS TBL ' +
            '\r\n , XM.EO_ID, XM.SERVICE, dbms_lob.getlength(XM.MESSAGE) AS LEN' +
            '\r\n FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM' +
            '\r\n WHERE XM.ID=:MsgId' +
            '';
        // console.log('getMSG_ById sSQL:\n ', sSQL);

        connection.execute(
            sSQL, {
                MsgId: MsgId
            }, {
                outFormat: oracledb.OBJECT
            },
            async function (err, results) {
                if (err) reject(err);

                var l = 0
                if (results.rows.length > 0)
                    l = results.rows[0].LEN
                resolve(l);

            }
        );
    });
}

function getMsgChunk_ById(MsgId, nLen, nOff, connection) {
    // console.log('getMsgChunk_ById: ', MsgId);

    return new Promise(resolve => {
        var sSQL = '' +
            'SELECT \'X_MESSAGES\' AS TBL ' +
            '\r\n , dbms_lob.substr(XM.MESSAGE, ' + nLen + ', ' + nOff + ') AS MSG' +
            '\r\n FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM' +
            '\r\n WHERE XM.ID=:MsgId' +
            '';
        //        console.log('getMsgChunk_ById sSQL:\n ', sSQL);

        connection.execute(
            sSQL, {
                MsgId: MsgId
            }, {
                outFormat: oracledb.OBJECT
            },
            function (err, results) {
                if (err) throw err;
                //if (err) reject(err);
                //printResult(results);
                let msg = results.rows[0].MSG
                resolve(msg);
            }
        );
    });
}


router.get('/:ID/LEN', function (req, res) {
    var MSG_ID = req.params.ID;
    console.log('xmessage.router.get/:ID/LEN:', MSG_ID);
    var r = getMessageLen_ById(connAttrs, MSG_ID, function (x) {
        console.log('call getMessageLen_ById() returns ', x);
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(x));
        return;
    });
})

function xgetMessageLen_ById(connAttrs, MSG_ID, callback) {
    console.log('getMessageLen_ById: ', MSG_ID);

    oracledb.getConnection(connAttrs,
        async function (err, connection) {

            if (err) throw err;

            let len = await getMsgLen(MSG_ID, connection);
            console.log('getMessageLen_ById: return ', len);
            callback(len);
            // releaseConn(connection);
        }
    );
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



function xgetMsgLen_ByMsgId(MsgId, connection) {
    console.log(' getMsgLen_ByMsgId: ', MsgId);
    var sSQL = '' +
        'SELECT \'X_MESSAGES\' AS TBL ' +
        '\r\n , XM.EO_ID, XM.SERVICE, dbms_lob.getlength(XM.MESSAGE) AS Len' +
        '\r\n FROM IDMA_AUFTRAGS_DISPDB_DATA.X_MESSAGES XM' +
        '\r\n WHERE XM.ID=:MsgId' +
        '';
    console.log('getMSG_ById sSQL:\n ', sSQL);

    connection.execute(sSQL, {
            MsgId: MsgId
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
            console.log('getMsgLen_ByMsgId callback: ', r);
            return r;

        }
    );
}


/**/
module.exports = router;