// components/navContent.js
import deviceUtil from "../../miniprogram_npm/lin-ui/utils/device-util";
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    color: {
      type: String,
      value: "#ffffff",
    },
    white: {
      type: Boolean,
      value: false,
    },
    showBack: {
      type: Boolean,
      value: true,
    },
    showHome: {
      type: Boolean,
      value: true,
    },
  },

  lifetimes: {
    ready() {
      var that = this;
      // 获取手机系统信息
      wx.getSystemInfo({
        success: (res) => {
          //导航高度
          that.setData({
            navH: res.statusBarHeight + 46,
          });
          getApp().globalData.navH = deviceUtil.getNavigationBarHeight() + 16;
        },
        fail(err) {
          console.log(err);
        },
      });
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navH: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navHome: function () {
      wx.reLaunch({
        url: getApp().globalData.homePage,
      });
    },
    navBack: function () {
      wx.navigateBack({
        changed: true,
      });
    },
  },
});
