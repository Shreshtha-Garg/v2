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
      <label htmlFor={htmlFor} className="tip-label mb-1 flex items-baseline gap-2">
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
      <div className="py-3" role="status">
        <m.div
          initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
          animate={{ scale: 1, opacity: 1, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          className="inline-block"
        >
          <Stamp className="text-[26px]">Tip received</Stamp>
        </m.div>
        <p className="mt-4 max-w-md font-text text-body leading-normal text-ink">
          Thanks. Your tip is on file, and I’ll reply to the email address you left.
        </p>
        <button type="button" className="ink-btn mt-4" onClick={() => setStatus('idle')}>
          Leave another tip
        </button>
      </div>
    )
  }

  const describedBy = (field: Field) => (errors[field] ? `tip-${field}-error` : undefined)

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
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
      </div>
      <FormRow n="03" label="The tip" htmlFor="tip-message" error={errors.message} errorId="tip-message-error">
        <textarea
          id="tip-message"
          name="message"
          rows={3}
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
      <div className="flex flex-wrap items-center gap-3 pt-0.5">
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
    <div className="grid flex-1 content-center items-start gap-8 px-4 pb-6 pt-7 tab:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] tab:gap-6 tab:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:px-10">
      <section className="clipboard relative mx-auto w-full max-w-[600px] px-2.5 pb-2.5 pt-8 tab:px-3" aria-labelledby="tip-title">
        <span className="clipboard-clip" aria-hidden="true" />
        <div className="form-sheet relative px-4 pb-4 pt-4 lg:px-6">
          <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-1.5">
            <div>
              <p className="font-mono text-small font-bold uppercase tracking-[0.14em] text-[#8c1c1c]">Tip line · Form TL-2027</p>
              <h2 id="tip-title" className="mt-0.5 font-type text-subhead leading-none text-ink">
                Leave a tip
              </h2>
            </div>
            <p className="hidden max-w-[130px] text-right font-mono text-small uppercase leading-snug tracking-[0.08em] text-ink-soft lg:block">
              Goes straight to my inbox
            </p>
          </div>
          <p className="mt-2 font-hand text-[22px] leading-tight text-[#1f3f8a]">
            <span className="tab:hidden">Got a lead? Write it here.</span>
            <span className="hidden tab:inline">Got a lead, a role or a question? Write it here.</span>
          </p>
          <div className="mt-2.5">
            <TipForm />
          </div>
        </div>
      </section>

      <aside className="relative mx-auto w-full max-w-[420px] tab:mt-2">
        <div className="paper-card relative rotate-[1deg] pb-3 pl-[48px] pr-3 pt-6 shadow-paper tab:pb-4 tab:pl-[50px] tab:pr-4 tab:pt-7">
          <span className="pin" style={{ left: '50%', top: 12 }} aria-hidden="true" />
          <p className="typed-label">Or reach me directly</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="py-2 font-mono text-[13px] font-bold text-ink underline decoration-[#1f3f8a] decoration-2 underline-offset-4 tab:py-0"
            >
              {PROFILE.email}
            </a>
            <button type="button" onClick={copyEmail} className="ink-btn px-2 py-0.5">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          {/* Phones get the channels as a block of buttons: the handles don't help there, and the form needs the room. */}
          <div className="mt-2 grid grid-cols-2 gap-1.5 min-[360px]:grid-cols-3 tab:hidden">
            {CHANNELS.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="ink-btn justify-center !px-1 !tracking-normal">
                {c.label}
              </a>
            ))}
            <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="ink-btn ink-btn-solid justify-center !px-1 !tracking-normal">
              Resume
            </a>
          </div>
          <ul className="mt-3 hidden divide-y divide-ink/15 border-y border-ink/15 tab:block">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline justify-between gap-3 py-1.5 text-ink hover:text-[#1f3f8a]"
                >
                  <span className="font-mono text-small font-bold uppercase tracking-[0.08em]">{c.label}</span>
                  <span className="truncate font-type text-[13px]">{c.handle} ↗</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="ink-btn mt-3 hidden tab:inline-flex">
            Resume PDF ↗
          </a>
        </div>
      </aside>
    </div>
  )
}
