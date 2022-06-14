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
    // user_name: "15068715652",
    // user_name: "",
    // password: "",
    // password: "15068715652",
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
      url: getApp().globalData.api.slice(0, -4) + "/api/auth/login",
      data: {
        password: this.data.password,
        user_name: this.data.user_name,
      },
      method: "POST",
      success: (res) => {
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
          }).then(ress => {
						if (ress.data.status) {
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
					})
        }
      },
    });
  },

  // 去其他界面
  toOtherPage() {
    let url = "";

    if (this.data.params1) {
      url =
        "../" +
        this.data.path +
        "/" +
        this.data.path +
        "?" +
        decodeURIComponent(this.data.params1);
    } else {
      url = "../" + this.data.path + "/" + this.data.path;
    }

    wx.reLaunch({
      url,
    });
  },
});
