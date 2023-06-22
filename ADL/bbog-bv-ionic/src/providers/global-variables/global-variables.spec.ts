import { GlobalVariablesProvider } from './global-variables';
import {} from 'jasmine';

describe('global variables provider test suite', () => {

    let globalVariables: GlobalVariablesProvider;

    beforeEach(() => {
        globalVariables = new GlobalVariablesProvider();
    });

    it('should return the apiUrl', () => {
        expect(globalVariables.apiUrl).toBeTruthy();
    });

    it('should return the authenticator url', () => {
        expect(globalVariables.authenticatorUrl).toBeTruthy();
    });
});
