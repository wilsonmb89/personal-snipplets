import { Component, Input, OnInit } from '@angular/core';

import { TxInProgressBodyAmtInfoModel } from '../models/tx-in-progress.model';

@Component({
  selector: 'body-amt-panel',
  templateUrl: './body-amt-panel.html'
})
export class BodyAmtPanelComponent implements OnInit {

  @Input() amtData: TxInProgressBodyAmtInfoModel;

  constructor() {}

  ngOnInit(): void {}

}
