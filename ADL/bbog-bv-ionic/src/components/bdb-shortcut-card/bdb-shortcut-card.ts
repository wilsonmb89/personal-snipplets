import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BdbShortcutCard } from '../../app/models/bdb-shortcut-card';

@Component({
  selector: 'bdb-shortcut-card',
  templateUrl: 'bdb-shortcut-card.html'
})
export class BdbShortcutCardComponent {

  @Input() avatarColor: string;
  @Input() currency = false;
  @Input() shortcut: BdbShortcutCard;
  @Input() elementId = 'bdb-shortcut-card';
  @Output() onCardClicked = new EventEmitter<any>();

  constructor() { }

  cardClicked() {
    this.onCardClicked.emit(this.shortcut);
  }
}

