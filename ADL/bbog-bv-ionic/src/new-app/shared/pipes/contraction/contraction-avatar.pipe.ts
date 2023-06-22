import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'contractionAvatar' })
export class ContractionAvatarPipe implements PipeTransform {
    transform(value: string): string {

        if (!(!!value)) { return ''; }

        const str = String(value);
        const arrayStr = str.split(' ');

        if (arrayStr.length === 1) {
            return str.substring(0, 2).toUpperCase();
        }

        return `${arrayStr[0].charAt(0)}${arrayStr[1].charAt(0)}`.toUpperCase();
    }
}
