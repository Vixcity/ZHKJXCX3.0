const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const isIfLogin = () => {
	 return getApp().globalData.isLogin
}

// 封装请求
const wxReq = data => {
	if(isIfLogin()){
		
		return
	}
  const openid = wx.getStorageSync("userInfo").openid.openid
  // 作坊主
  // 王
  // const openid = "oFr0i5M55SwKUlQ7WwbzaMOIar9Q"
  // 王-小号
  // const openid = "oFr0i5GHdONuAU0MI5cV1HJX1vs4"
  // 周
  // const openid = "oFr0i5Jhj6w5N5Oj_BEP6w-b1Lr4"
  // 员工
  // const openid = "oFr0i5FlAmENiYwaoEk75GcL8I5Y"
  // 注册用户未绑定作坊主↓
  // const openid = "yyy"

  wx.request({
    url: getApp().globalData.api + data.url,
    data: data.data,
    method: data.method,
    success: data.success,
    header: {
      // Authorization:'Bearer ' + 6666
			Authorization: 'Bearer ' + openid, // 员工ID
			token: getApp().globalData.token
    }
  })
}

// 刷新页面
function reloadThisPage() {
  let currentPages = getCurrentPages()
  let lastRoute = currentPages[currentPages.length - 1].route
  let options = currentPages[currentPages.length - 1].options
  let optionsStr = ""
  for (let key in options) {
      optionsStr += '?' + key + '=' + options[key]
  }
  wx.redirectTo({
      url: '/' + lastRoute + optionsStr,
  })
}

// 验证手机号
function verifyTel(tel) {
  let reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
  if (reg.test(tel)) {
    return true;
  }
  return false;
}

const getTimestamp = n => {
  // 时间格式 2015-03-05 17:59:00
  var date = n;
  date = date.substring(0, 19);
  date = date.replace(/-/g, '/');
  var timestamp = new Date(date).getTime();
  // console.log(timestamp);
  return timestamp
}


// 获取时间差，时间戳传入
const getTimeDiff = (time1, time2, type = 'hours') => {
  let timeDiff = time1 > time2 ? time1 - time2 : time2 - time1
  let hours = Math.floor(timeDiff / (3600 * 1000));
  let days = Math.floor(timeDiff / (24 * 3600 * 1000));
  let minutes = Math.floor(timeDiff / (60 * 1000));
  if (type === "hours") return hours
  if (type === "days") return days
  if (type === "minutes") return minutes
}

// 获取前N个月
const createDateDate = (n, isNow = false, fenge) => {
  let datelist = []
  let date = new Date()
  let Y = date.getFullYear()
  let M = date.getMonth()

  // 判断这个月算不算在内
  if (isNow) M++

  // 循环递减
  for (let i = 0; i < n; i++) {
    let dateoption = ''

    // 判断是否为1月
    if (M - 1 !== -1) {} else {
      M = 12
      Y = Y - 1
    }

    // 小于10，格式就变成0x，例如:01
    let m = M
    m = m < 10 ? '0' + m : m

    // 如果有分隔符，那么就通过分隔符号来分隔
    if (fenge) {
      dateoption = Y + '' + fenge + m
    } else {
      dateoption = Y + '年' + m + '月'
    }

    // 递减
    M--

    // 保存数据
    datelist.push(dateoption)
  }
  return datelist
}

// 获取日期差
const dateDiff = function (nowTime, compairTime) {
  //nowTime和compairTime是yyyy-MM-dd格式
  let aDate, oDate1, oDate2, iDays;
  aDate = nowTime.split("-");
  oDate1 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]); //转换为yyyy-MM-dd格式
  aDate = compairTime.split("-");
  oDate2 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]);
  iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  return iDays; //返回相差天数
}

// 获取Url参数
const urlParams = function (url) {
  let obj = {}
  let str = url.slice(url.indexOf('?') + 1)
  let arr = str.split('&')
  for (let j = arr.length, i = 0; i < j; i++) {
    let arr_temp = arr[i].split('=')
    obj[arr_temp[0]] = arr_temp[1]
  }
  return obj
}

module.exports = {
  formatTime,
  wxReq,
  verifyTel,
  getTimeDiff,
  createDateDate,
  getTimestamp,
  dateDiff,
  urlParams,
	reloadThisPage,
	isIfLogin
}
