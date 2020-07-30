var express = require( 'express');
var region = require('../controllers/region');

var router = express.Router();

router.post('/doFetchProvince', region.fetchProvince);
router.post('/doFetchCity', region.fetchCity);
router.post('/doFetchCounty', region.fetchCounty);
router.get('/list', region.getRegionList);

module.exports = router;
