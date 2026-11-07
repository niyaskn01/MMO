import { useState } from 'react';
import { Check, Circle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { passwordRules, passwordStrength } from '@/lib/marketplace/account-validation';

export function PasswordField({ value, onChange, signup }: { value: string; onChange: (value: string) => void; signup: boolean }) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(value);
  return <div className="field">
    <label htmlFor="account-password">Password</label>
    <div className="password-input">
      <input id="account-password" name="password" type={visible ? 'text' : 'password'} value={value} onChange={event => onChange(event.target.value)} autoComplete={signup ? 'new-password' : 'current-password'} minLength={signup ? 8 : undefined} maxLength={128} required aria-describedby={signup ? 'password-requirements' : undefined} />
      <Button type="button" variant="ghost" size="icon" aria-label={visible ? 'Hide password' : 'Show password'} title={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</Button>
    </div>
    {signup && <div id="password-requirements" className="password-feedback">
      <div className="flex items-center justify-between"><span>Password strength</span><strong aria-live="polite">{strength.label}</strong></div>
      <div className="password-meter" aria-hidden="true">{[1, 2, 3].map(step => <span key={step} className={strength.score >= step ? 'filled' : ''} />)}</div>
      <ul>{passwordRules.map(rule => { const passed = rule.test(value); return <li key={rule.label} className={passed ? 'text-primary' : 'text-muted-foreground'}>{passed ? <Check size={13} /> : <Circle size={13} />}{rule.label}</li>; })}</ul>
    </div>}
  </div>;
}