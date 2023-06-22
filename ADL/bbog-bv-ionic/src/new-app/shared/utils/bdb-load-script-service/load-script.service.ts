import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENV } from '@app/env';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class LoadScriptService {

  constructor(
    private http: HttpClient
  ) {
  }


  public loadCyxteraScript(): void {
    const id = 'cyx-phi-script';
    if (!this.scriptExist(id)) {
      this.getScript('assets/libsjs/cyxtera/cyx-m-script.js').subscribe((data) => {
        this.createScriptNode(id,
          data
            .replace('$ci$', ENV.INJECTABLE_SCRIPTS_KEYS.CYXTERA_SCRIPT_CI)
            .replace('$wi$', ENV.INJECTABLE_SCRIPTS_KEYS.CYXTERA_SCRIPT_WI)
        );
      });
    }
  }


  private createScriptNode(idScript: string, data: string) {
    const node = document.createElement('script');
    node.id = idScript;
    node.textContent = data.toString();
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }


  public addScriptTealium(): void {
    const scriptSrc = `https://tags.tiqcdn.com/utag/adl/bdbogota/${ENV.INJECTABLE_SCRIPTS_KEYS.TEALIUM_SRC_ENV}/utag.sync.js`;
    const scriptId = 'tealium-script';
    if (!this.scriptExist(scriptId)) {
      const node = document.createElement('script');
      node.id = scriptId;
      node.src = scriptSrc;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }


  public loadGTMScripts(): void {
    const ASSET_GTM_HEAD_SCRIPT = 'assets/libsjs/analytics/gtm-head-script.js';
    const ASSET_GTM_BODY = 'assets/libsjs/analytics/gtm-noscript.html';

    const gtmNoscriptId = 'gtm-noscript';
    const gtmScriptId = 'gtm-script';

    if (!this.scriptExist(gtmNoscriptId) && !this.scriptExist(gtmScriptId)) {
      forkJoin(
        this.getScript(ASSET_GTM_HEAD_SCRIPT),
        this.getScript(ASSET_GTM_BODY)
      ).subscribe((data) => {
        this.createScriptNode(gtmScriptId, data[0].replace('$GTM_ID$', ENV.INJECTABLE_SCRIPTS_KEYS.GTM_ID));
          const tagBody = document.createElement('noscript');
          tagBody.id = gtmNoscriptId;
          tagBody.textContent = data[1].replace('$GTM_ID$', ENV.INJECTABLE_SCRIPTS_KEYS.GTM_ID);
          document.body.insertAdjacentElement('afterbegin', tagBody);
      });
    }


  }


  private scriptExist(id: string): boolean {
    return !!document.getElementById(id);
  }


  private getScript(url): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(url, {headers, responseType: 'text'});
  }


}
