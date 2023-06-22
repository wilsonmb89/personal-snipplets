import { Component } from '@angular/core';
import {PulseModalControllerProvider} from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {InMemoryKeys} from '../../../../../../providers/storage/in-memory.keys';
import {BdbInMemoryProvider} from '../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';

@Component({
  selector: 'pocket-same-category',
  templateUrl: 'pocket-same-category.html'
})
export class PocketSameCategoryComponent {
  data: string;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private bdbInMemory: BdbInMemoryProvider,
  ) {
    this.data = this.bdbInMemory.getItemByKey(InMemoryKeys.RepeatedPocket);
  }

  async closeModal() {
    await this.pulseModalCtrl.dismiss();
  }

}
