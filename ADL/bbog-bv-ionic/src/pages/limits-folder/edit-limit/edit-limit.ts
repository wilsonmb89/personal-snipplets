import { Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { LimitsRs } from '../../../app/models/limits/get-accounts-limits-response';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@IonicPage({
  name: 'edit%limit',
  segment: 'edit%limit'
})
@Component({
  selector: 'page-edit-limit',
  templateUrl: 'edit-limit.html',
})
export class EditLimitPage implements OnInit {

  limit: LimitsRs;
  callback;
  editLimitForm: FormGroup;
  disableBtn = false;
  showTrnError = false;
  withDecimal = false;
  customMask = createNumberMask({
    allowDecimal: this.withDecimal,
    decimalSymbol: '.',
    thousandsSeparatorSymbol: ','
  });
  @ViewChild('colAmount') colAmount: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbPlatforms: BdbPlatformsProvider,
    public view: ViewController,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private events: Events
  ) {
    this.limit = navParams.get('limit');
    this.callback = this.navParams.get('callback');
    const amountValidators = this.limit.trnCount === null ? [Validators.required, Validators.max(50000000)] : [];
    this.editLimitForm = this.formBuilder.group({
      amountNumber: ['', amountValidators],
      creditNumber: [this.limit.trnCount]
    });
    this.onVerifyChange();
  }

  ngOnInit() {
    this.editLimitForm.get('amountNumber').setValue(this.limit.amount);
  }

  ionViewDidLoad() {
    const colAmountEl = this.colAmount.nativeElement;
    if (this.limit.trnCount) {
      this.renderer.setAttribute(colAmountEl, 'col-md-6', null);
    } else {
      this.renderer.setAttribute(colAmountEl, 'col-md-9', null);
      this.renderer.setAttribute(colAmountEl, 'offset-md-1', null);
    }
  }

  submitEdit() {
    this.limit.amount = this.editLimitForm.get('amountNumber').value.toString();
    this.callback(this.limit).then(() => {
      this.navCtrl.pop({
        animation: 'ios',
        animate: !this.bdbPlatforms.isBrowser()
      });
    });
  }

  onInputChange(event) {
    const trn = this.editLimitForm.get('creditNumber').value;
    if (trn !== null && trn > 0) {
      this.limit.trnCount = trn.toString();
      this.disableBtn = this.editLimitForm.controls.amountNumber.invalid;
      this.showTrnError = false;
    } else {
      this.showTrnError = true;
      this.disableBtn = true;
    }
  }

  onVerifyChange() {
    if (this.limit.trnCount === null) {
      this.disableBtn = this.editLimitForm.controls.amountNumber.invalid;
    } else {
      this.disableBtn = this.editLimitForm.controls.amountNumber.invalid || this.editLimitForm.controls.creditNumber.invalid;
    }
  }

  closeModal() {
    this.view.dismiss();
  }

}
