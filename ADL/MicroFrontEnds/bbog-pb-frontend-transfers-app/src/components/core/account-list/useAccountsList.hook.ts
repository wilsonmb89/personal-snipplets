import { BANK_INFO, BANK_TYPES } from '../../../constants/bank-codes';
import { AffiliatedAccount } from '../../../store/affiliated-accounts/afilliated-accounts.entity';
import { Product } from '../../../store/products/products.entity';

interface UseBetweenAccounts {
  handleOwnAccounts: (accounts: Product[]) => ItemData[];
  handleAfiliatedAccounts: (accounts: AffiliatedAccount[]) => ItemData[];
  organizeAlphabetically: (data: ItemData[]) => ItemData[];
  organizeForTypeAccount: (data: Product[]) => Product[];
}

interface Avatar {
  text: string;
  color: string;
  size: string;
}

interface ItemData {
  icon?: string;
  avatar?: Avatar;
  title: string;
  desc: string;
  value: string;
}

export const typeAccount = (productType: string): string => {
  switch (productType) {
    case BANK_TYPES.SAVINGS_ACCOUNT.code:
      return 'Ahorros No. ';
    case BANK_TYPES.CHECK_ACCOUNT.code:
      return 'Corriente No. ';
    default:
      return 'Celular No. ';
  }
};

export const useAccountsList = (): UseBetweenAccounts => {
  const avatarColors = ['bouquet', 'sunglow', 'olive', 'scooter'];

  const typeAccountIcon = (productType: string): string => {
    if (productType === BANK_TYPES.SAVINGS_ACCOUNT.code) return 'ico-saving';
    return 'ico-cuenta-corriente';
  };

  const organizeAlphabetically = (data: ItemData[]): ItemData[] => {
    return data.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      return 0;
    });
  };

  const organizeForTypeAccount = (data: Product[]): Product[] => {
    return data.sort((a, b) => {
      if (a.productBankType < b.productBankType) return 1;
      if (a.productBankType > b.productBankType) return -1;
      return 0;
    });
  };

  const handleOwnAccounts = (accounts: Product[]): ItemData[] => {
    return accounts.map(acct => ({
      bankId: BANK_INFO.BBOG.bankId,
      productType: acct.productBankType,
      title: acct.productName,
      desc: BANK_INFO.BBOG.name,
      desc2: `${typeAccount(acct.productBankType)}${acct.productNumber}`,
      value: acct.productNumber,
      icon: `${typeAccountIcon(acct.productBankType)}`
    }));
  };

  const handleAfiliatedAccounts = (accounts: AffiliatedAccount[]): ItemData[] => {
    let selectedColor = 0;
    return accounts.map(acct => {
      selectedColor++;
      return {
        bankId: acct.bankId,
        productType: acct.productType,
        title: acct.productAlias,
        desc: acct.productBank,
        desc2: `${typeAccount(acct.productType)}${acct.productNumber}`,
        value: acct.productNumber,
        avatar: { text: acct.productAlias, color: avatarColors[selectedColor % 4], size: 'sm' }
      };
    });
  };

  return { handleOwnAccounts, handleAfiliatedAccounts, organizeAlphabetically, organizeForTypeAccount };
};
