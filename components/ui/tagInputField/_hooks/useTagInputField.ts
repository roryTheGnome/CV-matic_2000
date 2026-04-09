import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

interface Props {
  value: string
  name: string
  onChange: (e: { target: { name: string; value: string } }) => void
}

export const useTagInputField = ({ value, name, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedNames = value
    ? value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    : []

  const isFilled =
    selectedNames.length > 0 || isFocused || inputValue.length > 0

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmedValue = inputValue.trim()

      if (trimmedValue && !selectedNames.includes(trimmedValue)) {
        const newSelected = [...selectedNames, trimmedValue]
        onChange({ target: { name, value: newSelected.join(', ') } })
      }
      setInputValue('')
    } else if (
      e.key === 'Backspace' &&
      inputValue === '' &&
      selectedNames.length > 0
    ) {
      e.preventDefault()
      const newSelected = [...selectedNames]
      newSelected.pop()
      onChange({ target: { name, value: newSelected.join(', ') } })
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newSelected = selectedNames.filter(
      (tagName) => tagName !== tagToRemove,
    )
    onChange({ target: { name, value: newSelected.join(', ') } })
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return {
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
  }
}
