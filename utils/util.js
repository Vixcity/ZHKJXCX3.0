const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const isIfLogin = () => {
  return !!wx.getStorageSync("isLogin");
};

// 封装请求
const wxReq = (data, path) => {
  return new Promise((resolve, reject) => {
    // wx.request()  小程序发送请求
    wx.request({
      // 把调用axios时传过来的所有参数解构赋值
      ...data,
      // 把地址和请求的地址拼接起来
      url: getApp().globalData.api + data.url,
      header: {
        cookie: wx.getStorageSync("sessionid"), //读取本地保存好的cookie,
      },
      // 请求成功之后调用的函数
      success: (result) => {
        if (result.data.code === 200) {
          resolve(result);
        } else if (result.data.code === 401) {
          wx.reLaunch({
            url: path
              ? "/pages/signUp/signUp?path=" + path
              : "/pages/signUp/signUp?path=" +
                getApp().globalData.homePage.slice(7).split("/")[0],
          });
          // 未登录，返回登录界面
          wx.lin.showMessage({
            type: "error",
            duration: 3000,
            content: result.data.msg,
            top: getApp().globalData.navH,
          });
        } else if (result.data.code === 406) {
          wx.lin.showMessage({
            type: "error",
            duration: 3000,
            content: result.data.msg,
            top: getApp().globalData.navH,
          });
        } else {
          // 其它错误
          wx.lin.showMessage({
            type: "error",
            duration: 3000,
            content: result.data.msg,
            top: getApp().globalData.navH,
          });
        }
      },
      // 请求失败之后调用的函数
      fail: (error) => {
        reject(error);
      },
    });
  });
};

/*函数防抖（定时器）：如果interval不传，则默认1000ms*/
const debounce = (fn, interval) => {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
};

// 刷新页面
function reloadThisPage() {
  let currentPages = getCurrentPages();
  let lastRoute = currentPages[currentPages.length - 1].route;
  let options = currentPages[currentPages.length - 1].options;
  let optionsStr = "";
  for (let key in options) {
    optionsStr += "?" + key + "=" + options[key];
  }
  wx.redirectTo({
    url: "/" + lastRoute + optionsStr,
  });
}

// 验证手机号
function verifyTel(tel) {
  let reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
  if (reg.test(tel)) {
    return true;
  }
  return false;
}

// 获取时间戳
const getTimestamp = (n) => {
  // 时间格式 2015-03-05 17:59:00
  var date = n;
  date = date.substring(0, 19);
  date = date.replace(/-/g, "/");
  var timestamp = new Date(date).getTime();
  // console.log(timestamp);
  return timestamp;
};

// 获取时间差，时间戳传入
const getTimeDiff = (time1, time2, type = "hours") => {
  let timeDiff = time1 > time2 ? time1 - time2 : time2 - time1;
  let hours = Math.floor(timeDiff / (3600 * 1000));
  let days = Math.floor(timeDiff / (24 * 3600 * 1000));
  let minutes = Math.floor(timeDiff / (60 * 1000));
  if (type === "hours") return hours;
  if (type === "days") return days;
  if (type === "minutes") return minutes;
};

// 获取前N个月
const createDateDate = (n, isNow = false, fenge) => {
  let datelist = [];
  let date = new Date();
  let Y = date.getFullYear();
  let M = date.getMonth();

  // 判断这个月算不算在内
  if (isNow) M++;

  // 循环递减
  for (let i = 0; i < n; i++) {
    let dateoption = "";

    // 判断是否为1月
    if (M - 1 !== -1) {
    } else {
      M = 12;
      Y = Y - 1;
    }

    // 小于10，格式就变成0x，例如:01
    let m = M;
    m = m < 10 ? "0" + m : m;

    // 如果有分隔符，那么就通过分隔符号来分隔
    if (fenge) {
      dateoption = Y + "" + fenge + m;
    } else {
      dateoption = Y + "年" + m + "月";
    }

    // 递减
    M--;

    // 保存数据
    datelist.push(dateoption);
  }
  return datelist;
};

