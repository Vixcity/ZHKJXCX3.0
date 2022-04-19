const {
	wxReq
} = require("../../utils/util")

// components/orderCard.js
Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		showIcon: {
			type: Boolean,
			value: false
		},
		smallThan24h: {
			type: Boolean,
			value: true
		},
		showPrice: {
			type: Boolean,
			value: false
		},
		showChangeIcon: {
			type: Boolean,
			value: false
		},
		showEnterPrice: {
			type: Boolean,
			value: false
		},
		// 详细信息
		detailInfo: Object,
		enterPricce: String
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isShow: 'title',
		showPopup: false,
	},

	lifetimes: {
		ready: function () {
			this.setData({
				isLeader: wx.getStorageSync('userInfo').userinfo?.role === 3
			})
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击勾号
		changeCheck(event) {
			if (this.data.showIcon) {
				this.triggerEvent("changeCheck", {})
			}
			// this.setData({
			// 	isCheck: !this.data.isCheck
			// })
		},

		// 图片展示
		showImage(e) {
			this.setData({
				showPopup: !this.data.showPopup
			})
		},
		closePopup() {
			this.setData({
				showPopup: false
			})
		},

		// 传出点击事件
		clickEvent(event) {
			this.triggerEvent("clickEvent", event.currentTarget.dataset)
		},

		// 切换标题和code
		changeShow(e) {
			// 0 为title
			// 1 为code

			// 仅作坊主可操作
			if (this.data.showChangeIcon) {
				if (this.data.detailInfo.display === 0) {
					this.data.detailInfo.display = 1
				} else {
					this.data.detailInfo.display = 0
				}

				this.setData({
					detailInfo: this.data.detailInfo
				})

				let {
					pid,
					display,
					product_id
				} = this.data.detailInfo

				wxReq({
					url: '/workshop/order/display',
					method: "POST",
					data: {
						pid,
						display,
						product_id
					},
					success: (res) => {

					}
				})

				this.triggerEvent("changeShow", display)
			}
		},

		// 产量录入 => 产品定价
		toOrderDetail(e) {
			// 拿到 => 取值 => 赋值
			let obj = wx.getStorageSync('outPutEntry')
			obj.cardOrder.price = obj.detailOrder.total_price

			wx.setStorageSync('orderDetail', {
				detailInfo: obj.cardOrder,
				detailProduct: obj.detailOrder,
			})

			wx.navigateTo({
				url: '../../pages/orderDetail/orderDetail',
			})
		},
	}
})