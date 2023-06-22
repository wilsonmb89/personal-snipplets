import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'product-info',
  templateUrl: 'product-info.html'
})
export class ProductInfoComponent implements OnInit {

  @Input() titleNormal: '';
  @Input() titleBold: '';
  @Input() question: '';
  @Input() placeholder: '';
  @Input() celular;
  @Input() product;
  @Input() min = 4;
  @Input() max = 1000;
  @Input() type = 'tel';
  @Output() submitEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  formProduct: FormGroup;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {

    this.buildformProduct();
  }

  private buildformProduct() {
    this.formProduct = this.formBuilder.group(
      {
        pin: ['', Validators.compose([Validators.required, Validators.minLength(this.min), Validators.maxLength(this.max)])]
      }
    );
  }

  public cancel() {
    this.cancelEvent.emit();
  }

  public submit() {
    const data = {
      'pin': this.formProduct.value.pin
    };

    this.submitEvent.emit(data);
    this.formProduct.patchValue({ pin: ''});
  }
}
