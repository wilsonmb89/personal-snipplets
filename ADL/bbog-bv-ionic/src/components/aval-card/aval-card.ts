import { Component } from '@angular/core';

@Component({
  selector: 'aval-card',
  templateUrl: 'aval-card.html'
})
export class AvalCardComponent {

  title: string;

  constructor() {
    this.title = 'Consulta tus productos AVAL';
  }

}
