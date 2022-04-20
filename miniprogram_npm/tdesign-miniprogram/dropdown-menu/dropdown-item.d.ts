import { RelationsOptions, SuperComponent } from '../common/src/index';
import type { TdDropdownItemProps } from './type';
export interface DropdownItemProps extends TdDropdownItemProps {
}
export default class DropdownMenuItem extends SuperComponent {
    properties: {
        disabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        label?: {
            type: StringConstructor;
            value?: string;
        };
        multiple?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        options?: {
            type: ArrayConstructor;
            value?: import("./type").TdDropdownItemOption[];
        };
        optionsColumns?: {
            type: StringConstructor;
            optionalTypes: NumberConstructor[];
            value?: string | number;
        };
        optionsLayout?: {
            type: StringConstructor;
            value?: "columns" | "tree";
        };
        value?: {
            type: StringConstructor;
            optionalTypes: (NumberConstructor | ArrayConstructor)[];
            value?: import("./type").TdDropdownItemOptionValueType | import("./type").TdDropdownItemOptionValueType[];
        };
        defaultValue?: {
            type: StringConstructor;
            optionalTypes: (NumberConstructor | ArrayConstructor)[];
            value?: import("./type").TdDropdownItemOptionValueType | import("./type").TdDropdownItemOptionValueType[];
        };
    };
    data: {
        prefix: string;
        classPrefix: string;
        show: boolean;
        bar: any;
        top: number;
        maskHeight: number;
        contentClasses: string;
        leafLevel: number;
        treeOptions: any[];
        initValue: any;
        hasChanged: boolean;
        duration: string | number;
        zIndex: number;
        overlay: boolean;
    };
    relations: RelationsOptions;
    controlledProps: {
        key: string;
        event: string;
    }[];
    observers: {
        value(v: any): void;
        'initValue, value'(v1: any, v2: any): void;
    };
    lifetimes: {
        attached(): void;
    };
    methods: {
        buildTreeOptions(): void;
        closeDropdown(): void;
        getParentBottom(parent: any): void;
        handleTreeClick(e: any): void;
        handleRadioChange(e: any): void;
        handleMaskClick(): void;
        handleReset(): void;
        handleConfirm(): void;
    };
}
