const {
  wxReq,
  debounce,
  isIfLogin,
  getGroupList,
  getClientList,
  getUserList,
} = require("../../utils/util");

// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusList: [
      { text: "全部", id: "" },
      { text: "待审核", id: "0" },
      { text: "已审核", id: "1" },
      { text: "已驳回", id: "2" },
    ],
    groupList: [],
    userList: [],
    clientList: [],
    orderList: [],
    is_check: "",
    group_id: "",
    user_id: "",
    client_id: "",
    keyword: "",
    page: 1,
    showLoading: false,
    isEnd: false,
    noData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    getGroupList("/order/order");
    getUserList("/order/order");
    getClientList("/order/order");

    let arr = [
      {
        text: "全部",
        id: "",
        children: [
          {
            text: "全部",
            id: "",
            children: [
              {
                text: "全部",
                id: "",
              },
            ],
          },
        ],
      },
    ];

    this.setData({
      isLogin,
      groupList: wx.getStorageSync("groupList"),
      userList: wx.getStorageSync("userList"),
      clientList: arr.concat(wx.getStorageSync("clientList").splice(0, 2)),
    });
    this.getList();
  },

  getList() {
    if (this.data.isEnd) return;

    this.setData({
      showLoading: true,
    });

    wxReq(
      {
        url: "/order/lists",
        data: {
          page: this.data.page,
          limit: 10,
          order_type: 1,
          client_id: this.data.client_id,
          user_id: this.data.user_id,
          keyword: this.data.keyword,
          is_check: this.data.is_check,
          group_id: this.data.group_id,
        },
        method: "GET",
      },
      "/order/order"
    ).then((res) => {
      if (res.data.data.items.length < 10) {
        this.setData({
          isEnd: true,
        });
      }

      if (this.data.page === 1 && res.data.data.items.length === 0) {
        this.setData({
          noData: true,
        });
      }
      this.data.page += 1;
      this.data.orderList = this.data.orderList.concat(res.data.data.items);

      this.setData({
        orderList: this.data.orderList,
        showLoading: false,
      });
    });
  },

  reqOrder: debounce(function () {
    this.getList();
  }, 1000),

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "status") {
      this.setData({
        showStatus: true,
      });
    }

    if (type === "user") {
      this.setData({
        showUser: true,
      });
    }

    if (type === "group") {
      this.setData({
        showGroup: true,
      });
    }

    if (type === "client") {
      this.setData({
        showClient: true,
      });
    }
  },

  // 关闭选择器
  closeShowPicker(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "status") {
      this.setData({
        showStatus: false,
      });
    }

    if (type === "user") {
      this.setData({
        showUser: false,
      });
    }

    if (type === "group") {
      this.setData({
        showGroup: false,
      });
    }

    if (type === "client") {
      this.setData({
        showClient: false,
      });
    }
  },

  // 选择器提交
  confirmData(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "status") {
      this.data.is_check = e.detail.value[0].id;
    }

    if (type === "user") {
      this.data.user_id = e.detail.value[0].id;
    }

    if (type === "group") {
      this.data.group_id = e.detail.value[0].id;
    }

    if (type === "client") {
      if (!e.detail.value[2]) {
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "当前没有选中公司，请重新选择",
          top: getApp().globalData.navH,
        });
        return;
      }
      this.data.client_id = e.detail.value[2].id;
    }

    this.data.page = 1;
    this.setData({
      orderList: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
    this.closeShowPicker(e);
  },

  toDetail(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: "/pages/orderDetail/orderDetail?id=" + item.id,
    });
  },
});
