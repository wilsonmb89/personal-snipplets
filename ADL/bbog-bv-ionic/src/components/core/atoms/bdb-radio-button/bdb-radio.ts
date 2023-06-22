import { Component, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, OnInit } from '@angular/core';
import { getBdbRadioUnsupportedTypeError } from './bdb-radio-errors';
import { BdbRadioButtonRefDirective } from './bdb-radio-ref';

@Component({
  selector: 'bdb-radio',
  templateUrl: 'bdb-radio.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BdbRadioButtonComponent implements OnInit {

  @ContentChild(BdbRadioButtonRefDirective)
  bvRadioRef: BdbRadioButtonRefDirective;

  constructor() {

  }

  ngOnInit(): void {
    this.validateType(this.bvRadioRef);
  }

  protected validateType(child: BdbRadioButtonRefDirective) {
    if (!this.bvRadioRef || !(this.bvRadioRef.type === 'radio' || this.bvRadioRef.type === 'checkbox') ) {
      throw getBdbRadioUnsupportedTypeError(this.bvRadioRef.type);
    }
  }

}
