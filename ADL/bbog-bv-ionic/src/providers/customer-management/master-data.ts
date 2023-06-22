import { BdbMap } from 'app/models/bdb-generics/bdb-map';
import * as occupation from './occupation-list.json';
import * as propertyType from './property-type-list.json';
import * as maritalStatus from './marital-status-list.json';
import * as wayType from './way-type-list.json';
import * as housingType from './housing-type-list.json';
import * as educationLevel from './education-level-list.json';


export class MasterData {

    private readonly emailType: Array<BdbMap> = [
        {
            key: '27',
            value: 'Oficina'
        },
        {
            key: '20002',
            value: 'Personal'
        },
        {
            key: '31',
            value: 'Otros'
        }
    ];

    private readonly phoneType: Array<BdbMap> = [
        {
            key: '11',
            value: 'Oficina'
        },
        {
            key: '12',
            value: 'Celular'
        },
        {
            key: '15',
            value: 'Residencia'
        },
        {
            key: '43',
            value: 'Otros'
        }
    ];

    private readonly addressType: Array<BdbMap> = [
        {
            key: '32',
            value: 'Oficina'
        },
        {
            key: '34',
            value: 'Residencia'
        },
        {
            key: '38',
            value: 'Otros'
        }
    ];

    private readonly areaCode: Array<string> = [
        '051',
        '052',
        '054',
        '055',
        '056',
        '057',
        '058'
    ];

    private readonly annualReport: Array<BdbMap> = [
        {
            key: '1',
            value: 'Fisico'
        },
        {
            key: '2',
            value: 'Correo Electrónico'
        },
        {
            key: '3',
            value: 'Virtual'
        }
    ];

    getWayTypeList(): Array<BdbMap> {
        return JSON.parse(JSON.stringify(wayType));
    }

    getPropertyTypeList(): Array<BdbMap> {
        return JSON.parse(JSON.stringify(propertyType));
    }

    getMaritalStatusList(): Array<BdbMap> {
        return JSON.parse(JSON.stringify(maritalStatus));
    }

    getEducationLevelList(): Array<BdbMap> {
        return JSON.parse(JSON.stringify(educationLevel));
    }

    getOcupationList(): Array<{key: string, value: string, hasSector: boolean}> {
        return JSON.parse(JSON.stringify(occupation));
    }

    getHousingTypeList(): Array<BdbMap> {
        return JSON.parse(JSON.stringify(housingType));
    }

    getEmailTypeList(): Array<BdbMap> {
        return this.emailType;
    }

    getPhoneTypeList(): Array<BdbMap> {
        return this.phoneType;
    }

    getAddressTypeList(): Array<BdbMap> {
        return this.addressType;
    }

    getAreaCodeList(): Array<string> {
        return this.areaCode;
    }

    getAnnualReportList(): Array<BdbMap> {
        return this.annualReport;
    }
}
