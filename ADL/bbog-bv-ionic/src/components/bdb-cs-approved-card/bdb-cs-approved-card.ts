import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'bdb-cs-approved-card',
  templateUrl: 'bdb-cs-approved-card.html'
})
export class BdbCsApprovedCardComponent implements OnInit {

  @Input() approvedCard: any;
  @Output() onMainCardClicked: EventEmitter<any> = new EventEmitter();
  amount: string;

  constructor(
    private _decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit() {
    this.amount = this._decimalPipe.transform(this.approvedCard.approved.amount, '1.2-2');
  }

  open() {
    this.onMainCardClicked.emit(this.approvedCard);
  }

}
