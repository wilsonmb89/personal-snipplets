export interface GetAllBasicDataRs {
  occupation: string;
  addresses: Address[];
  phones: Phone[];
  phone: string;
  emailAddr: string;
  personaEmailAddr: string;
  personaEmailType: string;
  nationality: string;
  maritalStatus: string;
  educationalLevel: string;
  dwellingType: string;
  deliveryDestination: string;
  income: string;
  expenses: string;
  totalAssets: string;
  totalLiabilities: string;
  economicActivity: string;
  economicSector: string;
  effectiveDate: string;
  cityBirth: string;
  departmentBirth: string;
  countryBirth: string;
}

interface Phone {
  phoneType: string;
  phone: string;
  phoneIndicative: string;
  phoneExtension: string;
}

interface Address {
  addressType?: string;
  address1: string;
  address2?: string;
  address3?: string;
  address4?: string;
  stateProv?: string;
  countryLocation?: string;
  stateLocation?: string;
  cityLocation?: string;
}
