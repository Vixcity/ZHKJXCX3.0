// pages/billingManagement/deductionForm/deductionForm.js
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
    showDate: false,
    showClient: false,
    showGroup: false,
    showUser: false,
    showLoading: false,
    showPopup: false,
    noData: false,
    isEnd: false,
    userList: [],
    groupList: [],
    dateList: [],
    statusList: [],
    orderType: [],
    list: [],
    activeName: "",
    code: "",
    user_id: "",
    group_id: "",
    client_id: "",
    client_name: "",
    is_check: "",
    order_type: "",
    start_time: "",
    end_time: "",
    img_url: "",
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getScreenList();
    this.getList();
  },
  // 拿到筛选列表
  getScreenList() {
    getUserList("/billingManagement/deductionForm/deductionForm");
    getGroupList("/billingManagement/deductionForm/deductionForm");
    getClientList("/billingManagement/deductionForm/deductionForm");
    getSomeDateList("/billingManagement/deductionForm/deductionForm");

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
      clientList: wx.getStorageSync("clientList").slice(2),
      dateList: wx.getStorageSync("someDateList"),
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
  },

  // 选择器提交
  confirmData(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "date") {
      console.log(e.detail.value);
      this.data.start_time = e.detail.value[0].id[0];
      this.data.end_time = e.detail.value[0].id[1];
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
      user_id,
      group_id,
      client_id,
      start_time,
      end_time,
      page,
    } = this.data;
    wxReq(
      {
        url: "/doc/deduct/lists",
        method: "GET",
        data: {
          user_id,
          group_id,
          client_id,
          start_time,
          end_time,
          page,
          limit: 10,
        },
      },
      "/billingManagement/deductionForm/deductionForm"
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
      additional.total_price = (additional.total_price / 10000).toFixed(2);

      this.data.page += 1;
      this.setData({
        showLoading: false,
        list,
        additional,
      });
    });
  },

  showImg(e) {
    const { item } = e.currentTarget.dataset;
    console.log(item);
    this.setData({
      img_url: item.file_url,
      showPopup: true,
    });
  },

  closePopup() {
    this.setData({
      showPopup: false,
    });
  },
});
