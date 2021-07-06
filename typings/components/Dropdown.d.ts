export interface DropdownProps {
    elements: DropdownButtonAction[];
    xCords: number;
    yCords: number;
}

export interface DropdownButtonAction {
    title: string;
    executor: any;
}
