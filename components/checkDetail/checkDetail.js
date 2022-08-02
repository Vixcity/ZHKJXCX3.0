const { wxReq } = require("../../utils/util");

// components/checkDetail/checkDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
		},
		is_check:{
			type: Number
		},
    pid: {
      type: Number | String,
    },
    check_type: {
      type: Number | String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    reasonList: [],
  },
	
	observers: {
		show: function (a) {
			if(a){
				let { pid, check_type } = this.data;
				let _this = this;
				wxReq({
					url: "/doc/check/lists",
					data: { pid, check_type },
					method: "GET",
				}).then((res) => {
					_this.setData({ reasonList: res.data.data });
				});
			}
		}
	},

  /**
   * 组件的方法列表
   */
  methods: {
		closeCheckDetail(){
			this.triggerEvent("cancel");
		},
	},
});
