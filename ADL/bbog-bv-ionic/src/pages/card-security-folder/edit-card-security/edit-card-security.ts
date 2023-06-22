import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions, Modal } from 'ionic-angular';
import { BdbMap } from '../../../app/models/bdb-generics/bdb-map';
import { CardSecurityProvider } from '../../../providers/card-security/card-security';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CardSecurity } from '../../../app/models/card-security/card-security-list-rs';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';

@IonicPage({
  segment: 'edit-card-security',
  name: 'edit-card-security'
})
@Component({
  selector: 'page-edit-card-security',
  templateUrl: 'edit-card-security.html',
})
export class EditCardSecurityPage {

  item: CardSecurity;
  index: number;
  callback: any;
  securityLevelList: Array<BdbMap> = [];
  editSecurityForm: FormGroup;
  typeOfNoveltyList: Array<BdbMap> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cardSecurity: CardSecurityProvider,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private bdbModal: BdbModalProvider
  ) {

    this.item = navParams.get('item');
    this.index = navParams.get('index');
    this.callback = this.navParams.get('callback');

    this.securityLevelList = cardSecurity.getSecurityLevel();

    this.editSecurityForm = formBuilder.group({
      securityLevel: ['', [Validators.required]],
      typeOfNovelty: ['', [Validators.required]]
    });

    this.editSecurityForm.controls.securityLevel.valueChanges.subscribe(this.changeSecurityLevel());
    this.editSecurityForm.controls.securityLevel.setValue(navParams.get('securityLevel'));
    this.editSecurityForm.controls.typeOfNovelty.setValue(navParams.get('typeOfNovelty'));

  }

  changeSecurityLevel() {
    return (e) => {
      this.editSecurityForm.controls.typeOfNovelty.setValue('');
      this.typeOfNoveltyList = this.cardSecurity.getTypeOfNovelty().filter(this.cardSecurity.filterTypeOfNovelty(e));
    };
  }

  presentInfo() {
    this.bdbModal.launchInfoBlackModal('InfoCardSecurityPage', () => { });
  }

  submit() {

    const _params = {
      index: this.index,
      securityLevel: this.editSecurityForm.get('securityLevel').value,
      typeOfNovelty: this.editSecurityForm.get('typeOfNovelty').value
    };

    this.callback(_params).then(() => {
      this.navCtrl.pop({
        animation: 'ios'
      });
    });

  }

  ionViewDidLoad() {
  }

}
