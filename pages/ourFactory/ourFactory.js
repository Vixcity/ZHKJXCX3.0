import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  formatDate,
  isIfLogin,
  wxReq,
  debounce,
  getClientList,
  getProcessList,
  getGroupList,
  getUserList,
} = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    clientList: [],
    processList: [],
    groupList: [],
    userList: [],
    addStatusList: [
      { id: "", text: "全部" },
      { id: "0", text: "待添加" },
      { id: "1", text: "已添加" },
    ],
    orderTypeList: [
      { id: "", text: "全部" },
      { id: "1", text: "订单" },
      { id: "2", text: "样单" },
    ],
    showSearch: false,
    showLoading: false,
    isEnd: false,
    noData: false,
    page: 1,
    limit: 10,
    process_name: "",
    has_weave_plan: "",
    client_id: "",
    group_id: "",
    user_id: "",
    keyword: "",
    group_name: "",
    user_name: "",
    order_type: "",
    start_time: "",
    end_time: "",
    showUser: false,
    showGroup: false,
    showProcess: false,
    showClient: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const titles = ["创建人", "单据类型", "负责小组", "添加状态", "创建时间"];
    const vtabs = titles.map((item) => ({ title: item }));

    let { type } = options;

    this.setData({
      type,
      vtabs,
      isEnd: false,
      noData: false,
      page: 1,
      list: [],
    });

    this.getScreen();
    this.reqOrder();
  },

  getScreen() {
    getClientList("/ourFactory/ourFactory");
    getProcessList("/ourFactory/ourFactory");
    getGroupList("/ourFactory/ourFactory");
    getUserList("/ourFactory/ourFactory");

    let arr = [
      {
        text: "全部",
        id: "",
        children: [
          { text: "全部", id: "", children: [{ text: "全部", id: "" }] },
        ],
      },
    ];

    let arr1 = [
      {
        text: "全部",
        id: "",
        children: [{ text: "全部", id: "" }],
      },
    ];

    this.setData({
      clientList: arr.concat(wx.getStorageSync("clientList").slice(0, 2)),
      processList: arr1.concat(wx.getStorageSync("processList")),
      groupList: wx.getStorageSync("groupList"),
      userList: wx.getStorageSync("userList"),
      dateList: wx.getStorageSync("someDateList"),
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

    if (type === "addstatus") {
      this.setData({
        has_weave_plan: this.data.addStatusList[index].id,
      });
    }

    if (type === "ordertype") {
      this.setData({
        order_type: this.data.orderTypeList[index].id,
      });
    }

    if (type === "contacts") {
      this.setData({
        contacts_id: this.data.contactsList[index].id,
      });
    }

    if (type === "date") {
      this.setData({
        start_time: this.data.dateList[index].id[0],
        end_time: this.data.dateList[index].id[1],
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

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;
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

    if (type === "process") {
      this.setData({
        showProcess: true,
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

    if (type === "process") {
      this.setData({
        showProcess: false,
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
    if (type === "user") {
      this.data.user_id = e.detail.value[0].id;
      this.setData({
        user_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
      });
    }

    if (type === "group") {
      this.data.group_id = e.detail.value[0].id;
      this.setData({
        group_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
      });
    }

    if (type === "process") {
      this.setData({
        process_name: e.detail.value[1].id,
      });
    }

    if (type === "keyword") {
      this.setData({
        keyword: e.detail.value,
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
      this.setData({
        client_name:
          e.detail.value[2].text !== "全部" ? e.detail.value[2].text : "",
      });
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

  onSearch(e) {
    this.data.keyWord = e.detail.value;
    this.data.page = 1;
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
  },

  showChangeSearch() {
    this.setData({
      showSearch: true,
    });
  },

  changeSearchType(e) {
    this.setData({
      searchType: e.currentTarget.dataset.index,
      showSearch: false,
    });
    this.data.page = 1;
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
  },

  reqOrder: debounce(function () {
    if (this.data.isEnd) {
      return;
    }

    this.setData({
      showLoading: true,
    });

    let list = this.data.list;

    wxReq(
      {
        url: "/order/lists",
        method: "GET",
        data: {
          page: this.data.page,
          limit: this.data.limit,
          is_draft: 2,
          order_type: this.data.order_type,
          keyword: this.data.keyword,
          client_id: this.data.client_id,
          has_weave_plan: this.data.has_weave_plan,
          start_time: this.data.start_time,
          end_time: this.data.end_time,
          user_id: this.data.user_id,
          group_id: this.data.group_id,
        },
      },
      "/ourFactory/ourFactory&type=" + (this.data.type || 2)
    ).then((res) => {
      if (res.data.code === 200) {
        if (this.data.page === 1) {
          list = [];
        }

        if (this.data.page === 1 && res.data.data.items.length === 0) {
          this.setData({
            noData: true,
          });
        }

        if (res.data.data.items.length < 10) {
          this.setData({
            isEnd: true,
            showLoading: false,
          });
        }

        this.data.page += 1;
        list = list.concat(res.data.data.items);

        this.setData({
          showLoading: false,
          list,
          total: res.data.data.total,
        });
      }

      if (res.data.status === -1) {
        wx.setStorageSync("isLogin", false);
        toSignUp();
      }
    });
  }, 1000),

  toDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (item.has_weave_plan.status === 1) {
      const id = item.id;
      wx.navigateTo({
        url: "/pages/ourFactoryDetail/ourFactoryDetail?id=" + id,
      });
    } else {
			wx.lin.showMessage({
				type: "warning",
				duration: 3000,
				content: "请先添加生产计划",
				top: getApp().globalData.navH,
			});
		}
  },

  toIndex() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});
