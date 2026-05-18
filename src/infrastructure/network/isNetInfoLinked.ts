import { NativeModules, TurboModuleRegistry } from 'react-native';

declare const global: { __turboModuleProxy?: unknown };

/** Evita importar o pacote JS quando o módulo nativo não está no binário (crash em nativeInterface). */
export function isNetInfoLinked(): boolean {
  if (global.__turboModuleProxy != null) {
    return TurboModuleRegistry.get('RNCNetInfo') != null;
  }
  return NativeModules.RNCNetInfo != null;
}
