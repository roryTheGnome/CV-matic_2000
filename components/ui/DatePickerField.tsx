"use client"

import { CalendarDaysIcon } from "lucide-react"
import { ComponentProps, useState } from "react"

interface Props extends ComponentProps<"input"> {
  label: string
  inputId: string
}

export function DatePickerField({
  label,
  inputId,
  className,
  value,
  onChange,
  ...props
}: Props) {
  const [localHasValue, setLocalHasValue] = useState(false)
  const isFilled = Boolean(value) || localHasValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHasValue(!!e.target.value)
    onChange?.(e)
  }

  return (
    <div className="relative w-full mt-2">
      <input
        id={inputId}
        type="date"
        value={value}
        onChange={handleChange}
        className={`
          peer w-full border border-input-border bg-transparent p-2.5 pr-10 
          focus:border-primary focus:outline-none transition-all
          [&::-webkit-calendar-picker-indicator]:absolute 
          [&::-webkit-calendar-picker-indicator]:right-0 
          [&::-webkit-calendar-picker-indicator]:h-full 
          [&::-webkit-calendar-picker-indicator]:w-10 
          [&::-webkit-calendar-picker-indicator]:cursor-pointer 
          [&::-webkit-calendar-picker-indicator]:opacity-0
          ${!isFilled ? "text-transparent" : "text-current"}
          focus:text-current
          ${className || ""}
        `}
        {...props}
      />

      <label
        htmlFor={inputId}
        className={`
          absolute left-2 px-1 transition-all pointer-events-none text-text-secondary
          ${isFilled ? "-top-2.5 text-xs bg-background" : "top-2.5 text-base bg-transparent"}
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:text-primary
        `}
      >
        {label}
      </label>

      <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
    </div>
  )
}
