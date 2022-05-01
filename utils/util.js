const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : `0${n}`
}

const isIfLogin = () => {
	return wx.getStorageSync('isLogin')
}

// 封装请求
const wxReq = data => {
	if (!isIfLogin()) {
		return
	}

	wx.request({
		url: getApp().globalData.api + data.url,
		data: data.data,
		method: data.method,
		success: data.success,
		header: {
			token: wx.getStorageSync('token')
		}
	})
}

/*函数防抖（定时器）：如果interval不传，则默认1000ms*/
const debounce = (fn, interval) => {
	var timer;
	var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
	return function () {
		clearTimeout(timer);
		var context = this;
		var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
		timer = setTimeout(function () {
			fn.call(context, args);
		}, gapTime);
	};
}

// 刷新页面
function reloadThisPage() {
	let currentPages = getCurrentPages()
	let lastRoute = currentPages[currentPages.length - 1].route
	let options = currentPages[currentPages.length - 1].options
	let optionsStr = ""
	for (let key in options) {
		optionsStr += '?' + key + '=' + options[key]
	}
	wx.redirectTo({
		url: '/' + lastRoute + optionsStr,
	})
}

// 验证手机号
function verifyTel(tel) {
	let reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
	if (reg.test(tel)) {
		return true;
	}
	return false;
}

const getTimestamp = n => {
	// 时间格式 2015-03-05 17:59:00
	var date = n;
	date = date.substring(0, 19);
	date = date.replace(/-/g, '/');
	var timestamp = new Date(date).getTime();
	// console.log(timestamp);
	return timestamp
}

// 获取时间差，时间戳传入
const getTimeDiff = (time1, time2, type = 'hours') => {
	let timeDiff = time1 > time2 ? time1 - time2 : time2 - time1
	let hours = Math.floor(timeDiff / (3600 * 1000));
	let days = Math.floor(timeDiff / (24 * 3600 * 1000));
	let minutes = Math.floor(timeDiff / (60 * 1000));
	if (type === "hours") return hours
	if (type === "days") return days
	if (type === "minutes") return minutes
}

// 获取前N个月
const createDateDate = (n, isNow = false, fenge) => {
	let datelist = []
	let date = new Date()
	let Y = date.getFullYear()
	let M = date.getMonth()

	// 判断这个月算不算在内
	if (isNow) M++

	// 循环递减
	for (let i = 0; i < n; i++) {
		let dateoption = ''

		// 判断是否为1月
		if (M - 1 !== -1) {} else {
			M = 12
			Y = Y - 1
		}

		// 小于10，格式就变成0x，例如:01
		let m = M
		m = m < 10 ? '0' + m : m

		// 如果有分隔符，那么就通过分隔符号来分隔
		if (fenge) {
			dateoption = Y + '' + fenge + m
		} else {
			dateoption = Y + '年' + m + '月'
		}

		// 递减
		M--

		// 保存数据
		datelist.push(dateoption)
	}
	return datelist
}

// 获取日期差
const dateDiff = function (nowTime, compairTime) {
	//nowTime和compairTime是yyyy-MM-dd格式
	let aDate, oDate1, oDate2, iDays;
	aDate = nowTime.split("-");
	oDate1 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]); //转换为yyyy-MM-dd格式
	aDate = compairTime.split("-");
	oDate2 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]);
	iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
	return iDays; //返回相差天数
}

// 格式化时间
const formatDate = function (time, format = 'yyyy-MM-DD') {
	let t = new Date(time);
	let tf = function (i) {
		return (i < 10 ? '0' : '') + i
	};
	return format.replace(/yyyy|YYYY|MM|dd|DD|HH|hh|mm|ss|SS/g, function (a) {
		switch (a) {
			case 'yyyy':
				return tf(t.getFullYear());
				break;
			case 'YYYY':
				return tf(t.getFullYear());
				break;
			case 'MM':
				return tf(t.getMonth() + 1);
				break;
			case 'dd':
				return tf(t.getDate());
				break;
			case 'DD':
				return tf(t.getDate());
				break;
			case 'hh':
				return tf(t.getHours());
				break;
			case 'HH':
				return tf(t.getHours());
				break;
			case 'mm':
				return tf(t.getMinutes());
				break;
			case 'ss':
				return tf(t.getSeconds());
				break;
			case 'SS':
				return tf(t.getSeconds());
				break;
		}
	})
}

