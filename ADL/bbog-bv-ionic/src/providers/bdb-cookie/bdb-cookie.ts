import { Injectable } from '@angular/core';
import { InMemoryKeys } from '../storage/in-memory.keys';

@Injectable()
export class BdbCookies {

    constructor() { }

    public setCookie(key: InMemoryKeys, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = `${key}=${cvalue};${expires};path=/`;
    }

    public getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        for (const cat of ca) {
            let c = cat;
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    checkCookie(key: InMemoryKeys ): boolean {
        const cook = this.getCookie(key);
        return cook !== '';
    }

}
