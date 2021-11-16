import { stringify } from "querystring";

/**
 */

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time == 'object') {
      date = time;
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000;
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  }
 
  export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();
 
    const diff = (now - d) / 1000;
 
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) { // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
  }
 
  //formate date return date string as yyyy/mm/dd
  export function dateToString(date) {
   var seperator1 = "-";
   var year = date.getFullYear();  //年
   var month = date.getMonth() + 1;   //月
   var strDate = date.getDate();   //日
   if (month >= 1 && month <= 9) {
     month = "0" + month;
   }
   if (strDate >= 0 && strDate <= 9) {
     strDate = "0" + strDate;
   }
   var currentdate = year + seperator1 + month + seperator1 + strDate;
   return currentdate;
  }
 
  export function stringToDate(dateStr) {
   var dateArr = dateStr.split('-');
   var year = parseInt(dateArr[0]);
   var month;
   //处理月份为04这样的情况                         
   if(dateArr[1].indexOf("0") == 0){
       month = parseInt(dateArr[1].substring(1));
   }else{
        month = parseInt(dateArr[1]);
   }
   var day = parseInt(dateArr[2]);
   var date = new Date(year,month -1,day);
   return date; 
  }

  export const CNStates = [
    "重庆市", 
    "黑龙江省", 
    "吉林省", 
    "海南省", 
    "北京市", 
    "辽宁省", 
    "内蒙古自治区",
    "西藏自治区",
    "青海省",
    "宁夏回族自治区",
    "新疆维吾尔自治区",
    "甘肃省",
    "河北省",
    "河南省",
    "湖北省",
    "湖南省",
    "山东省",
    "江苏省",
    "安徽省",
    "山西省",
    "陕西省",
    "四川省",
    "云南省",
    "贵州省",
    "浙江省",
    "福建省",
    "广西壮族自治区",
    "上海市",
    "天津市",
    "江西省",
    "广东省",
  ]

  export const USStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District Of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ]

  export const CNCity = {
    "安徽省": ["安庆","蚌埠","亳州","池州","滁州","阜阳","合肥","淮北","淮南","黄山","六安","马鞍山","宿州","铜陵","芜湖","宣城"],
    "福建省": ["福州","龙岩","南平","宁德","莆田","泉州","三明","厦门","漳州"],
    "甘肃省": ["白银","定西","甘南藏族自治州","嘉峪关","金昌","酒泉","兰州","临夏回族自治州","陇南","平凉","庆阳","天水","武威","张掖"],
    "广东省": ["潮州","东莞","东沙群岛","佛山","广州","河源","惠州","江门","揭阳","茂名","梅州","清远","汕头","汕尾","韶关","深圳","阳江","云浮","湛江","肇庆","中山","珠海"],
    "广西": ["百色","北海","崇左","防城港","贵港","桂林","河池","贺州","来宾","柳州","南宁","钦州","梧州","玉林"],
    "贵州省": ["安顺","毕节","贵阳","六盘水","黔东南苗族侗族自治州","黔南布依族苗族自治州","黔西南布依族苗族自治州","铜仁","遵义"],
    "海南省": ["白沙黎族自治县","保亭黎族苗族自治县","昌江黎族自治县","澄迈县","儋州","定安县","东方","海口","乐东黎族自治县","临高县","陵水黎族自治县","琼海","琼中黎族苗族自治县","三沙","三亚","屯昌县","万宁","文昌","五指山"],
    "河北省": ["保定","承德","邯郸","衡水","廊坊","秦皇岛","石家庄","唐山","邢台","张家口"],
    "河南省": ["安阳","沧州","鹤壁","济源","焦作","开封","洛阳","南阳","平顶山","濮阳","三门峡","商丘","漯河","新乡","信阳","许昌","郑州","周口","驻马店"],
    "黑龙江省": ["大庆","大兴安岭地区","哈尔滨","鹤岗","黑河","鸡西","佳木斯","牡丹江","七台河","齐齐哈尔","双鸭山","绥化","伊春"],
    "湖北省": ["鄂州","恩施土家族苗族自治州","黄冈","黄石","荆门","荆州","潜江","神农架林区","十堰","随州","天门","武汉","仙桃","咸宁","襄阳","孝感","宜昌"],
    "湖南省": ["常德","长沙","郴州","衡阳","怀化","娄底","邵阳","湘潭","湘西土家族苗族自治州","益阳","永州","岳阳","张家界","株洲"],
    "吉林省": ["白城","白山","长春","吉林","辽源","四平","松原","通化","延边朝鲜族自治州"],
    "江苏省": ["常州","淮安","连云港","南京","南通","苏州","宿迁","泰州","无锡","徐州","盐城","扬州","镇江"],
    "江西省": ["抚州","赣州","吉安","景德镇","九江","南昌","萍乡","上饶","新余","宜春","鹰潭"],
    "辽宁省": ["鞍山","本溪","大连","丹东","抚顺","阜新","葫芦岛","锦州","辽阳","盘锦","沈阳","铁岭","营口","朝阳"],
    "内蒙古自治区": ["阿拉善盟","巴彦淖尔","包头","赤峰","鄂尔多斯","呼和浩特","呼伦贝尔","通辽","乌海","乌兰察布","锡林郭勒盟","兴安盟"],
    "宁夏回族自治区": ["固原","石嘴山","吴忠","银川","中卫"],
    "青海": ["果洛藏族自治州","海北藏族自治州","海东","海南藏族自治州","海西蒙古族藏族自治州","黄南藏族自治州","西宁","玉树藏族自治州"],
    "山东省": ["滨州","德州","东营","菏泽","济南","济宁","莱芜","聊城","临沂","青岛","日照","泰安","威海","潍坊","烟台","枣庄","淄博"],
    "山西省": ["长治","大同","晋城","晋中","临汾","吕梁","朔州","太原","忻州","阳泉","运城"],
    "陕西省": ["安康","宝鸡","汉中","商洛","铜川","渭南","西安","咸阳","延安","榆林"],
    "四川省": ["阿坝藏族羌族自治州","巴中","成都","达州","德阳","甘孜藏族自治州","广安","广元","乐山","凉山彝族自治州","泸州","眉山","绵阳","南充","内江","攀枝花","遂宁","雅安","宜宾","资阳","自贡"],
    "西藏": ["阿里地区","昌都","拉萨","林芝","那曲地区","日喀则","山南"],
    "新疆": ["阿克苏地区","阿拉尔","阿勒泰地区","巴音郭楞蒙古自治州","北屯","博尔塔拉蒙古自治州","昌吉回族自治州","哈密","和田地区","喀什地区","可克达拉","克拉玛依","克孜勒苏柯尔克孜自治州","昆玉","石河子","双河","塔城地区","铁门关","图木舒克","吐鲁番","乌鲁木齐","五家渠","伊犁哈萨克自治州"],
    "云南省": ["保山","楚雄彝族自治州","大理白族自治州","德宏傣族景颇族自治州","迪庆藏族自治州","红河哈尼族彝族自治州","昆明","丽江","临沧","怒江傈僳族自治州","普洱","曲靖","文山壮族苗族自治州","西双版纳傣族自治州","玉溪","昭通"],
    "浙江省": ["杭州","湖州","嘉兴","金华","丽水","宁波","衢州","绍兴","台州","温州","舟山"],
    "北京市": ["东城区","西城区","朝阳区","丰台区","石景山区","海淀区","门头沟区","房山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","密云区","延庆区"],
    "重庆市": ["万州区","涪陵区","渝中区","大渡口区", "江北区","沙坪坝区","九龙坡区","南岸区","北碚区","綦江区","大足区","渝北区","巴南区","黔江区","长寿区","江津区","合川区","永川区","南川区","璧山区","铜梁区","潼南区","荣昌区","开州区","梁平区","武隆区"],
    "上海市": ["黄浦区","徐汇区","长宁区","静安区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"],
    "天津市": ["和平区","河东区","河西区","南开区","河北区","红桥区","东丽区","西青区","津南区","北辰区","武清区","宝坻区","滨海新区","宁河区","静海区","蓟州区"]
  }
 // 格式化时间
  export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1);
      let val = decodeURIComponent($2);
      val = String(val);
      obj[name] = val;
      return rs;
    });
    return obj;
  }
 
 
  export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }
 
  export function param(json) {
    if (!json) return '';
    return cleanArray(Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' +
             encodeURIComponent(json[key]);
    })).join('&');
  }
 
  export function param2Obj(url) {
    const search = url.split('?')[1];
    if (!search) {
      return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }
 
  export function html2Text(val) {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
  }
 
  export function objectMerge(target, source) {
     /* Merges two  objects,
      giving the last one precedence */
 
    if (typeof target !== 'object') {
      target = {};
    }
    if (Array.isArray(source)) {
      return source.slice();
    }
    for (const property in source) {
      if (source.hasOwnProperty(property)) {
        const sourceProperty = source[property];
        if (typeof sourceProperty === 'object') {
          target[property] = objectMerge(target[property], sourceProperty);
          continue;
        }
        target[property] = sourceProperty;
      }
    }
    return target;
  }
 
  //获取当前日期，格式YYYY-MM-DD
  export function getNowFormatDate() {
    var date = new Date();
    let sep = "-";
    var year = date.getFullYear();  //年
    var month = date.getMonth()+1;   //月
    var strDate = date.getDate();   //日
    
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + sep + month + sep + strDate;
    return currentdate;
  }
 
  export function toggleClass(element, className) {
    if (!element || !className) {
      return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
      classString += '' + className;
    } else {
      classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
    }
    element.className = classString;
  }

  export function randomCode (length) {
		var chars = ['0','1','2','3','4','5','6','7','8','9'];
		var result = ""; 
		for(var i = 0; i < length ; i ++) {
				var index = Math.ceil(Math.random()*9);
				result += chars[index];
		}
		return result;
  }
  
  //获取当前日期和时间，格式YYYY-MM-DD
  export function getNowTimeFormatDate() {
    var date = new Date();
    let sep = "-";
    let timesep = ':';
    var year = date.getFullYear();  //年
    var month = date.getMonth()+1;   //月
    var strDate = date.getDate();   //日
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }

    var currentdate = year + sep + month + sep + strDate + ' ' + hour+timesep+ minute + timesep + second;
    return currentdate;
  }

  export function randChar(length,characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    //length为所需长度，characters为所包含的所有字符，默认为字母+数字。
    characters=characters.split("");//分割字符。
    var result="";//返回的结果。
    while(result.length<length) result+=characters[Math.floor(Math.random()*characters.length)];
    return result;
  }

  export function littleantTracking() {
    var out = 'TLA';
    out += randomCode(8);
    out += randChar(2)
    return out;
  }

  export function generateUniqueString() {
    var ts = String(new Date().getTime()),
        i = 0,
        out = '';

    for (i = 0; i < ts.length; i += 3) {
        out += Number(ts.substr(i, 3)).toString(36);
    }
    return out;
  }

  export function idPadding(idstring) {
    idstring = idstring.toString();
    while (idstring.length < 5){
      idstring = '0' + idstring;
      
    }
    return idstring;
  }

  export function idUnPadding(idstring) {
    idstring = idstring.replace(/\b(0+)/gi,"");
    return idstring;
  }

  export function calculateChargePrice(weight) {
    var priceBase = 5.5;
    var priceExtra = 5.5;
    var chargePrice = 0
    if(weight == 0 || weight == ''){
      chargePrice = 0;
    }else if(weight <= 1){
      chargePrice = priceBase;
    }else{
      let before = parseInt(weight);
      let after = weight.split('.')[1];
      if(!after){
        after = '0';
      }
      else if(after.length === 1){
        after = after + '0';
      }else{
        after = after.substr(0,2);
      }
      
      if(after < 10){
        chargePrice = priceBase * before;
      }else if(after >= 10 && after < 60){
        chargePrice = priceBase * before + priceBase * 0.5;
      }else{
        chargePrice = priceBase * (before + 1);
      }
    }
    return chargePrice;
  }
 
  export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;
 
    const later = function() {
     // 据上一次触发时间间隔
      const last = +new Date() - timestamp;
 
     // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
       // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };
 
    return function(...args) {
      context = this;
      timestamp = +new Date();
      const callNow = immediate && !timeout;
     // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
 
      return result;
    };
  }
 
 