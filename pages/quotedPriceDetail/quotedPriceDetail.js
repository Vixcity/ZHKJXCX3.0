// pages/quotedPrice/quotedPriceDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  wxReq,
  formatDate,
	getStatusImage,
	isHasPermissions,
} = require("../../utils/util");

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
    result: [""],
    showShenHe: false,
    showPopup: false,
    current: 1,
    textInputDesc: "",
    statusList: getStatusImage(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
			id: options.id,
			hasCreateModule: isHasPermissions('1-2'),
    });

    this.getDetail();
  },

  getDetail() {
    wxReq(
      {
        url: "/quote/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/quotedPriceDetail/quotedPriceDetail&id=" + this.data.id
    ).then((res) => {
      let data = res.data.data;
      data.created_at = formatDate(data.created_at, "YYYY-MM-DD");
      data.product_data.forEach((item) => {
        if (item.image_data.length === 0) {
          item.image_data = "";
        }
        if (item.desc === null) {
          item.desc = "";
        }
      });
      data.allPrice = (
        Number(data.commission_price) +
        Number(data.profit_price) +
        Number(data.rate_price)
      ).toFixed(2);

      let realTotalPrice = (
        Number(data.total_cost_price) /
        (1 -
          ((Number(data.commission_percentage) / 100 || 0) +
            (Number(data.profit_percentage) / 100 || 0) +
            Number(data.rate_taxation) / 100 || 0))
      ).toFixed(2);

      let realTotalPriceChange = (
        (Number(realTotalPrice) / Number(data.exchange_rate)) *
        100
      ).toFixed(2);

      this.setData({
        detailData: data,
        realTotalPrice,
        realTotalPriceChange,
      });
    });
  },

  clickImage(e) {
    this.setData({
      showPopup: true,
      clickImg: e.currentTarget.dataset.img,
    });
  },

  changeRadio(e) {
    this.setData({ current: +e.detail.currentKey });
  },

  inputDesc(e) {
    this.setData({
      textInputDesc: e.detail.value,
    });
  },

  updateQuotedPrice(e) {
    wx.redirectTo({
      url:
        "/pages/quotedPriceCreate/quotedPriceCreate?isUpdate=true&id=" +
        this.data.id,
    });
  },

  confirmCheck(e) {
    wxReq(
      {
        url: "/doc/check",
        method: "POST",
        data: {
          check_type: 5,
          pid: this.data.detailData.id,
          check_desc:
            this.data.current === 1
              ? ""
              : this.data.result.toString().replaceAll(",", ";"),
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/quotedPriceDetail/quotedPriceDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });
        this.getDetail();
        this.setData({
          showShenHe: false,
        });
      }
    });
  },

  closePopup() {
    this.setData({
      showPopup: false,
    });
  },

  openCheck() {
    this.setData({
      showShenHe: true,
    });
  },

  closeCheck() {
    this.setData({
      showShenHe: false,
    });
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

  toOrderDetail(e) {
    const { type } = e.currentTarget.dataset;
    if (type == 1) {
      wx.redirectTo({
        url: "/pages/orderDetail/orderDetail?id=" + e.currentTarget.dataset.id,
      });
    } else {
      wx.redirectTo({
        url:
          "/pages/sampleOrderDetail/sampleOrderDetail?id=" +
          e.currentTarget.dataset.id,
      });
    }
  },
});
