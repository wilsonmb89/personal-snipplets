export interface BasicDataRs {
  phone: string;
  emailAddr: string;
  secondLastName: string;
  lastName: string;
  middleName: string;
  firstName: string;
  cdtOwner: boolean;
  phones?: [BasicDataPhone];


}

export interface BasicDataPhone {
  phoneType: string;
  phone: string;
  phoneIndicative: string;
  phoneExtension: string;
}
