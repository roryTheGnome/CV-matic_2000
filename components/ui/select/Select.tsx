import { ChevronDown } from 'lucide-react'
import { ChangeEvent, ComponentProps } from 'react'

interface Props extends ComponentProps<'select'> {
  id: string
  value: string | number | readonly string[] | undefined
  isRequired: boolean
  name: string
  lable?: string
  title?: string | undefined
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}

export function Select({
  id,
  value,
  isRequired,
  name,
  lable,
  title,
  handleChange,
  ...props
}: Props) {
  return (
    <div className="relative h-fit">
      <label
        htmlFor={id}
        className="bg-background text-input-border absolute -top-2.5 left-2 px-1 text-xs transition-all"
      >
        {lable ?? title}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="bg-background border-input-border text-text-primary w-full appearance-none border p-3 pr-10 transition-colors focus:border-gray-500 focus:outline-none"
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
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
        size={20}
      />
    </div>
  )
}
