// pages/quotedPrice/quotedPriceCreate.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  getClientList,
  getYarnType,
  getGroupList,
  getProductTypeList,
  contentHtml,
  debounce,
  wxReq,
} = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    showChooseConcat: false,
    showGroup: false,
    isUpdate: false,
    clientList: {
      options: [
        {
          label: "选项1",
          options: [
            {
              label: "选项1",
              value: "0-0",
            },
            {
              label: "选项2",
              value: "0-1",
            },
          ],
          value: "0",
        },
      ],
      value: ["0", "0-0"],
    },
    yarnTypeList: {
      options: [
        {
          label: "选项1",
          options: [
            {
              label: "选项1",
              value: "0-0",
            },
            {
              label: "选项2",
              value: "0-1",
            },
          ],
          value: "0",
        },
      ],
      value: ["0", "0-0"],
    },
    productTypeList: {
      options: [
        {
          label: "选项1",
          options: [
            {
              label: "选项1",
              value: "0-0",
            },
            {
              label: "选项2",
              value: "0-1",
            },
          ],
          value: "0",
        },
      ],
      value: ["0", "0-0"],
    },
    title: "",
    exchange_rate: "",
    productList: [
      {
        type: ["", ""],
        client_target_price: "",
        start_order_number: "",
        desc: "",
        transport_fee: 0,
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
            name: "针织织造",
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
            name: "",
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
            name: "",
            quote_rel_product_id: "",
            total_price: "",
            updated_at: "",
          },
        ],
      },
    ],
    concatNameList: [],
    concatIdList: [],
    groupLabelList: [],
    groupValueList: [],
    assistListChoose: [],
    weaveList: [
      { label: "针织织造", value: "针织织造" },
      { label: "梭织织造", value: "梭织织造" },
      { label: "制版费", value: "制版费" },
    ],
    id: "",
    concatName: "",
    desc: "",
    groupName: "",
    commission_percentage: "",
    rate_taxation: "",
    profit_percentage: "",
    profit_price: 0,
    rate_price: 0,
    rate_taxation: "",
    commission_price: 0,
    real_quote_price: "",
    settle_unit: "元",
    system_total_price: "",
    total_cost_price: 0,
    total_number: "",
    halfProcessList: [],
    processList: [],
    packingList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const isLogin = isIfLogin();
    let _this = this;
    if (options.isUpdate === "true") {
      this.setData({
        isUpdate: true,
      });
    }

    await getClientList("quotedPriceCreate");
    await getYarnType("quotedPriceCreate");
    await getGroupList("quotedPriceCreate");
    await getProductTypeList("quotedPriceCreate");

    // 辅料
    await wxReq(
      {
        url: "/decorate/material/lists",
        method: "GET",
      },
      "quotedPriceCreate"
    ).then((res) => {
      _this.data.assistListChoose = [];
      res.data.data.forEach((item) => {
        const { id, unit } = item;
        _this.data.assistListChoose.push({
          label: item.name,
          unit,
          value: id,
          item,
        });
      });
      _this.setData({
        assistListChoose: _this.data.assistListChoose,
      });
    });

    // 半成品
    await wxReq(
      {
        url: "/process/lists",
        data: { type: 2 },
        method: "GET",
      },
      "quotedPriceCreate"
    ).then((res) => {
      _this.data.halfProcessList = [];
      let data = res.data.data;
      data.forEach((item) => {
        _this.data.halfProcessList.push({
          label: item.name,
          value: item.id,
          item,
        });
      });
      _this.setData({
        halfProcessList: _this.data.halfProcessList,
      });
    });

    // 成品
    await wxReq(
      {
        url: "/process/lists",
        data: { type: 3 },
        method: "GET",
      },
      "quotedPriceCreate"
    ).then((res) => {
      _this.data.processList = [];
      let data = res.data.data;
      data.forEach((item) => {
        _this.data.processList.push({
          label: item.name,
          value: item.id,
          item,
        });
      });
      _this.setData({
        processList: _this.data.processList,
      });
    });

    // 包装
    await wxReq(
      {
        url: "/pack/material/lists",
        method: "GET",
      },
      "quotedPriceCreate"
    ).then((res) => {
      _this.data.packingList = [];
      let data = res.data.data;
      data.forEach((item) => {
        _this.data.packingList.push({
          label: item.name,
          value: item.id,
          item,
        });
      });
      _this.setData({
        packingList: _this.data.packingList,
      });
    });

    let yarnTypeAndName = this.getYarnTypeListSAndNames();

    if (!this.data.isUpdate) {
      this.data.productList = [
        {
          type: [
            wx.getStorageSync("productTypeList")[0].value,
            wx.getStorageSync("productTypeList")[0].options[0].value,
          ],
          client_target_price: "",
          start_order_number: "",
          transport_fee: 0,
          transport_fee_desc: "",
          desc: "",
          total_price: 0,
          category_id: "",
          image_data: [],
          editor: "",
          product_id: "",
          secondary_category_id: "",
          id: "",
          material_data: [
            {
              id: "",
              loss: 0,
              material_id: yarnTypeAndName.yarnTypeList,
              material_name: yarnTypeAndName.names,
              price: 0,
              total_price: 0,
              tree_data: yarnTypeAndName.yarnTypeList[2].replaceAll("-", ","),
              unit: "g",
              weight: 0,
            },
          ],
          assist_material_data: [
            {
              id: "",
              loss: 0,
              material_id: this.data.assistListChoose[0].value,
              material_name: this.data.assistListChoose[0].label,
              number: 0,
              price: 0,
              total_price: 0,
              unit: this.data.assistListChoose[0].unit,
            },
          ],
          weave_data: [
            {
              created_at: "",
              desc: "",
              id: "",
              name: "针织织造",
              quote_rel_product_id: "",
              total_price: 0,
              updated_at: "",
            },
          ],
          semi_product_data: [
            {
              created_at: "",
              desc: "",
              id: "",
              name: this.data.halfProcessList[0].label,
              quote_rel_product_id: "",
              total_price: 0,
              updated_at: "",
            },
          ],
          production_data: [
            {
              created_at: "",
              desc: "",
              id: "",
              name: this.data.processList[0].label,
              quote_rel_product_id: "",
              total_price: 0,
              updated_at: "",
            },
          ],
          pack_material_data: [
            {
              desc: "",
              id: "",
              material_id: this.data.packingList[0].value,
              material_name: this.data.packingList[0].label,
              total_price: 0,
            },
          ],
          other_fee_data: [
            {
              created_at: "",
              desc: "",
              id: "",
              name: "",
              quote_rel_product_id: "",
              total_price: 0,
              updated_at: "",
            },
          ],
          no_production_fee_data: [
            {
              created_at: "",
              desc: "",
              id: "",
              name: "",
              quote_rel_product_id: "",
              total_price: 0,
              updated_at: "",
            },
          ],
        },
      ];
    } else {
      wxReq(
        {
          url: "/quote/detail",
          method: "GET",
          data: { id: options.id },
        },
        "quotedPriceCreate"
      ).then((res) => {
        // console.log(res.data.data);
        let data = res.data.data;
        const {
          title,
          id,
          exchange_rate,
          group_name,
          commission_percentage,
          commission_price,
          contacts_name,
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

        let groupIndex = this.data.groupLabelList.findIndex((res) => {
          return res === group_name;
        });

        this.changeClient({
          detail: {
            value: [
              tree_data.split(",")[0],
              tree_data.split(",")[0] + "-" + tree_data.split(",")[1],
              tree_data.replaceAll(",", "-"),
            ],
          },
        });

        product_data.forEach((item) => {
          item.type = item.category_id
            ? [
                item.category_id,
                item.category_id + "-" + item.secondary_category_id,
              ]
            : "";
          item.image_data.forEach((img, index) => {
            item.image_data[index] = { name: "load" + index, url: img };
          });

          item.desc = item.desc ? contentHtml(item.desc) : "";

          item.material_data.forEach((material) => {
            material.material_id = [
              Number(material.tree_data.split(",")[0]),
              material.tree_data.split(",")[0] +
                "-" +
                material.tree_data.split(",")[1],
              material.tree_data.replaceAll(",", "-"),
            ];
          });
        });

        this.setData({
          id,
          title,
          groupName: group_name
            ? {
                index: groupIndex,
                value: group_name,
              }
            : "",
          concatName: contacts_name
            ? {
                index: "",
                value: contacts_name,
              }
            : "",
          exchange_rate,
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
          "clientList.value[0]": tree_data.split(",")[0],
          "clientList.value[1]":
            tree_data.split(",")[0] + "-" + tree_data.split(",")[1],
          "clientList.value[2]": tree_data.replaceAll(",", "-"),
          productList: product_data,
        });
      });
    }

    this.setData({
      isLogin,
      clientList: {
        options: wx.getStorageSync("clientList").slice(0, 2),
        value: [
          wx.getStorageSync("clientList").slice(0, 2)[0].value,
          wx.getStorageSync("clientList").slice(0, 2)[0].options[0].value,
        ],
      },
      groupLabelList: wx.getStorageSync("groupList").map((item) => {
        return item.label;
      }),
      groupValueList: wx.getStorageSync("groupList").map((item) => {
        return item.value;
      }),
      productTypeList: {
        options: wx.getStorageSync("productTypeList"),
        value: [
          wx.getStorageSync("productTypeList")[0].value,
          wx.getStorageSync("productTypeList")[0].options[0].value,
        ],
      },
      productList: this.data.productList,
      yarnTypeList: {
        options: wx.getStorageSync("yarnType").slice(0, 2),
        value: yarnTypeAndName.yarnTypeList,
      },
    });
  },

  changeClient(e) {
    this.setData({
      "clientList.value": e.detail.value,
    });
    wxReq(
      {
        data: {
          id: e.detail.value[2].split("-")[2],
        },
        url: "/client/detail",
        method: "GET",
      },
      "quotedPriceCreate"
    ).then((res) => {
      this.data.concatNameList = res.data.data.contacts_data.map((item) => {
        return item.name;
      });

      this.data.concatIdList = res.data.data.contacts_data.map((item) => {
        return item.id;
      });

      this.setData({
        concatNameList: this.data.concatNameList,
        concatIdList: this.data.concatIdList,
      });
    });
  },

  changeTitle(e) {
    this.setData({
      title: e.detail.value,
    });
  },

  changeRate(e) {
    this.setData({
      exchange_rate: e.detail.value,
    });
  },

  openGroup() {
    this.setData({
      showGroup: true,
    });
  },

  // 打开报价信息选择框
  showChoose(e) {
    const { itemindex, index, type } = e.currentTarget.dataset;
    this.data.productList[index][type][itemindex].show = true;
    this.setData({
      productList: this.data.productList,
    });
  },

  // 关闭报价信息选择框
  closeShow(e) {
    const { itemindex, index, type } = e.currentTarget.dataset;
    this.data.productList[index][type][itemindex].show = false;
    this.setData({
      productList: this.data.productList,
    });
  },

  // 辅料确认
  chooseAssistConfirm(e) {
    const { itemindex, index } = e.currentTarget.dataset;
    const { label, unit, value } = e.detail.value[0];

    this.data.productList[index].assist_material_data[
      itemindex
    ].material_name = label;
    this.data.productList[index].assist_material_data[
      itemindex
    ].material_id = value;
    this.data.productList[index].assist_material_data[itemindex].unit = unit;

    this.setData({
      productList: this.data.productList,
    });

    this.closeShow(e);
  },

  // 织造，半成品，成品,包装确认
  chooseConfirm(e) {
    const { itemindex, index, type } = e.currentTarget.dataset;
    if (type === "pack_material_data") {
      this.data.productList[index][type][itemindex].material_name =
        e.detail.value[0].label;
      this.data.productList[index][type][itemindex].material_id =
        e.detail.value[0].value;
      this.setData({
        productList: this.data.productList,
      });
    } else if (type === "assist_material_data") {
      const { label, unit, value } = e.detail.value[0];

      this.data.productList[index].assist_material_data[
        itemindex
      ].material_name = label;
      this.data.productList[index].assist_material_data[
        itemindex
      ].material_id = value;
      this.data.productList[index].assist_material_data[itemindex].unit = unit;
    } else {
      this.data.productList[index][type][itemindex].name =
        e.detail.value[0].label;
    }

    this.setData({
      productList: this.data.productList,
    });

    this.closeShow(e);
  },

  closeGroup() {
    this.setData({
      showGroup: false,
    });
  },

  confirmGroup(e) {
    this.closeGroup();

    this.setData({
      groupName: e.detail,
    });
  },

  changeChooseConcat() {
    this.setData({
      showChooseConcat: true,
    });
  },

  closeChooseConcat() {
    this.setData({
      showChooseConcat: false,
    });
  },

  confirmChooseConcat(e) {
    this.setData({
      concatName: e.detail,
    });
    this.closeChooseConcat();
  },

  changeProductType(e) {
    const { index, type } = e.currentTarget.dataset;
    this.data.productList[index][type] = e.detail.value;

    this.getTotalPrice();

    this.setData({
      productList: this.data.productList,
    });
  },

  changeMaterial(e) {
    const { index, materialindex } = e.currentTarget.dataset;

    let arr = e.detail.value[2].split("-");
    let str = arr[0] + "-" + arr[1];

    let name1 = this.data.yarnTypeList.options.find(
      (res) => res.value === e.detail.value[0]
    );
    let name2 = name1.options.find((item) => item.value === str);
    let name3 = name2.options.find((item) => item.value === e.detail.value[2]);
    let names = name1.label + "/" + name2.label + "/" + name3.label;

    this.data.productList[index].material_data[materialindex].material_id =
      e.detail.value;
    this.data.productList[index].material_data[
      materialindex
    ].material_name = names;
    this.data.productList[index].material_data[
      materialindex
    ].tree_data = e.detail.value[2].replaceAll("-", ",");

    this.setData({
      productList: this.data.productList,
    });
  },

  changeUnit(e) {
    this.setData({
      settle_unit: e.detail.currentKey,
    });
  },

  getYarnTypeListSAndNames() {
    let yarnTypeLists = wx.getStorageSync("yarnType").slice(0, 2);

    const e = [
      yarnTypeLists[0].value,
      yarnTypeLists[0].options[0].value,
      yarnTypeLists[0].options[0].options[0].value,
    ];

    let name1 = yarnTypeLists.find((res) => res.value === e[0]);
    let name2 = name1.options.find((item) => item.value === e[1]);
    let name3 = name2.options.find((item) => item.value === e[2]);
    let names = name1.label + "/" + name2.label + "/" + name3.label;

    return {
      yarnTypeList: e,
      names,
    };
  },

  addProduct() {
    let yarnTypeAndName = this.getYarnTypeListSAndNames();

    this.data.productList.push({
      type: [
        wx.getStorageSync("productTypeList")[0].value,
        wx.getStorageSync("productTypeList")[0].options[0].value,
      ],
      client_target_price: "",
      start_order_number: "",
      desc: "",
      transport_fee: 0,
      transport_fee_desc: "",
      total_price: 0,
      category_id: "",
      image_data: [],
      editor: "",
      product_id: "",
      secondary_category_id: "",
      id: "",
      material_data: [
        {
          id: "",
          loss: 0,
          material_id: yarnTypeAndName.yarnTypeList,
          material_name: yarnTypeAndName.names,
          price: 0,
          total_price: 0,
          tree_data: yarnTypeAndName.yarnTypeList[2].replaceAll("-", ","),
          unit: "g",
          weight: 0,
        },
      ],
      assist_material_data: [
        {
          id: "",
          loss: 0,
          material_id: this.data.assistListChoose[0].value,
          material_name: this.data.assistListChoose[0].label,
          number: 0,
          price: 0,
          total_price: 0,
          unit: this.data.assistListChoose[0].unit,
        },
      ],
      weave_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "针织织造",
          quote_rel_product_id: "",
          total_price: 0,
          updated_at: "",
        },
      ],
      semi_product_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: this.data.halfProcessList[0].label,
          quote_rel_product_id: "",
          total_price: 0,
          updated_at: "",
        },
      ],
      production_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: this.data.processList[0].label,
          quote_rel_product_id: "",
          total_price: 0,
          updated_at: "",
        },
      ],
      pack_material_data: [
        {
          desc: "",
          id: "",
          material_id: this.data.packingList[0].value,
          material_name: this.data.packingList[0].label,
          total_price: 0,
        },
      ],
      other_fee_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "",
          quote_rel_product_id: "",
          total_price: 0,
          updated_at: "",
        },
      ],
      no_production_fee_data: [
        {
          created_at: "",
          desc: "",
          id: "",
          name: "",
          quote_rel_product_id: "",
          total_price: 0,
          updated_at: "",
        },
      ],
    });
    this.setData({
      productList: this.data.productList,
    });
  },

  deleteProduct(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList.splice(index, 1);
    this.setData({
      productList: this.data.productList,
    });
  },

  addProductType(e) {
    const { index, type } = e.currentTarget.dataset;
    if (type === "material_data") {
      let yarnTypeAndName = this.getYarnTypeListSAndNames();
      this.data.productList[index].material_data.push({
        id: "",
        loss: 0,
        material_id: yarnTypeAndName.yarnTypeList,
        material_name: yarnTypeAndName.names,
        price: 0,
        total_price: 0,
        tree_data: yarnTypeAndName.yarnTypeList[2].replaceAll("-", ","),
        unit: "g",
        weight: 0,
      });
    } else if (type === "assist_material_data") {
      this.data.productList[index].assist_material_data.push({
        id: "",
        loss: 0,
        material_id: this.data.assistListChoose[0].value,
        material_name: this.data.assistListChoose[0].label,
        number: 0,
        price: 0,
        total_price: 0,
        unit: this.data.assistListChoose[0].unit,
      });
    } else if (type === "weave_data") {
      this.data.productList[index].weave_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "针织织造",
        quote_rel_product_id: "",
        total_price: 0,
        updated_at: "",
      });
    } else if (type === "semi_product_data") {
      this.data.productList[index].semi_product_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: this.data.halfProcessList[0].label,
        quote_rel_product_id: "",
        total_price: 0,
        updated_at: "",
      });
    } else if (type === "production_data") {
      this.data.productList[index].production_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: this.data.processList[0].label,
        quote_rel_product_id: "",
        total_price: 0,
        updated_at: "",
      });
    } else if (type === "pack_material_data") {
      this.data.productList[index].pack_material_data.push({
        desc: "",
        id: "",
        material_id: this.data.packingList[0].value,
        material_name: this.data.packingList[0].label,
        total_price: 0,
      });
    } else if (type === "other_fee_data") {
      this.data.productList[index].other_fee_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
        quote_rel_product_id: "",
        total_price: 0,
        updated_at: "",
      });
    } else if (type === "no_production_fee_data") {
      this.data.productList[index].no_production_fee_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
        quote_rel_product_id: "",
        total_price: 0,
        updated_at: "",
      });
    }

    this.setData({
      productList: this.data.productList,
    });
  },

  deleteProductType(e) {
    const { index, itemindex, type } = e.currentTarget.dataset;
    this.data.productList[index][type].splice(itemindex, 1);
    this.setData({
      productList: this.data.productList,
    });
  },

  changeProductTypeDetail(e) {
    const { index, itemindex, type, itemtype } = e.currentTarget.dataset;
    this.data.productList[index][itemtype][itemindex][type] = e.detail.value;

    if (itemtype === "material_data" && type !== "total_price") {
      let data = this.data.productList[index].material_data[itemindex];
      data.total_price = +(
        (data.weight / 1000) *
        (1 + data.loss / 100) *
        data.price
      ).toFixed(2);
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

  getProductTotalPrice(e) {
    const { index, itemindex, type, itemtype } = e.currentTarget.dataset;
    let product = this.data.productList[index];

    let total_price =
      Number(product.transport_fee) +
      product.material_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.assist_material_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.weave_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.semi_product_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.production_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.pack_material_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.other_fee_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0) +
      product.no_production_fee_data.reduce((totalChild, currentChild) => {
        return totalChild + Number(currentChild.total_price);
      }, 0);

    this.data.productList[index].total_price = total_price;

    this.setData({
      productList: this.data.productList,
    });
  },

  getTotalPrice() {
    let total_cost_price = this.data.productList
      .reduce((total, current) => {
        return (
          total +
          Number(current.transport_fee) +
          current.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0) +
          current.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price);
          }, 0)
        );
      }, 0)
      .toFixed(2);

    this.setData({
      total_cost_price,
    });

    this.changeOtherPrice();
  },

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
      "quotedPriceCreate"
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

  deleteImage(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList[index].image_data.splice(e.detail.index, 1);
    this.setData({
      productList: this.data.productList,
    });
  },

  beforeRead(event) {
    const { file, callback } = event.detail;
    callback(file.type === "image");
    // console.log(file);
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

  changeOtherPrice() {
    let commission_price = (
      (this.data.total_cost_price /
        (1 -
          this.data.commission_percentage / 100 +
          this.data.profit_percentage / 100 +
          this.data.rate_taxation / 100)) *
      (this.data.commission_percentage / 100)
    ).toFixed(2);

    let rate_price = (
      (this.data.total_cost_price /
        (1 -
          this.data.commission_percentage / 100 +
          this.data.profit_percentage / 100 +
          this.data.rate_taxation / 100)) *
      (this.data.rate_taxation / 100)
    ).toFixed(2);

    let profit_price = (
      (this.data.total_cost_price /
        (1 -
          this.data.commission_percentage / 100 +
          this.data.profit_percentage / 100 +
          this.data.rate_taxation / 100)) *
      (this.data.profit_percentage / 100)
    ).toFixed(2);

    let system_total_price =
      Number(this.data.total_cost_price) +
      Number(commission_price) +
      Number(rate_price) +
      Number(profit_price);

    this.setData({
      commission_price,
      rate_price,
      profit_price,
      system_total_price,
    });
  },

  changeDesc(e) {
    this.setData({
      desc: e.detail.value,
    });
  },

  changeRealQuotePrice(e) {
    this.setData({
      real_quote_price: e.detail.value,
    });
  },

  // 提交
  submitAllInfo(e) {
    if (this.data.clientList.value.length < 3) {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请选择询价公司",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (this.data.exchange_rate === "") {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写汇率",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (this.data.commission_percentage === "") {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写佣金百分比",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (this.data.rate_taxation === "") {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写预计税率百分比",
        top: getApp().globalData.navH,
      });
      return;
    }

    if (this.data.profit_percentage === "") {
      wx.lin.showMessage({
        type: "error",
        duration: 3000,
        content: "请填写预计利润百分比",
        top: getApp().globalData.navH,
      });
      return;
    }

    let isContinue = true;

    this.data.productList.forEach((item, index) => {
      if (item.transport_fee === "" && isContinue) {
        isContinue = false;
        wx.lin.showMessage({
          type: "error",
          duration: 3000,
          content: "请填写产品" + (index + 1) + "运费",
          top: getApp().globalData.navH,
        });
      }
    });

    if (!isContinue) return;

    if (!this.data.concatName.index && this.data.concatName.name) {
      let index = this.data.concatNameList.findIndex((item) => {
        return item === this.data.concatName.name;
      });
      this.data.concatName.index = index > 0 ? index : 0;
    }

    this.data.productList.forEach((item) => {
      item.type[1] = +item.type[1].split("-")[1];
      item.category_id = item.type[0];
      item.secondary_category_id = item.type[1];

      item.image_data.forEach((img, index) => {
        item.image_data[index] = img.url;
      });

      item.material_data.forEach((res) => {
        res.material_id = res.material_id[2].split("-")[2];
      });
    });

    const { iscaogao } = e.currentTarget.dataset;

    let data = {
      client_id: this.data.clientList.value[2].split("-")[2],
      commission_percentage: this.data.commission_percentage,
      commission_price: this.data.commission_price,
      contacts_id: this.data.concatName
        ? this.data.concatIdList[this.data.concatName.index]
        : "",
      desc: this.data.desc,
      exchange_rate: this.data.exchange_rate,
      group_id: this.data.groupName
        ? this.data.groupValueList[this.data.groupName.index]
        : "",
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
      total_number: this.data.total_number,
      tree_data: this.data.clientList.value[2].replaceAll("-", ","),
    };

    wxReq(
      {
        url: "/quote/save",
        data,
        method: "POST",
      },
      "quotedPriceCreate"
    ).then((res) => {
      if (res.data.status) {
        wx.lin.showMessage({
          type: "success",
          duration: 3000,
          content: "保存成功，三秒后跳转详情页",
          top: getApp().globalData.navH,
        });
        setTimeout(function () {
          wx.navigateTo({
            url:
              "/pages/quotedPriceDetail/quotedPriceDetail?id=" + res.data.data,
          });
        }, 3000);
      }
    });
  },
});
