import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { Color, ColorVariant, Fill, Size } from '../../../interface';


export interface TagData {

  text: string,
  value: string

}

@Component({
  tag: 'pulse-tags-group',
  styleUrl: 'pulse-tags-group.scss',
  shadow: true
})

export class PulseTagsGroup {

  @Prop() tagdata: TagData[] = [];
  @Prop() colorvariant: ColorVariant = '400';
  @Prop() color: Color = 'primary';
  @Prop() text: string;
  @Prop() closeable: boolean = false;
  @Prop() size: Size = 's';
  @Prop() fill: Fill = 'outline';

  @Event() closeTag: EventEmitter;

   private closeSelectTag(tag: TagData) {
    this.tagdata = this.tagdata.filter(t => t.value !== tag.value);
    this.closeTag.emit(tag);
  }

  render() {
    return (
      <Host class="tags-group">
        <div class="tags">
          {this.tagdata.map((tag) =>
            <div class="tags__single">
              <pulse-tag text={tag.text} stayalways={true} closeable={this.closeable} colorvariant={this.colorvariant}
                         fill={this.fill} size={this.size} color={this.color}
                         onCloseClick={() => this.closeSelectTag(tag)}/>
            </div>
          )}
        </div>
      </Host>

    );
  }
}