// 获取Url参数
const urlParams = function (url) {
	let obj = {}
	let str = url.slice(url.indexOf('?') + 1)
	let arr = str.split('&')
	for (let j = arr.length, i = 0; i < j; i++) {
		let arr_temp = arr[i].split('=')
		obj[arr_temp[0]] = arr_temp[1]
	}
	return obj
}

const getClientList = function () {
	wxReq({
		url: '/client/type/lists',
		method: 'GET',
		success: (res) => {
			let arr = []
			res.data.data.forEach((item, index) => {
				let arr1 = []
				if (item.rel_tag) {
					item.rel_tag.forEach((itemSon, indexSon) => {
						let arr2 = []
						if (itemSon.client) {
							itemSon.client.forEach((itemClient) => {
								arr2.push({
									label: itemClient.name,
									value: '' + index + '-' + indexSon + '-' + itemClient.id
								})
							})
							arr1.push({
								label: itemSon.name,
								value: '' + index + '-' + indexSon,
								options: arr2
							})
						}
					});
				}
				if (item.public_tag) {
					item.public_tag.forEach((itemSon, indexSon) => {
						let arr2 = []
						if (itemSon.client) {
							itemSon.client.forEach((itemClient) => {
								arr2.push({
									label: itemClient.name,
									value: '' + index + '-' + indexSon + '-' + itemClient.id
								})
							})
							arr1.push({
								label: itemSon.name,
								value: '' + index + '-' + indexSon,
								options: arr2
							})
						}
					});
				}
				arr.push({
					label: item.name,
					value: '' + index,
					options: arr1
				})
			});
			wx.setStorageSync("clientList", arr)
		}
	})
}

const getProcessList = function () {
	wxReq({
		url: '/process/lists',
		data: {
			type: 2
		},
		method: 'GET',
		success: (res) => {
			wxReq({
				url: '/process/lists',
				data: {
					type: 3
				},
				method: 'GET',
				success: (ress) => {
					let arr1 = res.data.data.map(item => {
						return {
							label: item.name,
							value: item.name
						}
					})
					let arr2 = ress.data.data.map(item => {
						return {
							label: item.name,
							value: item.name
						}
					})

					wx.setStorageSync('processList', [{
						label: '织造工序',
						value: 0,
						options: [{
							label: '针织织造',
							value: '针织织造',
						}, {
							label: '梭织织造',
							value: '梭织织造',
						}, {
							label: '制版费',
							value: '制版费'
						}]
					}, {
						label: '半成品加工工序',
						value: 2,
						options: arr1
					}, {
						label: '成品加工工序',
						value: 3,
						options: arr2
					}])
				}
			})
		}
	})
}

const getGroupList = function () {
	wxReq({
		url: '/group/lists',
		method: 'GET',
		success: (res) => {
			let arr = res.data.data.map(item => {
				return {
					label: item.name,
					value: item.id
				}
			})
			wx.setStorageSync('groupList', arr)
		}
	})
}

const getUserList = function () {
	wxReq({
		url: '/user/lists',
		method: 'GET',
		success: (res) => {
			let arr = res.data.data.map(item => {
				return {
					label: item.name,
					value: item.user_id,
					allUesrInfo: item
				}
			})
			wx.setStorageSync('userList', arr)
		}
	})
}

module.exports = {
	formatTime,
	wxReq,
	verifyTel,
	getTimeDiff,
	createDateDate,
	getTimestamp,
	dateDiff,
	urlParams,
	reloadThisPage,
	isIfLogin,
	debounce,
	formatDate,
	getClientList,
	getProcessList,
	getGroupList,
	getUserList
}