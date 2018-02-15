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
fbRouter.post('/', insertFB_ByPar, function (req, res) {});
// We specify a param in our path for the GET of a specific object
fbRouter.get('/:id', lookupFB_ByID, function (req, res) {
    res.json(req.fb);
});
// Similar to the GET on an object, to update it we can PATCH
fbRouter.patch('/:id', lookupFB_ByID, function (req, res) {});
// Delete a specific object
fbRouter.delete('/:id', lookupFB_ByID, function (req, res) {});


function insertFB_ByPar(req, res, next) {
    var sql = 'INSERT INTO fehlerbild (BILDNUMMER, CODE_INT, TEXT_EXT) VALUES (?, ?, ?)';
    // Retrieve the data to insert from the POST body
    var data = [
        req.body.BILDNUMMER,
        req.body.CODE_INT,
        req.body.TEXT_EXT
    ];
    db.run(sql, data, function (err, result) {
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