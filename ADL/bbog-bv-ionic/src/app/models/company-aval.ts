export interface CompanyAval {
  name: string;
  icon: string;
  color: string;
  iconLarge: string;
  code: string;
}


export class CompanyAvalData {
  static readonly companies: CompanyAval[] = [
    {
      iconLarge: 'assets/imgs/logo_av_villas.png',
      icon: 'assets/imgs/iconavv.png',
      name: 'Banco AV Villas',
      color: 'red-villas',
      code: '0052'
    }, {
      iconLarge: 'assets/imgs/logo_popular.png',
      icon: 'assets/imgs/iconbp.png',
      name: 'Banco Popular',
      color: 'green-popular',
      code: '0002'
    }, {
      iconLarge: 'assets/imgs/logo_occ.png',
      icon: 'assets/imgs/iconbo.png',
      name: 'Banco de Occidente',
      color: 'blue-occidente',
      code: '0023'
    }, {
      iconLarge: 'assets/imgs/logo_por.png',
      icon: 'assets/imgs/iconpor.png',
      name: 'Porvenir',
      color: 'orange-porvenir',
      code: '0098'
    }
  ];
}
