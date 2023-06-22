import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { Mode } from '../../../interface';

@Component({
    tag: 'pulse-card-shortcut-add',
    styleUrl: 'pulse-card-shortcut-add.scss',
    shadow: true
})
export class PulseCardShortcutAdd {

    private labelId = `pulse-csa--lbl`;

    @Prop() text = '';
    @Prop() mode: Mode = 'light';
    @Event() cardClicked!: EventEmitter<any>;

    hostData() {
        return {
            'aria-labelledby': this.labelId,
            class: {
                'light': this.mode === 'light',
                'dark': this.mode === 'dark'
            }
        };
    }

    onClick = () => {
        this.cardClicked.emit();
    }

    render() {
        return (
            <div class="shortcut-add-wrapper pulse-padding-l-xs-a" onClick={this.onClick}>
                <div class="shortcut-add-wrapper__avatar__bg">
                    <div class="shortcut-add-wrapper__avatar">
                        <slot></slot>
                    </div>
                </div>
                <div class="shortcut-add-wrapper__text">
                    {this.text}
                </div>
            </div>
        );
    }
}