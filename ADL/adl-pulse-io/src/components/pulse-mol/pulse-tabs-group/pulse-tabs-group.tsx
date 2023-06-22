import { Component, h, State, Element, Prop } from '@stencil/core';

@Component({
  tag: 'pulse-tabs-group',
  styleUrl: 'pulse-tabs-group.scss',
  shadow: true
})
export class PulseTabsGroup {

  @Element() el!: HTMLElement;
  @State() tabs: HTMLPulseTabItemElement[] = [];
  @Prop() intrinsic = false;

  @State() tabSelected: HTMLPulseTabItemElement =null;


  componentDidLoad() {
    this.waitForItems(this.el).then((elements: HTMLPulseTabItemElement[]) => {
      if (elements.length > 0){
        this.tabs = elements;
        for (let i = 0; i < (this.tabs.length); i++) {
          if (this.tabSelected == null && !this.tabs[i].disabled){
            this.tabSelected = this.tabs[i]
          }else {
            this.tabs[i].style.display = "none"
          }
        }
      }
    });
  }

  waitForItems = (el: HTMLElement) => {
    return Promise.all(
      Array.from(el.querySelectorAll('pulse-tab-item')));
  };

  selectTab = (tab: HTMLPulseTabItemElement) => {
    if (!tab.disabled) {
      this.tabSelected.style.display = "none"
      this.tabSelected = this.tabs.find(t => t.tabtext == tab.tabtext)
      this.tabSelected.style.display = "flex"
    }
  };

  isTabSelected = (tab: HTMLPulseTabItemElement) => {
   return tab.tabtext === this.tabSelected.tabtext
  }

  hostData() {
    return {
      class: {
        'tab-group': true,
        'tab-group--intrinsic': this.intrinsic
      }
    };
  }

  render() {
    return (
      <div>
        <div class="tabs-titles">
          {this.tabs.map((tab) =>
            <div class="tabs-titles__item" onClick={() => this.selectTab(tab)}>
              <span class={{'tabs-titles__item__text': true,
               'pulse-tp-btn-comp-b': this.isTabSelected(tab),
               'pulse-tp-btn-comp-m': !this.isTabSelected(tab),
               'pulse-tp-btn-comp-m--disabled': tab.disabled }}>{tab.tabtext}</span>
              <div class={{
                'tabs-titles--noselected': !this.isTabSelected(tab),
                'tabs-titles__step': this.isTabSelected(tab)
              }}></div>
            </div>

          )}

        </div>
        <div class="tabs-wrapper">
          <slot></slot>
        </div>
      </div>
    );
  }
}
