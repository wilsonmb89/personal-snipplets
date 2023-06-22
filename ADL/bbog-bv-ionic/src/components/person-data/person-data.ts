import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IdLengthValidator } from '../../validators/idLenght';
import { BdbNormalizeDiacriticDirective } from '../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';
/**
 * Generated class for the PersonDataComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'person-data',
  templateUrl: 'person-data.html'
})
export class PersonDataComponent {

  @Input() title: string;
  @Input() subtitleName: string;
  @Input() subtitleType: string;
  @Input() subtitleNumber: string;
  @Input() acctPersonForm: FormGroup;
  @Input() listItem: any[];
  @Output() onclic: EventEmitter<FormGroup> = new EventEmitter();
  @Output() valid: EventEmitter<string> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder) {
    this.acctPersonForm = this.formBuilder.group({
      personName: ['', [Validators.required]],
      personDocType: ['C', [Validators.required]],
      personDocNumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), IdLengthValidator.isValid])],
    });
    this.acctPersonForm.statusChanges.subscribe( e => {
      this.valid.emit(e);
    });
  }

  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
    this.acctPersonForm.controls['personName'].setValue(event.target.value);
  }

  triggerAcct() {
    this.onclic.emit(this.acctPersonForm);
  }
}
