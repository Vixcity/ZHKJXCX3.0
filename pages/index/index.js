import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
// index.js
const { isIfLogin } = require("../../utils/util");

Page({
  data: {
    list: [
      {
        title: "本厂生产中",
        src: "/pages/ourFactory/ourFactory?type=1",
      },
      {
        title: "外协生产中",
        src: "/pages/ourFactory/ourFactory?type=2",
      },
      {
        title: "报价单管理",
        src: "/pages/quotedPrice/quotedPrice",
      },
      {
        title: "样单管理",
        src: "/pages/sampleOrder/sampleOrder",
      },
      {
        title: "订单管理",
        src: "/pages/order/order",
      },
      {
        title: "报销单管理",
        src: "/pages/ourFactory/ourFactory?type=3",
      },
      {
        title: "单据管理",
        src: "/pages/ourFactory/ourFactory?type=3",
      },
      {
        title: "检验管理",
        src: "/pages/ourFactory/ourFactory?type=3",
      },
    ],
  },

  onShow() {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });

    if (!isLogin) {
      this.toLogin();
    }

    wx.hideHomeButton();
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
    });

    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }
  },

  toDetailPage(e) {
    let { src } = e.currentTarget.dataset;
    wx.navigateTo({
      url: src,
    });
  },

  toSignUp() {
    wx.navigateTo({
      url: "/pages/signUp/signUp?path=index",
    });
  },

  toLogin(e) {
    if (e) {
      this.toSignUp();
    } else {
      Dialog.confirm({
        title: "您还未登录",
        message: "点击确认前往登录界面",
        zIndex: 11601,
      })
        .then(() => {
          this.toSignUp();
        })
        .catch(() => {
          wx.lin.showMessage({
            type: "error",
            duration: 4000,
            content: "您已取消，请登录以获取更好的用户体验",
            top: getApp().globalData.navH,
          });
        });
    }
  },
});
