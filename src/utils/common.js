/**
 * Created by yangfeng on 2019/7/25.
 */

//常见特殊符号转义字符
function strEscape(str) {
  str = str.replace(/&ldquo;/g, '“');
  str = str.replace(/&rdquo;/g, '”');
  str = str.replace(/&lsquo;/g, '‘');
  str = str.replace(/&rsquo;/g, '’');
  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&#039;/g, "'");
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&hellip;&hellip;/g, '……');
  str = str.replace(/&mdash;&mdash;/g, '——');
  str = str.replace(/&amp;/g, '&');
  return str;
}

//唯一key值
function getKey() {
  let res = '';
  for (let i = 0; i < 32; i++) {
    let n = Math.floor(Math.random() * 16).toString(16);
    res += n;
  }
  return res;
}

//元素获取style
function getStyle(ele) {
  if (document.documentElement.currentStyle) {
    return ele.currentStyle;
  } else {
    return document.defaultView.getComputedStyle(ele, null);
  }
}

function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

//money
function moneyFormat(money) {
  if (money) {
    return '¥' + (Number(money) / 100).toFixed(2);
  } else {
    return '¥0.00';
  }
}

//获取当前系统时间
function getCurrentDate() {
  let now = new Date();
  let year = now.getFullYear(); //得到年份
  let month = now.getMonth() + 1; //得到月份
  if (month < 10) {
    month = '0' + month;
  }
  let day = now.getDate(); //得到日期
  if (day < 10) {
    day = '0' + day;
  }
  let date = year + '-' + month + '-' + day;
  return date;
}

/**
 * 获取当前月
 * @returns {string}
 */
function getCurrentMonth() {
  let now = new Date();
  let year = now.getFullYear(); //得到年份
  let month = now.getMonth() + 1; //得到月份
  if (month < 10) {
    month = '0' + month;
  }
  let date = year + '-' + month;
  return date;
}

/**
 * 获取日期 addDayCount 偏移量 可以是正/负数
 * @returns {string}
 */
function getDate(addDayCount) {
  let now = new Date();
  now.setDate(now.getDate() + addDayCount); //获取addDayCount天后的日期
  let year = now.getFullYear(); //得到年份
  let month = now.getMonth() + 1; //得到月份
  if (month < 10) {
    month = '0' + month;
  }
  let day = now.getDate(); //得到日期
  if (day < 10) {
    day = '0' + day;
  }
  let date = year + '-' + month + '-' + day;
  return date;
}

//两个时间相差天数
function getDaysBetween(sDate1, sDate2) {
  //sDate1和sDate2是2006-12-18格式
  let dateSpan;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  return Math.floor(dateSpan / (24 * 3600 * 1000));
}

/**
 * 格式化时间 +1天或者-1天
 * current 基准时间，用户比对是前一天还是后一天
 */
function formatDatePass(current, cellValue) {
  if (cellValue && cellValue.length > 8) {
    let day = cellValue.substr(8, 2);
    if (day.startsWith('0')) {
      day = day.substr(1);
    }
    day = parseInt(day);
    let currentDay = current;
    if (currentDay && currentDay.length > 8) {
      currentDay = currentDay.substr(8, 2);
    }

    if (currentDay.startsWith('0')) {
      currentDay = currentDay.substr(1);
    }
    currentDay = parseInt(currentDay);
    if (day > currentDay) {
      return '+' + (day - currentDay) + ' ' + cellValue.substr(11, 5);
    } else if (day < currentDay) {
      return day - currentDay + ' ' + cellValue.substr(11, 5);
    } else {
      return cellValue.substr(11, 5);
    }
  }
}

//定义一些常量
const PI = 3.1415926535897932384626;
const a = 6378245.0; //长半轴
const ee = 0.00669342162296594323; //扁率

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02towgs84(lng, lat) {
  lat = +lat;
  lng = +lng;
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    let radlat = (lat / 180.0) * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    let mglat = lat + dlat;
    let mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
}

/**
 * WGS-84 转 GCJ-02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02(lng, lat) {
  lat = +lat;
  lng = +lng;
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    let radlat = (lat / 180.0) * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    let mglat = lat + dlat;
    let mglng = lng + dlng;
    return [mglng, mglat];
  }
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
  lat = +lat;
  lng = +lng;
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

function transformlat(lng, lat) {
  lat = +lat;
  lng = +lng;
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformlng(lng, lat) {
  lat = +lat;
  lng = +lng;
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

export {
  strEscape,
  getKey,
  getStyle,
  formatDate,
  moneyFormat,
  getCurrentDate,
  getCurrentMonth,
  getDate,
  getDaysBetween,
  formatDatePass,
  gcj02towgs84,
  wgs84togcj02,
};
