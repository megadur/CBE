var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var express = require('express')

const path = require('path')
const dbPath = path.resolve(__dirname, '../data/cbe.db')
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('sqlite3.Database:' + dbPath);
        console.error(err.message);
    } else {
        console.log('Connected to the database: ' + dbPath);
    }
});
// Create the express router object for Photos
var fehlerbildRouter = express.Router();

// A GET to the root of a resource returns a list of that resource
fehlerbildRouter.get('/', lookupFB, function (req, res) {
    res.json(req.fbs);
});

// A POST to the root of a resource should create a new object
fehlerbildRouter.post('/', insertFB_ByPar, function (req, res) {
    res.json(req.fb);
});
// We specify a param in our path for the GET of a specific object
fehlerbildRouter.get('/:id', lookupFB_ByID, function (req, res) {
    res.json(req.fb);
});

// Similar to the GET on an object, to update it we can PATCH
fehlerbildRouter.patch('/:id', lookupFB_ByID, function (req, res) {});

// Delete a specific object
fehlerbildRouter.delete('/:id', deleteFB_ByID, function (req, res) {
    res.json(req.fb);
});

function insertFB_ByPar(req, res, next) {
    var sSql = 'INSERT INTO FEHLERBILD('
    sSql = sSql + 'BILDNUMMER, FLT_SO_TYPE_ID, FLT_STATUS, FLT_SPECIAL_ORDER_FLAG_ID, FLT_INC_TEXT_SHORT, FLT_INC_TEXT_LONG, FLT_CODE_INT, FLT_TEXT_INT, FLT_CODE_EXT, FLT_TEXT_EXT, FLT_SYS, FLT_TASK, FLT_HANDLING ';
    sSql = sSql + ', STATUS, PRIO, SYMPTOM, LOESUNG, AUSLOESER, BESCHREIBUNG, ERSTELLT_TS, GEAENDERT_TS ';
    sSql = sSql + ') VALUES(';
    sSql = sSql + '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?'
    sSql = sSql + ');';
    // Retrieve the data to insert from the POST body
    var data = [
        req.body.BILDNUMMER, req.body.FLT_SO_TYPE_ID, req.body.FLT_STATUS, req.body.FLT_SPECIAL_ORDER_FLAG_ID, req.body.FLT_INC_TEXT_SHORT, req.body.FLT_INC_TEXT_LONG, req.body.FLT_CODE_INT, req.body.FLT_TEXT_INT, req.body.FLT_CODE_EXT, req.body.FLT_TEXT_EXT, req.body.FLT_SYS, req.body.FLT_TASK, req.body.FLT_HANDLING, req.body.STATUS, req.body.PRIO, req.body.SYMPTOM, req.body.LOESUNG, req.body.AUSLOESER, req.body.BESCHREIBUNG, req.body.ERSTELLT_TS, req.body.GEAENDERT_TS
    ];
    console.error(sSql);
    db.run(sSql, data, function (err, result) {
        if (err) {
            // We shield our clients from internal errors, but log them
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Failed to create fehlerbild']
            });
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.redirect("/fb/" + this.lastID)
    });
}

