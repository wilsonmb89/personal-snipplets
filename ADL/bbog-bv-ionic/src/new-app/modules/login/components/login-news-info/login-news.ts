import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { ContactNumbersModalComponent } from '../contact-numbers-modal/contact-numbers-modal';

@Component({
  selector: 'app-login-news',
  templateUrl: './login-news.html'
})
export class LoginNewsComponent implements OnInit {

  private readonly FIND_BANKS_URL = 'https://www.bancodebogota.com/cercademi/colombia/results-bogota/Ver%20Todas';
  private readonly CHAT_BANK_URL = 'https://wa.me/573182814679?text=Hola,%20me%20gustar%C3%ADa%20saber%20acerca%20de%20';

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {}

  public async openContactNumbersModal(): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: ContactNumbersModalComponent
    }, this.viewRef, this.resolver);

    await modal.present();
  }

  public openChatBankWindow(): void {
    this.openExternalUrl(this.CHAT_BANK_URL);
  }

  public openFindBanksWindow(): void {
    this.openExternalUrl(this.FIND_BANKS_URL);
  }

  public scrollIntoView(event: CustomEvent, element: HTMLElement): void {
    if (event.detail) {
      setTimeout(() => {
        element.scrollIntoView({behavior: 'smooth', block: 'end'});
      }, 250);
    }
  }

  private openExternalUrl(url: string): void {
    window.open(url, '_blank');
  }

}
