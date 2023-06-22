export interface TooltipInfoOptions {
  htmlelementref: HTMLElement;
  content: Array<PulseTooltipInfoData>;
  size: string;
  orientation: string;
  id: string;
}

export interface PulseTooltipInfoData {
  title: string;
  description: string;
}
