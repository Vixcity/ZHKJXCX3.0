// pages/billingManagement/inspectionReceiptDocument/inspectionReceiptDocumentDetail.js
const { wxReq, getStatusImage, mergeData } = require("../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    pid: "",
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
    // id塞进去，这里的是订单id
    this.setData(options);
    this.getDetail();
  },

  getDetail() {
    wxReq(
      {
        url: "/order/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocumentDetail&id=" +
        this.data.id
    ).then((res) => {
      this.setData({ info: res.data.data });

      wxReq(
        {
          url: "/weave/plan/lists",
          method: "GET",
          data: { order_id: this.data.info.time_data[0].id },
        },
        "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocumentDetail&id=" +
          this.data.id
      ).then((resPlan) => {
        let productionPlanList = resPlan.data.data;
        if (productionPlanList.length > 0) {
          // 类型为梭织织造、针织织造的永远排在切换按钮的最前面
          let productionPlanMergeList = mergeData(productionPlanList, {
            mainRule: ["process_name"],
          }).sort((a, b) => {
            if (a.process_name === "针织织造" || a.name === "梭织织造") {
              return 1;
            } else if (b.process_name === "针织织造" || b.name === "梭织织造") {
              return -1;
            } else {
              return 0;
            }
          });
          productionPlanMergeList.reverse();
          this.setData({
            productionPlanList: resPlan.data.data,
            productionPlanMergeList,
          });
        }
      });

      wxReq(
        {
          url: "/inspection/lists",
          method: "GET",
          data: { order_id: this.data.info.time_data[0].id },
        },
        "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocumentDetail&id=" +
          this.data.id
      ).then((resInspection) => {
        let inspectionList = resInspection.data.data;
        let pushList = inspectionList.filter((item) => item.type === 1);
        let productOutList = inspectionList.filter((item) => item.type === 2);
        let overPushList = inspectionList.filter((item) => item.type === 3);
        this.setData({
          inspectionList,
          pushList,
          productOutList,
          overPushList,
        });
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
          check_type: 19,
          pid: this.data.pid,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocumentDetail&id=" +
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
});
