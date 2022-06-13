// pages/quotedPrice/quotedPrice.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  debounce,
  wxReq,
  getChineseStatus,
  formatDate,
  getUserList,
  getClientList,
} = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: {
      options: [
        {
          label: "选项1",
          value: 0,
        },
        {
          label: "选项2",
          value: 1,
        },
      ],
      value: 0,
    },
    statusList: {
      options: [
        {
          label: "全部",
          value: 999999,
        },
        {
          label: "待审核",
          value: 0,
        },
        {
          label: "已审核",
          value: 1,
        },
        {
          label: "已驳回",
          value: 2,
        },
      ],
      value: 999999,
    },
    clientList: {
      options: [
        {
          label: "选项1",
          options: [
            {
              label: "选项1",
              value: "0-0",
            },
            {
              label: "选项2",
              value: "0-1",
            },
          ],
          value: "0",
        },
      ],
      value: ["0", "0-0"],
    },
    currentDate: new Date().getTime(),
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    orderList: [],
    tabList: [
      {
        label: "123",
      },
    ],
    page: 1,
    status: "",
    user_id: "",
    keyword: "",
    client_id: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });

    getUserList();
    getClientList();
    this.setData({
      clientList: {
        options: wx.getStorageSync("clientList").slice(0, 2),
        value: ["0", "0-0", ""],
      },
      userList: {
        options: wx.getStorageSync("userList"),
        value: wx.getStorageSync("userList")[0].value,
      },
    });
    this.getList();
  },

  getList() {
    wxReq({
      url: "/quote/lists",
      method: "GET",
      data: {
				keyword:this.data.keyword,
				is_check: this.data.status,
				user_id: this.data.user_id,
				client_id: this.data.client_id.length>2?this.data.client_id[2].split('-')[2]:'',
        page: this.data.page,
        limit: 10,
      },
      success: (res) => {
        if (res.data.status === -1) {
          wx.setStorageSync("isLogin", false);
          toSignUp();
          return;
        }

        let data = res.data.data.items;

        data.forEach((item,index) => {
          this.data.orderList.push({
            id: item.id,
            customer: item.client_name,
            title: item.title,
            quoteCode: item.code,
            date: formatDate(item.created_at),
            systemPrice: item.system_total_price,
            customer: item.client_name,
            unit: item.settle_unit,
            user: item.user_name,
            imgSrc:
              item.product_data[0].image[0] ||
              "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
            processName: getChineseStatus(item.is_check),
          });
        });

        this.setData({
          page: this.data.page + 1,
          orderList: this.data.orderList,
        });
      },
    });
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  onConfirm(e) {
    this.data.page = 1;
    this.onCancel();
    this.getList();
  },

  onCancel(e) {
    this.setData({
      show: false,
    });
  },

  changeUser(e) {
    this.setData({
      "userList.value": e.detail.value,
    });

    this.data.user_id = e.detail.value;
    this.data.page = 1;
    this.reqOrder();
  },

  changeClient(e) {
    this.setData({
      "clientList.value": e.detail.value,
    });
    this.data.client_id = e.detail.value;
    this.data.page = 1;
    this.reqOrder();
  },

  changeStatus(e) {
    this.setData({
      "statusList.value": e.detail.value,
    });

    this.data.status = e.detail.value;
    this.data.page = 1;
    this.reqOrder();
  },

  handleSingleSelect(e) {
    this.setData({
      "singleSelect.value": e.detail.value,
    });
  },

  onSearch(e) {
    this.data.keyWord = e.detail.value;
		this.data.page = 1;
    this.reqOrder();
  },

  showDatePick() {
    this.setData({
      show: true,
    });
  },

  reqOrder: debounce(function () {
    this.getList();
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
      url:
        "/pages/quotedPrice/quotedPriceDetail/quotedPriceDetail?id=" + item.id,
    });
  },

  toCreate() {
    wx.navigateTo({
      url: "/pages/quotedPrice/quotedPriceCreate/quotedPriceCreate",
    });
  },
});
