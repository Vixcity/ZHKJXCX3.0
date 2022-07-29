// manages.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import { wxReq, isIfLogin } from "../../utils/util";

Page({
  data: {
    userInfo: null,
    showPopup: false,
    showImage: "",
    pageList: [
      {
        title: "生产计划",
        path: "../productPlan/productPlan",
        icon:
          "https://file.zwyknit.com/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86-01.png",
        index: 1,
      },
      {
        title: "外协绑定",
        path: "../userManagement/userManagement",
        icon:
          "https://file.zwyknit.com/%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86-01.png",
        index: 2,
      },
      {
        title: "员工管理",
        path: "../staffList/staffList",
        icon:
          "https://file.zwyknit.com/%E5%91%98%E5%B7%A5%E7%AE%A1%E7%90%86-01.png",
        index: 3,
      },
    ],
  },

  onShow: function () {
    let _this = this;

    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });

    // 订单管理初始化
    wx.setStorageSync("orderChooseIndex", "");

    if (this.data.userInfo === null) {
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo === "") {
        this.setData({
          showNoLogin: true,
        });
        return;
      }

      this.setData({
        userInfo: userInfo,
      });
    }
  },

  onHide: function () {
    this.setData({
      showPopup: false,
    });
  },

  toSignUp() {
    wx.navigateTo({
      url: "../signUp/signUp",
    });
  },

  toWitchPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    });
  },

  getWxACode() {
    let _this = this;
    let uuid = this.data.userInfo.userinfo.uuid;
    wxReq({
      url: "/wechat/wxacode",
      data: {
        path:
          "pages/addWorkShop/addWorkShop?uuid=" + uuid + "&time=" + Date.now(),
        width: 430,
        auto_color: false,
        line_color: {
          r: 0,
          g: 0,
          b: 0,
        },
        is_hyaline: false,
      },
      method: "POST",
    }).then(function (res) {
      if (res.data.code !== 200) {
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: "获取员工邀请码失败",
        });
        return;
      }
      _this.setData({
        showPopup: true,
        showImage: res.data.data,
      });
      wx.setStorageSync("作坊主小程序码", res.data.data);
      return;
    });
  },
  closePopup() {
    this.setData({
      showPopup: false,
    });
  },
  // 获取pageList
  getPageList(type) {
    const isLeader = type === 3;
    const isNormal = type === 1;

    if (!isLeader && !isNormal) {
      return {
        pageList: [
          {
            title: "数据统计",
            path: "../statistics/statistics?isStaff=true",
            icon:
              "https://file.zwyknit.com/%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1-01.png",
            index: 1,
          },
          {
            title: "历任作坊",
            path: "../historyWorkShop/historyWorkShop?isStaff=true",
            icon:
              "https://file.zwyknit.com/%E5%8E%86%E4%BB%BB%E4%BD%9C%E5%9D%8A-01.png",
            index: 2,
          },
        ],
      };
    }

    return {
      pageList: [
        {
          title: "生产计划",
          path: "../productPlan/productPlan?isLeader=" + isLeader,
          icon:
            "https://file.zwyknit.com/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86-01.png",
          index: 1,
        },
        {
          title: "外协绑定",
          path: "../userManagement/userManagement?isLeader=" + isLeader,
          icon:
            "https://file.zwyknit.com/%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86-01.png",
          index: 2,
        },
        {
          title: "数据统计",
          path: "../statistics/statistics?isLeader=" + isLeader,
          icon:
            "https://file.zwyknit.com/%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1-01.png",
          index: 3,
        },
        {
          title: "员工管理",
          path: "../workerManage/workerManage",
          icon:
            "https://file.zwyknit.com/%E5%91%98%E5%B7%A5%E7%AE%A1%E7%90%86-01.png",
          index: 4,
        },
      ],
    };
  },

  toLogin() {
    wx.navigateTo({
      url: "../signUp/signUp",
    });
  },

  bindCompany() {
    if (this.data.userInfo.bind_wechat === 1) {
      Dialog.confirm({
        title: "要将平台账号与微信解绑吗？",
        message: "不影响平台账号使用，只是无法通过微信收取业务通知。",
        zIndex: 11601,
      })
        .then(() => {
          wxReq(
            {
              url: "/wechat/rid/user",
              method: "POST",
            },
            "/pages/manage/manage"
          ).then((res) => {
            if (res.data.status) {
              wx.lin.showMessage({
                type: "success",
                duration: 3000,
                content: "解绑成功",
                top: getApp().globalData.navH,
              });
              this.getUserInfo();
            }
          });
        })
        .catch(() => {
          wx.lin.showMessage({
            duration: 3000,
            content: "您已取消解绑",
            top: getApp().globalData.navH,
          });
        });
    } else if (this.data.userInfo.bind_wechat === 2) {
      wx.login({
        success: (res) => {
          if (res.code) {
            wxReq(
              {
                url: "/wechat/bind/user",
                data: {
                  code: res.code,
                },
                method: "POST",
              },
              "/pages/manage/manage"
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
    }
  },

  getUserInfo() {
    wxReq(
      {
        url: "/auth/info",
        method: "post",
      },
      "/pages/manage/manage"
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

  GetSandCode() {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        if (
          res.result.slice(0, 40) === "https://knit-m-api.zwyknit.com/bindOrder"
        ) {
          let { company_id, hash, id } = urlParams(res.result);
          console.log(company_id, hash, id);

          // this.toOutsourcingAcceptance1(company_id, hash, id);
        } else {
        }
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },

  toMyJurisdiction() {
    wx.navigateTo({
      url: "/pages/myJurisdiction/myJurisdiction",
    });
  },

  toEditPwd() {
    wx.navigateTo({
      url: "/pages/editPassWord/editPassWord",
    });
  },

  logOut() {
    Dialog.confirm({
      title: "要退出登录吗？",
      message: "退出登录后无法使用小程序，需要重新登录。",
      zIndex: 11601,
    }).then(() => {
      wx.setStorageSync("sessionid", "");
      wx.setStorageSync("isLogin", false);
      wx.setStorageSync("userInfo", false);
      this.setData({
        userInfo: null,
        isLogin: false,
      });
    });
  },

  toIndex() {
    wx.redirectTo({
      url: "/pages/index/index",
    });
  },
});
