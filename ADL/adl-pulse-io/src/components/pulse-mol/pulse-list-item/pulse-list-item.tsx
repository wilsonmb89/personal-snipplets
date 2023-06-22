import { Component, Event, EventEmitter, Prop, h, Host, State, Element, Listen, Method, Watch } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { AvatarType, Color, GridBreakpoints, LogoTypes } from '../../../interface';
import { getGridBreakpointBySize } from '../../../utils/utils';

@Component({
  tag: 'pulse-list-item',
  styleUrl: 'pulse-list-item.scss',
  shadow: true
})
export class PulseListItem {

  private secondaryActionRef: HTMLElement;
  private controlsContainerRef: HTMLElement;

  @Element() hostElement: HTMLStencilElement;

  @State() isExpandedState: boolean;
  @State() descriptionState: string = '';
  @State() breakpoint?: GridBreakpoints = 'lg';
  @State() tagMaxWidth: number = 0;

  @Prop() itemid: string;
  @Prop() itemtitle: string;
  @Prop() description?: string = '';
  @Prop() descriptionexpanded?: string = '';
  @Prop() subtitle: string;
  @Prop() subtitledesc?: string = '';
  @Prop() additionalsubtitle: string;
  @Prop() additionalsubtitledesc?: string = '';
  @Prop() avatarpath: string;
  @Prop() avatartype: AvatarType = 'icon';
  @Prop() avataraligncenter: boolean = false;
  @Prop() primarynavicon?: string = 'expand-more';
  @Prop() primarynaviconcolor?: Color = 'primary';
  @Prop() secondaryicon?: string = '';
  @Prop() secondaryiconcolor?: Color = 'primary';
  @Prop() tagtext?: string;
  @Prop() tagcolor?: Color = 'primary';
  @Prop() isdisabled?: boolean = false;
  @Prop() isexpandible?: boolean = true;
  @Prop() isexpanded?: boolean = false;
  @Prop() showdivisor?: boolean = false;
  @Prop() fillnavbuttton?: 'clear' | 'solid' = 'solid';


  @Event() secondaryActionClicked: EventEmitter<HTMLElement>;
  @Event() itemClicked: EventEmitter<boolean>;

  constructor() {}

  componentWillLoad(): void {
    this.setDescriptionText();
    this.checkBreakpoint();
  }

  componentDidLoad(): void {
    this.validateExpanded();
    this.checkOverflowControls();
  }

  @Listen('resize', { target: 'window' })
  handleResize(): void {
    this.checkBreakpoint();
    this.checkOverflowControls();
  }

  @Method()
  async collapseItem(collapse: boolean): Promise<void> {
    if (!this.isdisabled && this.isexpandible) {
      this.isExpandedState = collapse;
      this.setDescriptionText();
      this.setCollapsibleHeight();
    }
  }

  @Watch('description')
  watchDescription(): void {
    this.setDescriptionText();
  }

  @Watch('descriptionexpanded')
  watchDescriptionExpanded(): void {
    this.setDescriptionText();
  }

  @Watch('isexpanded')
  watchIsExpanded(): void {
    this.validateExpanded();
  }

  private checkOverflowControls(): void {
    let newTagMaxWidth = 0;
    try {
      if (!!this.controlsContainerRef && this.breakpoint !== 'sm') {
        const { width: elementWidth } = this.controlsContainerRef.getBoundingClientRect();
        const { width: parentElementWidth } = this.controlsContainerRef.parentElement.getBoundingClientRect();
        if (parentElementWidth < elementWidth) {
          const overflow = ((elementWidth - parentElementWidth)/10);
          const tagWidth = (this.controlsContainerRef.querySelector('pulse-tag')).shadowRoot.querySelector('.tag-container').clientWidth / 10;
          newTagMaxWidth = (tagWidth - overflow - 1.6);
        } else {
          newTagMaxWidth = this.calculateTagAvaliableWidth();
        }
      }
    } catch (error) {}
    this.tagMaxWidth = newTagMaxWidth;
  }

