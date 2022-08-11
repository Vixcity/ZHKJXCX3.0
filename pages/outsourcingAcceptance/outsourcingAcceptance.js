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
    showChooseCiPinReason: false,
    reasonArr: [
      "织造原因",
      "捻须原因",
      "拉毛原因",
      "刺毛原因",
      "水洗原因",
      "车缝原因",
      "套口原因",
      "整烫原因",
      "手工原因",
      "其它原因",
    ],
    cipinReasonText: "",
    cipinReasonArr: [],
    userInfo: wx.getStorageSync("userInfo"),
    date: getDay(0),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.isCodeIn = "true"

    this.setData({
      detailInfo: wx.getStorageSync("outsourcing").selectCardInfo,
      isCodeIn: !!options.isCodeIn,
    });

    if (options.isCodeIn === "true") {
      wxReq(
        {
          url: "/weave/plan/hash",
          data: {
            hash: wx.getStorageSync("isCodeIn").hash,
          },
          method: "GET",
        },
        "/outsourcingAcceptance/outsourcingAcceptance&?isCodeIn=true"
      ).then((res) => {
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
          isCodeIn: !!options.isCodeIn,
        });
      });
      return;
    } else {
      wxReq(
        {
          url: "/weave/plan/detail",
          data: {
            id: this.data.detailInfo.id,
          },
          method: "GET",
        },
        "/outsourcingAcceptance/outsourcingAcceptance"
      ).then((res) => {
        this.data.detailInfo.item = res.data.data;
        this.setData({
          detailInfo: this.data.detailInfo,
        });
      });
    }
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

    wxReq(
      {
        url: "/weave/plan/product/detail",
        data: {
          product_id: id,
        },
        method: "GET",
      },
      this.data.isCodeIn
        ? "/outsourcingAcceptance/outsourcingAcceptance&isCodeIn=true"
        : "/outsourcingAcceptance/outsourcingAcceptance"
    ).then((res) => {
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
    this.data.detailInfo.item.product_info_data.forEach((item) => {
      console.log(item);
      array.push({
        type: this.data.type,
        order_id: this.data.detailInfo.item.order_id,
        complete_time: this.data.date,
        code: item.code,
        doc_info_id: item.id,
        doc_info:
          item.product_code +
          "/" +
          item.part_name +
          "/" +
          (item.color_name || "无配色") +
          "/" +
          (item.size_name || "无尺码"),
        number: item.hegeNumber,
        production_number: null,
        deduct_price: null,
        part_shoddy_number: null,
        client: "",
        shoddy_number: item.cipinNumber,
        shoddy_reason:
          item.cipinReason.toString() + (item.cipinReasonText || ""),
      });
    });

    wxReq(
      {
        url: "/inspection/save",
        data: {
          data: array,
        },
        method: "POST",
      },
      this.data.isCodeIn
        ? "/outsourcingAcceptance/outsourcingAcceptance&?isCodeIn=true"
        : "/outsourcingAcceptance/outsourcingAcceptance"
    ).then((res) => {
      if (res.data.status) {
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
    });
  },

  getNumber(e) {
    this.data.detailInfo.item.product_info_data[
      e.currentTarget.dataset.index
    ].hegeNumber = +e.detail;
  },

  getCiPinNumber(e) {
    this.data.detailInfo.item.product_info_data[
      e.currentTarget.dataset.index
    ].cipinNumber = +e.detail;
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

  chooseCiPinReason(e) {
    let index = e.currentTarget.dataset.index;
    this.data.detailInfo.item.product_info_data[
      index
    ].showChooseCiPinReason = true;
    this.setData({
      detailInfo: this.data.detailInfo,
      showChooseCiPinReason: true,
    });
  },

  closePopup(e) {
    let index = e.currentTarget.dataset.index;
    this.data.detailInfo.item.product_info_data[
      index
    ].showChooseCiPinReason = false;
    this.setData({
      detailInfo: this.data.detailInfo,
      showChooseCiPinReason: false,
    });
  },

  changeCiPinReason(e) {
    let index = e.currentTarget.dataset.index;
    this.data.detailInfo.item.product_info_data[index].cipinReason = e.detail;
    this.setData({
      detailInfo: this.data.detailInfo,
    });
  },

  inputReason(e) {
    let index = e.currentTarget.dataset.index;
    this.data.detailInfo.item.product_info_data[index].cipinReasonText =
      e.detail.value;
    this.setData({
      detailInfo: this.data.detailInfo,
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
	
	toPrev(){
		wx.redirectTo({
			url: '/pages/ourFactory/ourFactory?type=2',
		})
	},
});
