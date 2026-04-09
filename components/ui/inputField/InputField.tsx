'use client'

import { ComponentProps, useState } from 'react'
import { ShowPassword } from './ShowPassword'

interface Props extends ComponentProps<'input'> {
  inputId: string
  label: string
  name: string
}

export function InputField({
  inputId,
  label,
  name,
  type,
  className = '',
  ...props
}: Props) {
  const [currentType, setCurrentType] = useState(type)

  return (
    <div className="relative mt-2 h-fit w-full">
      <input
        id={inputId}
        name={name}
        type={currentType}
        placeholder=" "
        className={`peer border-input-border focus:border-primary w-full border bg-transparent p-2.5 focus:outline-none ${type === 'password' && 'pr-12'} ${className}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={`bg-background text-text-secondary peer-focus:bg-background peer-focus:text-primary pointer-events-none absolute -top-2.5 left-2 px-1 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs`}
      >
        {label}
      </label>

      {type === 'password' && (
        <ShowPassword
          currentType={currentType}
          setCurrentType={setCurrentType}
        />
      )}
    </div>
  )
}