  private calculateTagAvaliableWidth(): number {
    const { width: elementWidth } = this.controlsContainerRef.getBoundingClientRect();
    const tagWidth = (this.controlsContainerRef.querySelector('pulse-tag')).shadowRoot.querySelector('.tag-container').clientWidth;
    const wrapperWidth = (this.controlsContainerRef.querySelector('.nav-controls--collapsed__wrapper')).clientWidth;
    const avaliableWidth = elementWidth - (tagWidth + wrapperWidth + 16);
    return avaliableWidth > 1 ? (tagWidth + avaliableWidth) / 10 : this.tagMaxWidth;
  }

  private validateExpanded(): void {
    this.isExpandedState = this.isexpandible && this.isexpanded;
    this.setDescriptionText();
    this.setCollapsibleHeight();
  }

  private setDescriptionText(): void {
    this.descriptionState = this.isExpandedState ? this.descriptionexpanded : this.description;
  }

  private itemHeaderClicked(): void {
    if (!this.isdisabled) {
      if (this.isexpandible) {
        this.isExpandedState = !this.isExpandedState;
        this.setDescriptionText();
        this.setCollapsibleHeight();
        this.itemClicked.emit(this.isExpandedState);
      } else {
        this.itemClicked.emit(false);
      }
    }
  }

  private setCollapsibleHeight(): void {
    const collapsibleBodyElement = (this.hostElement.shadowRoot.querySelector('#collapsible-body') as HTMLElement);
    const newMaxHeight = this.isExpandedState ? (collapsibleBodyElement.scrollHeight) : 0;
    collapsibleBodyElement.style.maxHeight = `${newMaxHeight}px`;
  }

  private checkBreakpoint(): void {
    this.breakpoint = getGridBreakpointBySize(window.innerWidth);
  }

  private emitSecondaryAction(event: Event): void {
    if (!this.isdisabled) {
      this.secondaryActionClicked.emit(this.secondaryActionRef);
    }
    event.stopPropagation();
  }

