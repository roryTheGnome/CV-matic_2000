"use client"

import { Check, ChevronDown, X } from "lucide-react"
import { ChangeEvent, useEffect, useRef, useState } from "react"

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
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedNames = value
    ? value
        .split(",")
        .map(v => v.trim())
        .filter(Boolean)
    : []
  const isFilled = selectedNames.length > 0 || isOpen

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const handleToggleMenu = () => {
    if (!isOpen && onFocus) {
      onFocus()
    }
    setIsOpen(prev => !prev)
  }

  const toggleOption = (optionName: string) => {
    let newSelected: string[]

    if (selectedNames.includes(optionName)) {
      newSelected = selectedNames.filter(name => name !== optionName)
    } else {
      newSelected = [...selectedNames, optionName]
    }

    onChange({
      target: { name, value: newSelected.join(", ") },
    } as ChangeEvent<HTMLInputElement>)
  }

  const removeTag = (e: React.MouseEvent, optionName: string) => {
    e.stopPropagation()
    const newSelected = selectedNames.filter(name => name !== optionName)

    onChange({
      target: { name, value: newSelected.join(", ") },
    } as ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="relative w-full mt-2" ref={containerRef}>
      <div
        onClick={handleToggleMenu}
        className={`
          relative w-full min-h-11.5 border bg-transparent p-2.5 pr-10 rounded-sm 
          transition-all flex flex-wrap gap-2 items-center cursor-pointer
          ${isOpen ? "border-primary" : "border-input-border"}
        `}
      >
        <label
          htmlFor={inputId}
          className={`
            absolute left-2 px-1 transition-all pointer-events-none text-text-secondary
            ${isFilled ? "-top-2.5 text-xs bg-background" : "top-2.5 text-base bg-transparent"}
            ${isOpen ? "text-primary" : ""}
          `}
        >
          {label}
        </label>

        {selectedNames.map(name => (
          <span
            key={name}
            className="flex items-center gap-1 bg-text-secondary/35 text-sm px-2.5 py-1 rounded-full text-white"
          >
            {name}
            <button
              type="button"
              onClick={e => removeTag(e, name)}
              className="text-background rounded-full bg-text-secondary p-0.5 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-input-border transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-background border border-input-border rounded-sm shadow-xl z-60 max-h-60 overflow-y-auto py-1">
          {loading ? (
            <div className="px-4 py-3 text-sm text-text-secondary">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-text-secondary">
              No options found
            </div>
          ) : (
            options.map(option => {
              const isSelected = selectedNames.includes(option.name)
              return (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.name)}
                  className={`
                    px-4 py-2 text-sm cursor-pointer flex items-center justify-between
                    hover:bg-text-secondary/35 transition-colors
                    ${isSelected ? "text-primary" : "text-white"}
                  `}
                >
                  {option.name}
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
