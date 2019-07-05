
var superagent = require('superagent');
var charset = require('superagent-charset');
var logger = require('../modules/logger');
var crypto = require('crypto');

charset(superagent);
const headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'};

exports.main = (req, res, next) => {
    res.render('index', { title: 'fetch area' });
}
exports.test = (request, response, next) => {
    
}