import {} from 'jasmine';
import { MobileSummaryProvider } from './mobile-summary';
import { Events } from 'ionic-angular';
import { MobileSummary, SummaryHeader, SummaryBody } from '../model/mobile-summary';

describe('provider: MobileSummary', () => {
    let provider: MobileSummaryProvider;
    let event: Events;

    beforeEach(() => {
        event = new Events();
        provider = new MobileSummaryProvider(event);
    });

    it('should update header and publish resize:summary', () => {
        spyOn(event, 'publish');
        const header: SummaryHeader = {
            contraction: 'cc',
            title: 'title',
            details: [''],
            hasContraction: true,
            logoPath: '',
            subDetails: ['']
        };
        provider.setHeader(header);
        const summary: MobileSummary = provider.getInstance();
        expect(summary.header).toEqual(header);
        expect(event.publish).toHaveBeenCalledWith('resize:summary');
    });

    it('should update body and publish resize:summary', () => {
        spyOn(event, 'publish');
        const body: SummaryBody = {
            textDown: 'down',
            textUp: 'up',
            valueDown: 'val',
            valueUp: 'valUp'
        };
        provider.setBody(body);
        const summary: MobileSummary = provider.getInstance();
        expect(summary.body).toEqual(body);
        expect(event.publish).toHaveBeenCalledWith('resize:summary');
    });
});
