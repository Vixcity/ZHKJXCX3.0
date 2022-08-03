// pages/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder.js
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
    showPopupSon: false,
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
    code: "",
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
    this.setData({ list: [] });
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
    getUserList(
      "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder"
    );
    getGroupList(
      "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder"
    );
    getClientList(
      "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder"
    );
    getSomeDateList(
      "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder"
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
			order_types: "",
      orderTypes: [
        { text: "全部", id: "", checked: false },
        { text: "计划订购", id: "plan", checked: false },
        { text: "补纱订购", id: "sup", checked: false },
        { text: "预订购", id: "reserve", checked: false },
      ],
      client_name: "",
      client_id: "",
      clientList: wx.getStorageSync("clientList").slice(2, 4),
    });
  },

  // 打开选择框
  openPopup() {
    this.setData({
      showPopup: true,
    });
  },

  // 打开子选择框
  openPopupSon(e) {
    this.setData({
      showPopupSon: true,
      showPopup: false,
    });
  },

  // 关闭选择框
  closePopup() {
    this.setData({
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
    this.setData({ client_name: text, client_id: id });
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

  // 提交
  confirmData() {
    this.data.list = [];
    this.setData({
      isEnd: false,
      page: 1,
      noData: false,
    });
    this.reqOrder();
    this.closePopup();
  },

  // 更改关键字
  changeParams(e) {
    this.setData({
      code: e.detail.value,
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
      group_id,
      code,
      client_id,
      order_type,
      start_time,
      order_types,
      end_time,
      page,
    } = this.data;

    let obj = {
      is_check,
      user_id,
      group_id,
      code,
      client_id,
      order_type,
      start_time,
      end_time,
      page,
      limit: 10,
      material_type: 1,
    };
    if (!!order_types) {
      obj[order_types] = 1;
    }
    wxReq(
      {
        url: "/material/order/lists",
        method: "GET",
        data: obj,
      },
      "/billingManagement/rawMaterialPurchaseOrder/rawMaterialPurchaseOrder"
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
      additional.total_order_number = (
        additional.total_order_number / 1000
      ).toFixed(2);

      additional.total_order_price = (
        additional.total_order_price / 10000
      ).toFixed(2);

      additional.total_push_number = (
        additional.total_push_number / 1000
      ).toFixed(2);

      additional.total_push_price = (
        additional.total_push_price / 10000
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
    wx.navigateTo({
      url: "./rawMaterialPurchaseOrderDetail?id=" + item.id,
    });
  },
});
