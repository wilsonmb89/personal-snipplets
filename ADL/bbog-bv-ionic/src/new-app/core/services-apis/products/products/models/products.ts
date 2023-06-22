export interface ApiProductDetail {
    productName: string;
    description: string;
    officeId: string;
    productAthType: string;
    productBankType: string;
    productBankSubType: string;
    productNumber: string;
    valid: boolean;
    franchise: string;
    openDate: string;
    status: string;
}
export interface GetAllProductsRq {
  statusesToFilter: string[];
}


export interface GetAllProductsRs {
    accountList: Array<ApiProductDetail>;
}


export interface EnrollCustomCardRq {
  customerAddressNumber: string;
  customerAddressDistrict: string;
  customerAccountNumber: string;
  customerAccountSubtype: string;
  customerZipCode: string;
  accountOfficeId: string;
  customerCellPhone: string;
  customerPhoneNumber: string;
  customerAlternativePhoneNumber: string;
  customCardSpecification: 'UNICEF_CARD' | 'GREEN_CARD';



}


export interface GenericResponse {
    message: string;
    approvalId: string;
    requestId: string;
}
