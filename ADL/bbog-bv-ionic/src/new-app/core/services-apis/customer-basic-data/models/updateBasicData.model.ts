export interface UpdateBasicDataRs {
  message: string;
  approvalId: string;
  requestId: string;
}

export interface UpdateBasicDataRq {
  identificationNumber?: string;
  identificationType?: string;
  birthCity?: string;
  birthCountry?: string;
  birthStateProv?: string;
  maritalStatus?: string;
  nationality?: string;
  educationalLevel?: string;
  occupation?: string;
  dwellingType?: string;
  phoneNumberRecords?: PhoneNumberRecord[];
  postAddressRecords?: PostAddressRecord[];
  email?: string;
  emailType?: string;
  economicActivity?: string;
}

export interface PhoneNumberRecord {
  phoneType?: string;
  phone?: string;
  phoneIndicative?: string;
  phoneExtension?: string;
}

export interface PostAddressRecord {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  city?: string;
  stateProv?: string;
  postalCode?: string;
  country?: string;
  addrType?: string;
}
