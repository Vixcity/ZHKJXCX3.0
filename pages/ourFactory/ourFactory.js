import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const {
	urlParams,
	isIfLogin,
	wxReq,
	debounce
} = require("../../utils/util")

// pages/ourFactory/ourFactory.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [],
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
		type: '2',
		showLoading: false,
		isEnd: false,
		page: 1,
		limit: 10,
		showRightPopup: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// const isLogin = isIfLogin()
		let isLogin = true

		this.setData({
			isLogin,
		})

		if (isLogin) {
			this.pullUpLoad()
		} else {
			this.toLogin()
		}
	},

	closePopup() {
		this.setData({
			showRightPopup: false
		})
	},

	pullUpLoad: function () {
		if (this.data.isEnd) {
			return
		}
		this.setData({
			showLoading: true
		})
		this.reqOrder()
	},

	getProcessList() {
		wxReq({
			url: '/process/lists',
			data: {
				type: 2
			},
			method: "GET",
			success: (res) => {
				console.log(res)
			}
		})
	},

	reqOrder: debounce(
		function () {
			let orderList = this.data.orderList

			wxReq({
				url: '/order/lists',
				method: 'GET',
				data: {
					page: this.data.page,
					limit: this.data.limit
				},
				success: (res) => {
					if (res.data.code === 200) {
						console.log(res.data.data)

						if (res.data.data.length < 10) {
							this.setData({
								isEnd: true,
								showLoading: false
							})
						}

						this.data.page += 1

						let arr = res.data.data.map(item => {
							return {
								id: item.id,
								customer: '订单号：' + item.code,
								title: item.client.name,
								time: '2022-04-30',
								nowNumber: 20,
								allNumber: 50,
								customer: '订单号：asdasd',
								imgSrc: 'https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png',
								display: 0,
								code: '222',
							}
						})
						orderList = orderList.concat(arr)
						console.log(orderList)

						this.setData({
							showLoading: false,
							orderList
						})
					}
				},
			})
		}, 1000
	),

	GetSandCode() {
		wx.scanCode({
			scanType: 'qrCode',
			success: (res) => {
				if (res.result.slice(0, 40) === "https://knit-m-api.zwyknit.com/bindOrder") {
					let {
						company_id,
						hash,
						id
					} = urlParams(res.result)
				} else {

				}
			},
			fail: (res) => {
				console.log(res)
			}
		})
	},

	toLogin(e) {
		if (e) {
			this.toSignUp()
		} else {
			Dialog.confirm({
					title: '您还未登录',
					message: '点击确认前往登录界面',
				})
				.then(() => {
					this.toSignUp()
				})
				.catch(() => {
					Notify({
						type: 'danger',
						message: '您已取消，请登录以获得更好的用户体验'
					});
				});
		}
	},

	toSignUp() {
		wx.reLaunch({
			url: '/pages/signUp/signUp?path=ourFactory',
		})
	},

	toOutsourcingAcceptance(e) {
		console.log(e)
		wx.navigateTo({
			url: '/pages/outsourcingAcceptance/outsourcingAcceptance',
		})
	}
})