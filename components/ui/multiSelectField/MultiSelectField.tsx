'use client'

import { ChevronDown, X } from 'lucide-react'
import { ChangeEvent } from 'react'
import { useMultiSelectField } from './_hooks/useMultiSelecrField'
import { MultiSelectFieldMenu } from './MultiSelectFieldMenu'

export interface SelectOption {
  id: string
  name: string
}

interface Props {
  label: string
  inputId: string
  name: string
  value: string
  options: SelectOption[]
  loading?: boolean
  onFocus?: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function MultiSelectField({
  label,
  inputId,
  name,
  value,
  options,
  loading,
  onFocus,
  onChange,
}: Props) {
  const {
    containerRef,
    isOpen,
    isFilled,
    selectedNames,
    disabled,
    handleToggleMenu,
    removeTag,
    toggleOption,
  } = useMultiSelectField({ value, name, onFocus, onChange })

  return (
    <div
      className={`relative mt-2 w-full ${disabled && 'opacity-40'}`}
      ref={containerRef}
    >
      <div
        onClick={disabled ? undefined : handleToggleMenu}
        className={`relative flex min-h-11.5 w-full flex-wrap items-center gap-2 rounded-sm border bg-transparent p-2.5 pr-10 transition-all ${isOpen ? 'border-primary' : 'border-input-border'} ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}
      >
        <label
          htmlFor={inputId}
          className={`text-text-secondary pointer-events-none absolute left-2 px-1 transition-all ${isFilled ? 'bg-background -top-2.5 text-xs' : 'top-2.5 bg-transparent text-base'} ${isOpen ? 'text-primary' : ''} `}
        >
          {label}
        </label>

        {selectedNames.map((name) => (
          <span
            key={name}
            className="bg-text-secondary/35 flex items-center gap-1 rounded-full px-2.5 py-1 text-sm text-white"
          >
            {name}
            <button
              type="button"
              onClick={(e) => removeTag(e, name)}
              className="text-background bg-text-secondary cursor-pointer rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <ChevronDown
          className={`text-input-border absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      <MultiSelectFieldMenu
        isOpen={isOpen}
        options={options}
        selectedNames={selectedNames}
        loading={loading}
        toggleOption={toggleOption}
      />
    </div>
  )
}
