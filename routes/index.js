var express = require('express');
var router = express.Router();
const cheerio = require('cheerio');
const superagent = require('superagent');
const charset = require('superagent-charset');
const pinyin = require("node-pinyin");
var fs = require('fs');
charset(superagent);
//盟
const ar_m = ['兴安盟','锡林郭勒盟','阿拉善盟'];
//地区
const ar_dq = ['大兴安岭地区', '阿里地区', '阿克苏地区', '喀什地区', '和田地区', '塔城地区', '阿勒泰地区'];
//自治州
const ar_zzz = ['延边朝鲜族自治州', '恩施土家族苗族自治州', '湘西土家族苗族自治州', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州', 
'黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', 
'西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州', '临夏回族自治州', '甘南藏族自治州', 
'海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州', '昌吉回族自治州', 
'博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '克孜勒苏柯尔克孜自治州', '伊犁哈萨克自治州'];
const ar_zzzSN = ['延边', '恩施', '湘西', '阿坝', '甘孜', '凉山', '黔西南', '黔东南', '黔南', '楚雄', '红河', '文山', '西双版纳', '大理', 
'德宏', '怒江', '迪庆', '临夏', '甘南', '海北', '黄南', '海南', '果洛', '玉树', '海西', '昌吉', '博尔塔拉', '巴音郭楞', '克孜勒', '伊犁'];
//自治县
const ar_zzx = ['青龙满族自治县', '丰宁满族自治县', '宽城满族自治县', '围场满族蒙古族自治县', '孟村回族自治县', '大厂回族自治县', 
'岫岩满族自治县', '新宾满族自治县', '清原满族自治县', '本溪满族自治县', '桓仁满族自治县', '宽甸满族自治县', '阜新蒙古族自治县', 
'喀喇沁左翼蒙古族自治县', '伊通满族自治县', '长白朝鲜族自治县', '前郭尔罗斯蒙古族自治县', '杜尔伯特蒙古族自治县', '景宁畲族自治县', 
'长阳土家族自治县', '五峰土家族自治县', '城步苗族自治县', '江华瑶族自治县', '麻阳苗族自治县', '新晃侗族自治县', '芷江侗族自治县', 
'靖州苗族侗族自治县', '通道侗族自治县', '乳源瑶族自治县', '连山壮族瑶族自治县', '连南瑶族自治县', '融水苗族自治县', '三江侗族自治县', 
'龙胜各族自治县', '恭城瑶族自治县', '隆林各族自治县', '富川瑶族自治县', '罗城仫佬族自治县', '环江毛南族自治县', '巴马瑶族自治县', 
'都安瑶族自治县', '大化瑶族自治县', '金秀瑶族自治县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', 
'保亭黎族苗族自治县', '琼中黎族苗族自治县', '石柱土家族自治县', '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县', 
'北川羌族自治县', '峨边彝族自治县', '马边彝族自治县', '木里藏族自治县', '道真仡佬族苗族自治县', '务川仡佬族苗族自治县', 
'镇宁布依族苗族自治县', '关岭布依族苗族自治县', '紫云苗族布依族自治县', '威宁彝族回族苗族自治县', '玉屏侗族自治县', '印江土家族苗族自治县', 
'沿河土家族自治县', '松桃苗族自治县', '三都水族自治县', '石林彝族自治县', '禄劝彝族苗族自治县', '寻甸回族彝族自治县', '峨山彝族自治县', 
'新平彝族傣族自治县', '元江哈尼族彝族傣族自治县', '玉龙纳西族自治县', '宁蒗彝族自治县', '宁洱哈尼族彝族自治县', '墨江哈尼族自治县', 
'景东彝族自治县', '景谷傣族彝族自治县', '镇沅彝族哈尼族拉祜族自治县', '江城哈尼族彝族自治县', '孟连傣族拉祜族佤族自治县', 
'澜沧拉祜族自治县', '西盟佤族自治县', '双江拉祜族佤族布朗族傣族自治县', '耿马傣族佤族自治县', '沧源佤族自治县', '屏边苗族自治县', 
'金平苗族瑶族傣族自治县', '河口瑶族自治县', '漾濞彝族自治县', '南涧彝族自治县', '巍山彝族回族自治县', '贡山独龙族怒族自治县', 
'兰坪白族普米族自治县', '维西傈僳族自治县', '张家川回族自治县', '天祝藏族自治县', '肃南裕固族自治县', '肃北蒙古族自治县', 
'阿克塞哈萨克族自治县', '东乡族自治县', '积石山保安族东乡族撒拉族自治县', '大通回族土族自治县', '民和回族土族自治县', '互助土族自治县',
'化隆回族自治县', '循化撒拉族自治县', '门源回族自治县', '河南蒙古族自治县', '巴里坤哈萨克自治县', '木垒哈萨克自治县', '焉耆回族自治县', 
'塔什库尔干塔吉克自治县', '察布查尔锡伯自治县', '和布克赛尔蒙古自治县'];
//自治县简称
const ar_zzxSN = ['青龙', '丰宁', '宽城', '围场', '孟村', '大厂', '岫岩', '新宾', '清原', '本溪', '桓仁', '宽甸', '阜新', '喀喇沁左翼', 
'伊通', '长白', '前郭尔罗斯', '杜尔伯特', '景宁', '长阳', '五峰', '城步', '江华', '麻阳', '新晃', '芷江', '靖州', '通道', '乳源', 
'连山', '连南', '融水', '三江', '龙胜', '恭城', '隆林', '富川', '罗城', '环江', '巴马', '都安', '大化', '金秀', '白沙', '昌江', 
'乐东', '陵水', '保亭', '琼中', '石柱', '秀山', '酉阳', '彭水', '北川', '峨边', '马边', '木里', '道真', '务川', '镇宁', '关岭', 
'紫云', '威宁', '玉屏', '印江', '沿河', '松桃', '三都', '石林', '禄劝', '寻甸', '峨山', '新平', '元江', '玉龙', '宁蒗', '宁洱', 
'墨江', '景东', '景谷', '镇沅', '江城', '孟连', '澜沧', '西盟', '双江', '耿马', '沧源', '屏边', '金平', '河口', '漾濞', '南涧', 
'巍山', '贡山', '兰坪', '维西', '张家川', '天祝', '肃南', '肃北', '阿克塞', '东乡', '积石山', '大通', '民和', '互助', '化隆', '循化', 
'门源', '河南', '巴里坤', '木垒', '焉耆', '塔什库尔干', '察布查尔', '和布克赛尔']
//新区、管理区
const ar_xq =['滨海新区', '井陉矿区', '峰峰矿区', '沈北新区', '浦东新区', '镇江高新区', '兰州新区', '鹰手营子矿区', '白云鄂博矿区', '神农架林区',
'平顶山市新城区', '益阳市大通湖管理区', '北戴河新区', '邯郸冀南新区', '沧州渤海新区', '衡水滨湖新区', '保定白沟新城', '唐山市汉沽管理区',
'张家口市察北管理区', '张家口市塞北管理区', '龙感湖管理区', '岳阳市屈原管理区', '常德市西洞庭管理区', '益阳市大通湖管理区', 
'永州市金洞管理区', '永州市回龙圩管理区', '怀化市洪江管理区'];
//新区简称
const ar_xqSN = ['滨海新区', '井陉', '峰峰', '沈北新区', '浦东新区', '镇江高新区', '兰州新区', '鹰手营子', '白云鄂博', '神农架', '新城区',
'大通湖区', '北戴河新区', '冀南新区', '渤海新区', '滨湖新区', '白沟新城', '汉沽', '察北', '塞北', '龙感湖',
'屈原', '西洞庭', '大通湖', '金洞', '回龙圩', '洪江'];
//高新区
const ar_gxq = ['山西转型综合改革示范区', '新乡市平原城乡一体化示范区', '焦作城乡一体化示范区', '南阳市城乡一体化示范区', '云龙示范区', 
'湘潭昭山示范区', '湘潭九华示范区', '石家庄循环化工园区', '山西长治高新技术产业园区', '呼和浩特金海工业园区', '苏州工业园区', 
'阜阳合肥现代产业园区', '宿州马鞍山现代产业园区', '河南濮阳工业园区', '湖南湘潭高新技术产业园区', '湖南衡阳高新技术产业园区', 
'湖南益阳高新技术产业园区', '格尔木藏青工业园区', '西藏文化旅游创意园区', '达孜工业园区', '五台山风景名胜区', '郑州航空港经济综合实验区', 
'豫东综合物流产业聚集区', '衡阳综合保税区', '石家庄高新技术产业开发区', '唐山市芦台经济技术开发区', '唐山高新技术产业开发区', 
'河北唐山海港经济开发区', '秦皇岛市经济技术开发区', '邯郸经济技术开发区', '河北邢台经济开发区', '保定高新技术产业开发区', 
'张家口市高新技术产业开发区', '承德高新技术产业开发区', '河北沧州经济开发区', '沧州高新技术产业开发区', '廊坊经济技术开发区', 
'河北衡水高新技术产业开发区', '山西大同经济开发区', '山西朔州经济开发区', '呼和浩特经济技术开发区', '包头稀土高新技术产业开发区', 
'通辽经济技术开发区', '内蒙古阿拉善经济开发区', '长春经济技术开发区', '长春净月高新技术产业开发区', '长春高新技术产业开发区', 
'长春汽车经济技术开发区', '吉林经济开发区', '吉林高新技术产业开发区', '吉林松原经济开发区', '吉林白城经济开发区', '大庆高新技术产业开发区', 
'牡丹江经济技术开发区', '徐州经济技术开发区', '南通经济技术开发区', '连云港经济技术开发区', '连云港高新技术产业开发区', '淮安经济技术开发区', 
'盐城经济技术开发区', '扬州经济技术开发区', '泰州医药高新技术产业开发区', '宿迁经济技术开发区', '温州经济技术开发区', '合肥高新技术产业开发区', 
'合肥经济技术开发区', '合肥新站高新技术产业开发区', '芜湖经济技术开发区', '安徽芜湖长江大桥经济开发区', '蚌埠市高新技术开发区', 
'蚌埠市经济开发区', '安徽安庆经济开发区', '滁州经济技术开发区', '阜阳经济技术开发区', '宿州经济技术开发区', '宣城市经济开发区', 
'济南高新技术产业开发区', '青岛高新技术产业开发区', '东营经济技术开发区', '东营港经济开发区', '烟台高新技术产业开发区', 
'烟台经济技术开发区', '潍坊滨海经济技术开发区', '济宁高新技术产业开发区', '威海火炬高技术产业开发区', '威海经济技术开发区', 
'威海临港经济技术开发区', '日照经济技术开发区', '临沂高新技术产业开发区', '临沂经济技术开发区', '临沂临港经济开发区', 
'德州经济技术开发区', '德州运河经济开发区', '菏泽经济技术开发区', '菏泽高新技术开发区', '郑州经济技术开发区', '郑州高新技术产业开发区', 
'洛阳高新技术产业开发区', '平顶山高新技术产业开发区', '安阳高新技术产业开发区', '鹤壁经济技术开发区', '新乡高新技术产业开发区', 
'新乡经济技术开发区', '濮阳经济技术开发区', '许昌经济技术开发区', '漯河经济技术开发区', '河南三门峡经济开发区', '南阳高新技术产业开发区', 
'河南商丘经济开发区', '信阳高新技术产业开发区', '河南周口经济开发区', '河南驻马店经济开发区', '荆州经济技术开发区', 
'湖南衡阳松木经济开发区', '永州经济技术开发区', '湖南吉首经济开发区', '湖南永顺经济开发区', '内江经济开发区', '达州经济开发区', 
'巴中经济开发区', '拉萨经济技术开发区', '乌鲁木齐经济技术开发区', '乌鲁木齐高新技术产业开发区', '库尔勒经济技术开发区'];

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
        let shortName = getShortName(provinceName);
        var py = pinyin(shortName,{style:'normal'});
        if(py == null || py.length == 0){
          py = [["null"]];
          console.log("pinyin null , province shortName:"+shortName);
        }
        provinceArray.push({
          nativeId: provinceId,
          parentId:0,
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
        let shortName = getShortName(countyName);
        var display = ar_gxq.indexOf(countyName) ? false : true;
        var py = pinyin(shortName,{style:'normal'});
        if(py == null || py.length == 0){
          py = [["null"]];
          console.log("pinyin null , county shortName:"+shortName);
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
        var display = ar_gxq.indexOf(countyName) ? false : true;
        var py = pinyin(shortName, {style:'normal'});
        if(py == null || py.length == 0){
          py = [["null"]];
          console.log("pinyin null , county shortName:"+shortName);
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
  } else if(ar_m.indexOf(source) >= 0){
    //盟
    return source.replace(/盟$/g, '');
  } else if(ar_zzx.indexOf(source) >= 0){
    //自治县
    return ar_zzxSN[ar_zzx.indexOf(source)];
  } else if(ar_zzz.indexOf(source) >= 0){
    //自治州
    return ar_zzzSN[ar_zzz.indexOf(source)];
  } else if(ar_dq.indexOf(source) >= 0){
    //地区
    return source.replace(/[地区]$/g, '');
  } else if(ar_xq.indexOf(source) >= 0){
    //新区
    return ar_xqSN[ar_xq.indexOf(source)];
  } else if(ar_gxq.indexOf(source) >= 0){
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

module.exports = router;
