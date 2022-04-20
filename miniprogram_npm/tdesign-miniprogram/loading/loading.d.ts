import { SuperComponent } from '../common/src/index';
import type { TdLoadingProps } from './type';
export interface LoadingProps extends TdLoadingProps {
}
export default class Loading extends SuperComponent {
    externalClasses: string[];
    data: {
        prefix: string;
        classPrefix: string;
        show: boolean;
    };
    options: {
        multipleSlots: boolean;
    };
    properties: TdLoadingProps;
    timer: any;
    observers: {
        loading(this: any, cur: any): void;
    };
    lifetimes: {
        detached(): void;
    };
    refreshPage(): void;
}
