import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';

@Component({
  selector: 'bdb-list-submenu',
  template:
  `
  <ion-list class="list-submenu">
    <button id="submenu{{i}}" ion-item detail-none class="list-submenu__item-btn" *ngFor="let item of items; let i = index"
    (click)="itemSelected(item)" [disabled]="!item.enabled">
      <div class="list-submenu__item-btn__wrapper">
        <img [src]="item.src" *ngIf="!!item.src && item.src !== ''" hidden-md-up>
        <p>{{ item.value }}</p>
      </div>
    </button>
  </ion-list>
  `
})
export class BdbListSubmenuComponent {

  @Input() items: BdbMap[];
  @Output() clickItem: EventEmitter<BdbMap> = new EventEmitter<BdbMap>();

  constructor() {
  }

  itemSelected(item: BdbMap) {
    this.clickItem.emit(item);
  }

}
