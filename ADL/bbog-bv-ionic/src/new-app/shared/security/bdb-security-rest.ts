import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { CypheringStrategyModel } from '../../../app/models/security/cyphering-strategy.model';

@Injectable()
export class BdbSecurityRestProvider {

  constructor() {}

  public generateCypheringStrategy(frontPrivateKey, cypherPayload, iv, diffTime): CypheringStrategyModel {
    const cypheringStrategyModel = new CypheringStrategyModel();
    cypheringStrategyModel.aesKey = forge.util.encode64(frontPrivateKey);
    cypheringStrategyModel.timestamp = new Date().getTime() + diffTime;
    const md = forge.md.md5.create();
    md.update(cypherPayload);
    cypheringStrategyModel.hash = md.digest().toHex();
    cypheringStrategyModel.aesInitialVector = forge.util.encode64(iv);
    cypheringStrategyModel.cypherVersion = 4;
    return cypheringStrategyModel;
  }

  public generateFrontPrivateKey(bytes: number) {
    return forge.random.getBytesSync(bytes);
  }

  public generateCypherFrontPrivateKey(frontPrivateKey, frontPublicKey) {
    forge.options.usePureJavaScript = true;
    const publicBackKey = forge.pki.publicKeyFromPem(
      '-----BEGIN RSA PUBLIC KEY-----' +
      frontPublicKey +
      '-----END RSA PUBLIC KEY-----'
    );
    return forge.util.encode64(publicBackKey.encrypt(frontPrivateKey));
  }

  public encryptBody(value, privateKey, iv) {
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

  public decryptBody(value, privateKey, iv) {
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
}
