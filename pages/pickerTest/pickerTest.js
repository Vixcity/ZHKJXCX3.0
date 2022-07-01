const citys = [
  {
    text: "山西省", // 默认识别text标签
    id: 1,
    children: [
      {
        id: 11,
        text: "太原市",
        children: [
          {
            id: 111,
            text: "山西白求恩医院",
          },
          {
            id: 112,
            text: "山大一院",
          },
          {
            id: 113,
            text: "山大二院",
          },
        ],
      },
      {
        id: 12,
        text: "大同市",
        children: [
          {
            id: 121,
            text: "大同一院",
          },
          {
            id: 122,
            text: "大同二院",
          },
        ],
      },
      {
        id: 13,
        text: "忻州市",
        children: [
          {
            id: 131,
            text: "忻州一院",
          },
          {
            id: 132,
            text: "忻州二院",
          },
        ],
      },
    ],
  },
  {
    text: "河北省",
    id: 2,
    children: [
      {
        id: 21,
        text: "石家庄市",
        children: [
          {
            id: 211,
            text: "石家庄一院",
          },
          {
            id: 212,
            text: "石家庄二院",
          },
        ],
      },
      {
        id: 22,
        text: "保定市",
        children: [
          {
            id: 221,
            text: "保定市一院",
          },
          {
            id: 222,
            text: "保定市二院",
          },
        ],
      },
      {
        id: 23,
        text: "邯郸市",
        children: [
          {
            id: 231,
            text: "邯郸市一院",
          },
          {
            id: 232,
            text: "邯郸市二院",
          },
        ],
      },
    ],
  },
  {
    text: "陕西省",
    id: 3,
    children: [
      {
        id: 31,
        text: "西安市",
        children: [
          {
            id: 311,
            text: "西安一院",
          },
          {
            id: 312,
            text: "西安二院",
          },
        ],
      },
      {
        id: 32,
        text: "宝鸡市",
        children: [
          {
            id: 321,
            text: "宝鸡市一院",
          },
          {
            id: 322,
            text: "宝鸡市二院",
          },
        ],
      },
      {
        id: 33,
        text: "延安市",
        children: [
          {
            id: 331,
            text: "延安市一院",
          },
          {
            id: 332,
            text: "延安市二院",
          },
        ],
      },
    ],
  },
];
Page({
  data: {
    supplyAreaDialog: false,
    supplyArea: "请选择",
    deptId: [],
    columns: [
      {
        values: citys,
        className: "column1",
        defaultIndex: 0,
        flex: 1, //控制每列的宽度
      },
      {
        values: citys[0].children,
        className: "column2",
        defaultIndex: 0,
        flex: 1,
      },
      {
        values: citys[0].children[0].children,
        className: "column3",
        defaultIndex: 0,
        flex: 2,
      },
    ],
  },
  supplyAreaClick() {
    this.setData({
      supplyAreaDialog: true,
    });
  },
  supplyAreaCancel() {
    this.setData({
      supplyAreaDialog: false,
    });
  },
  supplyAreaConfirm(event) {
    console.log("区域", event);
    const Address = event.detail.value;
    this.setData({
      supplyArea: Address[0].text + Address[1].text + Address[2].text,
      supplyAreaDialog: false,
      deptId: event.detail.index,
    });
  },
  supplyAreaCancel() {
    this.setData({
      supplyAreaDialog: false,
    });
  },
  supplyChange(event) {
    const { picker, value, index } = event.detail;
    console.log(value);
    let ColumnIndex = picker.getColumnIndex(index);
    if (index == 0) {
      picker.setColumnValues(index + 1, value[index].children || []);
      picker.setColumnValues(
        index + 2,
        value[index].children[index].children || []
      );
    }
    console.log("第" + index + "列", "第" + ColumnIndex + "个");
    if (index == 1) {
      picker.setColumnValues(index + 1, value[index].children || []);
    }
  },
});
