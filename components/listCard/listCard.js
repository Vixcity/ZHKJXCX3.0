// components/listCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		cardInfoData: {
			cardTitle: Array,
			cardData: Array,
			hasBr: {
				type: Boolean,
				value: false,
			}
		},
		isSlot: {
			type: Boolean,
			value: false
		},
		showShort: {
			type: Boolean,
			value: false
		},
		title: {
			type: String,
		},
		classStyle: String
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的生命周期
	 */
	pageLifetimes: {
		show: function () {
			if (!this.data.showShort) {
				this.setData({
					isShort: false
				})
			} else {
				this.setData({
					isShort: true
				})
			}
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		clickLine(event) {
			this.triggerEvent("clickLine", event.currentTarget.dataset)
		},
		showImage(e) {
			this.triggerEvent("clickImg", e.currentTarget.dataset)
		},
		changeShortOrLong() {
			this.setData({
				isShort: !this.data.isShort
			})
		}
	}
})