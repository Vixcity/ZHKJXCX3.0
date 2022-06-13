// pages/quotedPrice/quotedPriceDetail.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  debounce,
  wxReq,
  formatDate,
} = require("../../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listCard: [
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
      {
        showContent: false,
        urls: [
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        ],
      },
    ],
    reasonList: [
      { value: "物料成本偏低", isChecked: true, disabled: false },
      { value: "织造成本偏低", isChecked: false, disabled: false },
      { value: "加工成本偏低", isChecked: false, disabled: false },
      { value: "包装成本偏低", isChecked: false, disabled: false },
      { value: "人工成本偏低", isChecked: false, disabled: false },
      { value: "运费成本偏低", isChecked: false, disabled: false },
      { value: "基本利润偏低", isChecked: false, disabled: false },
      { value: "整体报价偏低", isChecked: false, disabled: false },
    ],
    result: ["物料成本偏低", "加工成本偏低"],
    showShenHe: false,
    showPopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
      id: options.id,
    });

    this.getDetail();
  },

  getDetail() {
    wxReq({
      url: "/quote/detail",
      method: "GET",
      data: {
        id: this.data.id,
      },
      success: (res) => {
        let data = res.data.data;
				data.updated_at = formatDate(data.updated_at, "YYYY-MM-DD");
				data.product_data.forEach(item => {
					if(item.image.length === 0){
						item.image = ''
					}
				});

        this.setData({
          detailData: data,
        });
      },
    });
  },

  clickImage(e) {
    this.setData({
			showPopup: true,
			clickImg: e.currentTarget.dataset.img,
    });
	},
	
	closePopup(){
		this.setData({
			showPopup:false
		})
	},

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

  showShort(e) {
    this.data.listCard[e.detail.id].showContent = false;
    this.setData({ listCard: this.data.listCard });
  },

  showBig(e) {
    this.data.listCard[e.detail.id].showContent = true;
    this.setData({ listCard: this.data.listCard });
  },

  checkBoxChange(e) {
    this.setData({ result: e.detail });
  },
});
