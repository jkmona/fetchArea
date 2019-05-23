var express = require('express');
var router = express.Router();
const cheerio = require('cheerio');
const superagent = require('superagent');
const charset = require('superagent-charset');
const pinyin = require("node-pinyin");
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
    var order = 1;
    $('.provincetr').each(function(pIndex, elem){
      $(elem).find("td").each(function(index, el){
        let pa = $(el).find("a");
        let href = pa.prop('href');
        let provinceId = href.slice(0, href.indexOf('.'));
        let provinceName = pa.text();
        var py = pinyin(provinceName,{style:'normal'});
        provinceArray.push({
          nativeId: provinceId,
          parentId:0,
          nativeCode: provinceId + "000000000",
          name: provinceName,
          shortName: getShortName(provinceName),
          groupName: py[0].join('').slice(0,1).toUpperCase(),
          pinyin: py.join(' '),
          level: 1,
          order: order,
          cityURL: provinceURL.slice(0, provinceURL.lastIndexOf('/')) + "/" + provinceId + ".html"
        });
        order ++;
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
    var order = 1;
    $('.citytr').each(function(index, elem){
      var aList = $(elem).find("td");
      var firstTd = aList.eq(0).find("a");
      var secondTd = aList.eq(1).find("a");
      var href = firstTd.prop('href');
      var cityName = secondTd.text()
      var py = pinyin(cityName,{style:'normal'});
      if(href != null && href.length > 0){
        let cityId = href.slice(href.lastIndexOf('/')+1, href.indexOf('.'))

        cityArray.push({
          nativeId: cityId,
          parentId: provinceId,
          nativeCode: firstTd.text(),
          name: cityName,
          shortName: getShortName(cityName),
          groupName: py[0].join('').slice(0,1).toUpperCase(),
          pinyin: py.join(' '),
          level: 2,
          order: order,
          countyURL: cityURL.slice(0, cityURL.lastIndexOf('.'))  + "/" + cityId + ".html"
        });
        order ++;
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
      var order = 1;
      if(href != null && href.length > 0){
        countyId = href.slice(href.lastIndexOf('/')+1, href.indexOf('.'));
        let countyName = secondTd.text();
        var py = pinyin(cityName,{style:'normal'});
        countyArray.push({
          nativeId: countyId,
          parentId: cityId,
          nativeCode: firstTd.text(),
          name: countyName,
          shortName: getShortName(countyName),
          groupName: py[0].join('').slice(0,1).toUpperCase(),
          pinyin: py.join(' '),
          level: 3,
          order: order,
          townURL: countyURL.slice(0, countyURL.lastIndexOf('.'))  + "/" + countyId + ".html"
        });
        order ++;
      } else {
        let fText = aList.eq(0).text();
        let countyName = aList.eq(1).text();
        var py = pinyin(countyName, {style:'normal'});
        countyId = fText.slice(0, 6);
        countyArray.push({
          nativeId: countyId,
          parentId: cityId,
          nativeCode: fText,
          name: countyName,
          shortName: getShortName(countyName),
          groupName:py[0].join('').slice(0,1),
          pinyin:py.join(' '),
          level: 3,
          order: order
        }); 
        order ++;
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
function getShortName(source) {
  if(0 < source.indexOf('省直辖')||0 < source.indexOf('区直辖')){
    return '省直辖';
  } else if(0 < source.indexOf('自治')){
    if(0 < source.indexOf('内蒙古')) {
      return '内蒙古';
    }
    return source.slice(0,3);
  } else if(source.indexOf('地区')){
    return source.slice(0,3);
  }else {
    return source.replace(/[省|市|县|区]/g, '');
  }
  
}

module.exports = router;
