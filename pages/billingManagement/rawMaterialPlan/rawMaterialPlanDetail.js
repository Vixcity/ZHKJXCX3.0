// pages/billingManagement/rawMaterialPlan/rawMaterialPlanDetail.js
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
    showCheckDetail: false,
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
        url: "/material/plan/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/billingManagement/rawMaterialPlan/rawMaterialPlanDetail&id=" +
        this.data.id
    ).then((res) => {
      res.data.data.created_at = formatDate(res.data.data.created_at);
      let materialPlanInfo = mergeData(
        res.data.data.material_plan_gather_data,
        {
          mainRule: ["material_name", "material_id"],
        }
      );

      // 计算总价
      materialPlanInfo.forEach((item) => {
        item.total_price = item.childrenMergeInfo.reduce(
          (total, cur) => total + Number(cur.final_number),
          0
        );
      });

      this.setData({ info: res.data.data, materialPlanInfo });
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
          check_type: 9,
          pid: this.data.id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/billingManagement/rawMaterialPlan/rawMaterialPlanDetail&id=" +
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
      "/billingManagement/rawMaterialPlan/rawMaterialPlanDetail&id=" +
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
});
