// pages/quotedPrice/quotedPriceCreate.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const {
  isIfLogin,
  getClientList,
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
    productList: [
      {
        type: ["", ""],
        client_target_price: "",
        start_order_number: "",
        desc: "",
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
            unit: "个",
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
      },
    ],
    concatNameList: [],
    concatIdList: [],
    groupLabelList: [],
    groupValueList: [],
    concatName: "",
    groupName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = isIfLogin();

    getClientList("quotedPriceCreate");
    getGroupList("quotedPriceCreate");
    getProductTypeList("quotedPriceCreate");

    this.data.productList = [
      {
        type: [
          wx.getStorageSync("productTypeList")[0].value,
          wx.getStorageSync("productTypeList")[0].options[0].value,
        ],
        client_target_price: "",
        start_order_number: "",
        desc: "",
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
            unit: "个",
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
      },
    ];

    this.setData({
      isLogin,
      clientList: {
        options: wx.getStorageSync("clientList").slice(0, 2),
        value: ["0", "0-0", ""],
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

  openGroup() {
    this.setData({
      showGroup: true,
    });
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
    let index = e.currentTarget.dataset.index;
    this.data.productList[index].type = e.detail.value;
    this.setData({
      productList: this.data.productList,
    });
  },

  inputPrice(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList[index].client_target_price = e.detail.value;
    this.setData({
      productList: this.data.productList,
    });
  },

  inputOrderNumber(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList[index].start_order_number = e.detail.value;
    this.setData({
      productList: this.data.productList,
    });
  },

  changeDesc(e) {
    let index = e.currentTarget.dataset.index;
    this.data.productList[index].desc = e.detail.value;
    this.setData({
      productList: this.data.productList,
    });
  },

  addProduct() {
    this.data.productList.push({
      type: [
        wx.getStorageSync("productTypeList")[0].value,
        wx.getStorageSync("productTypeList")[0].options[0].value,
      ],
      client_target_price: "",
      start_order_number: "",
      desc: "",
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
          unit: "个",
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
      this.data.productList[index].material_data.push({
        id: "",
        loss: "",
        material_id: "",
        material_name: "",
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
        material_id: "",
        material_name: "",
        number: "",
        price: "",
        total_price: "",
        unit: "个",
      });
    } else if (type === "weave_data") {
      this.data.productList[index].weave_data.push({
        created_at: "",
        desc: "",
        id: "",
        name: "",
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
