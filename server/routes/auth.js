var express = require('express');
var router = express.Router();

/* GET auth credentials */
router.post('/login', function(req, res, next) {

    const data = {
        user: 'ikram',
        token: '78393202-32'
    }
    res.send(data);
});

module.exports = router;
