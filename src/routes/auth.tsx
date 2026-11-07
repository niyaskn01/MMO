import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getAccountAccess } from '@/lib/marketplace/data.functions';
import { accountDestination } from '@/lib/marketplace/availability';
import { accountEmail, signupDetails } from '@/lib/marketplace/account-validation';
import { supabase } from '@/integrations/supabase/client';
import { meta } from '@/lib/marketplace/assets';
import { Button } from '@/components/ui/button';
import { PasswordField } from '@/components/marketplace/password-field';

export const Route = createFileRoute('/auth')({staticData:{sitemap:false}, head: () => meta('Welcome to meetmeoutside', 'Sign in or create your meetmeoutside travel account.'), component: Auth });
function Auth() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const access = useServerFn(getAccountAccess);
  const routing = useRef(false);
  async function goToAccount() {
    if (routing.current) return;
    routing.current = true;
    try { const result = await access(); await navigate({ to: accountDestination(result.admin), replace: true }); }
    catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to open your account.'); }
    finally { routing.current = false; }
  }
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active && data.user) void goToAccount(); });
    return () => { active = false; };
  }, []);
  function changeMode(next: typeof mode) { setMode(next); setPassword(''); setMessage(''); }
  return <main className="container-site"><div className="auth-panel">
    <h1>{mode === 'signup' ? 'A new adventure starts here.' : mode === 'reset' ? 'Reset your password' : 'Welcome back.'}</h1>
    <p>{mode === 'signup' ? 'Create your meetmeoutside account.' : mode === 'reset' ? 'Receive a password reset link by email.' : 'Sign in to your travel account.'}</p>
    {/* <form onSubmit={async event => {
      event.preventDefault(); setBusy(true); setMessage('');
      const form = new FormData(event.currentTarget);
      try {
        const emailResult = accountEmail.safeParse(String(form.get('email')));
        if (!emailResult.success) { setMessage(emailResult.error.issues[0]?.message ?? 'Enter a valid email.'); return; }
        const email = emailResult.data;
        if (mode === 'reset') {
          const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' });
          if (result.error) throw result.error;
          setMessage('Check your email for a reset link.');
        } else if (mode === 'signup') {
          const details = signupDetails.safeParse({ email, password, displayName: String(form.get('displayName')) });
          if (!details.success) { setMessage(details.error.issues[0]?.message ?? 'Check your account details.'); return; }
          const result = await supabase.auth.signUp({ email, password: details.data.password, options: { emailRedirectTo: window.location.origin, data: { display_name: details.data.displayName } } });
          if (result.error) throw result.error;
          setPassword('');
          setMessage('Check your email to confirm your account before signing in.');
        } else {
          const result = await supabase.auth.signInWithPassword({ email, password });
          if (result.error) throw result.error;
          await goToAccount();
        }
      } catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to continue.'); }
      finally { setBusy(false); }
    }}>
      {mode === 'signup' && <label className="field">Your name<input name="displayName" autoComplete="name" maxLength={100} required /></label>}
      <label className="field">Email<input type="email" name="email" autoComplete="email" maxLength={255} required /></label>
      {mode !== 'reset' && <PasswordField key={mode} value={password} onChange={setPassword} signup={mode === 'signup'} />}
      <Button disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}</Button>
      {message && <p role="status">{message}</p>}
    </form> */}
    {mode !== 'reset' && <>
    {/* <p className="text-center my-4">or</p> */}
    
<Button type="button" variant="outline" className="w-full" disabled={busy} onClick={async () => {
  setBusy(true);
  setMessage('');

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth',
      },
    });

    if (error) throw error;

  } catch (err) {
    setMessage(err instanceof Error ? err.message : 'Unable to continue with Google. Please try again.');
  } finally {
    setBusy(false);
  }
}}>Continue with Google</Button>
</>}
    <div className="flex flex-wrap justify-between mt-5">
      <Button type="button" variant="link" size="sm" disabled={busy} onClick={() => changeMode(mode === 'signup' ? 'login' : 'signup')}>{mode === 'signup' ? 'Already have an account?' : 'Create an account'}</Button>
      <Button type="button" variant="link" size="sm" disabled={busy} onClick={() => changeMode(mode === 'reset' ? 'login' : 'reset')}>{mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}</Button>
    </div>
    <p className="mt-5"><Link to="/">Back to exploring</Link></p>
  </div></main>;
}
