import {Component, Input, EventEmitter, Output} from '@angular/core';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { PopoverController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { BdbUtilsProvider } from '../../providers/bdb-utils/bdb-utils';
import {MenuOptionsOpsProvider} from '../../new-app/shared/utils/bdb-pulse-ops-services/menu-options-ops';
import {MenuOption} from '../../new-app/shared/utils/bdb-pulse-ops-services/models/menu-option.model';

@Component({
  selector: 'bdb-item-card-v2',
  templateUrl: 'bdb-item-card-v2.html'
})
export class BdbItemCardV2Component {

  @Input() item: BdbItemCardModel;
  @Input() index: number;
  @Output() onItemClicked: EventEmitter<string> = new EventEmitter();
  @Output() onContextSelection: EventEmitter<BdbMap> = new EventEmitter();
  @Output() changeFavorite: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private bdbPlatforms: BdbPlatformsProvider,
    private bdbUtils: BdbUtilsProvider,
    private menuOptionsOpsProvider: MenuOptionsOpsProvider
  ) {
    this.item = this.fillEmptyModel();
  }

  buttons: Array<{ text, role?, handler }> = [];
  animateArrow = false;
  addColorToArrow = false;
  starStatus = false;

  private fillEmptyModel() {
    return {
      contraction: '',
      title: '',
      desc: [
        ``,
        ``
      ],
      product: {},
      withContextMenu: true,
      contextMenuList: [],
      isScheduled: false,
      avatarColor: '#fff',
      showLogo: false,
      details: [],
      isFavorite: undefined,
      logoPath: null,
      withFavorite: false
    };
  }

  itemClicked() {
    this.onItemClicked.emit();
  }

  getColor(index: number): string {
    return this.bdbUtils.getRandomColor(index);
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

  openInMobile() {
    const btns = this.item.contextMenuList.map((data: BdbMap) => {
      return {
        text: data.value,
        role: '',
        cssClass: !!data.color ? data.color : '',
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
      cssClass: '',
      handler: () => {
        // tslint:disable-next-line: no-use-before-declare
        actionSheet.dismiss();
        return false;
      }
    });
    const actionSheet = this.actionSheetCtrl.create({
      buttons: btns,
      cssClass: 'bill-action-sheet'
    });
    actionSheet.present();
    actionSheet.onDidDismiss((data: BdbMap) => {
      this.addColorToArrow = false;
      if (data) {
        this.onContextSelection.emit(data);
      }
    });
  }

  public clickStar(e) {
    this.changeFavorite.emit(e);
  }

  private showMenuOptions(htmlElement: HTMLElement): void {
    const options = this.item.contextMenuList.map(option => {
      return {
        label: option.value, value: option.key, action: (key) => this.onContextSelection.emit({key: key})
        , icon: option.icon, color: option.color, colorvariant: option.colorvariant, showIcon: option.showIcon
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

}


export interface BdbItemCardModel {
  title: string;
  desc?: Array<string>;
  details?: Array<BdbMap>;
  logoPath?: string;
  showLogo?: boolean;
  contraction?: string;
  avatarColor?: string;
  isScheduled?: boolean;
  isFavorite?: boolean;
  withContextMenu?: boolean;
  withFavorite?: boolean;
  contextMenuList?: Array<BdbMap>;
  product?: any;
  account?: any;
}


