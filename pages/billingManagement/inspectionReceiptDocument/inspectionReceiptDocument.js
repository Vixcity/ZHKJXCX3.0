// pages/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument.js
const {
  getBillingList,
  wxReq,
  debounce,
  getUserList,
  getGroupList,
  getClientList,
  getSomeDateList,
} = require("../../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    showLoading: false,
    noData: false,
    isEnd: false,
    userList: [],
    groupList: [],
    dateList: [],
    statusList: [],
    orderType: [],
    list: [],
    activeName: "",
    keyword: "",
    user_id: "",
    group_id: "",
    client_id: "",
    client_name: "",
    is_check: "",
    order_type: "",
    start_time: "",
    end_time: "",
    page: 1,
  },

  onLoad(options) {
    this.getScreenList();
    const titles = ["创建人", "审核状态", "创建时间"];
    const vtabs = titles.map((item) => ({ title: item }));
    this.setData({ list: [], vtabs });
    this.confirmData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    if (wx.getStorageSync("isDo")) {
      this.getScreenList();
      this.setData({ list: [] });
      this.confirmData();
      wx.setStorageSync("isDo", false);
    }
  },

  // 拿到筛选列表
  getScreenList() {
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
    getUserList(
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument"
    );
    getGroupList(
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument"
    );
    getClientList(
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument"
    );
    getSomeDateList(
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument"
    );

    this.setData({
      user_id: "",
      userList: wx.getStorageSync("userList").map((item) => {
        return {
          id: item.id,
          text: item.text,
          checked: false,
        };
      }),
      group_id: "",
      groupList: wx.getStorageSync("groupList").map((item) => {
        return {
          id: item.id,
          text: item.text,
          checked: false,
        };
      }),
      start_time: "",
      end_time: "",
      dateList: wx.getStorageSync("someDateList").map((item) => {
        return {
          id: item.id,
          text: item.text,
          checked: false,
        };
      }),
      is_check: "",
      statusList: [
        { text: "全部", id: "", checked: false },
        { text: "待审核", id: 0, checked: false },
        { text: "已审核", id: 1, checked: false },
        { text: "已驳回", id: 2, checked: false },
        { text: "状态异常", id: 3, checked: false },
      ],
      order_type: "",
      orderType: [
        { text: "全部", id: "", checked: false },
        { text: "订单", id: 1, checked: false },
        { text: "样单", id: 2, checked: false },
      ],
      client_name: "",
      client_id: "",
      clientList: arr.concat(wx.getStorageSync("clientList").slice(6, 8)),
    });
  },

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "date") {
      this.setData({
        showDate: true,
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

    if (type === "contacts") {
      this.setData({
        showContacts: true,
      });
    }

    if (type === "status") {
      this.setData({
        showStatus: true,
      });
    }
  },

  // 关闭选择器
  closeShowPicker(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "date") {
      this.setData({
        showDate: false,
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

    if (type === "contacts") {
      this.setData({
        showContacts: false,
      });
    }

    if (type === "status") {
      this.setData({
        showStatus: false,
      });
    }
  },

  // 选择器提交
  confirmData(e) {
    let type;
    if (e?.currentTarget) {
      type = e.currentTarget.dataset.type;
    }

    if (type === "date") {
      this.data.start_time = e.detail.value[0].id[0];
      this.data.end_time = e.detail.value[0].id[1];
    }

    if (type === "keyword") {
      this.data.keyword = e.detail.value;
    }

    if (type === "user") {
      this.data.user_id = e.detail.value[0].id;
    }

    if (type === "group") {
      this.data.group_id = e.detail.value[0].id;
    }

    if (type === "contacts") {
      this.setData({
        contacts_id: e.detail.value[0].id,
        contacts_name: e.detail.value[0].text,
      });
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
      this.checkClient(e.detail.value[2]);
    }

    this.data.page = 1;
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
    this.closePopup();
    this.closeShowPicker(e);
  },

  // 打开选择框
  openPopup() {
    this.setData({
      showPopup: true,
    });
  },

  // 关闭选择框
  closePopup() {
    this.setData({
      showPopup: false,
    });
  },

  // 选择公司
  checkClient(e) {
    const { text, id } = e;
    if (text === "全部") {
      this.setData({
        client_name: "",
        client_id: "",
      });
    } else {
      this.setData({ client_name: text, client_id: id });
    }
  },

  // 更改选择
  bindPickerChangeAge(e) {
    const { type } = e.currentTarget.dataset;
    let index = e.detail.value;

    if (type === "user") {
      this.setData({
        user_id: this.data.userList[index].id,
      });
    }

    if (type === "group") {
      this.setData({
        group_id: this.data.groupList[index].id,
      });
    }

    if (type === "status") {
      this.setData({
        is_check: this.data.statusList[index].id,
      });
    }

    if (type === "order_type") {
      this.setData({
        order_type: this.data.orderType[index].id,
      });
    }

    if (type === "date") {
      this.setData({
        start_time: this.data.dateList[index].id[0],
        end_time: this.data.dateList[index].id[1],
      });
    }
  },

  // 更改关键字
  changeParams(e) {
    this.setData({
      keyword: e.detail.value,
    });
    this.confirmData();
  },

  // 节流
  reqOrder: debounce(function () {
    this.getList();
  }, 1000),

  // 点击确认
  getList() {
    if (this.data.isEnd) {
      return;
    }

    this.setData({
      showLoading: true,
    });

    let {
      is_check,
      user_id,
      keyword,
      client_id,
      start_time,
      end_time,
      page,
    } = this.data;
    wxReq(
      {
        url: "/inspection/lists",
        method: "GET",
        data: {
          is_check,
          user_id,
          keyword,
          client_id,
          start_time,
          end_time,
          page,
          limit: 10,
          type: 1,
        },
      },
      "/billingManagement/inspectionReceiptDocument/inspectionReceiptDocument"
    ).then((res) => {
      let data = res.data.data.items;

      if (data.length < 10) {
        this.setData({
          isEnd: true,
        });
      }

      if (this.data.page === 1 && data.length === 0) {
        this.setData({
          noData: true,
          showLoading: false,
        });
      }

      let list = this.data.list.concat(res.data.data.items);
      let additional = res.data.data.additional;
      additional.total_number = (additional.total_number / 10000).toFixed(2);

      additional.total_deduct_price = (
        additional.total_deduct_price / 10000
      ).toFixed(2);

      this.data.page += 1;
      this.setData({
        showLoading: false,
        list,
        additional,
      });
    });
  },

  toDetail(e) {
    const { item } = e.currentTarget.dataset;

    // wx.setStorageSync('inspectionReceiptDocumentDetail', item)

    wx.navigateTo({
      url:
        "./inspectionReceiptDocumentDetail?id=" +
        item.order_id +
        "&pid=" +
        item.id,
    });
  },

  toIndex() {
    wx.reLaunch({
      url: "/pages/billingManagement/index",
    });
  },
});
