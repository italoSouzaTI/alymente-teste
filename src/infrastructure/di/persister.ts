import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { PersistedClient } from '@tanstack/react-query-persist-client';

// Android CursorWindow limit is ~2MB per row; stay well under it
const MAX_BYTES = 1.4 * 1024 * 1024;

function trimToFit(client: PersistedClient): string {
  const full = JSON.stringify(client);
  if (full.length <= MAX_BYTES) return full;

  // Drop queries from the oldest end until it fits
  const queries = [...client.clientState.queries];
  while (queries.length > 0) {
    queries.shift();
    const candidate = JSON.stringify({
      ...client,
      clientState: { ...client.clientState, queries },
    });
    if (candidate.length <= MAX_BYTES) return candidate;
  }

  // Nothing fits — persist an empty cache rather than crashing
  return JSON.stringify({
    ...client,
    clientState: { ...client.clientState, queries: [] },
  });
}

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'github-explorer-cache',
  throttleTime: 2000,
  serialize: trimToFit,
  deserialize: JSON.parse,
});
