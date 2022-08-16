const {
  wxReq,
  debounce,
  isIfLogin,
  getGroupList,
  getClientList,
  getUserList,
  getOrderStatusList,
} = require("../../utils/util");

// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusList: [],
    orderStatusList: [],
    groupList: [],
    userList: [],
    clientList: [],
    orderList: [],
    is_check: "",
    status: "",
    group_id: "",
    user_id: "",
    contacts_id: "",
    start_time: "",
    end_time: "",
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
    const titles = ["创建人", "负责小组", "订单状态", "审核状态", "创建时间"];
    const vtabs = titles.map((item) => ({ title: item }));

    this.setData({
      vtabs,
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
    getGroupList("/order/order");
    getUserList("/order/order");
    getClientList("/order/order");

    let orderStatusList = getOrderStatusList();
    orderStatusList[0].text = "全部";
    orderStatusList[0].id = "";

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
      orderStatusList,
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
          order_type: 1,
          keyword: this.data.keyword,
          client_id: this.data.client_id,
          contacts_id: this.data.contacts_id,
          user_id: this.data.user_id,
          group_id: this.data.group_id,
          status: this.data.status,
          is_check: this.data.is_check,
          start_time: this.data.start_time,
          end_time: this.data.end_time,
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
      // console.log(res.data.data.items)

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
    const { type } = e.currentTarget.dataset;
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
      orderList: [],
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
        contactsList: [],
        contacts_id: "",
        contacts_name: "",
      });
      return;
    }
    wxReq(
      {
        url: "/client/detail",
        data: { id },
        method: "GET",
      },
      "/pages/order/order"
    ).then((res) => {
      let contactsList = res.data.data.contacts_data.map((item) => {
        return { id: item.id, text: item.name };
      });
      this.setData({
        client_name: text,
        client_id: id,
        contacts_id: "",
        contacts_name: "",
        contactsList,
      });
    });
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

    if (type === "orderstatus") {
      this.setData({
        status: this.data.orderStatusList[index].id,
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
      status: "",
    });
  },

  toDetail(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: "/pages/orderDetail/orderDetail?id=" + item.id,
    });
  },

  toIndex() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});
