'use client'

import { X } from 'lucide-react'
import { ChangeEvent } from 'react'
import { useTagInputField } from './_hooks/useTagInputField'

interface Props {
  label: string
  inputId: string
  name: string
  value: string
  disabled?: boolean
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => void
}

export function TagInputField({
  label,
  inputId,
  name,
  value,
  disabled,
  onChange,
}: Props) {
  const {
    inputValue,
    isFocused,
    isFilled,
    selectedNames,
    inputRef,
    setIsFocused,
    handleInputChange,
    handleKeyDown,
    removeTag,
    focusInput,
  } = useTagInputField({ value, name, onChange })

  return (
    <div
      className={`relative mt-2 w-full transition-opacity ${disabled ? 'pointer-events-none opacity-40' : ''}`}
      onClick={focusInput}
    >
      <div
        className={`relative flex min-h-11.5 w-full cursor-text flex-wrap items-center gap-2 rounded-sm border bg-transparent p-2.5 transition-all ${
          isFocused ? 'border-primary' : 'border-input-border'
        }`}
      >
        <label
          htmlFor={inputId}
          className={`text-text-secondary pointer-events-none absolute left-2 px-1 transition-all ${
            isFilled
              ? 'bg-background -top-2.5 text-xs'
              : 'top-2.5 bg-transparent text-base'
          } ${isFocused ? 'text-primary' : ''} `}
        >
          {label}
        </label>

        {/* Отрендеренные теги (Responsibilities) */}
        {selectedNames.map((tagName) => (
          <span
            key={tagName}
            className="bg-text-secondary/35 flex items-center gap-1 rounded-full px-2.5 py-1 text-sm text-white"
          >
            {tagName}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation() // Чтобы клик не сфокусировал инпут снова
                removeTag(tagName)
              }}
              className="text-background bg-text-secondary hover:bg-text-primary cursor-pointer rounded-full p-0.5 transition-colors outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Скрытый инпут для ввода текста */}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoComplete="off"
          className="text-text-primary min-w-[120px] flex-grow bg-transparent outline-none"
        />
      </div>

      {/* Небольшая подсказка для пользователя (опционально) */}
      {!disabled && (
        <p className="text-text-secondary absolute -bottom-5 left-0 text-[10px]">
          Press <strong>Enter</strong> to add
        </p>
      )}
    </div>
  )
}
