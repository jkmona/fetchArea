var cheerio = require('cheerio');
var superagent = require('superagent');
var charset = require('superagent-charset');
var pinyin = require('node-pinyin');
var areaConst = require('../modules/const/areaConst');
var logger = require('../modules/logger');

charset(superagent);
const headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'};

exports.fetchProvince = (req, response, next) => {
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
                let shortName = getShortName(provinceName);
                var py = pinyin(shortName,{style:'normal'});
                if(py == null || py.length == 0){
                    py = [["null"]];
                    logger.error("pinyin null , province shortName:" + shortName);
                }
                provinceArray.push({
                    nativeId: provinceId,
                    parentId: 0,
                    nativeCode: provinceId + "000000000",
                    name: provinceName,
                    shortName: shortName,
                    groupName: py[0].join('').slice(0,1).toUpperCase(),
                    pinyin: py.join(' '),
                    level: 1,
                    valid: true,
                    display: true,
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
}

exports.fetchCity = (req, response, next) => {
    var cityURL = req.body.cityURL;
    let provinceId = req.body.provinceId;

    if(provinceId === null){
        response.json({"status":1, "message": "province id is null"}); 
    }
    superagent.get(cityURL).set(headers).buffer(true).charset('gbk').end(function (err, res) {
        // 抛错拦截
        if(err){
            logger.error(cityURL);
            logger.error(err);
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
        let shortName = getShortName(cityName);
        var py = pinyin(shortName,{style:'normal'});
        if(py == null || py.length == 0){
            py = [["null"]];
            console.log("pinyin null , city shortName:"+shortName);
        }
        if(href != null && href.length > 0){
            let cityId = href.slice(href.lastIndexOf('/')+1, href.indexOf('.'))
            cityArray.push({
                nativeId: cityId,
                parentId: provinceId,
                nativeCode: firstTd.text(),
                name: cityName,
                shortName: shortName,
                groupName: py[0].join('').slice(0,1).toUpperCase(),
                pinyin: py.join(' '),
                level: 2,
                valid: true,
                display: true,
                order: order,
                countyURL: cityURL.slice(0, cityURL.lastIndexOf('.'))  + "/" + cityId + ".html"
            });
            order ++;
        }else{
            logger.error("city 异常连接：" + $(elem).text());
        }
        
        });
        //console.log(cityArray);
        response.json(cityArray);
    });
}
exports.fetchCounty = (req, response, next) => {
    var countyURL = req.body.countyURL;
    let cityId = req.body.cityId;
  
    if(cityId === null){
        response.json({"status":1, "message": "province array is null"}); 
    }
    superagent.get(countyURL).set(headers).buffer(true).charset('gbk').end(function (err, res) {
        // 抛错拦截
        if(err){
            logger.error(countyURL);
            logger.error(err);
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
                let shortName = getShortName(countyName);
                var display = areaConst.gaoXinQu.indexOf(countyName) ? false : true;
                var py = pinyin(shortName,{style:'normal'});
                if(py == null || py.length == 0){
                    py = [["null"]];
                    logger.error("pinyin null , county shortName:"+shortName);
                }
                countyArray.push({
                    nativeId: countyId,
                    parentId: cityId,
                    nativeCode: firstTd.text(),
                    name: countyName,
                    shortName: shortName,
                    groupName: py[0].join('').slice(0,1).toUpperCase(),
                    pinyin: py.join(' '),
                    level: 3,
                    valid: true,
                    display: display,
                    order: order,
                    townURL: countyURL.slice(0, countyURL.lastIndexOf('.'))  + "/" + countyId + ".html"
                });
                order ++;
            } else {
                let fText = aList.eq(0).text();
                let countyName = aList.eq(1).text();
                let shortName = getShortName(countyName);
                var display = areaConst.gaoXinQu.indexOf(countyName) ? false : true;
                var py = pinyin(shortName, {style:'normal'});
                if(py == null || py.length == 0){
                    py = [["null"]];
                    logger.error("pinyin null , county shortName:"+shortName);
                }
                countyId = fText.slice(0, 6);
                countyArray.push({
                    nativeId: countyId,
                    parentId: cityId,
                    nativeCode: fText,
                    name: countyName,
                    shortName: shortName,
                    groupName:py[0].join('').slice(0,1),
                    pinyin: py.join(' '),
                    level: 3,
                    valid: true,
                    display: display,
                    order: order
                }); 
                order ++;
            }
        });
        response.json(countyArray);
    });
}
function getShortName(source) {
    if(0 < source.indexOf('省直辖') || 0 < source.indexOf('区直辖')){
      //省直辖，自治区直辖
      return '直辖县';
    } else if(source === '市辖区'){
      //市辖区
      return '市辖区';
    } else if(/自治区$/.test(source)){
      //自治区
      if(0 < source.indexOf('内蒙古')) {
        return '内蒙古';
      }
      return source.slice(0,2);
    } else if(areaConst.meng.indexOf(source) >= 0){
      //盟
      return source.replace(/盟$/g, '');
    } else if(areaConst.ziZhiXian.indexOf(source) >= 0){
      //自治县
      return areaConst.ziZhiXianSN[areaConst.ziZhiXian.indexOf(source)];
    } else if(areaConst.ziZhiZhou.indexOf(source) >= 0){
      //自治州
      return areaConst.ziZhiZhouSN[areaConst.ziZhiZhou.indexOf(source)];
    } else if(areaConst.diQu.indexOf(source) >= 0){
      //地区
      return source.replace(/[地区]$/g, '');
    } else if(areaConst.xinQu.indexOf(source) >= 0){
      //新区
      return areaConst.xinQuSN[areaConst.xinQu.indexOf(source)];
    } else if(areaConst.gaoXinQu.indexOf(source) >= 0){
      return source;
    } else if(source === "县"){
      //重庆市下的县特殊处理
      return source;
    } else if(source.length === 2){
      //两个字的县区，直接返回
      return source;
    } else {
      return source.replace(/[省|市|县|区]$/, '');
    }
    
}