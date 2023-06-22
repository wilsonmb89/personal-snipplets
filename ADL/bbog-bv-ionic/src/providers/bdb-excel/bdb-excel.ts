import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { Platform } from 'ionic-angular';
import saveAs from 'file-saver';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbToastOptions } from '../../app/models/bdb-toast-options';
import { BdbToastProvider } from '../../providers/bdb-toast/bdb-toast';
import { HistoryTxDwnRq } from '../../app/models/history-tx/history-tx-dwn-rq';

@Injectable()
export class BdBExcelProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient,
    public platform: Platform,
    public bdbUtils: BdbUtilsProvider,
    public bdbToast: BdbToastProvider
  ) { }

  public callExcelFileService(excelRq: HistoryTxDwnRq): void {
    this.bdbHttpClient.post(
      'banking-reports/excel-file',
      excelRq,
      ENV.API_GATEWAY_ADL_URL
    ).subscribe(
      resOk => {
        this.generateFile(resOk);
      },
      error => {
        this.showUnavailableToast('No ha sido posible generar el reporte');
      }
    );
  }

  private generateFile(dataRs: any): void {
    switch (dataRs.extension) {
      case '.xls':
        const fileName = `histTx${new Date().getTime()}.xls`;
        this.facadeDownload(this.getBlob(dataRs.file), fileName);
        break;
    }
  }

  private getBlob(data64bits: string): Blob {
    const bytes: string = atob(data64bits);
    const byteNumbers = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      byteNumbers[i] = bytes.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/vnd.ms-excel' });
  }

  private facadeDownload(blob: Blob, fileName: string): Observable<any> {
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      return this.downloadFile(blob, fileName).flatMap(
        (e) => Observable.of(e)
      );
    } else {
      // android or ios app
      this.showUnavailableToast('No se encuentra disponible para dispositivos móviles');
    }
  }

  private downloadFile(blob: Blob, fileName: string): Observable<any> {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      saveAs(URL.createObjectURL(blob), fileName);
    }
    return Observable.of('resolved');
  }

  private showUnavailableToast(errorMsg: string): void {
    const successToast: BdbToastOptions = {
      message: errorMsg,
      close: true,
      color: 'toast-error',
      type: 'delete'
    };
    this.bdbToast.showToastGeneric(successToast);
  }
}
