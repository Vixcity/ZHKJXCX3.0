// manages.js
import { wxReq } from "../../utils/util";

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

    // 订单管理初始化
    wx.setStorageSync("orderChooseIndex", "");

    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      });
    }
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
});
