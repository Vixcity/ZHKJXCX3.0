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
          // 未登录
          if (
            wx.getStorageSync("user_name") !== "" &&
            wx.getStorageSync("password") !== ""
          ) {
            // 隐形登录
            wx.request({
              url: getApp().globalData.api.slice(0, -4) + "/api/auth/login",
              data: {
                password: wx.getStorageSync("password"),
                user_name: wx.getStorageSync("user_name"),
              },
              method: "POST",
              success: (res) => {
                if (!res.data.status) {
                  wx.lin.showMessage({
                    type: "error",
                    duration: 3000,
                    content: res.data.msg,
                    top: getApp().globalData.navH,
                  });

                  return;
                } else {
                  wx.setStorageSync("isLogin", true);
                  wx.setStorageSync("loginTime", new Date());

                  if (res.data.status) {
                    var cookie = res.header["Set-Cookie"];
                    if (cookie != null) {
                      wx.setStorageSync("sessionid", res.header["Set-Cookie"]); //服务器返回的 Set-Cookie，保存到本地
                    }
                  }

                  wx.request({
                    url:
                      getApp().globalData.api.slice(0, -4) + "/api/auth/info",
                    method: "POST",
                    header: {
                      cookie: res.header["Set-Cookie"],
                    },
                    success: (ress) => {
                      if (ress.data.status) {
                        ress.data.data.quanxianLen = ress.data.data.module_info.filter(
                          (item) => {
                            return typeof item !== "number";
                          }
                        ).length;
                        getClientList();
                        getProcessList();
                        getGroupList();
                        getUserList();
                        getStoreList();
                        getStaffList();
                        wx.setStorageSync("userInfo", ress.data.data);
                        resolve(wxReq(data, path));
                      }
                    },
                  });
                }
              },
              // 跳转登录页
              fail: () => {
                wx.redirectTo({
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
              },
            });
          } else {
            wx.redirectTo({
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
          }
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

// 验证身份证号
function checkIdCardNumber(idCardNumber) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(idCardNumber) === false) {
    return false;
  }
  return true;
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
  oDate1 = new Date(aDate[0] + "/" + aDate[1] + "/" + aDate[2]); //转换为yyyy/MM/dd格式
  aDate = compairTime.split("-");
  oDate2 = new Date(aDate[0] + "/" + aDate[1] + "/" + aDate[2]);
  iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  return iDays; //返回相差天数
};

// 格式化时间
const formatDate = function (time, format = "yyyy-MM-DD") {
  if (time[time.length - 1] === "Z") {
    let timeArr = time.split("T");
    timeArr[1] = timeArr[1].split(".")[0];
    time = timeArr[0].replaceAll("-", "/") + " " + timeArr[1];
  }

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

// 获取原料列表
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
    "https://file.zwyknit.com/error.png",
    "https://file.zwyknit.com/error.png",
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

// 获取员工列表
const getStaffList = function (path) {
  wxReq(
    {
      url: "/staff/list",
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
    wx.setStorageSync("staffList", arr);
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

// 获取仓库列表
const getStoreList = function (path) {
  wxReq(
    {
      url: "/store/lists",
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
        item,
      });
    });
    wx.setStorageSync("storeList", arr);
  });
};

// 获取部门列表
const getDepartmentList = function (path) {
  wxReq(
    {
      url: "/staff/department/list",
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
        item,
      });
    });
    wx.setStorageSync("departmentList", arr);
  });
};
// 异步获取部门列表
const getDepartmentListSync = function (path) {
  return new Promise((resolve, reject) => {
    wxReq(
      {
        url: "/staff/department/list",
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
          item,
        });
      });
      wx.setStorageSync("departmentList", arr);
      resolve(arr);
    });
  });
};

