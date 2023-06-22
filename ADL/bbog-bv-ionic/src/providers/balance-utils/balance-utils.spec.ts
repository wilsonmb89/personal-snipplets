import { } from 'jasmine';
import { BalanceUtilsProvider } from './balance-utils';
import { BalanceStatus } from 'app/models/bdb-generics/bdb-constants';

describe('BalanceUtilsProvider Test suite', () => {
    let balanceUtils: BalanceUtilsProvider;
    beforeEach(() => {
        balanceUtils = new BalanceUtilsProvider();
    });

    it('should return Balance status In progress', () => {
        const b: BalanceStatus = balanceUtils.checkBalanceInquiryStatus(2, 1, 5);
        expect(b).toBe(BalanceStatus.IN_PROCESS);
    });

    it('should return Balance status finished', () => {
        const b: BalanceStatus = balanceUtils.checkBalanceInquiryStatus(3, 0, 3);
        expect(b).toBe(BalanceStatus.FINISHED);
    });

    it('should return Balance status finished with errors', () => {
        const b: BalanceStatus = balanceUtils.checkBalanceInquiryStatus(2, 4, 6);
        expect(b).toBe(BalanceStatus.FINISHED_WITH_ERROR);
    });
});
