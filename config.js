var config = {
    // mongodb 配置
    mongodb: 'mongodb://sso:sso100@172.17.11.79:27017/sso_test',

    // redis 配置
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,
    redis_password: 'myredis@pwd',
    cookie:{"maxAge" : 1800000},
    session_secret: 'adxeug93r7fmjchp9dk4qwkfj0zeybv',
}

export default config;