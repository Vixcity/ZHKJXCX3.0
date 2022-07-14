// pages/billingManagement/rawMaterialSupplement/rawMaterialSupplement.js
import Toast from "../../../miniprogram_npm/@vant/weapp/toast/toast";
const {
  getBillingList,
  wxReq,
  debounce,
  getUserList,
  getGroupList,
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
    code: "",
    user_id: "",
    group_id: "",
    is_check: "",
    start_time: "",
    end_time: "",
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getScreenList();
    this.setData({ list: [] });
    this.confirmData();
  },

  // 拿到筛选列表
  getScreenList() {
    getUserList(
      "/billingManagement/rawMaterialSupplement/rawMaterialSupplement"
    );
    getGroupList(
      "/billingManagement/rawMaterialSupplement/rawMaterialSupplement"
    );
    getSomeDateList(
      "/billingManagement/rawMaterialSupplement/rawMaterialSupplement"
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

    if (type === "date") {
      this.setData({
        start_time: this.data.dateList[index].id[0],
        end_time: this.data.dateList[index].id[1],
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
      start_time,
      end_time,
      page,
    } = this.data;
    wxReq(
      {
        url: "/material/sup/lists",
        method: "GET",
        data: {
          is_check,
          user_id,
          group_id,
          code,
          start_time,
          end_time,
          page,
          limit: 10,
        },
      },
      "/billingManagement/rawMaterialSupplement/rawMaterialSupplement"
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

      this.data.page += 1;
      this.setData({
        showLoading: false,
        list,
      });
    });
  },

  // 查看原因
  checkReason(e) {
    Toast(e.currentTarget.dataset.item.desc || "无");
  },

  toDetail(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "./rawMaterialSupplementDetail?id=" + item.id,
    });
  },
});
