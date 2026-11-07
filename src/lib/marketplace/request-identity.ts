export function requestIdentity(user: {email?: string | undefined} | null) {
  if (!user?.email) throw new Error('Please sign in with an email account to submit a request.');
  const name = user.email.split('@')[0];
  if (!name) throw new Error('Your account needs a valid email to submit a request.');
  return {name, email: user.email};
}