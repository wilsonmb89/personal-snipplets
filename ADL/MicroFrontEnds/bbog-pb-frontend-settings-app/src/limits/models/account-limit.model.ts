export interface AccountLimit {
  amount: number | null;
  trnCode: string | null;
  typeField: string | null;
  modified?: boolean;
  isTooltipVisible?: boolean;
  isLimitItemExpanded?: boolean;
}
