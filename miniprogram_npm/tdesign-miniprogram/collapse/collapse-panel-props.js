/* eslint-disable */
const props = {
    /** 折叠面板内容 */
    content: {
        type: String,
    },
    /** 禁止当前面板展开，优先级大于 Collapse 的同名属性 */
    disabled: {
        type: null,
        value: undefined,
    },
    /** 当前折叠面板展开图标，优先级大于 Collapse 的同名属性 */
    expandIcon: {
        type: Boolean,
        value: true,
    },
    /** 面板头内容 */
    header: {
        type: String,
    },
    /** 面板头的右侧区域，一般用于呈现面板操作 */
    headerRightContent: {
        type: String,
        optionalTypes: [Boolean],
    },
    /** 当前面板唯一标识，如果值为空则取当前面下标兜底作为唯一标识 */
    value: {
        type: String,
        optionalTypes: [Number],
    },
};
export default props;

//# sourceMappingURL=collapse-panel-props.js.map
