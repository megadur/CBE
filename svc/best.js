var oracledb = require('oracledb');
var async = require('async');
var dateFormat = 'DD-MON-YYYY';
 
function getDepartment(connAttrs, departmentId, callback) {
    oracledb.getConnection(connAttrs,
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
 
module.exports.getDepartment = getDepartment;