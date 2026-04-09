'use client'

import { ChevronDown, X } from 'lucide-react'
import { useSearchableSelect } from './_hooks/useSearchableSelect'
import { SearchableSelectMenu } from './SearchableSelectMenu'

export interface SelectOption {
  label: string
  value: string
}

interface SearchableSelectProps {
  inputId: string
  label: string
  name: string
  value: string
  options: SelectOption[]
  required?: boolean
  className?: string
  disabled?: boolean
  onChange: (e: { target: { name: string; value: string } }) => void
}

export function SearchableSelect({
  inputId,
  label,
  name,
  value,
  options,
  required = false,
  className = '',
  disabled = false,
  onChange,
}: SearchableSelectProps) {
  const {
    isOpen,
    displayValue,
    filteredOptions,
    wrapperRef,
    setIsOpen,
    handleInputChange,
    handleClear,
    handleToggleDropdown,
    handleOptionSelect,
  } = useSearchableSelect({ options, name, value, onChange })

  return (
    <div
      className={`relative mt-2 h-fit w-full ${disabled && 'opacity-40'}`}
      ref={wrapperRef}
    >
      <input
        id={inputId}
        type="text"
        placeholder=" "
        autoComplete="off"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        required={required && !value}
        disabled={disabled}
        className={`peer border-input-border focus:border-primary w-full border bg-transparent p-2.5 focus:outline-none ${className}`}
      />
      <label
        htmlFor={inputId}
        className="bg-background text-text-secondary peer-focus:bg-background peer-focus:text-primary pointer-events-none absolute -top-2.5 left-2 px-1 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs"
      >
        {label}
      </label>

      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-text-secondary hover:text-text-primary p-1 transition-colors outline-none"
            title="Clear selection"
            disabled={disabled}
          >
            <X />
          </button>
        )}

        <button
          type="button"
          onClick={handleToggleDropdown}
          className="text-text-secondary hover:text-text-primary p-1 transition-colors outline-none"
          disabled={disabled}
        >
          <ChevronDown
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <SearchableSelectMenu
        isOpen={isOpen}
        filteredOptions={filteredOptions}
        value={value}
        handleOptionSelect={handleOptionSelect}
      />
    </div>
  )
}
