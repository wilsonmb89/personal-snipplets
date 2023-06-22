import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'bdb-dropdown',
  templateUrl: 'bdb-dropdown.html'
})
export class BdbDropdownComponent {

  @Input() items: any;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  onChange(value: string) {
    this.itemSelected.emit(value);
  }

}
