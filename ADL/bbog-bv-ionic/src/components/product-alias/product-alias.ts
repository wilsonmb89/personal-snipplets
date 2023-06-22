import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavigationProvider } from '../../providers/navigation/navigation';
import { NavController } from 'ionic-angular';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';

@Component({
  selector: 'product-alias',
  templateUrl: 'product-alias.html'
})
export class ProductAliasComponent {

  productAliasForm: FormGroup;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() productPlaceholder: string;
  @Output() payNow: EventEmitter<{ nickName, payNow }> = new EventEmitter();

  abandonText = BdbConstants.ABANDON_PAY;

  constructor(
    private formBuilder: FormBuilder,
    private navigation: NavigationProvider,
    private navCtrl: NavController
  ) {

    this.productAliasForm = this.formBuilder.group({
      nickName: ['', [Validators.required]]
    });
  }

  productToPayNow(now: boolean) {
    const nickName = this.productAliasForm.get('nickName').value;
    this.payNow.emit({nickName, payNow: now});
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.onAbandonPressed(this.navCtrl);
  }

}
