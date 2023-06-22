import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreditBank} from '../../app/models/credits/bank-credit';

@Component({
  selector: 'bdb-option-list',
  templateUrl: 'bdb-option-list.html'
})
export class BdbOptionListComponent {

  @Input() title;
  @Input() bdbListForm: FormGroup;
  @Input() bdbList: any[];
  @Output() itemSelected: EventEmitter<CreditBank> = new EventEmitter();

  constructor() {
  }

  emit(item: CreditBank) {
    this.itemSelected.emit(item);
  }
}
