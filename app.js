// app.js
App({
  onLaunch() {
    const accountInfo = wx.getAccountInfoSync();

    const env = accountInfo.miniProgram.envVersion;

    const baseApi = {
      // 开发版
      develop: "https://knit-beta.zwyknit.com/api",
      // 体验版
      trial: "https://knit-beta.zwyknit.com/api",
      // 正式版
      release: "https://knit-api.zwyknit.com/api",
    };
    // this.globalData.api = baseApi[env] || "https://knit-beta.zwyknit.com/api";
    this.globalData.api = 'https://knit-api.zwyknit.com/api'
  },
  globalData: {
    isLogin: false,
    // homePage: "/pages/ourFactory/ourFactory",
    homePage: "/pages/index/index",
    // isLogin: true,
  },
});
