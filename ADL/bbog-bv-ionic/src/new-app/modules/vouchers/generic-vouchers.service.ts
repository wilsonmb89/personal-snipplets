import { Injectable } from '@angular/core';
import {VoucherButton, VoucherData, VoucherDetail, VoucherText} from '../../../app/models/voucher/voucher-data';

@Injectable()
export class GenericVouchersProvider {

  private createVoucherText(value: string, type?: string, img?: string, cssClass?: string): VoucherText {
    const voucherText = new VoucherText();
    voucherText.value = value;

    if (type) {
      voucherText.type = type;
    }

    if (img) {
      voucherText.img = img;
    }

    if (cssClass) {
      voucherText.cssClass = cssClass;
    }

    return voucherText;
  }

  private createVoucherDetail(name: string, text: Array<VoucherText>): VoucherDetail {
    const voucherDetail = new VoucherDetail();
    voucherDetail.name = name;
    voucherDetail.text = text;

    return voucherDetail;
  }

  public createVoucher(data: VoucherData): VoucherData {
    if (!data.successful) {
      data.err = {
        title: data.isPayment ? 'El pago ' : 'La transacción ',
        result: 'no se pudo realizar.'
      };
    }

    data.voucher.content = data.voucher.content
    .filter( content =>  content.text.length > 0 && content.text[0].value !== '')
    .map(field => this.createVoucherDetail(field.name, field.text.map(
          text => {
              return this.createVoucherText(text.value, text.type, text.img, text.cssClass);
          }))
   );

    return data;
  }

  public createNavProducts(): VoucherButton {
    return {
      id: 'goProducts',
      type: 'DashboardPage',
      name: 'Ir a productos'
    };
  }

  public createNavPayments(): VoucherButton {
    return {
      id: 'anotherOption',
      name: 'Otro pago',
      type: 'PaymentsMainPage'
    };
  }



}
