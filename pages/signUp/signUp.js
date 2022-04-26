const app = getApp()
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import {
	verifyTel,
	wxReq
} from '../../utils/util';
// index.js
Page({
	data: {
		user_name: '17602103060',
		password: '123456'
	},

	onLoad: function (options) {
		this.setData(options)

		wx.hideHomeButton()
	},

	bindKeyInput: function (e) {
		if (e.currentTarget.dataset.type === 1) {
			this.setData({
				user_name: e.detail.value
			})
		}

		if (e.currentTarget.dataset.type === 2) {
			this.setData({
				password: e.detail.value
			})
		}
	},

	// 点击登录
	postSignUp() {
		let _this = this

		wx.request({
			url: 'https://knit-m2-beta.zwyknit.com/auth/login',
			data: {
				password: this.data.password,
				user_name: this.data.user_name
			},
			method: 'POST',
			success: res => {
				if (res.data.status) {
					app.globalData.isLogin = true
					app.globalData.token = res.data.data.token
					wxReq({
						url: '/user/info',
						method: 'GET',
						success: ress => {
							if (res.data.status) {
								app.globalData.userInfo = ress.data.data

								Notify({
									type: 'success',
									message: '登录成功，即将返回刚才的页面'
								});

								setTimeout(function () {
									_this.toOtherPage()
								}, 3000)
							}
						}
					})
				}
			}
		})
	},

	// 去管理界面
	toOtherPage() {
		wx.reLaunch({
			url: '../' + this.data.path + '/' + this.data.path
		})
	},
})