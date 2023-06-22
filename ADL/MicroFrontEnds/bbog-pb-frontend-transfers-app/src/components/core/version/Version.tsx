import React from 'react';
import styles from './Version.module.scss';
import version from '../../../version';

const Version = ({ backgroundColor = '--sherpa-midnight-50' }): JSX.Element => (
  <div
    className={`${styles['container']} sherpa-typography-caption-1`}
    style={{ backgroundColor: `var(${backgroundColor})` }}
  >{`v.${version}`}</div>
);

export default Version;