// 获取订单进行状态
const getOrderStatusList = function () {
  return [
    { id: 0, text: "", color: "" },
    { id: 1, text: "已创建", color: "colorOrange" },
    { id: 2, text: "进行中", color: "color27A2" },
    { id: 3, text: "已完成", color: "color03d3" },
    { id: 4, text: "已结算", color: "color03d3" },
    { id: 5, text: "已取消", color: "color6" },
    { id: 6, text: "已逾期", color: "colorE800" },
  ];
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

// 拿到年份列表
const getYearList = function (year1 = 2018, year2 = new Date().getFullYear()) {
  let smallYear,
    bigYear = "";

  if (Number(year1) > Number(year2)) {
    smallYear = Number(year2);
    bigYear = Number(year1);
  } else {
    smallYear = Number(year1);
    bigYear = Number(year2);
  }

  let arr = [];

  for (let i = 0; i < bigYear - smallYear + 1; i++) {
    arr.push({ id: smallYear + i, text: smallYear + i + "年" });
  }

  return arr;
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
      show: isHasPermissions("21-1"),
    },
    {
      path: "/billingManagement/rawMaterialSupplement/rawMaterialSupplement",
      name: "原料补充单",
      id: "tab" + 1,
      show: isHasPermissions("21-2"),
    },
    {
      path:
        "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder",
      name: "原料订购单",
      show: isHasPermissions("21-3"),
      id: "tab" + 2,
    },
    {
      path:
        "/billingManagement/rawMaterialTransferOrder/rawMaterialTransferOrder",
      name: "原料调取单",
      show: isHasPermissions("21-4"),
      id: "tab" + 3,
    },
    {
      path:
        "/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrder",
      name: "原料加工单",
      show: isHasPermissions("21-5"),
      id: "tab" + 4,
    },
    {
      path: "/billingManagement/productionPlan/productionPlan",
      name: "生产计划单",
      id: "tab" + 5,
      show: isHasPermissions("21-6"),
    },
    {
      path:
        "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument",
      name: "检验入库单据",
      show: isHasPermissions("21-15"),
      id: "tab" + 6,
    },
    {
      path: "/billingManagement/workshopSettlementLog/workshopSettlementLog",
      name: "车间结算日志",
      id: "tab" + 7,
      show: isHasPermissions("21-7"),
    },
    {
      path:
        "/billingManagement/auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrder",
      name: "辅料订购单",
      show: isHasPermissions("21-8"),
      id: "tab" + 8,
    },
    {
      path: "/billingManagement/packingOrder/packingOrder",
      name: "包装订购单",
      id: "tab" + 9,
      show: isHasPermissions("21-9"),
    },
    {
      path:
        "/billingManagement/transportationDeliveryOrder/transportationDeliveryOrder",
      name: "运输出库单",
      show: isHasPermissions("21-10"),
      id: "tab" + 10,
    },
    {
      path: "/billingManagement/deductionForm/deductionForm",
      name: "我方扣款单据",
      id: "tab" + 11,
      show: isHasPermissions("21-11"),
    },
    {
      path: "/billingManagement/ourInvoiceList/ourInvoiceList",
      name: "我方发票单据",
      id: "tab" + 12,
      show: isHasPermissions("21-12"),
    },
    {
      path: "/billingManagement/oppositeInvoicing/oppositeInvoicing",
      name: "对方发票单据",
      id: "tab" + 13,
      show: isHasPermissions("21-16"),
    },
    {
      path: "/billingManagement/collectionList/collectionList",
      name: "收款单据",
      id: "tab" + 14,
      show: isHasPermissions("21-13"),
    },
    {
      path: "/billingManagement/paymentDocument/paymentDocument",
      name: "付款单据",
      id: "tab" + 15,
      show: isHasPermissions("21-14"),
    },
  ];
};

// 拿到对象的类型
const getDataType = function (data) {
  if (data === null) {
    return "Null";
  } else if (data === undefined) {
    return "Undefined";
  }
  return Object.prototype.toString.call(data).split(" ")[1].split("]")[0];
};

