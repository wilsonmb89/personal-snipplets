import {
    trigger, transition, animate, style, state,
} from '@angular/animations';

export const expandRow = trigger('expandRow', [
    transition(':enter', [
        style({ height: '0', opacity: 1 }),
        animate(200)
    ]),
    transition(':leave', [
        animate(200, style({ height: '0px', opacity: 0 }))
    ])
]);

export const expandGauge = trigger('expandGauge', [
    transition(':enter', [
        style({ height: '0', opacity: 1 }),
        animate(300)
    ]),
    transition(':leave', [
        animate(300, style({ height: '0px', opacity: 0 }))
    ])
]);

export const expandCol = trigger('expandCol', [
    transition(':enter', [
        style({ width: '0' }),
        animate(400)
    ]),
    transition(':leave', [
        animate(400, style({ width: '0px' }))
    ])
]);

export const boxAnimation = trigger('boxAnimation', [
    state('void',
        style({
            opacity: 0.0,
        })
    ),
    state('*',
        style({
            opacity: 1.0,
        })
    ),
    transition(
        'void => *',
        animate('300ms ease-in')
    )
]);



