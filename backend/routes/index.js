var express = require('express');
var router = express.Router();
const contries = require("./../controllers/countries")

router.get("/search", contries.searchCountries)
router.get('/', contries.getCountries);
router.get('/:code', contries.getCountryByCode);
router.get('/region/:region', contries.filterCountriesByRegion);

module.exports = router;
