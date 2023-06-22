import React, { useEffect, useState } from 'react';
import styles from './Version.module.scss';
import { version } from '../../../package.json';

const importMicrofrontendVersion = async (versionImport: Promise<{ default: string }>): Promise<string> => {
  const errorMessage = 'N/A';
  try {
    const version = await versionImport;
    return typeof version.default === 'string' ? version.default : errorMessage;
  } catch (error) {
    return errorMessage;
  }
};

const Version = (): JSX.Element => {
  const [legacyAppVersion, setLegacyAppVersion] = useState(null);
  const [settingsAppVersion, setSettingsAppVersion] = useState(null);
  const [customerAssistanceAppVersion, setCustomerAssistanceAppVersion] = useState(null);
  const [transfersAppVersion, setTransfersAppVersion] = useState(null);
  const [authenticationAppVersion, setAuthenticationAppVersion] = useState(null);

  useEffect(() => {
    importMicrofrontendVersion(import('legacyApp/version')).then(setLegacyAppVersion);
    importMicrofrontendVersion(import('settingsApp/version')).then(setSettingsAppVersion);
    importMicrofrontendVersion(import('customerAssistanceApp/version')).then(setCustomerAssistanceAppVersion);
    importMicrofrontendVersion(import('transfersApp/version')).then(setTransfersAppVersion);
    importMicrofrontendVersion(import('authenticationApp/version')).then(setAuthenticationAppVersion);
  }, []);

  return (
    <div className={`${styles.content}`}>
      <button className={styles.toggle}></button>
      <ul className={styles.list}>
        <li className={styles.item}>
          <span>Shell:</span> {version}
        </li>
        <li className={styles.item}>
          <span>LegacyApp:</span> {legacyAppVersion}
        </li>
        <li className={styles.item}>
          <span>SettingsApp:</span> {settingsAppVersion}
        </li>
        <li className={styles.item}>
          <span>CustomerAssistanceApp:</span> {customerAssistanceAppVersion}
        </li>
        <li className={styles.item}>
          <span>TransfersApp:</span> {transfersAppVersion}
        </li>
        <li className={styles.item}>
          <span>AuthenticationApp:</span> {authenticationAppVersion}
        </li>
      </ul>
    </div>
  );
};

export default Version;
