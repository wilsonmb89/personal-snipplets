export interface BdbGenericTable {
    columns: Array<BdbGenericTableColumn>;
    expandable?: Array<BdbGenericTableExpandable>;
}

export interface BdbGenericTableColumn {
    header: string;
    platform: BdbGenericTableColumnPlatform;
    cell: any;
    nowrap?: boolean;
    justify?: string;
    color?: any;
    type?: string;
}

export interface BdbGenericTableColumnPlatform {
    desktop?: BdbGenericTablePlatform;
    tablet?: BdbGenericTablePlatform;
    mobile?: BdbGenericTablePlatform;
}

export interface BdbGenericTablePlatform {
    column: string;
    nowrap?: boolean;
}

export interface BdbGenericTableExpandable {
    title: string;
    platform: {
        dekstop?: boolean;
        tablet?: boolean;
        mobile?: boolean;
    };
    cell: any;
}
