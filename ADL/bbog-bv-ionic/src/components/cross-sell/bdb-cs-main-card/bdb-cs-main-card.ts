import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CsMainModel } from '../model/cs-main-model';

@Component({
  selector: 'bdb-cs-main-card',
  templateUrl: 'bdb-cs-main-card.html'
})
export class BdbCsMainCardComponent {

  @Input() mainCard: CsMainModel;
  @Output() onMainCardClicked: EventEmitter<CsMainModel> = new EventEmitter();

  constructor() {
  }

  open() {
    this.onMainCardClicked.emit(this.mainCard);
  }
}
