import { Injectable } from '@angular/core';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { GlobalVariablesProvider } from '../global-variables/global-variables';

@Injectable()
// TO DO: DELETE THIS CLASS
export class AuthListenerProvider {

  constructor(
    public bdbInMemoryProvider: BdbInMemoryProvider,
    private globalVars: GlobalVariablesProvider
  ) {
    this.initializeMessageListener();
  }

  private initializeMessageListener() {
    const self = this;
    window.addEventListener('message', function (event) {
      self.bdbInMemoryProvider.setItemByKey(InMemoryKeys.AccessToken, event.data.accessToken);
      self.bdbInMemoryProvider.setItemByKey(InMemoryKeys.IdentificationNumber, event.data.identityNumber);
      self.bdbInMemoryProvider.setItemByKey(InMemoryKeys.IdentificationType, event.data.identityType);
      self.bdbInMemoryProvider.setItemByKey(InMemoryKeys.AccessType, event.data.accessType);
      self.bdbInMemoryProvider.setItemByKey(InMemoryKeys.UserIsLoggedIn, true);
    }, false);
  }

  logout() {
    this.bdbInMemoryProvider.clearAll();
  }


  getAuthenticationUrl(reset?) {
    const site = '6';
    const product = '3';
    const officeCode = '0206';
    const validateOfficeCode = false;
    return `${this.globalVars.authenticatorUrl}?site=${site}&product=${product}` +
    `&officeCode=${officeCode}&fromLauncher=${encodeURI(undefined)}` +
    `&validateOfficeCode=${validateOfficeCode}`;
  }
}
