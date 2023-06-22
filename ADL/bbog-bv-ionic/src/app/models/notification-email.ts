export interface NotificationEmail {
    template: string;
    subject: string;
    eMails: string[];
    parameter: ParameterTypeDto[];
}


export interface ParameterTypeDto {
    name: string;
    value: string;

}
