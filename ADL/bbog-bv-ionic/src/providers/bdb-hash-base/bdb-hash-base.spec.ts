import { } from 'jasmine';
import { BdbHashBaseProvider } from './bdb-hash-base';


describe('bdb crypto provider test', () => {

    let provider: BdbHashBaseProvider;

    beforeEach(() => {
        provider = new BdbHashBaseProvider();
    });

    it('should return an stringyfy', () => {
        const m = provider.getHashFromDevice();
        expect(m).toBeTruthy();
    });
});
