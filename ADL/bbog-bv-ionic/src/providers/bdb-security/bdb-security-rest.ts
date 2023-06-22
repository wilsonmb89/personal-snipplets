import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { CypheringStrategyModel } from '../../app/models/security/cyphering-strategy.model';

/**
Eliminar y cambiar donde se usa por lo del nuevo modulo
 */
@Injectable()
export class BdbSecurityRestProvider {

  constructor(
    private bdbInMemory: BdbInMemoryProvider
  ) {}

  generateCypheringStrategy(frontPrivateKey, cypherPayload, iv) {
    const cypheringStrategyModel = new CypheringStrategyModel();
    cypheringStrategyModel.aesKey = forge.util.encode64(frontPrivateKey);
    cypheringStrategyModel.timestamp = new Date().getTime() + Number(this.bdbInMemory.getItemByKey(InMemoryKeys.ServerDiffTime));
    const md = forge.md.md5.create();
    md.update(cypherPayload);
    cypheringStrategyModel.hash = md.digest().toHex();
    cypheringStrategyModel.aesInitialVector = forge.util.encode64(iv);
    cypheringStrategyModel.cypherVersion = 4;
    return cypheringStrategyModel;
  }

  generateFrontPrivateKey(bytes: number) {
    return forge.random.getBytesSync(bytes);
  }

  generateCypherFrontPrivateKey(frontPrivateKey) {
    forge.options.usePureJavaScript = true;
    const publicBackKey = forge.pki.publicKeyFromPem(
      '-----BEGIN RSA PUBLIC KEY-----' +
      this.bdbInMemory.getItemByKey(InMemoryKeys.PublicKeyBack) +
      '-----END RSA PUBLIC KEY-----'
    );
    return forge.util.encode64(publicBackKey.encrypt(frontPrivateKey));
  }

  encrypt(value, privateKey, iv) {
    const cipher = forge.cipher.createCipher(
      'AES-CBC',
      privateKey
    );
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(value, 'utf8'));
    cipher.finish();
    let encrypted = cipher.output;
    encrypted = forge.util.encode64(encrypted.data);
    return encrypted;
  }

  desencrypt(value, privateKey, iv) {
    value = forge.util.decode64(value);
    const decipher = forge.cipher.createDecipher(
      'AES-CBC',
      privateKey
    );
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(value));
    decipher.finish();
    const decrypted = decipher.output.data;
    const str = forge.util.decodeUtf8(decrypted.toString());
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error(error);
      return str;
    }
  }

  storePublickKey(publicKey) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.PublicKeyBack, publicKey.body);
    const serverDiffTime = Number(publicKey.headers.get('Last-Modified')) - new Date().getTime();
    this.bdbInMemory.setItemByKey(InMemoryKeys.ServerDiffTime, serverDiffTime);
  }

}
