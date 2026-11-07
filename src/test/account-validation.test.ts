import { describe, expect, it } from 'vitest';
import { signupPassword, signupDetails, passwordStrength } from '@/lib/marketplace/account-validation';

describe('Email signup rules', () => {
  it('requires a capital letter', () => {
    expect(signupPassword.safeParse('abcdefgh#').success).toBe(false);
    expect(signupPassword.safeParse('Abcdefgh#').success).toBe(true);
  });
  it('requires a special symbol', () => {
    expect(signupPassword.safeParse('Abcdefgh1').success).toBe(false);
    for (const symbol of ['#', '$', '@']) expect(signupPassword.safeParse(`Abcdefg${symbol}`).success).toBe(true);
  });
  it('requires at least eight characters', () => {
    expect(signupPassword.safeParse('Abcdef#').success).toBe(false);
    expect(signupPassword.safeParse('Abcdefg#').success).toBe(true);
  });
  it('accepts real email addresses, not phone numbers', () => {
    expect(signupDetails.safeParse({ displayName: 'Traveler', email: '9876543210', password: 'Abcdefgh#' }).success).toBe(false);
    expect(signupDetails.safeParse({ displayName: 'Traveler', email: 'traveler@example.com', password: 'Abcdefgh#' }).success).toBe(true);
  });
  it('distinguishes incomplete and strong passwords', () => {
    expect(passwordStrength('abc').score).toBe(1);
    expect(passwordStrength('Abcdefgh#').score).toBe(2);
    expect(passwordStrength('Abcdefghijkl1#').score).toBe(3);
  });
});