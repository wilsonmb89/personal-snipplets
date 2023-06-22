import { Component, Input } from '@angular/core';

@Component({
  selector: 'bdb-submenu-header',
  template:
  `
  <div class="header">
    <div id="bsh-title" text-wrap class="text-style-sub header__title">{{ title }}</div>
    <div text-wrap hidden-md-down class="subtitle">{{ subtitle }}</div>
  </div>
  `
})
export class BdbSubmenuHeaderComponent {

  @Input() title: string;
  @Input() subtitle: string;

  constructor() {
  }

}
