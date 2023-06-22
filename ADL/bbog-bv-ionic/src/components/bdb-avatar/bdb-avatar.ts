import { Component, Input } from '@angular/core';

@Component({
  selector: 'bdb-avatar',
  template:
    `
    <div class="avatar-wrapper">
      <div class="avatar-wrapper__border-avatar" [style.backgroundColor]="avatarColor">
        <div class="avatar-wrapper__avatar" [style.backgroundColor]="avatarColor">
          <div class="avatar-wrapper__contraction" *ngIf="!showOnlyIcon">
            {{ contraction | contractionAvatar }}
          </div>
          <img [src]="iconPath" *ngIf="showOnlyIcon">
        </div>
      </div>
    </div>
  `
})

export class BdbAvatarComponent {

  @Input() contraction = 'cf';
  @Input() avatarColor = 'transparent';
  @Input() showOnlyIcon = false;
  @Input() iconPath: string;

  constructor() { }

}
