import { SuperComponent } from '../common/src/index';
export default class CheckBoxGroup extends SuperComponent {
    externalClasses: string[];
    relations: {
        '../checkbox/checkbox': {
            type: "descendant";
            linked(): void;
        };
    };
    data: {
        classPrefix: string;
        checkboxOptions: any[];
    };
    properties: {
        customStyle: StringConstructor;
        defaultValue: {
            type: any;
            value: any;
        };
        disabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        max?: {
            type: NumberConstructor;
            value?: number;
        };
        name?: {
            type: StringConstructor;
            value?: string;
        };
        options?: {
            type: ArrayConstructor;
            value?: import("../checkbox/type").CheckboxOption[];
        };
        value?: {
            type: ArrayConstructor;
            value?: import("../checkbox/type").CheckboxGroupValue;
        };
    };
    observers: {
        value(): void;
    };
    lifetimes: {
        attached(): void;
    };
    controlledProps: {
        key: string;
        event: string;
    }[];
    methods: {
        getChilds(): any;
        updateChildren(): void;
        updateValue({ name, checked }: {
            name: any;
            checked: any;
        }): void;
        handleCreateMulCheckbox(): void;
        handleCheckAll(e: any): void;
        handleHalfCheck(len: number): void;
        handleOptionLinked(): void;
    };
}
