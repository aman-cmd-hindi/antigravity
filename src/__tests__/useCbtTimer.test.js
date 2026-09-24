import { describe, it, expect } from 'vitest';
import { formatTime } from '../hooks/useCbtTimer';

describe('CBT Timer Time-Formatting Utility', () => {
  it('formats 0 seconds into 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats single-digit seconds with leading zero', () => {
    expect(formatTime(7)).toBe('00:07');
  });

  it('formats minutes and seconds below 1 hour as MM:SS', () => {
    expect(formatTime(72)).toBe('01:12');
    expect(formatTime(2160)).toBe('36:00'); // Standard 30 questions * 72 seconds
  });

  it('formats durations >= 1 hour as HH:MM:SS', () => {
    expect(formatTime(3600)).toBe('01:00:00');
    expect(formatTime(5400)).toBe('01:30:00');
    expect(formatTime(10800)).toBe('03:00:00');
  });

  it('gracefully handles negative or NaN input values', () => {
    expect(formatTime(-10)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(undefined)).toBe('00:00');
  });
});
