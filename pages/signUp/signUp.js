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
			method:'POST',
			success: res => {
				if(res.data.status){
					getApp().globalData.isLogin = true
					getApp().globalData.token = res.data.data.token
				}
			}
		})

		// let userInfo = this.data.userInfo

		// wxReq({
		//   url: '/user/register',
		//   data: {
		//     user_name: userInfo.phoneNumber,
		//     name: userInfo.realName,
		//     unionid: userInfo.openid.unionid,
		//     process: selectedWorkProcedureValue,
		//     wechat_data: userInfo.wechat_data,
		//     openid: userInfo.openid.openid
		//   },
		//   method: "POST",
		//   success: (res) => {
		//     if (res.data.data === true) {
		//       wxReq({
		//         url: '/user/info',
		//         method: 'GET',
		//         success: function (res) {
		//           let allUserinfo = wx.getStorageSync('userInfo')
		//           allUserinfo.userinfo = res.data.data
		//           allUserinfo.userinfo.process = allUserinfo.userinfo.process.split(",")
		//           wx.setStorageSync('userInfo', allUserinfo)

		//           if (_this.data.company_id) {
		//             Notify({
		//               type: 'success',
		//               message: '注册成功,三秒后返回绑定工厂页面',
		//               duration: 2000,
		//             });
		//             setTimeout(() => {
		//               wx.navigateTo({
		//                 url: '../bindCompany/bindCompany?company_id=' + _this.data.company_id,
		//               })
		//             }, 3000)
		//             return
		//           }

		//           if (_this.data.time && _this.data.uuid) {
		//             Notify({
		//               type: 'success',
		//               message: '注册成功,三秒后返回添加作坊页面',
		//               duration: 2000,
		//             });
		//             setTimeout(() => {
		//               wx.navigateTo({
		//                 url: '../addWorkShop/addWorkShop?time=' + _this.data.time + '&uuid=' + _this.data.uuid,
		//               })
		//             }, 3000)
		//             return
		//           }

		//           if (_this.data.showPopup) {
		//             Notify({
		//               type: 'success',
		//               message: '注册成功,三秒后返回员工管理页面',
		//               duration: 2000,
		//             });
		//             setTimeout(() => {
		//               wx.navigateTo({
		//                 url: '../workerManage/workerManage?showPopup=' + _this.data.showPopup,
		//               })
		//             }, 3000)
		//             return
		//           }

		//           if (_this.data.order) {
		//             Notify({
		//               type: 'success',
		//               message: '注册成功,三秒后返回订单管理页面',
		//               duration: 2000,
		//             });
		//             setTimeout(() => {
		//               wx.navigateTo({
		//                 url: '../orderControl/orderControl?isLeader=true&order=' + _this.data.order,
		//               })
		//             }, 3000)
		//             return
		//           }

		//           Notify({
		//             type: 'success',
		//             message: '注册成功,注册成功，三秒后返回首页',
		//             duration: 2000,
		//           });
		//           setTimeout(() => {
		//             _this.toManage()
		//           }, 3000)
		//           return
		//         }
		//       })
		//     } else {
		//       Notify({
		//         type: 'danger',
		//         message: res.data.data,
		//         duration: 2000,
		//       });
		//     }
		//   }
		// })
	},

	// 去管理界面
	toManage() {
		wx.reLaunch({
			url: '../manage/manage'
		})
	},
})