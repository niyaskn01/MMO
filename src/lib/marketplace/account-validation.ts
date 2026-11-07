import { z } from 'zod';

export const passwordRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'One capital letter (A–Z)', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One symbol (e.g. #, $, @)', test: (value: string) => /[^A-Za-z0-9\s]/.test(value) },
];

export const signupPassword = z.string().max(128, 'Use no more than 128 characters.')
  .refine(value => passwordRules.every(rule => rule.test(value)), 'Use at least 8 characters, one capital letter and one symbol.');
export const accountEmail = z.string().trim().email('Enter a valid email address.').max(255);
export const signupDetails = z.object({
  displayName: z.string().trim().min(1, 'Enter your name.').max(100),
  email: accountEmail,
  password: signupPassword,
});

export function passwordStrength(value: string) {
  if (!value) return { label: 'Not entered', score: 0 };
  const passed = passwordRules.filter(rule => rule.test(value)).length;
  if (passed < 3) return { label: 'Weak', score: 1 };
  if (value.length >= 12 && /[a-z]/.test(value) && /\d/.test(value)) return { label: 'Strong', score: 3 };
  return { label: 'Good', score: 2 };
}