import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, Input, EventEmitter, Output, OnInit, ViewChildren, QueryList } from '@angular/core';
import { expandRow } from '../../components/core/utils/animations/transitions';

@Component({
  selector: 'bdb-generic-table',
  templateUrl: 'bdb-generic-table.html',
  animations: [expandRow]
})
export class BdbGenericTableComponent {

  @ViewChildren('tableContainer') viewChildren: QueryList<any>;
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @Input() columns = [];
  _dataSource = [];
  @Input() set dataSource(dataSource) {
    this._dataSource = dataSource;
    this.buildTable();
  }
  @Input() expandable = [];
  @Input() error = false;
  @Input() loader = false;
  @Input() validateDateMobile: any = (i: any, data: any, dataSource: any) => false;

  constructor(
    private renderer: Renderer2
  ) {

    const mqLg = window.matchMedia('(min-width: 768px)');
    const mqMd = window.matchMedia('(min-width: 540px) and (max-width: 767px)');
    const mqSm = window.matchMedia('(max-width: 539px)');

    mqLg.addListener((e) => {
      if (e.matches && !this.expandable.find(ex => !!ex.platform.desktop)) {
        this._dataSource.forEach(ex => ex.expandable = false);
      }
    });

    mqMd.addListener((e) => {
      if (e.matches && !this.expandable.find(ex => !!ex.platform.tablet)) {
        this._dataSource.forEach(ex => ex.expandable = false);
      }
    });

    mqSm.addListener((e) => {
      if (e.matches && !this.expandable.find(ex => !!ex.platform.mobile)) {
        this._dataSource.forEach(ex => ex.expandable = false);
      }
    });

  }

  buildTable() {

    setTimeout(t => {

      const mqLg = window.matchMedia('(min-width: 768px)');
      const mqMd = window.matchMedia('(min-width: 540px)');

      this.viewChildren.forEach(e => {

        const nativeElement = e.nativeElement;

        if (mqLg.matches) {
          this.renderer.setStyle(nativeElement, 'grid-template-columns', this.gridTemplateColumnsLg(this.columns));
        } else if (mqMd.matches) {
          this.renderer.setStyle(nativeElement, 'grid-template-columns', this.gridTemplateColumnsMd(this.columns));
        } else {
          this.renderer.setStyle(nativeElement, 'grid-template-columns', this.gridTemplateColumns(this.columns));
        }

        mqLg.addListener((evtmqLg) => {
          if (evtmqLg.matches) {
            this.renderer.setStyle(nativeElement, 'grid-template-columns', this.gridTemplateColumnsLg(this.columns));
          }
        });

        mqMd.addListener((evtmqMd) => {
          if (evtmqMd.matches) {
            this.renderer.setStyle(nativeElement, 'grid-template-columns', this.gridTemplateColumnsMd(this.columns));
          } else {
            this.renderer.setStyle(nativeElement, 'grid-template-columns', this.gridTemplateColumns(this.columns));
          }
        });

      });

    }, 300);

  }

  gridTemplateColumnsLg(columns: Array<any>): string {
    let gridTemplateColumns = '0px ';
    columns.forEach(e => {
      if (!!e.platform) {
        gridTemplateColumns += ' ' + (!!e.platform.desktop && !!e.platform.desktop.column ? e.platform.desktop.column : '');
      } else {
        gridTemplateColumns += ' 1fr';
      }
    });
    return gridTemplateColumns += ' 0px';
  }

  gridTemplateColumnsMd(columns: Array<any>): string {
    let gridTemplateColumns = '0px ';
    columns.forEach(e => {
      if (!!e.platform) {
        gridTemplateColumns += ' ' + (!!e.platform.tablet && !!e.platform.tablet.column ? e.platform.tablet.column : '');
      } else {
        gridTemplateColumns += ' 1fr';
      }
    });
    return gridTemplateColumns += ' 0px';
  }

  gridTemplateColumns(columns: Array<any>): string {
    let gridTemplateColumns = '0px ';
    columns.forEach(e => {
      if (!!e.platform) {
        gridTemplateColumns += ' ' + (!!e.platform.mobile && !!e.platform.mobile.column ? e.platform.mobile.column : '');
      } else {
        gridTemplateColumns += ' 1fr';
      }
    });
    return gridTemplateColumns += ' 0px';
  }

  _validateDateMobile(i: any, data: any, dataSource: any) {
    return this.validateDateMobile(i, data, dataSource);
  }

  _reload() {
    this.reload.emit();
  }

  toggleExpandable(data) {

    if (this.expandable.length === 0) {
      return;
    }

    const mqLg = window.matchMedia('(min-width: 768px)');
    const mqMd = window.matchMedia('(min-width: 540px) and (max-width: 767px)');
    const mqSm = window.matchMedia('(max-width: 539px)');

    if (mqLg.matches && !this.expandable.find(e => !!e.platform.desktop)) {
      return;
    } else if (mqMd.matches && !this.expandable.find(e => !!e.platform.tablet)) {
      return;
    } else if (mqSm.matches && !this.expandable.find(e => !!e.platform.mobile)) {
      return;
    }

    this._dataSource.forEach(e => {
      if (e === data) {
        data.expandable = !data.expandable;
      } else {
        e.expandable = false;
      }
    });
  }

}
