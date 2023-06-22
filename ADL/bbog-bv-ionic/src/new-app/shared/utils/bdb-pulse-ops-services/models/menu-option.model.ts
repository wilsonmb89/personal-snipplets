export interface MenuOption {
  id: string;
  data: Array<PulseOptionMenuData>;
  value: any;
  show: boolean;
  htmlelementref: HTMLElement;
}

export interface PulseOptionMenuData {
  label: string;
  value: string;
  action: any;
}
