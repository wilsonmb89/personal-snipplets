import { BdbPlatformsProvider } from './bdb-platforms';

export class MockBdbPlatformsProvider extends BdbPlatformsProvider {

    public getDeviceHeight(): number {
        return 100;
    }

    public isMobile(): boolean {
        return false;
    }

    public isBrowser() {
    return !this.isMobile();
    }

    public isApp(): boolean {
    return false;
    }
}
