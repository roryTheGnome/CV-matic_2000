import { ComponentProps } from 'react'

interface Props extends ComponentProps<'textarea'> {
  inputId: string
  label: string
  name: string
}

export function TextareaField({
  inputId,
  label,
  name,
  rows = 4,
  className = '',
  ...props
}: Props) {
  return (
    <div className="relative mt-2 w-full">
      <textarea
        id={inputId}
        name={name}
        placeholder=" "
        rows={rows}
        className={`peer border-input-border focus:border-primary w-full resize-none border bg-transparent p-2.5 focus:outline-none ${className}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="bg-background text-text-secondary peer-focus:bg-background peer-focus:text-primary pointer-events-none absolute -top-2.5 left-2 px-1 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs"
      >
        {label}
      </label>
    </div>
  )
}
