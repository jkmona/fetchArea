var express = require( 'express');
var areas = require('../controllers/areas');

var router = express.Router();

router.post('/doFetchProvince', areas.fetchProvince);
router.post('/doFetchCity', areas.fetchCity);
router.post('/doFetchCounty', areas.fetchCounty);

module.exports = router;
