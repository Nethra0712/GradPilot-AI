import React, { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.'),
});

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Waitlist signup form component.
 * Validates the email client-side using Zod, then simulates a successful submission
 * with a 1-second artificial delay and a success confirmation state.
 * No backend connection is made in this sprint.
 */
const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const validate = (value: string): boolean => {
    const result = emailSchema.safeParse({ email: value });
    if (!result.success) {
      setFieldError(result.error.errors[0].message);
      return false;
    }
    setFieldError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(email)) return;

    setStatus('loading');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
  };

  const handleReset = () => {
    setEmail('');
    setFieldError(null);
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-2 animate-fade-up">
        {/* Animated checkmark */}
        <div className="w-14 h-14 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shadow-[0_0_24px_rgba(56,85,255,0.3)]">
          <svg
            className="w-7 h-7 text-brand-400"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <p
            className="text-base font-semibold text-white mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            You&rsquo;re on the list!
          </p>
          <p className="text-sm text-slate-500">
            We&rsquo;ll notify <span className="text-slate-400 font-medium">{email}</span> when we
            launch.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2 mt-1"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Join the GradPilot AI waitlist"
      className="flex flex-col items-center gap-3 w-full max-w-md mx-auto"
    >
      <div className="flex w-full gap-2 flex-col sm:flex-row">
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldError) validate(e.target.value);
            }}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? 'waitlist-email-error' : undefined}
            className={[
              'w-full h-11 bg-slate-900/80 border rounded-xl text-sm text-slate-100 placeholder:text-slate-600',
              'px-4 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500/50',
              fieldError ? 'border-red-500/60' : 'border-slate-800 hover:border-slate-700',
            ].join(' ')}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 h-11 px-6 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all duration-200 shadow-[0_0_16px_rgba(56,85,255,0.35)] hover:shadow-[0_0_24px_rgba(56,85,255,0.5)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[148px]"
        >
          {status === 'loading' ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Joining…</span>
            </>
          ) : (
            'Join the Waitlist'
          )}
        </button>
      </div>

      {fieldError && (
        <p
          id="waitlist-email-error"
          role="alert"
          className="text-xs text-red-400 flex items-center gap-1 self-start sm:pl-1"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {fieldError}
        </p>
      )}

      <p className="text-xs text-slate-600 text-center">
        No credit card required &middot; Early access priority
      </p>
    </form>
  );
};

export default WaitlistForm;
