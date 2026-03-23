import { type SubmitEventHandler, useState } from 'react'

import FormField from '../atoms/FormField'

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
        />
      </FormField>

      <FormField htmlFor="message" label={content.labels?.message || 'Message'}>
        <textarea id="message" name="message" rows={5} />
      </FormField>

      <button type="submit" className="btn-submit" disabled={sending}>
        {sending
          ? content.submitButton?.sending || 'Sending...'
          : content.submitButton?.default || 'Click To Send'}
      </button>
    </form>
  )
}
