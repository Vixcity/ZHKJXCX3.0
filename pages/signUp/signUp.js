import {
	getClientList,
	getProcessList,
	getGroupList,
	getUserList,
	getStoreList,
	getStaffList,
	getDepartmentList,
	wxReq,
} from "../../utils/util";
// index.js
Page({
	data: {
		user_name: "",
		password: "",
		rememberPwd: true,
	},

	onLoad: function (options) {
		this.setData({
			rememberPwd: wx.getStorageSync("rememberPwd") === false ? false : true,
		});
		if (wx.getStorageSync("rememberPwd") === true) {
			this.setData({
				user_name: wx.getStorageSync("user_name"),
				password: wx.getStorageSync("password"),
			});
		}

		let path = "";

		// 拼接参数
		for (let key in options) {
			let value = options[key];
			if (key === "path") {
				path = ".." + value;
			} else if (key === "isEditPwd") {
				wx.lin.showMessage({
					type: "success",
					duration: 3000,
					content: "修改密码成功，请重新登录",
					top: getApp().globalData.navH,
				});
			} else {
				path += "&" + key + "=" + value;
			}
		}

		// 把第一个连接符号变成问号
		path = path.replace("&", "?");

		// 赋值
		this.setData({
			path,
		});

		wx.hideHomeButton();
	},

	onShareAppMessage: function () {
		return {
			title: "纺织业领先的协同制造云平台",
			path: "/pages/signUp/signUp", // 路径，传递参数到指定页面。
			imageUrl: "https://file.zwyknit.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%88%86%E4%BA%AB%E5%9B%BE-1.png",
		};
	},

	bindKeyInput: function (e) {
		if (e.currentTarget.dataset.type === 1) {
			this.setData({
				user_name: e.detail.value,
			});
		}

		if (e.currentTarget.dataset.type === 2) {
			this.setData({
				password: e.detail.value,
			});
		}
	},

	// 点击登录
	postSignUp() {
		let _this = this;
		if (this.data.rememberPwd) {
			wx.setStorageSync("user_name", this.data.user_name);
			wx.setStorageSync("password", this.data.password);
		}
		wx.setStorageSync("rememberPwd", this.data.rememberPwd);

		wx.request({
			url: getApp().globalData.api.slice(0, -4) + "/api/auth/login",
			data: {
				password: this.data.password,
				user_name: this.data.user_name,
			},
			method: "POST",
			success: (res) => {
				if (!res.data.status) {
					wx.lin.showMessage({
						type: "error",
						duration: 3000,
						content: res.data.msg,
						top: getApp().globalData.navH,
					});

					return;
				}

				if (res.data) {
					wx.setStorageSync("isLogin", true);
					wx.setStorageSync("loginTime", new Date());

					if (res.data.status) {
						var cookie = res.header["Set-Cookie"];
						if (cookie != null) {
							wx.setStorageSync("sessionid", res.header["Set-Cookie"]); //服务器返回的 Set-Cookie，保存到本地
						}
					}

					wxReq({
						url: "/auth/info",
						method: "post",
					}).then((ress) => {
						if (ress.data.status) {
							ress.data.data.quanxianLen = ress.data.data.module_info?.filter(
								(item) => {
									return typeof item !== "number";
								}
							).length || 0;
							wx.setStorageSync("userInfo", ress.data.data);
							wx.setStorageSync("isLogin", true);

							wx.lin.showMessage({
								type: "success",
								duration: 1000,
								content: "登录成功，即将返回刚才的页面",
								top: getApp().globalData.navH,
							});

							getClientList();
							getProcessList();
							getGroupList();
							getUserList();
							getStoreList();
							getStaffList();
							getDepartmentList();

							setTimeout(function () {
								_this.toOtherPage();
							}, 2500);
						}
					});
				}
			},
		});
	},

	onChangeRemenber(e) {
		this.setData({
			rememberPwd: !this.data.rememberPwd,
		});
	},

	// 去其他界面
	toOtherPage() {
		let url = this.data.path || "/pages/index/index";
		if (url === '../pages/index/index') {
			url = '/pages/index/index'
		}
		console.log(url);
		wx.redirectTo({
			url,
		});
	},
});