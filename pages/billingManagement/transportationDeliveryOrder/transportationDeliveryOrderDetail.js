// pages/billingManagement/transportationDeliveryOrder/transportationDeliveryOrderDetail.js
const { wxReq, getStatusImage, isJSON } = require("../../../utils/util");
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
		console.log(options)
    this.setData(options);
    this.getDetail();
  },

  getDetail() {
    wxReq(
      {
        url: "/transport/dispatch/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/transportationDeliveryOrder/transportationDeliveryOrderDetail&id=" +
        this.data.id
    ).then((res) => {
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
          check_type: 13,
          pid: this.data.id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/transportationDeliveryOrder/transportationDeliveryOrderDetail&id=" +
        this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });

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
    wxReq(
      {
        url: "/product/detail",
        method: "GET",
        data: {
          id: item.product_id,
        },
      },
      "/billingManagement/transportationDeliveryOrder/transportationDeliveryOrderDetail&id=" +
        this.data.id
    ).then((res) => {
      res.data.data.style_data = res.data.data.style_data
        .map((item) => item.name)
        .join(",");
			res.data.data.desc = res.data.data.desc || "无";
			res.data.data.isTable = isJSON(res.data.data.size_data[0].size_info)
			res.data.data.size_data.forEach(item => {
				if(res.data.data.isTable) {
					item.size_arr = JSON.parse(item.size_info)
				}
			})
      this.setData({ productInfo: res.data.data, showPro: true });
    });
  },

  openShowImage() {
    this.setData({
      showImage: true,
      showPro: false,
    });
  },

  closeShowImage() {
    this.setData({
      showImage: false,
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
        "/pages/billingManagement/transportationDeliveryOrder/transportationDeliveryOrder",
    });
  },
});
