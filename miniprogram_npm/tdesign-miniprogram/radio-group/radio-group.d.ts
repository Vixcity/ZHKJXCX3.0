import { SuperComponent } from '../common/src/index';
export default class RadioGroup extends SuperComponent {
    externalClasses: string[];
    data: {
        prefix: string;
        classPrefix: string;
        radioOptions: any[];
    };
    relations: {
        '../radio/radio': {
            type: "descendant";
            linked(target: any): void;
        };
    };
    properties: {
        disabled?: {
            type: BooleanConstructor;
            value?: boolean;
        };
        name?: {
            type: StringConstructor;
            value?: string;
        };
        options?: {
            type: ArrayConstructor;
            value?: import("../radio/type").RadioOption[];
        };
        value?: {
            type: StringConstructor;
            optionalTypes: (NumberConstructor | BooleanConstructor)[];
            value?: import("../radio/type").RadioValue;
        };
        defaultValue?: {
            type: StringConstructor;
            optionalTypes: (NumberConstructor | BooleanConstructor)[];
            value?: import("../radio/type").RadioValue;
        };
    };
    controlledProps: {
        key: string;
        event: string;
    }[];
    lifetimes: {
        attached(): void;
    };
    observers: {
        value(): void;
    };
    methods: {
        getChilds(): any;
        updateValue(value: any): void;
        handleRadioChange(e: any): void;
        initWithOptions(): void;
    };
}
