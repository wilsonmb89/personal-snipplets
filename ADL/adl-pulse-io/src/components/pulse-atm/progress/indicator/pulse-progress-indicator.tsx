
import {
    Component,
    Prop,
    h,
    Host
} from '@stencil/core'
import { Color, ColorVariant } from '../../../../interface';
import { createColorClasses } from '../../../../utils/themes';


@Component({
    tag: 'pulse-progress-indicator',
    styleUrl: 'pulse-progress-indicator.scss'

})
export class PulseProgressIndicator {
    @Prop() stepactive = 1;
    @Prop() steps = 1;
    @Prop() color: Color = 'primary';
    @Prop() colorvariant: ColorVariant = '700';

    private paintPoints = () =>  
        Array.apply(null, {length: this.steps})
            .map(Number.call, Number)
            .map((x) => 
            <div class={{
                'pulse-margin-xs-xs-a': true, 
                'pulse-padding-s-xs-a': true, 
                [`indicator__point--${(x+1 === this.stepactive)? 'enable' : 'disable'}`]: true }}
                key={x}>
            </div>);


    render() {
        return (
            <Host class={{
                ...createColorClasses(this.color, this.colorvariant)              
            }}>
                <div class="indicator pulse-grid row pulse-padding-s-xs-a pulse-padding-m-xs-h">
                    { this.paintPoints() }
                </div>                
            </Host>
        );
    }

}