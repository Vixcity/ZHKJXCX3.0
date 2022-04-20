/* eslint-disable */
const props = {
    /** 【讨论中】菜单标题和选项的选中态颜色 */
    activeColor: {
        type: String,
        value: '',
    },
    /** 是否在点击遮罩层后关闭菜单 */
    closeOnClickOverlay: {
        type: Boolean,
        value: true,
    },
    /** 动画时长 */
    duration: {
        type: String,
        optionalTypes: [Number],
        value: 200,
    },
    /** 是否显示遮罩层 */
    overlay: {
        type: Boolean,
        value: true,
    },
    /** 菜单栏 z-index 层级 */
    zIndex: {
        type: Number,
        value: 11600,
    },
};
export default props;

//# sourceMappingURL=props.js.map
