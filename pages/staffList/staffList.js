const { wxReq } = require("../../utils/util");

// pages/staffList/staffList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardInfoData: {
      cardTitle: [
        {
          title: "员工编号",
          width: 30,
        },
        {
          title: "姓名",
          width: 25,
        },
        {
          title: "部门",
          width: 25,
        },
        {
          title: "工种",
          width: 20,
        },
      ],
      cardData: [],
    },
  },

  onLoad() {
    this.getList();
  },

  getList() {
    wxReq(
      {
        url: "/staff/list",
        method: "GET",
        data: {
          status: 1,
        },
      },
      "/staffList/staffList"
    ).then((res) => {
      let arr = res.data.data.map(item => {
				return [item.code,item.name,item.department,item.type==1?'临时工':'合同工']
			})


			this.data.cardInfoData.cardData = arr
			this.setData({
				cardInfoData:this.data.cardInfoData
			})
    });
  },
});
