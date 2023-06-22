import { Injectable } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { BillInfo } from '../../app/models/bills/bill-info';
import { BillPaymentInfo } from '../../app/models/bills/bill-payment-info';
import { CashAdvanceInfo } from '../../app/models/cash-advance/cash-advance-info';
import { LoanPaymentInfo } from '../../app/models/credits/loan-payment-info';
import { AccountAny } from '../../app/models/enrolled-transfer/account-any';
import { LoanTransferInfo } from '../../app/models/loan-transfer/loan-transfer-info';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { PayTaxRq } from '../../app/models/pay/tax';
import { ProductDetail } from '../../app/models/products/product-model';
import { RechargeInfo } from '../../app/models/recharges/recharge-info';
import { CreditCardPaymentInfo } from '../../app/models/tc-payments/credit-card-payment-info';
import { TransferInfo } from '../../app/models/transfers/transfer-info';
import { TrustAgreementInfo } from '../../app/models/trust-agreement/trust-agreement-info';
import { VoucherButton, VoucherData, VoucherDetail, VoucherInfo, VoucherText } from '../../app/models/voucher/voucher-data';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { Pocket, PocketTransferRq } from '../../new-app/root/products/pockets/models/pocket';
import { BillersPaymentFacade } from '../../new-app/modules/payments/store/facades/billers-payment.facade';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import {PaymentPilaRq} from '../../new-app/core/services-apis/payment-billers/models/payment-billers-api.model';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@Injectable()
export class VoucherOptionsProvider {

