// pages/quotedPrice/quotedPrice.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  debounce,
  wxReq,
  getChineseStatus,
  formatDate,
  getUserList,
  getClientList,
  getSomeDateList,
} = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: {
      options: [
        {
          label: "选项1",
          value: 0,
        },
        {
          label: "选项2",
          value: 1,
        },
      ],
      value: 0,
    },
    statusList: [
      {
        text: "全部",
        id: "",
      },
      {
        text: "待审核",
        id: 0,
      },
      {
        text: "已审核",
        id: 1,
      },
      {
        text: "已驳回",
        id: 2,
      },
    ],
    clientList: {
      options: [
        {
          label: "选项1",
          options: [
            {
              label: "选项1",
              value: "0-0",
            },
            {
              label: "选项2",
              value: "0-1",
            },
          ],
          value: "0",
        },
      ],
      value: ["0", "0-0"],
    },
    someDateList: {
      options: [
        {
          label: "选项1",
          value: 0,
        },
        {
          label: "选项2",
          value: 1,
        },
      ],
      value: 0,
    },
    orderList: [],
    tabList: [
      {
        label: "123",
      },
    ],
    page: 1,
    status: "",
    user_id: "",
    client_id: "",
    keyword: "",
    chooseDate: ["", ""],
    isEnd: false,
    showLoading: false,
    noData: false,
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

    getUserList("quotedPrice");
    getClientList("quotedPrice");

    let arr = [
      {
        text: "全部",
        id: "",
        children: [
          { text: "全部", id: "", children: [{ text: "全部", id: "" }] },
        ],
      },
    ];

    getSomeDateList();
    this.setData({
      clientList: arr.concat(wx.getStorageSync("clientList").slice(0, 2)),
      userList: wx.getStorageSync("userList"),
      someDateList: wx.getStorageSync("someDateList"),
    });
  },

  onShow() {
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
        url: "/quote/lists",
        method: "GET",
        data: {
          keyword: this.data.keyword,
          is_check: this.data.status,
          user_id: this.data.user_id,
          client_id: this.data.client_id,
          page: this.data.page,
          group_id: "",
          contacts_id: "",
          min_price: "",
          max_price: "",
          start_time: this.data.chooseDate[0],
          end_time: this.data.chooseDate[1],
          limit: 10,
        },
      },
      "quotedPrice"
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
          title: item.title,
          quoteCode: item.code,
          date: formatDate(item.created_at),
          systemPrice: item.system_total_price,
          customer: item.client_name,
          unit: item.settle_unit,
          user: item.user_name,
          imgSrc:
            item.product_data[0].image[0] ||
            "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
          processName: getChineseStatus(item.is_check),
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

    if (type === "user") {
      this.setData({
        showUser: true,
      });
    }

    if (type === "date") {
      this.setData({
        showDate: true,
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
    if (type === "status") {
      this.setData({
        showStatus: false,
      });
    }

    if (type === "user") {
      this.setData({
        showUser: false,
      });
    }

    if (type === "date") {
      this.setData({
        showDate: false,
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
    if (type === "status") {
      this.data.status = e.detail.value[0].id;
    }

    if (type === "user") {
      this.data.user_id = e.detail.value[0].id;
    }

    if (type === "date") {
      this.data.chooseDate = e.detail.value[0].id;
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
      url: "/pages/quotedPriceDetail/quotedPriceDetail?id=" + item.id,
    });
  },

  toCreate() {
    wx.navigateTo({
      url: "/pages/quotedPriceCreate/quotedPriceCreate",
    });
  },
});
