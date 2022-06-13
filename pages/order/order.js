// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    singleSelect: {
      value: "option_3",
      options: [
        { label: "选项 1", value: "option_1" },
        { label: "选项 2", value: "option_2" },
        { label: "选项 3", value: "option_3" },
        { label: "选项 4", value: "option_4" },
        { label: "选项 5", value: "option_5" },
        { label: "选项 6", value: "option_6" },
        { label: "选项 7", value: "option_7" },
        { label: "选项 8", value: "option_8" },
      ],
      options2: [
        { label: "选项 12", value: "option_1" },
        { label: "选项 22", value: "option_2" },
        { label: "选项 32", value: "option_3" },
        { label: "选项 42", value: "option_4" },
        { label: "选项 52", value: "option_5" },
        { label: "选项 62", value: "option_6" },
        { label: "选项 72", value: "option_7" },
        { label: "选项 82", value: "option_8" },
      ],
      options3: [
        { label: "选项 13", value: "option_1" },
        { label: "选项 23", value: "option_2" },
        { label: "选项 33", value: "option_3" },
        { label: "选项 43", value: "option_4" },
        { label: "选项 53", value: "option_5" },
        { label: "选项 63", value: "option_6" },
        { label: "选项 73", value: "option_7" },
        { label: "选项 83", value: "option_8" },
      ],
    },

    orderList: [
      {
        id: 1,
        customer: "item.client.name",
        title: "item.client.name",
        time: "2022-01-02",
        nowNumber: 20,
        allNumber: 50,
        customer: "asdasd",
        productLen: 5,
        imgSrc:
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        display: 0,
        status: 7,
        processName: "织造",
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

	toDetail(e){
		let item = e.currentTarget.dataset.item

		wx.navigateTo({
			url: '/pages/order/orderDetail/orderDetail?id='+item.id,
		})
	}
});
