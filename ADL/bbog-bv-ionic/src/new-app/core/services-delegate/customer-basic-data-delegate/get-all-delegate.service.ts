import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { CustomerBasicDataService } from '@app/apis/customer-basic-data/customer-basic-data.service';
import { CustomerInfo } from '../../../../providers/customer-management/customer-info';

@Injectable()
export class GetAllBasicDataDelegateService {

  constructor(
    private customerBasicDataService: CustomerBasicDataService
  ) {}

  public getAllBasicDataDelegate(): Observable<CustomerInfo> {
    return this.customerBasicDataService.getAll()
    .pipe(
      map(basicData => {
        const customerInfo = new CustomerInfo();
        customerInfo.nationality = basicData.nationality;
        customerInfo.maritalStatus = basicData.maritalStatus;
        customerInfo.levelEducation = basicData.educationalLevel;
        customerInfo.countryBirth = basicData.countryBirth;
        customerInfo.departmentBirth = basicData.departmentBirth;
        customerInfo.cityBirth = basicData.cityBirth;
        customerInfo.occupation = basicData.occupation;
        customerInfo.sector = basicData.economicSector;
        customerInfo.economicActivity = basicData.economicActivity;
        customerInfo.typeHousing = basicData.dwellingType;
        customerInfo.deliveryMethod = basicData.deliveryDestination;
        if (!!basicData.addresses && basicData.addresses.length > 0) {
          const mainAdress = basicData.addresses[0];
          const secondaryAdress = basicData.addresses.find(address => !address.addressType && !!address.cityLocation);
          if (!!mainAdress) {
            customerInfo.addressCode = mainAdress.address2;
            customerInfo.addressType = mainAdress.addressType;
            const [
              wayType1,
              number1,
              wayType2,
              number2,
              ,
              propertyType2,
              number4,
              propertyType1,
              number3,
              ,
              country,
              department,
              cityId,
              neighborhood
            ] = mainAdress.address1.split(';');
            customerInfo.wayType1 = wayType1;
            customerInfo.number1 = number1;
            customerInfo.wayType2 = wayType2;
            customerInfo.number2 = number2;
            customerInfo.propertyType1 = propertyType1;
            customerInfo.number3 = number3;
            customerInfo.propertyType2 = propertyType2;
            customerInfo.number4 = number4;
            customerInfo.neighborhood = neighborhood;
            customerInfo.country = country;
            customerInfo.department = department;
            customerInfo.cityId = cityId;
          }
          if (!!secondaryAdress) {
            customerInfo.city = secondaryAdress.cityLocation;
          }
        }
        if (!!basicData.phones && basicData.phones.length > 0) {
          const phone = basicData.phones.find(phoneP => phoneP.phoneType !== '12');
          const cellular = basicData.phones.find(phoneP => phoneP.phoneType === '12');
          if (!!phone) {
            customerInfo.typePhone = phone.phoneType;
            customerInfo.phone = phone.phone;
            customerInfo.extension = phone.phoneExtension;
            customerInfo.indicative = phone.phoneIndicative;
          }
          if (!!cellular) {
            customerInfo.cellularType = '12';
            customerInfo.cellular = cellular.phone;
          }
        }
        if (!!basicData.personaEmailAddr) {
          customerInfo.typeMail = '31';
          customerInfo.email = basicData.personaEmailAddr;
        }
        return customerInfo;
      })
    );
  }
}
