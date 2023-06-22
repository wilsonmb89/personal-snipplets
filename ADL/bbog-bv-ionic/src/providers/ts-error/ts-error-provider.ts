import { Injectable } from '@angular/core';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import * as tsError from './ts-error.json';

@Injectable()
export class TsErrorProvider {

  private tsError: { code: string, title: string, message: string }[] = tsError as any;

  constructor(
    private bdbModal: BdbModalProvider
  ) { }

  public launchErrorModal(ex: any) {
    const error: ModalRs = ex;
    if (error && error.title && error.button) {
      this.bdbModal.launchErrModal(
        error.title, error.message,
        error.button.main,
        () => { },
        error.button.aux);
    } else {
      this.bdbModal.launchErrModal(
        'Ha ocurrido un error',
        'Intenta más tarde por favor.',
        'Aceptar');
    }
  }

  private getErrorByCode(errorCode: string): { title: string, message: string } {
    const error = this.tsError.find((value: { code: string, message: string }) => value.code === errorCode);
    return !!error ?
      error :
      {
        title: 'Ha ocurrido un error',
        message: 'Intenta más tarde por favor.'
      };
  }

  public modalFromErrorCode(errorCode: string): void {
    const error = this.getErrorByCode(errorCode);
    this.bdbModal.launchErrModal(
      error.title,
      error.message,
      'Aceptar');
  }
}
