import { Component, Input, OnInit } from '@angular/core';
import { TxInProgressActionButtonModel, TxInProgressBodyModel } from '@app/shared/components/tx-in-progress/models/tx-in-progress.model';

@Component({
  selector: 'tx-in-progress-body',
  templateUrl: './tx-in-progress-body.html'
})
export class TxInProgressBodyComponent implements OnInit {

  @Input() body: TxInProgressBodyModel;
  @Input() action: TxInProgressActionButtonModel;

  constructor() {}

  ngOnInit(): void {}

  public doActionButton(): void {
    this.action.btnAction();
  }

}
