const { wxReq } = require("../../utils/util");

// components/orderLog/orderLog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    order_id: {
      type: Number | String,
    },
    top_id: {
      type: Number | String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderLogInfo: "",
  },

  observers: {
    show: function (a) {
      if (a && !this.data.orderLogInfo) {
        wxReq(
          {
            url: "/order/rel/doc/info",
            method: "GET",
            data: {
              order_id: this.data.order_id,
            },
          },
        ).then((res) => {
					console.log(res.data.data)
          this.setData({
            orderLogInfo: res.data.data,
          });
        });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
		closeCheckDetail() {
      this.triggerEvent("cancel");
		},
		
		toQuotePriceDetail(e){
			wx.navigateTo({
				url: '/pages/quotedPriceDetail/quotedPriceDetail?id=' + e.currentTarget.dataset.id,
			})
		},

		toRawPlan(e){
			wx.navigateTo({
				url: '/pages/billingManagement/rawMaterialPlan/rawMaterialPlanDetail?id=' + e.currentTarget.dataset.id,
			})
		},

		toRawOrder(e){
			wx.navigateTo({
				url: '/pages/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrderDetail?id=' + e.currentTarget.dataset.id,
			})
		},

		toRawTransfer(e){
			wx.navigateTo({
				url: '/pages/billingManagement/rawMaterialTransferOrder/rawMaterialTransferOrderDetail?id=' + e.currentTarget.dataset.id,
			})
		},
		
		toRawSupplement(e){
			wx.navigateTo({
				url: '/pages/billingManagement/rawMaterialSupplement/rawMaterialSupplementDetail?id=' + e.currentTarget.dataset.id,
			})
		},

		toRawProcess(e){
			wx.navigateTo({
				url: '/pages/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail?id=' + e.currentTarget.dataset.id,
			})
		},

		toAuxiliary(e){
			wx.navigateTo({
				url: '/pages/billingManagement/auxiliaryMaterialPurchaseOrder/auxiliaryMaterialPurchaseOrderDetail?id=' + e.currentTarget.dataset.id,
			})
		},

		toWorkDetail(e){
			wx.navigateTo({
				url: '/pages/billingManagement/workshopSettlementLog/workshopSettlementLogDetail?id=' + e.currentTarget.dataset.id,
			})
		},
		
		toInspectionDetail(e){
			wx.navigateTo({
				url: '/pages/billingManagement/inspectionReceiptDocument/inspectionReceiptDocumentDetail?id=' + this.data.top_id,
			})
		},

		toWeaveDetail(e){
			wx.navigateTo({
				url: '/pages/billingManagement/productionPlan/productionPlanDetail?id=' + e.currentTarget.dataset.id + '&top_order_id=' + this.data.top_id,
			})
		},

		toPack(e){
			wx.navigateTo({
				url: '/pages/billingManagement/packingOrder/packingOrderDetail?id=' + e.currentTarget.dataset.id,
			})
		},
		
		toTransfer(e){
			wx.navigateTo({
				url: '/pages/billingManagement/transportationDeliveryOrder/transportationDeliveryOrderDetail?id=' + e.currentTarget.dataset.id,
			})
		},
	},
});
