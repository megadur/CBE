var express = require('express');
var router = express.Router();

// GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a bestand list resource');
});
router.get('/:id', function(req, res) {
    res.send('respond with a bestand resource + '+req.params.id);
  });
module.exports = router;