import { connect, model } from 'mongoose';
import { mongodb } from '../config';
import logger from '../modules/logger';

connect(mongodb, {
  poolSize: 20,
  useCreateIndex: true,
  useNewUrlParser: true
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', mongodb, err.message);
    process.exit(1);
  }
});

import './area';
export const Area = model('Area');