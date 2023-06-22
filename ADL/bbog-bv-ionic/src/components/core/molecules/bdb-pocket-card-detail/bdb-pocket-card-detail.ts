import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { BdbPocketCardDetailModel, PocketCardButton } from './bdb-pocket-card-detail.model';
import { expandGauge } from '../../utils/animations/transitions';
import { Content, NavController } from 'ionic-angular';
import { BdbMaskProvider, MaskType } from '../../../../providers/bdb-mask';

@Component({
  selector: 'bdb-pocket-card-detail',
  templateUrl: 'bdb-pocket-card-detail.html',
  animations: [expandGauge]
})
export class BdbPocketCardDetail implements OnInit, OnDestroy {
  @Input() contentMain: Content;
  @Input() shirinkEffect = false;
  @Input() showLoader = false;
  @Input() cardData: BdbPocketCardDetailModel;
  @Output() onReload = new EventEmitter();
  @Output() shrinkStatusChange = new EventEmitter();

  start = 0;
  end: number;


  lastScroll; number;
  activeScrollAnim = false;
  isScrollContraction = false;
  lastWheelDirection = 'up';

  constructor(
    public navCtrl: NavController,
    public bdbMask: BdbMaskProvider
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    window.addEventListener('wheel', this.wheel, true);
  }

  ngOnDestroy() {
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

  wheel = (e): void => {
    if (e.deltaY < 0 && this.lastWheelDirection === 'up' && this.isScrollContraction && !this.activeScrollAnim && this.lastScroll < 30) {
      this.isScrollContraction = false;
    }

    if (e.deltaY < -4) {
      this.lastWheelDirection = 'down';
    } else {
      this.lastWheelDirection = 'up';
    }
  }

  animScrollStart(e) {
    this.activeScrollAnim = true;
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

  onButtonClick(b: PocketCardButton) {
    b.action(this.navCtrl);
  }

  getFormatBalance() {
    return this.buildPocketHtmlDecimal(this.cardData.pocketBalance);
  }

  getFormatGoal() {
    return this.buildPocketHtmlDecimal(this.cardData.pocketGoal);
  }

  buildPocketHtmlDecimal(value) {
    const amount = this.bdbMask.maskFormatFactory(value, MaskType.CUSTOM_CURRENCY);
    return `
      ${amount.substring(0, amount.indexOf('.'))}<sup>${amount.substring(amount.indexOf('.'), amount.length)}</sup>
    `;
  }

}
