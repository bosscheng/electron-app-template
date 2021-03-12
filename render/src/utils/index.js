/*
* author: wancheng
* date: 11/5/18
* desc:
*/


export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = new Date(time);
  } else {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000;
      time = +time; // 转成int 型
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}


export function clone(obj) {
  var result = '';
  //
  if (typeof obj === 'object') {
    try {
      result = JSON.stringify(obj);
      result = JSON.parse(result);
    } catch (e) {
      result = obj;
    }
  } else {
    result = obj;
  }

  return result;
}

export function extend(target) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0, len = args.length; i < len; i++) {
    var source = args[i];
    for (var key in source) {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }
  return target;
}


export function formatPassTime(startTime) {
  startTime = Date.parse(new Date(startTime));
  var currentTime = Date.parse(new Date()),
    time = currentTime - startTime,
    day = parseInt(time / (1000 * 60 * 60 * 24)),
    hour = parseInt(time / (1000 * 60 * 60)),
    min = parseInt(time / (1000 * 60)),
    month = parseInt(day / 30),
    year = parseInt(month / 12);
  if (year) return year + "年前"
  if (month) return month + "个月前"
  if (day) return day + "天前"
  if (hour) return hour + "小时前"
  if (min) return min + "分钟前"
  else return '刚刚'
}

export function formatDurationTime(value) {
  if (value > 1000) {
    let s = value / 1000;
    if (s > 60) {
      s = s | 0;
      let min = (s / 60) >> 0;
      if (min > 60) {
        let hour = (min / 60) >> 0;
        return hour + "hour" + (min % 60) + "min";
      } else {
        return min + "min" + (s % 60) + "s";
      }
    } else {
      return s.toFixed(3) + "s";
    }
  } else {
    return value + "ms";
  }
}


export function uuid() {
// return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export function isIos() {
  var ua = window.navigator.userAgent;
  return !!ua.match(/iphone|ipad|iPod/gi);
};

export function isAndroid() {
  var ua = window.navigator.userAgent;
  return !!ua.match(/android/gi);
}

export function isH5() {
  return isAndroid() || isIos();
}


export function formatNumberByUnit(num, unit, fixedNum) {
  if (num === -1) {
    return '';
  }

  if (num === undefined || num === '--') {
    return '';
  }

  num += '';
  if (!num) {
    return '';
  }

  // 如果是数字 则表示的小数点的长度
  if (typeof unit === 'number') {
    fixedNum = unit;
    unit = null;
  }

  unit = unit || 'm';
  fixedNum = (fixedNum === null || fixedNum === undefined) ? 2 : fixedNum;

  let denominator = 1;

  if (unit === 'm') {
    denominator = 1000000;
  } else if (unit === 'k') {
    denominator = 1000;
  }

  return toNumber((num / denominator).toFixed(fixedNum));
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

export const getEmptyList = (len = 100) => {
  let xAxisArray = []
  for (let i = 0; i < len; i++) {
    xAxisArray.push('')
  }
  return xAxisArray
}

export function unitSpeedFormat(value, unit = "") {
  const uintInc = {
    "": "K",
    K: "M",
    M: "G",
    G: null
  };

  if (value > 1024 && uintInc[unit]) {
    return unitSpeedFormat(value / 1024, uintInc[unit]);
  }
  return value.toFixed(2).replace(".00", "") + unit + "B";
}


export function formatRemainTime(startTime, endTime) {

  var startDate = new Date(); //开始时间
  var endDate = new Date(); //结束时间
  if (startTime) {
    startDate = new Date(startTime);
  }
  if (endTime) {
    endDate = new Date(endTime);
  }
  var t = endDate.getTime() - startDate.getTime(); //时间差
  var d = 0,
    h = 0,
    m = 0,
    s = 0;
  if (t >= 0) {
    d = Math.floor(t / 1000 / 3600 / 24);
    h = Math.floor(t / 1000 / 60 / 60 % 24);
    m = Math.floor(t / 1000 / 60 % 60);
    s = Math.floor(t / 1000 % 60);
  }
  return d + "天 " + h + "小时 " + m + "分钟 " + s + "秒";
}

//min
export function formatMinTimeTips(time) {
  var result;

  //
  if (time > -1) {
    var hour = Math.floor(time / 60) % 60;
    var min = time % 60;

    min = Math.round(min);

    if (hour < 10) {
      result = '0' + hour + ":";
    } else {
      result = hour + ":";
    }

    if (min < 10) {
      result += "0";
    }
    result += min;
  }

  return result;
}


export function getOneTimeRange(time, options) {
  let date;

  // 都为空的时候
  if (!time && !options) {
    date = new Date();
  } else if (Object.prototype.toString.call(time) !== '[object Date]' && time !== null && typeof time === 'object') {
    // time 为 options 参数。
    options = time;
    date = new Date();
  } else if (Object.prototype.toString.call(time) === '[object Date]') {
    // time 是时间格式
    date = time;
  } else {
    // time 是 int 格式。
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    time = +time; // 转成int 型
    date = new Date(time);
  }

  options = options || {};

  let result = {
    start: 0,
    end: 0
  };

  let _startTime = new Date(date).setHours(options.startHour || 0, options.startMin || 0, 0, 0);
  let _endTime = new Date(date).setHours(options.endHour || 23, options.endMin || 59, 59, 0);
  result.start = new Date(_startTime).getTime();
  result.end = new Date(_endTime).getTime();

  return result;
};
