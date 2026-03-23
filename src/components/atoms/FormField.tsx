import type { ReactNode } from 'react'

interface FormFieldProps {
  htmlFor: string
  label: string
  requiredIndicator?: string
  children: ReactNode
}

export default function FormField({
  htmlFor,
  label,
  requiredIndicator,
  children,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>
        {label}
        {requiredIndicator ? (
          <span className="required">{` ${requiredIndicator}`}</span>
        ) : null}
      </label>
      {children}
    </div>
  )
}
