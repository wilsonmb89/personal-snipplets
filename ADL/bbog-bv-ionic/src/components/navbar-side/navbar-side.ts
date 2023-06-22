import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { BdbAppVersionService } from '@app/shared/utils/bdb-app-version-service/bdb-app-version.service';
import { App, Events, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { expandCol } from '../../components/core/utils/animations/transitions';
import { TooltipOptions } from '../../app/models/tooltip-options';
import { TooltipOpsProvider } from '../../providers/tooltip-ops/tooltip-ops';
import { Subscription } from 'rxjs/Subscription';
import { CreditCardFacade } from '@app/shared/store/products/facades/credit-card.facade';

@Component({
    selector: 'navbar-side',
    templateUrl: 'navbar-side.html',
    animations: [expandCol]

})
export class NavbarSideComponent implements OnInit, AfterViewInit {

    @Input() itemsMenu = [];
    @Input() shrink = false;
    @Output() menuClicked = new EventEmitter();

    @ViewChildren('itemConf') public itemConf: QueryList<ElementRef>;
    private tooltipKeyIp = 'keyTooltip';


    appVersion$: Observable<string>;

    private tooltipKeySubscription: Subscription;
    private tooltipOptSubscription: Subscription;
    private itemConfSubscription: Subscription;
    showTooltipKey: boolean;

    constructor(
        public navCtrl: NavController,
        public appCtrl: App,
        public events: Events,
        private appVersionService: BdbAppVersionService,
        private creditCardFacade: CreditCardFacade,
        private tooltipOps: TooltipOpsProvider,
    ) {
        this.appVersion$ = this.appVersionService.appVersion$;
    }

    ngOnInit() {
        this.tooltipKeySubscription = this.creditCardFacade.creditCardActivationState$
            .subscribe(res => this.showTooltipKey = res.remeberTooltipKey);
    }

    ngAfterViewInit() {
        this.itemConfSubscription = this.itemConf.changes.subscribe(
            chgs => {
                if (!this.shrink) {
                    const options: TooltipOptions = {
                        objectdesthtml: this.itemConf.last.nativeElement,
                        color: 'primary',
                        tiptitle: 'Recuerda',
                        description: 'Activa la clave de avances de tu Tarjeta Crédito para hacer retiros en cajeros.',
                        elevation: 4,
                        colorvariant: '400',
                        position: 'left-end',
                        id: this.tooltipKeyIp,
                        mobileView: false
                    };
                    if (this.showTooltipKey) {
                        setTimeout(() => {
                            this.remeberKeyTooltip(options);
                            this.creditCardFacade.rememberKeyTooltipHidden();
                            this.tooltipOps.removeTooltip(this.tooltipKeyIp);
                        }, 250);
                    }
                }
            }
        );
    }

    public ionViewWillLeave(): void {
        if (this.itemConfSubscription) {
            this.itemConfSubscription.unsubscribe();
        }
        if (this.tooltipKeySubscription) {
            this.tooltipKeySubscription.unsubscribe();
        }
        if (this.tooltipOptSubscription) {
            this.tooltipOptSubscription.unsubscribe();
        }
    }

    navigate(itemMenu) {
        this.menuClicked.emit(itemMenu);
    }

    private remeberKeyTooltip(options: TooltipOptions): void {
        if (this.showTooltipKey) {
            this.tooltipOptSubscription = this.tooltipOps.presentToolTip(options).subscribe((id) => {
                this.tooltipOps.assignElements(id);
            });
        }
    }
}
