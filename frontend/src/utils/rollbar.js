import Rollbar from 'rollbar';
import { Provider, useRollbar } from '@rollbar/react';

console.log('Rollbar token:', import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN);

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || 'NO_TOKEN',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
        source_map_enabled: true,
      },
    },
  },
};

const rollbar = new Rollbar(rollbarConfig);

export const RollbarProvider = Provider;
export const rollbarConfigForProvider = rollbarConfig;

export { useRollbar };

export const logError = (error, context = {}) => {
  console.error('Error logged to Rollbar:', error);
  rollbar.error(error, context);
};

export const logInfo = (message, context = {}) => {
  console.info('Info logged to Rollbar:', message);
  rollbar.info(message, context);
};

export const logWarning = (message, context = {}) => {
  console.warn('Warning logged to Rollbar:', message);
  rollbar.warning(message, context);
};

export default rollbar;