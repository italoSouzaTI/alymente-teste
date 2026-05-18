import { renderHook, act } from '@testing-library/react-native';
import { useOnlineStatus } from '../useOnlineStatus';

const mockSubscribeNetInfo = jest.fn();
jest.mock('@infrastructure/network/netInfoListener', () => ({
  subscribeNetInfo: (cb: (online: boolean) => void) => mockSubscribeNetInfo(cb),
}));

describe('useOnlineStatus', () => {
  beforeEach(() => {
    mockSubscribeNetInfo.mockReset();
    mockSubscribeNetInfo.mockReturnValue(() => {});
  });

  it('retorna true por padrão (estado inicial otimista)', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it('atualiza para false quando o callback é chamado com false', () => {
    let capturedCb: (online: boolean) => void = () => {};
    mockSubscribeNetInfo.mockImplementation((cb: (online: boolean) => void) => {
      capturedCb = cb;
      return () => {};
    });

    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      capturedCb(false);
    });

    expect(result.current).toBe(false);
  });

  it('atualiza para true quando o callback é chamado com true', () => {
    let capturedCb: (online: boolean) => void = () => {};
    mockSubscribeNetInfo.mockImplementation((cb: (online: boolean) => void) => {
      capturedCb = cb;
      return () => {};
    });

    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      capturedCb(false);
    });
    act(() => {
      capturedCb(true);
    });

    expect(result.current).toBe(true);
  });

  it('chama o unsubscribe ao desmontar', () => {
    const unsubscribe = jest.fn();
    mockSubscribeNetInfo.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useOnlineStatus());
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
