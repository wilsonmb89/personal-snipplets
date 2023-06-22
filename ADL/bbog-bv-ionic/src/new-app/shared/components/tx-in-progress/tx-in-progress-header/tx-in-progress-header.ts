import { Component, Input, OnInit } from '@angular/core';

import { BdbMaskProvider, MaskType } from '../../../../../providers/bdb-mask';
import { TxInProgressActionButtonModel, TxInProgressHeaderModel } from '../models/tx-in-progress.model';

@Component({
  selector: 'tx-in-progress-header',
  templateUrl: './tx-in-progress-header.html'
})
export class TxInProgressHeaderComponent implements OnInit {

  @Input() header: TxInProgressHeaderModel;
  @Input() action: TxInProgressActionButtonModel;

  currDateStr: string;

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
  ) {}

  ngOnInit(): void {
    this.currDateStr = this.bdbMaskProvider.maskFormatFactory(new Date().toString(), MaskType.TIME_SHORT);
  }

  public doActionButton(): void {
    this.action.btnAction();
  }

}
