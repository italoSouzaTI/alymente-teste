import type { NetInfoState } from '@react-native-community/netinfo';
import { isNetInfoLinked } from './isNetInfoLinked';

export function subscribeNetInfo(cb: (online: boolean) => void): () => void {
  if (!isNetInfoLinked()) {
    cb(true);
    return () => {};
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports -- carregado só com módulo nativo presente
  const mod = require('@react-native-community/netinfo');
  const NetInfo = mod.default ?? mod;

  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    cb(state.isConnected ?? false);
  });
  return unsubscribe;
}
