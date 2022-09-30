import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
// index.js
const {
  isIfLogin,
  urlParams,
  isHasPermissions,
  wxReq,
} = require("../../utils/util");

Page({
  data: {
    list: [],
  },

  onShareAppMessage: function () {
    return {
      title: "纺织业领先的协同制造云平台",
      path: "/pages/index/index", // 路径，传递参数到指定页面。
      imageUrl:
        "https://file.zwyknit.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%88%86%E4%BA%AB%E5%9B%BE-1.png",
    };
  },

  onShow() {
		const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });

    if (!isLogin) {
      this.toSignUp();
    }

    wx.hideHomeButton();
    let userInfo = wx.getStorageSync("userInfo");
    if (
      isLogin &&
      wx.getStorageSync("refuses") === "" &&
      userInfo.bind_wechat !== 1
    ) {
      Dialog.confirm({
        title: "建议开启通知",
        message: "开启后，会收到平台系统消息通知",
      })
        .then(() => {
          wx.getUserInfo({
            success: (res) => {
              let iv = res.iv;
              let encryptedData = res.encryptedData;
              wx.login({
                success: (res) => {
                  if (res.code) {
                    wxReq(
                      {
                        url: "/wechat/bind/user",
                        data: {
                          code: res.code,
                          iv,
                          encryptedData,
                        },
                        method: "POST",
                      },
                      "/pages/index/index"
                    ).then((res) => {
                      if (res.data.status) {
                        wx.lin.showMessage({
                          type: "success",
                          duration: 3000,
                          content: "绑定成功",
                          top: getApp().globalData.navH,
                        });
                        this.getUserInfo();
                      }
                    });
                  }
                },
              });
            },
          });
        })
        .catch(() => {
          wx.setStorageSync("refuses", false);
        });
    }
    this.setData({
      userInfo,
      list: [
        // {
        //   title: "本厂生产中",
        //   src: "/pages/ourFactory/ourFactory?type=1",
        // },
        {
          title: "检验收发",
          src: "/pages/ourFactory/ourFactory",
          show: isHasPermissions("9-3"),
          icon:
            "https://file.zwyknit.com/%E5%A4%96%E5%8D%8F%E7%BB%91%E5%AE%9A.png",
        },
        {
          title: "报价单管理",
          src: "/pages/quotedPrice/quotedPrice",
          show: isHasPermissions("1-3"),
          icon:
            "https://file.zwyknit.com/%E6%8A%A5%E4%BB%B7%E7%AE%A1%E7%90%86.png",
        },
        {
          title: "样单管理",
          src: "/pages/sampleOrder/sampleOrder",
          show: isHasPermissions("2-3"),
          icon:
            "https://file.zwyknit.com/%E6%A0%B7%E5%8D%95%E7%AE%A1%E7%90%86.png",
        },
        {
          title: "订单管理",
          src: "/pages/order/order",
          show: isHasPermissions("3-3"),
          icon:
            "https://file.zwyknit.com/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86%20.png",
        },
        {
          title: "报销单管理",
          src: "/pages/reimbursementManage/reimbursementManage",
          show: isHasPermissions("18-3"),
          icon:
            // "https://file.zwyknit.com/%E6%92%A4%E9%94%80%E5%8D%95%E7%AE%A1%E7%90%86.png",
            "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220729095659-1.png",
        },
        {
          title: "单据管理",
          src: "/pages/billingManagement/index",
          show: isHasPermissions(21),
          icon:
            "https://file.zwyknit.com/%E5%8D%95%E6%8D%AE%E7%AE%A1%E7%90%86.png",
        },
        {
          title: "员工管理",
          src: "/pages/staffList/staffList",
          show: isHasPermissions('17-3'),
          icon:
            "https://file.zwyknit.com/%E5%91%98%E5%B7%A5%E7%AE%A1%E7%90%86.png",
				},
				// {
        //   title: "车间管理",
        //   src: "/pages/workshopManagement/workshopManagement",
        //   show: isHasPermissions('19-3') || isHasPermissions('19-5'),
        //   icon:
        //     "https://file.zwyknit.com/%E8%BD%A6%E9%97%B4%E7%AE%A1%E7%90%86.png",
        // },
      ],
    });
  },

  getUserInfo() {
    wxReq(
      {
        url: "/auth/info",
        method: "post",
      },
      "/pages/index/index"
    ).then((ress) => {
      if (ress.data.status) {
        ress.data.data.quanxianLen = ress.data.data.module_info.filter(
          (item) => {
            return typeof item !== "number";
          }
        ).length;
        wx.setStorageSync("userInfo", ress.data.data);
        this.setData({
          userInfo: ress.data.data,
        });
      }
    });
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
        console.log(res.result);
        if (
          res.result.slice(0, 40) === "https://knit-m-api.zwyknit.com/bindOrder"
        ) {
          let { company_id, hash, id } = urlParams(res.result);

          this.toOutsourcingAcceptance1(company_id, hash, id);
        } else {
          wx.navigateTo({
            url: res.result,
          });
        }
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },

  toOutsourcingAcceptance1(company_id, hash, id) {
    wx.setStorageSync("isCodeIn", { company_id, hash, id });
    wx.navigateTo({
      url: "/pages/outsourcingAcceptance/outsourcingAcceptance?isCodeIn=true",
    });
  },

  toManage() {
    wx.redirectTo({
      url: "/pages/manage/manage",
    });
  },
});
