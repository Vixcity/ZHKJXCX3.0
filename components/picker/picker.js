// components/picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    values: Array,
    level: Number,
    showDialog: {
      type: Boolean,
      value: false,
    },
    notSearch: {
      type: Boolean,
      value: false,
    },
    reload: {
      type: Boolean,
      value: false,
    },
  },

  lifetimes: {
    ready: function () {
      // 初始化，默认不进行热重载
      let { values, level } = this.data;
      if (level === 2) {
        this.setData({
          columns: [
            {
              values: values,
              className: "column1",
              defaultIndex: 0,
              flex: 1, //控制每列的宽度
            },
            {
              values: values[0].children,
              className: "column2",
              defaultIndex: 0,
              flex: 1,
            },
          ],
        });
      } else if (level === 3) {
        // console.log(this.data.values);
        this.setData({
          columns: [
            {
              values: values,
              className: "column1",
              defaultIndex: 0,
              flex: 1, //控制每列的宽度
            },
            {
              values: values[0].children,
              className: "column2",
              defaultIndex: 0,
              flex: 1,
            },
            {
              values: values[0].children[0].children,
              className: "column3",
              defaultIndex: 0,
              flex: 2,
            },
          ],
        });
      } else {
        this.setData({
          columns: [
            {
              values: values,
              className: "column1",
              defaultIndex: 0,
              flex: 1, //控制每列的宽度
            },
          ],
        });
      }
    },
  },

  observers: {
    showDialog: function (a) {
      // 热重载，当获取了某个值才能获取当前值的时候可用
      if (!this.data.reload) return;
      if (!a) return;
      let { values, level } = this.data;
      if (level === 2) {
        this.setData({
          columns: [
            {
              values: values,
              className: "column1",
              defaultIndex: 0,
              flex: 1, //控制每列的宽度
            },
            {
              values: values[0].children,
              className: "column2",
              defaultIndex: 0,
              flex: 1,
            },
          ],
        });
      } else if (level === 3) {
        // console.log(this.data.values);
        this.setData({
          columns: [
            {
              values: values,
              className: "column1",
              defaultIndex: 0,
              flex: 1, //控制每列的宽度
            },
            {
              values: values[0].children,
              className: "column2",
              defaultIndex: 0,
              flex: 1,
            },
            {
              values: values[0].children[0].children,
              className: "column3",
              defaultIndex: 0,
              flex: 2,
            },
          ],
        });
      } else {
        this.setData({
          columns: [
            {
              values: values,
              className: "column1",
              defaultIndex: 0,
              flex: 1, //控制每列的宽度
            },
          ],
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    columns: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 提交事件
    supplyAreaConfirm(event) {
      this.triggerEvent("confirm", event.detail);
    },

    // 关闭事件
    supplyAreaCancel() {
      this.triggerEvent("cancel");
    },

    // 改变事件
    supplyChange(event) {
      let { level } = this.data;
      const { picker, value, index } = event.detail;
      if (level === 2) {
        if (index == 0) {
          picker.setColumnValues(index + 1, value[index].children || []);
        }
      } else if (level === 3) {
        if (index == 0) {
          picker.setColumnValues(index + 1, value[index].children || []);
          picker.setColumnValues(
            index + 2,
            value[index].children[index].children || []
          );
        }
        if (index == 1) {
          picker.setColumnValues(index + 1, value[index].children || []);
        }
      } else {
      }
    },

    // 回车事件
    comfirnData(e) {
      if (e.detail.value === "") {
        this.setData({
          showWhite: false,
        });
        return;
      }

      const value = e.detail.value.trim();
      let pickerArr = [];
      if (this.data.level == 2) {
        // console.log("两列数据", this.data.columns);
        this.data.columns[0].values.forEach((item, index) => {
          let name = item.text;
          let checkItem = false;
          if (name.indexOf(value) >= 0) {
            checkItem = true;
          }

          item.children.forEach((itemChild, indexChild) => {
            if (checkItem) {
              // 上一级有就全部推进去
              pickerArr.push({
                index: [index, indexChild],
                value: [item, itemChild],
              });

              return;
            }

            if (itemChild.text.indexOf(value) >= 0) {
              pickerArr.push({
                index: [index, indexChild],
                value: [item, itemChild],
              });
            }
          });
        });
      } else if (this.data.level == 3) {
        this.data.columns[0].values.forEach((item, index) => {
          let name = item.text;
          let checkItem = false;
          if (name.indexOf(value) >= 0) {
            checkItem = true;
          }

          item.children.forEach((itemChild, indexChild) => {
            let checkItemChild = false;

            if (itemChild.text.indexOf(value) >= 0) {
              checkItemChild = true;
            }

            itemChild.children.forEach((itemGransSon, indexGrandSon) => {
              if (checkItem) {
                // 上一级有就全部推进去
                pickerArr.push({
                  index: [index, indexChild, indexGrandSon],
                  value: [item, itemChild, itemGransSon],
                });

                return;
              }

              if (checkItemChild) {
                // 上一级有就全部推进去
                pickerArr.push({
                  index: [index, indexChild, indexGrandSon],
                  value: [item, itemChild, itemGransSon],
                });

                return;
              }

              if (itemGransSon.text.indexOf(value) >= 0) {
                pickerArr.push({
                  index: [index, indexChild, indexGrandSon],
                  value: [item, itemChild, itemGransSon],
                });
              }
            });
          });
        });
      } else {
        let arr = this.data.columns[0].values;
        for (let i = 0; i < arr.length; i++) {
          var name = arr[i].text;
          //判断是否匹配，如果不匹配，则隐藏
          if (name.indexOf(value) >= 0) {
            pickerArr.push({
              index: [i],
              value: [arr[i]],
            });
          }
        }
      }

      if (pickerArr.length > 0) {
        this.setData({
          showWhite: true,
          pickerArr,
        });
      } else {
				this.setData({
          showWhite: false,
        });
			}
    },

    // 清空文字
    clearInputText() {
      this.setData({
        inputText: "",
        showWhite: false,
      });
    },

    // 点击筛选出来的条件
    selectFilter(e) {
      this.supplyAreaConfirm({ detail: e.currentTarget.dataset.item });
    },
  },
});
