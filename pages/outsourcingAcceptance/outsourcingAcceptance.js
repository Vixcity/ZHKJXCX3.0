const {
	reloadThisPage,
	wxReq,
	getDay,
	getDateList
} = require("../../utils/util")

// pages/outsourcingAcceptance/outsourcingAcceptance.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detailInfo: {},
		cardInfoData: {
			cardTitle: [{
				title: '产品',
				width: 20
			}, {
				title: '尺码颜色',
				width: 23
			}, {
				title: '下单/下机数量',
				width: 30
			}, {
				title: '生产进度',
				width: 27
			}],
			cardData: [
				['圈圈纱围脖', '均码/浅色组', '3000/2800', '2600（包装） 200（吊牌）'],
				['圈圈围脖纱', '均码/灰色组', '3000/5000', '2600（包装） 200（吊牌）']
			]
		},
		dateList: [],
		type: 1,
		isCheck: false,
		chooseDate: false,
		userInfo: wx.getStorageSync('userInfo'),
		date: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			detailInfo: wx.getStorageSync('outsourcing').selectCardInfo,
		})
	},

	buttonCommit: function () {
		// this.setData({
		// 	isCheck: true
		// })
		// reloadThisPage()
		if (!this.data.date) {
			wx.lin.showMessage({
				type: 'error',
				duration: 4000,
				content: '请选择验收日期',
				top: getApp().globalData.navH
			})
			return
		}

		let array = []
		this.data.detailInfo.item.product_info.forEach(item => {
			console.log(item)
			array.push({
				order_id: this.data.detailInfo.item.order_id,
				doc_info_id: item.id,
				type: this.data.type,
				complete_time: this.data.date,
				client: '',
				number: item.hegeNumber,
				shoddy_number: item.cipinNumber,
				shoddy_reason: item.cipinReason
			})
		});

		wxReq({
			url: '/create/inspection',
			data: array,
			method: 'POST',
			success: (res) => {
				console.log(res.data.data)
			}
		})
	},

	getNumber(e) {
		this.data.detailInfo.item.product_info[e.currentTarget.dataset.index].hegeNumber = +e.detail
	},

	getCiPinNumber(e) {
		this.data.detailInfo.item.product_info[e.currentTarget.dataset.index].cipinNumber = +e.detail
	},

	getCiPinReason(e) {
		this.data.detailInfo.item.product_info[e.currentTarget.dataset.index].cipinReason = e.detail
	},

	showChooseDate() {
		this.setData({
			dateList: getDateList(getDay(0), getDay(-6)).map(item => {
				return {
					name: item
				}
			}),
			chooseDate: true
		})
	},

	changeTabs(e){
		this.setData({
			isCheck:e.detail.index===1
		})
	},

	selectDate(e) {
		this.setData({
			date: e.detail.name
		})
		this.closePickDate()
	},

	closePickDate() {
		this.setData({
			chooseDate: false
		})
	},

	onChange(event) {
		this.setData({
			type: event.detail,
		});
	}
})