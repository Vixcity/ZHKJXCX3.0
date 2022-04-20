const {
	wxReq
} = require("../../utils/util")
import Message from 'tdesign-miniprogram/message/index';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		choosePeople: false,
		people: [],
		selectedPeopleValue: '',
		selectedPeopleLabel: '',
		enteryAllNumber: "",
		showChoose: false,
		entryArr: [],
		hash: ""
	},

	onLoad: function (option) {
		this.setData(option)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData(wx.getStorageSync('outPutEntry'))
		if (wx.getStorageSync('userInfo').userinfo.role === 3) {
			this.setData({
				showChoose: true,
				userName: wx.getStorageSync('userInfo').userinfo.name
			})
		} else {
			this.setData({
				userName: wx.getStorageSync('userInfo').userinfo.name
			})
		}
		this.getDetailInfo()
		if (wx.getStorageSync('userInfo').userinfo.role === 3) {
			this.getPeopleName()
		} else {
			this.setData({
				selectedPeopleValue: wx.getStorageSync('userInfo').userinfo.uuid
			})
		}
	},

	getDetailInfo() {
		let _this = this

		wxReq({
			url: '/workshop/weave/product/detail',
			data: {
				id: _this.data.detailOrder.id
			},
			method: "GET",
			success: (res) => {
				if (res.data.code === 1005) {
					Message.error({
						offset: [20, 32],
						duration: 3000,
						content: res.data.message + '，请返回首页或者稍后重试',
					});
					_this.setData({
						yichang: true
					})
				}

				let allNumber = 0
				let allRealNumber = 0
				wx.setStorageSync('entry_product_info', res.data.data.product_info)

				// 计算差额
				res.data.data.product_info.forEach(item => {
					allNumber += item.number
					allRealNumber += item.real_number
				})

				// 更新卡片的数据
				let discrepancy = allNumber - allRealNumber
				let cardOrder = _this.data.cardOrder
				let process_name = res.data.data.weave_plan.process_name
				if (cardOrder === undefined) {
					Message.success({
						offset: [20, 32],
						duration: 2000,
						content: '订单已完成,即将返回首页',
					});
					setTimeout(function () {
						wx.reLaunch({
							url: '../manage/manage',
						})
					}, 2000)
					return
				}

				cardOrder.nowNumber = cardOrder?.allNumber - discrepancy

				// 获取上一道工序
				wxReq({
					url: '/user/workshop/yield/lastone',
					data: {
						process_name,
						hash: _this.data.hash
					},
					method: "GET",
					success: (ress) => {
						this.setData({
							cardOrder,
							allNumber,
							prevProcess: ress.data.data,
							entryArr: [],
							allRealNumber,
							enteryAllNumber: '',
							workshop_yield_at: res.data.workshop_yield_at,
							product_info: res.data.data.product_info,
							process_price: res.data.data.process_prices[0]?.price || '0.00',
							process_price_all: res.data.data.process_prices[0]?.price || '0.00',
						})
					}
				})
			}
		})
	},

	// 拿到员工的名字
	getPeopleName() {
		let _this = this
		wxReq({
			url: "/user/staff/list",
			method: "GET",
			data: {
				status: 1,
				is_add: 2
			},
			success: (res) => {
				let arr = []
				res.data.data.forEach(item => {
					arr.push({
						label: item.name,
						value: item.uuid
					})
				});

				_this.setData({
					people: arr,
					selectedPeopleLabel: arr[0].label,
					selectedPeopleValue: arr[0].value,
				})
			}
		})
	},

	/**
	 * 打开选择器
	 */
	openPick(e) {
		this.setData({
			choosePeople: true
		})
	},

	/**
	 * 提交选择器内容
	 */
	confirmPick(e) {
		this.setData({
			selectedPeopleLabel: e.detail.value[0].label,
			selectedPeopleValue: e.detail.value[0].value,
			choosePeople: false
		})
	},

	/**
	 * 关闭选择器
	 */
	closePick() {
		this.setData({
			choosePeople: false
		})
	},

	// 拿到输入的数字
	getInputNumber(e) {
		if (e.detail.value === '-') {
			e.detail.value = 0
		}

		let data = this.data.product_info[e.currentTarget.dataset.index]
		data.value = +e.detail.value === 0 ? undefined : (+e.detail.value).toFixed(0)

		this.setData({
			product_info: this.data.product_info
		})
	},

	// 拿到总的差额数
	getEnteryAllNumber(e) {
		if (+e.detail.value === '-') {
			e.detail.value = 0
		}

		this.setData({
			enteryAllNumber: (+e.detail.value).toFixed(0)
		})
	},

	// 切换选项卡
	onTabsChange(e) {
		if (this.data.yichang) return

		if (e.detail.value == 0) {
			this.setData({
				enteryAllNumber: "",
				process_price_all: this.data.process_price,
				tabValue: 0
			})
		} else {
			this.setData({
				product_info: wx.getStorageSync('entry_product_info'),
				tabValue: 1
			})
			if (!this.data.showChoose) {
				this.setData({
					selectedPeopleLabel: ''
				})
			}
		}
	},

	// 提交按钮
	commitEntry() {
		// 获取时间
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let hour = date.getHours()
		let minute = date.getMinutes()
		let second = date.getSeconds()
		let nowDate = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? '0' + day : day)
		let nowTime = nowDate + ' ' + hour + ":" + minute + ":" + second
		// 获取选中的人的uuid
		let uuid = this.data.selectedPeopleValue

		// 判断是尺码颜色还是自由录入
		if (this.data.tabValue === undefined || this.data.tabValue !== 1) {
			// 判断是否留空
			if ((this.data.product_info.find(item => item.value !== undefined)) !== undefined) {
				let data = []
				let sizeNumber = 0
				let workshop_yield_at

				this.data.product_info.forEach(item => {
					// 判断是否有空数据，做异常处理
					if (item.value) {
						sizeNumber += item.value
						console.log(item)
						data.push({
							product_info_id: item.id,
							number: item.value,
							uuid: uuid,
							process_price_id: (this.data.detailOrder.process && (this.data.detailOrder.process[0] !== undefined)) ? this.data.detailOrder.process[0].id : 0,
							price: this.data.process_price,
							hash: this.data.hash,
							difference: (item.number - item.real_number - item.value) > 0 ? (item.number - item.real_number - item.value) : 0
						})
					}
				});

				// 如果完成数 >= 预定数，代表已经有完成时间了，使用原来的完成时间
				if (this.data.allRealNumber >= this.data.allNumber) {
					workshop_yield_at = this.data.workshop_yield_at
				} else if ((sizeNumber + this.data.allRealNumber) >= this.data.allNumber) {
					// 到这里，代表本次录入完成，传现在的时间
					workshop_yield_at = nowTime
				} else {
					// 到这里，代表未完成，给个null
					workshop_yield_at = null
				}

				wxReq({
					url: '/workshop/weave/product/save',
					method: 'POST',
					data: {
						data,
						workshop_yield_at
					},
					success: (res) => {
						if (res.data.code === 200) {
							Message.success({
								offset: [20, 32],
								duration: 2000,
								content: '提交成功',
							});
							this.getDetailInfo()
							return
						}
						if (res.data.code === 1005) {
							Message.error({
								offset: [20, 32],
								duration: 2000,
								content: res.data.message,
							});
							return
						}
					}
				})
			} else {
				Message.error({
					offset: [20, 32],
					duration: 2000,
					content: '请至少填写一个尺码颜色对应产量',
				});
				return
			}
		}

		if (this.data.enteryAllNumber === "") {
			Message.error({
				offset: [20, 32],
				duration: 2000,
				content: '请填写自由录入产量',
			});
			return
		}

		if (this.data.showChoose) {
			if (this.data.selectedPeopleLabel === "") {
				Message.error({
					offset: [20, 32],
					duration: 2000,
					content: '请选择生产人员',
				});
				return
			}
			this.getPostData(this.data.selectedPeopleValue)
		} else {
			this.getPostData()
		}

		let workshop_yield_at
		// 如果完成数 >= 预定数，代表已经有完成时间了，使用原来的完成时间
		if (this.data.allRealNumber >= this.data.allNumber) {
			workshop_yield_at = this.data.workshop_yield_at
		} else if ((this.data.enteryAllNumber + this.data.allRealNumber) >= this.data.allNumber) {
			// 到这里，代表本次录入完成，传现在的时间
			workshop_yield_at = nowTime
		} else {
			// 到这里，代表未完成，给个null
			workshop_yield_at = null
		}

		// 保存产量
		wxReq({
			url: '/workshop/weave/product/save',
			method: 'POST',
			data: {
				data: this.data.entryArr,
				workshop_yield_at
			},
			success: (res) => {
				if (res.data.code === 200) {
					Message.success({
						offset: [20, 32],
						duration: 2000,
						content: '提交成功',
					});
					this.getDetailInfo()
					return
				}
			}
		})

		this.getDetailInfo()

	},

	// 得到最小的差值
	getMinDiff() {
		let min

		min = Object.values(this.data.product_info).reduce((num1, num2) => {
			if((num1.real_number - num1.number) < 0){
				if((num2.real_number - num2.number) < 0){
					if((num1.real_number - num1.number) >= (num2.real_number - num2.number)){
						return num1
					} else {
						return num2
					}
				} else {
					return unm1
				}
			} else if((num2.real_number - num2.number) < 0){
				return num2
			} else {
				return num2
			}
		})

		return min
	},

	getPostData(getUuid) {
		let min = this.getMinDiff()

		let minDiff = +Math.abs(min.number - min.real_number).toFixed(0)
		let enteryAllNumber = this.data.enteryAllNumber
		let uuid = getUuid ? getUuid : wx.getStorageSync('userInfo').userinfo.uuid
		let _this = this

		if ((enteryAllNumber > minDiff) && (min.real_number < min.number)) {
			_this.data.entryArr.push({
				uuid: uuid,
				number: minDiff,
				price: _this.data.process_price,
				product_info_id: min.id,
				process_price_id: (_this.data.detailOrder.process && (_this.data.detailOrder.process[0] !== undefined)) ? _this.data.detailOrder.process[0].id : 0,
				hash: _this.data.hash
			})

			min.real_number += minDiff
			_this.data.enteryAllNumber = _this.data.enteryAllNumber - minDiff
			_this.getPostData(getUuid)
		} else {
			_this.data.entryArr.push({
				uuid: uuid,
				number: +enteryAllNumber,
				price: _this.data.process_price,
				product_info_id: min.id,
				process_price_id: (_this.data.detailOrder.process && (_this.data.detailOrder.process[0] !== undefined)) ? _this.data.detailOrder.process[0].id : 0,
				hash: _this.data.hash
			})
			return _this.data.entryArr
		}
	}
})