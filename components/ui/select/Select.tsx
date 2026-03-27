import { ChevronDown } from "lucide-react"
import { ChangeEvent, ComponentProps } from "react"

interface Props extends ComponentProps<"select"> {
  id: string
  value: string | number | readonly string[] | undefined
  isRequired: boolean
  name: string
  title?: string | undefined
  withLabel?: boolean
  labelTitle?: string
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}

export function Select({
  id,
  value,
  isRequired,
  name,
  title,
  withLabel = false,
  labelTitle,
  handleChange,
  ...props
}: Props) {
  return (
    <div className="relative">
      {withLabel && (
        <label
          htmlFor={id}
          className="absolute -top-1.5 left-3 px-1.5 bg-background text-xs text-gray-400"
        >
          {labelTitle}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full bg-transparent border border-input-border p-3 text-text-primary appearance-none focus:outline-none focus:border-gray-500 transition-colors pr-10"
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
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        size={20}
      />
    </div>
  )
}
