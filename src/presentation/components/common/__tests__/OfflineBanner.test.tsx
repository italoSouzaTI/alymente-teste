import React from 'react';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { OfflineBanner } from '@components/common/OfflineBanner';

jest.mock('@hooks/useOnlineStatus');
const { useOnlineStatus } = jest.requireMock('@hooks/useOnlineStatus') as {
  useOnlineStatus: jest.Mock;
};

describe('OfflineBanner', () => {
  it('não renderiza nada quando online', () => {
    useOnlineStatus.mockReturnValue(true);
    const { queryByTestId } = renderWithProviders(<OfflineBanner />);
    expect(queryByTestId('offline-banner')).toBeNull();
  });

  it('renderiza o banner quando offline', () => {
    useOnlineStatus.mockReturnValue(false);
    const { getByTestId, getByText } = renderWithProviders(<OfflineBanner />);
    expect(getByTestId('offline-banner')).toBeTruthy();
    expect(getByText('Sem conexão com a internet')).toBeTruthy();
  });
});
