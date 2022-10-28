const {
  wxReq,
  clone,
  getDepartmentList,
  getProcessList,
  isNumber,
  formatDate,
} = require("../../utils/util");

// pages/workshopByStaff/workshopByStaff.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    department_name: "",
    staff_name: "",
    staff_id: "",
    listObj: {
      process_name: "",
      process_desc: "",
      processDesc: [],
      process_type: "",
      price: "",
      order_id: "",
      order_code: "",
      order_type: "",
      produceDetailInfo: [],
      productInfo: [
        {
          product_id: "",
          product_code: "",
          size_id: "",
          size_name: "",
          color_id: "",
          color_name: "",
          colorInfo: [],
          number: "",
          extra_number: "",
          shoddy_number: "",
          shoddy_reason: "",
        },
      ],
    },
    proObj: {
      product_code: "",
      product_id: "",
      size_id: "",
      size_name: "",
      color_id: "",
      color_name: "",
      colorInfo: [],
      number: "",
      extra_number: "",
      shoddy_number: "",
      shoddy_reason: "",
    },
    list: [
      {
        process_name: "",
        process_desc: "",
        processDesc: [],
        process_type: "",
        price: "",
        order_id: "",
        order_code: "",
        order_type: "",
        produceDetailInfo: [],
        productInfo: [
          {
            product_code: "",
            product_id: "",
            size_id: "",
            size_name: "",
            color_id: "",
            color_name: "",
            colorInfo: [],
            number: "",
            extra_number: "",
            shoddy_number: "",
            shoddy_reason: "",
          },
        ],
      },
    ],
    orderList: [],
    departmentList: [],
    processList: [],
    staffList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getDepartmentList("/workshopManagementCreate/workshopManagementCreate");
    getProcessList("/workshopManagementCreate/workshopManagementCreate");
    this.getStaffList();
    this.setData({
      departmentList: wx.getStorageSync("departmentList"),
      processList: wx.getStorageSync("processList").slice(1, 3),
    });
  },

  // 获取员工
  getStaffList() {
    wxReq(
      {
        url: "/staff/list",
        data: { status: 1, department: this.data.department_name },
        method: "GET",
      },
      "/workshopManagementCreate/workshopManagementCreate"
    ).then((res) => {
      if (res.data.status) {
        this.setData({
          staffList: res.data.data.map((item) => {
            return { id: item.id, text: item.name };
          }),
        });
      }
    });
  },

  // 获取工序说明
  getProcessDesc(name) {
    wxReq(
      {
        url: "/process/lists?name=" + name,
        method: "GET",
      },
      "/workshopManagementCreate/workshopManagementCreate"
    ).then((res) => {
      if (res.data.status) {
        this.data.list[this.data.chooseIndex].processDesc = res.data.data[0]
          .process_desc
          ? res.data.data[0].process_desc.split(",").map((item) => {
              return { id: item, text: item };
            })
          : [];
      }

      // 不立即赋值的话，接下来的工序会延迟一个才能取到
      this.setData({
        list: this.data.list,
      });
    });
  },

  // 添加工序
  addList() {
    this.data.list.push(clone(this.data.listObj));
    this.setData({
      list: this.data.list,
    });
  },

  // 删除工序
  deleteIndex(e) {
    const { index } = e.currentTarget.dataset;
    this.data.list.splice(index, 1);
    this.setData({
      list: this.data.list,
    });
  },

  // 添加产品
  addPro(e) {
    const { index } = e.currentTarget.dataset;
    this.data.list[index].productInfo.push(clone(this.data.proObj));
    this.setData({
      list: this.data.list,
    });
  },

  // 删除产品
  deleteIndexPro(e) {
    const { index, indexpro } = e.currentTarget.dataset;
    this.data.list[index].productInfo.splice(indexpro, 1);
    this.setData({
      list: this.data.list,
    });
  },

  // 打开选择器
  openPicker(e) {
    const { type, index, indexchild } = e.currentTarget.dataset;

    if (isNumber(index)) {
      this.setData({
        chooseIndex: index,
        chooseProIndex: indexchild,
      });
    }

    if (type === "department") {
      this.setData({
        showDepartment: true,
      });
    }

    if (type === "process") {
      this.setData({
        showProcess: true,
      });
    }

    if (type === "order") {
      this.setData({
        showOrder: true,
      });
    }

    if (type === "product") {
      this.setData({
        showProPicker: true,
      });
    }

    if (type === "color") {
      this.setData({
        showColor: true,
      });
    }

    if (type === "process_desc") {
      if (this.data.list[this.data.chooseIndex].processDesc.length === 0) {
        wx.lin.showMessage({
          type: "error",
          duration: 2000,
          content: "该工序下暂无说明，请选择其它工序",
          top: 180,
        });
        return;
      }
      this.setData({
        showProcessDesc: true,
      });
    }

    if (type === "staff") {
      if (this.data.staffList.length === 0) {
        wx.lin.showMessage({
          type: "error",
          duration: 2000,
          content: "该部门下暂无员工，请选择其它部门",
          top: 180,
        });
        return;
      }
      this.setData({
        showStaff: true,
      });
    }
  },

  // 关闭选择器
  closeShowPicker(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "department") {
      this.setData({
        showDepartment: false,
      });
    }

    if (type === "process") {
      this.setData({
        showProcess: false,
      });
    }

    if (type === "order") {
      this.setData({
        showOrder: false,
      });
    }

    if (type === "product") {
      this.setData({
        showProPicker: false,
      });
    }

    if (type === "color") {
      this.setData({
        showColor: false,
      });
    }

    if (type === "process_desc") {
      this.setData({
        showProcessDesc: false,
      });
    }

    if (type === "staff") {
      this.setData({
        showStaff: false,
      });
    }
  },

  // 选择器提交
  confirmData(e) {
    const { type } = e.currentTarget.dataset;
    const index = this.data.chooseIndex;
    if (type === "department") {
      this.setData({
        department_name:
          e.detail.value[0].text !== "全部" ? e.detail.value[0].text : "",
      });
    }

    if (type === "staff") {
      this.setData({
        staff_name: e.detail.value[0].text,
        staff_id: e.detail.value[0].id,
      });
    }

    if (type === "process") {
      this.data.list[index].process_name = e.detail.value[1].text;
      this.data.list[index].process_type = e.detail.value[0].id;
      this.getProcessDesc(e.detail.value[1].text);
    }

    if (type === "process_desc") {
      this.data.list[index].process_desc = e.detail.value[0].text;
    }

    this.setData({
      list: this.data.list,
    });
    this.closeShowPicker(e);
    this.getStaffList();
  },

  // 订单搜索
  searchOrder(e) {
    const value = e.detail.value;
    wxReq(
      {
        url:
          "/order/simple/lists?order_code=" +
          value +
          "&order_type=&client_id=&page=1&limit=10",
        method: "GET",
      },
      "/workshopByStaff/workshopByStaff"
    ).then((res) => {
      this.setData({
        orderList: res.data.data.items,
        searchText: value,
      });
    });
  },

  // 清除搜索
  clearInputText() {
    this.setData({
      searchText: "",
      orderList: [],
    });
  },

  // 选择订单
  selectOrder(e) {
    const { item } = e.currentTarget.dataset;
    const chooseIndex = this.data.chooseIndex;
    item.product_data.forEach((itemPro) => {
      itemPro.text = itemPro.product_code;
      itemPro.colorInfo = itemPro.product_info.map((itemColor) => {
        return {
          id: itemColor.size_id + "," + itemColor.color_id,
          text: itemColor.size_name + "/" + itemColor.color_name,
        };
      });
    });

    this.data.list[chooseIndex].order_id = item.id;
    this.data.list[chooseIndex].order_code = item.code;
    this.data.list[chooseIndex].order_type = item.order_type;
    this.data.list[chooseIndex].produceDetailInfo = item.product_data;

    this.setData({
      list: this.data.list,
      showOrder: false,
      showPro: true,
    });
  },

  // 选择尺码颜色
  changeCheckColor(e) {
    const { index, indexcolor } = e.currentTarget.dataset;
    this.data.list[this.data.chooseIndex].produceDetailInfo[index].product_info[
      indexcolor
    ].check = true;
    this.setData({
      list: this.data.list,
    });
  },

  closePro() {
    this.setData({
      showPro: false,
    });
  },

  // 选择产品和尺码颜色
  confirmColor() {
    let arr = [];

    this.data.list[this.data.chooseIndex].produceDetailInfo.forEach((item) => {
      item.product_info.forEach((itemPro) => {
        if (itemPro.check) {
          arr.push({
            product_code: item.product_code,
            product_id: item.product_id,
            size_id: itemPro.size_id,
            size_name: itemPro.size_name,
            color_id: itemPro.color_id,
            color_name: itemPro.color_name,
            colorInfo: item.colorInfo,
            number: "",
            extra_number: "",
            shoddy_number: "",
            shoddy_reason: "",
          });
        }
      });
    });

    if (arr.length !== 0) {
      this.data.list[this.data.chooseIndex].productInfo = arr;
    }
    this.closePro();
    this.setData({
      list: this.data.list,
    });
  },

  // 更改产品
  changePro(e) {
    let item = e.detail.value;
    this.data.list[this.data.chooseIndex].productInfo[
      this.data.chooseProIndex
    ] = {
      size_id: "",
      size_name: "",
      color_id: "",
      color_name: "",
      product_id: item.product_id,
      product_code: item.product_code,
      colorInfo: item.colorInfo,
      number: "",
      extra_number: "",
      shoddy_number: "",
      shoddy_reason: "",
    };

    this.setData({
      list: this.data.list,
    });

    this.closeShowPicker(e);
  },

  // 更改颜色
  changeColor(e) {
    let item = e.detail.value;
    console.log(item);
    const [size_id, color_id] = item.id.split(",");
    const [size_name, color_name] = item.text.split("/");
    this.data.list[this.data.chooseIndex].productInfo[
      this.data.chooseProIndex
    ].size_id = size_id;
    this.data.list[this.data.chooseIndex].productInfo[
      this.data.chooseProIndex
    ].color_id = color_id;
    this.data.list[this.data.chooseIndex].productInfo[
      this.data.chooseProIndex
    ].size_name = size_name;
    this.data.list[this.data.chooseIndex].productInfo[
      this.data.chooseProIndex
    ].color_name = color_name;

    this.setData({
      list: this.data.list,
    });

    this.closeShowPicker(e);
  },

  // 更改产品层级的东西
  changeType(e) {
    const { type, index, indexchild } = e.currentTarget.dataset;
    this.data.list[index].productInfo[indexchild][type] = e.detail.value;
    this.setData({
      list: this.data.list,
    });
  },

  // 提交
  workSave() {
		let _this = this
    if (!this.data.staff_id) {
      wx.lin.showMessage({
        type: "error",
        duration: 2000,
        content: "未选择员工，请先选择员工",
        top: 180,
      });
      return;
    }

    let arr = [];

    this.data.list.forEach((item) => {
      if (item.process_name === "") {
        wx.lin.showMessage({
          type: "error",
          duration: 2000,
          content: "未选择工序，请先选择工序",
          top: 180,
        });
        throw new Error();
      }
      item.productInfo.forEach((itemPro) => {
        arr.push({
          id: "",
          order_id: item.order_id,
          staff_id: this.data.staff_id,
          process_name: item.process_name,
          process_desc: item.process_desc,
          process_type: item.process_type,
          price: item.price || 0,
          extra_number: itemPro.extra_number || 0,
          size_id: itemPro.size_id,
          color_id: itemPro.color_id,
          number: itemPro.number || 0,
          shoddy_number: itemPro.shoddy_number || 0,
          shoddy_reason: itemPro.shoddy_reason,
          product_id: itemPro.product_id,
          total_price: (item.price || 0) * (itemPro.number || 0),
          complete_time: formatDate(new Date()),
        });
      });
    });

    wxReq(
      {
        url: "/production/inspection/save",
        method: "POST",
        data: {
          data: arr,
        },
      },
      "/workshopByStaff/workshopByStaff"
    ).then((res) => {
      if(res.data.status){
				wx.setStorageSync('isDo', true)
				wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "添加成功",
          top: 180,
				});
				setTimeout(function(){
					_this.toPrev()
				},1500)
			}
    });
	},
	
	toPrev(){
		wx.navigateBack()
	},
});