// 获取日期差
const dateDiff = function (nowTime, compairTime) {
  //nowTime和compairTime是yyyy-MM-dd格式
  let aDate, oDate1, oDate2, iDays;
  aDate = nowTime.split("-");
  oDate1 = new Date(aDate[0] + "-" + aDate[1] + "-" + aDate[2]); //转换为yyyy-MM-dd格式
  aDate = compairTime.split("-");
  oDate2 = new Date(aDate[0] + "-" + aDate[1] + "-" + aDate[2]);
  iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  return iDays; //返回相差天数
};

// 格式化时间
const formatDate = function (time, format = "yyyy-MM-DD") {
  let t = new Date(time);
  let tf = function (i) {
    return (i < 10 ? "0" : "") + i;
  };
  return format.replace(/yyyy|YYYY|MM|dd|DD|HH|hh|mm|ss|SS/g, function (a) {
    switch (a) {
      case "yyyy":
        return tf(t.getFullYear());
        break;
      case "YYYY":
        return tf(t.getFullYear());
        break;
      case "MM":
        return tf(t.getMonth() + 1);
        break;
      case "dd":
        return tf(t.getDate());
        break;
      case "DD":
        return tf(t.getDate());
        break;
      case "hh":
        return tf(t.getHours());
        break;
      case "HH":
        return tf(t.getHours());
        break;
      case "mm":
        return tf(t.getMinutes());
        break;
      case "ss":
        return tf(t.getSeconds());
        break;
      case "SS":
        return tf(t.getSeconds());
        break;
    }
  });
};

// 获取Url参数
const urlParams = function (url) {
  let obj = {};
  let str = url.slice(url.indexOf("?") + 1);
  let arr = str.split("&");
  for (let j = arr.length, i = 0; i < j; i++) {
    let arr_temp = arr[i].split("=");
    obj[arr_temp[0]] = arr_temp[1];
  }
  return obj;
};

// 获取公司列表
const getClientList = function (path) {
  wxReq(
    {
      url: "/client/type/lists",
      method: "GET",
    },
    path
  ).then((res) => {
    let arr = [];
    res.data.data.forEach((item, index) => {
      let arr1 = [];
      if (item.rel_tag || item.public_tag) {
        let tagList = [];

        if (item.public_tag) {
          tagList = tagList.concat(item.public_tag);
        }
        if (item.rel_tag) {
          tagList = tagList.concat(item.rel_tag);
        }

        tagList.forEach((itemSon, indexSon) => {
          let arr2 = [];
          if (itemSon.rel_client) {
            itemSon.rel_client.forEach((itemClient) => {
              arr2.push({
                text: itemClient.name,
                id: itemClient.id,
              });
            });
            arr1.push({
              text: itemSon.name,
              id: itemSon.id,
              children: arr2,
            });
          }
        });
      }
      arr.push({
        text: item.name,
        id: item.id,
        children: arr1,
      });
    });
    wx.setStorageSync("clientList", arr);
  });
};

const getYarnType = function (path) {
  wxReq(
    {
      url: "/yarn/type/lists",
      method: "GET",
    },
    path
  ).then((res) => {
    let arr = [
      {
        text: "纱线",
        id: 1,
        children: [],
      },
      {
        text: "面料",
        id: 2,
        children: [],
      },
      {
        text: "毛料",
        id: 3,
        children: [],
      },
      {
        text: "装饰辅料",
        id: 4,
        children: [],
      },
      {
        text: "包装辅料",
        id: 5,
        children: [],
      },
    ];
    res.data.data.forEach((item) => {
      let obj = {
        text: item.name,
        id: item.id,
        children: [],
      };
      item.yarn_data.forEach((yarnData) => {
        obj.children.push({
          text: yarnData.name,
          id: yarnData.id,
        });
      });

      arr[item.type - 1].children.push(obj);
    });
    wx.setStorageSync("yarnType", arr);
  });
};

// 获取辅料列表
const getAssistList = function (path) {
  wxReq(
    {
      url: "/decorate/material/lists",
      method: "GET",
    },
    path
  ).then((res) => {
    let arr = res.data.data.map((item) => {
      return {
        text: item.name,
        id: item.id,
        unit: item.unit,
      };
    });
    wx.setStorageSync("assistList", arr);
  });
};

// 获取包装列表
const getPackingList = function (path) {
  wxReq(
    {
      url: "/pack/material/lists",
      method: "GET",
    },
    path
  ).then((res) => {
    let arr = res.data.data.map((item) => {
      return {
        text: item.name,
        id: item.id,
        item,
      };
    });

    wx.setStorageSync("packingList", arr);
  });
};

