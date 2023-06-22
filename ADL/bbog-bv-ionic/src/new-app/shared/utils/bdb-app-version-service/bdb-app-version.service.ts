import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Injectable()
export class BdbAppVersionService {
  appVersion$: Observable<string>;
  private appVersionSubject$: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.appVersionSubject$ = new BehaviorSubject<string>('');
    this.appVersion$ = this.appVersionSubject$.asObservable();
    this.fetchAppVersion().subscribe();
  }

  private fetchAppVersion(): Observable<void> {
    return this.http.get('assets/version.json').pipe(
      tap((versionFile: any) => this.appVersionSubject$.next(versionFile.version))
    );
  }
}
