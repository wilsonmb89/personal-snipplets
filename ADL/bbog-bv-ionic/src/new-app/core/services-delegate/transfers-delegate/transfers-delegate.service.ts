import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { TransferInfo } from '../../../../app/models/transfers/transfer-info';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { DoTransferRq, DoTransferRs } from '@app/apis/transfer-account/models/doTrasfer.model';
import { TransferAccountService } from '@app/apis/transfer-account/transfer-account.service';
import { TransferCoreService } from '@app/apis/transfer/transfer-core/transfer-core.service';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TrustAgreementInfo } from '../../../../app/models/trust-agreement/trust-agreement-info';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { LoanTransferInfo } from '../../../../app/models/loan-transfer/loan-transfer-info';

@Injectable()
export class TransfersDelegateService {

  constructor(
    private bdbUtils: BdbUtilsProvider,
    private transferAccountService: TransferAccountService,
    private transferCoreService: TransferCoreService,
    private bdbStorageService: BdbStorageService
  ) {
  }

  public doTransfer(transferInfo: TransferInfo, retry: boolean): Observable<DoTransferRs> {
    const doTransferRq = {...this.buildRequest(transferInfo), forceTrx: retry};
    return this.transferAccountService.doTransfer(doTransferRq);
  }

  public useCredit({loan, account, amount}: LoanTransferInfo, forceTrx: boolean): Observable<DoTransferRs> {
    const transferInfo: DoTransferRq = {
      accFromType: loan.productDetailApi.productBankType,
      accFromSubType: loan.productDetailApi.productBankSubType,
      accFromId: loan.productDetailApi.productNumber,
      branchId: loan.productDetailApi.officeId,
      accToType: account.productDetailApi.productBankType,
      accToSubType: account.productDetailApi.productBankSubType,
      accToId: account.productDetailApi.productNumber,
      amount: +amount,
      bankIdAcctTo: BdbConstants.BBOG,
      forceTrx
    };
    return this.transferAccountService.useLoan(transferInfo);
  }

  public callFiduciaryOperations(trustAgreementInfo: TrustAgreementInfo, retry: boolean): Observable<DoTransferRs> {
    const doTransferRq = {...this.buildRequestInvestment(trustAgreementInfo), forceTrx: retry};
    if (trustAgreementInfo.operation === 'investment') {
      return this.transferAccountService.doInvestment(doTransferRq);
    } else {
      return this.transferAccountService.doDivestment(doTransferRq);
    }
  }


  private buildRequest(transferInfo: TransferInfo): DoTransferRq {
    const accToId = transferInfo.accountTo.owned ?
      transferInfo.accountTo.accountOwned.productNumber :
      transferInfo.accountTo.accountEnrolled.productNumber;
    const accToType = transferInfo.accountTo.owned ?
      this.bdbUtils.mapTypeProduct(transferInfo.accountTo.accountOwned.productType) :
      transferInfo.accountTo.accountEnrolled.productType;
    const accToSubType = transferInfo.accountTo.owned ?
      this.bdbUtils.mapSubtypeProduct(transferInfo.accountTo.accountOwned.productType) : null;
    const bankIdAcctTo = transferInfo.accountTo.owned ? BdbConstants.BBOG : transferInfo.accountTo.accountEnrolled.bankId;
    return new DoTransferRq(
      Number(transferInfo.amount),
      transferInfo.account.productNumber,
      this.bdbUtils.mapTypeProduct(transferInfo.account.productType),
      this.bdbUtils.mapSubtypeProduct(transferInfo.account.productType),
      BdbConstants.BRANCH_ID,
      accToId,
      accToType,
      accToSubType,
      bankIdAcctTo,
      transferInfo.note || '',
      transferInfo.billId || ''
    );
  }

  private buildRequestInvestment(trustAgreementInfo: TrustAgreementInfo): DoTransferRq {

    const transferTemp = {};
    Object.assign(transferTemp, this.fillObject(trustAgreementInfo.agreement.productDetailApi,
      trustAgreementInfo.operation === 'investment' ? 'To' : 'From'));
    Object.assign(transferTemp, this.fillObject(trustAgreementInfo.account.productDetailApi,
      trustAgreementInfo.operation === 'investment' ? 'From' : 'To'));

    return new DoTransferRq(
      Number(trustAgreementInfo.amount),
      transferTemp['accFromId'],
      transferTemp['accFromType'],
      transferTemp['accFromSubType'],
      BdbConstants.BRANCH_ID,
      transferTemp['accToId'],
      transferTemp['accToType'],
      transferTemp['accToSubType'],
      BdbConstants.BBOG
    );
  }

  public fillObject(obj: ApiProductDetail, destination: string) {
    return {
      [`acc${destination}Id`]: obj.productNumber,
      [`acc${destination}Type`]: obj.productBankType,
      [`acc${destination}SubType`]: obj.productBankSubType,
    };
  }

  public getAffiliatedAccounts(): Observable<AccountBalance[]> {
    return this.transferCoreService.getAffiliatedAccounts().map(
      affiliatedAccounts => affiliatedAccounts.acctBalancesList
        .filter(
          affiliatedAccount => affiliatedAccount.productName !== BdbConstants.OWN_ACCOUNT
        )
        .map(
          affiliatedAccount => {
            if (!!affiliatedAccount.customer) {
              affiliatedAccount.customer.name = affiliatedAccount.productName.trim() || '';
            }
            return new AccountBalance(
              affiliatedAccount.productBank,
              affiliatedAccount.bankId,
              affiliatedAccount.productAlias,
              affiliatedAccount.productType,
              affiliatedAccount.productNumber,
              affiliatedAccount.productName,
              affiliatedAccount.description,
              affiliatedAccount.customer,
              affiliatedAccount.aval,
              affiliatedAccount.contraction
            );
          }
        )
    ).pipe(
      tap(
        acctBalancesList => {
          this.bdbStorageService.setItemByKey(InMemoryKeys.EnrolledAccountsList, acctBalancesList);
        }
      )
    );
  }

}
