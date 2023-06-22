import { Injectable } from '@angular/core';
import { ProductExtractsRs } from '../../app/models/extracts/product-extracts-response';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { Diagnostic } from '@ionic-native/diagnostic';
import saveAs from 'file-saver';
import { BdbToastOptions } from '../../app/models/bdb-toast-options';
import { BdbToastProvider } from '../../providers/bdb-toast/bdb-toast';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BdbPdfProvider {

  folderName = 'extractosBBOG';
  rawAcct: ProductDetail;
  dateName: string;
  typeDocument: string;

  constructor(
    private file: File,
    public bdbUtils: BdbUtilsProvider,
    public platform: Platform,
    public iab: InAppBrowser,
    private document: DocumentViewer,
    private fileOpener: FileOpener,
    private diagnostic: Diagnostic,
    public bdbToast: BdbToastProvider,
  ) { }
  /**
   * creates a blob to pdf object
   * @param data response from webservice
   * @returns Blob object with codified pdf
   */
  getBlob(data: ProductExtractsRs): Blob {
    const bytes: string = atob(atob(data.binData));
    const byteNumbers = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      byteNumbers[i] = bytes.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  /**
   * this method handles pdf viewing for browsers in desktop or android browsers
   * @param blob Blob object to show as pdf
   */
  openBrowserAndAndroid(blob: Blob, fileName: string): Observable<any> {

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else if (!this.platform.is('core')) {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      saveAs(URL.createObjectURL(blob), fileName);
    }
    const type = fileName.includes('EXTRACTO') ? 'E' : 'C';
    this.showToast(type);
    return Observable.of('resolved');
  }

  createPdf<Blob>(data: ProductExtractsRs, rawAcct: ProductDetail, dateName: string, typeDocument: string): Observable<any> {
    this.rawAcct = rawAcct;
    this.dateName = dateName;
    this.typeDocument = typeDocument;
    const blob = this.getBlob(data);
    return this.facadeDownload(blob).flatMap(e => Observable.of(e));
  }

  generatCSV<Blob>(data: string, dateName: string, typeDocument: string) {
    this.dateName = dateName;
    this.typeDocument = typeDocument;
    const blob = new Blob([data], { type: `${typeDocument};charset=utf-8;` });
    this.csvFileSave(blob, dateName);
  }

  public csvFileSave(file, name) {
    saveAs(file, name);
  }

  private facadeDownload(blob: Blob): Observable<any> {
    const fileName = this.buildFileName(this.rawAcct, this.dateName, this.typeDocument);
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      return this.openBrowserAndAndroid(blob, fileName).flatMap(
        (e) => Observable.of(e)
      );
    } else {
      // android or ios app
      this.downloadAndOpenPdf(blob);
    }
  }

  downloadAndOpenPdf(blob: Blob) {
    let path: string = null;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
      const fileName = this.buildFileName(this.rawAcct, this.dateName, this.typeDocument);
      this.saveToDeviceAndOpen(path, fileName, blob);
    } else if (this.platform.is('android')) {
      path = this.file.externalRootDirectory;
      this.checkAndroidPermission(path, blob);
    }
  }

  saveToDeviceAndOpen(path: string, fileName, blob: Blob) {
    this.savePDF(path, fileName, blob, () => {
      const type = fileName.includes('EXTRACTO') ? 'E' : 'C';
      const searchPath = `${path}/${fileName}.pdf`;
      if (this.platform.is('ios')) {
        const options = this.getDocViewerOptions();
        this.document.viewDocument(searchPath, 'application/pdf', options);
      } else if (this.platform.is('android')) {
        this.fileOpener.open(searchPath, 'application/pdf').then(() => {
        }).catch((e) => {
          console.error(e);
        });
      } else {
        alert('plataforma no soportada');
      }
      this.showToast(type);
    });
  }

  showToast(type) {
    const tempMsg = (type === 'E') ? 'El extracto se ha descargado con éxito.' : 'El certificado tributario se ha descargado con éxito.';
    const successToast: BdbToastOptions = {
      message: tempMsg,
      close: true,
      color: 'active-green',
      type: 'pdf'
    };
    this.bdbToast.showToastGeneric(successToast);
  }

  checkAndroidPermission(path: string, blob: Blob) {
    this.diagnostic.isExternalStorageAuthorized().then(() => {
      this.handleFileAndroid(path, blob);
    }).catch(() => {
      this.diagnostic.requestExternalStorageAuthorization().then(() => {
        this.handleFileAndroid(path, blob);
      }).catch(err => {
        alert('Necesitas proporcionar permisos para descargar tus extractos bancarios');
      });
    });
  }

  handleFileAndroid(path: string, blob: Blob) {
    this.createDirectory(path, this.folderName, () => {
      this.saveToDeviceAndOpen(
        path,
        this.buildFileName(this.rawAcct, this.dateName, 'EXTRACTO_'),
        blob);
    });
  }

  buildFileName(rawAcct: ProductDetail, date, prex: string): string {
    let prodName = '';
    if (rawAcct && rawAcct.productName) {
      prodName = this.bdbUtils.normalize(rawAcct.productName).replace(/ /g, '');
    }
    const fileName = `${prex}${prodName}_${date}`;
    return fileName;
  }

  createDirectory(path: string, folderName: string, next?: () => void) {
    this.file.checkDir(path, folderName).then(() => {
      next();
    }).catch((err) => {
      this.file.createDir(path, folderName, false).then(() => {
        next();
      });
    });
  }

  savePDF(path: string, fileName: string, blob: Blob, next?: () => void) {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.file.writeFile(path, fileName + '.pdf', blob).then(() => {
          next();
        }).catch(err => {
          if (err.code === 12) {
            this.file.writeExistingFile(path, fileName + '.pdf', blob).then(() => {
              next();
            }).catch((error) => {
              alert(JSON.stringify(error));
            });
          } else {
            alert(JSON.stringify(err));
          }
        });
      }, 500);
    }).catch((error) => {
      alert(JSON.stringify(error));
    });
  }

  getDocViewerOptions() {
    const constoptions = {
      title: 'My PDF',
      documentView: {
        closeLabel: 'DONE'
      },
      navigationView: {
        closeLabel: 'DONE'
      },
      email: {
        enabled: true
      },
      print: {
        enabled: false
      },
      openWith: {
        enabled: true
      },
      bookmarks: {
        enabled: false
      },
      search: {
        enabled: false
      },
      autoClose: {
        onPause: true
      }
    };

    return constoptions;
  }

}
