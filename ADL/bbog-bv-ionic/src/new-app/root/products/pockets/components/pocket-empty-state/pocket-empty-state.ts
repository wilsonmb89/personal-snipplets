import { Component } from '@angular/core';

@Component({
  selector: 'pocket-empty-state',
  templateUrl: 'pocket-empty-state.html'
})
export class PocketEmptyStateComponent {

  private readonly SAVING_ACCOUNTS_URL = 'https://digital.bancodebogota.com.co/cuenta-ahorros/index.html';

  constructor() {}

  public openCreateAccountPage() {
    this.openExternalUrl(this.SAVING_ACCOUNTS_URL);
  }

  private openExternalUrl(url: string): void {
    window.open(url, '_blank');
  }

}
