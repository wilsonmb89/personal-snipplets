import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { Observable } from 'rxjs/Observable';
import { Favorite } from '../../app/models/social/favorite';
import { ENV } from '@app/env';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';

@Injectable()
export class BdbFavoritesProvider {

    constructor(private httpClient: BdbHttpClient,
        private bdbRsaProvider: BdbRsaProvider
        ) {

    }


    public addFav(favorite: Favorite): Observable<any> {
        return this.favAction('add', favorite);
    }

    public delFav(favorite: Favorite): Observable<any> {
        return this.favAction('remove', favorite);
    }

    private favAction(resouce, favorite: Favorite): Observable<any> {
        favorite.identification =  this.bdbRsaProvider.encrypt(favorite.identification);
        favorite.item =  this.bdbRsaProvider.encrypt(favorite.item);
        return this.httpClient.post(`social/favorites/${resouce}`, favorite, ENV.API_URL)
        .catch((err: HttpErrorResponse) => {
            return this.callResponse(err);
          });
    }

    private callResponse(err): Observable<any> {
      if (err.status === 200) {
        const res = new HttpResponse({
          body: null,
          headers: err.headers,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });

        return Observable.of(res);
      } else {
        return Observable.throw(err);
      }
    }

}
