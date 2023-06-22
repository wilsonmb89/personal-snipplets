import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { TypeCertData, TypeCertModel } from '../../../../app/models/type-certs';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { CertCard } from '../../../../app/models/documents/cert-card';

@PageTrack({ title: 'certificate-select' })
@IonicPage()
@Component({
  selector: 'page-certificate-select',
  templateUrl: 'certificate-select.html',
})
export class CertificateSelectPage implements OnInit {

  certs: any;

  private readonly WHITE_ICON = 'assets/imgs/logo_white.svg';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbUtils: BdbUtilsProvider,
  ) {}

  ngOnInit(): void {
    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.certs = this.fillCerts(customerProducts, TypeCertData.types);
    }
  }

  private fillCerts(products: ProductDetail[], types: TypeCertModel[]) {

    let cert: CertCard[] = [];
    types.forEach(t => {
      if (!t.generic) {
        t.product.forEach(p => {
          const data = products
            .filter(f => f.productType === p)
            .map(pt => {
              return {
                cardTitle: t.title,
                cardLabel: `No. ${pt.productNumber}`,
                cardIcon: this.getImageUrl(pt),
                isActive: false,
                product: pt,
                typeNemo: t.nemon
              };
            });
          cert = [...cert, ...data];

        });
      } else {
        cert.push(this.mapGenericCertData(t));
      }
    });
    return cert;
  }

  private mapGenericCertData(type: TypeCertModel): CertCard {
    const result = {
      cardTitle: type.title,
      cardLabel: '',
      cardIcon: this.WHITE_ICON,
      isActive: false,
      product: undefined,
      typeNemo: type.nemon
    };
    return result;
  }

  certSelected(item) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.CertificatesSelected, item);
    this.navCtrl.push('CertificateDownloadPage');
  }

  getImageUrl(productDetail: ProductDetail): string {
    let img = this.bdbUtils.getImageUrl(productDetail.productType);
    img = !!img ? img : 'assets/imgs/logo_white.svg';
    return img;
  }
}
