import { PulseCard } from './pulse-card';
import { Elevation } from '../../../interface';

it('init load element', () => {
    const card = new PulseCard();
    expect(card.elevation).toBe(8);
});

it('validate eleveation', () => {
    const card = new PulseCard();
    const el: Elevation = 2;
    expect(card.validateIndex(el)).resolves;
});

it('validate HostData', () => {
    const card = new PulseCard();
    card.color = 'primary';
    const resultOk = {
        class: {
            'pulse-color': true,
            [`pulse-color-primary`]: true
        }
    }
    expect(card.hostData()).toEqual(resultOk);
});