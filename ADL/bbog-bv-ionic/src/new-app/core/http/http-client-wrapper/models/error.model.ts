export class CustomError extends Error {

  private _errorType: string;
  private _error: ErrorModel;
  private _status: number;

  get errorType(): string {
    return this._errorType;
  }

  set errorType(value: string) {
    this._errorType = value;
  }

  get error(): any {
    return this._error;
  }

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  set error(value: any) {
    this._error = value;
  }


}

export class ErrorModel {
  public originComponent?: string;
  public backendErrorMessage?: string;
  public businessErrorCode?: string;
  public serverStatusCode?: string;
  public errorMessage?: string;
  public customerErrorMessage?: CustomerErrorMessage;
}

class CustomerErrorMessage {
  public title?: string;
  public message?: string;
  public alertType?: string;
}
