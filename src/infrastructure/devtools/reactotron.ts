import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { setScreenLogger } from './screenLogger';

export const reactotron = Reactotron.configure({ name: 'GitHub Explorer' })
  .useReactNative({ networking: { ignoreUrls: /symbolicate/ } })
  .setAsyncStorageHandler(AsyncStorage)
  .connect();

reactotron.clear?.();

setScreenLogger((screen) =>
  reactotron.display({
    name: 'NAVIGATION',
    preview: screen,
    value: { screen },
    important: true,
  }),
);
