const {
  wxReq,
  clone,
  getDepartmentList,
  getProcessList,
  isNumber,
} = require("../../utils/util");

// pages/workshopManagementCreate/workshopManagementCreate.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseIndex: "",
    department_name: "",
    staff_name: "",
    list: [
      {
        process_name: "",
        process_type: "",
        process_desc: "",
        processDesc: [],
        price: "",
        total_price: "",
        desc: "",
        time_type: "1",
        time_count: "",
      },
    ],
    listObj: {
      process_name: "",
      process_type: "",
      process_desc: "",
      processDesc: [],
      price: "",
      total_price: "",
      desc: "",
      time_type: "1",
      time_count: "",
    },
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

  // 更改内容
  changeType(e) {
    const { index, type } = e.currentTarget.dataset;

    if (type === "time_type") {
      this.data.list[index][type] = e.detail.currentKey;
    } else if (type === "price" || type === "time_count" || type === "desc") {
      this.data.list[index][type] = e.detail.value;
      this.data.list[index].total_price = (
        (this.data.list[index].price || 0) *
        (this.data.list[index].time_count || 0)
      ).toFixed(2);
    }

    this.setData({
      list: this.data.list,
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

  // 打开选择器
  openPicker(e) {
    const { type, index } = e.currentTarget.dataset;

    if (isNumber(index)) {
      this.setData({
        chooseIndex: index,
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

  // 提交数据
  workSave() {
    let params = {
      type: 2,
      data: [],
    };

    if (!this.data.staff_id) {
      wx.lin.showMessage({
        type: "error",
        duration: 2000,
        content: "未选择员工，请先选择员工",
        top: 180,
      });
      return;
    }

    let emptyIndex = this.data.list.findIndex((item) => {
      return item.process_name === "";
    });

    if (emptyIndex >= 0) {
      wx.lin.showMessage({
        type: "error",
        duration: 2000,
        content: "第" + (emptyIndex + 1) + "个工序未选择，请先选择工序",
        top: 180,
      });
      return;
    }

    this.data.list.forEach((item) => {
      params.data.push({
        id: this.data.id,
        staff_id: this.data.staff_id,
        process_name: item.process_name,
        process_type: item.process_type,
        process_desc: item.process_desc,
        price: item.price || 0,
        total_price: item.total_price || 0,
        desc: item.desc,
        time_type: item.time_type,
        time_count: item.time_count || 0,
      });
    });

    wxReq(
      {
        url: "/production/inspection/save",
        method: "POST",
        data: params,
      },
      "/workshopManagementCreate/workshopManagementCreate"
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "添加成功",
          top: 180,
        });
        this.data.list = [clone(this.data.listObj)];
        this.setData({
          list: this.data.list,
          staff_id: "",
          staff_name: "",
          department_name: "",
        });
      }
    });
	},
	
	toPrev(){
		wx.navigateBack()
	},
});
