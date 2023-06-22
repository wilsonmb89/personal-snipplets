import { Component, Input } from '@angular/core';

@Component({
  selector: 'item-list-header',
  templateUrl: 'item-list-header.html'
})
export class ItemListHeaderComponent {

  @Input() title: string;
  @Input() subtitle: string;

  constructor() {
  }

}
