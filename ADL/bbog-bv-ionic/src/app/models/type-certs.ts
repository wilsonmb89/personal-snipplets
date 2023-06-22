export interface TypeCertModel {
    nemon: string;
    title: string;
    generic: boolean;
    product: string[];
}


export class TypeCertData {
    static readonly types: TypeCertModel[]  = [
      {
        nemon: 'TA',
        title: 'Retención Fuente Ahorros',
        generic: false,
        product: ['ST']
      },
      {
        nemon: 'TD',
        title: 'Retención Fuente CDTS',
        generic: false,
        product: ['CD']
      },
      {
        nemon: 'TE',
        title: 'Retención Fuente Cta Especial',
        generic: false,
        product: ['IM']
      },
      {
        nemon: 'TS',
        title: 'Retención Fuente Sobregiros',
        generic: false,
        product: ['IM']
      },
      {
        nemon: 'RC',
        title: 'Retención Fuente AFC',
        generic: false,
        product: ['AF']
      },
      {
        nemon: 'CI',
        title: 'Intereses Pagados Tarjetas',
        generic: false,
        product: ['MC', 'CB']
      },
      {
        nemon: 'IV',
        title: 'Intereses Pagados Cr Vivienda',
        generic: false,
        product: ['AV']
      },
      {
        nemon: 'LF',
        title: 'Información Contrato Leasing',
        generic: false,
        product: ['LF']
      },
      {
        nemon: 'LA',
        title: 'Anticipos de Leasing',
        generic: false,
        product: ['LA']
      },
      {
        nemon: 'IL',
        title: 'Leasing Habitacional Familiar',
        generic: false,
        product: ['LH']
      },
      {
        nemon: 'IC',
        title: 'Intereses Pagados Otros Créditos',
        generic: false,
        product: ['AD', 'AP', 'DN', 'AN']
      },
      {
        nemon: 'CF',
        title: 'Retención Fidubogotá',
        generic: true,
        product: []
      },
      {
        nemon: 'CG',
        title: 'GMF',
        generic: true,
        product: []
      },
      {
        nemon: 'CA',
        title: 'Accionistas Banco de Bogotá',
        generic: true,
        product: []
      },
      {
        nemon: 'CT',
        title: 'Reporte Anual de Costos Totales',
        generic: true,
        product: []
      }
    ];
}
