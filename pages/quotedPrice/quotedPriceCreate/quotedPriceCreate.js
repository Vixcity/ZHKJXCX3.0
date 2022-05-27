// pages/quotedPrice/quotedPriceCreate.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { isIfLogin, debounce, wxReq } = require("../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [
      {
        url: "https://img.yzcdn.cn/vant/leaf.jpg",
        name: "图片1",
        status: "uploading",
        message: "上传中",
      },
      {
        url: "https://img.yzcdn.cn/vant/tree.jpg",
        name: "图片2",
        status: "failed",
        message: "上传失败",
      },
      {
        url: "https://img.yzcdn.cn/vant/tree.jpg",
        name: "图片2",
      },
      {
        url: "https://img.yzcdn.cn/vant/tree.jpg",
        name: "图片2",
      },
    ],
    isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });
  },

  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: "https://example.weixin.qq.com/upload", // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: "file",
      formData: { user: "test" },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },

  beforeRead(event) {
    const { file, callback } = event.detail;
    callback(file.type === "image");
  },
});
