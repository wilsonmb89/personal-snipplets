import { Component, Input, Output, EventEmitter, Directive } from '@angular/core';

@Directive({
  selector: '[left], [right]',
  // tslint:disable-next-line: use-host-property-decorator
  host: {'class': 'nav-options__deco'}
})
export class IconNavDecoDirective { }

@Component({
  selector: 'bdb-nav-options',
  templateUrl: 'bdb-nav-options.html'
})
export class BdbNavOptionsComponent {

  @Input() lOption = '';
  @Input() rOption = '';
  @Input() navTitle = '';
  @Output() onLeftClicked = new EventEmitter();
  @Output() onRightClicked = new EventEmitter();

  constructor() { }

  leftClicked() {
    this.onLeftClicked.emit();
  }

  rightClicked() {
    this.onRightClicked.emit();
  }
}
