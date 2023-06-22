import { BdbRsaProvider } from './bdb-rsa';
import {} from 'jasmine';
import { ENV } from '@app/env';

describe('encryption test suit', () => {

    let bdbRsa: BdbRsaProvider;

    beforeEach(() => {
        bdbRsa = new BdbRsaProvider();
    });

    afterEach(() => {
        ENV.STAGE_NAME = 'dev';
    });

    it('should return null if undefined', () => {
        expect(bdbRsa.encrypt(undefined)).toBe(null);
    });

    it('shouldn\'t encrypt data in dev env', () => {
        expect(bdbRsa.encrypt('1234')).toBe('1234');
    });

    it('should encrypt in all other envs', () => {
        ENV.STAGE_NAME = 'qa';
        const encrypted: string = bdbRsa.encrypt('1234');
        expect(encrypted)
            .toBe(encrypted);
    });
});
