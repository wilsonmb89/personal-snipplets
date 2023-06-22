import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../../../../../providers/bdb-http-client/bdb-http-client';
import { BdbEventsConstants } from '../../../../../app/models/analytics-event/bdb-transactions-code';
import { ENV } from '@app/env';
import { RequestEvents } from '../../../../../app/models/analytics-event/request-event';
import { Observable } from 'rxjs/Observable';
import {
  PocketCreateRq,
  Pocket,
  PocketListRs,
  PocketTransferRq,
  PocketMovementRq,
  MovementsDetailRs,
  GetPocketsApiRq,
  DeletePocketApiRs,
  DeletePocketApiRq,
  ModifyPocketApiRq,
  ModifyPocketApiRs, PocketCreateRs
} from '../models/pocket';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbUtilsProvider } from '../../../../../providers/bdb-utils/bdb-utils';
import { ProductDetail } from '../../../../../app/models/products/product-model';
import { BdbConstants } from '../../../../../app/models/bdb-generics/bdb-constants';

import * as pocketTransactionsMock from './pocket-transactions-mock.json';
import * as pocketStatusMock from './pocket-status-mock.json';

@Injectable()
export class PocketOpsService {

  constructor(
    private bdbHttpClient: BdbHttpClient,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbUtils: BdbUtilsProvider
  ) { }

  public getPocketsByAccount(account: ProductDetail): Observable<Pocket[]> {

    const getPocketsRq: GetPocketsApiRq = {
      accountDetail: {
        acctId: account.productNumber,
        acctType: this.bdbUtils.mapTypeProduct(account.productType)
      }
    };

    return this.bdbHttpClient.post<PocketListRs>(
      'pockets/get', getPocketsRq,
      ENV.API_GATEWAY_ADL_URL, new RequestEvents(BdbEventsConstants.pockets.pocket_balance)).map(
        (e) => {
          const pockets: Pocket[] = e.pockets;
          pockets.map(j => {
            j.account = account;
            return j;
          });
          return pockets;
        }
      ).flatMap(
        (pockets: Pocket[]) => {
          const temp = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerPocketList);
          if (!!temp) {
            temp[`${account.productNumberApi}`] = pockets;
            this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerPocketList, temp);
          } else {
            this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerPocketList, {
              [`${account.productNumberApi}`]: pockets
            });
          }
          return Observable.of(pockets);
        });
  }

  public modifyPocket(modifyPocketApiRq: ModifyPocketApiRq): Observable<ModifyPocketApiRs> {
    return this.bdbHttpClient.post<ModifyPocketApiRs>(
      'pockets/modify', modifyPocketApiRq, ENV.API_GATEWAY_ADL_URL);
  }

  public createPocket(pocketRq: PocketCreateRq): Observable<PocketCreateRs> {
    return this.bdbHttpClient.post<PocketCreateRs>('pockets/create', pocketRq, ENV.API_GATEWAY_ADL_URL
    );
  }

  public delPocket(pocket: Pocket): Observable<DeletePocketApiRs> {
    const account: ProductDetail = pocket.account;
    const deletePocketApiRq: DeletePocketApiRq = {
      accountDetail: {
        acctId: account.productNumber,
        acctType: this.bdbUtils.mapTypeProduct(account.productType)
      },
      pocketDetail: {
        pocketName: pocket.pocketName,
        pocketType: pocket.pocketType,
        pocketId: pocket.pocketId.substring(pocket.pocketId.length - 4)
      }
    };

    return this.bdbHttpClient.post<any>(
      'pockets/delete', deletePocketApiRq, ENV.API_GATEWAY_ADL_URL
    );
  }

  public transferPocket(pocketTransferRq: PocketTransferRq) {

    return this.bdbHttpClient.post<any>('pockets/transfer', pocketTransferRq, ENV.API_GATEWAY_ADL_URL);
  }

  getTransactions(): Observable<any> {
    return Observable.of((pocketTransactionsMock as any).movementsDetailRs).delay(1000);
  }

  getMovements(pocketMovementRq: PocketMovementRq): Observable<any> {
    if (ENV.STAGE_NAME === 'dev') {
      return this.getTransactions();
    }

    return this.bdbHttpClient.post<any>('pockets/movements', pocketMovementRq, ENV.API_GATEWAY_ADL_URL)
      .map(
        (e) => {
          const pocketMovements: Array<MovementsDetailRs> = e.movementsDetailRs;
          return pocketMovements;
        }
      ).flatMap((data: Array<MovementsDetailRs>) => Observable.of(data));
  }

  getValues(): Observable<any> {
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketData, pocketStatusMock);
    return Observable.of(pocketStatusMock).delay(1000);
  }

}
