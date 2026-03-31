"use client"

import { ComponentProps } from "react"

interface Props extends ComponentProps<"textarea"> {
  inputId: string
  label: string
  name: string
}

export function TextareaField({
  inputId,
  label,
  name,
  rows = 4,
  ...props
}: Props) {
  return (
    <div className="relative w-full mt-2">
      <textarea
        id={inputId}
        name={name}
        placeholder=" "
        rows={rows}
        className={`
          peer w-full border border-input-border bg-transparent p-2.5 
          focus:border-primary focus:outline-none resize-none ${props.className || ""}
        `}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="
          absolute left-2 -top-2.5 px-1 transition-all 
          bg-background text-xs text-text-secondary pointer-events-none 
          peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent 
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:text-primary
        "
      >
        {label}
      </label>
    </div>
  )
}
