import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the BdbBackSubmenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-back-submenu',
  templateUrl: 'bdb-back-submenu.html'
})
export class BdbBackSubmenuComponent {

  @Input() label: string;
  @Output() returnPage = new EventEmitter;

  constructor() {
  }

  executeEmit() {
    this.returnPage.emit();
  }

}
