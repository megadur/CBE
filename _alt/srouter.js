var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/test.db');
var bodyParser = require('body-parser');
app.use(bodyParser.json({
    type: 'application/json'
}))

// Create the express router object for Photos
var photoRouter = express.Router();
// A GET to the root of a resource returns a list of that resource
photoRouter.get('/', function (req, res) {});
// A POST to the root of a resource should create a new object
photoRouter.post('/', function (req, res) {
    var sql = 'INSERT INTO photo (description, filepath, album_id) VALUES (?, ?, ?)';
    // Retrieve the data to insert from the POST body
    var data = [
        req.body.description,
        req.body.filepath,
        req.body.album_id
    ];
    db.run(sql, data, function (err, result) {
        if (err) {
            // We shield our clients from internal errors, but log them
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Failed to create photo']
            });
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.redirect("/photo/"  + this.lastID)
    });
});
// We specify a param in our path for the GET of a specific object
photoRouter.get('/:id', lookupPhoto, function (req, res) {
    res.json(req.photo);
});
// Similar to the GET on an object, to update it we can PATCH
photoRouter.patch('/:id', lookupPhoto, function (req, res) {});
// Delete a specific object
photoRouter.delete('/:id', lookupPhoto, function (req, res) {});
// Attach the routers for their respective paths
app.use('/photo', photoRouter);

function lookupPhoto(req, res, next) {
    // We access the ID param on the request object
    var photoId = req.params.id;
    console.log('lookupPhoto rowid ' +photoId);
    // Build an SQL query to select the resource object by ID
    var sql = 'SELECT * FROM photo WHERE id = ?';
    //    postgres.client.query(sql, [ photoId ], function(err, results) {
    db.get(sql, [photoId], function (err, rows) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve photo']
            });
        }
        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['Photo not found']
            });
        }
        // By attaching a Photo property to the request
        // Its data is now made available in our handler function
        req.photo = rows[0];
        console.log('lookupPhoto rowid ' +req.photo.id);
        next();
    });
}

module.exports = photoRouter;