
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
    var data = [];
    for(let i=0;i< data.length; i++){
        var d = data[i];
        var ticket = d.ticket;
        var bottomNo = d.bottomNo;
        var content = 'buycarToken_'  + ticket + '_' + bottomNo;
        var buycarToken = crypto.createHash('md5').update(content).digest("hex");
        superagent.post('')
        .send({ chassis: bottomNo, ticket: ticket, buycarToken: buycarToken })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .set('Content-Type','application/x-www-form-urlencoded')
        .then(res => {
            logger.error('res:' + JSON.stringify(res.body));
        });
    }
    response.json(data);
}