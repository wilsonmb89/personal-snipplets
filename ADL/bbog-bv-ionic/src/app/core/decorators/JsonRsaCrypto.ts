import { CoreModule } from '../core.module';
import { BdbRsaProvider } from '../../../providers/bdb-rsa/bdb-rsa';

export function jsonRsaCrypto(target: any, key: string) {

    let value = target[key];

    const getter = () => {
        return value;
    };
    const setter = (val) => {
        const bdbRsaProvider = CoreModule.injector.get(BdbRsaProvider);
        value = bdbRsaProvider.encrypt(val);
    };

    Reflect.deleteProperty(target, key);
    Reflect.defineProperty(target, key, {
        get: getter,
        set: setter
    });

}


export function Entity<TFunction extends Function>(target: TFunction): TFunction {
    const toJSON = function (selfObj: Object) {
        const proto = Reflect.getPrototypeOf(selfObj);
        const jsonObj: any = Object.assign({}, selfObj);
        (Object as any).entries((Object as any).getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this)[key];
                        jsonObj[key] = val;
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return Object.assign(jsonObj, selfObj);
    };

    Object.defineProperty(target.prototype, 'toJSON', {
        value: toJSON
    });
    return target;
}


