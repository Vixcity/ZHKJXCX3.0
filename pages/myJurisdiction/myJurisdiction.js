// pages/myJurisdiction/myJurisdiction.js
import { systemModule, jsonClone } from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"),
    selfModule: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const moduleArr = jsonClone(wx.getStorageSync("userInfo").module_info);
    const systemModuleArr = systemModule;
    systemModuleArr.forEach((item) => {
      if (moduleArr.indexOf(item.id) !== -1) {
        this.data.selfModule.push({
          name: item.name,
          children: item.detail.filter((item) => {
            return moduleArr.indexOf(item.id) !== -1;
          }),
        });
      }
    });
    this.setData({
      selfModule: this.data.selfModule,
    });
	},
	
	toManage(){
		wx.reLaunch({
			url: '/pages/manage/manage',
		})
	},
});
