import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { BdbCardDetailModel, CardButton } from './bdb-card-detail.model';
import { expandRow } from '../../../../components/core/utils/animations/transitions';
import { Content, NavController } from 'ionic-angular';
import { TooltipOpsProvider } from '../../../../providers/tooltip-ops/tooltip-ops';
import { ENV } from '@app/env';
import { ImagesUrlFiduciary } from '../../../../app/models/fiducia/images-url.enum';
import {PulseModalControllerProvider} from '../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {ModalAccountClipboardComponent} from '@app/shared/components/modals/account-clipboard-modal/account-clipboard';
import {Observable} from 'rxjs/Observable';
import {BasicDataRs} from '@app/apis/customer-basic-data/models/getBasicData.model';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import { TooltipOptions } from 'app/models/tooltip-options';
import { take } from 'rxjs/operators';
// TODO: Replace button bv-button ion-button to pulse-button in html
@Component({
  selector: 'bdb-card-detail',
  templateUrl: 'bdb-card-detail.html',
  animations: [expandRow]
})
export class BdbCardDetail implements OnInit, OnDestroy {
  @Input() contentMain: Content;
  @Input() shirinkEffect = false;
  @Input() showLoader = false;
  @Input() cardData: BdbCardDetailModel;
  @Input() showPlusSymbol = false;
  @Input() showErrorFiduciary = false;
  @Input() showFiduciaryDetails = false;
  @Input() textFiduciary = {};
  @Input() lockCreditCard = false;
  @Input() showLockCard = false;
  @Input() disableLockButton = false;
  @Input() shareAccountInfo = false;
  @Input()
  set updateLayout(update: BdbCardDetailModel) {
    this.breakpointAssign(this.currentBreakPoint);
  }
  @Output() onReload = new EventEmitter();
  @Output() shrinkStatusChange = new EventEmitter();
  @Output() onReloadFiduciary = new EventEmitter();
  @Output() lockCardDetail = new EventEmitter();
  @ViewChild('toolElement') toolElement: { nativeElement: any; };
  @ViewChild('tooltip') tooltip;
  private tooltipSumOfDetails = 'Saldo total';
  private presentTooltips = true;

  activeScrollAnim = false;
  moreDetail = false;
  showMore = false;
  isScrollContraction = false;
  showButtonShare = false;
  distributionClass = 'col-md-4';
  private currentBreakPoint;
  start = 0;
  end: number;
  lastScroll; number;
  imgQuestion = ENV.FIDUCIARY_API_ASSETS + ImagesUrlFiduciary.QUESTION_TOOLTIP_WHITE;
  readonly UNFREEZE_BUTTON_TEXT = 'Descongelar';
  readonly FREEZE_BUTTON_TEXT = 'Congelar';

  customerBasicData: Observable<BasicDataRs> = this.userFacade.basicData$;

  constructor(
    public navCtrl: NavController,
    private toolTipOps: TooltipOpsProvider,
    private pulseModalCtrl: PulseModalControllerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private userFacade: UserFacade
  ) {  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.showButtonShareAccountInfo();
  }

  ngOnDestroy() {
    this.toolTipOps.removeAllTooltip();
    window.removeEventListener('scroll', this.scroll, true);
  }
  scroll = (e): void => {
    if (e.srcElement.scrollTop !== 0) {
      this.lastScroll = e.srcElement.scrollTop;
    }
    if (e.srcElement.scrollTop > 0 && !this.activeScrollAnim && this.shirinkEffect) {
      this.isScrollContraction = true;
    } else if (e.srcElement.scrollTop === 0 && !this.activeScrollAnim) {
      this.isScrollContraction = false;
    }
  }

  breakpointAssign(e) {
    this.currentBreakPoint = e;
    if (!!this.cardData && !!this.cardData.dataToShow) {
      const cols = this.cardData.cardOptions.columns;
      const numberOfData = this.cardData.dataToShow.length;
      this.loadPreconditionsFiduciary(this.cardData.dataToShow);
      if (!!cols) {
        const colNum = 12 / (cols + 1);
        this.distributionClass = `col-md-${colNum}`;
        this.end = numberOfData > cols ? cols - 1 : cols;
        this.showMore = numberOfData > cols;
      } else {
        if (numberOfData > 3) {
          this.distributionClass = `col-md-4 col-lg-3 `;
          this.end = (e === 'lg' || e === 'xs') ? 2 : 1;
          this.showMore = true;
        } else if (numberOfData <= 3) {
          const colNum = 12 / (numberOfData + 1);
          this.distributionClass = `col-md-${colNum}`;
          this.end = numberOfData;
          this.showMore = false;
        }
      }
    }
  }
  private loadPreconditionsFiduciary(dataToShow: any[]): void {
    dataToShow.forEach(item => {
      if (this.showLoader && item.priority > 2 && item.type !== 3) {
        item['enableLoader'] = true;
      } else {
        item['enableLoader'] = false;
      }
    });
  }
  animScrollStart(e) {
    this.activeScrollAnim = true;
    this.toolTipOps.removeAllTooltip();
  }

  animScrollEnd(e) {
    this.activeScrollAnim = false;
    this.shrinkStatusChange.emit(this.isScrollContraction);
    if (this.isScrollContraction && this.lastScroll < 15) {
      this.contentMain.scrollTo(0, this.lastScroll + 5, 300);
    }

  }

  onReloadClick() {
    this.onReload.emit();
  }
  public onReloadFiduciaryClick(): void {
    this.onReloadFiduciary.emit();
  }

  onButtonClick(b: CardButton) {
    this.toolTipOps.removeAllTooltip();
    b.action(this.navCtrl);
  }
  viewMore() {
    this.moreDetail = !this.moreDetail;
    this.toolTipOps.removeAllTooltip();
  }

  public lockCardDetailClick(): void {
    if (!this.disableLockButton) {
      this.lockCardDetail.emit();
    }
  }

  public async showShareAccountInfo(): Promise<void>  {
  const modal = await this.pulseModalCtrl.create({
      component: ModalAccountClipboardComponent,
      componentProps: { accountData: this.cardData },
      size: 'default',
    }, this.viewRef, this.resolver);
    await modal.present();
  }

  public showButtonShareAccountInfo() {
  this.customerBasicData.subscribe( r => {
   this.showButtonShare = !!r && !this.cardData.cardOptions.showError;
  });
  }

  private getTooltipPositions(width): { pmtooltip: string, cardtooltip: string } {
   if (width < 540) {
      return {
        pmtooltip: 'left-start',
        cardtooltip: 'top-end'
      };
    } else {
      return {
        pmtooltip: 'right-start',
        cardtooltip: 'right-start'
      }; 
    }
  }

  public cardTotalBalance (text:string): boolean {
   return text === this.tooltipSumOfDetails;   
  }

  public infoAdditionTooltip(): void { 
    const positionTooltip = this.getTooltipPositions(window.innerWidth);
    const options: TooltipOptions = {
      objectdesthtml: this.tooltip.nativeElement,
      color: 'primary',
      tiptitle: '',
      description: 'Es la suma de tu saldo disponible, en canje y alcancías.',
      elevation: 4,
      colorvariant: '400',
      position: positionTooltip.pmtooltip,
      id: 'Addtooltip'
    };
    if (this.presentTooltips) {
      this.toolTipOps.presentToolTip(options).pipe(take(1)).subscribe((id) => {
        this.toolTipOps.assignElements(id);
      });
    }
  }
}
