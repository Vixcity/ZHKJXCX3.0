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
      // console.log("picker", event);
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
  },
});
