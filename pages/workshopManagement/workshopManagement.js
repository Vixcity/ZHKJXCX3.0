import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  getProcessList,
  debounce,
  wxReq,
  getDepartmentList,
  getYearList,
} = require("../../utils/util");

// pages/workshopManagement/workshopManagement.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    filterObj: {
      keyword: "",
      department: "",
      type: 1,
      page: 1,
      limit: 10,
      month: "",
      year: "",
    },
    current: 1,
		list: [],
		textInputDesc: "",
    reasonList: [
      { value: "物料成本偏低", isChecked: true, disabled: false },
      { value: "织造成本偏低", isChecked: false, disabled: false },
      { value: "加工成本偏低", isChecked: false, disabled: false },
      { value: "包装成本偏低", isChecked: false, disabled: false },
      { value: "人工成本偏低", isChecked: false, disabled: false },
      { value: "运费成本偏低", isChecked: false, disabled: false },
      { value: "基本利润偏低", isChecked: false, disabled: false },
      { value: "整体报价偏低", isChecked: false, disabled: false },
    ],
    result: [""],
    monthList: [
      { id: "", text: "全部" },
      {
        id: 1,
        text: "1月",
      },
      {
        id: 2,
        text: "2月",
      },
      {
        id: 3,
        text: "3月",
      },
      {
        id: 4,
        text: "4月",
      },
      {
        id: 5,
        text: "5月",
      },
      {
        id: 6,
        text: "6月",
      },
      {
        id: 7,
        text: "7月",
      },
      {
        id: 8,
        text: "8月",
      },
      {
        id: 9,
        text: "9月",
      },
      {
        id: 10,
        text: "10月",
      },
      {
        id: 11,
        text: "11月",
      },
      {
        id: 12,
        text: "12月",
      },
    ],
    isEnd: false,
    noData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const titles = ["部门选择", "年份选择", "月份选择"];
		const vtabs = titles.map((item) => ({ title: item }));
		this.setData({
			vtabs,
		})

		this.init()
	},
	
	onShow(){
		if(!wx.getStorageSync('isDo')) return
		wx.setStorageSync('isDo',false)

		this.init()
	},

	init(){
		this.setData({
      list: [],
      isEnd: false,
      noData: false,
    });

    this.getScreenList();
    this.reset();
    this.reqOrder();
	},

  // 重置筛选条件
  reset() {
    this.setData({
      filterObj: {
        keyword: "",
        department: "",
        type: this.data.filterObj.type,
        page: 1,
        limit: 10,
        month: "",
        year: "",
      },
    });
  },

  // 拿到筛选条件
  getScreenList() {
    let arr = [
      {
        text: "全部",
        id: "",
        children: [
          {
            text: "全部",
            id: "",
          },
        ],
      },
    ];
    let arr2 = [{ id: "", text: "全部" }];
    getDepartmentList("/workshopManagement/workshopManagement");
    getProcessList("/workshopManagement/workshopManagement");

    this.setData({
      processList: arr.concat(wx.getStorageSync("processList")),
      departmentList: wx.getStorageSync("departmentList"),
      yearList: arr2.concat(getYearList(2018, new Date().getFullYear())),
    });
  },

  // 节流
  reqOrder: debounce(function () {
    this.getList();
  }, 1000),

  getList() {
    if (this.data.isEnd) {
      return;
    }

    this.setData({
      showLoading: true,
    });

    wxReq(
      {
        url: "/production/inspection/lists",
        method: "GET",
        data: this.data.filterObj,
      },
      "/workshopManagement/workshopManagement"
    ).then((res) => {
      let data = res.data.data.items;

      if (data.length < 10) {
        this.setData({
          isEnd: true,
        });
      }

      if (this.data.filterObj.page === 1 && data.length === 0) {
        this.setData({
          noData: true,
          showLoading: false,
        });
      }

      res.data.data.items.forEach((item) => {
        item.code = item.staff_code.slice(4);
      });

      let list = this.data.list.concat(res.data.data.items);
      let additional = res.data.data.additional;
      additional.total_number = (additional.total_number / 10000).toFixed(2);

      additional.total_price = (additional.total_price / 10000).toFixed(2);

      additional.total_extra_number = (
        additional.total_extra_number / 10000
      ).toFixed(2);

      this.data.filterObj.page += 1;
      this.setData({
        showLoading: false,
        list,
        additional,
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

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "process") {
      this.setData({
        showProcess: true,
      });
    }
  },

  // 关闭选择器
  closeShowPicker(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "process") {
      this.setData({
        showProcess: false,
      });
    }
  },

  // 选择器提交
  confirmData(e) {
    let type;
    if (e?.currentTarget) {
      type = e.currentTarget.dataset.type;
    }

    if (type === "keyword") {
      this.data.filterObj.keyword = e.detail.value;
    }

    if (type === "process") {
      this.data.filterObj.process_name = e.detail.value[1].id;
    }

    this.data.filterObj.page = 1;
    this.setData({
      list: [],
      isEnd: false,
      noData: false,
      filterObj: this.data.filterObj,
    });
    this.reqOrder();
    this.closePopup();
    this.closeShowPicker(e);
  },

  // 更改选择
  bindPickerChangeAge(e) {
    const { type } = e.currentTarget.dataset;
    let index = e.detail.value;

    if (type === "department") {
      this.setData({
        "filterObj.department":
          this.data.departmentList[index].text === "全部"
            ? ""
            : this.data.departmentList[index].text,
      });
    }

    if (type === "year") {
      this.setData({
        "filterObj.year": this.data.yearList[index].id,
      });
    }

    if (type === "month") {
      this.setData({
        "filterObj.month": this.data.monthList[index].id,
      });
    }
  },

  // 更改计件和及时结算
  changeType(e) {
    const { totype } = e.currentTarget.dataset;
    this.data.filterObj.page = 1;
    this.setData({
      "filterObj.type": totype,
      list: [],
      isEnd: false,
      noData: false,
    });
    this.reqOrder();
  },

  // 改变审核单选按钮
  changeRadio(e) {
    this.setData({
      current: e.detail.key,
    });
  },

  // 更改驳回理由
  checkBoxChange(e) {
    this.setData({ result: e.detail });
  },

  // 删除记录
  deleteItem(e) {
    const { item } = e.currentTarget.dataset;
    Dialog.confirm({
      title: "要删除工资记录吗？",
      message:
        "删除 " +
        item.id +
        "," +
        item.code +
        "-" +
        item.staff_name +
        " 的工资记录？",
      confirmButtonColor: "#27A2FD",
      zIndex: 11601,
    }).then(() => {
      wxReq(
        {
          url: "/production/inspection/delete",
          data: { id: [item.id] },
          method: "POST",
        },
        "/workshopManagement/workshopManagement"
      ).then((res) => {
        if (res.data.status) {
          wx.lin.showMessage({
            type: "success",
            duration: 2000,
            content: "删除成功",
            top: 180,
          });
          this.data.filterObj.page = 1;
          this.setData({
            list: [],
            isEnd: false,
            noData: false,
            filterObj: this.data.filterObj,
          });
          this.reqOrder();
        }
      });
    });
	},
	
	toEdit(e){
		const {id} = e.currentTarget.dataset
		let url = ""
		if(this.data.filterObj.type === 2){
			url = '../workshopEditByPrice/workshopEditByPrice?id=' + id
		} 
		
		if(this.data.filterObj.type === 1){
			url = '../workshopEditByThing/workshopEditByThing?id=' + id
		}
		
		if(!url) return
		wx.navigateTo({
			url,
		})
	},

  // 打开审核弹窗
  openCheck(e) {
    this.data.checkIndex = e.currentTarget.dataset.index;
    this.setData({
      showCheck: true,
    });
  },

  // 关闭审核弹窗
  closeCheck() {
    this.setData({
      showCheck: false,
      checkIndex: "",
      textInputDesc: "",
      current: 1,
      result: [""],
    });
	},

	// 审核备注 
	inputDesc(e) {
    this.setData({
      textInputDesc: e.detail.value,
    });
  },

	// 审核
  confirmCheck(e) {
    wxReq(
      {
        url: "/doc/check",
        method: "POST",
        data: {
          check_type: 14,
          pid: this.data.list[this.data.checkIndex].id,
          check_desc:
            this.data.current === 1
              ? ""
              : this.data.result.toString().replaceAll(",", ";"),
          is_check: this.data.current,
          desc: this.data.textInputDesc,
        },
      },
      "/workshopManagement/workshopManagement"
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });

        this.data.list[this.data.checkIndex].is_check = this.data.current;
        this.closeCheck();

        this.setData({
          list: this.data.list,
        });
      }
    });
  },

  toCreate() {
    wx.navigateTo({
      url: "../workshopManagementCreate/workshopManagementCreate",
    });
	},
	
	toByThingCreate(e){
		const {type} = e.currentTarget.dataset

		if(type == 1){
			wx.navigateTo({
				url: "../workshopByStaff/workshopByStaff",
			});
		} else if(type == 2){
			// wx.navigateTo({
			// 	url: "../workshopByOrder/orderList",
			// });
		}
	},

  toPrev() {
    wx.navigateBack();
  },
});
