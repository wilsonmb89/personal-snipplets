import { AditionalData, AuditData, PayloadEvent, GeneralData } from '../../app/models/analytics-event/analytics-rq';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { Injectable } from '@angular/core';
import { BdbTransactionsCode } from '../../app/models/analytics-event/bdb-transactions-code';
import { BdbUtilsProvider } from '../../providers/bdb-utils/bdb-utils';
import { BdbMaskProvider, MaskType } from '../../providers/bdb-mask';
import { Platform } from 'ionic-angular';
import * as forge from 'node-forge';

@Injectable()
export class EventMapperProvider {

    constructor(
      public bdbInMemory: BdbInMemoryProvider,
      private bdbUtils: BdbUtilsProvider,
      private bdbMask: BdbMaskProvider,
      public platform: Platform
    ) {}


    public mapper(result: boolean, transactionId: BdbTransactionsCode, aditionalInfo ?: Object []) {
      const auditData: AuditData = {
        application: 'BBOG-virtualbank',
        sessionId: this.bdbInMemory.getItemByCryptId(InMemoryKeys.IdCryptAnalytic),
        clientIdType: this.bdbUtils.mapIdType('ATH_API', this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationType)),
        clientId: this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber),
        advisorId: '',
        channel: this.platform.platforms().toString(),
        transactionId: this.bdbInMemory.getItemByKey(InMemoryKeys.AccessToken),
        requestId: transactionId.transactionId != null ? this.cutGenerate(transactionId.transactionId) : '',
        ipAddress: this.bdbInMemory.getItemByKey(InMemoryKeys.IP)
      };

      const source = {'userAgent': navigator.userAgent};
      const payload: GeneralData = {
        version: '3.0',
        eventCode: transactionId.eventCode,
        eventMnemonic: transactionId.eventMnemonic,
        eventName: transactionId.eventName,
        timestamp: this.bdbMask.maskFormatFactory(new Date(), MaskType.DATE_EVENT),
        result: result,
        details: aditionalInfo ? aditionalInfo : [],
        audit: auditData,
        source: source
      };
      return payload;
    }

    public cutGenerate(transactionId: string) {
      const transacIdAuth = transactionId ;
      const channelId = '20202';
      const filler = '0000';
      const applicationCode = 'PBL682';
      const randomHash = forge.util.bytesToHex(forge.random.getBytesSync(3)).slice(8).toUpperCase();
      const date = this.bdbMask.maskFormatFactory(new Date(), MaskType.DATE_CUT);
      return `${transacIdAuth}${channelId}${filler}${applicationCode}${date}${randomHash}`;
    }
}
