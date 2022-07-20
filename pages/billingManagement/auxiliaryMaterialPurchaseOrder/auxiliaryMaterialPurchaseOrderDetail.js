// pages/billingManagement/auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrderDetail.js
const {
  wxReq,
  getStatusImage,
} = require("../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    info: {},
    showShenHe: false,
		current: 1,
		textInputDesc:'',
		textInputReason:'',
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
        url: "/material/order/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrderDetail&id="+this.data.id
    ).then((res) => {
      res.data.data.created_at = res.data.data.created_at;
			let infoData = wx.getStorageSync('auxiliaryMaterialPurchaseOrderDetail')
			res.data.data.total_number = +infoData.total_number
			res.data.data.total_price = infoData.total_price.toFixed(2)
			res.data.data.total_push_number = +infoData.total_push_number
			res.data.data.total_push_price = infoData.total_push_price.toFixed(2)
      this.setData({ info: res.data.data });
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
          check_type: 2,
          pid: this.data.id,
          check_desc:
            this.data.current === 1
              ? ""
              : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrderDetail&id="+this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });
        this.getDetail();
        this.setData({
          showShenHe: false,
        });
      }
    });
  },
});