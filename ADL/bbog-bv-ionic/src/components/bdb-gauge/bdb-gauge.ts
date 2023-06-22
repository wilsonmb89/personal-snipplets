import {Component, Input} from '@angular/core';

/**
 * Generated class for the BdbGaugeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-gauge',
  templateUrl: 'bdb-gauge.html'
})
export class BdbGaugeComponent {

  public _innerStrokeColor = '#b9dcfe';
  public _outerStrokeColor = '#0040a8';
  public _subtitleColor = '#6680ad';

  @Input()
  public value: number;

  @Input()
  public maxValue: number;

  @Input()
  public subTitle: string;

  @Input() set outerStrokeColor(color) {
    this._outerStrokeColor = color;
  }

  @Input() set innerStrokeColor(color) {
    this._innerStrokeColor = color;
  }

  @Input() set subTitleColor(color) {
    this._subtitleColor = color;
  }


  public getPercent(): number {
    return (100 * this.value) / this.maxValue;
  }

}
