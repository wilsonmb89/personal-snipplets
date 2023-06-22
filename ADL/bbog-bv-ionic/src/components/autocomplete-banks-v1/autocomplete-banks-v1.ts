import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BanksList} from '../../app/models/banks-rs';
import {BankInfo} from '../../app/models/bank-info';
import {BdbConstants} from '../../app/models/bdb-generics/bdb-constants';
import {EnrollProduct} from '../../app/models/transfers/subscribe-acct';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';

@Component({
  selector: 'autocomplete-banks-v1',
  templateUrl: 'autocomplete-banks-v1.html'
})
export class AutocompleteBanksV1Component {

  @Input() autocompleteForm: FormGroup;
  @Output() itemSelected: EventEmitter<boolean>;
  @Output() product: EventEmitter<EnrollProduct>;
  @Input() avalList: boolean;

  bankList: any[];

  constructor(private formBuilder: FormBuilder,
              private userFacade: UserFacade) {
    this.autocompleteForm = this.formBuilder.group({
      bankName: ['', [Validators.required]]
    });
    this.itemSelected = new EventEmitter();
    this.product = new EventEmitter();
    this.itemSelected.emit(true);
  }

  getItems() {
    this.itemSelected.emit(true);
    // set val to the value of the form
    const val = this.autocompleteForm.get('bankName').value.toString();
    // Reset items back to all of the items
    this.initializeItems();
    if (val && val.trim() !== '' && val.length > 2) {
      this.bankList = this.bankList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.bankList = [];
    }
  }

  initializeItems() {
    this.userFacade.bankListForCredits$().subscribe( bankList => this.bankList = bankList );
  }

  onItemClick(item: BanksList) {
    this.autocompleteForm.controls['bankName'].setValue(item.name);
    this.bankList = [];
    this.itemSelected.emit(false);
    const bankInfo = new BankInfo(item.id, BdbConstants.BRANCH_ID);
    const enrollProduct = new EnrollProduct();
    enrollProduct.bankInfo = bankInfo;
    this.product.emit(enrollProduct);
  }


}
