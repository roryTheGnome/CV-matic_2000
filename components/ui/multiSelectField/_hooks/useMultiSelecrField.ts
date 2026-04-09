import { useModalStore } from '@/store/modalStore'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  name: string
  onFocus?: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const useMultiSelectField = ({
  value,
  name,
  onFocus,
  onChange,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { type } = useModalStore()

  const selectedNames = value
    ? value
        .split(',')
        .map((v) => v.trim())
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
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleToggleMenu = () => {
    if (!isOpen && onFocus) {
      onFocus()
    }
    setIsOpen((prev) => !prev)
  }

  const toggleOption = (optionName: string) => {
    let newSelected: string[]

    if (selectedNames.includes(optionName)) {
      newSelected = selectedNames.filter((name) => name !== optionName)
    } else {
      newSelected = [...selectedNames, optionName]
    }

    onChange({
      target: { name, value: newSelected.join(', ') },
    } as ChangeEvent<HTMLInputElement>)
  }

  const removeTag = (e: React.MouseEvent, optionName: string) => {
    e.stopPropagation()
    const newSelected = selectedNames.filter((name) => name !== optionName)

    onChange({
      target: { name, value: newSelected.join(', ') },
    } as ChangeEvent<HTMLInputElement>)
  }

  const disabled = type === 'CV_PROJECT_EDIT' || type === 'CV_PROJECT_ADD'

  return {
    containerRef,
    isOpen,
    isFilled,
    selectedNames,
    disabled,
    handleToggleMenu,
    removeTag,
    toggleOption,
  }
}
