import { Component, Input } from '@angular/core';

@Component({
  selector: 'mobile-summary-header',
  templateUrl: 'mobile-summary-header.html'
})
export class MobileSummaryHeaderComponent {


  @Input() showLogo: boolean;
  @Input() contraction: string;
  @Input() avatarColor: string;
  @Input() logoPath: string;
  @Input() title: string;
  @Input() details: Array<string> = [];
  @Input() subDetails: Array<string> = [];

  constructor() {
  }

}
