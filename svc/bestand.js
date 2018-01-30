var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var mrouter = require("../mrouter");

var connAttrs = {
    "user": "IDMA_SELECT",
    "password": "HappyNewYear2017",
    "connectString": "10.171.128.46:51521/IDMET3AB.tsystems.com"
}

// GET users listing. */
/*
router.get('/', function (req, res) {
    res.send('respond with a account list resource');
});
router.get('/:id', function (req, res) {
    res.send('respond with a account resource + ' + req.params.id);
});
*/



var thisArg = {
    router: router,
    oracledb: oracledb,
    connAttrs: connAttrs
};
mrouter(thisArg, "/", "SELECT 'BESTAND' AS TBL, B.* FROM IDMA_BESTANDS_OPDB_DATA.X_BESTAND B WHERE  rownum <= 1");


function getBestand(departmentId, callback) {
    oracledb.getConnection({
            user: 'hr',
            password: 'welcome',
            connectString: 'server/XE'
        },
        function(err, connection) {
            if (err) throw err;
 
            connection.execute(
                'select department_id, \n' +
                '   department_name, \n' +
                '   manager_id, \n' +
                '   location_id \n' +
                'from departments \n' +
                'where department_id = :department_id',
                {
                    department_id: departmentId
                },
                function(err, results) {
                    var department = {};
 
                    if (err) {
                        throw err;
                    }
 
                    department.id = results.rows[0][0];
                    department.name = results.rows[0][1];
                    department.managerId = results.rows[0][2];
 
                    getLocationDetails(results.rows[0][3], department, connection, callback);
                }
            );
        }
    );
}
 
/*
module.exports.getBestand = getBestand;
*/
module.exports = router;
