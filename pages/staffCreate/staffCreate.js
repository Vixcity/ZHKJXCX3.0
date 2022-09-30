// pages/staffCreate/staffCreate.js
const {
  getProcessList,
  getDepartmentList,
  formatDate,
  dateDiff,
  wxReq,
  verifyTel,
  checkIdCardNumber,
} = require("../../utils/util");
Page({
  data: {
    staffInfo: {
      name: "",
      phone: "",
      department: "",
      type: "1",
      entry_time: "",
      resign_time: "",
      process: "",
      age: "",
      sex: "2",
      id_number: "",
      nation: "",
      education: "",
      health: "",
      bank: "",
      card_number: "",
      social_security: "2",
      desc: "",
      id: "",
    },
    process_name: "",
    processList: [],
    departmentList: [],
    educationList: [
      {
        id: "小学",
        text: "小学",
      },
      {
        id: "初中",
        text: "初中",
      },
      {
        id: "高中/职高",
        text: "高中/职高",
      },
      {
        id: "大学/大专",
        text: "大学/大专",
      },
      {
        id: "研究生",
        text: "研究生",
      },
    ],
    minDate: new Date(2019, 1, 1).getTime(),
    maxDate: new Date(2099, 12, 31).getTime(),
    currentDate: new Date().getTime(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getProcessList("/staffCreate/staffCreate");
    getDepartmentList("/staffCreate/staffCreate");

    let arr = [];
    let processList = wx.getStorageSync("processList").slice(1, 3);

    processList.forEach((process) => {
      process.children.forEach((pro) => {
        arr.push(pro.text);
      });
    });

    processList = [...new Set(arr)].map((item) => {
      return { text: item, active: false };
    });

    if (options.id) {
      this.setData(options);
      wxReq(
        {
          url: "/staff/detail?id=" + options.id,
          method: "GET",
        },
        "/staffCreate/staffCreate"
      ).then((res) => {
        if (res.data.status) {
          let data = res.data.data;
          data.entry_time = data.entry_time ? data.entry_time.slice(0, 10) : "";
          data.resign_time = data.resign_time
            ? data.resign_time.slice(0, 10)
            : "";
          let list = data.process ? data.process.split("/") : "";
          if (list.length > 0) {
            list.forEach((item) => {
              processList.forEach((process) => {
                if (item === process.text) {
                  process.active = true;
                }
              });
            });
          }

          this.setData({
            staffInfo: data,
            processList,
            departmentList: wx
              .getStorageSync("departmentList")
              .slice(1, wx.getStorageSync("departmentList").length),
          });
        }
      });

      return;
    }

    this.setData({
      processList,
      departmentList: wx
        .getStorageSync("departmentList")
        .slice(1, wx.getStorageSync("departmentList").length),
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  clickBtn(e) {
    let index = e.currentTarget.dataset.index;
    this.data.processList[index].active = !this.data.processList[index].active;
    this.setData({
      processList: this.data.processList,
    });
  },

  // 打开选择器
  openPicker(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "entry_time" || type === "resign_time") {
      this.setData({
        showDate: true,
        timeType: type,
      });
    }

    if (type === "department") {
      this.setData({
        showDepartment: true,
      });
    }

    if (type === "education") {
      this.setData({
        showEducation: true,
      });
    }
  },

  // 关闭选择器
  closeShowPicker(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "showDate") {
      this.setData({
        showDate: false,
        timeType: "entry_time",
      });
    }

    if (type === "department") {
      this.setData({
        showDepartment: false,
      });
    }

    if (type === "education") {
      this.setData({
        showEducation: false,
      });
    }
  },

  confirmData(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "department" || type === "education") {
      this.data.staffInfo[type] = e.detail.value[0].text;
    }

    if (type === "showDate") {
      this.data.staffInfo[this.data.timeType] = formatDate(e.detail);
      if (this.data.timeType === "resign_time") {
        dateDiff(formatDate(new Date()), formatDate(e.detail)) < 0
          ? (this.data.staffInfo.status = 2)
          : (this.data.staffInfo.status = 1);
      }
      console.log(this.data.staffInfo.status);
    }

    this.setData({
      staffInfo: this.data.staffInfo,
    });
    this.closeShowPicker(e);
  },

  changeInput(e) {
    const { type } = e.currentTarget.dataset;
    this.data.staffInfo[type] = e.detail.value || e.detail.key;
    this.setData({
      staffInfo: this.data.staffInfo,
    });
  },

  saveStaff() {
    if (!this.data.staffInfo.name) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写员工姓名",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (!this.data.staffInfo.department) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请选择所属部门",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (this.data.staffInfo.phone && !verifyTel(this.data.staffInfo.phone)) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "填写的手机号格式不正确，请重新填写",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (
      this.data.staffInfo.id_number &&
      !checkIdCardNumber(this.data.staffInfo.id_number)
    ) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "填写的身份证号格式不正确，请重新填写",
        top: getApp().globalData.navH,
      });
      return;
    }

    this.data.staffInfo.process = this.data.processList
      .filter((item) => {
        return item.active;
      })
      .map((item) => {
        return item.text;
      })
      .toString()
      .replaceAll(",", "/");

    wxReq(
      {
        url: "/staff/list?name=" + this.data.staffInfo.name,
      },
      "/staffCreate/staffCreate" + this.data.staffInfo.id
        ? "&id=" + this.data.staffInfo.id
        : ""
    ).then((res) => {
      if (res.data.data.length > 0 && this.data.staffInfo.id === "") {
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: this.data.staffInfo.name + "已存在，请修改员工姓名",
          top: getApp().globalData.navH,
        });
      } else {
        wxReq(
          {
            url: "/staff/save",
            data: this.data.staffInfo,
            method: "POST",
          },
          "/staffCreate/staffCreate" + this.data.staffInfo.id
            ? "&id=" + this.data.staffInfo.id
            : ""
        ).then((res) => {
          if (res.data.status) {
            wx.lin.showMessage({
              type: "success",
              duration: 3000,
              content: this.data.staffInfo.id === "" ? "添加成功" : "修改成功",
              top: getApp().globalData.navH,
            });
            setTimeout(function () {
              wx.navigateBack();
            }, 2000);
          }
        });
      }
    });
  },

  toPrev() {
    wx.navigateBack();
  },
});
