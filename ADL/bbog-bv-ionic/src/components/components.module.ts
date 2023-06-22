import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { WebProgressBarComponent } from './web-progress-bar/web-progress-bar';
import { WebProgressBarNewComponent } from './web-progress-bar-new/web-progress-bar-new';
import { SingleProductCardComponent } from './products/single-product-card/single-product-card';
import { TextMaskModule } from 'angular2-text-mask';
import { PaymentNavigationHeaderComponent } from './payment-navigation-header/payment-navigation-header';
import { AbandonPaymentComponent } from './abandon-payment/abandon-payment';
import { DetailCardButtonComponent } from './detail-card-button/detail-card-button';
import { AddNewServiceBtnComponent } from './add-new-service-btn/add-new-service-btn';
import { DbdNumberFormatterDirective } from '../directives/number-format';
import { AutocompleteBanksV1Component } from './autocomplete-banks-v1/autocomplete-banks-v1';
import { BdbGenericInputComponent } from './bdb-generic-input/bdb-generic-input';
import { ProductAliasComponent } from './product-alias/product-alias';
import { BdbOptionListComponent } from './bdb-option-list/bdb-option-list';
import { BdbSubmenuHeaderComponent } from './bdb-submenu-header/bdb-submenu-header';
import { BdbCardCheckComponent } from './bdb-card-check/bdb-card-check';
import { BdbBackSubmenuComponent } from './bdb-back-submenu/bdb-back-submenu';
import { BdbListSubmenuComponent } from './bdb-list-submenu/bdb-list-submenu';
import { BdbDropdownComponent } from './bdb-dropdown/bdb-dropdown';
import { BdbButtonComponent } from './bdb-button/bdb-button';
import { BdbCurrencyInputComponent } from './bdb-inputs/bdb-currency-input/bdb-currency-input';
import { BdbPhoneInputComponent } from './bdb-inputs//bdb-phone-input/bdb-phone-input';
import { BdbFormFactorComponent } from './bdb-form-factor/bdb-form-factor';
import { BdbUserLastConnectComponent } from './bdb-last-connect/bdb-last-connect';
import { SecondMethodComponent } from './second-method/second-method';
import { BdbShortcutCardComponent } from './bdb-shortcut-card/bdb-shortcut-card';
import { BdbAvatarComponent } from './bdb-avatar/bdb-avatar';
import { ShortcutCardOverlayComponent } from './shortcut-card-overlay/shortcut-card-overlay';
import { SecondMethodItemComponent } from './second-method-item/second-method-item';
import { BdbRadioButtonComponent, BdbRadioButtonRefDirective } from './core/atoms/bdb-radio-button';
import { BdbItemCardComponent } from './bdb-item-card/bdb-item-card';
import { ModalTokenHeaderComponent } from './modal-token-header/modal-token-header';
import { ItemListHeaderComponent } from './item-list-header/item-list-header';
import { BdbSummaryComponent, MobileSummaryBodyComponent, MobileSummaryHeaderComponent } from './mobile-summary';
import { ConfirmationDetailComponent, ConfirmationHeaderComponent, ConfirmationSubHeaderComponent } from './confirmation-modal';
import { HeaderProfileComponent, HeaderSesionComponent } from './header';
import { HeaderImgComponent } from './header/header-img/header-img';
import { BdbLimitItemComponent } from './bdb-limit-item/bdb-limit-item';
import { BdbContextMenuComponent } from './bdb-context-menu/bdb-context-menu';
import { RegistryIdentityComponent } from './secure-pass/registry-identity/registry-identity';
import { ProductInfoComponent } from './secure-pass/product-info/product-info';
import { SecurePasswordComponent } from './secure-pass/secure-password/secure-password';
import { DirectivesModule } from '../directives/directives.module';
import { BdbCsMainCardComponent, BdbCsMosaicComponent, CrossSellComponent } from './cross-sell';
import { SuccessSpComponent } from './secure-pass/success-sp/success-sp';
import { BdbArrowAnimateComponent } from './bdb-arrow-animate/bdb-arrow-animate';
import { BdbStarComponent } from './core/atoms/bdb-star/bdb-star';
import { BdbCardNotificationNewComponent } from '../new-app/modules/dashboard/components/bdb-card-notification/bdb-card-notification';
import { BdbCardNotificationComponent } from './bdb-card-notification/bdb-card-notification';
import { BdbCardNotificationFiduciaryComponent } from './bdb-card-notification-fiduciary/bdb-card-notification-fiduciary';
import { BdbAutocompleteComponent } from './core/atoms/bdb-autocomplete/bdb-autocomplete';
import { BdbDetailProductCardComponent } from './bdb-detail-product-card/bdb-detail-product-card';
import { ProductCardLoaderComponent } from './products/product-card-loader/product-card-loader';
import { BdbLoaderComponent } from './core/atoms/bdb-loader/bdb-loader';
import { BdbShortcutCardLoadComponent } from './bdb-shortcut-card-load/bdb-shortcut-card-load';
import { VoucherInfoComponent } from './voucher-info/voucher-info';
import { VoucherSendEmailComponent } from './voucher-send-email/voucher-send-email';
import { BdbAccountDetailComponent } from './bdb-account-detail/bdb-account-detail';
import { BdbTabsComponent } from './bdb-tabs/bdb-tabs';
import { BdbNavOptionsComponent, IconNavDecoDirective } from './bdb-nav-options/bdb-nav-options';
import { BdbItemCardV2Component } from './bdb-item-card-v2/bdb-item-card-v2';
import { BdbGenericScheduleCardComponent } from './bdb-generic-schedule-card/bdb-generic-schedule-card';
import { BdbItemCardSimplifiedComponent } from './bdb-item-card-simplified/bdb-item-card-simplified';
import { SvgBackComponent } from './svg-back/svg-back';
import { SvgLogoutComponent } from './svg-logout/svg-logout';
import { CancelIconComponent } from './cancel-icon/cancel-icon';
import { SvgAbandonComponent } from './svg-abandon/svg-abandon';
import { BdbCsApprovedCardComponent } from './bdb-cs-approved-card/bdb-cs-approved-card';
import { SvgIconArrowComponent } from './svg-icon-arrow/svg-icon-arrow';
import { TuPlusCardComponent } from './tu-plus-card/tu-plus-card';
import { AvalCardComponent } from './aval-card/aval-card';
import { PersonDataComponent } from './person-data/person-data';
import { BdbGenericTableComponent } from './bdb-generic-table/bdb-generic-table';
import { BdbTitleGenericTableComponent } from './bdb-title-generic-table/bdb-title-generic-table';
import { DefaultViewMenuComponent } from './default-view-menu/default-view-menu';
import { BdbBlueMessageComponent } from './bdb-blue-message/bdb-blue-message';
import { BdbGaugeComponent } from './bdb-gauge/bdb-gauge';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ValidateOtpComponent } from './token-otp/validate-otp/validate-otp';
import { ValidateTokenComponent } from './token-otp/validate-token/validate-token';
import { PocketEmptyStateComponent } from '../new-app/root/products/pockets/components/pocket-empty-state/pocket-empty-state';
import { TooltipFiduciaryComponent } from './tooltip-fiduciary/tooltip-fiduciary';
import { NewPipesModule } from '@app/shared/pipes/new-pipes.module';
import { NewDirectivesModule } from '@app/shared/directives/new-directives.module';

