import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MobileSummary, SummaryHeader, SummaryBody } from '../model/mobile-summary';
import { Events } from 'ionic-angular';

@Injectable()
export class MobileSummaryProvider {

  summary: MobileSummary;

  constructor(
    private events: Events
  ) {
    this.summary = new MobileSummary();
  }
  /**
   * this method receives an object for rendering summary header in mobile
   * @param header object with desired information, to erase or reset pass null
   */
  setHeader(header: SummaryHeader) {
    this.summary.header = header;
    this.events.publish('resize:summary');
  }
  /**
   * this method receives an object for rendering summary body in mobile
   * @param body body object with desired information, to erase or reset pass null
   */
  setBody(body: SummaryBody) {
    this.summary.body = body;
    this.events.publish('resize:summary');
  }
  /**
   * @returns an instance of @class MobileSummary
   */
  getInstance(): MobileSummary {
    return this.summary;
  }
  /**
   * this method reset mobile summary
   */
  reset() {
    this.summary.header = null;
    this.summary.body = null;
    this.events.publish('resize:summary');

  }

}
