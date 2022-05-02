const {
  reloadThisPage,
  wxReq,
  formatDate,
  getDay,
  getDateList,
} = require("../../utils/util");

// pages/outsourcingAcceptance/outsourcingAcceptance.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: {},
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
    dateList: [],
    type: 1,
    isCheck: false,
    chooseDate: false,
    userInfo: wx.getStorageSync("userInfo"),
    date: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isCodeIn === "true") {
      wxReq({
        url: "/weave/plan/hash",
        data: {
          hash: wx.getStorageSync("isCodeIn").hash,
        },
        method: "GET",
        success: (res) => {
          let data = res.data.data;
          this.getWeavePlanProductList(
            data.product_info ? data.product_info[0].product_id : ""
          );
          this.setData({
            detailInfo: {
              allNumber: data.total_number,
              customer: data.code,
              display: 0,
              id: data.id,
              imgSrc:
                data.product_info[0].product.image_data !== null &&
                data.product_info[0].product.image_data.length > 0
                  ? data.product_info[0].product.image_data[0].image_url
                  : "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
              nowNumber: data.total_real_number,
              processName: data.process_name,
              productLen: data.product_info.length,
              time: formatDate(data.end_time),
              title: data.client.name,
              item: data,
            },
            isCodeIn: options.isCodeIn,
          });
        },
      });
      return;
    }

    this.setData({
      detailInfo: wx.getStorageSync("outsourcing").selectCardInfo,
      isCodeIn: options.isCodeIn,
    });
  },

  getWeavePlanProductList(id) {
    if (!id) {
      wx.lin.showMessage({
        type: "error",
        duration: 4000,
        content: "该计划单没有绑定产品，即将返回首页",
        top: getApp().globalData.navH,
			});
			
      setTimeout(function () {
        wx.reLaunch({
          url: getApp().globalData.homePage,
        });
			}, 4000);
			
      return;
    }
    wxReq({
      url: "/weave/plan/product/lists",
      data: {
        product_id: id,
      },
      method: "GET",
      success: (res) => {
        let data = res.data.data;
        let arr = [];

        data.forEach((item) => {
          arr.push([
            item.product.name || "无数据",
            (item.size.size_name || "无数据") +
              "/" +
              (item.color.color_name || "无数据"),
            (item.number || "无数据") + "/" + (item.real_number || "无数据"),
            item.weave_plan.total_real_number +
              "（" +
              item.weave_plan.process_name +
              ")",
          ]);
        });

        this.data.cardInfoData.cardData = arr;

        this.setData({
          cardInfoData: this.data.cardInfoData,
        });
      },
    });
  },

  onChangeTabs(e) {
    this.setData({ isCheck: e.detail.index === 1 });
  },

  buttonCommit: function () {
    // reloadThisPage()
    if (!this.data.date) {
      wx.lin.showMessage({
        type: "error",
        duration: 4000,
        content: "请选择验收日期",
        top: getApp().globalData.navH,
      });
      return;
    }

    let array = [];
    this.data.detailInfo.item.product_info.forEach((item) => {
      array.push({
        order_id: this.data.detailInfo.item.order_id,
        doc_info_id: item.id,
        type: this.data.type,
        complete_time: this.data.date,
        client: "",
        number: item.hegeNumber,
        shoddy_number: item.cipinNumber,
        shoddy_reason: item.cipinReason,
      });
    });

    wxReq({
      url: "/create/inspection",
      data: array,
      method: "POST",
      success: (res) => {
        if (res.data.msg === "保存成功") {
          wx.lin.showMessage({
            type: "success",
            duration: 3000,
            content: "提交成功,即将刷新页面",
            top: getApp().globalData.navH,
          });
          setTimeout(() => {
            reloadThisPage();
          }, 3000);
        }
      },
    });
  },

  getNumber(e) {
    this.data.detailInfo.item.product_info[
      e.currentTarget.dataset.index
    ].hegeNumber = +e.detail;
  },

  getCiPinNumber(e) {
    this.data.detailInfo.item.product_info[
      e.currentTarget.dataset.index
    ].cipinNumber = +e.detail;
  },

  getCiPinReason(e) {
    this.data.detailInfo.item.product_info[
      e.currentTarget.dataset.index
    ].cipinReason = e.detail;
  },

  showChooseDate() {
    this.setData({
      dateList: getDateList(getDay(-6), getDay(0)).map((item) => {
        return {
          name: item,
        };
      }),
      chooseDate: true,
    });
  },

  changeTabs(e) {
    this.setData({
      isCheck: e.detail.index === 1,
    });
  },

  selectDate(e) {
    this.setData({
      date: e.detail.name,
    });
    this.closePickDate();
  },

  closePickDate() {
    this.setData({
      chooseDate: false,
    });
  },

  onChange(event) {
    this.setData({
      type: event.detail,
    });
  },
});
