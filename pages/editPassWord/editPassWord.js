const { wxReq } = require("../../utils/util");

// pages/editPassWord/editPassWord.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    isSendCode: false,
    surplusTime: 60,
  },

  onLoad() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo,
    });
  },

  inputNewPwd(e) {
    if (e.detail.value.length < 6) {
      this.setData({
        notAllow: true,
      });
      return;
    }

    this.setData({
      newPwd: e.detail.value,
      notAllow: false,
    });
  },

  inputNewPwdConfirm(e) {
    if (this.data.newPwd !== e.detail.value) {
      this.setData({
        notSamePwd: true,
      });
    } else {
      this.setData({
        notSamePwd: false,
      });
    }
  },

  yanzhenCodeValue(e) {
    this.setData({
      yanzhenCode: e.detail.value,
    });
  },

  submitEdit() {
    if (!this.data.newPwd) {
      wx.lin.showMessage({
        type: "error",
        duration: 2000,
        content: "请输入符合密码格式的密码",
        top: getApp().globalData.navH,
      });
      return;
    }
    if (this.data.notSamePwd === true || this.data.notSamePwd === undefined) {
      wx.lin.showMessage({
        type: "error",
        duration: 2000,
        content: "两次新密码不一致",
        top: getApp().globalData.navH,
      });
      return;
    }
    if (!this.data.yanzhenCode) {
      wx.lin.showMessage({
        type: "error",
        duration: 2000,
        content: "请输入验证码",
        top: getApp().globalData.navH,
      });
      return;
    }

    wxReq(
      {
        url: "/user/change/password",
        data: {
          new_password: this.data.newPwd,
          sms_code: this.data.yanzhenCode,
        },
        method: "POST",
      },
      "/pages/editPassWord/editPassWord"
    ).then((res) => {
      wx.reLaunch({
        url: "/pages/signUp/signUp?isEditPwd=" + true,
      });
    }).catch(res => {
			console.log(res.data)
		});
  },

  sendCode() {
    wxReq(
      {
        url: "/user/change/password/send/sms",
        method: "POST",
      },
      "/pages/editPassWord/editPassWord"
    ).then((res) => {
      if (res.data.status) {
        this.setData({
          isSendCode: true,
        });

        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "发送成功",
          top: getApp().globalData.navH,
        });

        let that = this;
        let int = setInterval(function () {
          let surplusTime = that.data.surplusTime - 1;
          if (surplusTime === 0) {
            clearInterval(int);
            that.setData({
              isSendCode: false,
              surplusTime: 60,
            });
          } else {
            that.setData({
              surplusTime,
            });
          }
        }, 1000);
      } else {
        wx.lin.showMessage({
          type: "error	",
          duration: 2000,
          content: "发送成功",
          top: getApp().globalData.navH,
        });
      }
    });
	},
	
	toManage(){
		wx.reLaunch({
			url: '/pages/manage/manage',
		})
	},
});
