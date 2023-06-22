import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';

@Component({
  selector: 'bdb-autocomplete',
  templateUrl: 'bdb-autocomplete.html'
})
export class BdbAutocompleteComponent {

  _listOptions: any[];
  _staticListOption: any[];
  _parentForm: FormGroup;

  triggerSearch = true;
  @Output() clickOption = new EventEmitter();
  @Input() isStaticListOption = false;
  @Input() nameProperty: string;
  @Input() valueProperty: string;
  val: any;
  @Input()
  set parentForm(f: FormGroup) {
    if (!!f) {
      this._parentForm = f;
    } else {
      this._parentForm = this.formBuilder.group({
        autoPaymentAgreement: ['']
      });
    }
  }

  @Input() controlName = 'autoPaymentAgreement';
  @Input() placeholder: string;
  @Input() id: string;
  @Input() listSize: number;
  @Output() inputChange = new EventEmitter();
  @Output() resetInput = new EventEmitter();

  @Input()
  set listOptions(listOptions: any[]) {
    if (this.isStaticListOption) {
      this._staticListOption = listOptions;
    }
    this._listOptions = this.showData(listOptions);

  }

  constructor(private formBuilder: FormBuilder, private bdbPlatforms: BdbPlatformsProvider) {
    this._listOptions = [];
    this.triggerSearch = true;
  }

  getItems(e) {
    this.val = this._parentForm.get(this.controlName).value.toString().trim();
    if (this.triggerSearch) {
      this.inputChange.emit(this.val);
    }
    if (this.isStaticListOption) {
      this._listOptions = this.showData(this._staticListOption);
    }
  }


  private showData(listOptions: any[]): any[] {
    if (!!this.val && this.val !== '' && this.val.length > 2 && !!listOptions) {
      return listOptions.filter((item) => this.compareTerms(this.val, item[this.nameProperty]));
    } else {
      return [];
    }
  }

  private compareTerms(term: string, value: string): boolean {
    const normalizedTerm = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const normalizedValue = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return normalizedValue.includes(normalizedTerm);
  }

  selectOption(item, e) {
    this.triggerSearch = false;
    this._parentForm.controls[this.controlName].setValue(item[this.nameProperty]);
    this.clickOption.emit({ item, e });
    this._listOptions = [];

  }

  setAsBlank() {
    this.triggerSearch = true;
    this._parentForm.get(this.controlName).patchValue('');
    this.inputChange.emit('');
  }

}