// 获取工序列表
const getProcessList = function (path) {
  wxReq(
    {
      url: "/process/lists",
      data: {
        type: 2,
      },
      method: "GET",
    },
    path
  ).then((res) => {
    wxReq({
      url: "/process/lists",
      data: {
        type: 3,
      },
      method: "GET",
    }).then((ress) => {
      let arr1 = res.data.data.map((item) => {
        return {
          text: item.name,
          id: item.name,
        };
      });
      let arr2 = ress.data.data.map((item) => {
        return {
          text: item.name,
          id: item.name,
        };
      });

      wx.setStorageSync("processList", [
        {
          text: "织造工序",
          id: 0,
          children: [
            {
              text: "针织织造",
              id: "针织织造",
            },
            {
              text: "梭织织造",
              id: "梭织织造",
            },
            {
              text: "制版费",
              id: "制版费",
            },
          ],
        },
        {
          text: "半成品加工工序",
          id: 2,
          children: arr1,
        },
        {
          text: "成品加工工序",
          id: 3,
          children: arr2,
        },
      ]);
    });
  });
};

// 获取对应的状态中文
const getChineseStatus = function (number) {
  if (number === 0) return "待审核";
  if (number === 1) return "已审核";
  if (number === 2) return "已驳回";
};

// 获取对应的状态图片
const getStatusImage = function () {
  return [
    "https://file.zwyknit.com/waiting.png",
    "https://file.zwyknit.com/pass.png",
    "https://file.zwyknit.com/return.png",
  ];
};

// 获取小组列表
const getGroupList = function (path) {
  wxReq(
    {
      url: "/user/group/list",
      method: "GET",
    },
    path
  ).then((res) => {
    let arr = [
      {
        text: "全部",
        id: "",
      },
    ];
    res.data.data.forEach((item) => {
      arr.push({
        text: item.name,
        id: item.id,
      });
    });
    wx.setStorageSync("groupList", arr);
  });
};

// 获取分类列表
const getProductTypeList = function (path) {
  wxReq(
    {
      url: "/category/lists",
      method: "GET",
    },
    path
  ).then((res) => {
    let data = res.data.data;
    let arr = [];
    data.forEach((item) => {
      let obj = {
        text: item.name,
        id: item.id,
        children: [],
      };
      item.secondary_category.forEach((category) => {
        let catObj = {
          text: category.name,
          id: category.id,
        };
        obj.children.push(catObj);
      });
      arr.push(obj);
    });
    wx.setStorageSync("productTypeList", arr);
  });
};

// 获取负责人列表
const getUserList = function (path) {
  wxReq(
    {
      url: "/user/lists",
      method: "GET",
    },
    path
  ).then((res) => {
    let arr = [
      {
        text: "全部",
        id: "",
      },
    ];
    res.data.data.forEach((item) => {
      arr.push({
        text: item.name,
        id: item.id,
      });
      wx.setStorageSync("userList", arr);
    });
  });
};

// 获取日期范围
const getSomeDateList = function () {
  let arr = [
    {
      text: "全部",
      id: ["", ""],
    },
    {
      text: "最近一周",
      id: [getDay(-7), getDay(0)],
    },
    {
      text: "最近一月",
      id: [getDay(-30), getDay(0)],
    },
    {
      text: "最近三月",
      id: [getDay(-90), getDay(0)],
    },
    {
      text: "最近半年",
      id: [getDay(-182), getDay(0)],
    },
    {
      text: "最近一年",
      id: [getDay(-365), getDay(0)],
    },
  ];
  wx.setStorageSync("someDateList", arr);
};

// 获取到N天后的日期,传入一个数字,可以是负数
const getDay = function (day) {
  let today = new Date();

  let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

  today.setTime(targetday_milliseconds); //注意，这行是关键代码

  let tYear = today.getFullYear();
  let tMonth = today.getMonth();
  let tDate = today.getDate();

  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
};

// 如果没有10就转换成0x的格式
const doHandleMonth = function (month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
};

