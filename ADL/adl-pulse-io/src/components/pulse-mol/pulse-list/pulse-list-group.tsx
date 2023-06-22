import { Component, Host, h, Listen, State, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { GridBreakpoints } from '../../../interface';
import { getGridBreakpointBySize } from '../../../utils/utils';
import { PulseListItem } from '../pulse-list-item/pulse-list-item';

@Component({
  tag: 'pulse-list-group',
  styleUrl: 'pulse-list-group.scss',
  shadow: true
})
export class PulseListGroup {

  private mobileBreakpoint = 'sm';

  @Element() hostElement: HTMLStencilElement;

  @State() isMobileBreakpoint: boolean;
  @State() listItems: HTMLPulseListItemElement[];

  @Prop() isaccordion?: boolean = true;
  @Prop() showheader?: boolean = false;
  @Prop() islitedesign?: boolean = false;

  @Event() itemChanged: EventEmitter<string>;

  constructor() {
  }

  componentWillLoad(): void {
    this.handleResize();
  }

  componentDidLoad(): void {
    this.setUpComponent();
  }

  @Listen('resize', { target: 'window' })
  handleResize(): void {
    const breakpoint: GridBreakpoints = getGridBreakpointBySize(window.innerWidth);
    this.isMobileBreakpoint = this.mobileBreakpoint === breakpoint ? true : false;
  }

  private setUpComponent(): void {
    Promise.all(Array.from(this.hostElement.shadowRoot
      .querySelector('slot')
      .assignedElements())
    ).then(elements => {
      this.listItems = elements.map(el => el as HTMLPulseListItemElement);
      this.setInitialStatusItems();
    })
      .catch(err => console.error(err));
  }

  private setInitialStatusItems(): void {
    if (!!this.listItems && this.listItems.length > 0) {
      this.listItems.forEach((itemRef: HTMLPulseListItemElement, index: number) => {
        const item = itemRef as unknown as PulseListItem;
        item.isexpandible = this.isaccordion;
        item.showdivisor = !(index === (this.listItems.length - 1));
        itemRef.addEventListener('itemClicked', () => {
          this.handleOpenedItems(item);
        });
      });
    }
  }

  private handleOpenedItems(pulseItem: PulseListItem): void {
    if (this.isaccordion) {
      this.listItems.map(itemRef => itemRef as unknown as PulseListItem)
        .forEach(async item => {
          if (item.itemid !== pulseItem.itemid) {
            await item.collapseItem(false);
          }
        });
      this.itemChanged.emit(pulseItem.itemid);
    }
  }

  render() {
    return (
      <Host class="pulse-list-group">
        <div class={{
          'pulse-list-group-container': true,
          'pulse-elevation-8': (!this.isMobileBreakpoint && !this.islitedesign)
        }}
        >
          { !!this.showheader &&
          <div class="pulse-list-group-header">
            <slot name="header" />
          </div>
          }
          <slot />
        </div>
      </Host>
    );
  }

}
