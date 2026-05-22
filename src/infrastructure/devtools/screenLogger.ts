type ScreenLogger = (screen: string) => void;
let logger: ScreenLogger | undefined;

export function setScreenLogger(fn: ScreenLogger) {
  logger = fn;
}

export function logScreen(name?: string) {
  if (name) logger?.(name);
}
