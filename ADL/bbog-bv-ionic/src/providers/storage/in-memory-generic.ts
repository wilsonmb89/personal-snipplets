import { InMemoryKeys } from './in-memory.keys';

export class InMemoryGeneric<T> {

  constructor(public key: InMemoryKeys, public dataType: T) {

  }

}
