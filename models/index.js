
var mongoose = require('mongoose');
var config   = require('../config');
var logger = require('../modules/logger')

mongoose.connect(config.mongodb, {
  poolSize: 20,
  useCreateIndex: true,
  useNewUrlParser: true
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.mongodb, err.message);
    process.exit(1);
  }
});

require('./area');
exports.Area = mongoose.model('Area');