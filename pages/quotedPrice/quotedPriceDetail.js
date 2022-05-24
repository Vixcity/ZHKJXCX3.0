// pages/quotedPrice/quotedPriceDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { isIfLogin, debounce, wxReq } = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listCard: [
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
    ],
    reasonList: [
      { value: "物料成本偏低", isChecked: true, disabled: false },
      { value: "织造成本偏低", isChecked: false, disabled: false },
      { value: "加工成本偏低", isChecked: false, disabled: false },
      { value: "包装成本偏低", isChecked: false, disabled: false },
      { value: "人工成本偏低", isChecked: false, disabled: false },
      { value: "运费成本偏低", isChecked: false, disabled: false },
      { value: "基本利润偏低", isChecked: false, disabled: false },
      { value: "整体报价偏低", isChecked: false, disabled: false },
    ],
    result: ["物料成本偏低", "加工成本偏低"],
    showShenHe: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

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

  showShort(e) {
    this.data.listCard[e.detail.id].showContent = false;
    this.setData({ listCard: this.data.listCard });
  },

  showBig(e) {
    this.data.listCard[e.detail.id].showContent = true;
    this.setData({ listCard: this.data.listCard });
  },

  checkBoxChange(e) {
    this.setData({ result: e.detail });
  },
});
