export interface LoyaltyProgramRs {
  balance: string;
  partners: Array<LoyaltyProgramPartners>;
}


export interface LoyaltyProgramPartners {
  name: string;
  balance: string;
  status: string;
  memberSince: string;
  rank: string;
  description: string;
}
