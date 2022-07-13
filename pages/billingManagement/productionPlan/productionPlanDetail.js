// pages/billingManagement/productionPlan/productionPlanDetail.js
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
    showImage: false,
    current: 1,
    textInputDesc: "",
    textInputReason: "",
    statusImageList: getStatusImage(),
    image_data: [],
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
        url: "/weave/plan/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/productionPlan/productionPlanDetail&id=" +
        this.data.id
    ).then((res) => {
      res.data.data.created_at = formatDate(res.data.data.created_at);
      let materialPlanInfo = mergeData(res.data.data.material_info_data, {
        mainRule: ["material_name", "material_id"],
      });

      // 计算总价
      materialPlanInfo.forEach((item) => {
        item.total_price = item.childrenMergeInfo.reduce(
          (total, cur) => total + Number(cur.final_number),
          0
        );
      });

      let total_number = res.data.data.product_info_data.reduce(
        (total, item) => {
          return total + Number(item.number);
        },
        0
      );

      let total_price = res.data.data.product_info_data.reduce(
        (total, item) => {
          return (
            total + Number(Number(item.price).toFixed(2) * Number(item.number))
          );
        },
        0
      );

      this.setData({
        info: res.data.data,
        materialPlanInfo,
        total_number,
        total_price,
      });
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
          check_type: 4,
          pid: this.data.id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/productionPlan/productionPlanDetail&id=" +
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

  call(e) {
    let { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功" + item);
      },
      fail: function () {
        console.log("拨打电话失败");
      },
    });
  },

  showImg(e) {
    let { image_data } = e.currentTarget.dataset;

    if (image_data.length === 0) {
      image_data = [
        "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
      ];
    }

    this.setData({
      image_data,
      showImage: true,
    });
  },

  onClose() {
    this.setData({
      showImage: false,
    });
  },
});
