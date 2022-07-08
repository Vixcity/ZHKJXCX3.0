// pages/billingManagement/index.js
const { getBillingList } = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      tabList: getBillingList(),
    });
  },

  toOtherBillingPage(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: "/pages" + item.path,
    });
  },
});
