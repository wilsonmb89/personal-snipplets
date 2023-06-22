import { TestBed } from '@angular/core/testing';
import { Platform } from 'ionic-angular';
import { MockBdbPlatformsProvider } from './bdb-platforms.mock';
import { BdbPlatformsProvider } from './bdb-platforms';
import {} from 'jasmine';

describe('bdb platforms provider test suite', () => {

    let bdbPlatforms: BdbPlatformsProvider;
    let mockBdbPlatforms: MockBdbPlatformsProvider;

    beforeEach(() => {
        mockBdbPlatforms = new MockBdbPlatformsProvider(new Platform());

        TestBed.overrideProvider(BdbPlatformsProvider, { useValue: mockBdbPlatforms });

        TestBed.configureTestingModule({
            providers: [
                Platform,
                BdbPlatformsProvider
            ]
        })
        .compileComponents();

        bdbPlatforms = TestBed.get(BdbPlatformsProvider);
    });

    it('should return device height', () => {
        expect(bdbPlatforms.getDeviceHeight()).toBeGreaterThan(10);
    });

    it('should be a browser', () => {
        expect(bdbPlatforms.isBrowser()).toBeTruthy();
    });

    it('shouldn\'t be a mobile', () => {
        expect(bdbPlatforms.isMobile()).toBeFalsy();
    });

    it('shouldn\'t be an app', () => {
        expect(bdbPlatforms.isApp()).toBeFalsy();
    });

});
