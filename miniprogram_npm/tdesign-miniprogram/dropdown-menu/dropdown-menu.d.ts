import { RelationsOptions, SuperComponent } from '../common/src/index';
import type { TdDropdownMenuProps } from './type';
export interface DropdownMenuProps extends TdDropdownMenuProps {
}
export default class DropdownMenu extends SuperComponent {
    properties: TdDropdownMenuProps;
    data: {
        prefix: string;
        classPrefix: string;
        nodes: any;
        menus: any;
        activeIdx: number;
        bottom: number;
    };
    relations: RelationsOptions;
    lifetimes: {
        ready(): void;
    };
    methods: {
        getAllItems(): void;
        toggleDropdown(e: WechatMiniprogram.BaseEvent): void;
    };
}
