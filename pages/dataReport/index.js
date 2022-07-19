// pages/dataReport/index.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { isIfLogin } = require("../../utils/util");

Page({
  data: {
    list: [
      {
        title: "订单数据图表",
        src: "/pages/ourFactory/ourFactory?type=1",
      },
      {
        title: "样单数据图表",
        src: "/pages/ourFactory/ourFactory?type=2",
      },
      {
        title: "原料使用图表",
        src: "/pages/quotedPrice/quotedPrice",
      },
      {
        title: "辅料使用图表",
        src: "/pages/sampleOrder/sampleOrder",
      },
      {
        title: "生产数据图表",
        src: "/pages/order/order",
      },
      {
        title: "其它费用图表",
        src: "/pages/reimbursementManage/reimbursementManage",
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
        selected: 1,
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
      url: "/pages/signUp/signUp",
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
