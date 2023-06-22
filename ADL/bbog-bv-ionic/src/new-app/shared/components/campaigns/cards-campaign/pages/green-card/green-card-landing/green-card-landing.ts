import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavigationProvider } from '../../../../../../../../providers/navigation/navigation';
import { InMemoryKeys } from '../../../../../../../../providers/storage/in-memory.keys';
import { BdbToastProvider } from '../../../../../../../../providers/bdb-toast/bdb-toast';
import { BdbInMemoryProvider } from '../../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { CustomerData } from '../../../../../../../../app/models/ldap/ldap.model';
import { CustomerInfo } from '../../../../../../../../providers/customer-management/customer-info';
import { ProductDetail } from '../../../../../../../../app/models/products/product-model';
import { MasterData } from '../../../../../../../../providers/customer-management/master-data';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { EnrollCustomCardRq } from '@app/apis/products/products/models/products';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { Observable } from 'rxjs/Observable';
import { CardsCampaignModalManagerProvider } from '@app/shared/components/campaigns/cards-campaign/services/cards-campaign-modal-manager.service';

@IonicPage()
@Component({
  selector: 'page-green-card-landing',
  templateUrl: 'green-card-landing.html',
})
export class GreenCardLandingPage implements OnInit {


  private readonly GREEN_CARD_EXTERNAL_URL = 'https://www.bancodebogota.com/tarjetaamazonia';

  tyc = false;
  basicUserInfo$: Observable<CustomerData>;
  updateUserInfo: CustomerInfo;
  productDetail: ProductDetail;
  address: string;
  addressBack: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private events: Events,
    private bdbStorageService: BdbStorageService,
    private bdbToast: BdbToastProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private userFacade: UserFacade,
    private modalManagerProvider: CardsCampaignModalManagerProvider,
  ) {
  }

  ngOnInit(): void {
    this.events.publish('srink', true);
    this.modalManagerProvider.initManager(this.viewRef, this.resolver, this.navCtrl);
    this.basicUserInfo$ = this.userFacade.basicData$;
    this.updateUserInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerInfo);
    this.productDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);

    const masterData = new MasterData();
    const wayTypeList = masterData.getWayTypeList();
    const propertyTypeList = masterData.getPropertyTypeList();

    const wayType1 = !!wayTypeList.some(e => e.key === this.updateUserInfo.wayType1) ?
      wayTypeList.find(e => e.key === this.updateUserInfo.wayType1).value : '';
    const propertyType1 = !!propertyTypeList.some(e => e.key === this.updateUserInfo.propertyType1) ?
      propertyTypeList.find(e => e.key === this.updateUserInfo.propertyType1).value : '';
    const propertyType2 = !!propertyTypeList.some(e => e.key === this.updateUserInfo.propertyType2) ?
      propertyTypeList.find(e => e.key === this.updateUserInfo.propertyType2).value : '';

    const addressBackArray = [
      this.updateUserInfo.wayType1,
      this.updateUserInfo.number1,
      this.updateUserInfo.wayType2,
      this.updateUserInfo.number2,
      '',
      this.updateUserInfo.propertyType2,
      this.updateUserInfo.number4,
      this.updateUserInfo.propertyType1,
      this.updateUserInfo.number3
    ];

    this.addressBack = addressBackArray.join(' ');
    this.address = `${wayType1} ${this.updateUserInfo.number1} # ${this.updateUserInfo.number2} ${propertyType1} ${this.updateUserInfo.number3} ${propertyType2} ${this.updateUserInfo.number4}, ${this.uppercase(this.updateUserInfo.city.toLowerCase())}`;
  }

  onBackPressed(): void {
    this.navigation.onBackPressed(this.navCtrl);
  }

  openModalTerms(): void {
    this.modalManagerProvider.showTYCCardModal('greenCard');
  }

  openModalEditAddress(): void {
    this.modalManagerProvider.showUpdateUserDataModal();
  }

  acceptTyC(isChecked: CustomEvent): void {
    this.tyc = isChecked.detail;
  }

  public goToEnrolling(): void {
    if (!this.tyc) {
      return;
    }

    this.enroll(
      this.addressBack,
      this.updateUserInfo.neighborhood,
      this.updateUserInfo.phone,
      this.productDetail.productNumber,
      this.productDetail.productDetailApi.productBankSubType,
      this.productDetail.productDetailApi.officeId,
      this.updateUserInfo.cityId,
      this.updateUserInfo.cellular
    );
  }


  private enroll(
    customerAddressNumber: string,
    customerAddressDistrict: string,
    customerPhoneNumber: string,
    customerAccountNumber: string,
    customerAccountSubtype: string,
    accountOfficeId: string,
    customerZipCode: string,
    customerCellPhone: string
  ): void {

    const request: EnrollCustomCardRq = {
      customerZipCode: customerZipCode,
      customerPhoneNumber: customerPhoneNumber,
      customerAccountNumber: customerAccountNumber,
      customerAccountSubtype: customerAccountSubtype,
      accountOfficeId: accountOfficeId,
      customerAddressNumber: customerAddressNumber,
      customerAddressDistrict: customerAddressDistrict,
      customerCellPhone: customerCellPhone,
      customCardSpecification: 'GREEN_CARD',
      customerAlternativePhoneNumber: customerPhoneNumber
    };


    this.bdbStorageService.setItemByKey(InMemoryKeys.EnrollCustomCardData, request);
    this.navCtrl.push('EnrollingPage', {data: 'greenCard'});
  }


  private uppercase(str: string): string {
    const array1 = str.split(' ');
    const newarray1 = [];

    for (let x = 0; x < array1.length; x++) {
      if (array1[x] === 'd.c.') {
        newarray1.push(array1[x].toUpperCase());
      } else {
        newarray1.push(array1[x].charAt(0).toUpperCase() + array1[x].slice(1));
      }
    }
    return newarray1.join(' ');
  }

  public openGreenCardExternalUrl(): void {
    window.open(this.GREEN_CARD_EXTERNAL_URL, '_blank');
  }
}
