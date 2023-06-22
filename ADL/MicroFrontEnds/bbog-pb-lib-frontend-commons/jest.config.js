/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

module.exports = {
  verbose: true,
  roots: ['<rootDir>/src'],
  testURL: 'http://localhost:4200',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.json'
    }
  },
  moduleDirectories: ['node_modules', 'test-utils'],
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/jest.setup.js']
};