  private getControlsContainer(tagColor: Color, tagMaxWidth: number) {
    return (
      <div class={{
        'nav-controls': true,
        'is-expanded': this.isExpandedState,
        'show-divisor': (!this.isExpandedState && this.showdivisor)
      }}
      onClick={() => this.itemHeaderClicked()}
      >
        {!this.isExpandedState && (
          <div class="nav-controls--collapsed"
            ref={el => this.controlsContainerRef = el as HTMLElement}
          >
            {!!this.tagtext && this.breakpoint !== 'sm' && (
              <pulse-tag
                class="nav-controls--collapsed__tag"
                color={tagColor}
                colorvariant="900"
                fill="outline"
                closeable={false}
                size="xs"
                maxwidth={tagMaxWidth}
              >
                {this.tagtext}
              </pulse-tag>
            )}
            <div class="nav-controls--collapsed__wrapper">
              {!!this.secondaryicon && (
                <div
                  ref={el => this.secondaryActionRef = el as HTMLElement}
                  class="nav-controls--collapsed__wrapper__secondary-btn"
                >
                  <pulse-nav-button
                    icon={this.secondaryicon}
                    iconcolor={this.secondaryiconcolor}
                    fill="clear"
                    disabled={this.isdisabled}
                    onClick={(event) => this.emitSecondaryAction(event)}
                  ></pulse-nav-button>
                </div>
              )}
              <pulse-nav-button
                class="nav-controls--collapsed__wrapper__primary-btn"
                icon={this.primarynavicon}
                iconcolor={this.primarynaviconcolor}
                disabled={this.isdisabled}
                fill={this.fillnavbuttton}
              ></pulse-nav-button>
            </div>
          </div>
        )}
        {this.isExpandedState && (
          <div class="nav-controls--expanded">
            <pulse-nav-button
              class="nav-controls--expanded__primary-btn"
              icon="close"
              iconcolor={this.primarynaviconcolor}
            ></pulse-nav-button>
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <Host class="pulse-list-item">
        <div class={{
            'pulse-list-item__container': true,
            'is-expanded': this.isExpandedState,
            'is-disabled': this.isdisabled
          }}
        >
          <div class={{
            'pulse-list-item__container__header': true,
            'is-disabled': this.isdisabled
          }}>
            <div class={{
                'pulse-list-item__container__header__info': true,
                'avatar-center': this.avataraligncenter
              }}
              onClick={() => this.itemHeaderClicked()}
            >
              <div id="header-avatar"
                class="pulse-list-item__container__header__info__avatar"
              >
                {this.avatartype === 'icon' ?
                  (
                    <pulse-icon
                      icon={this.avatarpath}
                      size="m"
                      color="carbon"
                      colorvariant={this.isdisabled ? '100' : '700'}
                    ></pulse-icon>
                  ) :
                  (
                    <pulse-avatar
                      size={this.breakpoint === 'sm' ? 's' : 'm'}
                      url={this.avatartype === 'img' ? this.avatarpath : ''}
                      logo={this.avatartype === 'logo' ? this.avatarpath as LogoTypes : 'bbog'}
                      avatartype={this.avatartype}
                      color="white"
                    ></pulse-avatar>
                  )
                }
              </div>
              <div class={{
                  'pulse-list-item__container__header__info__data': true,
                  'show-divisor': (!this.isExpandedState && this.showdivisor)
                }}
              >
                <div class="pulse-list-item__container__header__info__data__principal">
                  <div class="pulse-list-item__container__header__info__data__principal__info">
                    <span class="pulse-list-item__container__header__info__data__principal__info__title pulse-tp-hl4-comp-m">
                      { this.itemtitle }
                    </span>
                    <span class="pulse-list-item__container__header__info__data__principal__info__desc pulse-tp-bo3-comp-r">
                      { this.descriptionState }
                    </span>
                  </div>
                  {this.breakpoint === 'sm' && this.getControlsContainer(this.tagcolor, this.tagMaxWidth)}
                </div>
                {!!this.subtitle && !this.isexpandible && (
                  <div class="pulse-list-item__container__header__info__data__secondary">
                    <span class="pulse-list-item__container__header__info__data__secondary__title pulse-tp-hl5-comp-m">
                      { this.subtitle }
                    </span>
                    <span class="pulse-list-item__container__header__info__data__secondary__desc pulse-tp-bo3-comp-r">
                      { this.subtitledesc }
                    </span>
                  </div>
                )}
                {!!this.additionalsubtitle && !this.isexpandible && (
                  <div class="pulse-list-item__container__header__info__data__tertiary">
                    <span class="pulse-list-item__container__header__info__data__tertiary__title pulse-tp-hl5-comp-m">
                      { this.additionalsubtitle }
                    </span>
                    <span class="pulse-list-item__container__header__info__data__tertiary__desc pulse-tp-bo3-comp-r">
                      { this.additionalsubtitledesc }
                    </span>
                  </div>
                )}
                {!!this.tagtext && !this.isExpandedState && this.breakpoint === 'sm' && (
                  <pulse-tag
                    class="pulse-list-item__container__header__info__data__tag"
                    color={this.tagcolor}
                    colorvariant="900"
                    fill="outline"
                    closeable={false}
                    size="xs"
                  >
                    {this.tagtext}
                  </pulse-tag>
                )}
              </div>
            </div>
            {this.breakpoint !== 'sm' && this.getControlsContainer(this.tagcolor, this.tagMaxWidth)}
          </div>
          <div
            id="collapsible-body"
            class="pulse-list-item__container__body"
            onClick={() => setTimeout(() => this.setCollapsibleHeight(), 50)}
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
