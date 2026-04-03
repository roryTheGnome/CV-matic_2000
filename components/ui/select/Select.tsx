import { ChevronDown } from "lucide-react"
import { ChangeEvent, ComponentProps } from "react"

interface Props extends ComponentProps<"select"> {
  id: string
  value: string | number | readonly string[] | undefined
  isRequired: boolean
  name: string
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
  title,
  handleChange,
  ...props
}: Props) {
  return (
    <div className="relative h-fit">
      <label
        htmlFor={id}
        className="absolute left-2 -top-2.5 px-1 transition-all bg-background text-xs text-input-border"
      >
        {title}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full bg-background border border-input-border p-3 text-text-primary appearance-none focus:outline-none focus:border-gray-500 transition-colors pr-10"
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
