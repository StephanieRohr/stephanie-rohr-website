import { type SubmitEventHandler, useState } from 'react'

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
}

type ContactFormProps = {
  content: ContactFormContent
}

export default function ContactForm({ content }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setSending(true)
    const formData = new FormData(e.currentTarget)
    const body = new URLSearchParams(
      formData as unknown as Record<string, string>,
    ).toString()
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="form-success">
        <p>{content.successMessage || 'Thanks for contacting me!'}</p>
      </div>
    )
  }

  return (
    <form
      className="contact-form"
      name="contact"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="form-intro">
        {content.formIntro || 'OR! Send me a message here!'}
      </p>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="first-name">
            {content.labels?.firstName || 'First Name'}
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            maxLength={100}
            autoComplete="given-name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="last-name">
            {content.labels?.lastName || 'Last Name'}
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            maxLength={100}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="company">{content.labels?.company || 'Company'}</label>
        <input
          type="text"
          id="company"
          name="company"
          maxLength={100}
          autoComplete="organization"
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">
          {content.labels?.email || 'Email'}
          <span className="required">
            {` ${content.requiredIndicator ?? ' *'}`}
          </span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="form-field">
        <label htmlFor="message">{content.labels?.message || 'Message'}</label>
        <textarea id="message" name="message" rows={5} />
      </div>

      <button type="submit" className="btn-submit" disabled={sending}>
        {sending
          ? content.submitButton?.sending || 'Sending...'
          : content.submitButton?.default || 'Click To Send'}
      </button>
    </form>
  )
}