  ERR_TITLE = 'Ha ocurrido un error';
  ERR_MESSAGE = 'Intenta más tarde por favor.';

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private bdbInMemory: BdbInMemoryProvider,
    public appCtrl: App,
    private billersPaymentFacade: BillersPaymentFacade,
    private userFacade: UserFacade
  ) { }

  launchVoucherTransfer(successful: boolean, data: ModalRs, transferInfo: TransferInfo) {
    this.navigateVoucher(
      data,
      this.buildDataTransfer(successful, data, transferInfo),
      successful ? this.buttonsTransfer() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
  }

  launchVoucherCashAdvance(successful: boolean, data: ModalRs, cashInfo: CashAdvanceInfo) {
    this.buildDataCashAdvance(successful, data, cashInfo).subscribe(dataCashAdvance => {
      this.navigateVoucher(
      data,
      dataCashAdvance,
      successful ? this.buttonsTransfer() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
    });
  }

  launchVoucherFiduciary(successful: boolean, data: ModalRs, trustInfo: TrustAgreementInfo) {


    this.navigateVoucher(
      data,
      this.buildDataFiduciary(successful, data, trustInfo),
      successful ? this.buttonsTransfer() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
  }

  launchVoucherLoanTransfer(successful: boolean, data: ModalRs, loanTransfer: LoanTransferInfo) {

    const nav: NavController = this.appCtrl.getRootNav();

    this.navigateVoucher(
      data,
      this.buildDataLoanTransfer(successful, data, loanTransfer),
      successful ? this.buttonsTransfer() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
  }

  launchVoucherDonation(
    successful: boolean,
    data: ModalRs,
    donation: {
      donationInfo: { contraction, recipent, charge, amount },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    }
  ) {
    this.navigateVoucher(
      data,
      this.buildDataLoanDonation(successful, data, donation),
      successful ? this.buttonsTransfer() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
  }

  launchVoucherBill(successful: boolean, data: ModalRs, billPaymentInfo: BillPaymentInfo) {

    const nav: NavController = this.appCtrl.getRootNav();

    if (successful) {
      this.billersPaymentFacade.updateBillersPayment();
    }

    this.navigateVoucher(
      data,
      this.buildDataBill(successful, data, billPaymentInfo),
      successful ? this.buttonsPayments() : [],
      BdbConstants.EMAIL_OPTIONS.PAY);
  }

  launchVoucherCreditCard(successful: boolean, data: ModalRs, ccPaymentInfo) {
    this.navigateVoucher(
      data,
      this.buildDataCreditCard(successful, data, ccPaymentInfo as CreditCardPaymentInfo),
      successful ? this.buttonsPayments() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
  }

  successOrError(dataTransferVoucher, error) {
    if (dataTransferVoucher.successful) {
      this.bdbInMemory.clearItem(InMemoryKeys.CustomerProductList);
    } else {
      dataTransferVoucher.err = {
        title: (!!error && !!error.title && !!error.button) ? error.title : this.ERR_TITLE,
        message: (!!error && !!error.title && !!error.button) ? error.message : this.ERR_MESSAGE
      };
    }
  }

  launchVoucherCredits(successful: boolean, data: ModalRs, loanPaymentInfo) {
    this.navigateVoucher(
      data,
      this.buildDataCredits(successful, data, loanPaymentInfo as LoanPaymentInfo),
      successful ? this.buttonsPayments() : [],
      BdbConstants.EMAIL_OPTIONS.TRANSFER);
  }

  launchVoucherRecharge(successful: boolean, data: ModalRs, rechargeInfo: RechargeInfo) {

    const nav: NavController = this.appCtrl.getRootNav();

    this.navigateVoucher(
      data,
      this.buildDataRecharge(successful, data, rechargeInfo),
      successful ? this.buttonsPayments() : [],
      BdbConstants.EMAIL_OPTIONS.PAY);
  }

  launchVoucherTaxes(
    successful: boolean,
    data: ModalRs,
    payTaxInfo: {
      payInfo: PayTaxRq,
      taxInfoSel: { dataForm, taxInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    }) {

    const nav: NavController = this.appCtrl.getRootNav();

    this.navigateVoucher(
      data,
      this.buildDataTaxes(successful, data, payTaxInfo),
      successful ? this.buttonsPayments() : [],
      BdbConstants.EMAIL_OPTIONS.PAY);
  }

  launchVoucherPila(
    successful: boolean,
    data: ModalRs,
    payPilaInfo: {
      payInfo: PaymentPilaRq,
      pilaInfo: { dataForm, billInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    }) {

    const nav: NavController = this.appCtrl.getRootNav();

    this.navigateVoucher(
      data,
      this.buildDataPila(successful, data, payPilaInfo),
      successful ? this.buttonsPayments() : [],
      BdbConstants.EMAIL_OPTIONS.PAY);
  }

  launchVoucherTransferPocket(
    successful: boolean,
    data: ModalRs,
    pocketTransfer: { pocketTransferRq: PocketTransferRq, pocket: Pocket }
  ) {

    this.navigateVoucher(
      data,
      this.buildDataTransferPocket(successful, data, pocketTransfer),
      successful ? this.buttonsTransfer() : [],
      BdbConstants.EMAIL_OPTIONS.PAY);
  }

  buttonsPayments(): Array<VoucherButton> {
    return [
      this.createNavProducts(),
      this.createNavPayments()
    ];
  }

  buttonsTransfer(): Array<VoucherButton> {
    return [
      this.createNavProducts(),
      this.createNavTransfer()
    ];
  }

  createNavPayments(): VoucherButton {
    return {
      id: 'anotherOption',
      name: 'Otro pago',
      func: (navCtrl: NavController) => {
        navCtrl.setRoot('PaymentsMainPage');
      }
    };
  }

  createNavTransfer(): VoucherButton {
    return {
      id: 'anotherOption',
      name: 'Otra transferencia',
      func: (navCtrl: NavController) => {
        navCtrl.setRoot('NewTransferMenuPage');
      }
    };
  }

  createNavProducts(): VoucherButton {
    return {
      id: 'goProducts',
      type: 'outline',
      name: 'Ir a productos',
      func: (navCtrl: NavController) => {
        navCtrl.setRoot('DashboardPage');
      }
    };
  }

  navigateVoucher(
    error: ModalRs,
    dataTransferVoucher: VoucherData,
    buttons: Array<VoucherButton>,
    emailOptions: any
  ) {
    this.successOrError(dataTransferVoucher, error);
    this.appCtrl.getActiveNav().push('VoucherPage', {
      data: dataTransferVoucher,
      buttons,
      emailOptions
    });
  }

  buildDataTransfer(successful: boolean, modalRs: ModalRs, transferInfo: TransferInfo): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const accountTo: ProductDetail = transferInfo.account;
    const accountToAny: AccountAny = transferInfo.accountTo;
    const accountFrom: any = accountToAny.accountOwned ? accountToAny.accountOwned : accountToAny.accountEnrolled;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(accountFrom.productName, 'bold'),
      this.createVoucherText(accountFrom.productBank),
      this.createVoucherText(`No. ${accountFrom.productNumber}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(transferInfo.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(transferInfo.transactionCost, 'value')
    ]));

    // to change origin account
    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${accountTo.productName} No. ${this.maskField(accountTo.productNumber)}` )
    ]));

    if (!!transferInfo.billId || !!transferInfo.note) {
      voucherDetailArray.push(this.createVoucherDetail('Nota - No. factura', [
        this.createVoucherText(`${!!transferInfo.note ? transferInfo.note : ''} ${!!transferInfo.note && !!transferInfo.billId ? '-' : ''} ${!!transferInfo.billId ? transferInfo.billId : ''}`)
      ]));
    }

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataCashAdvance(successful: boolean, modalRs: ModalRs, cashInfo: CashAdvanceInfo): Observable<VoucherData> {
    return this.getCashAdvanceCost().pipe(
      map(cost => {
        const dataVoucher = new VoucherData();
        dataVoucher.successful = successful;
        dataVoucher.sendEmail = successful;

        const voucherInfo = new VoucherInfo();
        voucherInfo.number = modalRs ? modalRs.authCode : '';
        voucherInfo.date = modalRs ? modalRs.transactionDate : '';

        const accountFrom: ProductDetail = cashInfo.creditCard;
        const accountTo: ProductDetail = cashInfo.account;

        const voucherDetailArray: Array<VoucherDetail> = [];

        voucherDetailArray.push(this.createVoucherDetail('Origen', [
          this.createVoucherText('Tarjeta de Crédito', 'bold'),
          this.createVoucherText(accountFrom.productBank),
          this.createVoucherText(`${accountFrom.productNumber}`)
        ]));

        voucherDetailArray.push(this.createVoucherDetail('Valor', [
          this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(cashInfo.amount, MaskType.CURRENCY), 'value')
        ]));

        voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
          this.createVoucherText(cost, 'value')
        ]));

        voucherDetailArray.push(this.createVoucherDetail('Cuenta destino', [
          this.createVoucherText(`${accountTo.productName} No. ${accountTo.productNumber}`)
        ]));

        voucherInfo.content = voucherDetailArray;
        dataVoucher.voucher = voucherInfo;

        return dataVoucher;
      })
    );
  }

  buildDataFiduciary(successful: boolean, modalRs: ModalRs, trustInfo: TrustAgreementInfo): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const fiduciary: ProductDetail = trustInfo.agreement;
    const account: ProductDetail = trustInfo.account;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail(trustInfo.operation === 'investment' ? 'Destino' : 'Origen', [
      this.createVoucherText(fiduciary.productName, 'bold'),
      this.createVoucherText(trustInfo.operation === 'investment' ? 'Invertir a Fiducia' : 'Retirar de Fiducia'),
      this.createVoucherText(`No. ${fiduciary.productNumber}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(trustInfo.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(BdbConstants.TRANSACTION_COST.NO_COST, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail(trustInfo.operation === 'investment' ? 'Cuenta de origen' : 'Cuenta destino', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataLoanTransfer(successful: boolean, modalRs: ModalRs, loanTransfer: LoanTransferInfo): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const accountFrom: ProductDetail = loanTransfer.loan;
    const accountTo: ProductDetail = loanTransfer.account;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Origen', [
      this.createVoucherText(accountFrom.productName, 'bold'),
      this.createVoucherText(accountFrom.productBank),
      this.createVoucherText(`No. ${accountFrom.productNumber}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(loanTransfer.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(BdbConstants.TRANSACTION_COST.NO_COST, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta destino', [
      this.createVoucherText(`${accountTo.productName} No. ${accountTo.productNumber}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataLoanDonation(
    successful: boolean,
    modalRs: ModalRs,
    donation: {
      donationInfo: { contraction, recipent, charge, amount },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    }
  ): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const donationInfo = donation.donationInfo;
    const accountSeleted = donation.accountSeleted;
    const recipent: any = donationInfo.recipent;
    const account: ProductDetail = accountSeleted.acct;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(recipent.name, 'bold'),
      this.createVoucherText(''),
      this.createVoucherText('')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(donationInfo.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(BdbConstants.TRANSACTION_COST.NO_COST, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataBill(successful: boolean, modalRs: ModalRs, billPaymentInfo: BillPaymentInfo): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const billInfo: BillInfo = billPaymentInfo.bill;
    const account: ProductDetail = billPaymentInfo.account;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(billInfo.nickname, 'bold'),
      this.createVoucherText(billInfo.orgInfoName),
      this.createVoucherText(billInfo.invoiceNum ? `Factura No. ${billInfo.invoiceNum}` : '')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(billPaymentInfo.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(billPaymentInfo.transactionCost, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataTaxes(
    successful: boolean,
    modalRs: ModalRs,
    payTaxInfo: {
      payInfo: PayTaxRq,
      taxInfoSel: { dataForm, taxInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    }): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const taxInfoSel = payTaxInfo.taxInfoSel;
    const dataForm = taxInfoSel.dataForm;
    const taxInfo = taxInfoSel.taxInfo;
    const bill = taxInfo.bill;
    const tax = dataForm.tax;
    const accountSeleted = payTaxInfo.accountSeleted;

    const account: ProductDetail = accountSeleted.acct;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(tax.name, 'bold'),
      this.createVoucherText(''),
      this.createVoucherText(`No. ${dataForm.ref}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(bill.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(taxInfoSel.charge, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataPila(
    successful: boolean,
    modalRs: ModalRs,
    payPilaInfo: {
      payInfo: PaymentPilaRq,
      pilaInfo: { dataForm, billInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    }): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const pilaInfo = payPilaInfo.pilaInfo;
    const dataForm = pilaInfo.dataForm;
    const accountSeleted = payPilaInfo.accountSeleted;
    const account: ProductDetail = accountSeleted.acct;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(dataForm.type.name, 'bold'),
      this.createVoucherText(''),
      this.createVoucherText(`No. ${dataForm.ref}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(pilaInfo.billInfo.bills[0].amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(pilaInfo.charge, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataCreditCard(successful: boolean, modalRs: ModalRs, ccPaymentInfo: CreditCardPaymentInfo): VoucherData {
    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const accountAny: AccountAny = ccPaymentInfo.creditCard;
    const creditCard: any = accountAny.accountOwned ? accountAny.accountOwned : accountAny.accountEnrolled;
    const account: ProductDetail = ccPaymentInfo.account;

    const voucherDetailArray: Array<VoucherDetail> = [];
    const obfuscated = creditCard.productNumber.substring(creditCard.productNumber.length - 4);

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText('Tarjeta de Crédito', 'bold'),
      this.createVoucherText(creditCard.productBank),
      this.createVoucherText(`****${obfuscated}`, null,
        creditCard.productType === 'MC' ? 'assets/imgs/mastercard.svg' : 'assets/imgs/visa.svg')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(ccPaymentInfo.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(ccPaymentInfo.transactionCost, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataCredits(successful: boolean, modalRs: ModalRs, loanPaymentInfo: LoanPaymentInfo): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const accountAny: AccountAny = loanPaymentInfo.loan;
    const loan: any = accountAny.accountOwned ? accountAny.accountOwned : accountAny.accountEnrolled;
    const account: ProductDetail = loanPaymentInfo.account;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(loan.productName ? loan.productName : loan.productAlias, 'bold'),
      this.createVoucherText(loan.productBank),
      this.createVoucherText(`No. ${loan.productNumber}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(CurrencyFormatPipe.format(loanPaymentInfo.amount), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(loanPaymentInfo.transactionCost, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataRecharge(successful: boolean, modalRs: ModalRs, rechargeInfo: RechargeInfo): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = successful;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const carrier: BdbMap = rechargeInfo.carrier;
    const account: ProductDetail = rechargeInfo.account;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail('Destino', [
      this.createVoucherText(carrier.value, 'bold'),
      this.createVoucherText('Número celular'),
      this.createVoucherText(`${rechargeInfo.phoneNumber}`)
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(this.bdbMaskProvider.maskFormatFactory(rechargeInfo.amount, MaskType.CURRENCY), 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(rechargeInfo.transactionCost, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Cuenta de origen', [
      this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
    ]));

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  buildDataTransferPocket(
    successful: boolean,
    modalRs: ModalRs,
    pocketTransfer: { pocketTransferRq: PocketTransferRq, pocket: Pocket }
  ): VoucherData {

    const dataVoucher = new VoucherData();
    dataVoucher.successful = successful;
    dataVoucher.sendEmail = false;

    const voucherInfo = new VoucherInfo();
    voucherInfo.number = modalRs ? modalRs.authCode : '';
    voucherInfo.date = modalRs ? modalRs.transactionDate : '';

    const pocket: Pocket = pocketTransfer.pocket;
    const account: ProductDetail = pocket.account;
    const pocketTransferRq: PocketTransferRq = pocketTransfer.pocketTransferRq;

    const voucherDetailArray: Array<VoucherDetail> = [];

    voucherDetailArray.push(this.createVoucherDetail(
      pocketTransferRq.transferType === BdbConstants.POCKETS.deposit ? 'Destino' : 'Origen',
      [
        this.createVoucherText(pocket.pocketName, 'bold'),
        this.createVoucherText(`Alcancía No. ${pocket.pocketId}`)
      ]
    ));

    const locale = 'en-US';
    const amount = this.bdbMaskProvider.maskFormatFactory(pocketTransferRq.amount, MaskType.CURRENCY_NOCENTS, locale);
    const cost = this.bdbMaskProvider.maskFormatFactory(0, MaskType.CURRENCY_NOCENTS, locale);

    voucherDetailArray.push(this.createVoucherDetail('Valor', [
      this.createVoucherText(amount, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail('Costo de la transacción', [
      this.createVoucherText(cost, 'value')
    ]));

    voucherDetailArray.push(this.createVoucherDetail(
      pocketTransferRq.transferType === BdbConstants.POCKETS.deposit ? 'Cuenta de origen' : 'Cuenta destino',
      [
        this.createVoucherText(`${account.productName} No. ${this.maskField(account.productNumber)}`)
      ])
    );

    voucherInfo.content = voucherDetailArray;
    dataVoucher.voucher = voucherInfo;

    return dataVoucher;
  }

  createVoucherText(value: string, type?: string, img?: string): VoucherText {
    const voucherText = new VoucherText();
    voucherText.value = value;

    if (type) {
      voucherText.type = type;
    }

    if (img) {
      voucherText.img = img;
    }

    return voucherText;
  }

  createVoucherDetail(name: string, text: Array<VoucherText>): VoucherDetail {
    const voucherDetail = new VoucherDetail();
    voucherDetail.name = name;
    voucherDetail.text = text;

    return voucherDetail;
  }

  private getCashAdvanceCost(): Observable<string> {
    return this.userFacade.transactionCostByType$('CASH_ADVANCE').pipe(
      map(catalogueCost => !!catalogueCost ? `Costo: ${catalogueCost}` : 'NO_AVAILABLE'),
      take(1)
    );
  }


  private maskField(field: string): string {
    return `*****${field.substr(field.length - 4)}`;
  }
}
