// app.js
App({
  onLaunch() {
    const accountInfo = wx.getAccountInfoSync();

    const env = accountInfo.miniProgram.envVersion;

    const baseApi = {
      // 开发版
      develop: "https://knit-m-beta.zwyknit.com/api",
      // 体验版
      trial: "https://knit-m-beta.zwyknit.com/api",
      // 正式版
      release: "https://knit-m-api.zwyknit.com/api"
    };
    this.globalData.api = baseApi[env] || 'https://knit-m-beta.zwyknit.com/api'
    // this.globalData.api = 'https://knit-m-api.zwyknit.com/api'
  },
  globalData: {}
})