// 克隆
const clone = function (data) {
  const type = getDataType(data);
  let newData = null;
  if (type === "Array") {
    newData = [];
    data.forEach((item, index) => {
      newData[index] = clone(item);
    });
  } else if (type === "Object") {
    newData = {};
    let index;
    for (index of Object.keys(data)) {
      newData[index] = clone(data[index]);
    }
  } else {
    newData = data ? JSON.parse(JSON.stringify(data)) : data;
  }
  return newData;
};

// 根据规则合并数据
const mergeData = function (datas, rule) {
  const data = clone(datas);
  const newData = [];
  if (getDataType(data) === "Array") {
    data.forEach((item) => {
      const ruleType = getDataType(rule.mainRule);
      const flag = newData.find((value) => {
        if (ruleType === "Array") {
          // 处理根据多个key合并的情况
          const itemStr = [];
          const valueStr = [];
          rule.mainRule.forEach((itemMain) => {
            const mainName = itemMain.split("/");
            itemStr.push(item[mainName[0]]);
            valueStr.push(value[mainName[1] || mainName[0]]);
          });
          return itemStr.join("/") === valueStr.join("/");
        } else if (ruleType === "String") {
          const mainName = rule.mainRule.split("/");
          return value[mainName[1] || mainName[0]] === item[mainName[0]];
        }
      });
      const cloneItem = clone(item); // clone其他项数据以方便保留
      if (!flag) {
        const obj = {};
        if (ruleType === "Array") {
          rule.mainRule.forEach((itemRule) => {
            const mainName = itemRule.split("/");
            obj[mainName[1] || mainName[0]] = item[mainName[0]];
            delete cloneItem[mainName[0]];
          });
        } else if (ruleType === "String") {
          const mainName = rule.mainRule.split("/");
          obj[mainName[1] || mainName[0]] = item[mainName[0]];
          delete cloneItem[mainName[0]];
        }
        if (
          getDataType(rule.otherRule) === "Array" &&
          rule.otherRule.length > 0
        ) {
          rule.otherRule.forEach((itemRule) => {
            const otherName = itemRule.name.split("/");
            obj[otherName[1] || otherName[0]] = item[otherName[0]];
            delete cloneItem[otherName[0]];
          });
        }
        if (rule.childrenName) {
          obj[rule.childrenName] = [cloneItem];
        } else {
          obj.childrenMergeInfo = [cloneItem];
        }
        newData.push(obj);
      } else {
        if (ruleType === "Array") {
          rule.mainRule.forEach((itemMain) => {
            const mainName = itemMain.split("/");
            delete cloneItem[mainName[0]];
          });
        } else if (ruleType === "String") {
          const mainName = rule.mainRule.split("/");
          delete cloneItem[mainName[0]];
        }
        if (
          getDataType(rule.otherRule) === "Array" &&
          rule.otherRule.length > 0
        ) {
          rule.otherRule.forEach((itemRule) => {
            const otherName = itemRule.name.split("/");
            delete cloneItem[otherName[0]];
            if (itemRule.type === "add") {
              flag[otherName[1] || otherName[0]] =
                (Number(flag[otherName[1] || otherName[0]]) || 0) +
                (Number(item[otherName[0]]) || 0);
            } else if (itemRule.type === "concat") {
              flag[otherName[1] || otherName[0]] = flag[
                otherName[1] || otherName[0]
              ].concat(item[otherName[0]]);
            }
          });
        }
        if (rule.childrenName) {
          flag[rule.childrenName].push(cloneItem);
        } else {
          flag.childrenMergeInfo.push(cloneItem);
        }
      }
    });
    if (rule.childrenRule) {
      newData.forEach((item) => {
        item[rule.childrenName || "childrenMergeInfo"] = mergeData(
          item[rule.childrenName || "childrenMergeInfo"],
          rule.childrenRule
        );
      });
    }
  } else {
    const type = getDataType(data);
    throw new TypeError(
      'An unknown error occurred from the mergeData function, and the parameter "data" expects to get an "array" but gets an "' +
        type +
        '"'
    );
  }
  return newData;
};

