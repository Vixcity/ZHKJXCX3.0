import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
// index.js
const { isIfLogin, urlParams } = require("../../utils/util");

Page({
  data: {
    list: [
      // {
      //   title: "本厂生产中",
      //   src: "/pages/ourFactory/ourFactory?type=1",
      // },
      {
        title: "检验收发",
        src: "/pages/ourFactory/ourFactory?type=2",
        icon:
          "https://file.zwyknit.com/%E5%A4%96%E5%8D%8F%E7%BB%91%E5%AE%9A.png",
      },
      {
        title: "报价单管理",
        src: "/pages/quotedPrice/quotedPrice",
        icon:
          "https://file.zwyknit.com/%E6%8A%A5%E4%BB%B7%E7%AE%A1%E7%90%86.png",
      },
      {
        title: "样单管理",
        src: "/pages/sampleOrder/sampleOrder",
        icon:
          "https://file.zwyknit.com/%E6%A0%B7%E5%8D%95%E7%AE%A1%E7%90%86.png",
      },
      {
        title: "订单管理",
        src: "/pages/order/order",
        icon:
          "https://file.zwyknit.com/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86%20.png",
      },
      {
        title: "报销单管理",
        src: "/pages/reimbursementManage/reimbursementManage",
        icon:
          "https://file.zwyknit.com/%E6%92%A4%E9%94%80%E5%8D%95%E7%AE%A1%E7%90%86.png",
      },
      {
        title: "单据管理",
        src: "/pages/billingManagement/index",
        icon:
          "https://file.zwyknit.com/%E5%8D%95%E6%8D%AE%E7%AE%A1%E7%90%86.png",
      },
      // {
      //   title: "检验管理",
      //   src: "/pages/ourFactory/ourFactory?type=3",
      // },
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

  GetSandCode() {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        if (
          res.result.slice(0, 40) === "https://knit-m-api.zwyknit.com/bindOrder"
        ) {
					let { company_id, hash, id } = urlParams(res.result);
					console.log(company_id, hash, id)

          // this.toOutsourcingAcceptance1(company_id, hash, id);
        } else {
        }
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },
});