@NgModule({
  declarations: [
    HeaderProfileComponent,
    HeaderSesionComponent,
    WebProgressBarComponent,
    WebProgressBarNewComponent,
    SingleProductCardComponent,
    PaymentNavigationHeaderComponent,
    AbandonPaymentComponent,
    DetailCardButtonComponent,
    AddNewServiceBtnComponent,
    DbdNumberFormatterDirective,
    AutocompleteBanksV1Component,
    BdbGenericInputComponent,
    ProductAliasComponent,
    BdbOptionListComponent,
    BdbSubmenuHeaderComponent,
    BdbCardCheckComponent,
    BdbBackSubmenuComponent,
    BdbListSubmenuComponent,
    BdbDropdownComponent,
    BdbButtonComponent,
    BdbCurrencyInputComponent,
    BdbPhoneInputComponent,
    BdbFormFactorComponent,
    BdbUserLastConnectComponent,
    SecondMethodComponent,
    BdbShortcutCardComponent,
    BdbAvatarComponent,
    ShortcutCardOverlayComponent,
    SecondMethodItemComponent,
    BdbRadioButtonComponent,
    BdbRadioButtonRefDirective,
    BdbItemCardComponent,
    ModalTokenHeaderComponent,
    ItemListHeaderComponent,
    ConfirmationHeaderComponent,
    ConfirmationSubHeaderComponent,
    ConfirmationDetailComponent,
    BdbSummaryComponent,
    MobileSummaryHeaderComponent,
    MobileSummaryBodyComponent,
    BdbLimitItemComponent,
    HeaderImgComponent,
    BdbContextMenuComponent,
    RegistryIdentityComponent,
    ProductInfoComponent,
    SecurePasswordComponent,
    CrossSellComponent,
    BdbCsMainCardComponent,
    BdbCsMosaicComponent,
    SuccessSpComponent,
    BdbArrowAnimateComponent,
    BdbStarComponent,
    BdbCardNotificationComponent,
    BdbCardNotificationFiduciaryComponent,
    BdbCardNotificationNewComponent,
    BdbAutocompleteComponent,
    BdbDetailProductCardComponent,
    BdbAutocompleteComponent,
    BdbShortcutCardLoadComponent,
    VoucherInfoComponent,
    VoucherSendEmailComponent,
    ProductCardLoaderComponent,
    BdbLoaderComponent,
    BdbShortcutCardLoadComponent,
    BdbAccountDetailComponent,
    BdbTabsComponent,
    BdbItemCardV2Component,
    BdbNavOptionsComponent,
    BdbGenericScheduleCardComponent,
    BdbItemCardSimplifiedComponent,
    SvgBackComponent,
    SvgLogoutComponent,
    CancelIconComponent,
    IconNavDecoDirective,
    SvgAbandonComponent,
    BdbCsApprovedCardComponent,
    SvgIconArrowComponent,
    TuPlusCardComponent,
    AvalCardComponent,
    PersonDataComponent,
    BdbGenericTableComponent,
    BdbTitleGenericTableComponent,
    DefaultViewMenuComponent,
    BdbBlueMessageComponent,
    BdbGaugeComponent,
    ValidateOtpComponent,
    ValidateTokenComponent,
    PocketEmptyStateComponent,
    TooltipFiduciaryComponent

  ],
    imports: [
        IonicModule,
        TextMaskModule,
        DirectivesModule,
        NgCircleProgressModule.forRoot(),
        NewPipesModule,
        NewDirectivesModule
    ],
  exports: [
    HeaderProfileComponent,
    HeaderSesionComponent,
    WebProgressBarComponent,
    WebProgressBarNewComponent,
    SingleProductCardComponent,
    TextMaskModule,
    PaymentNavigationHeaderComponent,
    AbandonPaymentComponent,
    DetailCardButtonComponent,
    AddNewServiceBtnComponent,
    AutocompleteBanksV1Component,
    BdbGenericInputComponent,
    ProductAliasComponent,
    BdbOptionListComponent,
    BdbSubmenuHeaderComponent,
    BdbCardCheckComponent,
    BdbBackSubmenuComponent,
    BdbListSubmenuComponent,
    BdbDropdownComponent,
    BdbButtonComponent,
    BdbCurrencyInputComponent,
    BdbPhoneInputComponent,
    BdbFormFactorComponent,
    BdbUserLastConnectComponent,
    SecondMethodComponent,
    BdbShortcutCardComponent,
    BdbAvatarComponent,
    ShortcutCardOverlayComponent,
    SecondMethodItemComponent,
    BdbRadioButtonComponent,
    BdbRadioButtonRefDirective,
    BdbItemCardComponent,
    ModalTokenHeaderComponent,
    ItemListHeaderComponent,
    ConfirmationHeaderComponent,
    ConfirmationSubHeaderComponent,
    ConfirmationDetailComponent,
    BdbSummaryComponent,
    MobileSummaryHeaderComponent,
    MobileSummaryBodyComponent,
    HeaderImgComponent,
    BdbLimitItemComponent,
    BdbContextMenuComponent,
    RegistryIdentityComponent,
    ProductInfoComponent,
    SecurePasswordComponent,
    CrossSellComponent,
    BdbCsMainCardComponent,
    BdbCsMosaicComponent,
    SuccessSpComponent,
    BdbArrowAnimateComponent,
    BdbStarComponent,
    BdbCardNotificationComponent,
    BdbCardNotificationFiduciaryComponent,
    BdbCardNotificationNewComponent,
    BdbAutocompleteComponent,
    BdbDetailProductCardComponent,
    BdbShortcutCardLoadComponent,
    VoucherInfoComponent,
    VoucherSendEmailComponent,
    ProductCardLoaderComponent,
    BdbLoaderComponent,
    BdbShortcutCardLoadComponent,
    BdbAccountDetailComponent,
    BdbTabsComponent,
    BdbItemCardV2Component,
    BdbNavOptionsComponent,
    BdbGenericScheduleCardComponent,
    BdbItemCardSimplifiedComponent,
    SvgBackComponent,
    SvgLogoutComponent,
    CancelIconComponent,
    IconNavDecoDirective,
    SvgAbandonComponent,
    BdbCsApprovedCardComponent,
    SvgIconArrowComponent,
    TuPlusCardComponent,
    AvalCardComponent,
    PersonDataComponent,
    BdbGenericTableComponent,
    BdbTitleGenericTableComponent,
    DefaultViewMenuComponent,
    BdbBlueMessageComponent,
    BdbGaugeComponent,
    ValidateOtpComponent,
    ValidateTokenComponent,
    PocketEmptyStateComponent,
    TooltipFiduciaryComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ValidateOtpComponent,
    ValidateTokenComponent
  ]
})

export class ComponentsModule {
}
