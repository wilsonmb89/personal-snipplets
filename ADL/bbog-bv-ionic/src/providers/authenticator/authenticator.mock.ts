import { Injectable } from '@angular/core';

@Injectable()

export class AuthenticatorProviderMock {
  constructor() {
  }

  authenticated(): boolean {
    return false;
  }

  logout() {
  }

}
