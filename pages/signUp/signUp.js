import {
  getClientList,
  getProcessList,
  getGroupList,
  getUserList,
  wxReq,
} from "../../utils/util";
// index.js
Page({
  data: {
    user_name: "18958643187",
    password: "18958643187",
  },

  onLoad: function (options) {
    let path = "";

    // 拼接参数
    for (let key in options) {
      let value = options[key];
      if (key === "path") {
        path = ".." + value;
      } else if (key === "isEditPwd") {
        wx.lin.showMessage({
          type: "success",
          duration: 3000,
          content: "修改密码成功，请重新登录",
          top: getApp().globalData.navH,
        });
      } else {
        path += "&" + key + "=" + value;
      }
    }

    // 把第一个连接符号变成问号
    path = path.replace("&", "?");

    // 赋值
    this.setData({
      path,
    });

    wx.hideHomeButton();
  },

  bindKeyInput: function (e) {
    if (e.currentTarget.dataset.type === 1) {
      this.setData({
        user_name: e.detail.value,
      });
    }

    if (e.currentTarget.dataset.type === 2) {
      this.setData({
        password: e.detail.value,
      });
    }
  },

  // 点击登录
  postSignUp() {
    let _this = this;

    wx.request({
      url: getApp().globalData.api.slice(0, -4) + "/api/auth/login",
      data: {
        password: this.data.password,
        user_name: this.data.user_name,
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
        }

        if (res.data) {
          wx.setStorageSync("isLogin", true);
          wx.setStorageSync("loginTime", new Date());

          if (res.data.status) {
            var cookie = res.header["Set-Cookie"];
            if (cookie != null) {
              wx.setStorageSync("sessionid", res.header["Set-Cookie"]); //服务器返回的 Set-Cookie，保存到本地
            }
          }

          wxReq({
            url: "/auth/info",
            method: "post",
          }).then((ress) => {
            if (ress.data.status) {
              ress.data.data.quanxianLen = ress.data.data.module_info.filter(
                (item) => {
                  return typeof item !== "number";
                }
              ).length;
              wx.setStorageSync("userInfo", ress.data.data);

              wx.lin.showMessage({
                type: "success",
                duration: 1000,
                content: "登录成功，即将返回刚才的页面",
                top: getApp().globalData.navH,
              });

              getClientList();
              getProcessList();
              getGroupList();
              getUserList();

              setTimeout(function () {
                _this.toOtherPage();
              }, 2500);
            }
          });
        }
      },
    });
  },

  // 去其他界面
  toOtherPage() {
    let url = this.data.path || "/pages/index/index";

    wx.redirectTo({
      url,
    });
  },
});
