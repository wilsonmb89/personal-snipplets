import { Component, Input, OnInit } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { CDTService } from '../../services/cdt.service';
import { FunnelEventsProvider } from '../../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../../providers/funnel-keys/funnel-keys';
import { ProductsFacade } from '../../../../shared/store/products/facades/products.facade';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

@Component({
  selector: 'bdb-cdt-renovation-card',
  templateUrl: 'bdb-cdt-renovation-card.component.html'
})
export class BdbCdtRenovationCardComponent implements OnInit {

  @Input() cdtNumber;
  cdt$: Observable<any>;
  cdtCardContent$: Observable<string>;
  cdtCardtitle$: Observable<string>;
  toggleIsActive$: Observable<boolean>;
  toggleIsEnabled$: Observable<boolean>;

  private _cdtRenewal = this.funnelKeysProvider.getKeys().cdtRenewal;

  constructor(
    private cdtService: CDTService,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEvent: FunnelEventsProvider,
    private productFacade: ProductsFacade,
  ) { }

  ngOnInit() {
    this.cdt$ = this.productFacade.getDigitalCdtById$(this.cdtNumber);
    this.cdtCardtitle$ = this.cdt$.pipe().map(cdt => this.cdtService.getCDTCardTitleData(cdt));
    this.cdtCardContent$ = this.cdt$.pipe().map(cdt => this.cdtService.getCDTCardContent(cdt));
    this.toggleIsActive$ = this.cdt$.pipe().map(cdt => this.cdtService.getCDTCardToggleIsActive(cdt));
    this.toggleIsEnabled$ = this.cdt$.pipe().map(cdt => this.cdtService.getCDTCardToggleIsEnabled(cdt));
  }

  toggleRenovation(): void {
    this.funnelEvent.callFunnel(this._cdtRenewal, this._cdtRenewal.steps.renwCdt);
    this.cdt$
      .pipe(take(1))
      .subscribe(
        cdt => this.productFacade.setDigitalCDTRenewal(this.cdtService.getRequestBody(cdt))
      );
  }
}
