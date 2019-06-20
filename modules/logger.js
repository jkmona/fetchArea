import { log_dir, debug } from '../config';
import { join } from 'path';

var env = process.env.NODE_ENV || "development"


import { configure, getLogger } from 'log4js';
configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: join(log_dir, 'cheese.log'), category: 'cheese' }
  ]
});

var logger = getLogger('cheese');
logger.setLevel(debug && env !== 'test' ? 'DEBUG' : 'ERROR')

export default logger;