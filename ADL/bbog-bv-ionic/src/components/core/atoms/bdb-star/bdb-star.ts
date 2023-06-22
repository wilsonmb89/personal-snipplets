import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Generated class for the BdbStarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-star',
  templateUrl: 'bdb-star.html'
})
export class BdbStarComponent {


  public _isActive: boolean;


  @Output() isActiveChange = new EventEmitter();
  set isActive(isActive: boolean) {
      this._isActive = isActive;
      this.isActiveChange.emit(this._isActive);
  }
  @Input('isActive')
  get isActive() {
      return this._isActive;
  }

  constructor() {
    this._isActive =  false;
  }

}
