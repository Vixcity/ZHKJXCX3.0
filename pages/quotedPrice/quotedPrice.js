// pages/quotedPrice/quotedPrice.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { isIfLogin, debounce, wxReq } = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    singleSelect: {
      value: "option_3",
      options: [
        { label: "选项 1", value: "option_1" },
        { label: "选项 2", value: "option_2" },
        { label: "选项 3", value: "option_3" },
        { label: "选项 4", value: "option_4" },
        { label: "选项 5", value: "option_5" },
        { label: "选项 6", value: "option_6" },
        { label: "选项 7", value: "option_7" },
        { label: "选项 8", value: "option_8" },
      ],
      options2: [
        { label: "选项 12", value: "option_1" },
        { label: "选项 22", value: "option_2" },
        { label: "选项 32", value: "option_3" },
        { label: "选项 42", value: "option_4" },
        { label: "选项 52", value: "option_5" },
        { label: "选项 62", value: "option_6" },
        { label: "选项 72", value: "option_7" },
        { label: "选项 82", value: "option_8" },
      ],
      options3: [
        { label: "选项 13", value: "option_1" },
        { label: "选项 23", value: "option_2" },
        { label: "选项 33", value: "option_3" },
        { label: "选项 43", value: "option_4" },
        { label: "选项 53", value: "option_5" },
        { label: "选项 63", value: "option_6" },
        { label: "选项 73", value: "option_7" },
        { label: "选项 83", value: "option_8" },
      ],
    },
    orderList: [
      {
        id: 1,
        customer: "item.client.name",
        title: "item.client.name",
        time: "2022-01-02",
        nowNumber: 20,
        allNumber: 50,
        customer: "asdasd",
        productLen: 5,
        imgSrc:
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        display: 0,
        status: 7,
        processName: "织造",
      },
		],
		tabList:[{
			label:'123',
		}]
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  handleSingleSelect(e) {
    this.setData({
      "singleSelect.value": e.detail.value,
    });
  },

  onSearch(e) {
    this.data.keyWord = e.detail.value;
    this.data.page = 1;
    // this.reqOrder();
	},
	
	addTab(){
		let tabList = this.data.tabList
		tabList.push({label:'456'})
		this.setData({tabList})
	},

  reqOrder: debounce(function () {
    let orderList = this.data.orderList;

    wxReq({
      url: "/weave/plan/lists",
      method: "GET",
      data: params,
      success: (res) => {
        if (res.data.code === 200) {
          if ((this.data.page = 1)) {
            orderList = [];
          }
          if (res.data.data.length < 10) {
            this.setData({
              isEnd: true,
              showLoading: false,
            });
          }

          this.data.page += 1;

          let arr = [];
          res.data.data.forEach((item, index) => {
            console.log(index);
            arr.push({
              id: item.id,
              customer: item.client.name,
              title: item.client.name,
              time: formatDate(item.end_time),
              nowNumber: item.total_real_number,
              allNumber: item.total_number,
              customer: item.code,
              productLen: item.product_info.length,
              imgSrc:
                item.product_info[0].product.image_data !== null &&
                item.product_info[0].product.image_data.length > 0
                  ? item.product_info[0].product.image_data[0].image_url
                  : "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
              display: 0,
              processName: item.process_name,
              item: item,
            });
          });
          orderList = orderList.concat(arr);

          this.setData({
            showLoading: false,
            orderList,
          });
        }

        if (res.data.status === -1) {
          wx.setStorageSync("isLogin", false);
          toSignUp();
        }
      },
    });
  }, 1000),

  toLogin(e) {
    if (e) {
      this.toSignUp();
    } else {
      Dialog.confirm({
        title: "您还未登录",
        message: "点击确认前往登录界面",
        zIndex: 11601,
      })
        .then(() => {
          this.toSignUp();
        })
        .catch(() => {
          wx.lin.showMessage({
            type: "error",
            duration: 4000,
            content: "您已取消，请登录以获取更好的用户体验",
            top: getApp().globalData.navH,
          });
        });
    }
	},
	
  toDetail(e) {
    let { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/quotedPrice/quotedPriceDetail?id=" + item.id,
    });
  },
});
