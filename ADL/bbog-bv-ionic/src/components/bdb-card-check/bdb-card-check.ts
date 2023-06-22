import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bdb-card-check',
  templateUrl: 'bdb-card-check.html'
})
export class BdbCardCheckComponent {

  @Input() title: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() value: string;

  @Output() clickCard = new EventEmitter();

  constructor() { }

  executeEmit() {
    this.clickCard.emit();
  }

}
