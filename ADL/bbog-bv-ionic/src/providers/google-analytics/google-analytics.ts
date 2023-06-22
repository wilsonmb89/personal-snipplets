import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';

declare var dataLayer: Array<any>;


@Injectable()
export class GoogleAnalyticsProvider {

    constructor(
        private events: Events,
        public platform: Platform,
        private bdbInMemoryProvider: BdbInMemoryProvider
    ) {
        platform.ready().then(() => {
            this.enabledAnalyticsEvent();
        });
    }

    private enabledAnalyticsEvent() {
        this.events.subscribe('view:enter', (obj) => {
            this.trackPage(obj);
        });
    }

    private trackPage(page: {name, title}) {
        const id = this.bdbInMemoryProvider.getItemByCryptId(InMemoryKeys.IdCryptAnalytic);
        dataLayer.push({
            'screenPath': page.name,
            'screenName': page.title,
            'trackId': id
        });
        dataLayer.push({ 'event': 'appScreenView' });
    }

}
