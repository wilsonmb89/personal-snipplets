import { Injectable } from '@angular/core';
import { BdbShortcutCard } from '../../app/models/bdb-shortcut-card';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';

@Injectable()
export class QuickAccessProvider {

  MAX_ITEMS_WEB = 6;
  MAX_ITEMS_MOBILE = 10;

  constructor(
    private bdbInMemory: BdbInMemoryProvider,
    private transfersDelegateService: TransfersDelegateService
  ) { }

  private mapAccountShortcuts(suggestedAccts): BdbShortcutCard[] {
    return suggestedAccts.sort((v1, v2) => v1.favoriteTime - v2.favoriteTime).map(e => {
      const alias = e.productAlias.split(/ (.+)/);
      const acct = new BdbShortcutCard();
      acct.contraction = e.contraction;
      acct.rectangle = false;
      acct.firstText = alias.length > 0 ? alias[0] : '';
      acct.secondText = alias.length > 1 && alias.length > 0 ? alias[1] : '';
      acct.object = e;
      return acct;
    });
  }

  public getSuggestedAccounts(callback: (data: any) => void): void {
    const enrAcctList = this.bdbInMemory.getItemByKey(InMemoryKeys.EnrolledAccountsList);
    if (enrAcctList) {
      callback(this.mapAccountShortcuts(enrAcctList));
    } else {
      this.transfersDelegateService.getAffiliatedAccounts().subscribe(
        (enrAccounts) => {
          callback(this.mapAccountShortcuts(enrAccounts));
        },
        (err) => {
          callback([]);
        }
      );
    }
  }
}
