export { ImmutableLedger } from './core/ledger';
export { CryptoUtils } from './utils/crypto';
export * from './types';
import { ImmutableLedger } from './core/ledger';

// SDK Version
export const SDK_VERSION = '1.0.0';

// Quick start helper
export function createLedger(aptosRpcUrl: string = 'https://fullnode.testnet.aptoslabs.com/v1') {
  return new ImmutableLedger({ aptosClient: aptosRpcUrl });
}