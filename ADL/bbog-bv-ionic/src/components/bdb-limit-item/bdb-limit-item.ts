import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { LimitsRs } from '../../app/models/limits/get-accounts-limits-response';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../providers/bdb-mask/bdb-mask-type.enum';

@Component({
  selector: 'bdb-limit-item',
  templateUrl: 'bdb-limit-item.html'
})
export class BdbLimitItemComponent implements OnInit {

  @Input() limit: LimitsRs;

  @Input('edit')
  set toggleBtn(edit: boolean) {
    this.toggleIcon(edit);
  }

  iconBtnEdit: string;
  @Output() toggleEdit = new EventEmitter();

  constructor(
    private bdbMask: BdbMaskProvider
  ) {
  }

  ngOnInit() {

    this.limit.amount = this.limit.amount;
    this.toggleIcon(this.limit.edit);
  }

  toggleIcon(edit: boolean) {
    this.iconBtnEdit = edit ? 'assets/imgs/group-5.png' : 'assets/imgs/edit-anticon.png';
  }

  toggleBtnEdit() {
    this.toggleEdit.emit(this.limit);
  }

}
