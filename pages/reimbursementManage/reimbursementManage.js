// pages/reimbursementManage/reimbursementManage.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  debounce,
  wxReq,
  getGroupList,
  getSomeDateList,
  isHasPermissions,
} = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupList: [],
    statusList: [
      {
        text: "全部",
        id: "",
      },
      {
        text: "待审核",
        id: 1,
      },
      {
        text: "已审核",
        id: 2,
      },
      {
        text: "已驳回",
        id: 3,
      },
    ],
    someDateList: [],
    orderList: [],
    page: 1,
    status: "",
    group_name: "",
    client_id: "",
    keyword: "",
    chooseDate: [
      new Date().getFullYear() + "-01-01",
      new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
    ],
    isEnd: false,
    showLoading: false,
    noData: false,
    hasCreateModule: false,
    status: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });

    getGroupList("/reimbursementManage/reimbursementManage");
    getSomeDateList();

    let someDateList = wx.getStorageSync("someDateList");
    someDateList[0].text = "今年到当前日期";
    someDateList[0].id = [
      new Date().getFullYear() + "-01-01",
      new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
    ];

    this.setData({
      groupList: wx.getStorageSync("groupList"),
      someDateList,
    });
  },

  onShow() {
    this.setData({
      orderList: [],
      isEnd: false,
      noData: false,
      page: 1,
      hasCreateModule: isHasPermissions("18-1"),
    });
    this.getList();
  },

  getList() {
    if (this.data.isEnd) {
      return;
    }

    this.setData({
      showLoading: true,
    });

    wxReq(
      {
        url: "/receipt/list",
        method: "GET",
        data: {
          keyword: this.data.keyword,
          status: this.data.status,
          group: this.data.group_name,
          page: this.data.page,
          start_time: this.data.chooseDate[0] + " 00:00:00",
          end_time: this.data.chooseDate[1] + " 23:59:59",
          limit: 10,
        },
      },
      "/reimbursementManage/reimbursementManage"
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

      data.forEach((item, index) => {
        this.data.orderList.push({
          id: item.id,
          customer: item.client_name,
          title: item.code || "无报销单编号",
          quoteCode:
            item.name + "-" + (item.group || "无小组") ||
            "暂无报销人员小组信息",
          date: "创建时间：" + item.created_at.slice(0, 10),
          reimbursementPrice: item.amount,
          unit: item.settle_unit,
          user: item.user.name || "无创建人信息",
          imgSrc:
            item.certificate?.split(",")[0] ||
            "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          processName:
            item.status === 1
              ? "待审核"
              : item.status === 2
              ? "已审核"
              : item.status === 3
              ? "已驳回"
              : "状态异常",
        });
      });

      this.setData({
        page: this.data.page + 1,
        orderList: this.data.orderList,
      });
    });
  },

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "status") {
      this.setData({
        showStatus: true,
      });
    }

    if (type === "group") {
      this.setData({
        showGroup: true,
      });
    }

    if (type === "date") {
      this.setData({
        showDate: true,
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

    if (type === "group") {
      this.setData({
        showGroup: false,
      });
    }

    if (type === "date") {
      this.setData({
        showDate: false,
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
      });
    }

    if (type === "group") {
      this.setData({
        group_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
      });
    }

    if (type === "date") {
      this.data.chooseDate = e.detail.value[0].id;
      this.setData({
        date_name:
          e.detail.value[0].text !== "今年到当前日期"
            ? e.detail.value[0].text
            : "",
      });
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

  onSearch(e) {
    this.data.keyword = e.detail.value;
    this.data.page = 1;
    this.setData({
      orderList: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
  },

  reqOrder: debounce(function () {
    this.getList();
  }, 1000),

  toLogin(e) {
    if (e) {
      this.toSignUp();
    } else {
      Dialog.confirm({
        title: "您还未登录",
        message: "点击确认前往登录界面",
        zIndex: 11601,
      })
        .then(() => {
          this.toSignUp();
        })
        .catch(() => {
          wx.lin.showMessage({
            type: "error",
            duration: 4000,
            content: "您已取消，请登录以获取更好的用户体验",
            top: getApp().globalData.navH,
          });
        });
    }
  },

  toDetail(e) {
    let { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url:
        "/pages/reimbursementManageDetail/reimbursementManageDetail?id=" +
        item.id,
    });
  },

  toCreate() {
    wx.navigateTo({
      url: "/pages/reimbursementManageCreate/reimbursementManageCreate",
    });
  },

  toIndex() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});
