import { md as forgeMd, cipher as forgeCipher, util as forgeUtil } from 'node-forge';
import * as bdbSecurityRestProvider from '../utils/rest-encryption-utility';
import { InterceptorRequest, InterceptorResponse } from './encryption.model';

export const toSha256 = (data: string): string => {
  const md = forgeMd.sha256.create();
  md.update(data);
  return md.digest().toHex();
};

export const encrypt = <T>(data: string | Record<string, unknown> | Array<unknown> | T): string => {
  const cipher = forgeCipher.createCipher('AES-ECB', getHashDevice());
  cipher.start();
  cipher.update(forgeUtil.createBuffer(JSON.stringify(data)));
  cipher.finish();
  return cipher.output.data;
};

export const decrypt = <T>(cipherText: string): T | string | Record<string, unknown> | Array<unknown> | null => {
  try {
    const decipher = forgeCipher.createDecipher('AES-ECB', getHashDevice());
    decipher.start();
    decipher.update(forgeUtil.createBuffer(cipherText));
    decipher.finish();
    return parseItem(decipher.output.data);
  } catch (err) {
    return null;
  }
};

export const intercept = ({ request, encryptionData }: InterceptorRequest): InterceptorResponse => {
  const frontPrivateKey = bdbSecurityRestProvider.generateFrontPrivateKey(32);
  const iv = bdbSecurityRestProvider.generateFrontPrivateKey(16);
  const currentBody = request?.body ? request.body : {};
  const encryptedBody = bdbSecurityRestProvider.encryptBody(JSON.stringify(currentBody), frontPrivateKey, iv);
  const cypheringStrategyModel = bdbSecurityRestProvider.generateCypheringStrategy(
    frontPrivateKey,
    encryptedBody,
    iv,
    encryptionData.diffTime
  );
  const cypherFrontPrivateKey = bdbSecurityRestProvider.generateCypherFrontPrivateKey(
    JSON.stringify(cypheringStrategyModel),
    encryptionData.publicKey
  );
  const currentHeaders = request?.headers ? request.headers : {};
  const newHeaders = { ...currentHeaders, stat_ref: `${cypherFrontPrivateKey}` };
  return {
    headers: newHeaders,
    body: encryptedBody,
    decryptBody: (cypherResponse: string) => bdbSecurityRestProvider.decryptBody(cypherResponse, frontPrivateKey, iv)
  };
};

const parseItem = (item: unknown): Record<string, unknown> | null => {
  if (item === null || item === undefined || item === '') {
    return null;
  }
  return JSON.parse(item as string);
};

const getHashDevice = (): string => {
  const hashBaseDevice = getHashFromDevice();
  const md = forgeMd.sha1.create();
  md.update(hashBaseDevice);
  const sha1HashKey = md.digest().getBytes(16);

  return sha1HashKey;
};

const getCanvasProps = (): unknown => {
  return (() => {
    try {
      const canvasVal = document.createElement('canvas');
      const ctx = canvasVal.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?",
          2,
          15
        );
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText(
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?",
          4,
          17
        );
      } else {
        throw 'context es null';
      }

      return canvasVal.toDataURL();
    } catch (error) {
      return error;
    }
  })();
};

const getHashFromDevice = (): string => {
  const { userAgent, language, languages, hardwareConcurrency } = window.navigator;
  const { colorDepth, availWidth, availHeight } = window.screen;
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const touchSupport = 'ontouchstart' in window;
  const canvas = getCanvasProps();

  return JSON.stringify({
    userAgent,
    language,
    languages,
    hardwareConcurrency,
    colorDepth,
    availWidth,
    availHeight,
    timezoneOffset,
    timezone,
    touchSupport,
    canvas
  });
};
