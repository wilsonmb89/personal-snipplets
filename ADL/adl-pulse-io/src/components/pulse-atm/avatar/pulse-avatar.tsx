import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { AvatarType, Color, ColorVariant, LogoTypes, Size } from '../../../interface';
import * as bbogLogo from './logos/bank-bbog.logo';
import * as masterLogo from './logos/master.logo';
import * as visaLogo from './logos/visa.logo';
import * as claroLogo from './logos/claro.logo';
import * as tigoLogo from './logos/tigo.logo';
import * as facilpassLogo from './logos/facilpass.logo';
import * as movistarLogo from './logos/movistar.logo';
import * as virginLogo from './logos/virgin.logo';


@Component({
  tag: 'pulse-avatar',
  styleUrl: 'pulse-avatar.scss',
  shadow: true
})
export class PulseAvatar {

  private avatarId = `pulse-avatar-${avatarId++}`;

  @Prop() name = this.avatarId;
  @Prop() size: Size = 'm';
  @Prop() color: Color = 'white';
  @Prop() colorvariant: ColorVariant = '400';
  @Prop() borderdashed: boolean = false;
  @Prop() avatartype: AvatarType = 'text';
  @Prop() logo: LogoTypes = 'bbog';
  @Prop() text: string = 'AA';
  @Prop() url: string;
  @Prop() icon: string;
  @Prop() iconcolor: Color = 'carbon';
  @Prop() iconcolorvariant: ColorVariant = '700';

  @State() errorLoadImage = false;


  @Watch('url')
  watchHandler() {
    this.errorLoadImage = false;
  }


  private showOpacityBorder = (): boolean => {
    return this.size === 'l' && this.color !== 'white';
  };

  private validateText = (text: string): string => {
    return text.substring(0, 2).toUpperCase();
  };


  private onErrorImg = (e): void => {
    console.error('Pulse error getting image: ', e.path[0].src);
    this.errorLoadImage = true;
  };

  private mapIconSize(size: Size): Size {
    switch (size) {
      case 'xs':
      case 's':
        return 'm';
      case 'm':
      case 'l':
      case 'xl':
        return 'l';
    }
  }

  private getLogo(logoType: LogoTypes, size: Size): any {
    switch (size) {
      case 'xs':
      case 's':
        return this.getLogoByType(logoType, '24px');
      case 'm':
      case 'l':
      case 'xl':
        return this.getLogoByType(logoType, '32px');
    }
  }

  private getLogoByType(logoType: LogoTypes, logoSize: '24px' | '32px'): any {
    switch (logoType) {
      case 'bbog':
        return bbogLogo.getLogo(logoSize);
      case 'master':
        return masterLogo.getLogo(logoSize);
      case 'visa':
        return visaLogo.getLogo(logoSize);
      case 'claro':
        return claroLogo.getLogo(logoSize);
      case 'tigo':
        return tigoLogo.getLogo(logoSize);
      case 'facilpass':
        return facilpassLogo.getLogo(logoSize);
      case 'movistar':
        return movistarLogo.getLogo(logoSize);
      case 'virgin':
        return virginLogo.getLogo(logoSize);
    }
  }


  render() {
    return (
      <Host class={{
        [`pulse-color-${this.color}-${this.colorvariant}`]: true,
        [`pulse-tp-hl5-comp-b`]: true
      }}>
        <div class={{
          [`size--${this.size}`]: true,
          [`size`]: true,
          [`border`]: true,
          [`border--dashed`]: this.borderdashed,
          [`border--white`]: this.color === 'white',
          [`border--opacity`]: this.showOpacityBorder()
        }}>

          {
            this.avatartype === 'text' && this.validateText(this.text)
          }
          {
            (this.avatartype === 'img' && !this.errorLoadImage) &&
            <img class={{ [`size__img`]: true }} src={this.url} onError={this.onErrorImg} />
          }
          {
            (this.avatartype === 'img' && this.errorLoadImage!!) &&
            <pulse-icon color="carbon" colorvariant="700" icon="people-man-1" size={this.mapIconSize(this.size)} />
          }
          {
            (this.avatartype === 'logo') &&
            <div class="logo"> {this.getLogo(this.logo, this.size)} </div>
          }
          {
            (this.avatartype === 'icon') &&
            <pulse-icon color={this.iconcolor} colorvariant={this.iconcolorvariant} icon={this.icon}
                        size={this.mapIconSize(this.size)} />
          }


        </div>

      </Host>
    );
  }
}

let avatarId = 0;
