// index.js

Page({
  data: {
    list: [{
      title: '本厂生产中',
      number: 1800,
      plusNumber: 3,
      minusNumber: 5,
      src:'/pages/ourFactory/ourFactory?type=1'
    }, {
      title: '外协进行中',
      number: 1800,
      plusNumber: 3,
      minusNumber: 5,
      src:'/pages/ourFactory/ourFactory?type=2'
    }, {
      title: '已完成',
      number: 1800,
      plusNumber: 5,
      src:'/pages/ourFactory/ourFactory?type=3'
    }]
  },
  onShow() {
    wx.hideHomeButton()
    if (wx.getStorageSync('userInfo') === '') {
      this.setData({
        showLogin: true
      })
      return
    }

    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.setData({
      page: 1,
      orderList: [],
      isLeader: wx.getStorageSync('userInfo')?.userinfo?.role === 3
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  toDetailPage(e){
    let {src} = e.currentTarget.dataset
    wx.navigateTo({
      url: src,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})