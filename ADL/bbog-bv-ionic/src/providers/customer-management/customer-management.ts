import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../../app/models/bdb-generics/customer';
import { CustomerInfo } from './customer-info';
import { Observable } from 'rxjs/Observable';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbMap } from 'app/models/bdb-generics/bdb-map';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CustomerManagementProvider {

  constructor(
    public bdbHttpClient: BdbHttpClient,
    private bdbUtils: BdbUtilsProvider,
    private bdbRsa: BdbRsaProvider,
    private bdbInMemory: BdbInMemoryProvider
  ) {
  }

  updateCustomerInfo(customerInfo: CustomerInfo): Observable<any> {
    const rq = {
      customer: this.bdbUtils.getCustomer(),
      modCustomer: customerInfo
    };
    return this.bdbHttpClient.post<any>('ath/customer/mod', rq)
    .pipe(
      tap(
        () => {
          this.bdbInMemory.clearItem(InMemoryKeys.CustomerInfo);
          this.getCustomerInfo().subscribe(
            (data: CustomerInfo) => {
              this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerInfo, data);
            }
          );
        }
      ),
      catchError(err => of(err))
    );
  }

  getCustomerInfo(): Observable<CustomerInfo> {

    const data = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerInfo);

    if (!!data) {
      return of(data);
    }

    const customer = this.bdbUtils.getCustomer();
    const rq = {
      customer
    };
    return this.bdbHttpClient.post<CustomerInfo>('ath/customer/inquiry', rq);
  }

  getSectors(): Observable<Array<BdbMap>> {
    return this.bdbHttpClient.get<Array<BdbMap>>('masterdata/sectors', {}).map(
      e => {
        return this.mMap(e);
      }
    );
  }

  getEconomicActivitiesBySector(sectorCode: string): Observable<Array<BdbMap>> {
    const encrypted = this.bdbRsa.encrypt(sectorCode);
    return this.bdbHttpClient.post<Array<BdbMap>>('masterdata/economicact', encrypted).map(
      e => {
        return this.mMap(e);
      }
    );
  }

  getCountries(): Observable<Array<BdbMap>> {
    return this.bdbHttpClient.get<Array<BdbMap>>('masterdata/countries', {}).map(
      e => {
        return this.mMap(e);
      }
    );
  }

  getDepartments(): Observable<Array<BdbMap>> {
    return this.bdbHttpClient.get<Array<BdbMap>>('masterdata/departments', {}).map(
      e => {
        return this.mMap(e);
      }
    );
  }

  getCitiesByDepartment(dpCode: string): Observable<Array<BdbMap>> {
    const encrypted = this.bdbRsa.encrypt(dpCode);
    return this.bdbHttpClient.post<Array<BdbMap>>('masterdata/cities', encrypted).map(
      e => {
        return this.mMap(e);
      }
    );
  }

  mMap(e) {
    return e.map(
      f => {
        return {
          key: f.cod,
          value: f.value
        };
      }
    );
  }
}
