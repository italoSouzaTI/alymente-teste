import { useState, useEffect } from 'react';
import { subscribeNetInfo } from '@infrastructure/network/netInfoListener';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    return subscribeNetInfo(setIsOnline);
  }, []);

  return isOnline;
}
