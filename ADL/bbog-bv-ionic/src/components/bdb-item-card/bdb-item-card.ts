import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, ActionSheetController } from 'ionic-angular';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { MenuOption } from '@app/shared/utils/bdb-pulse-ops-services/models/menu-option.model';
import { MenuOptionsOpsProvider } from '@app/shared/utils/bdb-pulse-ops-services/menu-options-ops';

@Component({
  selector: 'bdb-item-card',
  templateUrl: 'bdb-item-card.html'
})
export class BdbItemCardComponent {

  @Input() title: string;
  @Input() desc: Array<string> = [];
  @Input() subDesc: Array<string> = [];
  @Input() logoPath: string;
  @Input() showLogo: boolean;
  @Input() contraction: string;
  @Input() avatarColor: string;
  @Input() withFavoriteStar = false;
  @Input() withContextMenu = false;
  @Input() contextMenuList: Array<BdbMap> = [];
  @Output() onItemClicked: EventEmitter<string> = new EventEmitter();
  @Output() onContextSelection: EventEmitter<BdbMap> = new EventEmitter();

  public _isFavorite = false;

  @Output() isFavoriteChange = new EventEmitter();
  set isFavorite(isFavorite: boolean) {
      this._isFavorite = isFavorite;
      this.isFavoriteChange.emit(this._isFavorite);
  }
  @Input('isFavorite')
  get isFavorite() {
      return this._isFavorite;
  }

  @Output() changeFavorite: EventEmitter<boolean> = new EventEmitter();

  buttons: Array<{text, role?, handler}> = [];
  animateArrow = false;
  addColorToArrow  = false;
  starStatus = false;

  constructor(
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private bdbPlatforms: BdbPlatformsProvider,
    private menuOptionsOpsProvider: MenuOptionsOpsProvider
  ) {
  }

  itemClicked() {
    this.onItemClicked.emit();
  }

  async contextClicked(myEvent, htmlElement: HTMLElement) {
    if (this.bdbPlatforms.isMobile()) {
      this.openInMobile();
      this.addColorToArrow = true;
    } else {
      this.showMenuOptions(htmlElement);
      this.animateArrow = true;
    }
  }

  private showMenuOptions(htmlElement: HTMLElement): void {
    const options = this.contextMenuList.map(option => {
      return {
        label: option.value,
        value: option.key,
        action: (key) => this.onContextSelection.emit({key: key}),
        icon: option.icon,
        color: option.color,
        colorvariant: option.colorvariant,
        showIcon: option.showIcon
      };
    });

    const menuOption: MenuOption = {
      id: 'ptc_menu',
      data: options,
      value: 'any',
      show: true,
      htmlelementref: htmlElement,
    };
    this.menuOptionsOpsProvider.presentOptionMenu(menuOption);
  }

  openInBrowser(myEvent) {
    const popover = this.popoverCtrl.create('ContextMenuPage', {data: this.contextMenuList}, {
      cssClass: 'contextPopOver'
    });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data: BdbMap) => {
      this.animateArrow = false;
      if (data) {
        this.onContextSelection.emit(data);
      }
    });
  }

  openInMobile() {
    const btns = this.contextMenuList.map((data: BdbMap) => {
      return {
        text: data.value,
        role: '',
        handler: () => {
          // tslint:disable-next-line: no-use-before-declare
          actionSheet.dismiss(data);
          return false;
        }
      };
    });
    btns.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        // tslint:disable-next-line: no-use-before-declare
        actionSheet.dismiss();
        return false;
      }
    });
    const actionSheet = this.actionSheetCtrl.create({
      buttons: btns
    });
    actionSheet.present();
    actionSheet.onDidDismiss((data: BdbMap) => {
      this.addColorToArrow = false;
      if (data) {
        this.onContextSelection.emit(data);
      }
    });
  }

  public clickStar() {
    this.changeFavorite.emit();
  }
}
