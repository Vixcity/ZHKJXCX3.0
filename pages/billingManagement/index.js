// pages/billingManagement/index.js
const {
  getBillingList,
  isHasPermissions,
  getClientList,
	getProcessList,
	getGroupList,
	getUserList,
	getStoreList,
	getStaffList,
  getDepartmentListSync,
} = require("../../utils/util");

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
    if (options.doc_type) {
      // 跳转到对应订单
      let arr = [
        { index: 0, url: "", permissions: "", name: "" },
        {
          index: 1,
          url: "/pages/orderDetail/orderDetail?check=true&id=",
          permissions: "3-3",
          name: "订单",
        },
        {
          index: 2,
          url: "./rawMaterialPurchaseOrder/rawMaterialPurchaseOrderDetail?id=",
          permissions: "21-3",
          name: "原料订购单",
        },
        {
          index: 3,
          url:
            "./rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail?id=",
          permissions: "21-5",
          name: "原料加工单",
        },
        {
          index: 4,
          url: "./productionPlan/productionPlanDetail?id=",
          permissions: "21-6",
          name: "生产计划单",
        }, // 有订单id
        { index: 5, url: "", permissions: "", name: "报价单" },
        {
          index: 6,
          url: "./rawMaterialTransferOrder/rawMaterialTransferOrderDetail?id=",
          permissions: "21-4",
          name: "原料调取单",
        },
        { index: 7, url: "", permissions: "", name: "原料预订购" },
        { index: 8, url: "", permissions: "", name: "产品出入库" },
        {
          index: 9,
          url: "./rawMaterialPlan/rawMaterialPlanDetail?id=",
          permissions: "21-1",
          name: "原料计划单",
        },
        {
          index: 10,
          url: "./rawMaterialSupplement/rawMaterialSupplementDetail?id=",
          permissions: "21-2",
          name: "原料补充单",
        },
        {
          index: 11,
          url: "./packingOrder/packingOrderDetail?id=",
          permissions: "21-9",
          name: "包装订购单",
        },
        { index: 12, url: "", permissions: "21-13", name: "扣款单" },
        {
          index: 13,
          url:
            "./transportationDeliveryOrder/transportationDeliveryOrderDetail?id=",
          permissions: "21-10",
          name: "运输出库单",
        },
        {
          index: 14,
          url: "./workshopSettlementLog/workshopSettlementLogDetail?id=",
          permissions: "21-7",
          name: "车间结算日志",
        },
        { index: 15, url: "", permissions: "21-12", name: "开票单" },
        { index: 16, url: "", permissions: "21-14", name: "收款单" },
        {
          index: 17,
          url: "/pages/sampleOrderDetail/sampleOrderDetail?check=true&id=",
          permissions: "2-3",
          name: "样单",
        },
        {
          index: 18,
          url:
            "./auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrderDetail?id=",
          permissions: "21-8",
          name: "辅料订购单",
        },
        {
          index: 19,
          url:
            "./inspectionReceiptDocument/inspectionReceiptDocumentDetail?pid=",
          permissions: "21-15",
          name: "检验入库单",
        }, // id是订单id，pid是他的id,
      ];
      let url = arr[options.doc_type].url + options.doc_id;

      if (options.doc_type === 4) {
        url += "&top_order_id=" + options.doc_order_id;
      } else if (options.doc_type === 19) {
        url += "&id=" + options.doc_order_id;
      }

      this.toBillingManagementDetail(
        url,
        arr[options.doc_type].permissions,
        options
      );
    } else {
      getClientList('/billingManagement/index');
      getProcessList('/billingManagement/index');
      getGroupList('/billingManagement/index');
      getUserList('/billingManagement/index');
      getStoreList('/billingManagement/index');
      getStaffList('/billingManagement/index');
    }
  },

  onShow() {
    this.setData({
      y: wx.getStorageSync("Y") || 500,
    });
  },

  toBillingManagementDetail(url, type, options) {
    getDepartmentListSync(
      "/billingManagement/index&doc_type=" +
        options.doc_type +
        "&doc_order_id=" +
        options.doc_order_id +
        "&doc_order_time_id=" +
        options.doc_order_time_id +
        "&doc_id=" +
        options.doc_id
    ).then((res) => {
      this.setData({
        tabList: getBillingList(),
      });
      // 通过异步的同步调用，等待结果出来在执行判断权限
      if (!isHasPermissions(type)) {
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "提示：当前登录账号无权限查看此单据！",
          top: 180,
        });
      } else {
        wx.navigateTo({
          url: url,
        });
      }
    });
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
