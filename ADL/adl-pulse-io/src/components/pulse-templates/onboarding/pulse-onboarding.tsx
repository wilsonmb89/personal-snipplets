import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { PulseOnBoardingItem } from '../../../interface';

/**
 * Template for onboardings that uses @pulse-slides
 * <pulse-slides> Put multiples <pulse-slide>
 * Inside <pulse-slide> we have divs which they'll containe our data
 * Outside of <pulse-slides> is the button that is only visible if the last slide is active
 * More info [pulse-slides](https://pulseio.design).
 */
@Component({
  tag: 'pulse-onboarding',
  styleUrl: 'pulse-onboarding.scss',
  shadow: false
})
export class PulseOnboarding {

  @Prop() data: Array<PulseOnBoardingItem>;
  /**
   * The data that your applications will display into the slides.
   * This propertie is an array of PulseOnBoardingItem which needs 3 parts:
   * mainTitle: string; the title of the <pulse-slide> is Optional
   * description: string; the description of the <pulse-slide> is Optional
   * imageUrl: string; the image of the <pulse-slide> is Optional
   * For more information, see [theming](https://pulseio.design).
   */
  @State() showButton: boolean = false
  /**
   * The state of the last slide.
   * For more information, see [theming](https://pulseio.design).
   */

  @Event() showButtonEvent!: EventEmitter<boolean>;
  /**
   * Emmit boolean showButtonEvent.
   * For more information, see [theming](https://pulseio.design).
   */

  changeIndicator(ev) {
    this.showButton = this.data.length === ev.detail.active
    this.showButtonEvent.emit(this.showButton)
  }

  render() {
    return (
      <host>
        <div>
          <pulse-slides color="primary" onChangeIndicator={ev => this.changeIndicator(ev)} >
            {
              this.data.map((item) =>
                <pulse-slide>
                  <div class="pulse-grid">
                    <div class="col-xs-12">
                      <div class="detail-content__onboarding">
                        <div>
                          <img class="detail-content__onboarding__img" src={item.imageUrl} />
                        </div>
                      </div>
                    </div>
                    <div class="detail-content__onboarding__text">
                      <div class="detail-content__onboarding__text__title">
                        <div innerHTML={item.mainTitle}></div>
                      </div>
                    </div>
                    <div class="detail-content__onboarding__text">
                      <div class="detail-content__onboarding__text__description">
                      <div innerHTML={item.description}></div>
                      </div>
                    </div>
                  </div>
                </pulse-slide>
              )
            }
          </pulse-slides>
          
        </div>
      </host>
    );
  }

}


