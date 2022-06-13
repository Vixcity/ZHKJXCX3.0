// pages/order/orderDetail/orderDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
  onLoad(options) {},

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
