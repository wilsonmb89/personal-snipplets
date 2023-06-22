import { InMemoryGeneric } from '../in-memory-generic';
import { SecurePassRq } from '../../../app/models/auth/secure-pass-rq';
import { InMemoryKeys } from '../in-memory.keys';

export class BdbInMemoryKeys {

  static readonly userAuthInfo = new InMemoryGeneric(InMemoryKeys.UserAuthInfo, SecurePassRq);

}
