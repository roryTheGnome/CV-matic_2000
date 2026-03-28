import { ModalData, ModalType, useModalStore } from "@/store/modalStore"
import { useEffect, useRef, useState } from "react"

export const useAdminActionMenu = (
  deleteType: ModalType,
  createType: ModalType,
  item: ModalData,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { openModal } = useModalStore()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleEdit = () => {
    openModal(createType, item)
    setIsOpen(false)
  }

  const handleDelete = () => {
    openModal(deleteType, item)
    setIsOpen(false)
  }

  return { menuRef, isOpen, setIsOpen, handleEdit, handleDelete }
}
