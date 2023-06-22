import { RootState } from '@store/index';
import { Dispatch } from '@reduxjs/toolkit';
import { loadingHandler } from '@store/loader/loader.store';
import { setSecureKeyApi } from './set-secure-key.api';
import { getFPData } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';

interface FPData {
  Identifiers: {
    unanimity1: string;
  };
}

export const createKey = (secureKey: string): (() => Promise<void>) => {
  const fetch = async (_dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const deviceUid = (await getFPData()) as FPData;
    const flowData = state.customerState.flowData;
    const isRegister = flowData.flow === 'register';
    await setSecureKeyApi({ secureKey, deviceUid: deviceUid.Identifiers.unanimity1 }, isRegister);
  };
  return loadingHandler.bind(null, fetch);
};