// 权限
const systemModule = [
  {
    id: 1,
    name: "报价管理",
    detail: [
      {
        id: "1-1",
        name: "添加单据",
      },
      {
        id: "1-2",
        name: "修改单据",
      },
      {
        id: "1-3",
        name: "单据列表",
      },
      {
        id: "1-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 2,
    name: "样单管理",
    detail: [
      {
        id: "2-1",
        name: "添加单据",
      },
      {
        id: "2-2",
        name: "修改单据",
      },
      {
        id: "2-3",
        name: "单据列表",
      },
      {
        id: "2-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 3,
    name: "订单管理",
    detail: [
      {
        id: "3-1",
        name: "添加单据",
      },
      {
        id: "3-2",
        name: "修改单据",
      },
      {
        id: "3-3",
        name: "单据列表",
      },
      {
        id: "3-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 4,
    name: "物料计划",
    detail: [
      {
        id: "4-1",
        name: "添加单据",
      },
      {
        id: "4-2",
        name: "修改单据",
      },
      {
        id: "4-3",
        name: "单据列表",
      },
      {
        id: "4-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 5,
    name: "原料管理",
    detail: [
      {
        id: "5-1",
        name: "添加单据",
      },
      {
        id: "5-2",
        name: "修改单据",
      },
      {
        id: "5-3",
        name: "单据列表",
      },
      {
        id: "5-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 6,
    name: "辅料管理",
    detail: [
      {
        id: "6-1",
        name: "添加单据",
      },
      {
        id: "6-2",
        name: "修改单据",
      },
      {
        id: "6-3",
        name: "单据列表",
      },
      {
        id: "6-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 7,
    name: "物料出入库",
    detail: [
      {
        id: "7-1",
        name: "添加单据",
      },
      {
        id: "7-2",
        name: "修改单据",
      },
      {
        id: "7-3",
        name: "单据列表",
      },
      {
        id: "7-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 8,
    name: "生产计划",
    detail: [
      {
        id: "8-1",
        name: "添加单据",
      },
      {
        id: "8-2",
        name: "修改单据",
      },
      {
        id: "8-3",
        name: "单据列表",
      },
      {
        id: "8-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 9,
    name: "产品检验",
    detail: [
      {
        id: "9-1",
        name: "添加单据",
      },
      {
        id: "9-2",
        name: "修改单据",
      },
      {
        id: "9-3",
        name: "单据列表",
      },
      {
        id: "9-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 10,
    name: "装箱计划",
    detail: [
      {
        id: "10-1",
        name: "添加单据",
      },
      {
        id: "10-2",
        name: "修改单据",
      },
      {
        id: "10-3",
        name: "单据列表",
      },
      {
        id: "10-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 11,
    name: "包装管理",
    detail: [
      {
        id: "11-1",
        name: "添加单据",
      },
      {
        id: "11-2",
        name: "修改单据",
      },
      {
        id: "11-3",
        name: "单据列表",
      },
      {
        id: "11-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 12,
    name: "仓库管理",
    detail: [
      {
        id: "12-1",
        name: "纱线仓库",
      },
      {
        id: "12-2",
        name: "面料仓库",
      },
      {
        id: "12-3",
        name: "辅料仓库",
      },
      {
        id: "12-4",
        name: "产品仓库",
      },
    ],
  },
  {
    id: 13,
    name: "客户与合作商管理",
    detail: [
      {
        id: "13-1",
        name: "添加单据",
      },
      {
        id: "13-2",
        name: "修改单据",
      },
      {
        id: "13-3",
        name: "单据列表",
      },
      {
        id: "13-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 14,
    name: "原料预订购",
    detail: [
      {
        id: "14-1",
        name: "添加单据",
      },
      {
        id: "14-2",
        name: "修改单据",
      },
      {
        id: "14-3",
        name: "单据列表",
      },
      {
        id: "14-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 15,
    name: "工艺单管理",
    detail: [
      {
        id: "15-1",
        name: "添加单据",
      },
      {
        id: "15-2",
        name: "修改单据",
      },
      {
        id: "15-3",
        name: "单据列表",
      },
      {
        id: "15-4",
        name: "删除单据",
      },
    ],
  },
  {
    id: 16,
    name: "系统设置",
    detail: [
      {
        id: "16-1",
        name: "产品设置",
      },
      {
        id: "16-2",
        name: "订单设置",
      },
      {
        id: "16-3",
        name: "报价单设置",
      },
      {
        id: "16-4",
        name: "工序设置",
      },
      {
        id: "16-5",
        name: "工艺单设置",
      },
      {
        id: "16-6",
        name: "物料设置",
      },
      {
        id: "16-7",
        name: "工厂信息设置",
      },
      {
        id: "16-8",
        name: "系统账户设置",
      },
    ],
  },
  {
    id: 17,
    name: "员工管理",
    detail: [
      {
        id: "17-1",
        name: "添加员工",
      },
      {
        id: "17-2",
        name: "修改员工",
      },
      {
        id: "17-3",
        name: "员工列表",
      },
      {
        id: "17-4",
        name: "删除员工",
      },
    ],
  },
  {
    id: 18,
    name: "报销单管理",
    detail: [
      {
        id: "18-1",
        name: "添加报销单",
      },
      {
        id: "18-2",
        name: "修改报销单",
      },
      {
        id: "18-3",
        name: "报销单列表",
      },
      {
        id: "18-4",
        name: "删除报销单",
      },
    ],
  },
  {
    id: 19,
    name: "车间管理",
    detail: [
      {
        id: "19-1",
        name: "添加单据",
      },
      {
        id: "19-2",
        name: "修改单据",
      },
      {
        id: "19-3",
        name: "按订单录入列表",
      },
      {
        id: "19-4",
        name: "删除单据",
      },
      {
        id: "19-5",
        name: "按员工录入列表",
      },
    ],
  },
  {
    id: 20,
    name: "数据报表",
    detail: [
      {
        id: "20-1",
        name: "订单数据图表",
      },
      {
        id: "20-2",
        name: "样单数据图表",
      },
      {
        id: "20-3",
        name: "计划数据统计",
      },
      {
        id: "20-4",
        name: "订购数据统计",
      },
      {
        id: "20-5",
        name: "调取数据统计",
      },
      {
        id: "20-6",
        name: "加工数据统计",
      },
      {
        id: "20-7",
        name: "原料库存数据统计",
      },
      {
        id: "20-8",
        name: "装饰辅料订购图表",
      },
      {
        id: "20-9",
        name: "包装辅料订购图表",
      },
      {
        id: "20-10",
        name: "生产计划图表",
      },
      {
        id: "20-11",
        name: "检验收发图表",
      },
      {
        id: "20-12",
        name: "车间工资图表",
      },
      {
        id: "20-13",
        name: "运输出库图表",
      },
      {
        id: "20-14",
        name: "报销费用图表",
      },
    ],
  },
  {
    id: 21,
    name: "系统单据管理",
    detail: [
      {
        id: "21-1",
        name: "单据管理-原料计划单",
      },
      {
        id: "21-2",
        name: "单据管理-原料补充单",
      },
      {
        id: "21-3",
        name: "单据管理-原料订购单",
      },
      {
        id: "21-4",
        name: "单据管理-原料调取单",
      },
      {
        id: "21-5",
        name: "单据管理-原料加工单",
      },
      {
        id: "21-6",
        name: "单据管理-生产计划单",
      },
      {
        id: "21-7",
        name: "单据管理-车间结算日志",
      },
      {
        id: "21-8",
        name: "单据管理-辅料订购单",
      },
      {
        id: "21-9",
        name: "单据管理-包装订购单",
      },
      {
        id: "21-10",
        name: "单据管理-运输出库单",
      },
      {
        id: "21-11",
        name: "单据管理-我方扣款单据",
      },
      {
        id: "21-12",
        name: "单据管理-我方发票单据",
      },
      {
        id: "21-13",
        name: "单据管理-收款单据",
      },
      {
        id: "21-14",
        name: "单据管理-付款单据",
      },
      {
        id: "21-15",
        name: "单据管理-检验入库单据",
      },
      {
        id: "21-16",
        name: "单据管理-对方发票单据",
      },
      {
        id: "21-17",
        name: "单据管理-订单报价单对比单据",
      },
    ],
  },
  {
    id: 22,
    name: "客户结算",
    detail: [
      {
        id: "22-1",
        name: "客户收款列表",
      },
      {
        id: "22-2",
        name: "客户收款列表",
      },
      {
        id: "22-3",
        name: "客户付款列表",
      },
      {
        id: "22-4",
        name: "客户付款详情",
      },
    ],
  },
  {
    id: 23,
    name: "文件管理",
    detail: [
      {
        id: "23-1",
        name: "文件列表",
      },
    ],
  },
  {
    id: 24,
    name: "产品管理",
    detail: [
      {
        id: "24-3",
        name: "产品列表",
      },
    ],
  },
  {
    id: 25,
    name: "单证管理",
    detail: [
      {
        id: "25-1",
        name: "添加单证",
      },
      {
        id: "25-2",
        name: "修改单证",
      },
      {
        id: "25-3",
        name: "单证列表",
      },
      {
        id: "25-4",
        name: "删除单证",
      },
    ],
  },
];

// 判断是否有权限
const isHasPermissions = (id) => {
  const moduleId = wx.getStorageSync("userInfo").module_info;
  if (!moduleId) return false;
  return moduleId.includes(id);
};

// 数字金额转换中文汉字金额
function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array(
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九"
  );
  //基本单位
  var cnIntRadice = new Array("", "十", "百", "千");
  //对应整数部分扩展单位
  var cnIntUnits = new Array("", "万", "亿", "兆");
  //对应小数部分单位
  var cnDecUnits = new Array("角", "分", "毫", "厘");
  //整数金额时后面跟的字符
  var cnInteger = "";
  //整型完以后的单位
  var cnIntLast = "";
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = "";
  //分离金额后用的数组，预定义
  var parts;
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return "";
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast + "元";
  }
  //小数部分
  if (decimalNum != "") {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      } else if (n == "0") {
        chineseStr += cnNums[Number(n)];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  }

  return chineseStr;
}

function isNumber(obj) {  
	return obj === +obj  
}

/**
 *判断是否为JSON字符串
 *@method isJSON
 *@str {string} 字符串
 *@return {boolean} 返回布尔值
*/
function isJSON(str) {
  if (typeof str == 'string') {
		try {
				var obj=JSON.parse(str);
				if(typeof obj == 'object' && obj ){
						return true;
				}else{
						return false;
				}

		} catch(e) {
				// console.log('error：'+str+'!!!'+e);
				return false;
		}
	}
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
	isIfLogin,
	isNumber,
	isJSON,
  debounce,
  formatDate,
  getClientList,
  getYarnType,
  getAssistList,
  getPackingList,
  getProcessList,
  getStaffList,
  getGroupList,
  getUserList,
  getStoreList,
  getDepartmentList,
  getDepartmentListSync,
  getProductTypeList,
  getOrderStatusList,
  getDay,
  getYearList,
  doHandleMonth,
  getDateList,
  getChineseStatus,
  getSomeDateList,
  getStatusImage,
  contentHtml,
  jsonClone,
  getBillingList,
  mergeData,
  getDataType,
  systemModule,
  isHasPermissions,
  clone,
  convertCurrency,
  checkIdCardNumber,
};