// 拿到日期列表
const getDateList = function (day1, day2) {
  var getDate = function (str) {
    var tempDate = new Date();
    var list = str.split("-");
    tempDate.setFullYear(list[0]);
    tempDate.setMonth(list[1] - 1);
    tempDate.setDate(list[2]);
    return tempDate;
  };
  var date1 = getDate(day1);
  var date2 = getDate(day2);
  if (date1 > date2) {
    var tempDate = date1;
    date1 = date2;
    date2 = tempDate;
  }
  date1.setDate(date1.getDate() + 1);
  var dateArr = [];
  var i = 0;
  while (
    !(
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    )
  ) {
    var dayStr = date1.getDate().toString();
    if (dayStr.length == 1) {
      dayStr = "0" + dayStr;
    }
    var monthStr =
      date1.getMonth() + 1 < 10
        ? "0" + (date1.getMonth() + 1)
        : date1.getMonth() + 1;
    dateArr[i] = date1.getFullYear() + "-" + monthStr + "-" + dayStr;
    i++;
    date1.setDate(date1.getDate() + 1);
  }
  dateArr.splice(0, 0, day1);
  dateArr.push(day2);
  return dateArr;
};

// 格式化富文本
const contentHtml = function (content) {
  // 富文本编辑器的内容如何只获得文字去掉标签
  // content = content.replace(/<[^>]+>/g, '')
  // 在上面的基础上还去掉了换行<br/>
  content = content.replace(/<[^>]+>/g, "").replace(/(\n)/g, "");
  return content;
};

// 利用JSON进行克隆
const jsonClone = function (params) {
  return JSON.parse(JSON.stringify(params));
};

// 单据列表
const getBillingList = function () {
  return [
    {
      path: "/billingManagement/rawMaterialPlan/rawMaterialPlan",
      name: "原料计划单",
      id: "tab" + 0,
    },
    {
      path: "/billingManagement/rawMaterialSupplement/rawMaterialSupplement",
      name: "原料补充单",
      id: "tab" + 1,
    },
    {
      path:
        "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder",
      name: "原料订购单",
      id: "tab" + 2,
    },
    {
      path:
        "/billingManagement/rawMaterialTransferOrder/rawMaterialTransferOrder",
      name: "原料调取单",
      id: "tab" + 3,
    },
    {
      path:
        "/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrder",
      name: "原料加工单",
      id: "tab" + 4,
    },
    {
      path: "/billingManagement/productionPlan/productionPlan",
      name: "生产计划单",
      id: "tab" + 5,
    },
    {
      path:
        "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument",
      name: "检验入库单据",
      id: "tab" + 6,
    },
    {
      path: "/billingManagement/workshopSettlementLog/workshopSettlementLog",
      name: "车间结算日志",
      id: "tab" + 7,
    },
    {
      path:
        "/billingManagement/auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrder",
      name: "辅料订购单",
      id: "tab" + 8,
    },
    {
      path: "/billingManagement/packingOrder/packingOrder",
      name: "包装订购单",
      id: "tab" + 9,
    },
    {
      path:
        "/billingManagement/transportationDeliveryOrder/transportationDeliveryOrder",
      name: "运输出库单",
      id: "tab" + 10,
    },
    {
      path: "/billingManagement/deductionForm/deductionForm",
      name: "我方扣款单据",
      id: "tab" + 11,
    },
    {
      path: "/billingManagement/ourInvoiceList/ourInvoiceList",
      name: "我方发票单据",
      id: "tab" + 12,
    },
    {
      path: "/billingManagement/oppositeInvoicing/oppositeInvoicing",
      name: "对方发票单据",
      id: "tab" + 13,
    },
    {
      path: "/billingManagement/collectionList/collectionList",
      name: "收款单据",
      id: "tab" + 14,
    },
    {
      path: "/billingManagement/paymentDocument/paymentDocument",
      name: "付款单据",
      id: "tab" + 15,
    },
  ];
};

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
  isIfLogin,
  debounce,
  formatDate,
  getClientList,
  getYarnType,
  getAssistList,
  getPackingList,
  getProcessList,
  getGroupList,
  getUserList,
  getProductTypeList,
  getDay,
  doHandleMonth,
  getDateList,
  getChineseStatus,
  getSomeDateList,
  getStatusImage,
  contentHtml,
  jsonClone,
  getBillingList,
};
