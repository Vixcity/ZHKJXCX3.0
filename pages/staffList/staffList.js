const {
  wxReq,
  debounce,
  getDepartmentList,
  isHasPermissions,
} = require("../../utils/util");

// pages/staffList/staffList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: "",
    type: "",
    keyword: "",
    department_name: "",
    page: 1,
    list: [],
    hasCreateModule: false,
    departmentList: [],
    typeList: [
      {
        id: "",
        text: "全部",
      },
      {
        id: "1",
        text: "临时工",
      },
      {
        id: "2",
        text: "合同工",
      },
    ],
    statusList: [
      {
        id: "",
        text: "全部",
      },
      {
        id: "1",
        text: "在职",
      },
      {
        id: "2",
        text: "离职",
      },
    ],
  },

  onLoad() {
    getDepartmentList("/staffList/staffList");
    this.setData({
      departmentList: wx.getStorageSync("departmentList"),
    });
    this.getList();
  },

  onShow() {
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
      page: 1,
      hasCreateModule: isHasPermissions("17-3"),
    });
    this.getList();
  },

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "status") {
      this.setData({
        showStatus: true,
      });
    }

    if (type === "type") {
      this.setData({
        showType: true,
      });
    }

    if (type === "department") {
      this.setData({
        showDepartment: true,
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

    if (type === "type") {
      this.setData({
        showType: false,
      });
    }

    if (type === "department") {
      this.setData({
        showDepartment: false,
      });
    }
  },

  // 选择器提交
  confirmData(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "status") {
      this.data.status = e.detail.value[0].id;
      this.setData({
        status_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
        status: e.detail.value[0].id,
      });
    }

    if (type === "type") {
      this.setData({
        type_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
        type: e.detail.value[0].id,
      });
    }

    if (type === "department") {
      this.setData({
        department_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
      });
    }

    this.data.page = 1;
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
    this.closeShowPicker(e);
  },

  onSearch(e) {
    this.data.keyword = e.detail.value;
    this.data.page = 1;
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
  },

  reqOrder: debounce(function () {
    this.getList();
  }, 1000),

  getList() {
    if (this.data.isEnd) {
      return;
    }

    this.setData({
      showLoading: true,
    });

    wxReq(
      {
        url: "/staff/list",
        method: "GET",
        data: {
          department: this.data.department_name,
          status: this.data.status,
          type: this.data.type,
          keyword: this.data.keyword,
          page: this.data.page,
          limit: 10,
        },
      },
      "/staffList/staffList"
    ).then((res) => {
      let data = res.data.data.items;

      if (data.length < 10) {
        this.setData({
          isEnd: true,
          showLoading: false,
        });
      }

      if (this.data.page === 1 && data.length === 0) {
        this.setData({
          noData: true,
        });
      }

      data.forEach((item) => {
        item.typeName = item.type == 1 ? "临时工" : "合同工";
      });

      this.data.page += 1;
      this.data.list = this.data.list.concat(data);

      this.setData({
        list: this.data.list,
        showLoading: false,
      });
    });
  },

  toCreate() {
    wx.navigateTo({
      url: "/pages/staffCreate/staffCreate",
    });
  },

  toEdit(e) {
    wx.navigateTo({
      url: "/pages/staffCreate/staffCreate?id=" + e.currentTarget.dataset.id,
    });
  },

  toIndex() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});
