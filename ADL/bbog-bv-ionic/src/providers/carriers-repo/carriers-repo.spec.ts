import { CarriersRepoProvider } from './carriers-repo';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';

describe('carriers repo testing', () => {
    let carriersRepoProvider: CarriersRepoProvider;
    let carriers: BdbMap[];

    beforeEach(() => {
        carriersRepoProvider = new CarriersRepoProvider();
        carriers = carriersRepoProvider.getRepo();
    });

    it('should return an array', () => {
         expect(Array.isArray(carriers)).toBeTruthy();
    });

    it('should return an array of default values for claro', () => {
        expect(Array.isArray(carriersRepoProvider.getDefaultValues('cl'))).toBeTruthy();
    });

    it('should return an empty array', () => {
        expect(carriersRepoProvider.getDefaultValues('xx')).toEqual([]);
    });
});
