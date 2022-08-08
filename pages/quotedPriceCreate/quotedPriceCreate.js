// pages/quotedPrice/quotedPriceCreate.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  getClientList,
  getYarnType,
  getGroupList,
  getAssistList,
  getProductTypeList,
  getProcessList,
  getPackingList,
  jsonClone,
  contentHtml,
  wxReq,
} = require("../../utils/util");
Page({
  data: {
    // 基本信息
    title: "",
    // 公司信息
    showClient: false,
    client_id: "",
    client_name: "",
    group_id: "",
    group_name: "",
    tree_data: [],
    clientList: [],
    // 联系人信息
    showConcat: false,
    contacts_name: "",
    contacts_id: "",
    concatList: [],
    // 小组信息
    showGroup: false,
    groupList: [],
    // 币种汇率
    exchange_rate: 100,
    settle_unit: "元",
    // 产品
    productTypeList: [],
    productList: [],
    productObj: {
      type: ["", ""],
      client_target_price: "",
      start_order_number: "",
      desc: "",
      transport_fee: "",
      transport_fee_desc: "",
      image_data: [],
      material_data: [
        {
          id: "",
          loss: "",
          material_id: "",
          material_name: "",
          price: "",
          total_price: "",
          tree_data: "",
          unit: "g",
          weight: "",
        },
      ],
      assist_material_data: [
        {
          id: "",
          loss: "",
          material_id: "",
          material_name: "",
          number: "",
          price: "",
          total_price: "",
          unit: "",
        },
      ],
      weave_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "",
          quote_rel_product_id: "",
          total_price: "",
          updated_at: "",
        },
      ],
      semi_product_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "",
          quote_rel_product_id: "",
          total_price: "",
          updated_at: "",
        },
      ],
      production_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "",
          quote_rel_product_id: "",
          total_price: "",
          updated_at: "",
        },
      ],
      pack_material_data: [
        {
          desc: "",
          id: "",
          material_id: "",
          material_name: "",
          total_price: "",
        },
      ],
      other_fee_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "打样费",
          quote_rel_product_id: "",
          total_price: "",
          updated_at: "",
        },
      ],
      no_production_fee_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "管理费",
          quote_rel_product_id: "",
          total_price: "",
          updated_at: "",
        },
      ],
    },
    // 原料
    yarnType: [],
    materialObj: {
      id: "",
      loss: "",
      material_id: "",
      material_name: "",
      price: "",
      total_price: "",
      tree_data: "",
      unit: "g",
      weight: "",
    },
    // 辅料
    assistList: [],
    assistObj: {
      id: "",
      loss: "",
      material_id: "",
      material_name: "",
      number: "",
      price: "",
      total_price: "",
      unit: "",
    },
    // 织造
    weaveList: [
      { text: "针织织造", id: "针织织造" },
      { text: "梭织织造", id: "梭织织造" },
      { text: "制版费", id: "制版费" },
    ],
    weaveObj: {
      created_at: "",
      desc: "",
      id: "",
      name: "",
      quote_rel_product_id: "",
      total_price: "",
      updated_at: "",
    },
    // 半成品
    halfProcessList: [],
    halfObj: {
      created_at: "",
      desc: "",
      id: "",
      name: "",
      quote_rel_product_id: "",
      total_price: "",
      updated_at: "",
    },
    // 成品
    processList: [],
    productionDataObj: {
      created_at: "",
      desc: "",
      id: "",
      name: "",
      quote_rel_product_id: "",
      total_price: "",
      updated_at: "",
    },
    // 包装
    packingList: [],
    packObj: {
      desc: "",
      id: "",
      material_id: "",
      material_name: "",
      total_price: "",
    },
    // 其它费用
    otherFeeObj: {
      created_at: "",
      desc: "",
      id: "",
      name: "",
      quote_rel_product_id: "",
      total_price: "",
      updated_at: "",
    },
    // 非生产型费用
    noProFeeObj: {
      created_at: "",
      desc: "",
      id: "",
      name: "",
      quote_rel_product_id: "",
      total_price: "",
      updated_at: "",
    },
    // 订单费用
    total_cost_price: 0,
    commission_percentage: "",
    commission_price: 0,
    rate_taxation: "",
    rate_price: 0,
    profit_price: "",
    profit_price: 0,
    desc: "",
    real_quote_price: "",

    // 弹窗
    materialItemShow: false,
  },

  onLoad(options) {
    const { isUpdate, id } = options;
    getClientList(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );
    getGroupList(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );
    getProductTypeList(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );
    getYarnType(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );
    getAssistList(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );
    getProcessList(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );
    getPackingList(
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    );

    let clientList = wx.getStorageSync("clientList").slice(0, 2);
    let groupList = jsonClone(wx.getStorageSync("groupList"));
    let productTypeList = wx.getStorageSync("productTypeList");
    let yarnType = wx.getStorageSync("yarnType").slice(0, 2);
    let assistList = wx.getStorageSync("assistList");
    let packingList = wx.getStorageSync("packingList");
    let halfProcessList = wx.getStorageSync("processList").slice(1, 2)[0]
      .children;
    let processList = wx.getStorageSync("processList").slice(2, 3)[0].children;
    let productList = this.data.productList;
    productList.push(jsonClone(this.data.productObj));
    groupList.shift();

    // 导入报价模板
    wxReq(
      {
        url: "/quote/demo/lists",
        method: "GET",
      },
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    ).then((res) => {
      this.data.searchQuotedPriceList = res.data.data;
      let arr = res.data.data.map((item) => {
        return {
          text: item.title,
          id: item.id,
        };
      });
      this.setData({
        searchPickerList: arr,
      });
		});
		
		this.setData({
			group_name: wx.getStorageSync('userInfo').group_name,
			group_id: wx.getStorageSync('userInfo').group_id,
		})

    if (isUpdate) {
      this.setData({ isUpdate, id });

      wxReq(
        {
          url: "/quote/detail",
          method: "GET",
          data: { id: options.id },
        },
        this.data.isUpdate
          ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
              this.data.id
          : "/quotedPriceCreate/quotedPriceCreate"
      ).then((res) => {
        // console.log(res.data.data);
        let data = res.data.data;
        const {
          title,
          id,
          exchange_rate,
          group_name,
          group_id,
          client_name,
          client_id,
          contacts_name,
          contacts_id,
          commission_percentage,
          commission_price,
          desc,
          profit_percentage,
          profit_price,
          rate_price,
          rate_taxation,
          real_quote_price,
          settle_unit,
          system_total_price,
          total_cost_price,
          total_number,
          tree_data,
          product_data,
        } = data;

        // console.log(data);
        product_data.forEach((item) => {
          item.type = [item.category_id, item.secondary_category_id];
          item.image_data.forEach((img, index) => {
            item.image_data[index] = { name: "load" + index, url: img };
          });

          item.desc = item.desc ? contentHtml(item.desc) : "";
        });

        this.setData({
          id,
          title,
          client_id,
          client_name,
          commission_price,
          commission_percentage,
          contacts_id,
          contacts_name,
          desc,
          exchange_rate,
          group_id,
          group_name,
          profit_price,
          profit_percentage,
          productList: product_data,
          rate_price,
          rate_taxation,
          real_quote_price,
          settle_unit,
          system_total_price,
          total_cost_price,
          tree_data,
          total_number,
        });
      });
    }

    this.setData({
      clientList,
      groupList,
      productTypeList,
      productList,
      yarnType,
      assistList,
      halfProcessList,
      processList,
      packingList,
    });
  },

  // 报价单标题，汇率币种，币种单位
  changeInput(e) {
    const { type } = e.currentTarget.dataset;

    if (type === "settle_unit") {
      e.detail.value = e.detail.currentKey;
    }

    let obj = {};
    obj[type] = e.detail.value;

    this.setData(obj);
  },

  // 打开选择器
  openPicker(e) {
    const { type, index, itemindex, itemtype } = e.currentTarget.dataset;

    this.setData({
      index,
      itemindex,
    });

    if (type === "client") {
      this.setData({
        showClient: true,
      });
    }

    if (type === "concat") {
      this.setData({
        showConcat: true,
      });
    }

    if (type === "group") {
      this.setData({
        showGroup: true,
      });
    }

    if (type === "product") {
      this.data.productList[index].show = true;
      this.setData({
        productList: this.data.productList,
      });
    }

    if (type === "searchModele") {
      this.setData({
        showModuleList: true,
      });
    }

    if (type === "productSon") {
      let obj = {};
      obj[itemtype] = true;
      this.setData(obj);
    }
  },

  // 关闭选择器
  closeShowPicker(e) {
    const { type, index, itemindex, itemtype } = e.currentTarget.dataset;

    if (type === "client") {
      this.setData({
        showClient: false,
      });
    }

    if (type === "concat") {
      this.setData({
        showConcat: false,
      });
    }

    if (type === "group") {
      this.setData({
        showGroup: false,
      });
    }

    if (type === "product") {
      this.data.productList[index].show = false;
      this.setData({
        productList: this.data.productList,
      });
    }

    if (type === "searchModele") {
      this.setData({
        showModuleList: false,
      });
    }

    if (type === "productSon") {
      let obj = {};
      obj[itemtype] = false;
      this.setData(obj);
    }
  },

  // 选择器提交
  confirmData(e) {
    let { type, itemtype } = e.currentTarget.dataset;
    const { index, itemindex } = this.data;

    if (type === "client") {
      if (!e.detail.value[2]) {
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "当前没有选中公司，请重新选择",
          top: getApp().globalData.navH,
        });
        return;
      }
      this.data.client_id = e.detail.value[2].id;
      this.data.tree_data = e.detail.value.map((item) => {
        return item.id;
      });

      this.setData({
        client_name: e.detail.value[2].text,
      });
      this.getConcatInfo(e.detail.value[2].id);
    }

    if (type === "concat") {
      this.data.contacts_id = e.detail.value[0].id;
      this.setData({
        contacts_name: e.detail.value[0].text,
      });
    }

    if (type === "group") {
      this.data.group_id = e.detail.value[0].id;
      this.setData({
        group_name: e.detail.value[0].text,
      });
    }

    if (type === "product") {
      this.data.productList[e.currentTarget.dataset.index].category_name =
        e.detail.value[0].text;
      this.data.productList[e.currentTarget.dataset.index].secondary_category =
        e.detail.value[1].text;
      this.data.productList[e.currentTarget.dataset.index].category_id =
        e.detail.value[0].id;
      this.data.productList[
        e.currentTarget.dataset.index
      ].secondary_category_id = e.detail.value[1].id;
      this.data.productList[e.currentTarget.dataset.index].type = [
        e.detail.value[0].id,
        e.detail.value[1].id,
      ];
      this.setData({
        productList: this.data.productList,
      });
    }

    if (type === "searchModele") {
      Dialog.confirm({
        title: "提示",
        message: "选择模版后，会替换当前已选的工序和输入的内容，是否继续？",
        zIndex: 11601,
      })
        .then(() => {
          let quoteModule = this.data.searchQuotedPriceList[e.detail.index[0]];
          let product = this.data.productList[index];

          product.weave_data = JSON.parse(quoteModule.weave_data);
          product.semi_product_data = JSON.parse(quoteModule.semi_product_data);
          product.production_data = JSON.parse(quoteModule.production_data);
          product.pack_material_data = JSON.parse(
            quoteModule.pack_material_data
          );

          product.pack_material_data.forEach((item) => {
            this.data.packingList.forEach((itemP) => {
              if (item.material_id == itemP.id) {
                item.material_name = itemP.text;
              }
            });
          });

          this.setData({
            quoteModuleName: quoteModule.title,
            productList: this.data.productList,
          });
        })
        .catch(() => {
          wx.lin.showMessage({
            duration: 1500,
            content: "已取消",
            top: getApp().globalData.navH,
          });
        });
    }

    if (type === "productSon") {
      // 原料
      if (itemtype === "materialItemShow") {
        this.data.productList[index]["material_data"][itemindex].material_name =
          e.detail.value[2].text;
        this.data.productList[index]["material_data"][itemindex].material_id =
          e.detail.value[2].id;

        if (e.detail.value[0].text === "纱线") {
          this.data.productList[index]["material_data"][itemindex].unit = "g";
        } else if (e.detail.value[0].text === "面料") {
          this.data.productList[index]["material_data"][itemindex].unit = "米";
        }

        this.data.productList[index]["material_data"][itemindex].tree_data =
          e.detail.value[0].id +
          "," +
          e.detail.value[1].id +
          "," +
          e.detail.value[2].id;
      }

      // 辅料
      if (itemtype === "assistItemShow") {
        this.data.productList[index]["assist_material_data"][
          itemindex
        ].material_name = e.detail.value[0].text;
        this.data.productList[index]["assist_material_data"][
          itemindex
        ].material_id = e.detail.value[0].id;
        this.data.productList[index]["assist_material_data"][itemindex].unit =
          e.detail.value[0].unit;
      }

      // 织造
      if (itemtype === "itemWeaveDataShow") {
        this.data.productList[index]["weave_data"][itemindex].name =
          e.detail.value[0].text;
      }

      // 半成品
      if (itemtype === "itemHalfShow") {
        this.data.productList[index]["semi_product_data"][itemindex].name =
          e.detail.value[0].text;
      }

      if (itemtype === "itemPDShow") {
        this.data.productList[index]["production_data"][itemindex].name =
          e.detail.value[0].text;
      }

      if (itemtype === "itemPackShow") {
        this.data.productList[index]["pack_material_data"][
          itemindex
        ].material_name = e.detail.value[0].text;
        this.data.productList[index]["pack_material_data"][
          itemindex
        ].material_id = e.detail.value[0].id;
      }

      this.setData({
        productList: this.data.productList,
      });
    }

    this.closeShowPicker(e);
  },

  // 获取联系人信息
  getConcatInfo(id) {
    wxReq(
      {
        url: "/client/detail?id=" + id,
        method: "GET",
      },
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
    ).then((res) => {
      this.setData({
        concatList: res.data.data.contacts_data.map((item) => {
          return { text: item.name, id: item.id };
        }),
      });
    });
  },

  // 产品输入框
  changeProInput(e) {
    const { index, type } = e.currentTarget.dataset;
    this.data.productList[index][type] = e.detail.value;

    if (type === "transport_fee") {
      this.getProductTotalPrice(e);
    }
    this.getTotalPrice();

    this.setData({
      productList: this.data.productList,
    });
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
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
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
          _this.data.productList[index].image_data.push({
            name: key,
            url: fileUrl,
          });
          _this.setData({
            productList: _this.data.productList,
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

  // 添加产品
  addProduct(e) {
    let productList = this.data.productList;
    productList.push(jsonClone(this.data.productObj));
    this.setData({
      productList,
    });
  },

  // 删除产品
  deleteProduct(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList.splice(index, 1);
    this.setData({
      productList: this.data.productList,
    });
  },

  // 产品费用详情添加
  addProductType(e) {
    const { index, type } = e.currentTarget.dataset;
    if (type === "material_data") {
      this.data.productList[index].material_data.push(
        jsonClone(this.data.materialObj)
      );
    } else if (type === "assist_material_data") {
      this.data.productList[index].assist_material_data.push(
        jsonClone(this.data.assistObj)
      );
    } else if (type === "weave_data") {
      this.data.productList[index].weave_data.push(
        jsonClone(this.data.weaveObj)
      );
    } else if (type === "semi_product_data") {
      this.data.productList[index].semi_product_data.push(
        jsonClone(this.data.halfObj)
      );
    } else if (type === "production_data") {
      this.data.productList[index].production_data.push(
        jsonClone(this.data.productionDataObj)
      );
    } else if (type === "pack_material_data") {
      this.data.productList[index].pack_material_data.push(
        jsonClone(this.data.packObj)
      );
    } else if (type === "other_fee_data") {
      this.data.productList[index].other_fee_data.push(
        jsonClone(this.data.otherFeeObj)
      );
    } else if (type === "no_production_fee_data") {
      this.data.productList[index].no_production_fee_data.push(
        jsonClone(this.data.noProFeeObj)
      );
    }

    this.data.productList[index][type][
      this.data.productList[index][type].length - 1
    ].show = true;

    this.setData({
      productList: this.data.productList,
    });

    setTimeout((params) => {
      this.data.productList[index][type][
        this.data.productList[index][type].length - 1
      ].show = false;
      this.setData({
        productList: this.data.productList,
      });
    }, 100);
  },

  // 产品费用详情删除
  deleteProductType(e) {
    const { index, itemindex, type } = e.currentTarget.dataset;
    this.data.productList[index][type].splice(itemindex, 1);
    this.setData({
      productList: this.data.productList,
    });
  },

  // 原料辅料输入
  changeProductTypeDetail(e) {
    const { index, itemindex, type, itemtype } = e.currentTarget.dataset;
    this.data.productList[index][itemtype][itemindex][type] = e.detail.value;

    if (itemtype === "material_data" && type !== "total_price") {
      let data = this.data.productList[index].material_data[itemindex];
      if (data.unit === "g") {
        data.total_price = +(
          (data.weight / 1000) *
          (1 + data.loss / 100) *
          data.price
        ).toFixed(2);
      } else {
        data.total_price = +(
          data.weight *
          (1 + data.loss / 100) *
          data.price
        ).toFixed(2);
      }
    }

    if (itemtype === "assist_material_data" && type !== "total_price") {
      let data = this.data.productList[index].assist_material_data[itemindex];
      data.total_price = +(
        data.number *
        (1 + data.loss / 100) *
        data.price
      ).toFixed(2);
    }

    this.getProductTotalPrice(e);
    this.getTotalPrice();

    this.setData({
      productList: this.data.productList,
    });
  },

  deleteAssist(e) {
    let { index, itemindex } = e.currentTarget.dataset;
    this.data.productList[index].assist_material_data[itemindex].material_name =
      "";
    this.data.productList[index].assist_material_data[itemindex].material_id =
      "";
    this.setData({
      productList: this.data.productList,
    });
  },

  // 计算产品总价
  getProductTotalPrice(e) {
    const { index, itemindex, type, itemtype } = e.currentTarget.dataset;
    let product = this.data.productList[index];

    let total_price =
      Number(product.transport_fee) +
      product.material_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.assist_material_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.weave_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.semi_product_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.production_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.pack_material_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.other_fee_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0) +
      product.no_production_fee_data.reduce((totalChild, currentChild) => {
        return totalChild + (Number(currentChild.total_price) || 0);
      }, 0);

    this.data.productList[index].total_price = total_price;

    this.setData({
      productList: this.data.productList,
    });
  },

  // 计算总价
  getTotalPrice() {
    let total_cost_price = this.data.productList
      .reduce((total, current) => {
        return (
          total +
          Number(current.transport_fee) +
          current.material_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.production_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0) +
          current.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + (Number(currentChild.total_price) || 0);
          }, 0)
        );
      }, 0)
      .toFixed(2);

    this.setData({
      total_cost_price,
    });

    this.changeOtherPrice();
  },

  // 佣金百分比
  inputCommission(e) {
    this.setData({ commission_percentage: e.detail.value });
    this.changeOtherPrice();
  },

  // 税率百分比
  inputRateTaxation(e) {
    this.setData({ rate_taxation: e.detail.value });
    this.changeOtherPrice();
  },

  // 税率百分比
  inputProfitPercentage(e) {
    this.setData({ profit_percentage: e.detail.value });
    this.changeOtherPrice();
  },

  // 备注
  changeDesc(e) {
    this.setData({
      desc: e.detail.value,
    });
  },

  // 客户报价
  changeRealQuotePrice(e) {
    this.setData({
      real_quote_price: e.detail.value,
    });
  },

  // 其它价格
  changeOtherPrice() {
    let commission_price = (
      (this.data.total_cost_price /
        (1 -
          ((this.data.commission_percentage / 100 || 0) +
            (this.data.profit_percentage / 100 || 0) +
            (this.data.rate_taxation / 100 || 0)))) *
      (this.data.commission_percentage / 100 || 0)
    ).toFixed(2);

    let rate_price = (
      (this.data.total_cost_price /
        (1 -
          ((this.data.commission_percentage || 0) / 100 +
            (this.data.profit_percentage || 0) / 100 +
            (this.data.rate_taxation / 100 || 0)))) *
      (this.data.rate_taxation / 100 || 0)
    ).toFixed(2);

    let profit_price = (
      (this.data.total_cost_price /
        (1 -
          ((this.data.commission_percentage || 0) / 100 +
            (this.data.profit_percentage || 0) / 100 +
            (this.data.rate_taxation / 100 || 0)))) *
      (this.data.profit_percentage / 100 || 0)
    ).toFixed(2);

    let system_total_price = (
      Number(this.data.total_cost_price) +
      Number(commission_price) +
      Number(rate_price) +
      Number(profit_price)
    ).toFixed(2);

    this.setData({
      commission_price,
      rate_price,
      profit_price,
      system_total_price,
    });
  },

  // 提交
  submitAllInfo(e) {
    // 没填公司
    if (!this.data.client_id) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请选择询价公司",
        top: getApp().globalData.navH,
      });
      return;
    }

    // 没填汇率
    if (!this.data.exchange_rate) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写汇率",
        top: getApp().globalData.navH,
      });
      return;
    }

    // 没填佣金百分比
    if (!this.data.commission_percentage) {
      this.data.commission_percentage = 0;
      // wx.lin.showMessage({
      //   type: "error",
      //   duration: 3000,
      //   content: "请填写佣金百分比",
      //   top: getApp().globalData.navH,
      // });
      // return;
    }

    // 没填预计税率百分比
    if (!this.data.rate_taxation) {
      this.data.rate_taxation = 0;
      // wx.lin.showMessage({
      //   type: "error",
      //   duration: 3000,
      //   content: "请填写预计税率百分比",
      //   top: getApp().globalData.navH,
      // });
      // return;
    }

    if (!this.data.profit_percentage) {
      this.data.profit_percentage = 0;
      // wx.lin.showMessage({
      //   type: "error",
      //   duration: 3000,
      //   content: "请填写预计利润百分比",
      //   top: getApp().globalData.navH,
      // });
      // return;
    }

    // 没填运费、产品品类、原料
    let isContinueTrans = true;
    let isContinueType = true;
    let isContinueMat = true;

    this.data.productList.forEach((item, index) => {
      // 运费
      if (!item.transport_fee && isContinueTrans) {
        isContinueTrans = false;
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "请填写产品" + (index + 1) + "运费",
          top: getApp().globalData.navH,
        });
        return;
      }

      // 品类
      if (!item.secondary_category && isContinueType) {
        isContinueType = false;
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "请选择产品" + (index + 1) + "品类",
          top: getApp().globalData.navH,
        });
        return;
      }

      // 原料
      item.material_data.forEach((itemMat) => {
        if (!itemMat.material_id && isContinueMat) {
          isContinueMat = false;
          wx.lin.showMessage({
            type: "error",
            duration: 3000,
            content: "请选择产品" + (index + 1) + "原料",
            top: getApp().globalData.navH,
          });
          return;
        }
      });
    });
    if (!isContinueTrans || !isContinueType || !isContinueMat) return;

    this.data.productList.forEach((item) => {
      item.image_data.forEach((img, index) => {
        item.image_data[index] = img.url;
      });
    });

    const { iscaogao } = e.currentTarget.dataset;

    // return;
    let data = {
      client_id: this.data.client_id,
      commission_percentage: this.data.commission_percentage,
      commission_price: this.data.commission_price,
      contacts_id: this.data.contacts_id,
      desc: this.data.desc,
      exchange_rate: this.data.exchange_rate,
      group_id: this.data.group_id,
      id: this.data.id,
      is_draft: iscaogao ? 1 : 2,
      product_data: this.data.productList,
      profit_percentage: this.data.profit_percentage,
      profit_price: this.data.profit_price,
      rate_price: this.data.rate_price,
      rate_taxation: this.data.rate_taxation,
      real_quote_price: this.data.real_quote_price,
      settle_unit: this.data.settle_unit,
      title: this.data.title,
      system_total_price: this.data.system_total_price,
      total_cost_price: this.data.total_cost_price,
      total_number: this.data.productList.length,
      tree_data: this.data.tree_data.toString(),
    };

    wxReq(
      {
        url: "/quote/save",
        data,
        method: "POST",
      },
      this.data.isUpdate
        ? "/quotedPriceCreate/quotedPriceCreate&isUpdate=true&id=" +
            this.data.id
        : "/quotedPriceCreate/quotedPriceCreate"
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
              "/pages/quotedPriceDetail/quotedPriceDetail?id=" + res.data.data,
          });
        }, 0);
      }
    });
  },
});
