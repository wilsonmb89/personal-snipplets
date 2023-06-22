import { Component, Input, OnChanges, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Select } from 'ionic-angular';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';

@Component({
  selector: 'bdb-context-menu',
  templateUrl: 'bdb-context-menu.html'
})
export class BdbContextMenuComponent {

  _showContextArrow = true;

  @Input() contextMenuList: Array<BdbMap> = [];
  @Input() set showContextArrow(showContextArrow: boolean) {
    this._showContextArrow = (showContextArrow !== null && showContextArrow !== undefined) ? showContextArrow : true;
  }
  get showContextArrow(): boolean { return this._showContextArrow; }
  @Output() onContextCancel: EventEmitter<string> = new EventEmitter();
  @Output() onContextSelection: EventEmitter<BdbMap> = new EventEmitter();

  @ViewChild(Select) select: Select;

  constructor() {
  }

  contextCancel() {
    this.onContextCancel.emit();
  }

  contextSelection(item: BdbMap) {
    this.onContextSelection.emit(item);
  }
}
