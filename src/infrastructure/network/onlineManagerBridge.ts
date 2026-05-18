import type { NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { isNetInfoLinked } from './isNetInfoLinked';

export function setupOnlineManager(): () => void {
  if (!isNetInfoLinked()) {
    onlineManager.setOnline(true);
    return () => {};
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports -- carregado só com módulo nativo presente
  const mod = require('@react-native-community/netinfo');
  const NetInfo = mod.default ?? mod;

  return NetInfo.addEventListener((state: NetInfoState) => {
    onlineManager.setOnline(state.isConnected ?? false);
  });
}
