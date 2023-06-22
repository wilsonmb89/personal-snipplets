import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CsMainModel } from '..';

@Component({
  selector: 'bdb-cs-mosaic',
  templateUrl: 'bdb-cs-mosaic.html'
})
export class BdbCsMosaicComponent {

  @Input() mosaicList: Array<CsMainModel>;
  @Output() onItemClicked: EventEmitter<CsMainModel> = new EventEmitter();

  constructor() { }

  itemClicked(item: CsMainModel) {
    this.onItemClicked.emit(item);
  }
}
