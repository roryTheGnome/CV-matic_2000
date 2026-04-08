import { PRIVATE_ROUTES } from '@/config/routes'
import { ModalData, ModalType, useModalStore } from '@/store/modalStore'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const useActionMenu = (
  deleteType: ModalType,
  editType: ModalType,
  item: ModalData,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { openModal } = useModalStore()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleEdit = () => {
    openModal(editType, item)
    setIsOpen(false)
  }

  const handleCvDetails = (cvId: string) => {
    router.push(PRIVATE_ROUTES.CVS + `/${cvId}`)
  }

  const handleDelete = () => {
    openModal(deleteType, item)
    setIsOpen(false)
  }

  return {
    menuRef,
    isOpen,
    setIsOpen,
    handleEdit,
    handleDelete,
    handleCvDetails,
  }
}
