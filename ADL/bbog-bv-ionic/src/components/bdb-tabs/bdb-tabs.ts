import { Component, Input, Output, EventEmitter, OnInit, NgZone } from '@angular/core';
import { Tab } from './model/tab';

/**
 * Generated class for the BdbTabsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-tabs',
  templateUrl: 'bdb-tabs.html'
})
export class BdbTabsComponent implements OnInit {

  @Input() tabs: Tab[];
  @Output() selectChange = new EventEmitter<Tab>();
  @Input() disabled =  false;
  constructor(
    private zone: NgZone,

  ) { }

  ngOnInit() {
  }

  selectTab(item: Tab) {
    if (!this.disabled) {
      this.tabs.forEach(t => t.status = false);
      item.status = true;
      this.selectChange.emit(item);
    }

  }
}
