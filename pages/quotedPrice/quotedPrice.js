// pages/quotedPrice/quotedPrice.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  debounce,
  wxReq,
  getChineseStatus,
  getUserList,
  getClientList,
  getGroupList,
  getSomeDateList,
  isHasPermissions,
} = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    statusList: [],
    clientList: [],
    someDateList: [],
    orderList: [],
    page: 1,
    status: "",
    user_id: "",
    client_id: "",
    keyword: "",
    chooseDate: ["", ""],
    isEnd: false,
    showLoading: false,
    noData: false,
    hasCreateModule: false,
    is_check: "",
    status_name: "",
    user_name: "",
    date_name: "",
    client_name: "",
    start_time: "",
    end_time: "",
    group_id: "",
    contacts_id: "",
    min_price: "",
    max_price: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    this.setData({
      isLogin,
    });

    this.getScreen();
  },

  onShow() {
    this.setData({
      orderList: [],
      isEnd: false,
      noData: false,
      page: 1,
      hasCreateModule: isHasPermissions("1-1"),
    });
    this.getList();
  },

  getScreen() {
    getUserList("/quotedPrice/quotedPrice");
    getGroupList("/quotedPrice/quotedPrice");
    getClientList("/quotedPrice/quotedPrice");

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
      dateList: wx.getStorageSync("someDateList"),
      groupList: wx.getStorageSync("groupList"),
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
    });
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
          is_check: this.data.is_check,
          user_id: this.data.user_id,
          client_id: this.data.client_id,
          page: this.data.page,
          group_id: this.data.group_id,
          contacts_id: this.data.contacts_id,
          min_price: this.data.min_price,
          max_price: this.data.max_price,
          start_time: this.data.start_time,
          end_time: this.data.end_time,
          limit: 10,
        },
      },
      "/quotedPrice/quotedPrice"
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
          title: item.code,
          quoteCode: item.client_name,
          date: item.created_at,
          dollor: (
            ((item.system_total_price || 0) / item.exchange_rate) *
            100
          ).toFixed(2),
          systemPrice: item.system_total_price || '0',
          customer: item.title || "暂无标题",
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
      return;
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

  // 输入价格
  inputPrice(e) {
    const { type } = e.currentTarget.dataset;
    let obj = {};
    obj[type] = e.detail.value;

    this.setData(obj);
  },

  // 选择器提交
  confirmData(e) {
    this.data.page = 1;
    this.setData({
      orderList: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
    this.closePopup();
  },

  // 重置
  reset() {
    this.getScreen();
    this.setData({
      min_price: "",
      max_price: "",
      client_id: "",
      client_name: "",
      user_id: "",
      group_id: "",
      is_check: "",
      start_time: "",
      end_time: "",
      contacts_id: "",
      contactsList: [],
    });
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
	
	toIndex(){
		wx.reLaunch({
			url: '/pages/index/index',
		})
	},
});
