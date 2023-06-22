import { Component, Element, Event, EventEmitter, Listen, Prop, Watch, h, Host } from '@stencil/core';


@Component({
  tag: 'pulse-radio-group',
  styleUrl: 'pulse-radio-group.scss',
  shadow: true
})
export class PulseRadioGroup {

  private inputId = `pulse-rg-${radioGroupIds++}`;
  private labelId = `${this.inputId}-lbl`;
  private radios: HTMLPulseRadioElement[] = [];

  @Element() el!: HTMLElement;

  /**
   * If `true`, the radios can be deselected.
   */
  @Prop() allowEmptySelection = false;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * the value of the radio group.
   */
  @Prop({ mutable: true }) value?: any | null;

  @Watch('value')
  valueChanged(value: any | undefined) {
    this.updateRadios();
    this.radioChange.emit({ value });
  }

  /**
   * Emitted when the value has changed.
   */
  @Event() radioChange!: EventEmitter<any>;

  @Listen('radioDidLoad')
  onRadioDidLoad(ev: Event) {
    const radio = ev.target as HTMLPulseRadioElement;
    radio.name = this.name;

    // add radio to internal list
    this.radios.push(radio);


    // this radio-group does not have a value
    // but this radio is checked, so let's set the
    // radio-group's value from the checked radio
    if (this.value == null && radio.checked) {
      this.value = radio.value;
    } else {
      this.updateRadios();
    }
  }

  @Listen('radioDidUnload')
  onRadioDidUnload(ev: Event) {
    const index = this.radios.indexOf(ev.target as HTMLPulseRadioElement);
    if (index > -1) {
      this.radios.splice(index, 1);
    }
  }

  @Listen('radioSelect')
  onRadioSelect(ev: Event) {
    const selectedRadio = ev.target as HTMLPulseRadioElement | null;
    if (selectedRadio) {
      this.value = selectedRadio.value;
    }
  }

  @Listen('radioDeselect')
  onRadioDeselect(ev: Event) {

    if (this.allowEmptySelection) {
      const selectedRadio = ev.target as HTMLPulseRadioElement | null;
      if (selectedRadio) {
        selectedRadio.checked = false;
        this.value = undefined;
      }
    }
  }


  private updateRadios() {
    const value = this.value;
    let hasChecked = false;
    for (const radio of this.radios) {
      if (!hasChecked && radio.value === value) {
        // correct value for this radio
        // but this radio isn't checked yet
        // and we haven't found a checked yet
        hasChecked = true;
        radio.checked = true;
      } else {
        // this radio doesn't have the correct value
        // or the radio group has been already checked

        radio.checked = false;
      }
    }
  }

  render() {
    return (
      <Host
        role="radiogroup"
        aria-labelledby={this.labelId}
        class={{
          [`radio-group`]: true,
        }}
      >
        <div class="radio-group">
          <slot></slot>
        </div>
      </Host>
    );
  }
}

let radioGroupIds = 0;
