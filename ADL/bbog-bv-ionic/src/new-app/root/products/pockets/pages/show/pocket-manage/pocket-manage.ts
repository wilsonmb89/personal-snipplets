import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { catchError, tap, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { Pocket, ModifyPocketApiRq, ModifyPocketDetailApi, ModifyPocketApiRs } from '../../../models/pocket';
import { NavigationProvider } from '../../../../../../../providers/navigation/navigation';
import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { PocketConfirmDeleteComponent } from '../../../components/pocket-confirm-delete/pocket-confirm-delete';
import * as pocketIcons from '../../../services/pocket-icons.json';
import * as pocketTypes from '../../../services/pocket-types.json';
import { PocketOpsService } from '../../../services';
import { BdbToastOptions } from '../../../../../../../app/models/bdb-toast-options';
import { BdbToastProvider } from '../../../../../../../providers/bdb-toast/bdb-toast';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MinAmmtValidator } from '../../../../../../../validators/minAmmt';
import { isValidName } from '../../../../../../../validators/sameNames';
import { BdbUtilsProvider } from '../../../../../../../providers/bdb-utils/bdb-utils';
import { boxAnimation } from '../../../../../../../components/core/utils/animations/transitions';
import { BdbNormalizeDiacriticDirective } from '../../../../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';

@IonicPage()
@Component({
  selector: 'page-pocket-manage',
  templateUrl: 'pocket-manage.html',
  animations: [boxAnimation]
})
export class PocketManagePage implements OnInit {

  pocketData: Pocket;
  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Administrar';
  pocketIcons = pocketIcons;
  periods: { [key: string]: string }[] = [];
  editPocketName = false;
  withDecimal = false;
  namePocketType = '';
  plannedDate = '';
  newPlannedDate = '';
  pocketTypes: { id: string, name: string, bank_name: string }[] = pocketTypes as any;
  newPocketDetail: ModifyPocketDetailApi;
  formEditName: FormGroup;
  formEditAmount: FormGroup;
  formEditPeriod: FormGroup;

  constructor(
    public navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private navigation: NavigationProvider,
    private pulseModalCtrl: PulseModalControllerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private pocketOps: PocketOpsService,
    private loadingCtrl: LoadingController,
    private bdbToast: BdbToastProvider,
    private bdbUtils: BdbUtilsProvider,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.pocketData = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketData) as Pocket;
    this.newPlannedDate = this.plannedDate = this.getPlannedDate(this.pocketData.pocketEndDate);
    this.namePocketType = this.getNamePocketType(this.pocketData.pocketType);
    this.periods = this.getPeriods();

    this.newPocketDetail = {
      pocketId: this.pocketData.pocketId.substring(this.pocketData.pocketId.length - 4),
      newPocketName: this.pocketData.pocketName,
      newSavingGoal: +this.pocketData.pocketGoal,
      newPocketType: this.getPocketTypeByName(this.pocketData.pocketType),
      newDate: this.getMonthPeriod(this.pocketData.pocketStartDate, this.pocketData.pocketEndDate),
      newPutType: this.pocketData.putType.toString(),
      newDebAutType: this.pocketData.debAutType.toString(),
      newDebitAmount: parseInt(this.pocketData.debitAmount.toString()),
      newDebitDayOne: this.pocketData.debitDayOne.toString(),
      newDebitDayTwo: this.pocketData.debitDayTwo.toString()
    };

