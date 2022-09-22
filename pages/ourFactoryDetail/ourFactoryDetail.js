const { wxReq, mergeData, dateDiff, formatDate } = require("../../utils/util");
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
// pages/ourFactoryDetail/ourFactoryDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    info: {},
    active: 1,
    inInput: [],
    outInput: [],
    minDate: new Date(2019, 1, 1).getTime(),
    maxDate: new Date(2099, 12, 31).getTime(),
    currentDate: new Date().getTime(),
    reasonList: [
      {
        id: "织造原因",
        text: "织造原因",
      },
      {
        id: "捻须原因",
        text: "捻须原因",
      },
      {
        id: "拉毛原因",
        text: "拉毛原因",
      },
      {
        id: "刺毛原因",
        text: "刺毛原因",
      },
      {
        id: "水洗原因",
        text: "水洗原因",
      },
      {
        id: "车缝原因",
        text: "车缝原因",
      },
      {
        id: "套口原因",
        text: "套口原因",
      },
      {
        id: "整烫原因",
        text: "整烫原因",
      },
      {
        id: "手工原因",
        text: "手工原因",
      },
      {
        id: "其它原因",
        text: "其它原因",
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(options);

    wxReq(
      {
        url: "/order/detail?id=" + this.data.id,
      },
      "/ourFactoryDetail/ourFactoryDetail?id=" + this.data.id
    ).then((res) => {
      let data = res.data.data;
      data.total_number = data.time_data.reduce((a, b) => {
        return a + b.total_number;
      }, 0);

      this.setData({
        info: data,
      });

      this.getProInfo();
      this.getInsList();
      this.getWeavePlan();

      // 订单相关单位，用于检验出库
      wxReq(
        {
          url: "/order/all/rel/client?order_id=" + data.time_data[0].id,
        },
        "/ourFactoryDetail/ourFactoryDetail?id=" + this.data.id
      ).then((ress) => {
        this.setData({
          bearClientArr: ress.data.data[4].map((item) => {
            return { id: item.client_id, text: item.client_name };
          }),
        });
      });
    });
  },

  // 拿到生产计划单据
  getWeavePlan() {
    let data = this.data.info;
    // 生产计划单据
    wxReq(
      {
        url: "/weave/plan/lists?order_id=" + data.time_data[0].id,
      },
      "/ourFactoryDetail/ourFactoryDetail?id=" + this.data.id
    ).then((ress) => {
      if (ress.data.data.length > 0) {
        let productionPlanMergeList = [];

        // 类型为梭织织造、针织织造的永远排在切换按钮的最前面
        productionPlanMergeList = mergeData(ress.data.data, {
          mainRule: ["process_name"],
        }).sort((a, b) => {
          if (a.process_name === "针织织造" || a.name === "梭织织造") {
            return 1;
          } else if (b.process_name === "针织织造" || b.name === "梭织织造") {
            return -1;
          } else {
            return 0;
          }
        });
        productionPlanMergeList.reverse();

        productionPlanMergeList.forEach((item) => {
          item.childrenMergeInfo.forEach((itemMerge) => {
            let a = dateDiff(formatDate(new Date()), itemMerge.end_time);
            itemMerge.timeDate = Math.abs(a);
            if (a < 0) {
              itemMerge.hasTime = false;
            } else {
              itemMerge.hasTime = true;
            }
          });
        });

        this.setData({
          productionPlanMergeList,
        });
        // 类型为梭织织造、针织织造的永远排在切换按钮的最前面的代码截至到这一句
      }

      this.setData({
        productionPlanList: ress.data.data,
      });
    });
  },

  // 拿到检验单据
  getInsList() {
    let data = this.data.info;
    // 检验单据
    wxReq(
      {
        url: "/inspection/lists?order_id=" + data.time_data[0].id,
      },
      "/ourFactoryDetail/ourFactoryDetail?id=" + this.data.id
    ).then((ress) => {
      this.setData({
        inspectionList: ress.data.data,
      });
    });
  },

  // 拿到产品信息
  getProInfo() {
    let data = this.data.info;
    let productList = [];

    data.time_data.forEach((itemTime) => {
      itemTime.batch_data.forEach((itemBatch) => {
        productList = productList.concat(itemBatch.product_data);
      });
    });

    this.setData({
      productList,
    });
  },

  // 更改顶部tab页
  changeActive(e) {
    this.setData({
      active: +e.currentTarget.dataset.type,
    });
  },

  // 展示检验入库和生产出库按钮
  showBox(e) {
    // 把其它的都先关闭一下
    this.data.productionPlanMergeList.forEach((item) => {
      item.childrenMergeInfo.forEach((itemMerge) => {
        itemMerge.boxShow = false;
      });
    });
    this.setData({
      productionPlanMergeList: this.data.productionPlanMergeList,
    });

    const { index, indexmerge } = e.currentTarget.dataset;
    this.data.productionPlanMergeList[index].childrenMergeInfo[
      indexmerge
    ].boxShow = true;
    this.setData({
      chooseBox: [index, indexmerge],
      productionPlanMergeList: this.data.productionPlanMergeList,
    });
  },

  // 关闭检验入库和生产出库按钮
  closeBox(e) {
    if (!this.data.chooseBox) return;
    const [index, indexmerge] = this.data.chooseBox;
    this.data.productionPlanMergeList[index].childrenMergeInfo[
      indexmerge
    ].boxShow = false;
    this.setData({
      chooseBox: undefined,
      productionPlanMergeList: this.data.productionPlanMergeList,
    });
  },

  // 获取到格式化的数据
  formatProData(type) {
    let proInfo = this.data.productionPlanMergeList[this.data.chooseBox[0]]
      .childrenMergeInfo[this.data.chooseBox[1]];
    proInfo.product_info_data.forEach((item) => {
      let obj = {
        type: type,
        shoddy_reason: "",
        shoddy_number: "",
        production_number: item.number,
        part_shoddy_number: "",
        order_id: proInfo.order_id,
        number: "",
        doc_info_id: item.id,
        doc_info:
          item.product_code +
          "/" +
          item.part_name +
          "/" +
          (item.color_name || "无配色") +
          "/" +
          (item.size_name || "无尺码"),
        deduct_price: "",
        complete_time: formatDate(new Date()),
        code: proInfo.code,
        client: [],
      };

      if (type === 1) {
        this.data.inInput.push(obj);
      } else if (type === 2) {
        this.data.outInput.push(obj);
      }
    });
    if (type === 1) {
      this.setData({
        inInput: this.data.inInput,
        showIn: true,
      });
    } else if (type === 2) {
      this.setData({
        outInput: this.data.outInput,
        showOut: true,
      });
    }
  },

  // 打开检验入库和生产出库
  openInOutBox(e) {
    const { type } = e.currentTarget.dataset;
    this.formatProData(type);
    this.closeBox();
  },

  // 打开成品入库框
  openCP() {
    this.setData({
      showCP: true,
    });
  },

  // 成品入库输入框输入
  CPInputNumber(e) {
    const { index, indexpro } = e.currentTarget.dataset;
    const inputNumber = e.detail.value;
    this.data.productList[index].product_info[
      indexpro
    ].inputNumber = inputNumber;

    this.setData({
      productList: this.data.productList,
    });
  },

  // 提交成品入库
  confirmCP() {
    let arr = [];
    let checkArr = [];
    this.data.productList.forEach((item) => {
      item.product_info.forEach((itemPro) => {
        if (itemPro.inputNumber) {
          let obj = {
            client: "",
            color: itemPro.color_name,
            complete_time: formatDate(new Date()),
            deduct_price: "",
            doc_info_id: itemPro.id,
            id: null,
            number: itemPro.inputNumber,
            order_id: this.data.info.time_data[0].id,
            part_name: "",
            part_shoddy_number: "",
            shoddy_number: "",
            shoddy_reason: "",
            size: itemPro.size_name,
            type: 3,
          };

          checkArr.push({
            doc_info_id: itemPro.id,
            number: itemPro.inputNumber,
            type: 3,
          });
          arr.push(obj);
        }
      });
    });

    wxReq(
      {
        url: "/doc/beyond/check",
        data: {
          doc_type: 19,
          data: checkArr,
        },
        method: "POST",
      },
      "/ourFactoryDetail/ourFactoryDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.data.length === 0) {
        this.saveCP(arr);
      } else {
        Dialog.confirm({
          title: "提示",
          message: res.data.data.map((item) => {
            return item + "\n";
          }),
          confirmButtonText: "继续提交",
          cancelButtonText: "取消提交",
          confirmButtonColor: "#27A2FD",
        })
          .then(() => {
            arr.forEach((item) => (item.is_check = 4));
            this.saveCP(arr);
          })
          .catch(() => {
            wx.lin.showMessage({
              content: "已取消",
              top: getApp().globalData.navH,
            });
          });
      }
    });
  },

  // 保存成品入库
  saveCP(arr) {
    wxReq(
      {
        url: "/inspection/save",
        data: {
          data: arr,
        },
        method: "POST",
      },
      "/ourFactoryDetail/ourFactoryDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "提交成功",
          top: getApp().globalData.navH,
        });
        this.closeInOutBox();
        this.onLoad(this.data.id);
      }
    });
  },

  // 关闭检验入库和生产出库和成品入库
  closeInOutBox() {
    let _this = this;
    this.setData({
      showIn: false,
      showOut: false,
      showCP: false,
      showCheck: false,
    });

    setTimeout(function () {
      _this.setData({
        inInput: [],
        outInput: [],
      });
    }, 300);
  },

  // 打开审核弹窗
  openCheck(e) {
    const { index } = e.currentTarget.dataset;

    this.setData({
      checkItem: this.data.inspectionList[index],
      checkIndex: index,
      checkObj: {
        check_desc: "",
        check_type: 19,
        desc: "",
        is_check: 1,
        pid: this.data.inspectionList[index].id,
      },
      showCheck: true,
    });
  },

  // 更改审核对象备注
  inputCheckObjDesc(e) {
    this.setData({
      "checkObj.desc": e.detail.value,
    });
  },

  // 更改审核对象状态
  inputCheckObjIsCheck(e) {
    this.setData({
      "checkObj.is_check": e.detail,
    });
  },

  confirmCheck() {
    wxReq(
      {
        url: "/doc/check",
        data: this.data.checkObj,
        method: "POST",
      },
      "/ourFactoryDetail/ourFactoryDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "审核成功",
          top: getApp().globalData.navH,
        });

        this.data.inspectionList[
          this.data.checkIndex
        ].is_check = this.data.checkObj.is_check;

        this.setData({
          inspectionList: this.data.inspectionList,
          checkObj: undefined,
          checkItem: undefined,
        });
        this.closeInOutBox();
      }
    });
  },

  // 选择日期
  checkDate() {
    this.setData({
      showDate: true,
    });
  },

  // 提交数据
  confirmData(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "date") {
      if (this.data.inInput) {
        this.data.inInput.forEach((item) => {
          item.complete_time = formatDate(e.detail);
        });
        this.setData({
          inInput: this.data.inInput,
        });
      }
    }

    if (type === "reason") {
      this.data.inInput[this.data.chooseReasonIndex].shoddy_reason =
        e.detail.value[0].text;
      this.setData({
        inInput: this.data.inInput,
      });
    }

    if (type === "bearclient") {
      this.data.outInput[this.data.chooseClientIndex].client =
        e.detail.value[0].text;
      this.setData({
        outInput: this.data.outInput,
      });
    }

    this.closeShowPicker();
  },

  // 关闭选择框
  closeShowPicker() {
    this.setData({
      showDate: false,
      showReason: false,
      showClient: false,
    });

    this.data.bearClientArr.forEach((item) => {
      item.check = false;
    });
    this.setData({
      bearClientArr: this.data.bearClientArr,
    });
  },

  // 选择次品原因
  chooseReason(e) {
    this.setData({
      showReason: true,
      chooseReasonIndex: e.currentTarget.dataset.index,
    });
  },

  // 打开出库公司选择框
  chooseClient(e) {
    const { index } = e.currentTarget.dataset;
    this.data.outInput[index].client.forEach((item) => {
      this.data.bearClientArr.forEach((itemClient) => {
        if (item === itemClient.text) {
          itemClient.check = true;
        }
      });
    });

    this.setData({
      showClient: true,
      chooseClientIndex: index,
      bearClientArr: this.data.bearClientArr,
    });
  },

  // 更改出库公司
  changeClient(e) {
    const { index } = e.currentTarget.dataset;
    const item = this.data.bearClientArr[index];
    let clientList = this.data.outInput[this.data.chooseClientIndex].client;

    item.check = !item.check;

    if (item.check) {
      clientList.push(item.text);
    } else {
      clientList = clientList.filter((itemClient) => {
        return itemClient !== item.text;
      });
      this.data.outInput[this.data.chooseClientIndex].client = clientList;
    }

    this.setData({
      bearClientArr: this.data.bearClientArr,
      outInput: this.data.outInput,
    });
  },

  // 检验入库输入框输入
  changeIn(e) {
    const { index, type } = e.currentTarget.dataset;
    this.data.inInput[index][type] = e.detail;
  },

  // 生产出库输入框输入
  changeOut(e) {
    const { index, type } = e.currentTarget.dataset;
    this.data.outInput[index][type] = e.detail;
  },

  // 检验入库数据提交
  confirmIn() {
    if (
      this.data.inInput.filter((item) => {
        return !item.number;
      }).length > 0
    ) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写检验数",
        top: getApp().globalData.navH,
      });
      return;
    }

    let data = this.data.inInput.map((item) => {
      return {
        doc_info_id: item.doc_info_id,
        number: item.number,
        type: item.type,
      };
    });

    // 判断是否超过10%
    wxReq(
      {
        url: "/doc/beyond/check",
        data: {
          doc_type: 19,
          data,
        },
        method: "POST",
      },
      "/ourFactoryDetail/ourFactoryDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.data.length === 0) {
        this.saveIn();
      } else {
        Dialog.confirm({
          title: "提示",
          message: res.data.data.map((item) => {
            return item + "\n";
          }),
          confirmButtonText: "继续提交",
          cancelButtonText: "取消提交",
          confirmButtonColor: "#27A2FD",
        })
          .then(() => {
            this.data.inInput.forEach((item) => (item.is_check = 4));
            this.saveIn();
          })
          .catch(() => {
            wx.lin.showMessage({
              content: "已取消",
              top: getApp().globalData.navH,
            });
          });
      }
    });
  },

  // 保存检验入库数据
  saveIn() {
    this.data.inInput.forEach((item) => {
      item.client = "";
    });

    wxReq(
      {
        url: "/inspection/save",
        data: {
          data: this.data.inInput,
        },
        method: "POST",
      },
      "/ourFactoryDetail/ourFactoryDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "提交成功",
          top: getApp().globalData.navH,
        });
        this.getInsList();
        this.getWeavePlan();
        this.closeInOutBox();
      }
    });
  },

  // 保存生产出库数据
  saveOut() {
    if (
      this.data.outInput.filter((item) => {
        return !item.number;
      }).length > 0
    ) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写生产数",
        top: getApp().globalData.navH,
      });
      return;
    }

    this.data.outInput.forEach((item) => {
      item.client = item.client.toString();
    });

    wxReq(
      {
        url: "/inspection/save",
        data: {
          data: this.data.outInput,
        },
        method: "POST",
      },
      "/ourFactoryDetail/ourFactoryDetail&id=" + this.data.id
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 2000,
          content: "提交成功",
          top: getApp().globalData.navH,
        });
        this.getInsList();
        this.getWeavePlan();
        this.closeInOutBox();
      }
    });
  },

  toPrev() {
    wx.navigateBack();
  },
});
