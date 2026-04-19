import { type SubmitEventHandler, useState } from 'react'

import { FormField } from '../atoms/FormField'

type ContactFormContent = {
  formIntro?: string
  labels?: {
    firstName: string
    lastName: string
    company: string
    email: string
    message: string
  }
  requiredIndicator?: string
  submitButton?: {
    default: string
    sending: string
  }
  successMessage?: string
  errorMessage?: string
}

type ContactFormProps = {
  content: ContactFormContent
}

export const ContactForm = ({ content }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const formData = new FormData(e.currentTarget)
      const body = new URLSearchParams(
        formData as unknown as Record<string, string>,
      ).toString()
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      if (!response.ok) {
        throw new Error(`Form submission failed (${response.status})`)
      }
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form submission error:', err)
      setError(
        content.errorMessage ||
          'Something went wrong sending your message. Please try again.',
      )
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="font-heading p-8 text-center text-[1.2rem] text-accent">
        <p>{content.successMessage || 'Thanks for contacting me!'}</p>
      </div>
    )
  }

  return (
    <form
      className="mx-auto max-w-[500px]"
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      {/* Required so Netlify knows which form this submission belongs to. */}
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot: hidden from real users; bots that fill it are silently dropped. */}
      <p hidden>
        <label>
          Don’t fill this out if you’re human:{' '}
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <p className="mb-6 text-center text-base text-muted">
        {content.formIntro || 'OR! Send me a message here!'}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          htmlFor="first-name"
          label={content.labels?.firstName || 'First Name'}
        >
          <input
            type="text"
            id="first-name"
            name="first-name"
            maxLength={100}
            autoComplete="given-name"
            className="form-control"
          />
        </FormField>

        <FormField
          htmlFor="last-name"
          label={content.labels?.lastName || 'Last Name'}
        >
          <input
            type="text"
            id="last-name"
            name="last-name"
            maxLength={100}
            autoComplete="family-name"
            className="form-control"
          />
        </FormField>
      </div>

      <FormField htmlFor="company" label={content.labels?.company || 'Company'}>
        <input
          type="text"
          id="company"
          name="company"
          maxLength={100}
          autoComplete="organization"
          className="form-control"
        />
      </FormField>

      <FormField
        htmlFor="email"
        label={content.labels?.email || 'Email'}
        requiredIndicator={content.requiredIndicator ?? '*'}
      >
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className="form-control"
        />
      </FormField>

      <FormField htmlFor="message" label={content.labels?.message || 'Message'}>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="form-control"
        />
      </FormField>

      {error ? (
        <p
          className="mb-3 text-center text-[0.9rem] text-accent"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="font-heading mt-2 w-full cursor-pointer rounded border-0 bg-accent p-3 text-[0.95rem] font-bold tracking-[0.1em] text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending
          ? content.submitButton?.sending || 'Sending...'
          : content.submitButton?.default || 'Click To Send'}
      </button>
    </form>
  )
}
