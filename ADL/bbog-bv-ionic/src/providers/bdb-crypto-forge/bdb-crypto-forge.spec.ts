import { } from 'jasmine';
import { BdbCryptoForgeProvider } from './bdb-crypto-forge';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';

describe('bdb crypto provider test', () => {

    let provider: BdbCryptoForgeProvider;
    let bdbHashBase: BdbHashBaseProvider;

    beforeEach(() => {
        bdbHashBase = new BdbHashBaseProvider();
        provider = new BdbCryptoForgeProvider(bdbHashBase);
    });

    it('should return null if item null or undefined', () => {
        const m = provider.parseItem(null);
        expect(m).toBeNull();
    });
});
