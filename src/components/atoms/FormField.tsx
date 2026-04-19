import type { ReactNode } from 'react'

interface FormFieldProps {
  htmlFor: string
  label: string
  requiredIndicator?: string
  children: ReactNode
}

export const FormField = ({
  htmlFor,
  label,
  requiredIndicator,
  children,
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="font-heading mb-[0.35rem] block text-[0.85rem] tracking-[0.05em] text-muted"
      >
        {label}
        {requiredIndicator ? (
          <span className="text-accent">{` ${requiredIndicator}`}</span>
        ) : null}
      </label>
      {children}
    </div>
  )
}
