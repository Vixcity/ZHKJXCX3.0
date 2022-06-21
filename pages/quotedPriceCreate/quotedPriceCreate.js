// pages/quotedPrice/quotedPriceCreate.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  getClientList,
  getYarnType,
  getGroupList,
  getProductTypeList,
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
            tree_data: "1,1,1",
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
    concatName: "",
    groupName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const isLogin = isIfLogin();
    let _this = this;

    getClientList("quotedPriceCreate");
    getYarnType("quotedPriceCreate");
    getGroupList("quotedPriceCreate");
    getProductTypeList("quotedPriceCreate");
    await wxReq(
      {
        url: "/decorate/material/lists",
        methods: "GET",
      },
      "quotedPriceCreate"
    ).then((res) => {
      res.data.data.forEach((item) => {
        const { id, unit } = item;
        _this.data.assistListChoose.push({
          label: item.name,
          unit,
          value: id,
        });
      });
      this.setData({
        assistListChoose: _this.data.assistListChoose,
      });
    });

    let yarnTypeAndName = this.getYarnTypeListSAndNames();
    this.data.productList = [
      {
        type: [
          wx.getStorageSync("productTypeList")[0].value,
          wx.getStorageSync("productTypeList")[0].options[0].value,
        ],
        client_target_price: "",
        start_order_number: "",
        transport_fee: "",
        transport_fee_desc: "",
        desc: "",
        image_data: [],
        material_data: [
          {
            id: "",
            loss: "",
            material_id: yarnTypeAndName.yarnTypeList,
            material_name: yarnTypeAndName.names,
            price: "",
            total_price: "",
            tree_data: "1,1,1",
            unit: "g",
            weight: "",
          },
        ],
        assist_material_data: [
          {
            id: "",
            loss: "",
            material_id: "",
            material_name: this.data.assistListChoose[0].label,
            number: "",
            price: "",
            total_price: "",
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
    ];

    this.setData({
      isLogin,
      clientList: {
        options: wx.getStorageSync("clientList").slice(0, 2),
        value: [
          "0",
          "0-0",
          wx.getStorageSync("clientList").slice(0, 2)[0].options[0].options[0]
            .value,
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
          id: this.data.clientList.value[2].split("-")[2],
        },
        url: "/client/detail",
        methods: "GET",
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

  showChooseAssist(e) {
    const { assistindex, index } = e.currentTarget.dataset;
    this.data.productList[index].assist_material_data[
      assistindex
    ].showAssist = true;
    this.setData({
      productList: this.data.productList,
    });
  },

  closeShowAssist(e) {
    const { assistindex, index } = e.currentTarget.dataset;
    this.data.productList[index].assist_material_data[
      assistindex
    ].showAssist = false;
    this.setData({
      productList: this.data.productList,
    });
  },

  chooseAssistConfirm(e) {
    const { assistindex, index } = e.currentTarget.dataset;
    const { label, unit, value } = e.detail.value[0];

    this.data.productList[index].assist_material_data[
      assistindex
    ].material_name = label;
    this.data.productList[index].assist_material_data[
      assistindex
    ].material_id = value;
    this.data.productList[index].assist_material_data[assistindex].unit = unit;

    this.setData({
      productList: this.data.productList,
    });

    this.closeShowAssist(e);
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
    console.log(e);
    this.setData({
      concatName: e.detail,
    });
    this.closeChooseConcat();
  },

  changeProductType(e) {
    const { index, type } = e.currentTarget.dataset;
    this.data.productList[index][type] = e.detail.value;
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

    this.setData({
      productList: this.data.productList,
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
      transport_fee: "",
      transport_fee_desc: "",
      image_data: [],
      material_data: [
        {
          id: "",
          loss: "",
          material_id: yarnTypeAndName.yarnTypeList,
          material_name: yarnTypeAndName.names,
          price: "",
          total_price: "",
          tree_data: "1,1,1",
          unit: "g",
          weight: "",
        },
      ],
      assist_material_data: [
        {
          id: "",
          loss: "",
          material_id: this.data.assistListChoose[0].value,
          material_name: this.data.assistListChoose[0].label,
          number: "",
          price: "",
          total_price: "",
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
        loss: "",
        material_id: yarnTypeAndName.yarnTypeList,
        material_name: yarnTypeAndName.names,
        price: "",
        total_price: "",
        tree_data: "1,1,1",
        unit: "g",
        weight: "",
      });
    } else if (type === "assist_material_data") {
      this.data.productList[index].assist_material_data.push({
        id: "",
        loss: "",
        material_id: this.data.assistListChoose[0].value,
        material_name: this.data.assistListChoose[0].label,
        number: "",
        price: "",
        total_price: "",
        unit: this.data.assistListChoose[0].unit,
      });
    } else if (type === "weave_data") {
      this.data.productList[index].weave_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "针织织造",
        quote_rel_product_id: "",
        total_price: "",
        updated_at: "",
      });
    } else if (type === "semi_product_data") {
      this.data.productList[index].semi_product_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
        quote_rel_product_id: "",
        total_price: "",
        updated_at: "",
      });
    } else if (type === "production_data") {
      this.data.productList[index].production_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
        quote_rel_product_id: "",
        total_price: "",
        updated_at: "",
      });
    } else if (type === "pack_material_data") {
      this.data.productList[index].pack_material_data.push({
        desc: "",
        id: "",
        material_id: "",
        material_name: "",
        total_price: "",
      });
    } else if (type === "other_fee_data") {
      this.data.productList[index].other_fee_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
        quote_rel_product_id: "",
        total_price: "",
        updated_at: "",
      });
    } else if (type === "no_production_fee_data") {
      this.data.productList[index].no_production_fee_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
        quote_rel_product_id: "",
        total_price: "",
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
    this.setData({
      productList: this.data.productList,
    });
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
        methods: "GET",
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
    console.log(file);
  },
});
