import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TooltipOptions } from '../../app/models/tooltip-options';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { TooltipOpsProvider } from '../../providers/tooltip-ops/tooltip-ops';

// TODO: Chage this component with pulse-tooltip-info
@Component({
  selector: 'tooltip-fiduciary',
  templateUrl: 'tooltip-fiduciary.html'
})
export class TooltipFiduciaryComponent implements OnInit, OnDestroy {

  @Input() icon: string;
  @Input() enabledToolTip = false;
  @Input() balanceDetail: any = [];
  @ViewChild('toolElement') toolElement: { nativeElement: any; };

  imgIcon: any;
  textFiduciary: any;
  showedToolTip: boolean;
  showedTooltipBounce: boolean;
  showToolTip: boolean;
  toolTipId: string;

  constructor(
    private toolTipOps: TooltipOpsProvider,
    private bdbInMemory: BdbInMemoryProvider
  ) {
    this.toolTipId = 'currencyTooltip';
    this.showedToolTip = false;
    this.showedTooltipBounce = false;
    if (this.bdbInMemory.getItemByKey(InMemoryKeys.textFiduciary)) {
      this.textFiduciary = this.bdbInMemory.getItemByKey(
        InMemoryKeys.textFiduciary
      );
    } else {
      this.showToolTip = false;
    }
  }

  ngOnInit() {
    this.imgIcon = this.icon;
    this.showToolTip = this.enabledToolTip;
  }

  ngOnDestroy() {
    this.toolTipOps.removeAllTooltip();
  }

  private getOptionsToolTip(e: HTMLElement): TooltipOptions {
    let title = '';
    let descript = '';
    switch (this.balanceDetail.type) {
      case 0:
        title = this.textFiduciary.monthlyYieldToolTip.title;
        descript = this.textFiduciary.monthlyYieldToolTip.subTitle;
        break;
      case 3:
        title = this.textFiduciary.dateYieldTooltip.title;
        descript = this.textFiduciary.dateYieldTooltip.subTitle;
        break;
      default:
        title = this.textFiduciary.yearlyYieldToolTip.title;
        descript = this.textFiduciary.yearlyYieldToolTip.subTitle;
        break;
    }
    const options: TooltipOptions = {
      id: this.toolTipId,
      objectdesthtml: e,
      color: 'carbon',
      tiptitle: title,
      description: descript,
      elevation: 4,
      colorvariant: '900',
      position: 'top-middle',
      mobileView: true,
      size: 's',
    };
    return options;
  }
  private validateActiveToolTip(): void {
    if (this.toolTipOps.getActiveTooltips().length > 0) {
      this.toolTipOps.removeTooltip(this.toolTipId);
    }
  }
  public showToolTipFiduciary(e: HTMLElement): void {
    this.validateActiveToolTip();
    if (this.showedToolTip) {
      this.toolTipOps.removeTooltip(this.toolTipId);
      this.showedToolTip = false;
    } else {
      if (!this.showedTooltipBounce) {
        this.showedTooltipBounce = true;
        this.toolTipOps.presentToolTip(this.getOptionsToolTip(e))
        .subscribe((id) => {
          this.toolTipOps.assignElements(id);
          this.showedToolTip = true;
          this.showedTooltipBounce = false;
        });
      }
    }
  }

}
