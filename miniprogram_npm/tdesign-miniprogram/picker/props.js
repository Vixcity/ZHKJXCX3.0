/* eslint-disable */
const props = {
    /** 取消按钮文字 */
    cancelBtn: {
        type: String,
        value: '',
    },
    /** 确定按钮文字 */
    confirmBtn: {
        type: String,
        value: '',
    },
    /** 头部内容。值为 true 显示空白头部，值为 false 不显示任何内容，值类型为 TNode 表示自定义头部内容 */
    header: {
        type: Boolean,
        value: true,
    },
    /** 标题 */
    title: {
        type: String,
        value: '',
    },
    /** 选中值 */
    value: {
        type: Array,
        value: null,
    },
    /** 选中值，非受控属性 */
    defaultValue: {
        type: Array,
    },
    /** 是否显示 */
    visible: {
        type: Boolean,
        value: false,
    },
};
export default props;

//# sourceMappingURL=props.js.map
