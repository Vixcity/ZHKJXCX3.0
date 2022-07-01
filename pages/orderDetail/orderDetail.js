// pages/order/orderDetail/orderDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { wxReq, dateDiff, getDay } = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    orderDetail: {},
    productList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;

    this.load(id);
  },

  load(id) {
    let _this = this;
    wxReq(
      {
        url: "/order/detail",
        data: {
          id: id,
        },
        method: "GET",
      },
      "orderDetail&params1=id%3D" + id
    ).then((res) => {
      res.data.data.time_data.forEach((itemTime) => {
        itemTime.batch_data.forEach((itemBatch, indexBatch) => {
          itemBatch.isOut = dateDiff(getDay(0), itemBatch.delivery_time) <= 0;
          _this.data.productList = _this.data.productList.concat(
            itemBatch.product_data.map((item) => {
              item.batchIndex = indexBatch + 1;
              return item;
            })
          );
        });
      });

      wxReq(
        {
          url: "/order/material/info",
          data: { order_id: res.data.data.time_data[0].id },
          method: "GET",
        },
        "orderDetail&params1=id%3D" + id
      ).then((ress) => {
        // console.log(ress.data.data);
        _this.setData({
          orderDetail: res.data.data,
          productList: _this.data.productList,
          materialProgress: ress.data.data.progress,
          materialDetail: ress.data.data.data,
          materialUpdateTime: ress.data.data.update_time,
        });
      });

      wxReq(
        {
          url: "/order/weave/info",
          data: { order_time_id: res.data.data.time_data[0].id },
          method: "GET",
        },
        "orderDetail&params1=id%3D" + id
      ).then((ress) => {
        _this.setData({
          productionDetail: ress.data.data.data,
          productionProgress: ress.data.data.progress,
          productionUpdateTime: ress.data.data.update_time,
        });
      });
    });

    wxReq(
      {
        url: "/financial/order/detail",
        data: { order_id: id, product_id: "" },
        method: "GET",
      },
      "orderDetail&params1=id%3D" + id
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

  // 弹窗
  showFinancialPopup(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "product") {
      if (this.data.financialInfo.product.length === 0) {
        wx.lin.showMessage({
          type: "warning",
          duration: 3000,
          content: "无产品费用信息",
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
    } else if (type === "pack") {
      if (this.data.financialInfo.pack.detail.length === 0) {
        wx.lin.showMessage({
          type: "warning",
          duration: 3000,
          content: "无包装辅料信息",
          top: getApp().globalData.navH,
        });
        return;
      }

      this.setData({
        showPackPopup: true,
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
	
  closeShowPackPopup() {
    this.setData({
      showPackPopup: false,
    });
  },

  // 查看关联单据
  showAssociatedDocument(e) {},
});
