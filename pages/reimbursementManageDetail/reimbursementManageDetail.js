// pages/reimbursementManageDetail/reimbursementManageDetail.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const { isIfLogin, wxReq, isHasPermissions } = require("../../utils/util");

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
    current: 2,
    textInputDesc: "",
    textInputReason: "",
    statusList: [
      "",
      "https://file.zwyknit.com/waiting.png",
      "https://file.zwyknit.com/pass.png",
      "https://file.zwyknit.com/return.png",
    ],
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
    wxReq(
      {
        url: "/receipt/detail",
        method: "GET",
        data: {
          id: this.data.id,
        },
      },
      "/reimbursementManageDetail/reimbursementManageDetail&id=" + this.data.id
    ).then((res) => {
      let data = res.data.data;
      data.created_at = data.created_at.slice(0, 10);
      data.certificate = data.certificate ? data.certificate.split(",") : [];

      this.setData({
        detailData: data,
        hasCreateModule: isHasPermissions("18-2"),
      });
    });
  },

  clickImage(e) {
    this.setData({
      showPopup: true,
      clickImg: e.currentTarget.dataset.img,
    });
  },

  closeShowImg(e) {
    this.setData({
      showImg: false,
    });
  },

  openShowImg() {
    this.setData({
      showImg: true,
    });
  },

  changeRadio(e) {
    this.setData({ current: +e.detail.currentKey });
  },

  inputReason(e) {
    this.setData({
      textInputReason: e.detail.value,
    });
  },

  inputDesc(e) {
    this.setData({
      textInputDesc: e.detail.value,
    });
  },

  update(e) {
    wx.redirectTo({
      url:
        "/pages/reimbursementManageCreate/reimbursementManageCreate?isUpdate=true&id=" +
        this.data.id,
    });
  },

  confirmCheck(e) {
    wxReq(
      {
        url: "/receipt/reviewer",
        method: "POST",
        data: {
          id: this.data.detailData.id,
          content: this.data.textInputReason,
          status: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/reimbursementManageDetail/reimbursementManageDetail&id=" + this.data.id
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
	
	toPrev() {
    wx.redirectTo({
      url: "/pages/reimbursementManage/reimbursementManage",
    });
  },
});
