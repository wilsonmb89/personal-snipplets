import {Directive, HostListener, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {InMemoryKeys} from '../../../../providers/storage/in-memory.keys';
import {BdbInMemoryProvider} from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';

@Directive({ selector: '[navBehavior]' })
export class NavBehaviorDirective {

    @Input() goToPage: string;

    constructor(public navCtrl: NavController,
    public bdbInMemory: BdbInMemoryProvider
    ) {
    }

    @HostListener('click', ['$event']) onClick(): void {
    this.bdbInMemory.clearItem(InMemoryKeys.TransferOrigin);
      if (!!this.goToPage) {
        this.onCancel();
      } else {
        this.goBack();
      }
    }

    private goBack( ): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.popToRoot();
    } else {
      this.onCancel();
    }
  }

  private onCancel(): void {
    this.navCtrl.setRoot(this.goToPage);
  }
}
