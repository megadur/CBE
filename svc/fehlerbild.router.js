var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var express = require('express')

const path = require('path')
const dbPath = path.resolve(__dirname, '../data/fb.db')
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('sqlite3.Database:' + dbPath);
        console.error(err.message);
    } else {
        console.log('Connected to the database: ' + dbPath);
    }
});
// Create the express router object for Photos
var fbRouter = express.Router();

// A GET to the root of a resource returns a list of that resource
fbRouter.get('/', lookupFB, function (req, res) {
    res.json(req.fbs);
});

// A POST to the root of a resource should create a new object
fbRouter.post('/', insertFB_ByPar, function (req, res) {
    res.json(req.fb);
});
// We specify a param in our path for the GET of a specific object
fbRouter.get('/:id', lookupFB_ByID, function (req, res) {
    res.json(req.fb);
});
// Similar to the GET on an object, to update it we can PATCH
fbRouter.patch('/:id', lookupFB_ByID, function (req, res) {});
// Delete a specific object
fbRouter.delete('/:id', lookupFB_ByID, function (req, res) {});


function insertFB_ByPar(req, res, next) {
    //var sql = 'INSERT INTO fehlerbild (FLT_BILDNUMMER, FLT_CODE_INT, FLT_TEXT_EXT) VALUES (?, ?, ?)';
    var sSql = 'INSERT INTO Fehlerbild ('
    sSql = sSql + 'FLT_BILDNUMMER, FLT_SO_TYPE_ID, FLT_STATUS, FLT_SPECIAL_ORDER_FLAG_ID, FLT_INC_TEXT_SHORT, FLT_INC_TEXT_LONG, FLT_CODE_INT, FLT_TEXT_INT, FLT_CODE_EXT, FLT_TEXT_EXT, FLT_SYS, FLT_TASK, FLT_HANDLING, ';
    sSql = sSql + 'KATEGORIE, STATUS, SYSTEM, BEDINGUNG, URSACHE, ERSTELLT_TS, ERSTELLT_NAME, GEAENDERT_TS, GEAENDERT_NAME, GUELTIG_VON_TS, GUELTIG_BIS_TS';
    sSql = sSql + ') VALUES(';
    sSql = sSql + '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?'
    sSql = sSql +  ');';
    // Retrieve the data to insert from the POST body
    var data = [
        req.body.FLT_BILDNUMMER, 
        req.body.FLT_SO_TYPE_ID, 
        req.body.FLT_STATUS, 
        req.body.FLT_SPECIAL_ORDER_FLAG_ID, 
        req.body.FLT_INC_TEXT_SHORT, 
        req.body.FLT_INC_TEXT_LONG, 
        req.body.FLT_CODE_INT, 
        req.body.FLT_TEXT_INT, 
        req.body.FLT_CODE_EXT, 
        req.body.FLT_TEXT_EXT, 
        req.body.FLT_SYS, 
        req.body.FLT_TASK, 
        req.body.FLT_HANDLING, 
        req.body.KATEGORIE, 
        req.body.STATUS, 
        req.body.SYSTEM, 
        req.body.BEDINGUNG, 
        req.body.URSACHE, 
        req.body.ERSTELLT_TS, 
        req.body.ERSTELLT_NAME, 
        req.body.GEAENDERT_TS, 
        req.body.GEAENDERT_NAME, 
        req.body.GUELTIG_VON_TS, 
        req.body.GUELTIG_BIS_TS
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
    if (req.query.FLT_BILDNUMMER) {sSQL = sSQL + ' AND FLT_BILDNUMMER LIKE ? '; data.push( '%' +req.query.FLT_BILDNUMMER + '%');}
    if (req.query.FLT_SO_TYPE_ID) {sSQL = sSQL + ' AND FLT_SO_TYPE_ID LIKE ? '; data.push( '%' +req.query.FLT_SO_TYPE_ID + '%');}
    if (req.query.FLT_STATUS) {sSQL = sSQL + ' AND FLT_STATUS LIKE ? '; data.push( '%' +req.query.FLT_STATUS + '%');}
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

module.exports = fbRouter;