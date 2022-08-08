const {
  wxReq,
  debounce,
  isIfLogin,
  getGroupList,
  getClientList,
  getUserList,
} = require("../../utils/util");

// pages/sampleOrder/sampleOrder.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusList: [],
    groupList: [],
    userList: [],
    clientList: [],
    orderList: [],
    is_check: "",
    group_id: "",
    user_id: "",
    client_id: "",
    contacts_id: "",
    start_time: "",
    end_time: "",
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

    this.setData({
      isLogin,
      orderList: [],
      isEnd: false,
      noData: false,
      page: 1,
    });
    this.getScreen();
    this.getList();
  },

  getScreen() {
    getGroupList("/sampleOrder/sampleOrder");
    getUserList("/sampleOrder/sampleOrder");
    getClientList("/sampleOrder/sampleOrder");

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
      groupList: wx.getStorageSync("groupList"),
      userList: wx.getStorageSync("userList"),
      clientList: arr.concat(wx.getStorageSync("clientList").splice(0, 2)),
      dateList: wx.getStorageSync("someDateList"),
      statusList: [
        { text: "全部", id: "" },
        { text: "待审核", id: "0" },
        { text: "已审核", id: "1" },
        { text: "已驳回", id: "2" },
      ],
    });
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
          client_id: this.data.client_id,
          user_id: this.data.user_id,
          keyword: this.data.keyword,
          is_check: this.data.is_check,
          group_id: this.data.group_id,
          contacts_id: this.data.contacts_id,
          start_time: this.data.start_time,
          end_time: this.data.end_time,
        },
        method: "GET",
      },
      "/sampleOrder/sampleOrder"
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

  // 打开子选择框
  openPopupSon(e) {
    this.setData({
      showPopupSon: true,
      showPopup: false,
    });
  },

  // 关闭子选择框
  closePopupSon() {
    this.setData({
      showPopupSon: false,
      showPopup: true,
    });
  },

  // 子选择框取消
  cancelPopupSon() {
    this.setData({
      client_id: "",
      client_name: "",
    });
    this.closePopupSon();
  },

  // 打开折叠面板
  changeCollapse(e) {
    this.setData({
      activeName: e.detail,
    });
  },

  // 选择公司
  checkClient(e) {
		const { text, id } = e.currentTarget.dataset.item;
		if (text === "全部") {
      this.setData({ client_name: "", client_id: "", contactsList: [] });
			this.closePopupSon();
			return 
    }
    wxReq(
      {
        url: "/client/detail",
        data: { id },
        method: "GET",
      },
      "/pages/quotedPrice/quotedPrice"
    ).then((res) => {
      let contactsList = res.data.data.contacts_data.map((item) => {
        return { id: item.id, text: item.name };
      });
      this.setData({ client_name: text, client_id: id, contactsList });
    });
    this.closePopupSon();
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

    if (type === "contacts") {
      this.setData({
        contacts_id: this.data.contactsList[index].id,
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

    if (type === "orderTypes") {
      this.setData({
        order_types: this.data.orderTypes[index].id,
      });
    }
  },

  // 选择器提交
  confirmData(e) {
    if (e.currentTarget.dataset.type === "keyword") {
      this.setData({
        keyword: e.detail.value,
      });
    }
    this.data.page = 1;
    this.setData({
      orderList: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
    this.closePopup(e);
  },

  reset() {
    this.getScreen();
    this.setData({
      client_id: "",
      user_id: "",
      is_check: "",
      group_id: "",
      contacts_id: "",
      start_time: "",
      end_time: "",
    });
  },

  toDetail(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: "/pages/sampleOrderDetail/sampleOrderDetail?id=" + item.id,
    });
  },
});
