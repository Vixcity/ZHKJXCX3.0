// pages/billingManagement/workshopSettlementLog/workshopSettlementLogDetail.js
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
        url: "/production/inspection/index",
        data: { id: this.data.id },
        method: "GET",
      },
      "/pages/billingManagement/workshopSettlementLog/workshopSettlementLogDetail&id=" +
        this.data.id
    ).then(res => {
			this.setData({
				info: res.data.data,
			});
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
          check_type: 14,
          pid: this.data.id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/workshopSettlementLog/workshopSettlementLogDetail&id=" +
        this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });
        this.data.info.is_check = this.data.current;
        wx.setStorageSync("isDo", true);
        this.getDetail();
        this.setData({
          showShenHe: false,
        });
      }
    });
  },

  showDetailPro(e) {
    const { item } = e.currentTarget.dataset;
    console.log(item);
    wxReq(
      {
        url: "/product/detail",
        method: "GET",
        data: {
          id: item.product_id,
        },
      },
      "/billingManagement/workshopSettlementLog/workshopSettlementLogDetail&id=" +
        this.data.id
    ).then((res) => {
      res.data.data.style_data = res.data.data.style_data
        .map((item) => item.name)
        .join(",");
      res.data.data.desc = res.data.data.desc || "无";
      this.setData({ productInfo: res.data.data, showPro: true });
    });
  },

  openShowImage() {
    this.setData({
      showImage1: true,
      showPro: false,
    });
  },

  closeShowImage() {
    this.setData({
      showImage1: false,
      showPro: true,
    });
  },

  closePro() {
    this.setData({
      showPro: false,
    });
	},
	
	toPrev() {
    wx.redirectTo({
      url:
        "/pages/billingManagement/workshopSettlementLog/workshopSettlementLog",
    });
  },
});
