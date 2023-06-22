import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-token-header',
  templateUrl: 'modal-token-header.html'
})
export class ModalTokenHeaderComponent {

  @Input() iconPath: string;
  @Input() title: string;
  @Input() text: string;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  closeModal() {
    this.onCloseModal.emit();
  }
}
