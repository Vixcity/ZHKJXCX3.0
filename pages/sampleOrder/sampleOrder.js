const {
  wxReq,
  debounce,
  getGroupList,
  getUserList,
} = require("../../utils/util");

// pages/sampleOrder/sampleOrder.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusSelect: {
      options: [
        { label: "全部", value: "" },
        { label: "待审核", value: "0" },
        { label: "已审核", value: "1" },
        { label: "已驳回", value: "2" },
      ],
    },
    groupSelect: {
      options: [
        { label: "全部", value: "" },
        { label: "选项1", value: "0" },
        { label: "选项2", value: "1" },
        { label: "选项3", value: "2" },
      ],
    },
    userSelect: {
      options: [
        { label: "全部", value: "" },
        { label: "选项1", value: "0" },
        { label: "选项2", value: "1" },
        { label: "选项3", value: "2" },
      ],
    },
    orderList: [],
    is_check: "",
    group_id: "",
    user_id: "",
    page: 1,
    showLoading: false,
    isEnd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getGroupList("sampleOrder");
    getUserList("sampleOrder");

    this.setData({
      groupSelect: {
        options: wx.getStorageSync("groupList"),
      },
      userSelect: {
        options: wx.getStorageSync("userList"),
      },
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
          order_type: 2,
          user_id: this.data.user_id,
          is_check: this.data.is_check,
          group_id: this.data.group_id,
        },
        method: "GET",
      },
      "sampleOrder"
    ).then((res) => {
      if (res.data.data.items.length < 10) {
        this.setData({
          isEnd: true,
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

  changeSingleSelect(e) {
    const { type } = e.currentTarget.dataset;
    let obj = {};

    obj[type] = e.detail.value;
    this.setData(obj);

    this.data.page = 1;
    this.data.orderList = [];
    this.setData({ orderList: [], isEnd: false });
    this.getList();
  },

  toDetail(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url:
        "/pages/sampleOrder/sampleOrderDetail/sampleOrderDetail?id=" + item.id,
    });
  },
});
