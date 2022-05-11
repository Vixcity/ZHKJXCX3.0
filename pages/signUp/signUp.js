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
    user_name: "17602103060",
    password: "123456",
  },

  onLoad: function (options) {
    this.setData(options);

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
      url: getApp().globalData.api.slice(0, -4) + "/auth/login",
      data: {
        password: this.data.password,
        user_name: this.data.user_name,
      },
      method: "POST",
      success: (res) => {
        if (res.data) {
          wx.setStorageSync("isLogin", true);
          wx.setStorageSync("token", res.data.data.token);

          wxReq({
            url: "/user/info",
            method: "GET",
            success: (ress) => {
              if (res.data) {
                wx.setStorageSync("userInfo", ress.data.data);

                wx.lin.showMessage({
                  type: "success",
                  duration: 3000,
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
            },
          });
        }
      },
    });
  },

  // 去其他界面
  toOtherPage() {
		let url = ''

    if(this.data.params1){
			url = "../" + this.data.path + "/" + this.data.path + "?" + this.data.params1
		} else {
			url = "../" + this.data.path + "/" + this.data.path
		}

    wx.reLaunch({
      url
    });
  },
});
