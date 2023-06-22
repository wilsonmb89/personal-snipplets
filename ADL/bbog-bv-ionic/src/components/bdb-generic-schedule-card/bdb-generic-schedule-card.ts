import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BdbItemCardModel } from '../../components/bdb-item-card-v2/bdb-item-card-v2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { NonDefaultValue } from '../../validators/non-default-value';
import { PopoverController } from 'ionic-angular';
import { PopoverOptions } from 'ionic-angular';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';

@Component({
  selector: 'bdb-generic-schedule-card',
  templateUrl: 'bdb-generic-schedule-card.html'
})
export class BdbGenericScheduleCardComponent implements OnInit {

  @Input() item: BdbItemCardModel;
  @Input() newSched = false;
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onDelete: EventEmitter<string> = new EventEmitter();
  @Input() validAccounts: ProductDetail[];
  accountList: any = [];
  private frequencyOptions: BdbMap[] = [{
    key: '1',
    value: 'Cuando el banco reciba la factura'
  }, {
    key: '2',
    value: 'En la fecha de vencimiento de la factura'
  }, {
    key: '3',
    value: 'Días antes del vencimiento de la factura'
  }];
  private daysOptions = ['1', '2', '3', '4', '5', '6'];
  public formScheduleInfo: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    public popoverCtrl: PopoverController,
    private bdbModal: BdbModalProvider
  ) {
    this.formScheduleInfo = formBuilder.group({
      originAccount: ['def', Validators.compose([Validators.required, NonDefaultValue.checkValue])],
      maxAmount: ['', Validators.required],
      frequency: ['def', Validators.compose([Validators.required, NonDefaultValue.checkValue])],
      days: ['def', Validators.compose([Validators.required, NonDefaultValue.checkValue])]
    });
  }

  ngOnInit() {
    this.formScheduleInfo.get('days').disable();
    this.validAccounts.forEach((f: ProductDetail, index: number) => {
      const display = `${f.productName} No. ${f.productNumber}`;
      const item: BdbItemCardModel = this.item;
      if (!!this.item.account && !this.newSched &&
        f.productNumber.substring(f.productNumber.length - 4) ===
        item.account.acctId.substring(item.account.acctId.length - 4)
      ) {
        const product = item.product;
        this.formScheduleInfo.get('originAccount').setValue(index + 1);
        this.formScheduleInfo.get('maxAmount').setValue(product.maxAmount);
        this.formScheduleInfo.get('frequency').setValue(product.pmtType);
        this.formScheduleInfo.get('days').setValue(product.daysBefAft > 0 ? product.daysBefAft : 'def');
        if (product.daysBefAft > 0) {
          this.formScheduleInfo.get('days').enable();
        }
      }
      this.accountList.push({ display, index });
    });
  }

  onFrequencyChange() {
    const choice = this.formScheduleInfo.get('frequency').value;
    if (choice === '3' || choice === '4') {
      this.formScheduleInfo.get('days').enable();
    } else {
      this.formScheduleInfo.get('days').disable();
      this.formScheduleInfo.get('days').setValue('def');
    }
  }

  save() {
    this.onSave.emit();
  }

  delete() {
    this.onDelete.emit();
  }

  presentPopover(myEvent) {

    const popover = this.popoverCtrl.create('InfoMaxAmountPage', {}, {
      cssClass: 'info-max-amount'
    });
    popover.present({
      ev: myEvent
    });
  }

  presentInfo() {
    this.bdbModal.launchInfoBlackModal('InfoMaxAmountPage', () => { });
  }
}
