import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CardSecurityListRs, CardSecurity } from '../../app/models/card-security/card-security-list-rs';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import * as securityLevel from './security-level.json';
import * as typeOfNovelty from './type-of-novelty.json';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { SummaryHeader, MobileSummaryProvider } from '../../components/mobile-summary';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { CardsSecurtiyRq } from '../../app/models/card-security/cards-securtiy-rq';
import { IdType } from '../../providers/bdb-utils/id-type.enum';
import { EncryptionIdType } from '../../providers/bdb-utils/encryption-id.enum';

@Injectable()
export class CardSecurityProvider {

  constructor(
    public http: HttpClient,
    private bdbUtils: BdbUtilsProvider,
    public bdbHttpClient: BdbHttpClient,
    private mobileSummary: MobileSummaryProvider
  ) {
  }

  getListCards(): Observable<CardSecurityListRs> {
    const customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.FULL);
    const rq = {
      customer
    };
    return this.bdbHttpClient.post<CardSecurityListRs>('cards', rq);
  }

  cardsSecurtiy(cardsSecurtiyRq: CardsSecurtiyRq): Observable<ModalRs> {
    return this.bdbHttpClient.post<ModalRs>('cards/security', cardsSecurtiyRq);
  }

  getSecurityLevel(): Array<BdbMap> {
    return JSON.parse(JSON.stringify(securityLevel));
  }

  getTypeOfNovelty(): Array<BdbMap> {
    return JSON.parse(JSON.stringify(typeOfNovelty));
  }

  setUpMobileSummary(item: CardSecurity) {
    const header: SummaryHeader = new SummaryHeader();
    header.title = item.nameCard;
    header.logoPath = BdbConstants.BBOG_LOGO_WHITE;
    header.hasContraction = false;
    header.details = [`No. ${item.displayNumber}`];
    this.mobileSummary.setHeader(header);
    this.mobileSummary.setBody(null);
  }

  filterTypeOfNovelty(secLevel) {
    return (e) => {

      if (secLevel === '0_1_PSJCardSecLev1') {
        return e.key === '1_0_PSJKindNoveltySecLev1';
      }

      return e.key === '1_2_PSJKindNoveltySecLev3';
    };
  }

}
