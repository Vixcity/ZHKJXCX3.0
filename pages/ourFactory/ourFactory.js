import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  urlParams,
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
    orderList: [],
    cardInfoData: {
      cardTitle: [
        {
          title: "产品",
          width: 20,
        },
        {
          title: "尺码颜色",
          width: 23,
        },
        {
          title: "下单/下机数量",
          width: 30,
        },
        {
          title: "生产进度",
          width: 27,
        },
      ],
      cardData: [],
    },
    clientList: [],
    processList: [],
    groupList: [],
    userList: [],
    searchType: 1,
    showSearch: false,
    showLoading: false,
    isEnd: false,
    noData: false,
    page: 1,
    limit: 10,
    process_name: "",
    client_id: "",
    group_id: "",
    user_id: "",
    keyWord: "",
    group_name: "",
    user_name: "",
    showUser: false,
    showGroup: false,
    showProcess: false,
    showClient: false,
    // type: "2",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const isLogin = isIfLogin();
    // let isLogin = true
    let { type } = options;

    this.setData({
      isLogin,
      type,
    });

    getClientList("/ourFactory/ourFactory&type=" + (type || 2));
    getProcessList("/ourFactory/ourFactory&type=" + (type || 2));
    getGroupList("/ourFactory/ourFactory&type=" + (type || 2));
    getUserList("/ourFactory/ourFactory&type=" + (type || 2));

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
      clientList: arr.concat(wx.getStorageSync("clientList").slice(6, 8)),
      processList: arr1.concat(wx.getStorageSync("processList")),
      groupList: wx.getStorageSync("groupList"),
      userList: wx.getStorageSync("userList"),
    });
    this.reqOrder();
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
      orderList: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
    this.closeShowPicker(e);
  },

  onSearch(e) {
    this.data.keyWord = e.detail.value;
    this.data.page = 1;
    this.setData({
      orderList: [],
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
      orderList: [],
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

    let orderList = this.data.orderList;

    let params = {};
    if (this.data.searchType === 1) {
      params = {
        page: this.data.page,
        limit: this.data.limit,
        process_name: this.data.process_name,
        client_id: this.data.client_id,
        group_id: this.data.group_id,
        user_id: this.data.user_id,
        order_code: this.data.keyWord,
      };
    } else if (this.data.searchType === 2) {
      params = {
        page: this.data.page,
        limit: this.data.limit,
        process_name: this.data.process_name,
        client_id: this.data.client_id,
        group_id: this.data.group_id,
        user_id: this.data.user_id,
        code: this.data.keyWord,
      };
    }

    wxReq(
      {
        url: "/weave/plan/lists",
        method: "GET",
        data: params,
      },
      "/ourFactory/ourFactory&type=" + (this.data.type || 2)
    ).then((res) => {
      if (res.data.code === 200) {
        if (this.data.page === 1) {
          orderList = [];
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

        let arr = [];
        res.data.data.items.forEach((item, index) => {
          arr.push({
            id: item.id,
            customer: item.client_name,
            title: item.client_name,
            time: formatDate(item.end_time),
            nowNumber: item.total_real_number,
            allNumber: item.total_number,
            customer: item.code,
            productLen: item.product_info.length,
            imgSrc:
              item.product_info[0].image_data !== null &&
              item.product_info[0].image_data.length > 0
                ? item.product_info[0].image_data[0]
                : "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",

            display: 0,
            processName: item.process_name,
            item: item,
          });
        });
        orderList = orderList.concat(arr);

        this.setData({
          showLoading: false,
					orderList,
					total:res.data.data.total
        });
      }

      if (res.data.status === -1) {
        wx.setStorageSync("isLogin", false);
        toSignUp();
      }
    });
  }, 1000),

  GetSandCode() {
    wx.scanCode({
      scanType: "qrCode",
      success: (res) => {
        if (
          res.result.slice(0, 40) === "https://knit-m-api.zwyknit.com/bindOrder"
        ) {
          let { company_id, hash, id } = urlParams(res.result);

          this.toOutsourcingAcceptance1(company_id, hash, id);
        } else {
        }
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },

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

  toSignUp() {
    wx.navigateTo({
      url: "/pages/signUp/signUp?path=ourFactory&params1=type%3D2",
    });
  },

  toOutsourcingAcceptance(e) {
    wx.setStorageSync("outsourcing", {
      selectCardInfo: this.data.orderList[e.currentTarget.dataset.index],
    });
    wx.navigateTo({
      url: "/pages/outsourcingAcceptance/outsourcingAcceptance",
    });
  },

  toOutsourcingAcceptance1(company_id, hash, id) {
    wx.setStorageSync("isCodeIn", { company_id, hash, id });
    wx.navigateTo({
      url: "/pages/outsourcingAcceptance/outsourcingAcceptance?isCodeIn=true",
    });
	},
	
	toIndex(){
		wx.reLaunch({
			url: '/pages/index/index',
		})
	},
});
