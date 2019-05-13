var express = require('express');
var router = express.Router();
const cheerio = require('cheerio');
const superagent = require('superagent');
const charset = require('superagent-charset');
var fs = require('fs');
charset(superagent);

const headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'};
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("dd");
  res.render('index', { title: 'fetch area' });
});

router.post('/doFetchProvince', function(req, response, next) {
  let provinceURL = req.body.provinceURL;
  superagent.get(provinceURL).set(headers).buffer(true).charset('gbk').end(function (err, res) {
    // 抛错拦截
    if(err){
        console.log(err);
        return false;
    }
    // 等待 code
    let body = res.text;
    let $ = cheerio.load(body);
    var provinceArray = [];
    $('.provincetr').each(function(index, elem){
      $(elem).find("td").each(function(index, elem){
        let pa = $(elem).find("a");
        let href = pa.prop('href');
        let provinceId = href.slice(0, href.indexOf('.'));
        provinceArray.push({
          nativeId: provinceId,
          name: pa.text(),
          level: 1,
          cityURL: provinceURL.slice(0, provinceURL.lastIndexOf('/')) + "/" + provinceId + ".html"
        });
      });
    });
    //console.log(provinceArray);
    response.json(provinceArray);
  });
  //res.json(req.body);
});
router.post('/doFetchCity', (req, response, next) => {
  var cityURL = req.body.cityURL;
  let provinceId = req.body.provinceId;

  if(provinceId === null){
    response.json({"status":1, "message": "province id is null"}); 
  }
  superagent.get(cityURL).set(headers).buffer(true).charset('gbk').end(function (err, res) {
    // 抛错拦截
    if(err){
      console.log(cityURL);
      console.log(err);
      return false;
    }
    // 等待 code
    let body = res.text;
    let $ = cheerio.load(body);
    var cityArray = [];
    $('.citytr').each(function(index, elem){
      var aList = $(elem).find("td");
      var firstTd = aList.eq(0).find("a");
      var secondTd = aList.eq(1).find("a");
      var href = firstTd.prop('href');
      
      if(href != null && href.length > 0){
        let cityId = href.slice(href.lastIndexOf('/')+1, href.indexOf('.'))
        cityArray.push({
          nativeId: cityId,
          parentId: provinceId,
          code: firstTd.text(),
          name: secondTd.text(),
          level: 2,
          countyURL: cityURL.slice(0, cityURL.lastIndexOf('.'))  + "/" + cityId + ".html"
        });
      }else{
        console.log("city 异常连接：" + $(elem).text());
      }
      
    });
    //console.log(cityArray);
    response.json(cityArray);
  });
  
});
router.post('/doFetchCounty', (req, response, next) => {
  var countyURL = req.body.countyURL;
  let cityId = req.body.cityId;

  if(cityId === null){
    response.json({"status":1, "message": "province array is null"}); 
  }
  superagent.get(countyURL).set(headers).buffer(true).charset('gbk').end(function (err, res) {
    // 抛错拦截
    if(err){
      console.log(countyURL);
      console.log(err);
      return false;
    }
    // 等待 code
    let body = res.text;
    let $ = cheerio.load(body);
    var countyArray = [];
    $('.countytr').each(function(index, elem){
      var aList = $(elem).find("td");
      var firstTd = aList.eq(0).find("a");
      var secondTd = aList.eq(1).find("a");
      var href = firstTd.prop('href');
      let countyId;
      if(href != null && href.length > 0){
        countyId = href.slice(href.lastIndexOf('/')+1, href.indexOf('.'));
        countyArray.push({
          nativeId: countyId,
          parentId: cityId,
          code: firstTd.text(),
          name: secondTd.text(),
          level: 3,
          townURL: countyURL.slice(0, countyURL.lastIndexOf('.'))  + "/" + countyId + ".html"
        });
      } else {
        let fText = aList.eq(0).text();
        let sText = aList.eq(1).text();
        countyId = fText.slice(0, 6);
        countyArray.push({
          nativeId: countyId,
          parentId: cityId,
          code: fText,
          name: sText,
          level: 3
        });
      }
    });
    //console.log(countyArray);
    response.json(countyArray);
  });
});

function writeData(fileName, data) {
  fs.writeFile('/data/', data, function(err) {
      if (err) {
          return console.error(err);
      }
      let a = "dfd";
      console.log('写入数据成功!')
  })
}

module.exports = router;
