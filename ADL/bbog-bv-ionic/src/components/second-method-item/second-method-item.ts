import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'second-method-item',
  templateUrl: 'second-method-item.html'
})
export class SecondMethodItemComponent {

  @Input() text: string;
  @Input() imageUrl: string;
  @Input() secText: string;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }

  emitEvent() {
    this.selected.emit();
  }

}
