// pages/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail.js
const {
  wxReq,
  formatDate,
  getStatusImage,
  mergeData,
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
        url: "/material/process/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail&id=" +
        this.data.id
    ).then((res) => {
      res.data.data.created_at = formatDate(res.data.data.created_at);

      res.data.data.info_data.forEach((item) => {
        item.material_name =
          item.material_order_name || item.material_transfer_name;
      });

      let materialPlanInfo = mergeData(res.data.data.info_data, {
        mainRule: ["material_name"],
      });

      // 计算总价
      materialPlanInfo.forEach((item) => {
        item.total_number = item.childrenMergeInfo.reduce(
          (total, cur) => total + Number(cur.number),
          0
        );

        item.total_price = item.childrenMergeInfo.reduce(
          (total, cur) => total + Number(cur.number) * Number(cur.price),
          0
        );
      });

      this.setData({ info: res.data.data, materialPlanInfo });
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
          check_type: 3,
          pid: this.data.id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail&id=" +
        this.data.id
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
