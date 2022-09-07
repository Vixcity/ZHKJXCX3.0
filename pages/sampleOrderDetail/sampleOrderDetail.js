// pages/sampleOrder/sampleOrderDetail/sampleOrderDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { wxReq, isHasPermissions, getStatusImage } = require("../../utils/util");

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
    showCheckDetail: false,
    is_checkDetail: "",
    check: "true",
    indexweave: 0,
    indexpro: 0,
    current: 1,
    chooseStatusList: [],
    statusList: [
      "https://file.zwyknit.com/waiting.png",
      "https://file.zwyknit.com/pass.png",
      "https://file.zwyknit.com/return.png",
      "https://file.zwyknit.com/error.png",
      "https://file.zwyknit.com/error.png",
    ],
    financialInfo: {},
    statusImageList: getStatusImage(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    this.setData(options);
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
      let order_id = res.data.data.time_data[0].id;

      this.setData({
        sampleOrderDetail: res.data.data,
        order_id,
        id,
        has_check: wx.getStorageSync("userInfo").has_check === 1,
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

      res.data.data.product.forEach((item) => {
        if (item.quote_info) {
          if (item.quote_info.change.indexOf("上浮") !== -1) {
            item.quote_info.class = "colorE800";
          } else if (item.quote_info.change.indexOf("下降") !== -1) {
            item.quote_info.class = "color03d0";
          }
        }
      });

      res.data.data.weave.forEach((item) => {
        if (item.quote_info) {
          if (item.quote_info.change.indexOf("上浮") !== -1) {
            item.quote_info.class = "colorE800";
          } else if (item.quote_info.change.indexOf("下降") !== -1) {
            item.quote_info.class = "color03d0";
          }
        }
      });

      if (res.data.data.material.material.gather.quote_info) {
        if (
          res.data.data.material.material.gather.quote_info.change.indexOf(
            "上浮"
          ) !== -1
        ) {
          console.log(1);
          res.data.data.material.material.gather.quote_info.class = "colorE800";
        } else if (
          res.data.data.material.material.gather.quote_info.change.indexOf(
            "下降"
          ) !== -1
        ) {
          console.log(2);
          res.data.data.material.material.gather.quote_info.class = "color03d0";
        }
      }

      if (res.data.data.material.decorate.gather.quote_info) {
        if (
          res.data.data.material.decorate.gather.quote_info.change.indexOf(
            "上浮"
          ) !== -1
        ) {
          res.data.data.material.decorate.gather.quote_info.class = "colorE800";
        } else if (
          res.data.data.material.decorate.gather.quote_info.change.indexOf(
            "下降"
          ) !== -1
        ) {
          res.data.data.material.decorate.gather.quote_info.class = "color03d0";
        }
      }

      if (res.data.data.pack.gather.quote_info) {
        if (
          res.data.data.pack.gather.quote_info.change.indexOf("上浮") !== -1
        ) {
          res.data.data.pack.gather.quote_info.class = "colorE800";
        } else if (
          res.data.data.pack.gather.quote_info.change.indexOf("下降") !== -1
        ) {
          res.data.data.pack.gather.quote_info.class = "color03d0";
        }
      }

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

  watchCheck(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      is_checkDetail: item.is_check,
      showCheckDetail: true,
      showPid: item.id,
    });
  },

  openCheck() {
    Dialog.confirm({
      title: "提示",
      message: "是否审核第" + ((this.data.activeNumber + 1) || 1) + "次打样信息",
      confirmButtonColor: "#27A2fd",
    })
      .then(() => {
        this.setData({
					showShenHe: true,
        });
      })
      .catch(() => {
        // on cancel
      });
  },

  closeCheck() {
    this.setData({
      showShenHe: false,
    });
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

  changeRadio(e) {
    this.setData({ current: +e.detail.currentKey });
  },

  chanegActive(e) {
		console.log(e.detail.index)
    this.setData({
			activeNumber: e.detail.index,
			showPid: this.data.sampleOrderDetail.time_data[e.detail.index].id,
    });
  },

  confirmCheck(e) {
		console.log(this.data.activeNumber)
    wxReq(
      {
        url: "/doc/check",
        method: "POST",
        data: {
          check_type: 17,
          pid: this.data.sampleOrderDetail.time_data[this.data.activeNumber].id,
          check_desc: this.data.current === 1 ? "" : this.data.textInputReason,
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/pages/sampleOrderDetail/sampleOrderDetail&id=" +
        this.data.id +
        this.data.check ===
        "true"
        ? "&check=true"
        : ""
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });

        this.load(this.data.id);
        this.setData({
          showShenHe: false,
        });
      }
    });
  },

  closeCheckDetail() {
    this.setData({
      showCheckDetail: false,
    });
  },

  toOrderList() {
    wx.redirectTo({
      url: "/pages/sampleOrder/sampleOrder",
    });
  },

  openStatusChoose(e) {
    const { index, indexpro, status_choose } = e.currentTarget.dataset;
    this.data.index = index;
    this.data.indexpro = indexpro;
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

    this.setData({
      chooseStatusList: this.data.chooseStatusList,
      sampleOrderDetail: this.data.sampleOrderDetail,
      showStatusChoose: true,
      status_choose,
    });
    // 该样品是否需要重新打样？
    // 是否确认该样品已经被客户确认完成？
    // 该样品客户是否确认继续打样？
    // 该样品客户是否确认取消打样？
  },

  closeStatusChoose() {
    this.setData({
      sampleOrderDetail: this.data.sampleOrderDetail,
      showStatusChoose: false,
    });
  },

  confirmStatusChoose() {
    const _this = this;
    const { index, indexpro } = _this.data;
    const status = _this.data.status_choose;
    const item =
      _this.data.sampleOrderDetail.time_data[index].batch_data[0].product_data[
        indexpro
      ];

    this.closeStatusChoose();

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
    } else if (type === "showOrderLog") {
      this.setData({
        showOrderLog: true,
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

  closeShowOrderLog() {
    this.setData({
      showOrderLog: false,
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

  toQuotePriceDetail(e) {
    if (isHasPermissions("1-3")) {
      wx.navigateTo({
        url:
          "/pages/quotedPriceDetail/quotedPriceDetail?id=" +
          e.currentTarget.dataset.id,
      });
    }
  },
});
