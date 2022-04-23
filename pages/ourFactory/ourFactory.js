const { urlParams } = require("../../utils/util")

// pages/ourFactory/ourFactory.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detailInfo: {
			title: '111',
			time: '2022-04-30',
			nowNumber: 20,
			allNumber: 50,
			customer: '订单号：asdasd',
			imgSrc: 'https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png',
			display: 0,
			pid: 132,
			// order_type: 1,
			// status:3,
			id: 187,
			product_id: 391,
			code: '222',
			dateDiff: 0,
			processName: '工序',
			bigThan30: true,
			smallThan24h: true
		},
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
		type: '2'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// this.setData(options)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	GetSandCode() {
		wx.scanCode({
			scanType: 'qrCode',
			success: (res) => {
				if(res.result.slice(0,40) === "https://knit-m-api.zwyknit.com/bindOrder"){
					let {company_id,hash,id} = urlParams(res.result)
				} else {

				}
			},
			fail: (res) => {
				console.log(res)
			}
		})
	},

	toOutsourcingAcceptance(e){
		console.log(e)
		wx.navigateTo({
			url: '/pages/outsourcingAcceptance/outsourcingAcceptance',
		})
	}
})