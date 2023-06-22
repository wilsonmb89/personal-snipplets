import { util as forgeUtil, cipher as forgeCipher, random, md as forgeMd, pki } from 'node-forge';

export interface CypheringStrategy {
  aesKey: string;
  hash: string;
  aesInitialVector: string;
  timestamp?: number;
  cypherVersion?: number;
}

export function generateCypheringStrategy(
  frontPrivateKey: string,
  cypherPayload: string,
  iv: string,
  diffTime: number
): CypheringStrategy {
  const cypheringStrategyModel: CypheringStrategy = {
    aesKey: '',
    hash: '',
    aesInitialVector: ''
  };
  cypheringStrategyModel.aesKey = forgeUtil.encode64(frontPrivateKey);
  cypheringStrategyModel.timestamp = new Date().getTime() + diffTime;
  const md = forgeMd.md5.create();
  md.update(cypherPayload);
  cypheringStrategyModel.hash = md.digest().toHex();
  cypheringStrategyModel.aesInitialVector = forgeUtil.encode64(iv);
  cypheringStrategyModel.cypherVersion = 4;
  return cypheringStrategyModel;
}

export function generateFrontPrivateKey(bytes: number): string {
  return random.getBytesSync(bytes);
}

export function generateCypherFrontPrivateKey(frontPrivateKey: string, frontPublicKey: string): string {
  const publicBackKey = pki.publicKeyFromPem(
    '-----BEGIN RSA PUBLIC KEY-----' + frontPublicKey + '-----END RSA PUBLIC KEY-----'
  );
  return forgeUtil.encode64(publicBackKey.encrypt(frontPrivateKey));
}

export function encryptBody(value: string, privateKey: string, iv: string): string {
  const cipher = forgeCipher.createCipher('AES-CBC', privateKey);
  cipher.start({ iv });
  cipher.update(forgeUtil.createBuffer(value, 'utf8'));
  cipher.finish();
  const output = cipher.output;
  const encrypted = forgeUtil.encode64(output.data);
  return encrypted;
}

export function decryptBody(value: string, privateKey: string, iv: string): Record<string, unknown> | null {
  value = forgeUtil.decode64(value);
  const decipher = forgeCipher.createDecipher('AES-CBC', privateKey);
  decipher.start({ iv });
  decipher.update(forgeUtil.createBuffer(value));
  decipher.finish();
  const decrypted = decipher.output.data;
  const str = forgeUtil.decodeUtf8(decrypted.toString());
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error(error);
    return null;
  }
}
