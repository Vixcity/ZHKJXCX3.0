// pages/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder.js
const { getBillingList, wxReq } = require("../../../utils/util");

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
    let tabList = getBillingList();
    tabList[2].active = true;

    this.setData({
      tabList,
      tabName: "tab2",
    });
  },

  toOtherBillingPage(e) {
    let item = e.currentTarget.dataset.item;
    if (!item.active) {
      wx.redirectTo({
        url: "/pages" + item.path,
      });
    }
  },
});
