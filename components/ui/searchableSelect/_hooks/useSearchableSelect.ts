import { useModalStore } from '@/store/modalStore'
import { useEffect, useRef, useState } from 'react'
import { SelectOption } from '../SearchableSelect'

interface Props {
  value: string
  name: string
  options: SelectOption[]
  onChange: (e: { target: { name: string; value: string } }) => void
}

export const useSearchableSelect = ({
  options,
  name,
  value,
  onChange,
}: Props) => {
  const { setModalData } = useModalStore()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const displayValue = isTyping
    ? inputValue
    : selectedOption
      ? selectedOption.label
      : ''

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsTyping(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = isTyping
    ? options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : options

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsTyping(true)
    setIsOpen(true)

    if (e.target.value === '') {
      onChange({ target: { name, value: '' } })
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTyping(false)
    setInputValue('')
    setIsOpen(false)
    onChange({ target: { name, value: '' } })
    setModalData({ projectId: '' })
  }

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const handleOptionSelect = (option: SelectOption) => {
    setIsTyping(false)
    setInputValue('')
    setIsOpen(false)
    onChange({ target: { name, value: option.value } })
    setModalData({ projectId: option?.value })
  }

  return {
    isOpen,
    displayValue,
    filteredOptions,
    wrapperRef,
    setIsOpen,
    handleInputChange,
    handleClear,
    handleToggleDropdown,
    handleOptionSelect,
  }
}
