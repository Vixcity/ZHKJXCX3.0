// pages/sampleOrder/sampleOrderDetail/sampleOrderDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { wxReq } = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    sampleOrderDetail: {},
    confirmSampleInfo: [],
    unConfirmSampleInfo: [],
    showStatusChoose: false,
    showProductPopup: false,
    showMaterialPopup: false,
    showDecoratePopup: false,
    showWeavePopup: false,
    showCheJianPopup: false,
    isShow: false,
    indexweave: 0,
    indexpro: 0,
    chooseStatusList: [],
    statusList: [
      "https://file.zwyknit.com/waiting.png",
      "https://file.zwyknit.com/pass.png",
      "https://file.zwyknit.com/return.png",
      "https://file.zwyknit.com/error.png",
      "https://file.zwyknit.com/error.png",
    ],
    financialInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;

    this.load(id);
  },

  load(id) {
    wxReq(
      {
        url: "/order/detail",
        data: {
          id: id,
        },
        method: "GET",
      },
      "/sampleOrderDetail/sampleOrderDetail&id=" + id
    ).then((res) => {
      this.setData({
        sampleOrderDetail: res.data.data,
        id,
      });

      this.data.sampleOrderDetail.time_data.forEach((item) => {
        wxReq(
          {
            url: "/order/material/info/new",
            data: {
              order_id: item.id,
            },
            method: "GET",
          },
          "/sampleOrderDetail/sampleOrderDetail&id=" + id
        ).then((res) => {
          item.progress = res.data.data.progress;
          item.update_time = res.data.data.update_time;
          item.materialDetail = res.data.data.data;
          this.setData({
            sampleOrderDetail: this.data.sampleOrderDetail,
          });
        });
      });
    });

    wxReq(
      {
        url: "/order/confirm/product/lists",
        data: {
          order_id: id,
        },
        method: "GET",
      },
      "/sampleOrderDetail/sampleOrderDetail&id=" + id
    ).then((res) => {
      this.setData({
        confirmSampleInfo: res.data.data.filter((item) => item.status === 2),
        unConfirmSampleInfo: res.data.data.filter((item) => item.status !== 2),
      });
    });

    wxReq(
      {
        url: "/financial/order/detail",
        data: {
          order_id: id,
          product_id: "",
        },
        method: "GET",
      },
      "/sampleOrderDetail/sampleOrderDetail&id=" + id
    ).then((res) => {
      res.data.data.product_total_price = res.data.data.product.reduce(
        (total, cur) => {
          return total + cur.total_price;
        },
        0
      );

      this.setData({
        financialInfo: res.data.data,
      });
    });
  },

  changeIsShow() {
    this.setData({
      isShow: !this.data.isShow,
    });
  },

  openStatusChoose(e) {
    const { index, indexpro } = e.currentTarget.dataset;
    const item = this.data.sampleOrderDetail.time_data[index].batch_data[0]
      .product_data[indexpro];
    if (item.status === 3 || item.status === 4) {
      wx.lin.showMessage({
        type: "warning",
        duration: 3000,
        content: "改样品已修改，请前往最新一次打样进行操作",
        top: getApp().globalData.navH,
      });
      return;
    }

    this.setData({
      chooseStatusList: [],
    });

    if (!(item.status === 6 || item.status === 5)) {
      this.data.chooseStatusList.push({
        label: item.status === 2 ? "重新打样" : "确认大货生产",
        value: item.status === 2 ? 1 : 2,
      });
    }

    this.data.chooseStatusList.push({
      label: item.status === 6 ? "重新待定" : "不确认继续打样",
      value: item.status === 6 ? 1 : 6,
    });

    if (!(item.status === 6 || item.status === 2)) {
      this.data.chooseStatusList.push({
        label: item.status === 5 ? "重新打样" : "不确认取消打样",
        value: item.status === 5 ? 1 : 5,
      });
    }

    // 显示弹窗
    item.showStatusChoose = true;

    this.setData({
      chooseStatusList: this.data.chooseStatusList,
      sampleOrderDetail: this.data.sampleOrderDetail,
    });
    // 该样品是否需要重新打样？
    // 是否确认该样品已经被客户确认完成？
    // 该样品客户是否确认继续打样？
    // 该样品客户是否确认取消打样？
  },

  closeStatusChoose(e) {
    const { index, indexpro } = e.currentTarget.dataset;
    const item = this.data.sampleOrderDetail.time_data[index].batch_data[0]
      .product_data[indexpro];

    // 关闭弹窗
    item.showStatusChoose = false;

    this.setData({
      sampleOrderDetail: this.data.sampleOrderDetail,
    });
  },

  confirmStatusChoose(e) {
    const _this = this;
    const { index, indexpro } = e.currentTarget.dataset;
    const status = e.detail.value[0].value;
    const item = this.data.sampleOrderDetail.time_data[index].batch_data[0]
      .product_data[indexpro];

    this.closeStatusChoose(e);

    const tipsArr = [
      "",
      "该样品是否需要重新打样？",
      "是否确认该样品已经被客户确认完成？",
      "",
      "",
      "该样品客户是否确认取消打样？",
      "该样品客户是否确认继续打样？",
    ];

    Dialog.confirm({
      title: "",
      message: tipsArr[status],
      confirmButtonColor: "#27A2fd",
    })
      .then(() => {
        // 确认
        wxReq(
          {
            url: "/order/product/confirm",
            data: {
              id: item.product_id,
              status,
            },
            method: "POST",
          },
          "/sampleOrderDetail/sampleOrderDetail&id=" + this.data.id
        ).then((res) => {
          if (res.data.status) {
            // console.log(status);
            if (status === 2) {
              wx.lin.showMessage({
                type: "success",
                duration: 3000,
                content: "该样品已确认完成",
                top: getApp().globalData.navH,
              });
            } else if (status === 5) {
              wx.lin.showMessage({
                type: "success",
                duration: 3000,
                content: "该样品已确认不做",
                top: getApp().globalData.navH,
              });
            } else if (status === 6) {
              wx.lin.showMessage({
                type: "success",
                duration: 3000,
                content: "该样品已确认继续打样",
                top: getApp().globalData.navH,
              });
            } else {
              wx.lin.showMessage({
                type: "success",
                duration: 3000,
                content: "该样品已重新待定",
                top: getApp().globalData.navH,
              });
            }
            _this.load(_this.data.id);
          }
        });
      })
      .catch((e) => {
        // 取消
        console.log(e);
      });
  },

  // 弹窗
  showFinancialPopup(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "product") {
      if (this.data.financialInfo.product.length === 0) {
        wx.lin.showMessage({
          type: "warning",
          duration: 3000,
          content: "无样品费用信息",
          top: getApp().globalData.navH,
        });
        return;
      }

      this.setData({
        showProductPopup: true,
      });
    } else if (type === "material") {
      if (
        this.data.financialInfo.material.material.detail.material_order
          .length === 0 &&
        this.data.financialInfo.material.material.detail.material_process
          .length === 0 &&
        this.data.financialInfo.material.material.detail.material_transfer
          .length === 0
      ) {
        wx.lin.showMessage({
          type: "warning",
          duration: 3000,
          content: "无原料费用信息",
          top: getApp().globalData.navH,
        });
        return;
      }

      this.setData({
        showMaterialPopup: true,
      });
    } else if (type === "decorate") {
      if (
        this.data.financialInfo.material.decorate.detail.material_order
          .length === 0 &&
        this.data.financialInfo.material.decorate.detail.material_process
          .length === 0 &&
        this.data.financialInfo.material.decorate.detail.material_transfer
          .length === 0
      ) {
        wx.lin.showMessage({
          type: "warning",
          duration: 3000,
          content: "无辅料费用信息",
          top: getApp().globalData.navH,
        });
        return;
      }

      this.setData({
        showDecoratePopup: true,
      });
    } else if (type === "weave") {
      const { indexweave } = e.currentTarget.dataset;
      this.setData({
        showWeavePopup: true,
        indexweave,
      });
    } else if (type === "production_inspection") {
      const { indexpro } = e.currentTarget.dataset;
      // console.log(indexpro);
      this.setData({
        showCheJianPopup: true,
        indexpro,
      });
    }
  },

  // 关闭弹窗
  closeShowProductPopup() {
    this.setData({
      showProductPopup: false,
    });
  },

  closeShowMaterialPopup() {
    this.setData({
      showMaterialPopup: false,
    });
  },

  closeShowDecoratePopup() {
    this.setData({
      showDecoratePopup: false,
    });
  },

  closeShowWeavePopup() {
    this.setData({
      showWeavePopup: false,
    });
  },

  closeShowCheJianPopup() {
    this.setData({
      showCheJianPopup: false,
    });
  },

  // 查看关联单据
  showAssociatedDocument(e) {},

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
      "/sampleOrderDetail/sampleOrderDetail&id=" + this.data.id
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
