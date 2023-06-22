export interface Limit {
  channel: string;
  desc: string;
  amount: number;
  count?: number;
  modified?: boolean;
  isAccountLimit?: boolean;
  isTooltipVisible?: boolean;
  isLimitItemExpanded?: boolean;
}
