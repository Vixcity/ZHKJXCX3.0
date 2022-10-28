import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { wxReq } = require("../../utils/util");

// pages/workshopEditByPrice/workshopEditByPrice.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(options);
    this.getDetail();
  },

  getDetail() {
    wxReq(
      {
        url: "/production/inspection/lists?ids[]=" + this.data.id + "&type=2",
        method: "GET",
      },
      "/workshopEditByPrice/workshopEditByPrice?id=" + this.data.id
    ).then((res) => {
      let data = res.data.data[0];
      data.simpleStaffCode = data.staff_code.slice(-4);
      this.setData({
        info: data,
      });
    });
  },

  changeType(e) {
    const { type } = e.currentTarget.dataset;
    let info = this.data.info;
    info[type] = e.detail.value || e.detail.key;

    info.total_price = (info.price || 0) * (info.time_count || 0);

    this.setData({
      info,
    });
  },

  confirmData() {
    wxReq(
      {
        url: "/production/inspection/save",
        data: {
          type: 2,
          data: [this.data.info],
        },
        method: "POST",
      },
      "/workshopEditByPrice/workshopEditByPrice?id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.setStorageSync("isDo", true);
        this.toPrev();
      }
    });
  },

  watchDesc() {
    Dialog.alert({
      message: this.data.info.process_desc || "无工序说明",
      cancelButtonText: "取消提交",
      confirmButtonColor: "#27A2FD",
    }).then(() => {
      arr.forEach((item) => (item.is_check = 4));
      this.saveCP(arr);
    });
  },

  toPrev() {
    wx.navigateBack();
  },
});
