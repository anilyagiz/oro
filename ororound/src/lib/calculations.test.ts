import { describe, it, expect } from 'vitest';
import { roundUp, formatUSDC, formatGold } from './calculations';

describe('roundUp', () => {
  describe('with increment of 1', () => {
    it('rounds 4.25 up to 5 with difference of 0.75', () => {
      const result = roundUp(4.25, 1);
      expect(result.roundedAmount).toBe(5);
      expect(result.difference).toBeCloseTo(0.75);
    });

    it('returns 0 difference for exact amounts', () => {
      const result = roundUp(5, 1);
      expect(result.roundedAmount).toBe(5);
      expect(result.difference).toBe(0);
    });

    it('rounds up to next whole number', () => {
      const result = roundUp(4.01, 1);
      expect(result.roundedAmount).toBe(5);
      expect(result.difference).toBeCloseTo(0.99);
    });
  });

  describe('with increment of 5', () => {
    it('rounds 4.25 up to 5 with difference of 0.75', () => {
      const result = roundUp(4.25, 5);
      expect(result.roundedAmount).toBe(5);
      expect(result.difference).toBeCloseTo(0.75);
    });

    it('rounds 12.50 up to 15 with difference of 2.50', () => {
      const result = roundUp(12.5, 5);
      expect(result.roundedAmount).toBe(15);
      expect(result.difference).toBeCloseTo(2.5);
    });

    it('returns 0 difference for exact multiples', () => {
      const result = roundUp(10, 5);
      expect(result.roundedAmount).toBe(10);
      expect(result.difference).toBe(0);
    });
  });

  describe('with increment of 10', () => {
    it('rounds 4.25 up to 10 with difference of 5.75', () => {
      const result = roundUp(4.25, 10);
      expect(result.roundedAmount).toBe(10);
      expect(result.difference).toBeCloseTo(5.75);
    });

    it('rounds 15.01 up to 20 with difference of 4.99', () => {
      const result = roundUp(15.01, 10);
      expect(result.roundedAmount).toBe(20);
      expect(result.difference).toBeCloseTo(4.99);
    });

    it('returns 0 difference for exact multiples', () => {
      const result = roundUp(20, 10);
      expect(result.roundedAmount).toBe(20);
      expect(result.difference).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for amount of 0', () => {
      const result = roundUp(0, 1);
      expect(result.roundedAmount).toBe(0);
      expect(result.difference).toBe(0);
    });

    it('throws error for negative amounts', () => {
      expect(() => roundUp(-1, 1)).toThrow('Amount must be non-negative');
    });

    it('handles floating point precision correctly', () => {
      const result = roundUp(0.1 + 0.2, 1);
      expect(result.roundedAmount).toBe(1);
      expect(result.difference).toBeCloseTo(0.7, 10);
    });
  });
});

describe('formatUSDC', () => {
  it('formats a number as USD currency', () => {
    expect(formatUSDC(1234.56)).toBe('$1,234.56');
  });

  it('handles small amounts', () => {
    expect(formatUSDC(0.01)).toBe('$0.01');
  });

  it('handles large amounts', () => {
    expect(formatUSDC(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatGold', () => {
  it('formats a number as GOLD with 6 decimal places', () => {
    expect(formatGold(0.123456789)).toBe('0.123457 GOLD');
  });

  it('handles small amounts', () => {
    expect(formatGold(0.000001)).toBe('0.000001 GOLD');
  });

  it('handles whole amounts', () => {
    expect(formatGold(1)).toBe('1.000000 GOLD');
  });
});
