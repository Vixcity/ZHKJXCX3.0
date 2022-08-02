// pages/billingManagement/packingOrder/packingOrderDetail.js
const { wxReq, getStatusImage } = require("../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    info: {},
    showShenHe: false,
    current: 1,
    textInputDesc: "",
    textInputReason: "",
    statusImageList: getStatusImage(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // id塞进去
    this.setData(options);
    this.getDetail();
  },

  getDetail() {
    wxReq(
      {
        url: "/pack/order/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/packingOrder/packingOrderDetail&id=" + this.data.id
    ).then((res) => {
      res.data.data.created_at = res.data.data.created_at;

      let packingOrderDetail = wx.getStorageSync("packingOrderDetail");
      res.data.data.is_check = packingOrderDetail.is_check;
      res.data.data.order_code = packingOrderDetail.order_code;

      this.setData({ info: res.data.data });
    });
  },

	openCheckDetail() {
    this.setData({
      showCheckDetail: true,
    });
  },

  closeCheckDetail() {
    this.setData({
      showCheckDetail: false,
    });
  },

  openCheck() {
    this.setData({
      showShenHe: true,
    });
  },

  closeCheck() {
    this.setData({
      showShenHe: false,
    });
  },

  changeRadio(e) {
    this.setData({ current: +e.detail.currentKey });
  },

  inputDesc(e) {
    this.setData({
      textInputDesc: e.detail.value,
    });
  },

  inputReason(e) {
    this.setData({
      textInputReason: e.detail.value,
    });
  },

  confirmCheck(e) {
    wxReq(
      {
        url: "/doc/check",
        method: "POST",
        data: {
          check_type: 11,
          pid: this.data.id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/packingOrder/packingOrderDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });
        wx.setStorageSync("isDo", true);
        this.data.info.is_check = this.data.current;
        wx.setStorageSync("packingOrderDetail", this.data.info);

        this.getDetail();
        this.setData({
          showShenHe: false,
        });
      }
    });
  },
});
