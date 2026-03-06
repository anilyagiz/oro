import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getGrailClient, getRateLimitStatus, RateLimitError } from '../../ororound/src/lib/grail/client';

// Mock axios for testing
vi.mock('axios', () => {
  const mockAxios = vi.fn();
  mockAxios.create = vi.fn(() => mockAxios);
  mockAxios.isAxiosError = vi.fn((error) => error?.isAxiosError === true);
  mockAxios.get = vi.fn();
  mockAxios.post = vi.fn();
  mockAxios.interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  };
  return { default: mockAxios };
});

describe('GrailClient Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_GRAIL_API_URL = 'https://api.grail.example.com';
    process.env.NEXT_PUBLIC_GRAIL_API_KEY = 'test-api-key';
  });

  describe('singleton pattern', () => {
    it('returns same instance from getGrailClient', () => {
      const client1 = getGrailClient();
      const client2 = getGrailClient();
      
      expect(client1).toBe(client2);
    });
  });

  describe('rate limit status', () => {
    it('returns rate limit status', () => {
      const status = getRateLimitStatus();
      
      expect(status).toHaveProperty('remaining');
      expect(status).toHaveProperty('timeUntilNext');
      expect(typeof status.remaining).toBe('number');
      expect(typeof status.timeUntilNext).toBe('number');
    });
  });

  describe('RateLimitError', () => {
    it('creates error with retryAfterMs', () => {
      const error = new RateLimitError('Rate limit exceeded', 5000);
      
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.retryAfterMs).toBe(5000);
      expect(error.name).toBe('RateLimitError');
    });

    it('creates error with default message', () => {
      const error = new RateLimitError();
      
      expect(error.message).toBe('Rate limit exceeded. Please try again later.');
      expect(error.retryAfterMs).toBe(0);
    });
  });
});