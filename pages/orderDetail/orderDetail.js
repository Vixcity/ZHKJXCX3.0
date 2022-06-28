// pages/order/orderDetail/orderDetail.js
const { wxReq } = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    orderDetail: {},
    productList: [],
    cardInfoData: {
      cardTitle: [
        { width: 33, title: "产品品类" },
        { width: 33, title: "尺码颜色" },
        { width: 33, title: "计划/实际发货" },
      ],
      cardData: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
    result: [],
    list: ["1", "2"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;

    this.load(id);
  },

  load(id) {
    let _this = this;
    wxReq(
      {
        url: "/order/detail",
        data: {
          id: id,
        },
        method: "GET",
      },
      "orderDetail&params1=id%3D" + id
    ).then((res) => {
      res.data.data.time_data.forEach((itemTime) => {
				itemTime.batch_data.forEach((itemBatch, indexBatch) => {
          _this.data.productList = _this.data.productList.concat(
            itemBatch.product_data.map((item) => {
              item.batchIndex = indexBatch + 1;
              return item;
            })
          );
        });
			});
			
			// console.log(_this.data.productList)

      _this.setData({
        orderDetail: res.data.data,
        productList: _this.data.productList,
      });
    });
  },

  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
});
