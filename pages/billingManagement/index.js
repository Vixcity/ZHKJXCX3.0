// pages/billingManagement/index.js
const { getBillingList } = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      tabList: getBillingList(),
    });
    if (options) {
      // 跳转到对应订单
      // 单据类型 1订单 2原料订购 3原料加工 4制造计划/生产计划 5报价 6原料出入库/原料调取 7原料预订购 8产品出入库 9物料计划 10补纱 11包装采购 12扣款单 13运输单 14车间管理 15开票单 16收款单 17样单 18辅料采购单 19检验入库单
      let arr = [
        /* 0 */ "",
        /* 1 */ "/pages/orderDetail/orderDetail?check=true&id=",
        /* 2 */ "./rawMaterialPurchaseOrder/rawMaterialPurchaseOrderDetail?id=", // 原料订购单
        /* 3 */ "./rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail?id=", // 原料加工
        /* 4 */ "./productionPlan/productionPlanDetail?id=", // 生产计划单 有订单id
        /* 5 */ "",
        /* 6 */ "./rawMaterialTransferOrder/rawMaterialTransferOrderDetail?id=", // 原料调取
        /* 7 */ "",
        /* 8 */ "",
        /* 9 */ "./rawMaterialPlan/rawMaterialPlanDetail?id=",
        /* 10 */ "./rawMaterialSupplement/rawMaterialSupplementDetail?id=",
        /* 11 */ "./packingOrder/packingOrderDetail?id=",
        /* 12 */ "",
        /* 13 */ "./transportationDeliveryOrder/transportationDeliveryOrderDetail?id=",
        /* 14 */ "./workshopSettlementLog/workshopSettlementLogDetail?id=",
        /* 15 */ "",
        /* 16 */ "",
        /* 17 */ "/pages/sampleOrderDetail/sampleOrderDetail?check=true&id=",
        /* 18 */ "./auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrderDetail?id=",
        /* 19 */ "./inspectionReceiptDocument/inspectionReceiptDocumentDetail?pid=", // id是订单id，pid是他的id,
      ];
      let url = arr[options.doc_type] + options.doc_id;

      if (options.doc_type === 4) {
        url += "&top_order_id=" + options.doc_order_id;
      } else if (options.doc_type === 19) {
        url += "&id=" + options.doc_order_id;
      }

      this.toBillingManagementDetail(url);
    }
  },

  onShow() {
    this.setData({
      y: wx.getStorageSync("Y") || 500,
    });
  },

  toBillingManagementDetail(url) {
    wx.navigateTo({
    	url: url,
    })
  },

  toOtherBillingPage(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: "/pages" + item.path,
    });
  },

  toIndex() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});
