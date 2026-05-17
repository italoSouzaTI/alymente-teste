import {
  RateLimitError,
  NetworkError,
  NotFoundError,
  UnknownApiError,
} from '@domain/errors/GitHubErrors';

describe('GitHubErrors', () => {
  describe('RateLimitError', () => {
    it('is an instance of Error', () => {
      expect(new RateLimitError()).toBeInstanceOf(Error);
    });

    it('has correct name', () => {
      expect(new RateLimitError().name).toBe('RateLimitError');
    });

    it('has a message', () => {
      expect(new RateLimitError().message).toBeTruthy();
    });
  });

  describe('NetworkError', () => {
    it('is an instance of Error', () => {
      expect(new NetworkError()).toBeInstanceOf(Error);
    });

    it('has correct name', () => {
      expect(new NetworkError().name).toBe('NetworkError');
    });

    it('has a message', () => {
      expect(new NetworkError().message).toBeTruthy();
    });
  });

  describe('NotFoundError', () => {
    it('is an instance of Error', () => {
      expect(new NotFoundError()).toBeInstanceOf(Error);
    });

    it('has correct name', () => {
      expect(new NotFoundError().name).toBe('NotFoundError');
    });

    it('has a message', () => {
      expect(new NotFoundError().message).toBeTruthy();
    });
  });

  describe('UnknownApiError', () => {
    it('is an instance of Error', () => {
      expect(new UnknownApiError()).toBeInstanceOf(Error);
    });

    it('has correct name', () => {
      expect(new UnknownApiError().name).toBe('UnknownApiError');
    });

    it('stores statusCode in message when provided', () => {
      const error = new UnknownApiError(404);
      expect(error.message).toContain('404');
    });

    it('works without statusCode', () => {
      const error = new UnknownApiError();
      expect(error.message).toBeTruthy();
    });
  });
});
