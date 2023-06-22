import { Component, Input } from '@angular/core';

@Component({
  selector: 'shortcut-card-overlay',
  template:
  `
  <div class="overlay">
    <bdb-avatar
      [avatarColor]="avatarColor"
      [showOnlyIcon]="true"
      [iconPath]="iconPath">
    </bdb-avatar>
    <div class="avatar-text">{{action}}</div>
  </div>
  `
})
export class ShortcutCardOverlayComponent {

  @Input() action = 'Transferir';
  @Input() iconPath: string;

  avatarColor = 'transparent';

  constructor() {}

}
