import { SuperComponent, ComponentsOptionsType } from '../common/src/index';
export default class CheckBox extends SuperComponent {
    externalClasses: string[];
    behaviors: string[];
    relations: {
        '../checkbox-group/checkbox-group': {
            type: "ancestor";
        };
    };
    options: ComponentsOptionsType;
    properties: {
        theme: {
            type: StringConstructor;
            value: string;
        };
        borderless: {
            type: BooleanConstructor;
            value: boolean;
        };
        align?: {
            type: StringConstructor;
            value?: "left" | "right";
        };
        checkAll?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        checked?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        defaultChecked?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        color?: {
            type: StringConstructor;
            value?: string;
        };
        content?: {
            type: StringConstructor;
            value?: string;
        };
        contentDisabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        disabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        externalClasses?: {
            type: ArrayConstructor;
            value?: ["t-class", "t-class-icon", "t-class-label", "t-class-content", "t-class-border"];
        };
        icon?: {
            type: ArrayConstructor;
            value?: string[];
        };
        indeterminate?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        label?: {
            type: StringConstructor;
            value?: string;
        };
        maxContentRow?: {
            type: NumberConstructor;
            value?: number;
        };
        maxLabelRow?: {
            type: NumberConstructor;
            value?: number;
        };
        name?: {
            type: StringConstructor;
            value?: string;
        };
        readonly?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        value?: {
            type: StringConstructor;
            optionalTypes: NumberConstructor[];
            value?: string | number;
        };
    };
    data: {
        classPrefix: string;
        prefix: string;
        active: boolean;
        halfChecked: boolean;
        optionLinked: boolean;
        canCancel: boolean;
    };
    lifetimes: {
        attached(): void;
    };
    observers: {
        checked: (isChecked: any) => void;
    };
    controlledProps: {
        key: string;
        event: string;
    }[];
    methods: {
        onChange(e: any): void;
        initStatus(): void;
        setCancel(cancel: boolean): void;
        setDisabled(disabled: Boolean): void;
        changeCheckAllHalfStatus(active: boolean): void;
        setOptionLinked(linked: Boolean): void;
    };
}