function lookupFB(req, res, next) {
    /*var data = [
        req.params.EO_ID,
        req.params.CODE_INT,
        req.params.STATUS,
        req.params.SYS
    ];*/
    var data = [];
    //data.push('req.query.FLT_EO_ID');
    //console.log('req.query.FLT_EO_ID=' + req.query.FLT_EO_ID);
    sSQL = ' SELECT * FROM fehlerbild '
    sSQL = sSQL + ' WHERE 1=1 '
    /*
    if (req.query.BILDNUMMER) {sSQL = sSQL + ' AND BILDNUMMER LIKE ? ';data.push('%' + req.query.BILDNUMMER + '%');}
    if (req.query.FLT_SO_TYPE_ID) { sSQL = sSQL + ' AND FLT_SO_TYPE_ID LIKE ? '; data.push('%' + req.query.FLT_SO_TYPE_ID + '%');}
    if (req.query.FLT_STATUS) {sSQL = sSQL + ' AND FLT_STATUS LIKE ? ';data.push('%' + req.query.FLT_STATUS + '%');}
*/
    if (req.query.ID) { sSQL = sSQL + ' AND ID? '; data.push('%' + req.queryID + '%');}
    if (req.query.BILDNUMMER) { sSQL = sSQL + ' AND BILDNUMMERLIKE ? '; data.push('%' + req.query.BILDNUMMER + '%');}
    if (req.query.FLT_SO_TYPE_ID) { sSQL = sSQL + ' AND FLT_SO_TYPE_ID LIKE ?  '; data.push('%' + req.query.FLT_SO_TYPE_ID + '%');}
    if (req.query.FLT_STATUS) { sSQL = sSQL + ' AND FLT_STATUS LIKE ?  '; data.push('%' + req.query.FLT_STATUS + '%');}
    if (req.query.FLT_SPECIAL_ORDER_FLAG_ID) { sSQL = sSQL + ' AND FLT_SPECIAL_ORDER_FLAG_ID LIKE ?  '; data.push('%' + req.query.FLT_SPECIAL_ORDER_FLAG_ID + '%');}
    if (req.query.FLT_INC_TEXT_SHORT) { sSQL = sSQL + ' AND FLT_INC_TEXT_SHORT LIKE ?  '; data.push('%' + req.query.FLT_INC_TEXT_SHORT + '%');}
    if (req.query.FLT_INC_TEXT_LONG) { sSQL = sSQL + ' AND FLT_INC_TEXT_LONG LIKE ?  '; data.push('%' + req.query.FLT_INC_TEXT_LONG + '%');}
    if (req.query.FLT_CODE_INT) { sSQL = sSQL + ' AND FLT_CODE_INT LIKE ?  '; data.push('%' + req.query.FLT_CODE_INT + '%');}
    if (req.query.FLT_TEXT_INT) { sSQL = sSQL + ' AND FLT_TEXT_INT LIKE ?  '; data.push('%' + req.query.FLT_TEXT_INT + '%');}
    if (req.query.FLT_CODE_EXT) { sSQL = sSQL + ' AND FLT_CODE_EXT LIKE ?  '; data.push('%' + req.query.FLT_CODE_EXT + '%');}
    if (req.query.FLT_TEXT_EXT) { sSQL = sSQL + ' AND FLT_TEXT_EXT LIKE ?  '; data.push('%' + req.query.FLT_TEXT_EXT + '%');}
    if (req.query.FLT_SYS) { sSQL = sSQL + ' AND FLT_SYS LIKE ?  '; data.push('%' + req.query.FLT_SYS + '%');}
    if (req.query.FLT_TASK) { sSQL = sSQL + ' AND FLT_TASK LIKE ?  '; data.push('%' + req.query.FLT_TASK + '%');}
    if (req.query.FLT_HANDLING) { sSQL = sSQL + ' AND FLT_HANDLING LIKE ?  '; data.push('%' + req.query.FLT_HANDLING + '%');}
    if (req.query.STATUS) { sSQL = sSQL + ' AND STATUS LIKE ?  '; data.push('%' + req.query.STATUS + '%');}
    if (req.query.PRIO) { sSQL = sSQL + ' AND PRIO LIKE ?  '; data.push('%' + req.query.PRIO + '%');}
    if (req.query.SYMPTOM) { sSQL = sSQL + ' AND SYMPTOM LIKE ?  '; data.push('%' + req.query.SYMPTOM + '%');}
    if (req.query.LOESUNG) { sSQL = sSQL + ' AND LOESUNG LIKE ?  '; data.push('%' + req.query.LOESUNG + '%');}
    if (req.query.AUSLOESER) { sSQL = sSQL + ' AND AUSLOESER LIKE ?  '; data.push('%' + req.query.AUSLOESER + '%');}
    if (req.query.BESCHREIBUNG) { sSQL = sSQL + ' AND BESCHREIBUNG LIKE ?  '; data.push('%' + req.query.BESCHREIBUNG + '%');}
    if (req.query.ERSTELLT_TS) { sSQL = sSQL + ' AND ERSTELLT_TS LIKE ?  '; data.push('%' + req.query.ERSTELLT_TS + '%');}
    if (req.query.GEAENDERT_TS) { sSQL = sSQL + ' AND GEAENDERT_TS LIKE ?  '; data.push('%' + req.query.GEAENDERT_TS + '%');}
        // sSQL = sSQL + ' LIMIT 1'
    console.log('lookupFB sSQL=' + sSQL);
    console.log('lookupFB data=' + data);
    // Build an SQL query to select the resource object by ID
    // var sql = 'SELECT * FROM fehlerbild LIMIT 10';
    db.all(sSQL, data, function (err, rows) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve fehlerbild']
            });
        }
        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['fehlerbild not found']
            });
        }
        // By attaching a property to the request
        // Its data is now made available in our handler function
        req.fbs = rows;
        console.log('lookupFB ' + req.fb);
        next();
    });
}


function lookupFB_ByID(req, res, next) {
    // We access the ID param on the request object
    var id = req.params.id;
    console.log('lookupFB_ByID ' + id);
    // Build an SQL query to select the resource object by ID
    var sql = 'SELECT * FROM fehlerbild WHERE id = ?';
    db.all(sql, id, function (err, rows) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve fehlerbild']
            });
        }
        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['fehlerbild not found']
            });
        }

        // By attaching a property to the request
        // Its data is now made available in our handler function
        req.fb = rows[0];
        console.log('lookupFB_ByID rowid ' + req.fb.id);
        next();
    });
}

function deleteFB_ByID(req, res, next) {
    // We access the ID param on the request object
    var id = req.params.id;
    console.log('deleteFB_ByID ' + id);
    // Build an SQL query to select the resource object by ID
    var sql = 'DELETE FROM fehlerbild WHERE id = ?';
    db.run(sql, id, function (err, rows) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not delete fehlerbild']
            });
        }

        // By attaching a property to the request
        // Its data is now made available in our handler function
        console.log('OK deleteFB_ByID rowid ' + id);
        next();
    });
}

module.exports = fehlerbildRouter;
