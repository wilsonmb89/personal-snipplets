import {Injectable} from '@angular/core';
import {StatementSelectPage} from '../../pages/documents/statement/statement-select/statement-select';
import {CertificateSelectPage} from '../../pages/documents/certificate/certificate-select/certificate-select';
import {ReferencesSelectAccountPage} from '../../pages/documents/references/references-select-account/references-select-account';

@Injectable()
export class DocsOpsMenuProvider {

  constructor() {
  }

  public tabsData() {
    return [
      {
        title: 'Extractos',
        segment: 'extracts',
        component: StatementSelectPage,
        funnelKey: 'extracts',
        empty: {
          message: 'none'
        },
        active: false
      },
      {
        title: 'Certificados Tributarios',
        segment: 'certs',
        component: CertificateSelectPage,
        funnelKey: 'certs',
        empty: {
          message: 'none'
        },
        active: false
      },
      {
        title: 'Referencias Bancarias',
        segment: 'references',
        component: ReferencesSelectAccountPage,
        funnelKey: 'references',
        empty: {
          message: 'none'
        },
        active: false
      },
    ];
  }

}
