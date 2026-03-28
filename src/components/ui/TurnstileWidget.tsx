'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="p-4 border border-brand-accent bg-brand-surface rounded text-sm text-brand-muted">
          Turnstile widget placeholder (Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY)
        </div>
      );
    }
    return null;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      options={{ theme: 'light', language: 'en' }}
    />
  );
}
