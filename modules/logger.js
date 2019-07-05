var config = require('../config');
var path = require('path');

var env = process.env.NODE_ENV || "development"

var log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'console' }, 
    app: { type: 'dateFile', filename: path.join(config.log_dir, 'app'), "pattern":"-dd.log", alwaysIncludePattern:true }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: config.debug && env !== 'test' ? 'DEBUG' : 'ERROR' }
  }
});

var logger = log4js.getLogger('app');
module.exports = logger;