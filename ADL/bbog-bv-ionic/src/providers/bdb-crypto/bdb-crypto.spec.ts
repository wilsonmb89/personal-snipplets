import { BdbCryptoProvider } from './bdb-crypto';

describe('bdb crypto provider test', () => {

    let provider: BdbCryptoProvider;

    beforeEach(() => {
        provider = new BdbCryptoProvider();
    });

    it('should return null if item null or undefined', () => {
        const m = provider.parseItem(null);
        expect(m).toBeNull();
    });
});
