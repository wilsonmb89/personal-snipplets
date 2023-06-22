import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'Pulse',
  bundles: [
    {
      components: [
        'pulse-button',
        'pulse-flowtt',
        'pulse-flowtm',
        'pulse-flowtr',
        'pulse-card',
        'pulse-input',
        'pulse-fab-button',
        'pulse-switch-button',
        'pulse-tooltip',
        'pulse-checkbox',
        'pulse-radio',
        'pulse-radio-group',
        'pulse-icon',
        'pulse-option',
        'pulse-option-menu',
        'pulse-dropdown'
      ]
    }
  ],
  outputTargets: [
    reactOutputTarget({
      proxiesFile: 'pulse-react/src/components.ts',
      includeDefineCustomElements: false,
    }),
    { type: 'dist' },
    {
      type: 'docs-readme',
      footer: '*Team pulse.io! ⭕*',
    },
    {
      type: 'docs-json',
      file: './docs/core.json'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  globalStyle: 'src/global/settings.scss',
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/variables.scss',
        'src/global/_typography.scss',
        'src/global/settings.scss',
        'src/utils/grid/pulse-flexgrid.scss',
        'src/utils/pulse-grid/grid.scss'
      ]
    })
  ],
  hashFileNames: true
};
