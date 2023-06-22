export interface CatalogueRq {
  catalogName: string;
  parentId: string;
}

export interface CatalogueRs {
  catalogItems: Array<Catalogue>;
}

export interface Catalogue {
  id: string;
  name: string;
  parentId: string;
  customFields?: CustomFields;
}

export interface CreditByBank {
  name: string;
  type: string;
  subType: string;
}

export interface CreditTypes {
  id: string;
  types: Array<CreditByBank>;
}

export interface CustomFields {
   isAval: string;
   type: string;
   isActive: string;
}
