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
    <div className="w-full relative">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <input
        id={inputId}
        className={`w-full bg-transparent border-2 border-input-border p-2.5 focus:outline-none focus:border-primary ${type === "password" && "pr-12"} ${props.className}`}
        type={currentType}
        name={name}
        {...props}
      />
      {type === "password" && (
        <ShowPassword
          currentType={currentType}
          setCurrentType={setCurrentType}
        />
      )}
    </div>
  )
}
