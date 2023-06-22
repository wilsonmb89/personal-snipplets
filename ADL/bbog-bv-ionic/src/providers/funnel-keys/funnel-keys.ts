import { Injectable } from '@angular/core';
import { FunnelJourneyModel } from './funnel-journey-model';

@Injectable()
export class FunnelKeysProvider {

  constructor() {
  }

  getKeys(): FunnelJourneyModel {
    return {
      login: {
        key: 'login',
        steps: {
          openLanding: 'openLanding',
          authenticate: 'authenticate',
          openSecure: 'openSecure',
          success: 'success'
        }
      },
      quickAccess: {
        key: 'quickAccess',
        steps: {
          recharges: 'recharges',
          bills: 'bills',
          transfers: 'transfers'
        }
      },
      menu: {
        key: 'menu',
        steps: {
          products: 'products',
          payments: 'payments',
          transfers: 'transfers',
          documents: 'documents',
          configuration: 'configuration'
        }
      },
      products: {
        key: 'products',
        steps: {
          load: 'load',
          detail: 'detail'
        }
      },
      recharges: {
        key: 'recharges',
        steps: {
          menu: 'menu',
          option: 'option',
          operator: 'operator',
          cellphone: 'cellphone',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      cards: {
        key: 'cards',
        steps: {
          option: 'option',
          pickCard: 'pickCard',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      credits: {
        key: 'credits',
        steps: {
          option: 'option',
          pickCredit: 'pickCredit',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      bills: {
        key: 'bills',
        steps: {
          option: 'option',
          pickBill: 'pickBill',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation',
          schedule: 'schedule'
        }
      },
      tax: {
        key: 'tax',
        steps: {
          option: 'option',
          pickBill: 'pickTax',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      pila: {
        key: 'pila',
        steps: {
          option: 'option',
          pickBill: 'pickPila',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      transfers: {
        key: 'transfers',
        steps: {
          option: 'option',
          pickAccount: 'pickAccount',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      fiducias: {
        key: 'fiducias',
        steps: {
          option: 'option',
          autoPick: 'autoPick',
          pickFidu: 'pickFidu',
          amount: 'amount',
          investment: 'investment',
          divestment: 'divestment',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      cashAdvance: {
        key: 'cashAdvance',
        steps: {
          option: 'option',
          autoPick: 'autoPick',
          pickCard: 'pickCard',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation',
          more: 'more'
        }
      },
      loanTransfer: {
        key: 'loanTransfer',
        steps: {
          option: 'option',
          autoPick: 'autoPick',
          pickLoan: 'pickLoan',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      donations: {
        key: 'donations',
        steps: {
          dest: 'destination',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        }
      },
      historyPayment: {
        key: 'historyPayment',
        steps: {
          history: 'history',
        }
      },
      historyTransfer: {
        key: 'historyTransfer',
        steps: {
          history: 'history',
        }
      },
      enrolleBills: {
        key: 'enrolleBills',
        steps: {
          pickEnroll: 'pickEnroll',
          agreement: 'agreement',
          noId: 'noId',
          alias: 'alias'
        }
      },
      enrollCreditCards: {
        key: 'enrollCC',
        steps: {
          pickEnroll: 'pickEnroll',
          bankHolder: 'bankHolder',
          acctHolder: 'acctHolder',
          alias: 'alias'
        }
      },
      enrollCredits: {
        key: 'enrollCredits',
        steps: {
          pickEnroll: 'pickEnroll',
          bankHolder: 'bankHolder',
          acctHolder: 'acctHolder',
          alias: 'alias'
        }
      },
      enrollAccounts: {
        key: 'enrollAccounts',
        steps: {
          pickEnroll: 'pickEnroll',
          bankHolder: 'bankHolder',
          acctHolder: 'acctHolder',
          alias: 'alias'
        }
      },
      token: {
        key: 'token',
        steps: {
          ask: 'ask',
          validate: 'validate'
        }
      },
      modal: {
        key: 'modal',
        steps: {
          load: 'load'
        }
      },
      pocket: {
        key: 'pocket',
        steps: {
          goal: 'goal',
          name: 'name',
          amount: 'amount',
          account: 'account',
          building: 'building'
        }
      },
      forex: {
        key: 'forex',
        steps: {
          option: 'option'
        }
      },
      cdt: {
        key: 'cdt',
        steps: {
          option: 'option',
          pickCdt: 'pickCdt',
          amount: 'amount',
          account: 'account',
          confirmation: 'confirmation'
        },
      },
      cdtRenewal: {
        key: 'cdtRenewal',
        steps: {
          option: 'option',
          pickCdt: 'pickCdt',
          amount: 'amount',
          account: 'account',
          renewCdt: 'renewCdt'
        },
      }
    };
  }
}
