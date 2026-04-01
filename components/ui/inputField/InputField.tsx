"use client"

import { ComponentProps, useState } from "react"
import { ShowPassword } from "./ShowPassword"

interface Props extends ComponentProps<"input"> {
  inputId: string
  label: string
  name: string
}

export function InputField({ inputId, label, name, type, ...props }: Props) {
  const [currentType, setCurrentType] = useState(type)

  return (
    <div className="relative w-full mt-2">
      <input
        id={inputId}
        name={name}
        type={currentType}
        placeholder=" "
        className={`peer w-full border border-input-border bg-transparent p-2.5 focus:border-primary focus:outline-none ${type === "password" && "pr-12"} ${props.className}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="absolute left-2 -top-2.5 px-1 transition-all bg-background text-xs text-text-secondary pointer-events-none peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:text-primary"
      >
        {label}
      </label>

      {type === "password" && (
        <ShowPassword
          currentType={currentType}
          setCurrentType={setCurrentType}
        />
      )}
    </div>
  )
}
