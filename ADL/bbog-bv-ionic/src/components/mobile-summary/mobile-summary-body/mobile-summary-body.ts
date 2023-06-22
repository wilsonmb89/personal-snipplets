import { Component, Input } from '@angular/core';

@Component({
  selector: 'mobile-summary-body',
  templateUrl: 'mobile-summary-body.html'
})
export class MobileSummaryBodyComponent {

  @Input() textUp: string;
  @Input() textDown: string;
  @Input() valueUp: string;
  @Input() valueDown: string;

  constructor() {
  }

  isDetailCostNotAvailable(value: string): boolean {
    return value && value.includes('NO_AVAILABLE');
  }
}
