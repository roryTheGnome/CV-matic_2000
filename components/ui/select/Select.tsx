import { ChevronDown } from 'lucide-react'
import { ChangeEvent, ComponentProps } from 'react'

interface Props extends ComponentProps<'select'> {
  id: string
  value: string | number | readonly string[] | undefined
  name: string
  isRequired?: boolean
  label?: string
  title?: string | undefined
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}

export function Select({
  id,
  value,
  name,
  isRequired = false,
  label,
  title,
  handleChange,
  ...props
}: Props) {
  return (
    <div className="group relative h-fit">
      <label
        htmlFor={id}
        className="bg-background text-text-secondary group-focus-within:text-primary absolute -top-2.5 left-2 z-10 px-1 text-xs transition-colors"
      >
        {label ?? title}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="bg-background border-input-border text-text-primary focus:border-primary hover:border-text-primary w-full appearance-none border p-3 pr-10 transition-colors focus:outline-none"
        required={isRequired}
        {...props}
      >
        {title && (
          <option className="bg-background text-text-primary" value="" disabled>
            {title}
          </option>
        )}
        {props.children}
      </select>
      <ChevronDown
        className="text-text-secondary pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        size={20}
      />
    </div>
  )
}
