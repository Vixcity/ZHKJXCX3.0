// pages/order/orderDetail/orderDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  wxReq,
  dateDiff,
  getDay,
  isHasPermissions,
} = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    isShow: false,
    isShow2: false,
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
      "/orderDetail/orderDetail&id=" + id
    ).then((res) => {
      res.data.data.time_data.forEach((itemTime) => {
        itemTime.batch_data.forEach((itemBatch, indexBatch) => {
          itemBatch.isOut = dateDiff(getDay(0), itemBatch.delivery_time) <= 0;
          itemBatch.otherDay = Math.abs(
            dateDiff(getDay(0), itemBatch.delivery_time)
          );
          _this.data.productList = _this.data.productList.concat(
            itemBatch.product_data.map((item) => {
              item.batchIndex = indexBatch + 1;
              return item;
            })
          );
        });
      });

      let order_id = res.data.data.time_data[0].id;
      this.setData({
        order_id,
        id,
        has_check: wx.getStorageSync("userInfo").has_check === 1,
      });

      wxReq(
        {
          url: "/order/material/info/new",
          data: { order_id },
          method: "GET",
        },
        "/orderDetail/orderDetail&id=" + id
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
        "/orderDetail/orderDetail&id=" + id
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
      "/orderDetail/orderDetail&id=" + id
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

      res.data.data.production_inspection.forEach((itme) => {
        itme.total_price = +itme.total_price.toFixed(2);
      });

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
	
	toOrderList(){
		wx.redirectTo({
			url: '/pages/order/order',
		})
	},

  changeIsShow2() {
    this.setData({
      isShow2: !this.data.isShow2,
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

  closeShowPackPopup() {
    this.setData({
      showPackPopup: false,
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
      "/orderDetail/orderDetail&id=" + this.data.id
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
