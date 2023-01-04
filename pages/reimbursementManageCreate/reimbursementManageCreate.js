// pages/reimbursementManageCreate/reimbursementManageCreate.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  getGroupList,
  getStaffList,
  jsonClone,
  wxReq,
} = require("../../utils/util");
Page({
  data: {
    amount: 0,
    showPicker: false,
    certificate: [],
    staff_departments: [
      {
        name: "",
        amount: "",
      },
    ],
    columns: [
      {
        values: [],
        className: "column1",
        defaultIndex: 0,
      },
      {
        values: [],
        className: "column2",
        defaultIndex: 0,
      },
    ],
  },

  onLoad(options) {
    const { isUpdate, id } = options;
    getGroupList(
      isUpdate
        ? "/reimbursementManageCreate/reimbursementManageCreate&isUpdate=true&id=" +
            this.data.id
        : "/reimbursementManageCreate/reimbursementManageCreate"
    );

    getStaffList(
      isUpdate
        ? "/reimbursementManageCreate/reimbursementManageCreate&isUpdate=true&id=" +
            this.data.id
        : "/reimbursementManageCreate/reimbursementManageCreate"
    );

    let groupList = jsonClone(wx.getStorageSync("groupList"));
    groupList.shift();
    wxReq(
      {
        url: "/staff/list?status=1",
        method: "GET",
      },
      isUpdate
        ? "/reimbursementManageCreate/reimbursementManageCreate&isUpdate=true&id=" +
            this.data.id
        : "/reimbursementManageCreate/reimbursementManageCreate"
    ).then((res) => {
      let staffLsit = res.data.data.map((item) => {
        item.text = item.name;
        return item;
      });

      this.data.columns[0].values = groupList;
      this.data.columns[1].values = staffLsit;
      this.setData({
        groupList,
        staffLsit,
        columns: this.data.columns,
      });
    });

    if (isUpdate) {
      this.setData({ isUpdate, id });

      wxReq(
        {
          url: "/receipt/detail",
          method: "GET",
          data: { id: options.id },
        },
        this.data.isUpdate
          ? "/reimbursementManageCreate/reimbursementManageCreate&isUpdate=true&id=" +
              this.data.id
          : "/reimbursementManageCreate/reimbursementManageCreate"
      ).then((res) => {
        let data = res.data.data;
        let {
          name,
          staff_id,
          group,
          group_id,
          certificate,
          amount,
          receipt_contents,
        } = data;

        certificate = certificate
          ? certificate.split(",").map((item) => {
              return { url: item, name: "" };
            })
          : [];

        this.setData({
          name,
          staff_id,
          group,
          group_id,
          certificate,
          amount,
          staff_departments: receipt_contents,
        });
      });
    }
  },

  // 合计费用与报销信息
  changeInput(e) {
    const { type, index } = e.currentTarget.dataset;

    this.data.staff_departments[index][type] = e.detail.value;

    this.setData({ staff_departments: this.data.staff_departments });
    if (type === "amount") {
      this.setData({
        amount: this.data.staff_departments.reduce((total, cur) => {
          return total + (+cur.amount || 0);
        }, 0),
      });
    }
  },

  // 上传产品图片
  afterRead(event) {
    const _this = this;
    const { file } = event.detail;
    const key =
      Date.parse(new Date() + "") + file.url.slice(file.url.length - 4);

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let index = event.currentTarget.dataset.index;
    wxReq(
      {
        method: "GET",
        url: "/upload/token",
      },
      this.data.isUpdate
        ? "/reimbursementManageCreate/reimbursementManageCreate&isUpdate=true&id=" +
            this.data.id
        : "/reimbursementManageCreate/reimbursementManageCreate"
    ).then((res) => {
      const token = res.data.data;
      wx.uploadFile({
        url: "https://upload.qiniup.com/",
        name: "file",
        filePath: file.url,
        formData: {
          key: key,
          token: token,
        },
        success(res) {
          // 上传完成需要更新 image_data
          let key = JSON.parse(res.data).key;
          let fileUrl = "https://file.zwyknit.com/" + key;
          _this.data.certificate.push({
            name: key,
            url: fileUrl,
          });
          _this.setData({
            certificate: _this.data.certificate,
          });
        },
      });
    });
  },

  // 删除产品图片
  deleteImage(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList[index].image_data.splice(e.detail.index, 1);
    this.setData({
      productList: this.data.productList,
    });
  },

  // 判断图片格式
  beforeRead(event) {
    const { file, callback } = event.detail;
    callback(file.type === "image");
    // console.log(file);
  },

  // 添加
  add() {
    this.data.staff_departments.push({
      name: "",
      amount: "",
    });

    this.setData({ staff_departments: this.data.staff_departments });
  },

  // 删除
  delete(e) {
    let index = e.currentTarget.dataset.index;
    this.data.staff_departments.splice(index, 1);
    this.setData({
      staff_departments: this.data.staff_departments,
    });
  },

  // 提交
  submitAllInfo(e) {
    // 没填公司
    if (!this.data.group) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "选择小组和报销人",
        top: getApp().globalData.navH,
      });
      return;
    }

    // 没填写金额
    let isContinuePrice = true;

    // 没填写金额
    this.data.staff_departments.forEach((item, index) => {
      if (!item.amount) {
        isContinuePrice = false;
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "请填写报销内容" + (index + 1) + "金额",
          top: getApp().globalData.navH,
        });
        return;
      }
    });
    if (!isContinuePrice) return;

    let certificate = this.data.certificate.map((item) => {
      return item.url;
    });

    certificate = certificate.toString();

    wxReq(
      {
        url: "/receipt/save",
        data: {
          name: this.data.name,
          staff_id: this.data.staff_id,
          group: this.data.group,
          group_id: this.data.group_id,
          certificate: certificate,
          amount: this.data.amount,
          id: this.data.id || "",
          staff_departments: this.data.staff_departments,
        },
        method: "POST",
      },
      this.data.isUpdate
        ? "/reimbursementManageCreate/reimbursementManageCreate&isUpdate=true&id=" +
            this.data.id
        : "/reimbursementManageCreate/reimbursementManageCreate"
    ).then((res) => {
      if (res.data.status) {
        // wx.lin.showMessage({
        //   type: "success",
        //   duration: 3000,
        //   content: "保存成功，三秒后跳转详情页",
        //   top: getApp().globalData.navH,
        // });
        setTimeout(function () {
          wx.redirectTo({
            url:
              "/pages/reimbursementManageDetail/reimbursementManageDetail?id=" +
              res.data.data,
          });
        }, 0);
      }
    });
  },

  // 选择报销人
  openPopup() {
    this.setData({
      showPicker: true,
    });
  },

  // 关闭弹窗
  closeShowPicker() {
    this.setData({
      showPicker: false,
    });
  },

  // 选择完数据
  onConfirm(e) {
    this.setData({
      group: e.detail.value[0].text,
      group_id: e.detail.value[0].id,
      name: e.detail.value[1].text,
      staff_id: e.detail.value[1].id,
    });
    this.closeShowPicker();
	},
	
  toPrev() {
    wx.redirectTo({
      url: "/pages/reimbursementManage/reimbursementManage",
    });
  },
});
