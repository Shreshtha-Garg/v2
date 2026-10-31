// Contact as the tip line: a printed tip form clipped to a clipboard on the cork, and a pinned card
// with every direct channel beside it.
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { LINKS, PROFILE, TIP_FORM_ENDPOINT } from '../../data/caseFile'
import { Stamp } from './shared'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Field = 'name' | 'email' | 'message'

const EMPTY = { name: '', email: '', message: '', company: '' }

function FormRow({
  n,
  label,
  htmlFor,
  note,
  error,
  errorId,
  children,
}: {
  n: string
  label: string
  htmlFor: string
  note?: string
  error?: string
  errorId?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="tip-label mb-1.5 flex items-baseline gap-2">
        <span className="text-[#8c1c1c]">{n}</span>
        <span>{label}</span>
        {note && <span className="font-normal normal-case tracking-normal text-ink-soft">{note}</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] text-[#b0141b]">
          {error}
        </p>
      )}
    </div>
  )
}

function TipForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (field in errors) setErrors((err) => ({ ...err, [field]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found: Partial<Record<Field, string>> = {}
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) found.email = 'Enter an email address so I can reply.'
    if (values.message.trim().length === 0) found.message = 'Write a short message first.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')
    try {
      const res = await fetch(TIP_FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: 'Tip line: new message from your portfolio',
          // Formspree's honeypot: people never see this field, bots fill it in.
          _gotcha: values.company,
        }),
      })
      if (!res.ok) throw new Error(`Formspree returned ${res.status}`)
      setStatus('sent')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="py-6" role="status">
        <m.div
          initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
          animate={{ scale: 1, opacity: 1, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          className="inline-block"
        >
          <Stamp className="text-[34px]">Tip received</Stamp>
        </m.div>
        <p className="mt-6 max-w-md font-text text-[18px] leading-relaxed text-ink">
          Thanks. Your tip is on file, and I’ll reply to the email address you left.
        </p>
        <button type="button" className="ink-btn mt-6" onClick={() => setStatus('idle')}>
          Leave another tip
        </button>
      </div>
    )
  }

  const describedBy = (field: Field) => (errors[field] ? `tip-${field}-error` : undefined)

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormRow n="01" label="Your name" note="(optional)" htmlFor="tip-name">
        <input
          id="tip-name"
          name="name"
          autoComplete="name"
          className="tip-input"
          placeholder="Priya from Acme"
          value={values.name}
          onChange={update('name')}
        />
      </FormRow>
      <FormRow n="02" label="Email for a reply" htmlFor="tip-email" error={errors.email} errorId="tip-email-error">
        <input
          id="tip-email"
          name="email"
          type="email"
          autoComplete="email"
          className="tip-input"
          placeholder="name@company.com"
          value={values.email}
          onChange={update('email')}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy('email')}
        />
      </FormRow>
      <FormRow n="03" label="The tip" htmlFor="tip-message" error={errors.message} errorId="tip-message-error">
        <textarea
          id="tip-message"
          name="message"
          rows={5}
          className="tip-input"
          placeholder="We’re hiring a backend engineer and liked ClickON."
          value={values.message}
          onChange={update('message')}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy('message')}
        />
      </FormRow>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
        value={values.company}
        onChange={update('company')}
      />
      <div className="flex flex-wrap items-center gap-4 border-t border-dashed border-ink/30 pt-5">
        <button type="submit" className="file-btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Filing…' : 'File the tip'}
          <span aria-hidden="true">→</span>
        </button>
        <AnimatePresence>
          {status === 'error' && (
            <m.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[14px] text-[#b0141b]"
            >
              That didn’t go through. Email me at{' '}
              <a href={`mailto:${PROFILE.email}`} className="underline">
                {PROFILE.email}
              </a>{' '}
              instead.
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}

const CHANNELS = [
  { label: 'LinkedIn', href: LINKS.linkedin, handle: 'shreshth-garg' },
  { label: 'GitHub', href: LINKS.github, handle: 'Shreshtha-Garg' },
  { label: 'LeetCode', href: LINKS.leetcode, handle: 'ShreshthaGarg037' },
  { label: 'Codeforces', href: LINKS.codeforces, handle: 'ShreshthaGarg037' },
  { label: 'CodeChef', href: LINKS.codechef, handle: 'raghavgarg037' },
]

export function ContactView() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard access can be blocked; the mailto link still works.
    }
  }

  return (
    <div className="grid items-start gap-12 px-4 pb-12 pt-12 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section className="clipboard relative mx-auto w-full max-w-[600px] px-3 pb-4 pt-10 sm:px-4" aria-labelledby="tip-title">
        <span className="clipboard-clip" aria-hidden="true" />
        <div className="form-sheet relative px-5 pb-7 pt-7 sm:px-8">
          <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-3">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#8c1c1c]">Tip line · Form TL-2027</p>
              <h2 id="tip-title" className="mt-1 font-type text-[30px] leading-none text-ink sm:text-[34px]">
                Leave a tip
              </h2>
            </div>
            <p className="hidden max-w-[150px] text-right font-mono text-[11px] uppercase leading-snug tracking-[0.14em] text-ink-soft sm:block">
              Goes straight to my inbox
            </p>
          </div>
          <p className="mt-4 font-hand text-[26px] leading-tight text-[#1f3f8a]">Got a lead, a role or a question? Write it here.</p>
          <div className="mt-5">
            <TipForm />
          </div>
        </div>
      </section>

      <aside className="relative mx-auto w-full max-w-[420px] lg:mt-8">
        <div className="paper-card relative rotate-[1.2deg] pb-6 pl-[56px] pr-6 pt-9 shadow-paper">
          <span className="pin" style={{ left: '50%', top: 12 }} aria-hidden="true" />
          <p className="typed-label">Or reach me directly</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="font-mono text-[15px] font-bold text-ink underline decoration-[#1f3f8a] decoration-2 underline-offset-4"
            >
              {PROFILE.email}
            </a>
            <button type="button" onClick={copyEmail} className="ink-btn px-2.5 py-1 text-[11px]">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <ul className="mt-5 divide-y divide-ink/15 border-y border-ink/15">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline justify-between gap-4 py-2.5 text-ink hover:text-[#1f3f8a]"
                >
                  <span className="font-mono text-[12px] font-bold uppercase tracking-[0.16em]">{c.label}</span>
                  <span className="truncate font-type text-[14px]">{c.handle} ↗</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="ink-btn mt-5">
            Resume PDF ↗
          </a>
        </div>
      </aside>
    </div>
  )
}
