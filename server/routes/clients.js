var express = require('express');
var router = express.Router();

/* GET auth credentials */
router.post('/create', function(req, res, next) {

    console.log(req.body);
    res.send({'test': 'test'});
});

module.exports = router;