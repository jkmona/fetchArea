var path = require('path');
var config = {
    debug: true,
    // mongodb 配置
    mongodb: process.env.mongo_uri || "mongodb://sso:sso100@127.0.0.1:27017/sso_test",
    
    // redis 配置
    redis_host: process.env.redis_host || '127.0.0.1',
    redis_port: 6379,
    redis_db: 12,
    redis_password: process.env.redis_auth,
    cookie:{"maxAge" : 1800000},
    session_secret: 'adxeug93r7fmjchp9dk4qwkfj0zeybv',

    //
    log_dir: path.join(__dirname, 'logs'),
}

module.exports = config;