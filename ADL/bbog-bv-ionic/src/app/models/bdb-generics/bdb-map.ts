export interface BdbMap {
    key: string;
    value?: string;
    src?: string;
    cod?: string;
    template?: string;
    img?: string;
    mobile?: {
        enabled?: string,
        disabled?: string
    };
    enabled?: boolean;
    desktop?: {
        enabled?: string,
        disabled?: string
    };
    color?: string;
    icon?: string;
    colorvariant?: string;
    showIcon?: boolean;
    microfrontend?: boolean;
}
