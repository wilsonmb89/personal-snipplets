import { createColorClasses } from './themes';
import { Color } from '../interface';

describe('Configuracion de temas', () => {
    it('Crea clases de color especifico', () => {
        const resultOk = {
            'pulse-color': true,
            [`pulse-color-primary`]: true
        }
        let param: Color;
        param= 'primary';
        expect(createColorClasses(param)).toEqual(resultOk);
    })
    it('Color indefinido', () => {        
        expect(createColorClasses(null)).toBe(undefined);
    })
})
