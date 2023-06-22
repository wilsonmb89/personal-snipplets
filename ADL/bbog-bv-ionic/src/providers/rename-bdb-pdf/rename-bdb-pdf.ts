import { Injectable } from '@angular/core';
import { BdbPdfProvider } from '../../providers/bdb-pdf/bdb-pdf';
import { Observable } from 'rxjs/Observable';
import saveAs from 'file-saver';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbToastOptions } from '../../app/models/bdb-toast-options';
import { ProductExtractsRs } from '../../app/models/extracts/product-extracts-response';

@Injectable()
export class RenameBdbPdfProvider extends BdbPdfProvider {

  openBrowserAndAndroid(blob: Blob, fileName: string): Observable<any> {

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'documents.pdf');
    } else if (!this.platform.is('core')) {
      const url = URL.createObjectURL(blob);
      const userAgent = navigator.userAgent || navigator.vendor;

      if (/android/i.test(userAgent)) {
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = url;
        a.download = fileName;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank');
      }
    } else {
      saveAs(URL.createObjectURL(blob), fileName);
    }
    this.showToast(null);
    return Observable.of('resolved');
  }

  getBlob(data: ProductExtractsRs): Blob {
    const bytes: string = atob(data.binData);
    const byteNumbers = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      byteNumbers[i] = bytes.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  showToast(type) {
    const tempMsg = 'La referencia se ha descargado con éxito.';
    const successToast: BdbToastOptions = {
      message: tempMsg,
      close: true,
      color: 'active-green',
      type: 'pdf'
    };
    this.bdbToast.showToastGeneric(successToast);
  }

  buildFileName(rawAcct: ProductDetail, date, prex: string): string {
    return date;
  }

}
