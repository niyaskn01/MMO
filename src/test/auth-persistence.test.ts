import { beforeEach, describe, expect, it } from 'vitest';
import { brokeredPreviewStorage } from '@/integrations/supabase/previewAuthStorage';

describe('Persistent browser sign-in storage', () => {
  const key = 'roamly-test-session';
  const value = JSON.stringify({ session: 'test-only-session' });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('keeps the session after a page refresh creates a new storage adapter', async () => {
    const initialStorage = brokeredPreviewStorage();
    expect(initialStorage).toBeDefined();
    await initialStorage?.setItem(key, value);
    const refreshedStorage = brokeredPreviewStorage();
    expect(await refreshedStorage?.getItem(key)).toBe(value);
  });

  it('keeps the session in permanent storage after window-only storage is cleared', async () => {
    await brokeredPreviewStorage()?.setItem(key, value);
    sessionStorage.clear();
    expect(localStorage.getItem(key)).toBe(value);
    expect(await brokeredPreviewStorage()?.getItem(key)).toBe(value);
  });

  it('removes the saved session on explicit sign-out', async () => {
    await brokeredPreviewStorage()?.setItem(key, value);
    await brokeredPreviewStorage()?.removeItem(key);
    expect(localStorage.getItem(key)).toBeNull();
    expect(await brokeredPreviewStorage()?.getItem(key)).toBeNull();
  });
});