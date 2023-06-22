import { Injectable } from '@angular/core';
import { BankInfo } from '../../app/models/bank-info';
import { AccountBalance } from '../../app/models/enrolled-transfer/account-balance';
import { AcctEnrollRq } from '../../app/models/transfers/acct-enroll-rq';
import { CustId } from '../../app/models/transfers/cust-id';
import { EnrollHolderInfo } from '../../app/models/transfers/enroll-holder-info';
import { EnrollProduct } from '../../app/models/transfers/subscribe-acct';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { PaymentsProvider } from '../payments/payments';
import { TransactionsProvider } from '../transactions/transactions';

@Injectable()
export class EnrollProvider {

  constructor(
    private payments: PaymentsProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbModal: BdbModalProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private transactionsProvider: TransactionsProvider,
    private bdbRsa: BdbRsaProvider
  ) { }

  /**
 * this method build a request object for enroll , delete or modify account
 * @param opType string 'A' for inscription, 'R' for Remove, 'M' for Modify
 * @returns @class AcctEnrollRq object
 */
  buildEnrollRq(account: AccountBalance, opType: string): AcctEnrollRq {
    const acctEnrollRq: AcctEnrollRq = new AcctEnrollRq();
    acctEnrollRq.customer = this.bdbUtils.getCustomer();
    const acctInfo: EnrollHolderInfo = {
      typeId: account.customer.identificationType,
      participantId: account.customer.identificationNumber,
      personName: account.customer.name,
      custId: new CustId(account.customer.identificationType)
    };
    const manageInfo: EnrollProduct = new EnrollProduct();
    manageInfo.acctHolderInfo = acctInfo;
    manageInfo.acctName = account.productAlias;
    manageInfo.acctSubType = account.productSubType;
    manageInfo.acctType = account.productType;
    manageInfo.bankInfo = new BankInfo(account.bankId, account.productBank);
    manageInfo.productId = account.productNumber;
    acctEnrollRq.acctInfo = manageInfo;
    acctEnrollRq.operationType = this.bdbRsa.encrypt(opType);
    return acctEnrollRq;
  }
}