    this.buildForms();
  }

  onBackPressed(): void {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onInputKeyUp(ev: KeyboardEvent): void {
    ev.stopPropagation();
    const target = ev.target as any;
    const period = +this.formEditPeriod.value.periods;
    const numberPeriod = +target.value;
    const months = +period === 1 ? numberPeriod : numberPeriod * 12;
    this.newPlannedDate = this.buildPlannedDate(
      this.buildNewPlannedDate(numberPeriod <= 0 ? this.newPocketDetail.newDate : months)
    );
  }

  onChangePeriod(period: string): void {
    const numberPeriod = +this.formEditPeriod.value.number;
    const months = +period === 1 ? numberPeriod : numberPeriod * 12;
    this.newPlannedDate = this.buildPlannedDate(this.buildNewPlannedDate(numberPeriod < 0 ? 0 : months));
  }

  private buildNewPlannedDate(months: number): Date {
    const newDate = this.buildDate(this.pocketData.pocketStartDate);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  private buildForms(): void {
    const pocketName = this.pocketData.pocketName;
    const pocketGoal = this.pocketData.pocketGoal;
    const months = this.newPocketDetail.newDate;

    this.formEditName = new FormGroup({
      name: new FormControl(pocketName, [Validators.required, isValidName(pocketName)])
    });

    this.formEditAmount = new FormGroup({
      amount: new FormControl(pocketGoal, [Validators.required, MinAmmtValidator.isValid,
      Validators.pattern(`^(${pocketGoal}.+|(?!${pocketGoal}).*)$`)])
    });

    this.formEditPeriod = new FormGroup({
      number: new FormControl(months, [
        Validators.required, Validators.pattern('[0-9]*')
      ]),
      periods: new FormControl('1', [Validators.required])
    });

  }

  private capitalize(s: string): string {
    if (typeof s !== 'string') {
      return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private buildDate(date: string): Date {
    const dateArray = date.split('-');
    return new Date(+dateArray[0], +dateArray[1] - 1, +dateArray[2]);
  }

  private getPlannedDate(pocketEndDate: string): string {
    return this.buildPlannedDate(this.buildDate(pocketEndDate));
  }

  private getNamePocketType(bankName: string): string {
    const pocketTypeByBankName = this.pocketTypes
    .find((value: { id: string, name: string, bank_name: string }) => value.bank_name === bankName.toUpperCase());
    return (!!pocketTypeByBankName) ? pocketTypeByBankName.name : '';
  }

  private getPocketTypeByName(bankName: string): string {
    const pocketTypeByName = this.pocketTypes.
    find((value: { id: string, name: string, bank_name: string }) => value.bank_name === bankName);
    return (!!pocketTypeByName) ? pocketTypeByName.id : '';
  }

  private buildPlannedDate(newDate: Date): string {
    const formatter = new Intl.DateTimeFormat('es-CO', { month: 'short' });
    return `${this.capitalize(formatter.format(newDate).substring(0, 3))} ${newDate.getFullYear()}`;
  }

  private monthDiff(d1: Date, d2: Date): number {
    let months: number;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  private getMonthPeriod(startDate: string, endDate: string): number {
    return this.monthDiff(this.buildDate(startDate), this.buildDate(endDate));
  }

  private getPeriods(): { [key: string]: string }[] {
    return [
      { id: '1', name: 'Meses' },
      { id: '2', name: 'Años' }
    ];
  }

  private async reduceAllItems(): Promise<any> {
    await customElements.whenDefined('pulse-list');
    const pulseListElement = document.querySelector('pulse-list');
    await pulseListElement.reduceAllItems();
  }

  toggleEditName(): void {
    this.editPocketName = !this.editPocketName;
  }

  onSubmitEditTitle(): void {
    if (this.formEditName.invalid) {
      return;
    }
    this.newPocketDetail.newPocketName = this.formEditName.value.name;
    this.confirmModify().subscribe(() => {
      this.editPocketName = false;
      this.buildForms();
    });
  }

  onSubmitEditAmount(): void {
    if (this.formEditAmount.invalid) {
      return;
    }
    this.newPocketDetail.newSavingGoal = this.formEditAmount.value.amount;
    this.confirmModify().subscribe(() => {
      this.reduceAllItems();
      this.buildForms();
    });
  }

  onSubmitEditPeriod(): void {
    if (this.formEditPeriod.invalid || this.plannedDate === this.newPlannedDate) {
      return;
    }

    const numberPeriod = +this.formEditPeriod.value.number;
    const period = this.formEditPeriod.value.periods;

    this.newPocketDetail.newDate = +period === 1 ? numberPeriod : numberPeriod * 12;
    this.confirmModify().subscribe(() => {
      this.plannedDate = this.newPlannedDate;
      this.reduceAllItems();
      this.buildForms();
    });
  }

  private confirmModify(): Observable<{} | ModifyPocketApiRs> {
    const modifyPocketApiRq: ModifyPocketApiRq = {
      accountDetail: {
        acctId: this.pocketData.account.productNumber,
        acctType: this.bdbUtils.mapTypeProduct(this.pocketData.account.productType)
      },
      pocketDetail: this.newPocketDetail
    };


    const loader = this.loadingCtrl.create();

    return from(loader.present()).pipe(
      flatMap(() => this.pocketOps.modifyPocket(modifyPocketApiRq).pipe(
        tap(() => {

          this.pocketData.pocketName = this.newPocketDetail.newPocketName;
          this.pocketData.pocketGoal = this.newPocketDetail.newSavingGoal.toString();
          const endDate = this.buildNewPlannedDate(this.newPocketDetail.newDate);
          this.pocketData.pocketEndDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
          this.bdbInMemory.setItemByKey(InMemoryKeys.PocketData, this.pocketData);

          const tempPocketList: { [key: string]: Pocket[] } = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerPocketList);
          const productNumberApi = this.pocketData.account.productNumberApi;
          const pocketsByAccount: Pocket[] = tempPocketList[productNumberApi];
          const index = pocketsByAccount.findIndex((pocket: Pocket) => pocket.pocketId === this.pocketData.pocketId);

          tempPocketList[productNumberApi][index].pocketName = this.pocketData.pocketName;
          tempPocketList[productNumberApi][index].pocketEndDate = this.pocketData.pocketEndDate;
          tempPocketList[productNumberApi][index].pocketGoal = this.pocketData.pocketGoal;

          this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerPocketList, tempPocketList);

          loader.dismiss();
          const successToast: BdbToastOptions = {
            message: 'Los cambios han sido guardados exitosamente.',
            close: true,
            color: 'active-green',
            type: 'success'
          };
          this.bdbToast.showToastGeneric(successToast);
        }),
        catchError(() => {
          loader.dismiss();
          const errorToast: BdbToastOptions = {
            message: 'Error al guardar tus cambios, inténtalo más tarde.',
            close: true,
            color: 'toast-error',
            type: 'delete'
          };
          this.bdbToast.showToastGeneric(errorToast);
          return of();
        })
      ))
    );
  }

  async confirmDelete(): Promise<void> {

    const modal = await this.pulseModalCtrl.create({
      component: PocketConfirmDeleteComponent
    }, this.viewRef, this.resolver);

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!!data && !!data.confirm) {

      const loader = this.loadingCtrl.create();
      loader.present().then(() => {
        this.pocketOps.delPocket(this.pocketData).subscribe(() => {
          this.bdbInMemory.clearItem(InMemoryKeys.CustomerProductList);
          this.bdbInMemory.clearItem(InMemoryKeys.CustomerPocketList);
          loader.dismiss();
          this.navCtrl.setRoot('DashboardPage');
          const successToast: BdbToastOptions = {
            message: 'Tu alcancía ha sido eliminada exitosamente.',
            close: true,
            color: 'active-green',
            type: 'success'
          };
          this.bdbToast.showToastGeneric(successToast);
        }, () => {
          loader.dismiss();
          const errorToast: BdbToastOptions = {
            message: 'Error al eliminar tu alcancía. Intenta más tarde.',
            close: true,
            color: 'toast-error',
            type: 'delete'
          };
          this.bdbToast.showToastGeneric(errorToast);
        });
      });
    }
  }

  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
  }

}
