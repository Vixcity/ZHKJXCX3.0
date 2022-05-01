import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const {
	urlParams,
	formatDate,
	isIfLogin,
	wxReq,
	debounce,
	getClientList,
	getProcessList,
	getGroupList,
	getUserList
} = require("../../utils/util")

// pages/ourFactory/ourFactory.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [],
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
		clientList: {
			options: [{
				label: '选项1',
				options: [{
					label: '选项1',
					value: '0-0'
				}, {
					label: '选项2',
					value: '0-1'
				}],
				value: '0'
			}],
			value: ['0', '0-0']
		},
		processList: {
			options: [{
				label: '选项1',
				options: [{
					label: '选项1',
					value: '0-0'
				}, {
					label: '选项2',
					value: '0-1'
				}],
				value: '0'
			}],
			value: ['0', '0-0']
		},
		groupList:{
			options: [{
				text:'选项1',
				value:0
			},{
				text:'选项2',
				value:1
			}],
			value:0
		},
		userList:{
			options: [{
				text:'选项1',
				value:0
			},{
				text:'选项2',
				value:1
			}],
			value:0
		},
		type: '2',
		searchType: 1,
		showSearch: false,
		showLoading: false,
		isEnd: false,
		page: 1,
		limit: 10,
		process_name: '针织织造',
		client_id: '',
		group_id: '',
		user_id: '',
		keyWord: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const isLogin = isIfLogin()
		// let isLogin = true

		this.setData({
			isLogin,
		})

		if (isLogin) {
			getClientList()
			getProcessList()
			getGroupList()
			getUserList()
			this.setData({
				clientList: {
					options: wx.getStorageSync('clientList').slice(6, 8),
					value: ['6', '6-0', ''],
				},
				processList: {
					options: wx.getStorageSync('processList'),
					value: ['0', '针织织造', ],
				},
				groupList: {
					options: wx.getStorageSync('groupList'),
					value: wx.getStorageSync('groupList')[0].value
				},
				userList: {
					options: wx.getStorageSync('userList'),
					value: wx.getStorageSync('userList')[0].value
				},
				group_id: wx.getStorageSync('groupList')[0].value,
				user_id: wx.getStorageSync('userList')[0].value,
			})
			this.pullUpLoad()
		} else {
			this.toLogin()
		}
	},

	onSearch(e) {
		this.data.keyWord = e.detail.value
		this.data.page = 1
		this.reqOrder()
	},

	changeClient(e) {
		this.setData({
			'clientList.value': e.detail.value,
		});
		if (e.detail.value[2]) {
			this.data.client_id = e.detail.value[2].split('-')[2]
		} else {
			this.data.client_id = ''
		}
		this.data.page = 1
		this.reqOrder()
	},

	changeProcess(e) {
		this.setData({
			'processList.value': e.detail.value,
		});
		this.data.process_name = e.detail.value[1]
		this.data.page = 1
		this.reqOrder()
	},
	
	changeGroup(e) {
		this.setData({
			'groupList.value': e.detail.value,
		});
		
		this.data.group_id = e.detail.value
		this.data.page = 1
		this.reqOrder()
	},
	
	changeUser(e) {
		this.setData({
			'userList.value': e.detail.value,
		});
		
		this.data.user_id = e.detail.value
		this.data.page = 1
		this.reqOrder()
	},

	showChangeSearch() {
		this.setData({
			showSearch: true
		})
	},

	changeSearchType(e) {
		this.setData({
			searchType: e.currentTarget.dataset.index,
			showSearch: false
		})
		this.data.page = 1
		this.reqOrder()
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

	reqOrder: debounce(
		function () {
			let orderList = this.data.orderList

			let params = {}
			if(this.data.searchType === 1){
				params = {
					page: this.data.page,
					page_size: this.data.limit,
					process_name: this.data.process_name,
					client_id: this.data.client_id,
					group_id: this.data.group_id,
					user_id: this.data.user_id,
					order_code: this.data.keyWord
				}
			} else if(this.data.searchType === 2){
				params = {
					page: this.data.page,
					page_size: this.data.limit,
					process_name: this.data.process_name,
					client_id: this.data.client_id,
					group_id: this.data.group_id,
					user_id: this.data.user_id,
					code: this.data.keyWord
				}
			}

			wxReq({
				url: '/weave/plan/lists',
				method: 'GET',
				data: params,
				success: (res) => {
					if (res.data.code === 200) {
						if (this.data.page = 1) {
							orderList = []
						}
						if (res.data.data.length < 10) {
							this.setData({
								isEnd: true,
								showLoading: false
							})
						}

						this.data.page += 1

						let arr = []
						res.data.data.forEach(item => {
							item.product_info.forEach(itemPro => {
								arr.push({
									id: item.id,
									customer: item.client.name,
									title: itemPro.product.name,
									time: formatDate(item.end_time),
									nowNumber: itemPro.real_number,
									allNumber: itemPro.number,
									customer: item.code,
									imgSrc: itemPro.product.image_data.length > 0 ? itemPro.product.image_data[0].image_url : 'https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png',
									display: 0,
									code: itemPro.product.product_code,
									processName: item.process_name,
								})
							})
						})
						orderList = orderList.concat(arr)

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
					zIndex: 11601
				})
				.then(() => {
					this.toSignUp()
				})
				.catch(() => {
					wx.lin.showMessage({
						type: 'error',
						duration: 4000,
						content: '您已取消，请登录以获取更好的用户体验',
						top: getApp().globalData.navH + 110
					})
				});
		}
	},

	toSignUp() {
		wx.navigateTo({
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